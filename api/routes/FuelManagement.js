const express = require("express");
const router = express.Router();
const fuelManager = require("../controllers/fuelManagement");

router.post("/", fuelManager.getFuelStationDetails);
router.post("/search-station", fuelManager.getIdByFuelStationName);
router.post("/station-details", fuelManager.getDetailsOfSearchedFuelStation);
router.post("/update", fuelManager.updateFuelStationDetails);
router.post("/add-to-queue", fuelManager.addUserToFuelQueue);
router.post("/q-lengths", fuelManager.getFuelQueueLengths);
router.post("/q-waiting-times", fuelManager.getQueueWaitingTimes);
router.post("/fuel-availability", fuelManager.getFuelAvailability);
router.post("/exit-queue", fuelManager.exitUserFromFuelQueue);
router.post("/exit-after-pump", fuelManager.exitAfterFueling);
module.exports = router;