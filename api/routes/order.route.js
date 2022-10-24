const express = require('express');
const router = express.Router()
const {
    addOrder,
    getAllOrders,
    getOrderById,
    deleteOrder,
    updateOrder
} = require('../controllers/order.controller')

router.route('/').post(addOrder)
router.route('/').get(getAllOrders)
router.route('/:id').get(getOrderById)
router.route('/:id').put(updateOrder)
router.route('/:id').delete(deleteOrder)

module.exports = router;

