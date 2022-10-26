const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    stationName: {
        type: String,
        required: true
    },
    adminName: {
        type: String,
        required: true
    },
    NIC: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'shed',
    },
    Diesel: {
        arrivalTime: {
            type: String,
        },
        arrivedQuantity: {
            type: Number,
        },
        avaiableTotalFuelAmount: {
            type: Number,
            default: 0
        },
        finishingTime: { 
            type: String
        },
        busQueue: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        threeWheelerQueue: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    Petrol: {
        arrivalTime: {
            type: String,
        },
        arrivedQuantity: {
            type: Number,
        },
        avaiableTotalFuelAmount: {
            type: Number,
            default: 0
        },
        finishingTime: {
            type: String
        },
        carQueue: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        bikeQueue: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        threeWheelerQueue: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
    }
});

module.exports = mongoose.model('FuelShed', userSchema);

/* functionalities */

//method: get station details by stationId
//method: update fuel details of a particular station

//method: Search fuel station (get all details of searched StationId)
//method: add user to the correct queue(ex: stationId.petrol.carQueue.push(user))
//method: get the lenght of each queue (lenght of queue array)
//method: get waiting time of each queue (ex: stationId.petrol.carQueue[0].arrivalTime)

//method: get fuel avaiablity of each fuel type
//method: remove user from correct queue
//method: exit after fueling