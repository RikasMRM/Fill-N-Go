const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const {
    addShed,
    getAllShed,
    deleteShed,
    getShedById,
    updateShed,
} = require("../controllers/product.controller");

router.route("/").post(upload.single("avatar"), addShed);
router.route("/").get(getAllShed);
router.route("/:id").get(getShedById);
router.route("/:id").put(upload.single("avatar"), updateShed);
router.route("/:id").delete(deleteShed);

module.exports = router;
