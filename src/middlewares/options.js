const { z } = require('zod');
const { BadRequestError } = require('../utils/request');

exports.validateGetOptions = (req, res, next) => {
	const validateQuery = z.object({
		option_id: z.string().optional().nullable(),
		car_id: z.string().optional().nullable(),
	});

	const resultValidateQuery = validateQuery.safeParse(req.query);
	if (!resultValidateQuery.success) {
		throw new BadRequestError(resultValidateQuery.error.errors);
	}

	next();
};

exports.validateGetOptionById = (req, res, next) => {
	const validateParams = z.object({
		option_id: z.string(),
		car_id: z.string(),
	});

	const result = validateParams.safeParse(req.params);
	if (!result.success) {
		throw new BadRequestError(result.error.errors);
	}

	next();
};

exports.validateCreateOption = (req, res, next) => {
	const validateBody = z.object({
		option_id: z.string().nonempty(),
		car_id: z.string().nonempty(),
	});

	const result = validateBody.safeParse(req.body);
	if (!result.success) {
		throw new BadRequestError(result.error.errors);
	}

	next();
};

exports.validateUpdateOption = (req, res, next) => {
	const validateParams = z.object({
		option_id: z.string(),
		car_id: z.string(),
	});

	const resultParams = validateParams.safeParse(req.params);
	if (!resultParams.success) {
		throw new BadRequestError(resultParams.error.errors);
	}

	const validateBody = z.object({
		option_id: z.string().optional(),
		car_id: z.string().optional(),
	});

	const resultBody = validateBody.safeParse(req.body);
	if (!resultBody.success) {
		throw new BadRequestError(resultBody.error.errors);
	}

	next();
};

exports.validateDeleteOptionById = (req, res, next) => {
	const validateParams = z.object({
		option_id: z.string(),
		car_id: z.string(),
	});

	const result = validateParams.safeParse(req.params);
	if (!result.success) {
		throw new BadRequestError(result.error.errors);
	}

	next();
};
