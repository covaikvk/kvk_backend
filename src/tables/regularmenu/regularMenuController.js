const connectDB = require("../../config/db");

/* ---------------------- REGULAR MENU ---------------------- */

// ✅ Get all regular menus
exports.getRegularMenus = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM regularmenu ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching regular menus", error: error.message });
  }
};

// ✅ Create new regular menu
exports.createRegularMenu = async (req, res) => {
  const { category, type, food_category, packagename, package_image_url } = req.body;
  if (!category || !type || !food_category || !packagename) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectDB();
    const [result] = await db.query(
      "INSERT INTO regularmenu (category, type, food_category, packagename, package_image_url) VALUES (?, ?, ?, ?, ?)",
      [category, type, food_category, packagename, package_image_url]
    );
    res.status(201).json({ id: result.insertId, category, type, food_category, packagename, package_image_url });
  } catch (error) {
    res.status(500).json({ message: "Error creating regular menu", error: error.message });
  }
};

// ✅ Update regular menu
exports.updateRegularMenu = async (req, res) => {
  const { id } = req.params;
  const { category, type, food_category, packagename, package_image_url } = req.body;
  try {
    const db = await connectDB();
    await db.query(
      "UPDATE regularmenu SET category=?, type=?, food_category=?, packagename=?, package_image_url=? WHERE id=?",
      [category, type, food_category, packagename, package_image_url, id]
    );
    res.json({ message: "Regular menu updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating regular menu", error: error.message });
  }
};

// ✅ Delete regular menu
exports.deleteRegularMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    await db.query("DELETE FROM regularmenu WHERE id=?", [id]);
    res.json({ message: "Regular menu deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting regular menu", error: error.message });
  }
};


/* ---------------------- REGULAR TABLE LIST ---------------------- */

// ✅ Get all regulartabellist entries
exports.getRegularTableList = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query(`
      SELECT r.*, m.packagename 
      FROM regulartabellist r
      JOIN regularmenu m ON r.regularmenu_id = m.id
      ORDER BY r.id DESC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching regulartabellist", error: error.message });
  }
};

// ✅ Create new regulartabellist record
exports.createRegularTableList = async (req, res) => {
  const { regularmenu_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday, days_and_price } = req.body;
  if (!regularmenu_id) {
    return res.status(400).json({ message: "Missing regularmenu_id" });
  }

  try {
    const db = await connectDB();
    const [result] = await db.query(
      `INSERT INTO regulartabellist 
      (regularmenu_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday, days_and_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        regularmenu_id,
        JSON.stringify(sunday || {}),
        JSON.stringify(monday || {}),
        JSON.stringify(tuesday || {}),
        JSON.stringify(wednesday || {}),
        JSON.stringify(thursday || {}),
        JSON.stringify(friday || {}),
        JSON.stringify(saturday || {}),
        JSON.stringify(days_and_price || {}),
      ]
    );
    res.status(201).json({ id: result.insertId, regularmenu_id });
  } catch (error) {
    res.status(500).json({ message: "Error creating regulartabellist", error: error.message });
  }
};

// ✅ Update regulartabellist
exports.updateRegularTableList = async (req, res) => {
  const { id } = req.params;
  const { sunday, monday, tuesday, wednesday, thursday, friday, saturday, days_and_price } = req.body;

  try {
    const db = await connectDB();
    await db.query(
      `UPDATE regulartabellist 
       SET sunday=?, monday=?, tuesday=?, wednesday=?, thursday=?, friday=?, saturday=?, days_and_price=? 
       WHERE id=?`,
      [
        JSON.stringify(sunday || {}),
        JSON.stringify(monday || {}),
        JSON.stringify(tuesday || {}),
        JSON.stringify(wednesday || {}),
        JSON.stringify(thursday || {}),
        JSON.stringify(friday || {}),
        JSON.stringify(saturday || {}),
        JSON.stringify(days_and_price || {}),
        id,
      ]
    );
    res.json({ message: "regulartabellist updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating regulartabellist", error: error.message });
  }
};

// ✅ Delete regulartabellist
exports.deleteRegularTableList = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    await db.query("DELETE FROM regulartabellist WHERE id=?", [id]);
    res.json({ message: "regulartabellist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting regulartabellist", error: error.message });
  }
};



exports.getRegularMenuswithlist = async (req, res) => {
  try {
    const db = await connectDB();

    const [rows] = await db.query(`
      SELECT 
        rm.id AS menu_id,
        rm.category,
        rm.type,
        rm.food_category,
        rm.packagename,
        rm.package_image_url,
        rtbl.id AS tablelist_id,
        rtbl.sunday,
        rtbl.monday,
        rtbl.tuesday,
        rtbl.wednesday,
        rtbl.thursday,
        rtbl.friday,
        rtbl.saturday,
        rtbl.days_and_price
      FROM regularmenu rm
      LEFT JOIN regulartabellist rtbl
        ON rm.id = rtbl.regularmenu_id
      ORDER BY rm.id DESC, rtbl.id ASC
    `);

    // Optionally, parse JSON fields for tablelist
    const result = rows.map(row => ({
  menu_id: row.menu_id,
  category: row.category,
  type: row.type,
  food_category: row.food_category,
  packagename: row.packagename,
  package_image_url: row.package_image_url,
  tablelist: {
    tablelist_id: row.tablelist_id,
    sunday: parseJSON(row.sunday),
    monday: parseJSON(row.monday),
    tuesday: parseJSON(row.tuesday),
    wednesday: parseJSON(row.wednesday),
    thursday: parseJSON(row.thursday),
    friday: parseJSON(row.friday),
    saturday: parseJSON(row.saturday),
    days_and_price: parseJSON(row.days_and_price)
  }
}));


    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching combined menus", error: error.message });
  }
};




const parseJSON = (value) => {
  if (!value) return {};
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return {};
    }
  }
  return value; // already object
};



// GET Table 2 data by menu ID
exports.getRegularTableListByMenuId = async (req, res) => {
  const { id } = req.params; // menu id
  try {
    const db = await connectDB();
    const [rows] = await db.query(
      `SELECT rtbl.*, rm.packagename
       FROM regulartabellist rtbl
       JOIN regularmenu rm ON rtbl.regularmenu_id = rm.id
       WHERE rtbl.regularmenu_id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "No table data found for this menu ID" });

    // Parse JSON fields
    const result = rows.map(row => ({
      tablelist_id: row.id,
      sunday: parseJSON(row.sunday),
      monday: parseJSON(row.monday),
      tuesday: parseJSON(row.tuesday),
      wednesday: parseJSON(row.wednesday),
      thursday: parseJSON(row.thursday),
      friday: parseJSON(row.friday),
      saturday: parseJSON(row.saturday),
      days_and_price: parseJSON(row.days_and_price),
      packagename: row.packagename
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error fetching table 2 data", error: error.message });
  }
};
