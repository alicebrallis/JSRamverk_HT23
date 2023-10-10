const express = require('express');
const router = express.Router();

const fetchTrainPositions = require("../models/trains.js");

// Define a route to fetch train positions (GET request)
router.get('/', (req, res) => {
    // Call fetchTrainPositions with the io object here if needed
    // Example: fetchTrainPositions(req.app.get('io'));
    res.status(200).json({ message: 'Fetch train positions endpoint' });
});

// Define a separate route to trigger the fetchTrainPositions function (POST request)
router.post('/trigger-fetch', (req, res) => {
    // Call fetchTrainPositions with the io object here if needed
    // Example: fetchTrainPositions(req.app.get('io'));
    res.status(200).json({ message: 'Fetch train positions triggered' });
});

module.exports = router;
