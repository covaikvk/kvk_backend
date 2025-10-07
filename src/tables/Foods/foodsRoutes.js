const express = require("express");
const router = express.Router();
const {
  addFoodCategory,
  getAllFoodCategories,
  getFoodCategoryById,
  editFoodCategory,
  deleteFoodCategory,
  addFoodItem,
  getAllFoodItems,
  getFoodItemById,
  editFoodItem,
  deleteFoodItem,
  getCombinedFoodData,
} = require("./foodsController");

// Food category routes
router.post("/category", addFoodCategory);
router.get("/category", getAllFoodCategories);
router.get("/category/:id", getFoodCategoryById);
router.put("/category/:id", editFoodCategory);
router.delete("/category/:id", deleteFoodCategory);

// Food items routes
router.post("/item", addFoodItem);
router.get("/item", getAllFoodItems);
router.get("/item/:id", getFoodItemById);
router.put("/item/:id", editFoodItem);
router.delete("/item/:id", deleteFoodItem);


// GET combined categories + items
router.get("/combined", getCombinedFoodData);

module.exports = router;
