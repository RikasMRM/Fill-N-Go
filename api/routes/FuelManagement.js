const express = require("express");
const router = express.Router();
const fuelManager = require("../controllers/fuel_Management");

router.post("/", fuelManager.getStationDetails);
router.post("/search-station", fuelManager.getIdByStationName);
router.post("/station-details", fuelManager.getDetailsOfSearchedStation);
router.post("/update", fuelManager.updateStationDetails);
router.post("/add-to-queue", fuelManager.addUserToTheQueue);
router.post("/q-lengths", fuelManager.getQueueLength);
router.post("/q-waiting-times", fuelManager.getWaitingTime);
router.post("/fuel-availability", fuelManager.getFuelAvailability);
router.post("/exit-queue", fuelManager.exitUserFromQueue);
router.post("/exit-after-pump", fuelManager.exitTheQueue);
module.exports = router;
