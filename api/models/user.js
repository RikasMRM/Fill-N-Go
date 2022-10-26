const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    type: {
        type: String,
        default: 'user',
    },
    vehicalType: {
        type: String,
    },
    joinedTime: {
        type: String
    },
    exitTime: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);