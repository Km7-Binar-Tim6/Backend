const { PrismaClient } = require('@prisma/client');
const JSONBigInt = require('json-bigint');

const prisma = new PrismaClient();

exports.getTransmissions = async transmission_option => {
	// Define query here
	let query = {};
	// It will generate the query
	let orQuery = [];
	if (transmission_option) {
		orQuery.push({
			transmission_option: { contains: transmission_option, mode: 'insensitive' },
		});
	}
	if (orQuery.length > 0) {
		query.where = {
			...query.where,
			OR: orQuery,
		};
	}

	// Find by query
	const searchedTransmission = await prisma.transmission.findMany(query);

	// Convert BigInt fields to string for safe serialization
	const serializedTransmission = JSONBigInt.stringify(searchedTransmission);
	return JSONBigInt.parse(serializedTransmission);
};

exports.getTransmissionById = async id => {
	// Mencari transmisi berdasarkan ID
	const transmission = await prisma.transmission.findUnique({
		where: {
			id: id,
		},
		// Hanya sertakan relasi jika ada
		include: {
			cars: true, // Misalnya, jika ada relasi dengan model cars
		},
	});

	// Convert BigInt fields to string for safe serialization
	const serializedTransmission = JSONBigInt.stringify(transmission);
	return JSONBigInt.parse(serializedTransmission);
};

exports.createTransmission = async data => {
	const newTransmission = await prisma.transmission.create({
		data,
		// Sertakan relasi jika ada
		include: {
			cars: true, // Misalnya, jika ada relasi dengan model cars
		},
	});

	// Convert BigInt fields to string for safe serialization
	const serializedTransmission = JSONBigInt.stringify(newTransmission);
	return JSONBigInt.parse(serializedTransmission);
};

exports.updateTransmission = async (id, data) => {
	const updatedTransmission = await prisma.transmission.update({
		where: { id },
		data: {
			transmission_option: data.transmission_option, // Pastikan ini sesuai dengan data yang ingin diperbarui
			// Jika Anda ingin memperbarui relasi cars, gunakan struktur yang benar
			cars: {
				// Misalnya, jika Anda ingin menghapus semua relasi dan menambah yang baru
				deleteMany: {}, // Menghapus semua relasi yang ada (hati-hati dengan ini)
				create: data.cars || [], // Menambahkan relasi baru jika ada
			},
		},
		include: {
			cars: true, // Sertakan relasi cars jika diperlukan
		},
	});

	// Convert BigInt fields to string for safe serialization
	const serializedTransmission = JSONBigInt.stringify(updatedTransmission);
	return JSONBigInt.parse(serializedTransmission);
};

exports.deleteTransmissionById = async id => {
	const deletedTransmission = await prisma.transmission.delete({
		where: { id },
		// Sertakan relasi jika ada
		include: {
			cars: true, // Misalnya, jika ada relasi dengan model cars
		},
	});

	// Convert BigInt fields to string for safe serialization
	const serializedTransmission = JSONBigInt.stringify(deletedTransmission);
	return JSONBigInt.parse(serializedTransmission);
};
