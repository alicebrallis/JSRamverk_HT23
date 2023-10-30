/* eslint-disable no-undef */
const database = require("../db/database.js");
//const hat = require('hat');
//const api_key = hat();//Genererar en slumpmässig api nyckel, den ska inte vara statisk

const crypto = require("crypto");

// Funktion för att generera en slumpmässig API-nyckel
function generateApiKey() {
    return crypto.randomBytes(32).toString("hex");
}
const api_key = generateApiKey();

const auth = {
    getUser: async function (req, res) {
        try {
            const { users } = await database.openDb();
            const allUsers = await users
                .find({})
                .toArray();

            //console.log(allUsers, "vad ör detta")

            if (res) {
                return res.json({
                    data: allUsers
                });
            } else {
                console.error('Svarsobjekt (res) är ej definierat.');
            }
        } catch (error) {
            // Hantera eventuella fel här
            console.error('Fel vid hämtning av användare:', error);

            if (res) {
                return res.status(500).json({ error: 'Ett fel uppstod vid hämtning av användare.' });
            } else {
                console.error('Svarsobjekt (res) är ej definierat.');
            }
        }
    },
    login: async function (res, body) {
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
            const { users } = await database.openDb();
    
            const filter = {
                key: apiKey,
                users: {
                    $elemMatch: {
                        email: email
                    }
                }
            };
    
            const user = await users.findOne(filter);
    
            if (!user) {
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
    
    // comparePasswords: async function (res, password, user) {
    //     try {
    //         const result = await bcrypt.compare(password, user.password);
    
    //         if (result) {
    //             const payload = { api_key: user.apiKey, email: user.email };
    //             const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
    
    //             return res.json({
    //                 data: {
    //                     type: "success",
    //                     message: "User logged in",
    //                     user: payload,
    //                     token: jwtToken
    //                 }
    //             });
    //         } else {
    //             return res.status(401).json({
    //                 errors: {
    //                     status: 401,
    //                     source: "/login",
    //                     title: "Wrong password",
    //                     detail: "Password is incorrect."
    //                 }
    //             });
    //         }
    //     } catch (error) {
    //         return res.status(500).json({
    //             errors: {
    //                 status: 500,
    //                 source: "/login",
    //                 title: "bcrypt error",
    //                 detail: "bcrypt error"
    //             }
    //         });
    //     }
    // },
/*     checkToken: function(req, res, next) {
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
}; */
}

module.exports = auth;