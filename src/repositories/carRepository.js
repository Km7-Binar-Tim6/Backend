const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createCar = async (carData) => {
  const car = await prisma.cars.create({
    data: {
      plate: carData.plate,
      rentPerDay: carData.rentPerDay,
      capacity: carData.capacity,
      description: carData.description,
      availableAt: carData.availableAt,
      available: carData.available,
      year: carData.year,
      image: carData.image,
      transmission: { connect: { transmission_option: carData.transmission } },
      type: { connect: { type_option: carData.type } },
      manufacture: { connect: { manufacture_name: carData.manufacture } },
      model: { connect: { model_name: carData.model } },
    },
  });

  // Handle options and specs associations
  if (carData.options.length > 0) {
    for (let option of carData.options) {
      await prisma.options.create({
        data: {
          option_id: await prisma.carOptions.findUnique({
            where: { option_name: option },
          }).id,
          car_id: car.id,
        },
      });
    }
  }

  if (carData.specs.length > 0) {
    for (let spec of carData.specs) {
      await prisma.specs.create({
        data: {
          spec_id: await prisma.carSpecs.findUnique({
            where: { spec_name: spec },
          }).id,
          car_id: car.id,
        },
      });
    }
  }

  return car;
};

const getCars = async () => {
  return await prisma.cars.findMany({
    include: {
      transmission: true,
      type: true,
      manufacture: true,
      model: true,
    },
  });
};

const getCarById = async (id) => {
  return await prisma.cars.findUnique({
    where: { id: parseInt(id) },
    include: {
      transmission: true,
      type: true,
      manufacture: true,
      model: true,
    },
  });
};

const updateCar = async (id, carData) => {
  return await prisma.cars.update({
    where: { id: parseInt(id) },
    data: {
      ...carData,
      image: carData.image ? carData.image : undefined, // Only update if new image is provided
    },
  });
};

const deleteCar = async (id) => {
  await prisma.cars.delete({
    where: { id: parseInt(id) },
  });
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
