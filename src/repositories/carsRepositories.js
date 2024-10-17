const { PrismaClient } = require("@prisma/client");
const JSONBigInt = require("json-bigint");

const prisma = new PrismaClient();

exports.getAllCars = async (
  plate,
  rentPerDay,
  capacity,
  description,
  availableAt,
  available,
  year,
  image
) => {
  let query = {
    include: {
      manufacture: true,
      model: true,
      transmission: true,
      type: true,
      options: {
        include: {
          caroptions: true,
        },
      },
      specs: {
        include: {
          carspecs: true,
        },
      },
    },
  };

  let orQuery = [];

  if (plate) {
    orQuery.push({
      plate: {
        contains: plate,
        mode: "insensitive",
      },
    });
  }
  if (rentPerDay) {
    orQuery.push({
      rentPerDay: {
        contains: rentPerDay,
        mode: "insensitive",
      },
    });
  }
  if (capacity) {
    orQuery.push({
      capacity: {
        contains: capacity,
        mode: "insensitive",
      },
    });
  }
  if (description) {
    orQuery.push({
      description: {
        contains: description,
        mode: "insensitive",
      },
    });
  }
  if (availableAt) {
    orQuery.push({
      availableAt: {
        contains: availableAt,
        mode: "insensitive",
      },
    });
  }
  if (available) {
    orQuery.push({
      available: {
        contains: available,
        mode: "insensitive",
      },
    });
  }
  if (year) {
    orQuery.push({
      year: {
        contains: year,
        mode: "insensitive",
      },
    });
  }
  if (image) {
    orQuery.push({
      image: {
        contains: image,
        mode: "insensitive",
      },
    });
  }
  if (orQuery.length > 0) {
    query.where = {
      ...query.where,
      OR: orQuery,
    };
  }

  const searchedCars = await prisma.cars.findMany(query);
  const serializedCars = JSONBigInt.stringify(searchedCars);
  return JSONBigInt.parse(serializedCars);
};
