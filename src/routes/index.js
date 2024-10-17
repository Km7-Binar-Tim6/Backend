const express = require('express');

const routesCars = require('./carsRoutes');

const router = express.Router();

router.use('/cars', routesCars);

module.exports = router;


