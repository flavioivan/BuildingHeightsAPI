const GeoJSON = require('geojson');

var pointInPolygon = require('point-in-polygon');

const whichPolygon = require('which-polygon');  // which geojson polygon does this point/boundingBox belong to'

const PolygonLookup = require('polygon-lookup');  // builds R-tree to search for polygon intersection in large set of polygons

// const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');  // given a polygon, get all polygons in GeoJson that contains it


const createPolygonCollection = (inputPolygons) => {

    // Create individual polygon GeoJSON objects, one for each polygon in the inputPolygons 
    var polygons = [];
    for (var i = 0; i < inputPolygons.coordinates.length; i++) {
        var feature = { 'polygon': inputPolygons.coordinates[i] };

        var parsedPolygon = GeoJSON.parse(feature, { Polygon: 'polygon' });

        polygons.push(parsedPolygon);
    }

    // Prepare feature collection (polygon collection) that can later be accepted by the e.g. which-polygon package
    var polygonsCollection = { 'type': "FeatureCollection", 'features': polygons };

    return polygonsCollection
}


const processPolygons = (buildingLimits, heightPlateaus) => {

    const buildingLimitsCollection = createPolygonCollection(buildingLimits);
    const heightPlateausCollection = createPolygonCollection(heightPlateaus);

    // Creates which-polygon query object
    var query = whichPolygon(heightPlateausCollection); // Note: somehow, it is not returning expected results, neither for whole polygon not for points

    // Creates polygon-lookup search object
    var lookup = new PolygonLookup(heightPlateausCollection); // Note: this one is also returning empty results, where it was expected to return a polygon

    //console.log(lookup);
    //var results = query.bbox(buildingLimitsCollection, true).admin;

    for (var i = 0; i < buildingLimits.coordinates.length; i++) {

        var points = buildingLimits.coordinates[i];

        for (var j = 0; j < points.length; j++) {

            //var result = query(points[j]);
            var result = lookup.search(points[j][0], points[j][1], -1);

            console.log(result, "\n");
        }
    }

    // not finished..
    return null;
};


const simpleProcessing = (buildingLimits, heightPlateaus) => {

    var coordinates = [];
    var heights = [];

    // for each plateau polygon
    for (var p = 0; p < heightPlateaus.coordinates.length; p++) {

        var plateau = [heightPlateaus.coordinates[p], heightPlateaus.heights[p]];

        // for each building limits polygon
        for (var i = 0; i < buildingLimits.coordinates.length; i++) {

            var points = buildingLimits.coordinates[i];
            var belongsTo = true;

            for (var j = 0; j < points.length; j++) {

                var result = pointInPolygon(points[j], plateau[0]);
                if (belongsTo && !result) {
                    belongsTo = result;
                }
            }

            // all points in the current building limit polygon are inside a plateau
            if (belongsTo) {
                coordinates.push(buildingLimits.coordinates[i]);
                heights.push(plateau[1]);

                console.log(coordinates, heights, "\n\n");
            }

        }
    }

    const output = {
        building_limits: buildingLimits,
        height_plateaus: heightPlateaus,
        building_with_plateaus: { type: "Polygon", coordinates: coordinates, heights: heights }
    }

    return output;
};

module.exports = { simpleProcessing, processPolygons };
