const express = require("express");
const router = express.Router();
const {
  // Table 1 (regularmenu)
  getRegularMenus,
  createRegularMenu,
  updateRegularMenu,
  deleteRegularMenu,

  // Table 2 (regulartabellist)
  getRegularTableList,
  createRegularTableList,
  updateRegularTableList,
  deleteRegularTableList,
  getRegularMenuswithlist,
} = require("./regularMenuController");

/*---------------menu with list-------------- */
router.get("/menuwithlist", getRegularMenuswithlist);

/* ---------------------- regularmenu ---------------------- */
router.get("/", getRegularMenus);
router.post("/", createRegularMenu);
router.put("/:id", updateRegularMenu);
router.delete("/:id", deleteRegularMenu);

/* ---------------------- regulartabellist ---------------------- */
router.get("/tablelist", getRegularTableList);
router.post("/tablelist", createRegularTableList);
router.put("/tablelist/:id", updateRegularTableList);
router.delete("/tablelist/:id", deleteRegularTableList);

module.exports = router;
