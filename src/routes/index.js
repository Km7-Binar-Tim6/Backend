const express = require('express');
<<<<<<< HEAD
const transmissionsRouter = require('./routeTransmission');
const optionsRouter = require('./routeOptions');
const carOptions = require("./routeCarOptions");

const router = express.Router();

router.use('/transmission', transmissionsRouter);
router.use('/options', optionsRouter);
router.use('/caroptions', carOptions);

module.exports = router;
=======

const routesCars = require('./carsRoutes');

const router = express.Router();

router.use('/cars', routesCars);

module.exports = router;


>>>>>>> 0152746ba3374cd123001d0440452484643f5434
