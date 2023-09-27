<<<<<<< HEAD
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
=======
/* const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite'); */
>>>>>>> 3d56e3b (.)
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
<<<<<<< HEAD
const collectionName = "keys";
=======
const collectionName = "tickets";
>>>>>>> 3d56e3b (.)

const database = {
    openDb: async function openDb() {
        let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@cluster0.ywmqh1p.mongodb.net/?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = "mongodb://localhost:27017/test";
        }

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

<<<<<<< HEAD
module.exports = database;
=======
module.exports = database;
>>>>>>> 3d56e3b (.)
