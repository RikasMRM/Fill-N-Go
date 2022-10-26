const User = require('../models/user');
const FuelShed = require('../models/fuelShed');

//method: get station details by stationId
const getFuelStationDetails = async (req, response) => {
    const station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue" )
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        response.status(200).json({
            success: true,
            message: "GET station details",
            fuelShed: fuelShed
        })
    }
    catch (err) {
        console.log(err);
    }
}

//method: update fuel details of a particular station
const updateFuelStationDetails = async (req, response) => {
    station_id = req.body.station_id;
    try {
        //find the station
        const station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        
        if (!station)
            res.status(404).send("data is not found");
        else {
             //update total avaiable fuel quantity  
            let newDieselTotal = station.Diesel.avaiableTotalFuelAmount + req.body.diesel_arrived_quantity;
            let newPetrolTotal = station.Petrol.avaiableTotalFuelAmount + req.body.petrol_arrived_quantity;

            station.Diesel.avaiableTotalFuelAmount = newDieselTotal;
            station.Petrol.avaiableTotalFuelAmount = newPetrolTotal;

            station.Diesel.arrivalTime = req.body.diesel_arrival_time;
            station.Diesel.arrivedQuantity = req.body.diesel_arrived_quantity;
            station.Diesel.finishingTime = req.body.diesel_finishing_time;
            station.Petrol.arrivalTime = req.body.petrol_arrival_time;
            station.Petrol.arrivedQuantity = req.body.petrol_arrived_quantity;
            station.Petrol.finishingTime = req.body.petrol_finishing_time;

            //save updated station details
            station.save()
                .then((res) => {
                    response.status(200).json({
                        success: true,
                        message: "fuel details updated successfully",
                        updatedStation: res,
                    })
                })
                .catch(err => {
                    res.status(400).send(err, "Update not possible");
                });
        }
    }
    catch (err) {
        console.log(err, "couldn't update fuel station details");
    }    
}

//method: find id of searched stationName
const getIdByFuelStationName = async (req, response) => {
    const station_name = req.body.station_name; //new RegExp('^' + station_name + '$', "i"
    try {
        FuelShed.find({ stationName: new RegExp('^' + station_name + '$', "i")}, (err, res) => {
            if (err) { 
                console.log(err);
            }
            else {
                if (res[0]) {
                    response.status(200).json({
                        success: true,
                        message: "searched fuel shed was found",
                        station_id: res[0]._id
                    })
                }
                else {
                    response.status(404).json({
                        success: false,
                        message: "no matching result to be found"
                    })
                }
            }
        })
    }
    catch (err) {
        console.log(err, "no matching result found for searched fuel station name");
    }
}

