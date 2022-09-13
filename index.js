const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Building heights API.');
});

// Import routes
const apiRoutes = require('./routes.js');
app.use('/api', apiRoutes);

app.listen(3400, () => console.log('Listening on port 3400...'));