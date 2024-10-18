// src/controllers/carController.js
const { z } = require("zod");
const carService = require("../services/carService");
const { PrismaClient } = require("@prisma/client");
const imageKit = require("../utils/imageKit");

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define the car schema using Zod for validation
const carSchema = z.object({
  plate: z.string(),
  image: z.string().optional(),
  rentperday: z
    .number()
    .int()
    .positive()
    .or(z.string().transform((val) => parseInt(val))),
  capacity: z
    .number()
    .int()
    .positive()
    .or(z.string().transform((val) => parseInt(val))),
  description: z.string(),
  availableat: z.string(), // Use availableat
  available: z.boolean().or(z.string().transform((val) => val === "true")), // Allow string input for available
  year: z
    .number()
    .int()
    .min(1886)
    .max(new Date().getFullYear())
    .or(z.string().transform((val) => parseInt(val))),
  transmission: z.string(),
  type: z.string(),
  manufacture: z.string(),
  model: z.string(),
  options: z.string().optional(), // Will handle later
  specs: z.string().optional(), // Will handle later
});

// Helper function to get or create an ID
const getOrCreateId = async (model, uniqueField, name) => {
  let record = await model.findFirst({ where: { [uniqueField]: name } });
  if (!record) {
    record = await model.create({ data: { [uniqueField]: name } });
    console.log(`${uniqueField} "${name}" added to database`);
  }
  return record.id;
};

// Helper function to get or create transmission ID
const getTransmissionId = async (transmissionName) =>
  getOrCreateId(prisma.transmission, "transmission_option", transmissionName);

// Helper function to get or create type ID
const getTypeId = async (typeName) =>
  getOrCreateId(prisma.type, "type_option", typeName);

// Helper function to get or create manufacture ID
const getManufactureId = async (manufactureName) =>
  getOrCreateId(prisma.manufacture, "manufacture_name", manufactureName);

// Helper function to get or create model ID
const getModelId = async (modelName) =>
  getOrCreateId(prisma.model, "model_name", modelName);

// Helper function to get or create option ID
const getOptionId = async (optionName) =>
  getOrCreateId(prisma.caroptions, "option_name", optionName);

// Helper function to get or create spec ID
const getSpecId = async (specName) =>
  getOrCreateId(prisma.carspecs, "spec_name", specName);

// Convert BigInt to number (to handle any large IDs)
const convertBigIntToNumber = (data) => {
  if (Array.isArray(data)) {
    return data.map((item) => convertBigIntToNumber(item));
  }
  if (data && typeof data === "object") {
    const convertedObject = {};
    for (const key in data) {
      convertedObject[key] =
        typeof data[key] === "bigint"
          ? Number(data[key])
          : key === "availableat"
          ? data[key]?.toISOString()
          : convertBigIntToNumber(data[key]);
    }
    return convertedObject;
  }
  return data; // Return as is if not an object or array
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

    // Create the new car
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
        image: imageUrl,
      },
    });

    // Process options
    if (parsedData.options) {
      const optionsArray = parsedData.options
        .split(",")
        .map((option) => option.trim());
      for (const option of optionsArray) {
        const optionId = await getOptionId(option);
        // Check if the option is already linked to the car
        const existingOption = await prisma.options.findFirst({
          where: { car_id: newCar.id, option_id: optionId },
        });
        if (!existingOption) {
          await prisma.options.create({
            data: {
              option_id: optionId,
              car_id: newCar.id, // Directly referencing the new car's ID
            },
          });
        }
      }
    }

    // Process specs
    if (parsedData.specs) {
      const specsArray = parsedData.specs.split(",").map((spec) => spec.trim());
      for (const spec of specsArray) {
        const specId = await getSpecId(spec);
        // Check if the spec is already linked to the car
        const existingSpec = await prisma.specs.findFirst({
          where: { car_id: newCar.id, spec_id: specId },
        });
        if (!existingSpec) {
          await prisma.specs.create({
            data: {
              spec_id: specId,
              car_id: newCar.id, // Directly referencing the new car's ID
            },
          });
        }
      }
    }

    // Fetch the newly created car with related data
    const createdCarWithRelations = await prisma.cars.findUnique({
      where: { id: newCar.id },
      include: {
        transmission: true,
        type: true,
        manufacture: true,
        model: true,
        options: true,
        specs: true,
      },
    });

    const convertedCar = convertBigIntToNumber(createdCarWithRelations);

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

const getAllCars = async (req, res) => {
  try {
    const cars = await carService.getAllCars();
    console.log("Retrieved Cars:", cars);
    const convertedCars = convertBigIntToNumber(cars);
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
      const convertedCar = convertBigIntToNumber(car);
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
    console.log("Received data from request body:", req.body);
    console.log("Received file:", req.file);

    const carId = Number(req.params.id);
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
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      updatedCarData.image = result.url;
    }

    console.log("Updating car with data:", updatedCarData);

    // Update the car in the database
    const updatedCar = await prisma.cars.update({
      where: { id: carId },
      data: updatedCarData,
    });

    // Handle manufacture, type, transmission, and model
    if (parsedData.manufacture) {
      const manufactureId = await getManufactureId(parsedData.manufacture);
      updatedCarData.manufacture_id = manufactureId; // Set ID for the update
    }

    if (parsedData.type) {
      const typeId = await getTypeId(parsedData.type);
      updatedCarData.type_id = typeId; // Set ID for the update
    }

    if (parsedData.transmission) {
      const transmissionId = await getTransmissionId(parsedData.transmission);
      updatedCarData.transmission_id = transmissionId; // Set ID for the update
    }

    if (parsedData.model) {
      const modelId = await getModelId(parsedData.model);
      updatedCarData.model_id = modelId; // Set ID for the update
    }

    // Update the car record again with the new IDs if they exist
    await prisma.cars.update({
      where: { id: carId },
      data: updatedCarData,
    });

    // Handle options
    if (parsedData.options) {
      const optionsArray = parsedData.options
        .split(",")
        .map((option) => option.trim());

      // Clear existing options
      await prisma.options.deleteMany({ where: { car_id: carId } });

      await Promise.all(
        optionsArray.map(async (option) => {
          const optionId = await getOptionId(option);
          await prisma.options.create({
            data: { option_id: optionId, car_id: carId },
          });
        })
      );
    }

    // Handle specs
    if (parsedData.specs) {
      const specsArray = parsedData.specs.split(",").map((spec) => spec.trim());

      // Clear existing specs
      await prisma.specs.deleteMany({ where: { car_id: carId } });

      await Promise.all(
        specsArray.map(async (spec) => {
          const specId = await getSpecId(spec);
          await prisma.specs.create({
            data: { spec_id: specId, car_id: carId },
          });
        })
      );
    }

    // Fetch the updated car with related data
    const updatedCarWithRelations = await prisma.cars.findUnique({
      where: { id: carId },
      include: {
        transmission: true,
        type: true,
        manufacture: true,
        model: true,
        options: true,
        specs: true,
      },
    });

    const convertedCar = convertBigIntToNumber(updatedCarWithRelations);

    res.json({ message: "Car updated successfully!", data: convertedCar });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Failed to update car" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = Number(req.params.id);
    await prisma.cars.delete({ where: { id: carId } });
    res.json({ message: "Car deleted successfully!" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Failed to delete car" });
  }
};

module.exports = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
};
