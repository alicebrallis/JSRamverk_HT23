/* global it describe */
"use strict";

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app.js');
const delayed = require('../src/delayed.js');
const sinon = require('sinon'); // Importera Sinon

const proxyquire = require('proxyquire');



chai.should();

chai.use(chaiHttp);


describe('/GET delayed', () => {
    // Test the GET route 
    it('it should GET all the delayed trains', (done) => {
        chai.request(server)
            .get('/delayed')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                Object.keys(res.body).length.should.be.eql(0);
            done();
            });
        });
    });

    it('should fetch data from a mock API', async () => {
        // Skapa en mock för node-fetch
        const fetchMock = sinon.stub().resolves({
            json: async () => ({
                RESPONSE: {
                    RESULT: [{
                        TrainAnnouncement: 'Your Train Announcement Data'
                    }]
                }
            })
        });

        // Använd proxyquire för att byta ut 'node-fetch' mot vår mock
        const localDelayed = proxyquire('../src/delayed.js', { 'node-fetch': fetchMock });

        // Skapa stubbar för req och res
        const req = {};
        const res = {
            json: (data) => {
                // Förvänta dig att data innehåller rätt information
                expect(data).to.be.an('object');
                expect(data.data).to.deep.equal('Your Train Announcement Data');
            }
        };

        // Anropa din funktion
        await localDelayed.getDelayedTrains(req, res);
    });