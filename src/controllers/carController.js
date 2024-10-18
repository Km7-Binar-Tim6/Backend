const { z } = require("zod");
const carService = require("../services/carService");
const { PrismaClient } = require("@prisma/client");

// Initialize Prisma Client
const prisma = new PrismaClient();

const carSchema = z.object({
  plate: z.string(),
  image: z.string().optional(),
  rentperday: z
    .number()
    .int()
    .positive()
    .or(z.string().transform((val) => parseInt(val))), // Allow string input for rentPerDay
  capacity: z
    .number()
    .int()
    .positive()
    .or(z.string().transform((val) => parseInt(val))), // Allow string input for capacity
  description: z.string(),
  availableat: z.string(),
  available: z.boolean().or(z.string().transform((val) => val === "true")), // Allow string input for available
  year: z
    .number()
    .int()
    .min(1886)
    .max(new Date().getFullYear())
    .or(z.string().transform((val) => parseInt(val))), // Allow string input for year
  transmission: z.string(),
  type: z.string(),
  manufacture: z.string(),
  model: z.string(),
  options: z.string().optional(), // Will handle later
  specs: z.string().optional(), // Will handle later
});

// Helper functions to get IDs based on names from related tables
// Helper function to get or create transmission ID
// Helper function to get or create transmission ID
const getTransmissionId = async (transmissionName) => {
  // Check if transmission already exists
  let transmission = await prisma.transmission.findFirst({
    where: {
      transmission_option: transmissionName, // Use findFirst() for non-unique fields
    },
  });

  // If not found, create a new transmission record
  if (!transmission) {
    transmission = await prisma.transmission.create({
      data: {
        transmission_option: transmissionName,
      },
    });
    console.log(`Transmission option "${transmissionName}" added to database`);
  }

  // Return the transmission ID
  return transmission.id;
};

// Helper function to get or create type ID
// Helper function to get or create type ID
const getTypeId = async (typeName) => {
  // Check if type already exists
  let type = await prisma.type.findFirst({
    // Change to findFirst
    where: {
      type_option: typeName, // Use the correct name for the field
    },
  });

  // If not found, create a new type record
  if (!type) {
    type = await prisma.type.create({
      data: {
        type_option: typeName,
      },
    });
    console.log(`Type option "${typeName}" added to database`);
  }

  // Return the type ID
  return type.id;
};

// Helper function to get or create manufacture ID
const getManufactureId = async (manufactureName) => {
  // Check if manufacture already exists
  let manufacture = await prisma.manufacture.findFirst({
    // Change to findFirst
    where: {
      manufacture_name: manufactureName, // Use the correct name for the field
    },
  });

  // If not found, create a new manufacture record
  if (!manufacture) {
    manufacture = await prisma.manufacture.create({
      data: {
        manufacture_name: manufactureName,
      },
    });
    console.log(`Manufacture "${manufactureName}" added to database`);
  }

  // Return the manufacture ID
  return manufacture.id;
};

// Helper function to get or create model ID
const getModelId = async (modelName) => {
  // Check if model already exists
  let model = await prisma.model.findFirst({
    // Change to findFirst
    where: {
      model_name: modelName, // Use the correct name for the field
    },
  });

  // If not found, create a new model record
  if (!model) {
    model = await prisma.model.create({
      data: {
        model_name: modelName,
      },
    });
    console.log(`Model "${modelName}" added to database`);
  }

  // Return the model ID
  return model.id;
};

const createCar = async (req, res) => {
  try {
    const parsedData = carSchema.parse(req.body);

    const availableAt = new Date(parsedData.availableat);

    if (isNaN(availableAt)) {
      throw new Error("Invalid date format for availableAt");
    }

    const newCar = await prisma.cars.create({
      data: {
        plate: parsedData.plate,
        rentperday: parsedData.rentperday,
        capacity: parsedData.capacity,
        description: parsedData.description,
        availableat: availableAt,
        available: parsedData.available,
        year: parsedData.year,
        transmission_id: await getTransmissionId(parsedData.transmission),
        type_id: await getTypeId(parsedData.type),
        manufacture_id: await getManufactureId(parsedData.manufacture),
        model_id: await getModelId(parsedData.model),
      },
      select: {
        id: true,
        plate: true,
        rentperday: true,
        capacity: true,
        description: true,
        availableat: true,
        available: true,
        year: true,
        transmission_id: true,
        type_id: true,
        manufacture_id: true,
        model_id: true,
      },
    });

    // Convert any BigInt values in newCar to Number
    const convertedCar = convertBigIntToNumber(newCar);

    res.status(201).json({
      message: "Car created successfully!",
      data: convertedCar,
    });
  } catch (error) {
    if (error.errors) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating car:", error);
    res.status(500).json({ error: "Failed to create car" });
  }
};

// Convert BigInt to number (to handle any large IDs)
const convertBigIntToNumber = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => convertBigIntToNumber(item));
  }

  if (data && typeof data === "object") {
    const convertedObject = {};
    for (const key in data) {
      if (typeof data[key] === "bigint") {
        convertedObject[key] = Number(data[key]); // Convert BigInt to Number
      } else if (key === "availableAt") {
        convertedObject[key] = data[key] ? data[key].toISOString() : null; // Convert Date to ISO String
      } else if (Array.isArray(data[key])) {
        convertedObject[key] = convertBigIntToNumber(data[key]);
      } else if (data[key] && typeof data[key] === "object") {
        convertedObject[key] = convertBigIntToNumber(data[key]);
      } else {
        convertedObject[key] = data[key]; // Keep original value
      }
    }
    return convertedObject;
  }

  return data; // Return as is if not an object or array
};

const getAllCars = async (req, res) => {
  const cars = await carService.getAllCars();
  const convertedCars = convertBigIntToNumber(cars); // Convert BigInt to Number
  res.json(convertedCars);
};

const getCarById = async (req, res) => {
  const car = await carService.getCarById(Number(req.params.id));
  if (car) {
    const convertedCar = convertBigIntToNumber(car); // Convert BigInt to Number
    res.json(convertedCar);
  } else {
    res.status(404).json({ message: "Car not found" });
  }
};

const updateCar = async (req, res) => {
  try {
    const validatedData = carSchema.parse(req.body);
    const updatedCar = await carService.updateCar(
      Number(req.params.id),
      validatedData
    );
    res.json(updatedCar);
  } catch (error) {
    res.status(400).json({ error: error.errors });
  }
};

const deleteCar = async (req, res) => {
  await carService.deleteCar(Number(req.params.id));
  res.status(204).send();
};

// Export functions for use in routes
module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};
