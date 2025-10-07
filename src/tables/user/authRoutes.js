const express = require("express");
const router = express.Router();
const authController = require("./authController");
const authMiddleware = require("../../middlewares/authMiddleware");

// Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getUser);

module.exports = router;
