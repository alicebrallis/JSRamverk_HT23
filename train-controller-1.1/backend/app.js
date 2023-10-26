require('dotenv').config()
const bodyParser = require('body-parser')


const express = require("express");
const cors = require('cors');
const morgan = require('morgan');


const fetchTrainPositions = require('./models/trains.js')
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const trains = require('./routes/trains.js');
const auth = require("./routes/auth.js");
const authModel = require("./models/auth.js");
const database = require("../backend/db/database.js")


const app = express()
const httpServer = require("http").createServer(app);
const db =  require('./db/database.js');

const jwt = require("jsonwebtoken");
const { error } = require('console');
const jwtSecret = process.env.JWT_SECRET;



app.use(express.json()); //Felet uppstod med "undefinied req.body var för att vi hade kommenterat ut denna, om vi vill använda oss av req.body måste vi inkludera denna express.json för att tolka JSON-data i inkommande förfrågningar"
app.options('*', cors());

app.disable('x-powered-by');

app.use(cors()); // Enable CORS for Express routes


const io = require("socket.io")(httpServer, {
    cors: {
      origin: "http://localhost:3000", 
      methods: ["GET", "POST"],
    },
  });

/* io.sockets.on('connection', function(socket) {
    //console.log(socket.id); // Nått lång och slumpat
});

io.emit("message", "Detta är ett meddelande från servern.");
 */

/* io.on('connection', (socket) => {
    console.log(`Klient ansluten: ${socket.id}`);
  
    // Skicka ett meddelande till klienten


    socket.emit('message', fetchTrainPositions(io))
});

 */
  app.use(cors({ origin: 'http://localhost:3000' }));


const port = process.env.PORT || 1337;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

//MIDDLEWARE-CORS OCH LOGGNING
// This is middleware called for all routes.
// Middleware takes three parameters.

app.use((req, res, next) => {
      next(); // Token är giltig, fortsätt till nästa middleware eller rutt
    });

app.get("/", (req, res) => {
    // Define the response for the root URL
    res.json({ message: "Welcome to the server!" });
  });

// Middleware för att verifiera JWT-token
function verifyToken(req, res, next) {
    const token = req.header('x-access-token'); // om tokenen skickas som en header
    console.log(token, "token")
  
    if (!token) {
      return res.status(401).json({ error: 'Åtkomst nekad: Ingen token tillhandahållen' });
    }
  
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Ogiltig token' });
      }
      next(); // Token är giltig, fortsätt till nästa middleware eller rutt
    });
  }
  
// Skyddad sökväg
app.get('/main', verifyToken, (req, res) => {
    res.json({ message: 'Du är inloggad och har åtkomst till /main.' });
});

// Inlogg-routerna (GET och POST)
app.get('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { users } = await database.openDb();
        const user = await users.findOne({ email: email, password: password });

        if (user) {
            res.json({ user: user });
        } else {
            console.log(error)
        }
    } catch (error) {
        console.error('Error while accessing the users collection:', error);
        console.log(error)
    }
});

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
  
    try {
        const { users } = await database.openDb();
        const oneUser = await users.findOne({ email, password });
    
      if (!oneUser) {
        return res.status(401).json({ error: "Ogiltiga inloggningsuppgifter" });
      }
  
      res.json({ message: "Inloggningen lyckades" });
    } catch (error) {
      console.error("Databasfel:", error);
    }
  });

  
  
  

// Add a route - uses send
// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

// Add a route - uses json, which is the objects built in function
// app.get("/", (req, res) => {
//     const data = {
//         data: {
//             msg: "Hello World"
//         }
//     };

//     res.json(data);
// });

//app.use('/hello', hello);
// app.use('/', index);

// Testing routes with method
/* app.get("/user", (req, res) => {
    res.json({
        data: {
            msg: "Got a GET request, sending back default 200"
        }
    });
});

// app.post("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a POST request"
//         }
//     });
// });

app.post("/user", (req, res) => {
    res.status(201).json({
        data: {
            msg: "Got a POST request, sending back 201 Created"
        }
    });
});
 */
// app.put("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a PUT request"
//         }
//     });
// });

/* app.put("/user", (req, res) => {
    // PUT requests should return 204 No Content
    res.status(204).send();
}); */

// app.delete("/user", (req, res) => {
//     res.json({
//         data: {
//             msg: "Got a DELETE request"
//         }
//     });
// });

/* app.delete("/user", (req, res) => {
    // DELETE requests should return 204 No Content
    res.status(204).send();
});

app.get('/', (req, res) => {
  res.json({
      data: 'Hello World!'
  })
}) */

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/tickets", tickets);
app.use("/codes", codes);
app.use("/trains", trains);
app.use("/login", auth);

//app.all('*', authModel.checkAPIKey);

/* app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
 */
// Add routes for 404 and error handling
// Catch 404 and forward to error handler
// Put this last
app.use((req, res, next) => {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
      return next(err);
  }

  res.status(err.status || 500).json({
      "errors": [
          {
              "status": err.status,
              "title":  err.message,
              "detail": err.message
          }
      ]
  });
});



const server = httpServer.listen(port, ()=> {
    console.log("auth api listening on port ", port)
});

fetchTrainPositions(io);

module.exports = server;
