// routes/menuRoutes.js
const express = require("express");
const router = express.Router();
const menuController = require("./menuController");





// Get menu list items by menuname_id
router.get("/menulist/menu/:menuname_id", menuController.getMenuListByMenuId);

//////////////////////////
// MENUNAME ROUTES
//////////////////////////

router.get("/menus", menuController.getMenus);          // Get all menus
router.get("/menus/:id", menuController.getMenuById);   // Get menu by ID
router.post("/menus", menuController.createMenu);       // Create new menu
router.put("/menus/:id", menuController.updateMenu);    // Update menu
router.delete("/menus/:id", menuController.deleteMenu);// Delete menu

//////////////////////////
// MENULIST ROUTES
//////////////////////////

router.get("/menulist", menuController.getMenuList);          // Get all menu items
router.get("/menulist/:id", menuController.getMenuListById);  // Get menu item by ID
router.post("/menulist", menuController.createMenuList);      // Create new menu item
router.put("/menulist/:id", menuController.updateMenuList);   // Update menu item
router.delete("/menulist/:id", menuController.deleteMenuList);// Delete menu item



module.exports = router;
