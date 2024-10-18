const express = require("express");
const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const { validateCar } = require("../middlewares/validateMiddleware");
const router = express.Router();

router.post("/", validateCar, createCar);
router.get("/", getCars);
router.get("/:id", getCarById);
router.put("/:id", validateCar, updateCar);
router.delete("/:id", deleteCar);

module.exports = router;
