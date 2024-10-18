//src/services/carService.js

const carRepository = require("../repositories/carRepository");

const convertBigIntToNumber = (data) => {
  const fieldsToConvert = [
    "id",
    "transmission_id",
    "type_id",
    "manufacture_id",
    "model_id",
    // Add more fields here if necessary
  ];

  const removeFields = [
    "transmission_id",
    "type_id",
    "manufacture_id",
    "model_id",
  ];

  if (Array.isArray(data)) {
    return data.map((item) => {
      const convertedItem = { ...item };
      fieldsToConvert.forEach((field) => {
        if (convertedItem[field] !== undefined) {
          convertedItem[field] = Number(convertedItem[field]);
        }
      });
      // Remove unnecessary fields
      removeFields.forEach((field) => {
        delete convertedItem[field];
      });
      return convertedItem;
    });
  } else if (data) {
    const convertedData = { ...data };
    fieldsToConvert.forEach((field) => {
      if (convertedData[field] !== undefined) {
        convertedData[field] = Number(convertedData[field]);
      }
    });
    // Remove unnecessary fields
    removeFields.forEach((field) => {
      delete convertedData[field];
    });
    return convertedData;
  }
  return data;
};

const carService = {
  createCar: async (data) => {
    const transaction = await prisma.$transaction(async (tx) => {
      const car = await tx.cars.create({ data });

      await tx.carRepository.createOrUpdateOptions(
        car.id,
        data.options ? data.options.split(",").map((opt) => opt.trim()) : []
      );
      await tx.carRepository.createOrUpdateSpecs(
        car.id,
        data.specs ? data.specs.split(",").map((spec) => spec.trim()) : []
      );

      // Fetch the newly created car with all related data
      const newCar = await tx.cars.findUnique({
        where: { id: car.id },
        include: {
          transmission: true, // Include related transmission
          type: true, // Include related type
          manufacture: true, // Include related manufacture
          model: true, // Include related model
          options: true, // Include related options
          specs: true, // Include related specs
        },
      });

      return newCar; // Return the newly created car with related data
    });

    return convertBigIntToNumber(transaction); // Convert BigInt to Number before returning
  },

  getAllCars: async () => {
    try {
      const cars = await carRepository.findAll();
      return convertBigIntToNumber(cars); // Convert before returning
    } catch (error) {
      console.error("Error retrieving cars:", error);
      throw new Error("Failed to retrieve cars");
    }
  },

  getCarById: async (id) => {
    try {
      const car = await carRepository.findById(id);
      return convertBigIntToNumber(car); // Convert before returning
    } catch (error) {
      console.error("Error retrieving car by ID:", error);
      throw new Error("Failed to retrieve car");
    }
  },

  updateCar: async (id, data) => {
    try {
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
      return convertBigIntToNumber(updatedCar); // Convert before returning
    } catch (error) {
      console.error("Error updating car:", error);
      throw new Error("Failed to update car");
    }
  },

  deleteCar: async (id) => {
    try {
      return await carRepository.delete(id);
    } catch (error) {
      console.error("Error deleting car:", error);
      throw new Error("Failed to delete car");
    }
  },
};

module.exports = carService;
