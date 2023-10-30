const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        try {
            const { collection } = await database.openDb();

            // Hämta alla dokument från "tickets" collection
            const allTickets = await collection
            .find({})
            .sort({ ROWID: -1 }) // Sortera efter ROWID i fallande ordning
            .toArray();

        return res.json({
                data: allTickets
            });
        } catch (error) {
            // Hantera eventuella fel här
            console.error('Fel vid hämtning av biljetter:', error);
            return res.status(500).json({ error: 'Ett fel uppstod vid hämtning av biljetter.' });
        }
    },
    createTicket: async function createTicket(req, res){
        const { collection } = await database.openDb();

        const result = await collection.insertOne({
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        });

        // Använd insertedId för att få det unika _id som genererats av MongoDB
        const insertedData = {
            _id: result.insertedId.toString(), // Använd insertedId för att få det unika _id
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate,
        };

        return res.json({
            data: insertedData
        });
        }
};

module.exports = tickets;
