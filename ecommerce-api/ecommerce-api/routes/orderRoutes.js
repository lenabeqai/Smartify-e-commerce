const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const auth = require('../middleware/auth');

router.post('/addorder', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.put('/:id',orderController.updateOrder);
router.delete('/:id',orderController.deleteOrder);
router.get('/:id',orderController.getOrderById);

module.exports = router;