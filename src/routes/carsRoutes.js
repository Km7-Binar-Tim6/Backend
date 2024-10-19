const express = require('express');

const {
    validateGetCars,
    validateGetCarById,
    validateCreateCar,
    validateUpdateCar,
    validateDeleteCar
} = require('../middlewares/carsMiddlewares');

const {
    getAllCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
} = require('../controllers/carsControllers');

const router = express.Router();

router
    .route("/")
    .get(validateGetCars, getAllCars)
    .post(validateCreateCar, createCar);

router
    .route("/:id")
    .get(validateGetCarById, getCarById)
    .put(validateUpdateCar, updateCar)
    .delete(validateDeleteCar, deleteCar);

module.exports = router;

