require('dotenv').config()
const bodyParser = require('body-parser')


// app.use(express.json());

const express = require("express");
const cors = require('cors');
const morgan = require('morgan');


const fetchTrainPositions = require('./models/trains.js')
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');
const hello = require('./routes/hello');
const app = express()
const httpServer = require("http").createServer(app);
const db =  require('./db/database.js');
const databas = db.openDb()

const currentDatabaseName = databas.databaseName;

console.log(currentDatabaseName);

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 1337;

app.use(cors());

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

//MIDDLEWARE-CORS OCH LOGGNING
// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
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
app.use("/codes", codes);
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


const server = app.listen(port, ()=> {
  console.log("auth api listening on port ", port)
});

module.exports = server;
