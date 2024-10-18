// src/controllers/carController.js
const { z } = require("zod");
const carService = require("../services/carService");
const { PrismaClient } = require("@prisma/client");
const imageKit = require("../utils/imageKit"); // Ensure imageKit is imported

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
  availableat: z.string(), // Use availableat
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

// Helper function to get or create transmission ID
const getTransmissionId = async (transmissionName) => {
  let transmission = await prisma.transmission.findFirst({
    where: {
      transmission_option: transmissionName,
    },
  });

  if (!transmission) {
    transmission = await prisma.transmission.create({
      data: {
        transmission_option: transmissionName,
      },
    });
    console.log(`Transmission option "${transmissionName}" added to database`);
  }

  return transmission.id;
};

// Helper function to get or create type ID
const getTypeId = async (typeName) => {
  let type = await prisma.type.findFirst({
    where: {
      type_option: typeName,
    },
  });

  if (!type) {
    type = await prisma.type.create({
      data: {
        type_option: typeName,
      },
    });
    console.log(`Type option "${typeName}" added to database`);
  }

  return type.id;
};

// Helper function to get or create manufacture ID
const getManufactureId = async (manufactureName) => {
  let manufacture = await prisma.manufacture.findFirst({
    where: {
      manufacture_name: manufactureName,
    },
  });

  if (!manufacture) {
    manufacture = await prisma.manufacture.create({
      data: {
        manufacture_name: manufactureName,
      },
    });
    console.log(`Manufacture "${manufactureName}" added to database`);
  }

  return manufacture.id;
};

// Helper function to get or create model ID
const getModelId = async (modelName) => {
  let model = await prisma.model.findFirst({
    where: {
      model_name: modelName,
    },
  });

  if (!model) {
    model = await prisma.model.create({
      data: {
        model_name: modelName,
      },
    });
    console.log(`Model "${modelName}" added to database`);
  }

  return model.id;
};

const createCar = async (req, res) => {
  try {
    const parsedData = carSchema.parse(req.body);
    console.log("Parsed Data:", parsedData); // Log parsed data

    const availableAt = new Date(parsedData.availableat);
    if (isNaN(availableAt)) {
      throw new Error("Invalid date format for availableat");
    }

    let imageUrl = null;

    // Check if there's an uploaded file
    if (req.file) {
      const result = await imageKit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      imageUrl = result.url;
    }

    const newCar = await prisma.cars.create({
      data: {
        plate: parsedData.plate,
        rentperday: parsedData.rentperday,
        capacity: parsedData.capacity,
        description: parsedData.description,
        availableat: availableAt, // Store as availableat
        available: parsedData.available,
        year: parsedData.year,
        transmission_id: await getTransmissionId(parsedData.transmission),
        type_id: await getTypeId(parsedData.type),
        manufacture_id: await getManufactureId(parsedData.manufacture),
        model_id: await getModelId(parsedData.model),
        image: imageUrl,
      },
      select: {
        id: true,
        plate: true,
        rentperday: true,
        capacity: true,
        description: true,
        availableat: true, // Ensure it's selected
        available: true,
        year: true,
        transmission_id: true,
        type_id: true,
        manufacture_id: true,
        model_id: true,
        image: true,
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
      } else if (key === "availableat") {
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
  try {
    const cars = await carService.getAllCars();
    console.log("Retrieved Cars:", cars); // Log the raw data
    const convertedCars = convertBigIntToNumber(cars); // Convert BigInt to Number
    res.json(convertedCars);
  } catch (error) {
    console.error("Error retrieving cars:", error);
    res.status(500).json({ error: "Failed to retrieve cars" });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(Number(req.params.id));
    if (car) {
      const convertedCar = convertBigIntToNumber(car); // Convert BigInt to Number
      res.json(convertedCar);
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (error) {
    console.error("Error retrieving car by ID:", error);
    res.status(500).json({ error: "Failed to retrieve car" });
  }
};

const updateCar = async (req, res) => {
  try {
    // Log form-data
    console.log("Received data from request body:", req.body); // Log the text fields
    console.log("Received file:", req.file); // Log the uploaded file, if any

    const carId = Number(req.params.id); // Ensure the ID is a number

    const parsedData = req.body; // Get the form-data
    const updatedCarData = {};

    // Add fields to the update object if they exist in the form-data
    if (parsedData.plate) updatedCarData.plate = parsedData.plate;
    if (parsedData.rentperday)
      updatedCarData.rentperday = parseInt(parsedData.rentperday);
    if (parsedData.capacity)
      updatedCarData.capacity = parseInt(parsedData.capacity);
    if (parsedData.description)
      updatedCarData.description = parsedData.description;
    if (parsedData.availableat)
      updatedCarData.availableat = new Date(parsedData.availableat);
    if (parsedData.available)
      updatedCarData.available = parsedData.available === "true";
    if (parsedData.year) updatedCarData.year = parseInt(parsedData.year);

    // If a new file is uploaded, handle the file upload
    if (req.file) {
      const result = await imageKit.upload({
        file: req.file.buffer, // Buffer from multer
        fileName: req.file.originalname, // Original file name
      });
      updatedCarData.image = result.url; // Set the image URL
    }

    console.log("Updating car with data:", updatedCarData); // Log the update data

    // Update the car in the database
    const updatedCar = await prisma.cars.update({
      where: { id: carId },
      data: updatedCarData,
    });

    // Convert any BigInt values in updatedCar to Number
    const convertedCar = convertBigIntToNumber(updatedCar);

    // Return the converted car data
    res.json(convertedCar);
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car" });
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
