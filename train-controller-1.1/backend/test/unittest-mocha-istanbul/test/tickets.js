"use strict";

process.env.NODE_ENV = 'test'; // Set the test environment
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

var assert = require("assert");

const tickets = require("../src/tickets.js");
const database = require('../../../db/database.js');

describe('Tickets', function () {
    let testDb;

    before(async function () {
        try {
            this.timeout(5000); 
            testDb = await database.openDb();
        } catch (error) {
            console.error('Error while opening the database:', error);
            throw error;
        }
    });
    
    after(async function () {
        if (testDb) {
            this.timeout(5000); 
            try {
                await testDb.client.close();
                console.log("Database connection closed");
            } catch (error) {
                console.error("Error while closing database connection:", error);
            }
        }
    });
    
/*    
    it('get tickets without error', async function () {

        const req = {};
        const res = {
            json: function (data) {
                console.log(typeof(Object))
                if (data && data.data && typeof data.data === 'object') {
                   
                    assert.strictEqual(Object.keys(data.data).length > 0, true);
                } else {
                    assert.fail('Data is missing or empty');
                }
            },
            status: function (code) {
                return this;
            },
        };
        try {
            // Call the asynchronous function
            await tickets.getTickets(req, res);
        } catch (error) {
            res.status(500).json({ error: 'Ett fel uppstod vid hämtning av biljetter.' });
        }
    }); */

    it('get tickets with error', async function () {
        const res = {
            json: function (data) {
                assert.strictEqual(data.error, 'Ett fel uppstod vid hämtning av biljetter.');
            },
            status: function (code) {
                assert.strictEqual(code, 500);
                return this;
            },
        };
    
        try {
            // Anropa den asynkrona funktionen med rätt kontext (req, res är null)
            await tickets.getTickets(null, res);
        } catch (error) {
            // Du kan använda assert.fail() eller assert.strictEqual() här om det finns ett kastat fel som förväntas.
        }
    
        return Promise.resolve();
    });
    

  it('create ticket successfully', async function () {
        const req = {
            body: {
                code: '123ABC',
                trainnumber: '123',
                traindate: '2023-09-29',
            },
        };

        const res = {
            json: function (data) {
                assert.strictEqual(data.data.code, req.body.code);
                assert.strictEqual(data.data.trainnumber, req.body.trainnumber);
                assert.strictEqual(data.data.traindate, req.body.traindate);
            },
        };

        // Call the asynchronous function
        await tickets.createTicket(req, res);

    });
});
