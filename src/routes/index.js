const express = require('express');
const transmissionsRouter = require('./routeTransmission');

const router = express.Router();

router.use('/transmission', transmissionsRouter);

module.exports = router;
