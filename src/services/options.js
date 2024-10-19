const optionsRepository = require('../repositories/options');
const { NotFoundError, InternalServerError } = require('../utils/request');

exports.getOptions = async (option_id, car_id) => {
	return optionsRepository.getOptions(option_id, car_id);
};

exports.getOptionById = async (option_id, car_id) => {
	const option = await optionsRepository.getOptionById(option_id, car_id);
	if (!option) {
		throw new NotFoundError('Option is Not Found!');
	}
	return option;
};

exports.createOption = async data => {
	if (!data.option_id || !data.car_id) {
		throw new InternalServerError(['Option ID and Car ID are required!']);
	}

	return optionsRepository.createOption(data);
};

exports.updateOption = async (option_id, car_id, data) => {
	const existingOption = await optionsRepository.getOptionById(option_id, car_id);
	if (!existingOption) {
		throw new NotFoundError('Option is Not Found!');
	}

	return optionsRepository.updateOption(option_id, car_id, data);
};

exports.deleteOptionById = async (option_id, car_id) => {
	const existingOption = await optionsRepository.getOptionById(option_id, car_id);
	if (!existingOption) {
		throw new NotFoundError('Option is Not Found!');
	}

	return optionsRepository.deleteOptionById(option_id, car_id);
};
