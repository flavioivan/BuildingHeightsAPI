# Building Heights API

### _Programmatic API aiming at splitting building limits into different plateau heights_

The API in this project aims at dealing with _Building limits_ and _Height plateaus_. These are basically different polygons representing areas that can be built upon in a terrain, and the different heights of this same terrain. The goal of this API is to split the building limits polygons into different polygons, with respective heights, according to the the heights for the different plateus in the terrain.

The API in this project was developed using __Node.JS__, __Express__, __Joi__ (for input validation), __lokijs__ for persistence, and a series of packages for dealing with __GeoJSON__ object types and polygns (__geojson__, __geojson-utils__, __geojson-gemoetries-lookup__, __point-in-polygon__, __which-polygon__, etc.).

## API Documentation

GET [`/api/building-heights`](http://localhost:3400/api/building-heights) (get all building limits, split by plateau heights)

POST [`/api/building-heights/`](http://localhost:3400/api/building-heights) (expects _"building_limits"_ and a _"height_plateaus"_ __<GeoJSON>__ objects as inputs, and adds processed building limits into local database)

DELETE [`/api/building-heights/:id`](http://localhost:3400/api/building-heights/:10) (removeds the processed building limits whose __id__ is sent as parameter, if any)

The current implementation runs some still limited input validation on POST. The logic to split building limits into different polygons is not completely implemented yet.

## Development

Provided that __Node.JS__, __Express__, __Joi__, and __lokijs__ are locally installed, run the application from the local folder by executing the following command (the application is listenning on port __3400__):

```
node .\index.js
```

## Testing

The API has been tested mostly manually with __Postman__.

For example, testing the POST routing can be done as by the image below:
![image](https://user-images.githubusercontent.com/77120051/190922394-c37ee548-358d-45c1-a0c7-7a30718153f2.png)


In this case, the parameter sent was:

```
{
    "building_limits": {
        "type": "Polygon",
        "coordinates": [
            [ [ 2.0, 2.0 ], [ 5.0, 2.0 ], [ 5.0, 5.0 ], [ 2.0, 5.0 ], [ 2.0, 2.0 ] ],
            [ [ 55.0, 55.0 ], [ 80.0, 55.0 ], [ 80.0, 80.0 ], [ 55.0, 80.0 ], [ 55.0, 55.0 ] ]
        ]
    },
    "height_plateaus": {
        "type": "Polygon",
        "coordinates": [
            [ [ 0.0, 0.0 ], [ 50.0, 0.0 ], [ 50.0, 50.0 ], [ 0.0, 50.0 ], [ 0.0, 0.0 ] ],
            [ [ 50.0, 50.0 ], [ 100.0, 50.0 ], [ 100.0, 100.0 ], [ 50.0, 100.0 ], [ 50.0, 50.0 ] ]
        ],
        "heights": [ 25.0, 75 ]
    }
}
```

## Validation

Input validation has been done by using __Joi__. It could be further extended by using some built-in GeoJson validation, in some of the packages used.

Further validation should verify if polygons are closed and properly oriented, for example.

## Error handling

Some error handling is implemeted, and the error code 400 is sent when validation fails or data cannot be properly retrieved from the database, for example.

Success code 200 is used when new building values is successfully inserted.

## Concurrency

Although lokijs apparently includes support to transactions, that has not been implemeted on current version just yet. 

Eventually, updates on existing building heights should be implemented, and concurrency should be added on both updates and insertions. A first approach to implement it should be by adding support to asynchronous entry proints to the API, and transactional operations on POST and PUT entry points.


