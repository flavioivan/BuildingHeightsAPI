# Building Heights API

### _Programmatic API aiming at splitting building limits into different plateau heights_

The API in this project aims at dealing with _Building limits_ and _Height plateaus_. These are basically different polygons representing closed areas that can be built upon in a terrain, and the different heights of this same terrain. Although not entirely finished, the goal of this API is to split the building limits polygons into different polygons, with respective heights, according to the the heights for the different plateus in the terrain.

The API in this project was developed using __Node.JS__, __Express__, __Joi__ (for input validation), __lokijs__ for persistence, and __geojson-utils__ for working with __GeoJSON__ object types.

## API Documentation

GET [`/api/building-heights`](http://localhost:3400/api/building-heights) (get all building limits, split by plateau heights)

POST [`/api/building-heights/`](http://localhost:3400/api/building-heights) (expects _"building_limits"_ and a _"height_plateaus"_ __<GeoJSON>__ objects as inputs, and adds processed building limits into local database)

DELETE [`/api/building-heights/:id](http://localhost:3400/api/building-heights/:10) (removeds the processed building limits whose __id__ is sent as parameter, if any)

The current implementation runs some still limited input validation on POST. The logic to split building limits into different polygons is not completely implemented yet.

## Development

Provided that Node.JS, Express, Joi, and lokijs are locally installed, run the application from the local folder by executing the following command (the application is listenning on port __3400__):

```
node .\index.js
```

## Testing

The API has been tested mostly with Postman.

For example, testing the POST routing can be done as by the image below:

In this case, the parameter sent was:

```
{
    "building_limits": {
        "type": "Polygon",
        "coordinates": [
            [
                [ 2.0, 2.0 ],
                [ 8.0, 2.0 ],
                [ 8.0, 8.0 ],
                [ 2.0, 8.0 ],
                [ 2.0, 2.0 ]
            ]
        ]
    },
    "height_plateaus": {
        "type": "Polygon",
        "coordinates": [
            [
                [ 0.0, 0.0 ],
                [ 100.0, 0.0 ],
                [ 100.0, 100.0 ],
                [ 0.0, 100.0 ],
                [ 0.0, 0.0 ]
            ]
        ],
        "height": 50.0
    }
}
```

## Validation

A simple version of input validation has been done by using __Joi__. For now, it checks if the input for data is respecting the format as described above.

Further validation should be implemented on the GeoJSON polygon objects, to verify if they are closed and properly oriented, for example.

## Error handling

Some error handling is implemeted, and the error code 400 is sent when validation fails or data cannot be properly retrieved from the database, for example.

Success code 200 is used when new building values is successfully inserted.

## Concurrency

Although lokijs seems to include support to transactions, that has not been implemeted on current version. 

Eventually, updates on existing building heights should be implemented, and concurrency should also be added on both updates and insertions. A first approach to implement it should be by adding support to asynchronous entry proints on the API, and transactional operations on POST and PUT entry points.


