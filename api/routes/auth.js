const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const {signup, login} = require("../controllers/userAuth");

const router = express.Router();

router.post(
    '/register',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('E-Mail address already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 5 }),
        body('name')
            .trim()
            .not()
            .isEmpty(),
        body('mobile')
            .trim(),
        body('type')
            .trim()
            .not()
    ],
    signup
);

router.post('/login', login);

module.exports = router;