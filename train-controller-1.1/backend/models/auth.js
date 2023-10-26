const database = require("../db/database.js");
const hat = require("hat");
const validator = require("email-validator");

const bcrypt = require('bcryptjs');
const saltRounds = 10; // Antal hashningsrundor (kan justeras)
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

//const api_key =  process.env.TRAFIKVERKET_API_KEY;
const api_key = hat();//Genererar en slumpmässig api nyckel, den ska inte vara statisk

/* const db = await database.openDb();
const user = await db.collection.findOne({ email: "test@test.com" });

const newPassword = 'nyttLosenord';
const hash = 'test';

bcrypt.hash(newPassword, saltRounds, async (err, hash) => {
    if (err) {
        console.error('Fel vid hashning av lösenord:', err);
    } else {
        user.password = hash;
        await user.save();
        console.log('Användarens lösenord har uppdaterats');
    }
});

bcrypt.compare(newPassword, hash, function(err, res) {
    console.log(res)
}); */


const auth = {
    checkAPIKey: function (req, res, next) {
        if ( req.path == '/') {
            return next();
        }

        if ( req.path == '/login') {
            return next();
        }

        if ( req.path == '/api_key/confirmation') {
            return next();
        }

        if ( req.path == '/api_key/deregister') {
            return next();
        }

        auth.isValidAPIKey(req.query.api_key || req.body.api_key, next, req.path, res);
    },

    isValidAPIKey: async function(apiKey, next, path, res) {
        try {
            const db = await database.openDb();

            const filter = { key: apiKey };
            console.log(apiKey)

            const keyObject = await db.users.findOne(filter);

            if (keyObject) {
                await db.client.close();

                return next();
            }

            return res.status(401).json({
                errors: {
                    status: 401,
                    source: path,
                    title: "Valid API key",
                    detail: "No valid API key provided."
                }
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: path,
                    title: "Database error",
                    detail: e.message
                }
            });
        }
    }, getUser: async function (req, res) {
        try {
            const { users } = await database.openDb();
            const allUsers = await users
                .find({})
                .toArray();

            return res.json({
                data: allUsers
            });
        } catch (error) {
            // Hantera eventuella fel här
            console.error('Fel vid hämtning av användare:', error);
            return res.status(500).json({ error: 'Ett fel uppstod vid hämtning av användare.' });
        }
    },
    deregister: async function(res, body) {
        const email = body.email;
        const apiKey = api_key;
        

        try {
            const db = await database.openDb();

            const filter = { key: apiKey, email: email };

            const keyObject = await db.collection.findOne(filter);

            if (keyObject) {
                return await auth.deleteData(res, apiKey, email, db);
            } else {
                let data = {
                    message: "The E-mail and API-key combination does not exist.",
                    email: email,
                    apikey: apiKey
                };

                await db.client.close();

                return res.render("api_key/deregister", data);
            }
        } catch (e) {
            let data = {
                message: "Database error: " + e.message,
                email: email,
                apikey: apiKey
            };

            return res.render("api_key/deregister", data);
        }
    },

    deleteData: async function(res, apiKey, email, db) {
        try {
            const filter = { key: apiKey, email: email };

            await db.collection.deleteOne(filter);

            let data = {
                message: "All data has been deleted",
                email: "",
            };

            return res.render("api_key/form", data);
        } catch (e) {
            let data = {
                message: "Could not delete data due to: " + e.message,
                email: email,
                apikey: apiKey
            };

            return res.render("api_key/deregister", data);
        } finally {
            await db.client.close();
        }
    },
    login: async function (res, body) {
        console.log("HEJ I LOGIN FUNKTIONEN")
        const email = body.email;
        const password = body.password;
        const apiKey = api_key;
    
        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }
    
        let db;
    
        try {
            const { db, users, client } = await database.openDb();
    
            const filter = {
                key: apiKey,
                users: {
                    $elemMatch: {
                        email: email
                    }
                }
            };
    
            const user = await users.findOne(filter);
    
            if (user) {
                auth.comparePasswords(res, password, user.users[0]);
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            if (db) {
                await db.client.close();
            }
        }
    },
    
    comparePasswords: async function (res, password, user) {
        try {
            const result = await bcrypt.compare(password, user.password);
    
            if (result) {
                const payload = { api_key: user.apiKey, email: user.email };
                const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    
                return res.json({
                    data: {
                        type: "success",
                        message: "User logged in",
                        user: payload,
                        token: jwtToken
                    }
                });
            } else {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "Wrong password",
                        detail: "Password is incorrect."
                    }
                });
            }
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "bcrypt error",
                    detail: "bcrypt error"
                }
            });
        }
    },
    checkToken: function(req, res, next) {
        let token = req.headers['x-access-token'];
        let apiKey = req.query.api_key || req.body.api_key;

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.api_key = apiKey;
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

module.exports = auth;