const User = require("../models/user");
const FuelShed = require("../models/fuelShed");

//method: station details by stationId
//[GET]https://eadfuelapp.herokuapp.com/api/fuel-station/
const getStationDetails = async (req, response) => {
  const station_id = req.body.station_id;

  try {
    const fuelShed = await FuelShed.findById(station_id)
      .populate("Diesel.busQ")
      .populate("Diesel.TukTukQ")
      .populate("Petrol.carQ")
      .populate("Petrol.bikeQ")
      .populate("Petrol.TukTukQ");
    response.status(200).json({
      success: true,
      message: "GET station details",
      fuelShed: fuelShed,
    });
  } catch (err) {
    console.log(err);
  }
};

//method: station wise fuel status
//[POST]http://localhost:4000/api/fuel-station/update
const updateStationDetails = async (req, response) => {
  station_id = req.body.station_id;
  try {
    //find the station
    const station = await FuelShed.findById(station_id)
      .populate("Diesel.busQ")
      .populate("Diesel.TukTukQ")
      .populate("Petrol.carQ")
      .populate("Petrol.bikeQ")
      .populate("Petrol.TukTukQ");

    if (!station) res.status(404).send("data not found");
    else {
      //update the total avaiable fuel quantity
      let newDieselTotal =
        station.Diesel.avaiableTotalFuelAmount +
        req.body.diesel_arrived_quantity;
      let newPetrolTotal =
        station.Petrol.avaiableTotalFuelAmount +
        req.body.petrol_arrived_quantity;

      station.Diesel.avaiableTotalFuelAmount = newDieselTotal;
      station.Petrol.avaiableTotalFuelAmount = newPetrolTotal;

      station.Diesel.arrivalTime = req.body.diesel_arrival_time;
      station.Diesel.arrivedQuantity = req.body.diesel_arrived_quantity;
      station.Diesel.finishingTime = req.body.diesel_finishing_time;
      station.Petrol.arrivalTime = req.body.petrol_arrival_time;
      station.Petrol.arrivedQuantity = req.body.petrol_arrived_quantity;
      station.Petrol.finishingTime = req.body.petrol_finishing_time;

      //updated station details
      station
        .save()
        .then((res) => {
          response.status(200).json({
            success: true,
            message: "fuel details updated successfully",
            updatedStation: res,
          });
        })
        .catch((err) => {
          res.status(400).send(err, "not Updated");
        });
    }
  } catch (err) {
    console.log(err, "couldn't update the station details");
  }
};

//method: find stationName by id 
const getIdByStationName = async (req, response) => {
  const station_name = req.body.station_name;
  try {
    FuelShed.find(
      { stationName: new RegExp("^" + station_name + "$", "i") },
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          if (res[0]) {
            response.status(200).json({
              success: true,
              message: "searched fuel shed was found",
              station_id: res[0]._id,
            });
          } else {
            response.status(404).json({
              success: false,
              message: "nothing found",
            });
          }
        }
      }
    );
  } catch (err) {
    console.log(err, "nothing found for searched station");
  }
};

