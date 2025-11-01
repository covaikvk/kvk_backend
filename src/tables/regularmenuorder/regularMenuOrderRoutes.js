const express = require('express');
const {
  addRegularMenuOrder,
  getAllRegularMenuOrders,
  getRegularMenuOrderById,
  getRegularMenuOrdersByUserId,
  updateRegularMenuOrder,
  deleteRegularMenuOrder
} = require('./regularMenuOrderController');

const router = express.Router();

router.post('/', addRegularMenuOrder);
router.get('/', getAllRegularMenuOrders);
router.get('/user/:user_id', getRegularMenuOrdersByUserId);
router.get('/:id', getRegularMenuOrderById);
router.put('/update/:id', updateRegularMenuOrder);
router.delete('/delete/:id', deleteRegularMenuOrder);

module.exports = router;

