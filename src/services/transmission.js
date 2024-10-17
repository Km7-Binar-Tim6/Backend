const transmission = require('../repositories/transmission');
const { BadRequestError } = require('../utils/request');

exports.getTransmissions = async () => {
    return await transmission.getAll();
};

exports.createTransmission = async (transmissionData) => {
    if (!transmissionData.transmission_option) {
        throw new BadRequestError('Transmission option is required');
    }
    return await transmission.create(transmissionData);
};
