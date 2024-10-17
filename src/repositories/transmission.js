const { transmission } = require('../prismaClient');

exports.getAll = () => {
    return transmission.findMany();
};

exports.create = (transmissionData) => {
    return transmission.create({ data: transmissionData });
};