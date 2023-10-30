const database = require("../../../db/database.js");
//const validator = require("email-validator");
//const bcrypt = require('bcryptjs');
//const saltRounds = 10; // Antal hashningsrundor (kan justeras)
//const jwt = require('jsonwebtoken');
//const jwtSecret = process.env.JWT_SECRET;
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
}

module.exports = auth;