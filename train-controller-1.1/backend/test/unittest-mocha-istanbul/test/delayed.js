/* global it describe */
"use strict";

process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../app.js');
const delayed = require('../src/delayed.js')

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

