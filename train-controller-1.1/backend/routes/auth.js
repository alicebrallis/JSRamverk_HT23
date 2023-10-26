const express = require('express');
const router = express.Router();
const auth = require("../models/auth.js");

// GET-routeför inloggning
router.get('/login', async (req, res) => {
    const user = await auth.getUser(req, res);
  
    if (user) {
        res.json({ user });
    } else {
        res.status(401).json({ error: 'Ogiltig autentisering' });
    }
});

// POST-route för inloggning
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await auth.login(res, { email, password });
    console.log(user, "vad är user här");

    if (user) {
        // Inloggningen lyckades
    } else {
        console.log("Inloggning misslyckades");
    }
});

router.get('/main', (req, res) => {
    res.json({ message: 'Välkommen till huvudsidan!' });
});

module.exports = router;
