const database = require('../db/database.js');
//const ticket_router = require('../routes/tickets.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        try {
            const { collection } = await database.openDb();

        //     // Hämta alla dokument från "tickets" collection
            const allTickets = await collection
            .find({})
            .sort({ ROWID: -1 }) // Sortera efter ROWID i fallande ordning
            .toArray();

            //console.log(allTickets, "allTickets")

        /*if (allTickets.length === 0) {
                console.log('Inga biljetter hittades i "tickets" collection.');
            } else {
                console.log(`Hittade ${allTickets.length} biljetter i "tickets" collection.`);
            } */

        //await database.closeDb()

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
        //console.log(res.body)
        const { collection } = await database.openDb();

        const result = await collection.insertOne({
            //id_: req.body._id,
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        });

        //await database.closeDb()
        console.log(result, "result")

        return res.json({
            data: {
                //id: result._id,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
