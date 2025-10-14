const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const orderController = require("./orderController");

// Protected routes
router.post("/", authMiddleware, orderController.createOrder);
router.get("/myorders", authMiddleware, orderController.getOrdersByUser);

// Admin / management routes
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrderStatus); // ✅ Update status or payment

module.exports = router;
