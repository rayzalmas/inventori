const express = require('express');
const bp = require('body-parser');
const app = express();

app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());

const appRoute = require('./src/routes');
app.use('/', appRoute);

app.listen(8080, () => {
    console.log('Server running: port 8080');
});