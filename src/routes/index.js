const express = require('express');

const routesCars = require('./routesCars');

const router = express.Router();

router.use('/cars', routesCars);

module.exports = router;


