const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('./database.js');
const inputValidation = require('./inputValidation.js');
const processPolygons = require('./processPolygons.js');

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

    const buildingLimits = req.body.building_limits;
    const heightPlateaus = req.body.height_plateaus;

    //processPolygons.processPolygons(buildingLimits, heightPlateaus);
    const processed = processPolygons.simpleProcessing(buildingLimits, heightPlateaus);

    const collection = db.getCollection('buildingHeights');
    collection.insert(processed);

    // success!
    res.sendStatus(200);
});

module.exports = router;