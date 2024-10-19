const express = require('express');

const routesCars = require('./carsRoutes');
const routesCarSpecs = require('./carspecsRoutes');
const routesSpecs = require('./specsRoutes');

const router = express.Router();

router.use('/cars', routesCars);
router.use('/carspecs', routesCarSpecs);
router.use('/specs', routesSpecs);
module.exports = router;


