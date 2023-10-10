const express = require('express');
const router = express.Router();

const tickets = require("../models/tickets.js");

router.get('/', (req, res) => tickets.getTickets(req, res));

router.post('/', (req, res) => {
    console.log(req.body, "req");
    //console.log(res, "res"); 

    tickets.createTicket(req, res); // Anropa din createTicket-funktion
    
});


// router.post('/', (req, res) => {
//     console.log(res); 
//     tickets.createTicket(req, res); 
// });

module.exports = router;
