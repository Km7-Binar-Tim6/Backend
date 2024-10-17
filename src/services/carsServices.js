const repoCars = require('../repositories/repoCars');
const { imageUpload } = require('../utils/images-kit.js');


const getAllCars = async (plate, rentPerDay, capacity, description, availableAt, available, year, image) => {
    return repoCars.getAllCars(plate, rentPerDay, capacity, description, availableAt, available, year, image);
}