const express = require("express");

const routesType = require("./routeType");
const routesManufacture = require("./routeManufacture");
const routesModel = require("./routeModel");
const routesCars = require('./carsRoutes');
const routesCarSpecs = require('./carspecsRoutes');
const routesSpecs = require('./specsRoutes');

const router = express.Router();

router.use("/type", routesType);
router.use("/manufacture", routesManufacture);
router.use("/model", routesModel);

router.use('/cars', routesCars);
router.use('/carspecs', routesCarSpecs);
router.use('/specs', routesSpecs);
module.exports = router;
