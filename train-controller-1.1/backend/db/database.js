
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

        if (process.env.NODE_ENV === 'test') { //Kommenterade ut denna helt, så att den använder vår collection tickets och vår dsn. 
            dsn = "mongodb://localhost:27017/test";
        }
        //Ansluter till MongoDB-databasen mha DSN
        const client  = await mongo.connect(dsn)//, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
        //});
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    },
    
/*     resetCollection: async function resetCollection() {
        const { db, client, collection } = await database.openDb();
        
        try {
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map(col => col.name);
            
            if (collectionNames.includes(collectionName)) {
                await collection.deleteMany({});
                console.log(`Collection '${collectionName}' reset successfully.`);
            } else {
                console.log(`Collection '${collectionName}' does not exist.`);
            }
        } catch (error) {
            console.error(`Error resetting collection '${collectionName}': ${error}`);
        } finally {
            await client.close();
        }
    } */
    
}

module.exports = database;