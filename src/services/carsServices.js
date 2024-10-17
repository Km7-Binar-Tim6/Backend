const repoCars = require('../repositories/carsRepositories');
// const { imageUpload } = require('../utils/images-kit.js');


exports.getAllCars = async (plate, rentPerDay, capacity, description, availableAt, available, year, image) => {
    return repoCars.getAllCars(plate, rentPerDay, capacity, description, availableAt, available, year, image);
}