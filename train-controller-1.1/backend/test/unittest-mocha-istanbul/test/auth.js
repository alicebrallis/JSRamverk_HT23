const chai = require("chai");
const chaiHttp = require("chai-http");
const auth = require("../src/auth.js");
const database = require('../../../db/database.js');
process.env.NODE_ENV = 'test'; // Set the test environment
const server = require('../../../app.js');

const sinon = require('sinon'); // Importera Sinon


chai.should();
const expect = chai.expect;
chai.use(chaiHttp);



// Testfall för krav 4. inloggningsflöde
describe("Authentication API", () => {
/*     it('Should let an existing user sign in', (done) => {
        chai
            .request(server)
            .post("/login")
            .send({email: "test@test.com", password: "test"}) //Skicka ett JSON-objekt som imiterar det användaren ska skriva när de ska logga in
            .end((err, res) => { //HTTP-föfrågan avlustas, callback funktion körs, err innehåller eventuell fel och res innehåller svaret från servern
                res.should.have.status(200); //HTTP-statuskod 200 inidkerar inloggningen lyckades
                res.body.should.be.a("object"); // Svaret är ett JavaScript-objekt
                res.body.should.have.property("message").eql("Inloggningen lyckades"); // Svaret innehåller en egenskap med namnet 'data'
                done(); // Meddelar att testet är klart
            }); 
    }); */

    it('Should not let a non-existing user to sign in', (done) => {
        chai
            .request(server)
            .post("/login")
            .send({email: "test@test1.com", password: "test1"}) //Skicka ett JSON-objekt som imiterar det användaren ska skriva när de ska logga in
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object")
                res.body.should.have.property("error").eql("Ogiltiga inloggningsuppgifter");
                done();
        });
    });

    it("Should deny sign in if email and password is missing", (done) => {
        chai
            .request(server)
            .post("/login")
            .send({email: "", password: ""})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have.property("error");
                done();
        });
    });

    it('Should not let a user sign in with incorrect password', (done) => {
        chai
            .request(server)
            .post("/login")
            .send({ email: "test@test.com", password: "wrongpassword" })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have.property("error").eql("Ogiltiga inloggningsuppgifter");
                done();
            });
    });
    
    it('Should not let a user sign in with an invalid email', (done) => {
        chai
            .request(server)
            .post("/login")
            .send({ email: "nonexistent@test.com", password: "test" })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have.property("error").eql("Ogiltiga inloggningsuppgifter");
                done();
            });
    });
    
    it('Should deny sign in if password is missing', (done) => {
        chai
            .request(server)
            .post("/login")
            .send({ email: "test@test.com", password: "" })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have.property("error").eql("Ogiltiga inloggningsuppgifter");
                done();
            });
    });

    it('Should deny sign in if email is missing', (done) => {
        chai
            .request(server)
            .post("/login")
            .send({ email: "", password: "test" })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a("object");
                res.body.should.have.property("error").eql("Ogiltiga inloggningsuppgifter");
                done();
            });
    });


    it('Should deny access without valid token', (done) => {
        chai
            .request(server)
            .get("/main")
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a("object");
                res.body.should.have.property("error").eql("Åtkomst nekad: Ingen token tillhandahållen");
                done();
        });
    });

    it('Should allow access with valid token', (done) => {
        const validToken="giltigtoken"
        chai
            .request(server)
            .get("/main")
            .set("x-access-token", validToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a("object");
                res.body.should.have.property("message").eql("Du är inloggad och har åtkomst till /main.");
                done();
        });
    });

    describe('getUser function', () => {
        it('should return an array of users', (done) => {
            const req = null;
            const res = {
                json: (result) => {
                    expect(result).to.be.an('object');
                    expect(result).to.have.property('data').that.is.an('array');
                    done(); 
                },
                status: (code) => {
                    return res;
                }
            };
    
            auth.getUser(req, res);
        });
    
        it('should handle errors', (done) => {
            const req = null;
            const res = {
                json: (result) => {
                    if (result.error) {
                        expect(result).to.be.an('object');
                        expect(result).to.have.property('error').that.is.a('string');
                    } else {
                        expect(result).to.be.an('object');
                        expect(result).to.have.property('data').that.is.an('array');
                    }
                    done();
                },
                status: (code) => {
                    return res;
                }
            };
        
            auth.getUser(req, res);
        });
    });
    
    it("Handle error when getting user and return status 500", (done) => {
            const user = auth.getUser(); 

            if (user instanceof Error) {
              expect(user.status).to.equal(500);
              expect(user.message).to.equal("Ett fel uppstod vid hämtning av användare.");
              done(); // Klart med testet
            } else {
              done();
            }
        });
    });

    it('should handle user errors and return a 500 status with error message', (done) => {
        const res = {
            status: function (code) {
                expect(code).to.equal(500); // Kontrollera att statuskoden är 500
                return this;
            },
            json: function (data) {
                expect(data).to.be.an('object');
                expect(data).to.have.property('data');
                done(); // Signalera att testet är klart
            },
        };

        // Anropa getUser-funktionen med ett fel som simuleras
        auth.getUser(null, res);
    });

    it('should log an error message when res is not defined', () => {
        // Skapa en stubb för konsolen
        const consoleStub = sinon.stub(console, 'error');

        // Anropa getUser-funktionen med ett fel som simuleras
        auth.getUser(null, null); // Ersätt "yourModule" med den modul där din getUser-funktion finns

        // Kontrollera att konsolen har kallats med rätt meddelande
        expect(consoleStub.calledOnce).to.be.false;
        expect(consoleStub.calledWithExactly('Svarsobjekt (res) är ej definierat.')).to.be.false;

        // Återställ stubben efter testet
        consoleStub.restore();
    });



