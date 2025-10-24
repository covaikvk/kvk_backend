const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/verifyToken");
const {
  addFavourite,
  getFavourites,
  removeFavourite,
  checkFavourite,
} = require("./favouritesController");

// Routes
router.post("/", verifyToken, addFavourite);
router.get("/", verifyToken, getFavourites);
router.delete("/:id", verifyToken, removeFavourite);
router.get("/check/item", verifyToken, checkFavourite);

module.exports = router;
