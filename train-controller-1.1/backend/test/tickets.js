//körde kommandot npm install mocha --save-dev i terminalen för att kunna köra testerna vi kommer att göra här
//körde npm install nyc --save-dev för att kunna köra testerna med kodtäckning inkluderat

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);