const express = require('express');
const transmissionController = require('../controllers/transmission');
const {
    validateCreateTransmission,
    validateGetTransmissions,
} = require('../middlewares/transmission');

const router = express.Router();

router.get('/', validateGetTransmissions, transmissionController.getTransmissions);
router.post('/', validateCreateTransmission, transmissionController.createTransmission);

module.exports = router;
