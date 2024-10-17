const { z } = require('zod');
const { BadRequestError } = require('../utils/request');

exports.validateGetTransmissions = (req, res, next) => {
    next();
};

exports.validateCreateTransmission = (req, res, next) => {
    const validateBody = z.object({
        transmission_option: z.string().nonempty().withMessage('Transmission option is required'),
    });

    const result = validateBody.safeParse(req.body);
    if (!result.success) {
        throw new BadRequestError(result.error.errors);
    }

    next();
};