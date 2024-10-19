const express = require("express");

const routesType = require("./routeType");
const routesManufacture = require("./routeManufacture");
const routesModel = require("./routeModel");

const router = express.Router();

router.use("/type", routesType);
router.use("/manufacture", routesManufacture);
router.use("/model", routesModel);

module.exports = router;
