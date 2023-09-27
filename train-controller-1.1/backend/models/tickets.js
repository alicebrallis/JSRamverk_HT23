const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
<<<<<<< HEAD
        var db = await database.openDb();

        var allTickets = await db.all(`SELECT *, ROWID as id FROM tickets ORDER BY ROWID DESC`);

        await db.close();

        return res.json({
            data: allTickets
        });
    },

=======
        try {
            const { collection } = await database.openDb();



            // Hämta alla dokument från "tickets" collection
            const allTickets = await collection.find({}).toArray();
            console.log(allTickets, "allTickets")

            if (allTickets.length === 0) {
                console.log('Inga biljetter hittades i "tickets" collection.');
            } else {
                console.log(`Hittade ${allTickets.length} biljetter i "tickets" collection.`);
            }
            
            return res.json({
                data: allTickets
            });
        } catch (error) {
            // Hantera eventuella fel här
            console.error('Fel vid hämtning av biljetter:', error);
            return res.status(500).json({ error: 'Ett fel uppstod vid hämtning av biljetter.' });
        }
    },
>>>>>>> 3d56e3b (.)
    createTicket: async function createTicket(req, res){
        var db = await database.openDb();

        const result = await db.run(
            'INSERT INTO tickets (code, trainnumber, traindate) VALUES (?, ?, ?)',
            req.body.code,
            req.body.trainnumber,
            req.body.traindate,
        );

        await db.close();

        return res.json({
            data: {
                id: result.lastID,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
