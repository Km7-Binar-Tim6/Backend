const serviceCars = require("../services/carsServices");
const { SuccessResponse } = require("../utils/response");
const { NotFoundError } = require("../utils/request");

exports.getAllCars = async (req, res, next) => {
  const cars = await serviceCars.getAllCars(
    req.query?.plate,
    req.query?.rentPerDay,
    req.query?.capacity,
    req.query?.description,
    req.query?.availableAt,
    req.query?.available,
    req.query?.year,
    req.query?.image
  );
  SuccessResponse(res, cars);
};
