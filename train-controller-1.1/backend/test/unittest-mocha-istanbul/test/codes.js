/* global it describe */
"use strict";

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app.js');
const codes = require('../src/codes.js')

chai.should();

chai.use(chaiHttp);


describe('/GET codes', () => {
    // Test the GET route 
    it('it should GET all the codes', (done) => {
        chai.request(server)
            .get('/codes')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                Object.keys(res.body).length.should.be.eql(0);
            done();
            });
        });
    });

    it('should handle errors gracefully', async () => {
        const req = {}; // Skapa en enkel request-objekt
        const res = {
            json: (data) => {
                expect(data).to.be.an('object');
                expect(data).to.have.property('error');
                expect(data.error).to.be.a('string');
                // Lägg till fler förväntningar beroende på hur din funktion ska hantera fel
            },
            status: (code) => {
                expect(code).to.equal(500); // Förvänta dig en HTTP 500-status för fel
                return res; // Returnera sig själv för att kedja anropet (chainable)
            }
        };
    
        // Anropa din funktion och skicka in de enkla req och res objekten
        await codes.getCodes(req, res);
    });
    

