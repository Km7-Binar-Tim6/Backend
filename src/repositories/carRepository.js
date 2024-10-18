const prisma = require("../database");

const carRepository = {
  create: (data) => prisma.cars.create({ data }),
  findAll: () => prisma.cars.findMany(),
  findById: (id) => prisma.cars.findUnique({ where: { id } }),
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

    // Link options to the car
    await prisma.options.createMany({
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

    // Link specs to the car
    await prisma.specs.createMany({
      data: specIds.map((specId) => ({ spec_id: specId, car_id: carId })),
    });
  },
};

module.exports = carRepository;
