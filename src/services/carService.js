//src/services/carService
const carRepository = require("../repositories/carRepository");

const carService = {
  createCar: async (data) => {
    const car = await carRepository.create(data);
    await carRepository.createOrUpdateOptions(
      car.id,
      data.options ? data.options.split(",").map((opt) => opt.trim()) : []
    );
    await carRepository.createOrUpdateSpecs(
      car.id,
      data.specs ? data.specs.split(",").map((spec) => spec.trim()) : []
    );
    return car;
  },
  getAllCars: async () => {
    return await carRepository.findAll();
  },
  getCarById: async (id) => {
    return await carRepository.findById(id);
  },
  updateCar: async (id, data) => {
    const updatedCar = await carRepository.update(id, data);
    if (data.options) {
      await carRepository.createOrUpdateOptions(
        id,
        data.options.split(",").map((opt) => opt.trim())
      );
    }
    if (data.specs) {
      await carRepository.createOrUpdateSpecs(
        id,
        data.specs.split(",").map((spec) => spec.trim())
      );
    }
    return updatedCar;
  },
  deleteCar: async (id) => {
    return await carRepository.delete(id);
  },
};

module.exports = carService;
