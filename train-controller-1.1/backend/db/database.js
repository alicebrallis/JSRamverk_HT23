const mongo = require("mongodb").MongoClient;
const collectionName = "tickets"; //ändrade från keys till tickets
const collectionNameUsers = "users"; //ändrade från keys till tickets


const database = {
    // openDb funktion som används för att öppna en anslutning till databasen
    openDb: async function openDb() {
        // Skapa DSN, använder en anslutningssträng som har ett användarnamn och lösenord för
        // en fjärr MongoDB-databas som finns på Atlas
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ywmqh1p.mongodb.net/?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }
        //Ansluter till MongoDB-databasen mha DSN
        const client  = await mongo.connect(dsn)//, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        //});
        const db = await client.db();
        const collection = await db.collection(collectionName);//Här hämtar vi från collection tickets
        const users = await db.collection(collectionNameUsers); //Här hämtar vi från collection users

        return {
            db: db,
            collection: collection,
            users: users,
            client: client,
        };
        
    }
    
}

module.exports = database;