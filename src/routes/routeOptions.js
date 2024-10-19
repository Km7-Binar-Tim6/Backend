const express = require('express');
const { validateGetOptions, validateGetOptionById, validateCreateOption, validateUpdateOption, validateDeleteOptionById } = require('../middlewares/options');
const { getOptions, getOptionById, createOption, updateOption, deleteOptionById } = require('../controllers/options');

const router = express.Router();

router.route('/').get(validateGetOptions, getOptions).post(validateCreateOption, createOption);

router.route('/:option_id/:car_id').get(validateGetOptionById, getOptionById).put(validateUpdateOption, updateOption).delete(validateDeleteOptionById, deleteOptionById);

module.exports = router;
