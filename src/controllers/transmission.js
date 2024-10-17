const transmissionService = require('../services/transmission');
const { successResponse } = require('../utils/response');

exports.getTransmissions = async (req, res, next) => {
    const data = await transmissionService.getTransmissions();
    successResponse(res, data);
};

exports.createTransmission = async (req, res, next) => {
    const data = await transmissionService.createTransmission(req.body);
    successResponse(res, data);
};
