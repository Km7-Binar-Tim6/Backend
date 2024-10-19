const optionsService = require('../services/options');
const { SuccessResponse } = require('../utils/response');

exports.getOptions = async (req, res, next) => {
	const { option_id, car_id } = req.query;
	const data = await optionsService.getOptions(option_id, car_id);
	SuccessResponse(res, data);
};

exports.getOptionById = async (req, res, next) => {
	const { option_id, car_id } = req.params;
	SuccessResponse(res, data);
};

exports.createOption = async (req, res, next) => {
	const data = await optionsService.createOption(req.body);
	SuccessResponse(res, data);
};

exports.updateOption = async (req, res, next) => {
	const { option_id, car_id } = req.params;
	const data = await optionsService.updateOption(option_id, car_id, req.body);
	SuccessResponse(res, data);
};

exports.deleteOptionById = async (req, res, next) => {
	const { option_id, car_id } = req.params;
	const data = await optionsService.deleteOptionById(option_id, car_id);
	SuccessResponse(res, data);
};
