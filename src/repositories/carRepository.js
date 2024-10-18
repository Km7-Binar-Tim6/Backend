// src/repositories/carRepository.js
const prisma = require("../database");

const carRepository = {
  create: (data) => prisma.cars.create({ data }),

  // Update findAll to include related data
  findAll: () =>
    prisma.cars.findMany({
      include: {
        transmission: true, // Include related transmission
        type: true, // Include related type
        manufacture: true, // Include related manufacture
        model: true, // Include related model
        options: true, // Include related options
        specs: true, // Include related specs
      },
    }),

  // Update findById to include related data
  findById: (id) =>
    prisma.cars.findUnique({
      where: { id },
      include: {
        transmission: true, // Include related transmission
        type: true, // Include related type
        manufacture: true, // Include related manufacture
        model: true, // Include related model
        options: true, // Include related options
        specs: true, // Include related specs
      },
    }),

  update: (id, data) => prisma.cars.update({ where: { id }, data }),
  delete: (id) => prisma.cars.delete({ where: { id } }),

  createOrUpdateOptions: async (carId, options) => {
    const optionIds = await Promise.all(
      options.map(async (option) => {
        const existingOption = await prisma.carOptions.upsert({
          where: { option_name: option },
          update: {},
          create: { option_name: option },
        });
        return existingOption.id;
      })
    );

    // Link options to the car, avoiding duplicates
    await prisma.carOptionsOnCars.deleteMany({
      where: {
        car_id: carId,
        option_id: { notIn: optionIds },
      },
    });

    await prisma.carOptionsOnCars.createMany({
      data: optionIds.map((optionId) => ({
        option_id: optionId,
        car_id: carId,
      })),
    });
  },

  createOrUpdateSpecs: async (carId, specs) => {
    const specIds = await Promise.all(
      specs.map(async (spec) => {
        const existingSpec = await prisma.carSpecs.upsert({
          where: { spec_name: spec },
          update: {},
          create: { spec_name: spec },
        });
        return existingSpec.id;
      })
    );

    // Link specs to the car, avoiding duplicates
    await prisma.carSpecsOnCars.deleteMany({
      where: {
        car_id: carId,
        spec_id: { notIn: specIds },
      },
    });

    await prisma.carSpecsOnCars.createMany({
      data: specIds.map((specId) => ({
        spec_id: specId,
        car_id: carId,
      })),
    });
  },
};

module.exports = carRepository;
