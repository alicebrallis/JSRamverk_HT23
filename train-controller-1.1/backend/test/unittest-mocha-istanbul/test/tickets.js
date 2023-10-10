//körde kommandot npm install mocha --save-dev i terminalen för att kunna köra testerna vi kommer att göra här
//körde npm install nyc --save-dev för att kunna köra testerna med kodtäckning inkluderat

/**
 * Test for tickets.js
 */
"use strict";

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();

chai.use(chaiHttp);

/* global describe it */

// Importera assert-modul, används för att göra påståenden i testfall
var assert = require("assert");

// Importera mongodb
const mongo = require("mongodb").MongoClient;

// Importera koden som jag vill testa
const tickets = require("../src/tickets.js");

// Definiera en testsuite(=grupperar flera testfall) med namn Tickets
describe('Tickets', function () {
    // Definiera ett testfall med namn inom ''
    it('get tickets without error', async function () {

        // Skapa ett tomt objekt som represtenterar en HTTP-förfrågan - req
        const req = {};

        // Skapa ett res med två funktioner: json() och status()
        const res = {
            json: function (data) {
                // Kontrollera om den är längre än 0, dvs innehåller biljetter
                assert.strictEqual(data.data.length > 0, true);
            },
            status: function (code) {
                assert.strictEqual(code, 200);
                return this;
            },
        };

        await tickets.getTickets(req, res);
    });

    // Definiera ett nytt testfall
    it('get tickets with error', async function () {
        const res = {
            json: function (data) {
                assert.strictEqual(data.error, 'Ett fel uppstod vid hämtning av biljetter.' );
            },
            status: function (code) {
                assert.strictEqual(code, 500); 
                return this;
            },
        };

        await tickets.getTickets(null, res);
    });

    it('create ticket successfully', async function () {
        // Skapa HTTP förfrågan
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

        await tickets.createTicket(req, res);
    })
})

/* process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('./app.js');

chai.should();

chai.use(chaiHttp); */

