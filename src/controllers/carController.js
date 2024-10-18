const { z } = require("zod");

const carSchema = z.object({
  plate: z.string().min(1),
  rentPerDay: z.number().min(0),
  capacity: z.number().min(1),
  description: z.string().optional(),
  availableAt: z.string().optional(),
  available: z.boolean(),
  year: z.number().min(1886).max(new Date().getFullYear()),
  transmission: z.string().optional(),
  type: z.string().optional(),
  manufacture: z.string().optional(),
  model: z.string().optional(),
  options: z.string().optional(),
  specs: z.string().optional(),
});

const validateCar = (req, res, next) => {
  try {
    carSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ message: error.errors });
  }
};

module.exports = { validateCar };
