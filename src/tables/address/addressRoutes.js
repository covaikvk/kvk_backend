// // src/tables/address/addressRoutes.js
// const express = require("express");
// const router = express.Router();
// const {
//   getAllAddresses,
//   getAddressById,
//   createAddress,
//   updateAddress,
//   deleteAddress,
// } = require("./addressController");

// router.get("/", getAllAddresses);
// router.get("/:id", getAddressById);
// router.post("/", createAddress);
// router.put("/:id", updateAddress);
// router.delete("/:id", deleteAddress);


// module.exports = router;





const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/verifyToken");
const {
  getAllAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("./addressController");

// Protect all routes
router.get("/", verifyToken, getAllAddresses);
router.post("/", verifyToken, createAddress);
router.put("/:id", verifyToken, updateAddress);
router.delete("/:id", verifyToken, deleteAddress);

module.exports = router;