//method: Search fuel station (get all details of searched StationId)
const getDetailsOfSearchedFuelStation = async (req, response) => {
    const searched_station_id = req.body.station_id;

    try {
        const fuelShed = await FuelShed.findById(searched_station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        response.status(200).json({
            success: true,
            message: "GET station details",
            fuelShed: fuelShed
        })
    }
    catch (err) {
        console.log(err);
    }
}
//method: add user to the correct queue(ex: stationId.petrol.carQueue.push(user))
const addUserToFuelQueue = async (req, response) => {
//find the user who is going to join the queue, the station
    const user_id = req.body.user_id;
    const station_id = req.body.station_id;
    let user, station;
    try {
        user = await User.findById(user_id);
        station = await FuelShed.findById(station_id);
    }
    catch (error) {
        console.log(error, 'matching user or station not found');
    }

//track the time that user joined the queue
    let t = new Date();
    let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
    user.joinedTime = currentTime;
    await user.save();

//find the correct category to which user belongs to & add user to the queue
    const fuelType = req.body.fuel_type; // 'Diesel' or 'Petrol'
    const vehicalType = req.body.vehical_type; // 'bus' / 'threeWheeler' / 'car' / 'bike' 
    let queueType;
    console.log('fuel, vehical: ', fuelType, vehicalType);

    if (fuelType === 'Diesel') {
        switch (vehicalType) {
            case 'bus':
                station.Diesel.busQueue.push(user);
                break;
            case 'threeWheeler':
                station.Diesel.threeWheelerQueue.push(user);
                break;
            default:
                break;
        }
    } else if (fuelType === 'Petrol') {
        switch (vehicalType) {
            case 'car':
                station.Petrol.carQueue.push(user);
                break;
            case 'threeWheeler':
                station.Petrol.threeWheelerQueue.push(user);
                break;
            case 'bike':
                station.Petrol.bikeQueue.push(user);
            default:
                break;
        }
    }

//save the modified station details
    try {
        station.save()
            .then((res) => {
                console.log('user added to queue successfully');
                response.status(200).json({
                    success: true,
                    message: "user added to correct queue successfully",
                    updatedStation: station,
                })
        })
    }
    catch (err) {
        console.log(err, "couldn't add user to the fuel queue")
    }
}
//method: get the lenght of each queue (lenght of queue array)
const getFuelQueueLengths = async (req, response) => {
    //find the station
    const station_id = req.body.station_id;
    let station;
    try {
        station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        //calculate lengths of each fuel queue
        let queueLengths = {
            "diesel_bus_queue_length": station.Diesel.busQueue.length,
            "diesel_threeWheeler_queue_length": station.Diesel.threeWheelerQueue.length,
            "petrol_car_queue_length": station.Petrol.carQueue.length,
            "petrol_bike_queue_length": station.Petrol.bikeQueue.length,
            "petrol_threeWheeler_queue_length": station.Petrol.threeWheelerQueue.length,
        }
        response.status(200).json({
            success: true,
            queueLengths
        })
    }
    catch (error) {
        console.log(error, "couldn't retrieve fuel queue lengths");
    }
}
//method: get waiting time of each queue (ex: stationId.petrol.carQueue[0].arrivalTime)
const getQueueWaitingTimes = async (req, response) => {
    const station_id = req.body.station_id;
    let station;
    try {
        //find the station
        station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        
        //find waiting times of each queue (the arrival time of the person who is about to obtain fuel(who is at the front of the queue))
        let t = new Date();
        let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

        let waitingTimes = {
            "currentTime": currentTime,
            "w_time_for_diesel_bus_queue": (station.Diesel.busQueue.length > 0)? station.Diesel.busQueue[0].joinedTime: '00:00:00',
            "w_time_for_diesel_threewheeler_queue": (station.Diesel.threeWheelerQueue.length > 0)? station.Diesel.threeWheelerQueue[0].joinedTime: '00:00:00',
            "w_time_for_petrol_car_queue": (station.Petrol.carQueue.length > 0)? station.Petrol.carQueue[0].joinedTime: '00:00:00',
            "w_time_for_petrol_bike_queue": (station.Petrol.bikeQueue.length > 0)? station.Petrol.bikeQueue[0].joinedTime: '00:00:00',
            "w_time_for_petrol_threewheeler_queue": (station.Petrol.threeWheelerQueue.length > 0)? station.Petrol.threeWheelerQueue[0].joinedTime: '00:00:00',
        }
        response.status(200).json({
            success: true,
            waitingTimes
        })
    }
    catch (err) {
        console.log(err, "couldn't retrieve fuel queue waiting times");
    }
}
//method: get fuel avaiablity of each fuel type of the respective fuel station
const getFuelAvailability = async (req, response) => {
    const station_id = req.body.station_id;
    let station;
    try {
        //find the station
        station = await FuelShed.findById(station_id)
            .populate("Diesel.busQueue")
            .populate("Diesel.threeWheelerQueue")
            .populate("Petrol.carQueue")
            .populate("Petrol.bikeQueue")
            .populate("Petrol.threeWheelerQueue");
        
        //check availability of each fuel type
        let petrolStatus = (station.Petrol.avaiableTotalFuelAmount > 0) ? true : false;
        let dieselStatus = (station.Diesel.avaiableTotalFuelAmount > 0) ? true : false;

        response.status(200).json({
            success: true,
            petrolStatus,
            dieselStatus
        })
    }
    catch (err) {
        console.log(err, "couldn't fetch fuel avaiability details");
    }
}
//method: remove user from correct queue
const exitUserFromFuelQueue = async (req, response) => {
//find the user who is going to join the queue, the station
    const user_id = req.body.user_id;
    const station_id = req.body.station_id;
    let user, station;
    try {
        user = await User.findById(user_id);
        station = await FuelShed.findById(station_id);
    }
    catch (error) {
        console.log(error, 'matching user or station not found');
    }

//track the time that user exit the queue
    let t = new Date();
    let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
    user.exitTime = currentTime;
    await user.save();

//find the correct category to which user belongs to & add user to the queue
    const fuelType = req.body.fuel_type; // 'Diesel' or 'Petrol'
    const vehicalType = req.body.vehical_type; // 'bus' / 'threeWheeler' / 'car' / 'bike' 
    let index;

    if (fuelType === 'Diesel') {
        switch (vehicalType) {
            case 'bus':
                //find where in the bus-queue this user is
                index = station.Diesel.busQueue.findIndex(item => item._id.toString() === user._id.toString());
                station.Diesel.busQueue.splice(index, 1);
                break;
            case 'threeWheeler':
                //find where in the 3wheeler-queue this user is
                index = station.Diesel.threeWheelerQueue.findIndex(item => item._id.toString() === user._id.toString());
                station.Diesel.threeWheelerQueue.splice(index, 1);
                break;
            default:
                break;
        }
    } else if (fuelType === 'Petrol') {
        console.log('inside else if')
        switch (vehicalType) {
            case 'car':
                //find where in the car-queue this user is
                index = station.Petrol.carQueue.findIndex(item => item._id.toString() === user._id.toString());
                station.Petrol.carQueue.splice(index, 1);
                break;
            case 'threeWheeler':
                //find where in the 3wheeler-queue this user is
                index = station.Petrol.threeWheelerQueue.findIndex(item => item._id.toString() === user._id.toString());
                station.Petrol.threeWheelerQueue.splice(index, 1);
                break;
            case 'bike':
                //find where in the bike-queue this user is
                index = station.Petrol.bikeQueue.findIndex(item => item._id.toString() === user._id.toString());
                station.Petrol.bikeQueue.splice(index, 1);
            default:
                break;
        }
    }
//save the modified station details
    try {
        station.save()
            .then((res) => {
                response.status(200).json({
                    success: true,
                    message: "user exit from correct queue successfully",
                    updatedStation: station,
                })
        })
    }
    catch (err) {
        console.log(err, "couldn't exit the user from fuel queue")
    }
}
//method: exit after fueling (update totalAvailableFuelQuantity after every person obtain fuel)
const exitAfterFueling = async (req, response) => {

    const station_id = req.body.station_id;
    const fuelType = req.body.fuel_type; // 'Diesel' or 'Petrol'
    const amount = req.body.amount //in letres
    let station;
    try {
        //find the station from which the user has pumped fuel
        station = await FuelShed.findById(station_id);

        //reduce the amount from respective fuel type of this station
        if (fuelType === 'Diesel') {
            let currentAmount = station.Diesel.avaiableTotalFuelAmount;
            station.Diesel.avaiableTotalFuelAmount = currentAmount - amount;
        } else if (fuelType === 'Petrol') {
            let currentAmount = station.Petrol.avaiableTotalFuelAmount;
            station.Petrol.avaiableTotalFuelAmount = currentAmount - amount;
        }

        //save updated station fuel details
        station.save()
                .then((res) => {
                    response.status(200).json({
                        success: true,
                        message: "Available fuel amount updated successfully",
                        updatedStation: res,
                })
        })
    }
    catch (error) {
        console.log(error, 'matching user or station not found');
    }

    
}

const all = {
    getFuelStationDetails,
    getIdByFuelStationName,
    getDetailsOfSearchedFuelStation,
    updateFuelStationDetails,
    addUserToFuelQueue,
    getFuelQueueLengths,
    getQueueWaitingTimes,
    getFuelAvailability,
    exitUserFromFuelQueue,
    exitAfterFueling,
}

module.exports = all;