const express = require('express');
const transmissionsRouter = require('./routeTransmission');
const optionsRouter = require('./routeOptions');
const carOptions = require("./routeCarOptions");

const router = express.Router();

router.use('/transmission', transmissionsRouter);
router.use('/options', optionsRouter);
router.use('/caroptions', carOptions);

module.exports = router;
