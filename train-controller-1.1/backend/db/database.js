
//let dsn = "mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ywmqh1p.mongodb.net/?retryWrites=true&w=majority"
//let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.hkfbt.mongodb.net/folinodocs?retryWrites=true&w=majority`;
/* 
const database = {
    openDb: async function openDb() {
        let dbFilename = `./db/trains.sqlite`;

        if (process.env.NODE_ENV === 'test') {
            dbFilename = "./db/test.sqlite";
        }

        return await open({
            filename: dbFilename,
            driver: sqlite3.Database
        });
    }
};

module.exports = database;
 */

const mongo = require("mongodb").MongoClient;
const collectionName = "tickets"; //ändrade från keys till tickets


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
        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;