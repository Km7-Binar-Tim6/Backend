const {z} = require('zod');
const { badrequestError } = require('../utils/request');

exports.validateGetCars = (req, res, next) => {
    const validateQuery = z.object({
        plate: z.string().optional(),
        rentPerDay: z.number().optional(),
        capacity: z.number().optional(),
        description: z.string().optional(),
        availableAt: z.string().optional(),
        available: z.boolean().optional(),
        year: z.number().optional(),
        image: z.string().optional(),
    });

    const resultValidateQuery = validateQuery.safeParse(req.query);
    if (!resultValidateQuery.success) {
        throw new badrequestError(resultValidateQuery.error.errors);
    }

    next();
}
        
