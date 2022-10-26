const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const FuelShed = require('../models/fuelShed');

exports.signup = async (req, res, next) => {
    console.log('req', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const mobile = req.body.mobile;
    const vehicalType = req.body.vehicalType;
    const type = req.body.type;

    try {
        const hashedPw = await bcrypt.hash(password, 12);

        const user = new User({
            email,
            password: hashedPw,
            name,
            mobile,
            vehicalType,
            type
        });
        const result = await user.save();
        res.status(201).json({ success: true, message: 'User created!', userId: result._id });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};


exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser, fuelShed;
    console.log('logging..', email, password);
    try {
        // find in user table
        const user = await User.findOne({ email: email });
        if (user) {
            loadedUser = user;
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
                {
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                success: true,
                token: token,
                userId: loadedUser._id.toString() ,
                type: loadedUser.type,
                name:loadedUser.name
            });
        }
        else {
            // find in fuel-stations table
            fuelShed = await FuelShed.findOne({ email: email });
            if (fuelShed) {
                loadedUser = fuelShed;
                const isEqual = await bcrypt.compare(password, loadedUser.password);
                if (!isEqual) {
                    const error = new Error('Wrong password!');
                    error.statusCode = 401;
                    throw error;
                }
                const token = jwt.sign(
                    {
                        email: loadedUser.email,
                        userId: loadedUser._id.toString()
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' }
                );
                res.status(200).json({
                    success: true,
                    token: token,
                    stationId: loadedUser._id.toString() ,
                    type: loadedUser.type,
                    name:loadedUser.name
                });
            }
        }
        if (!user && !fuelShed) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};