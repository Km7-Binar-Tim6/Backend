const express = require("express");

const routesCars = require("./carsRoutes");
const routesTransmission = require("./routeTransmission");

const router = express.Router();

router.use("/cars", routesCars);
router.use("/transmission", routesTransmission);

module.exports = router;
