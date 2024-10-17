const express = require('express');

const {
    validateGetCars
} = require('../middlewares/carsMiddlewares');

const {
    getAllCars
} = require('../controllers/carsController');

const router = express.Router();

router.get('/', validateGetCars, getAllCars);

module.exports = router;

