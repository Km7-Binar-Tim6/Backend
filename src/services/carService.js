const carRepository = require("../repositories/carRepository");
const imageKit = require("../utils/imageKit");

const createCar = async (data, file) => {
  const imageUrl = await imageKit.uploadImage(file);

  const options = data.options
    ? data.options.split(",").map((opt) => opt.trim())
    : [];
  const specs = data.specs
    ? data.specs.split(",").map((spec) => spec.trim())
    : [];

  const car = await carRepository.createCar({
    ...data,
    image: imageUrl,
    options,
    specs,
  });

  return car;
};

const getAllCars = async () => {
  return await carRepository.getCars();
};

const getCarById = async (id) => {
  return await carRepository.getCarById(id);
};

const updateCar = async (id, data, file) => {
  const imageUrl = file ? await imageKit.uploadImage(file) : undefined;

  const options = data.options
    ? data.options.split(",").map((opt) => opt.trim())
    : [];
  const specs = data.specs
    ? data.specs.split(",").map((spec) => spec.trim())
    : [];

  return await carRepository.updateCar(id, {
    ...data,
    image: imageUrl,
    options,
    specs,
  });
};

const deleteCar = async (id) => {
  await carRepository.deleteCar(id);
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};
