const loki = require('lokijs');  // for data persistency

// Create in-memory database with lokijs (entries are saved on local file, for simplicity)
var db = new loki('buildingHeights.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});

// initialize database with an example of entry, if empty from before
function databaseInitialize() {
    var entries = db.getCollection("buildingHeights");
    if (entries === null) {
        entries = db.addCollection("buildingHeights");

        entries.insert(
            {
                building_limits: {
                    "type": "Polygon",
                    "coordinates": [
                        [ [ 2.0, 2.0 ], [ 5.0, 2.0 ], [ 5.0, 5.0 ], [ 2.0, 5.0 ], [ 2.0, 2.0 ] ],
                        [ [ 5.0, 5.0 ], [ 8.0, 5.0 ], [ 8.0, 8.0 ], [ 5.0, 8.0 ], [ 5.0, 5.0 ] ]
                    ]
                },
                height_plateaus: {
                    "type": "Polygon",
                    "coordinates": [
                            [ [ 0.0, 0.0 ], [ 50.0, 0.0 ], [ 50.0, 50.0 ], [ 0.0, 50.0 ], [ 0.0, 0.0 ] ],
                            [ [ 50.0, 50.0 ], [ 100.0, 50.0 ], [ 100.0, 100.0 ], [ 50.0, 100.0 ], [ 50.0, 50.0 ] ]
                    ],
                    "heights": [ 25.0, 75 ]
                },
                building_with_plateaus: {
                    "type": "Polygon",
                    "coordinates": [
                        [ [ 2.0, 2.0 ], [ 5.0, 2.0 ], [ 5.0, 5.0 ], [ 2.0, 5.0 ], [ 2.0, 2.0 ] ],
                        [ [ 5.0, 5.0 ], [ 8.0, 5.0 ], [ 8.0, 8.0 ], [ 5.0, 8.0 ], [ 5.0, 5.0 ] ]
                    ],
                    "heights": [ 25.0, 25.0 ]
                }
            }
        );

    }
}

module.exports = db;