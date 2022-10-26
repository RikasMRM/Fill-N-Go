const express = require('express');
const { body } = require('express-validator');

const FuelShed = require('../models/fuelShed');
const { signup } = require('../controllers/stationAuth');

const router = express.Router();

router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return FuelShed.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('adminName')
            .trim()
            .not()
            .isEmpty(),
        body('mobile')
            .trim(),
        body('type')
            .trim()
    ],
    signup
);

// router.post('/login', login);

module.exports = router;