const loki = require('lokijs');  // for data persistency

// Create in-memory database with lokijs (entries are saved on local file, for simplicity)
var db = new loki('buildingHeights.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});

// initialize database, if empty from before
function databaseInitialize() {
    var entries = db.getCollection("buildingHeights");
    if (entries === null) {
        entries = db.addCollection("buildingHeights");

        entries.insert(
            {
                building_limits: {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [10.0, 10.0],
                            [90.0, 10.0],
                            [90.0, 90.0],
                            [10.0, 90.0],
                            [10.0, 10.0]
                        ]
                    ]
                },
                height_plateaus: {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [0.0, 0.0],
                            [100.0, 0.0],
                            [100.0, 100.0],
                            [0.0, 100.0],
                            [0.0, 0.0]
                        ]
                    ],
                    "height": 50.0
                },
                building_with_plateaus: {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [10.0, 10.0],
                            [90.0, 10.0],
                            [90.0, 90.0],
                            [10.0, 90.0],
                            [10.0, 10.0]
                        ]
                    ],
                    "height": 50.0
                }
            }
        );

    }
}

module.exports = db;