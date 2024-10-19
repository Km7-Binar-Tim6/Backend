const { PrismaClient } = require('@prisma/client');
const JSONBigInt = require('json-bigint');

const prisma = new PrismaClient();

exports.getOptions = async (option_id, car_id) => {
	let query = {};

	if (option_id || car_id) {
		query.where = {
			...(option_id && { option_id }),
			...(car_id && { car_id }),
		};
	}

	const searchedOptions = await prisma.options.findMany(query);

	const serializedOptions = JSONBigInt.stringify(searchedOptions);
	return JSONBigInt.parse(serializedOptions);
};

exports.getOptionById = async (option_id, car_id) => {
	const option = await prisma.options.findUnique({
		where: {
			option_id_car_id: {
				option_id: option_id,
				car_id: car_id,
			},
		},
	});

	const serializedOption = JSONBigInt.stringify(option);
	return JSONBigInt.parse(serializedOption);
};

exports.createOption = async data => {
	const newOption = await prisma.options.create({
		data,
	});

	const serializedOption = JSONBigInt.stringify(newOption);
	return JSONBigInt.parse(serializedOption);
};

exports.updateOption = async (option_id, car_id, data) => {
	const updatedOption = await prisma.options.update({
		where: {
			option_id_car_id: {
				option_id: option_id,
				car_id: car_id,
			},
		},
		data,
	});

	const serializedOption = JSONBigInt.stringify(updatedOption);
	return JSONBigInt.parse(serializedOption);
};

exports.deleteOptionById = async (option_id, car_id) => {
	const deletedOption = await prisma.options.delete({
		where: {
			option_id_car_id: {
				option_id: option_id,
				car_id: car_id,
			},
		},
	});

	const serializedOption = JSONBigInt.stringify(deletedOption);
	return JSONBigInt.parse(serializedOption);
};