//method: Search function of station by id
//[GET]https://eadfuelapp.herokuapp.com/api/fuel-station/search-details     
const getDetailsOfSearchedStation = async (req, response) => {
  const searched_station_id = req.body.station_id;

  try {
    const fuelShed = await FuelShed.findById(searched_station_id)
      .populate("Diesel.busQ")
      .populate("Diesel.TukTukQ")
      .populate("Petrol.carQ")
      .populate("Petrol.bikeQ")
      .populate("Petrol.TukTukQ");
    response.status(200).json({
      success: true,
      message: "GET station details",
      fuelShed: fuelShed,
    });
  } catch (err) {
    console.log(err);
  }
};
//method: joining user to the correct queue
//[POST]https://eadfuelapp.herokuapp.com/api/fuel-station/add-to-queue
const addUserToTheQueue = async (req, response) => {
  //find the user who is joing the queue
  const user_id = req.body.user_id;
  const station_id = req.body.station_id;
  let user, station;
  try {
    user = await User.findById(user_id);
    station = await FuelShed.findById(station_id);
  } catch (error) {
    console.log(error, "matching user or station not found");
  }

  //track the time that user joined the queue
  let t = new Date();
  let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  user.joinedTime = currentTime;
  await user.save();

  //find the correct category to which user belongs to & add user to the queue
  const fuelType = req.body.fuel_type; // fuel type : Diesel or Petrol
  const vehicalType = req.body.vehical_type; // vehical type : bus or TukTuk or car or bike
  let queueType;
  console.log("fuel, vehical: ", fuelType, vehicalType);

  if (fuelType === "Diesel") {
    switch (vehicalType) {
      case "bus":
        station.Diesel.busQ.push(user);
        break;
      case "TukTuk":
        station.Diesel.TukTukQ.push(user);
        break;
      default:
        break;
    }
  } else if (fuelType === "Petrol") {
    switch (vehicalType) {
      case "car":
        station.Petrol.carQ.push(user);
        break;
      case "TukTuk":
        station.Petrol.TukTukQ.push(user);
        break;
      case "bike":
        station.Petrol.bikeQ.push(user);
      default:
        break;
    }
  }

  //Modyfying station details
  try {
    station.save().then((res) => {
      console.log("user added to queue");
      response.status(200).json({
        success: true,
        message: "user added to queue",
        updatedStation: station,
      });
    });
  } catch (err) {
    console.log(err, "couldn't add the user to the queue");
  }
};
//method: get the lenght of queue
//[GET]https://eadfuelapp.herokuapp.com/api/fuel-station/q-lengths
const getQueueLength = async (req, response) => {
  //find the station
  const station_id = req.body.station_id;
  let station;
  try {
    station = await FuelShed.findById(station_id)
      .populate("Diesel.busQ")
      .populate("Diesel.TukTukQ")
      .populate("Petrol.carQ")
      .populate("Petrol.bikeQ")
      .populate("Petrol.TukTukQ");
    //length of the fuel queue 
    let queueLengths = {
      diesel_bus_queue_length: station.Diesel.busQ.length,
      diesel_TukTuk_queue_length: station.Diesel.TukTukQ.length,
      petrol_car_queue_length: station.Petrol.carQ.length,
      petrol_bike_queue_length: station.Petrol.bikeQ.length,
      petrol_TukTuk_queue_length: station.Petrol.TukTukQ.length,
    };
    response.status(200).json({
      success: true,
      queueLengths,
    });
  } catch (error) {
    console.log(error, "couldn't retrieve fuel queue lengths");
  }
};
//method: waiting time of a queue
//[GET]https://eadfuelapp.herokuapp.com/api/fuel-station/q-waiting-times    
const getWaitingTime = async (req, response) => {
  const station_id = req.body.station_id;
  let station;
  try {
    //find the station
    station = await FuelShed.findById(station_id)
      .populate("Diesel.busQ")
      .populate("Diesel.TukTukQ")
      .populate("Petrol.carQ")
      .populate("Petrol.bikeQ")
      .populate("Petrol.TukTukQ");

    //find waiting times a queue
    let t = new Date();
    let currentTime =
      t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();

    let waitingTimes = {
      currentTime: currentTime,
      w_time_for_diesel_bus_queue:
        station.Diesel.busQ.length > 0
          ? station.Diesel.busQ[0].joinedTime
          : "00:00:00",
      w_time_for_diesel_TukTuk_queue:
        station.Diesel.TukTukQ.length > 0
          ? station.Diesel.TukTukQ[0].joinedTime
          : "00:00:00",
      w_time_for_petrol_car_queue:
        station.Petrol.carQ.length > 0
          ? station.Petrol.carQ[0].joinedTime
          : "00:00:00",
      w_time_for_petrol_bike_queue:
        station.Petrol.bikeQ.length > 0
          ? station.Petrol.bikeQ[0].joinedTime
          : "00:00:00",
      w_time_for_petrol_TukTuk_queue:
        station.Petrol.TukTukQ.length > 0
          ? station.Petrol.TukTukQ[0].joinedTime
          : "00:00:00",
    };
    response.status(200).json({
      success: true,
      waitingTimes,
    });
  } catch (err) {
    console.log(err, "couldn't get back the waiting time");
  }
};
//method: get fuel avaiablity of each fuel type of the fuel station
//[GET]https://eadfuelapp.herokuapp.com/api/fuel-station/fuel-avaiability
const getFuelAvailability = async (req, response) => {
  const station_id = req.body.station_id;
  let station;
  try {
    //find the station
    station = await FuelShed.findById(station_id)
      .populate("Diesel.busQ")
      .populate("Diesel.TukTukQ")
      .populate("Petrol.carQ")
      .populate("Petrol.bikeQ")
      .populate("Petrol.TukTukQ");

    //availability of fuel type
    let petrolStatus =
      station.Petrol.avaiableTotalFuelAmount > 0 ? true : false;
    let dieselStatus =
      station.Diesel.avaiableTotalFuelAmount > 0 ? true : false;

    response.status(200).json({
      success: true,
      petrolStatus,
      dieselStatus,
    });
  } catch (err) {
    console.log(err, "couldn't fetch fuel avaiability details");
  }
};
//method: remove an user from a queue
//POST]https://eadfuelapp.herokuapp.com/api/fuel-station/exit-queue        
const exitUserFromQueue = async (req, response) => {
  //find the user who is going to join the queue, the station
  const user_id = req.body.user_id;
  const station_id = req.body.station_id;
  let user, station;
  try {
    user = await User.findById(user_id);
    station = await FuelShed.findById(station_id);
  } catch (error) {
    console.log(error, "matching user or station not found");
  }

  //track the time 
  let t = new Date();
  let currentTime = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
  user.exitTime = currentTime;
  await user.save();

  //find the correct category to which user belongs to & add user to the queue
  const fuelType = req.body.fuel_type; // Diesel or Petrol
  const vehicalType = req.body.vehical_type; // bus or TukTuk or car or bike
  let index;

  if (fuelType === "Diesel") {
    switch (vehicalType) {
      case "bus":
        //find user from a bus-queue
        index = station.Diesel.busQ.findIndex(
          (item) => item._id.toString() === user._id.toString()
        );
        station.Diesel.busQ.splice(index, 1);
        break;
      case "TukTuk":
        //find user from a tuktuk-queue
        index = station.Diesel.TukTukQ.findIndex(
          (item) => item._id.toString() === user._id.toString()
        );
        station.Diesel.TukTukQ.splice(index, 1);
        break;
      default:
        break;
    }
  } else if (fuelType === "Petrol") {
    console.log("inside else if");
    switch (vehicalType) {
      case "car":
        //find user from a car-queue
        index = station.Petrol.carQ.findIndex(
          (item) => item._id.toString() === user._id.toString()
        );
        station.Petrol.carQ.splice(index, 1);
        break;
      case "TukTuk":
        //find user from a tuktuk-queue
        index = station.Petrol.TukTukQ.findIndex(
          (item) => item._id.toString() === user._id.toString()
        );
        station.Petrol.TukTukQ.splice(index, 1);
        break;
      case "bike":
        //find user from a bike-queue
        index = station.Petrol.bikeQ.findIndex(
          (item) => item._id.toString() === user._id.toString()
        );
        station.Petrol.bikeQ.splice(index, 1);
      default:
        break;
    }
  }
  //modified station detail
  try {
    station.save().then((res) => {
      response.status(200).json({
        success: true,
        message: "user exit from correct queue successfully",
        updatedStation: station,
      });
    });
  } catch (err) {
    console.log(err, "couldn't exit the user from fuel queue");
  }
};
//method: exit the station after fueling
//[POST]https://eadfuelapp.herokuapp.com/api/fuel-station/exit-after-pump
const exitTheQueue = async (req, response) => {
  const station_id = req.body.station_id;
  const fuelType = req.body.fuel_type; // Diesel or Petrol
  const amount = req.body.amount; //in l
  let station;
  try {
    //find user pumped station
    station = await FuelShed.findById(station_id);

    //reduce the amount from fuel type of this station
    if (fuelType === "Diesel") {
      let currentAmount = station.Diesel.avaiableTotalFuelAmount;
      station.Diesel.avaiableTotalFuelAmount = currentAmount - amount;
    } else if (fuelType === "Petrol") {
      let currentAmount = station.Petrol.avaiableTotalFuelAmount;
      station.Petrol.avaiableTotalFuelAmount = currentAmount - amount;
    }

    //save updated station fuel dettail
    station.save().then((res) => {
      response.status(200).json({
        success: true,
        message: "Available fuel amount updated successfully",
        updatedStation: res,
      });
    });
  } catch (error) {
    console.log(error, "matching user or station not found");
  }
};

const all = {
  getStationDetails,
  getIdByStationName,
  getDetailsOfSearchedStation,
  updateStationDetails,
  addUserToTheQueue,
  getQueueLength,
  getWaitingTime,
  getFuelAvailability,
  exitUserFromQueue,
  exitTheQueue,
};

module.exports = all;
