//src/routes/carRoutes
const express = require("express");
const {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const upload = require("../middlewares/upload");

const router = express.Router();

// Route for creating a car (using form-data with image)
router.post("/", upload.single("image"), createCar);

// Route for getting all cars
router.get("/", getAllCars);

// Route for getting a specific car by ID
router.get("/:id", getCarById);

// Route for updating a car (using form-data with image if provided)
router.put("/:id", upload.single("image"), updateCar);

// Route for deleting a car
router.delete("/:id", deleteCar);

module.exports = router;
