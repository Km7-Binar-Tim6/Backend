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

router.post("/", upload.single("image"), createCar); // Use upload middleware for image
router.get("/", getAllCars);
router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

module.exports = router;
