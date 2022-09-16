const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('./database.js');
const inputValidation = require('./inputValidation.js');

router.get('/building-heights', (req, res) => {
    try {
        const collection = db.getCollection('buildingHeights');
        const entries = collection.chain().data();
        res.send(entries);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/building-heights/:id', (req, res) => {
    try {
        const collection = db.getCollection('buildingHeights');
        const item = collection.chain().find({'$loki': parseInt(req.params.id)}).data();

        collection.remove(item);
        res.send(item);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/building-heights', (req, res) => {

    const validationError = inputValidation(req.body);
    if ( validationError != null) {
        res.status(400).send(validationError);
        return;
    }

    const buildingArea = {
        building_limits: req.body.building_limits,
        height_plateaus: req.body.height_plateaus,
        building_with_plateaus: { type: "Polygon", coordinates: req.body.building_limits.coordinates, height: req.body.height_plateaus.height }
    }

    const collection = db.getCollection('buildingHeights');
    collection.insert(buildingArea);

    // success!
    res.sendStatus(200);
});

module.exports = router;