const Joi = require('joi');  // For input validation
const express = require('express');
const router = express.Router();
router.use(express.json());

const db = require('./database.js');

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

    try {
        const schema = Joi.object({
            building_limits: { type: Joi.string().required(), coordinates: Joi.any() },
            height_plateaus: { type: Joi.string().required(), coordinates: Joi.any(), height: Joi.number().required() }
        })
        const validationResult = schema.validate(req.body);
        if (!validationResult) {
            res.status(400).send(validationResult.error.details[0].message);
            return;
        }
    } catch (error) {
        res.status(400).send(error.message);
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