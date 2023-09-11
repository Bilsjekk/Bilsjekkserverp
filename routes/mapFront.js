const express = require('express');
const router = express.Router();
const Map = require('../models/Map');

// Render the list of maps
router.get('/maps', async (req, res) => {
    try {
        const maps = await Map.find().populate('zone'); // If you have a reference to the Zone model
        res.render('maps/read', { maps });
    } catch (err) {
        console.error('Error fetching maps:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render the edit form for a map
router.get('/maps/:id/edit', async (req, res) => {
    try {
        const map = await Map.findById(req.params.id);
        res.render('maps/edit', { map });
    } catch (err) {
        console.error('Error fetching map:', err);
        res.status(500).send('Internal Server Error');
    }
});

// Render the create form for a map
router.get('/maps/new', (req, res) => {
    res.render('maps/create');
});


module.exports = router;
