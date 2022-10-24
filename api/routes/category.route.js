const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");
const {
    addDistrict,
    getDistrictById,
    updateDistrict,
    getAllDistrict,
    deleteDistrict
} = require('../controllers/category.controller')

router.route('/').post(upload.single("avatar"), addDistrict)
router.route('/').get(getAllDistrict)
router.route('/:id').get(getDistrictById)
router.route('/:id').put(upload.single("avatar"), updateDistrict)
router.route('/:id').delete(deleteDistrict)

module.exports = router;

