const connectDB = require("../../config/db");

/////////////////////////////
// Food Category CRUD
/////////////////////////////

exports.addFoodCategory = async (req, res) => {
  const { image_url, title, description, category } = req.body;
  if (!title || !category)
    return res.status(400).json({ message: "Title and category are required" });

  try {
    const db = await connectDB();
    await db.query(
      `INSERT INTO foodcategory (image_url, title, description, category) VALUES (?, ?, ?, ?)`,
      [image_url, title, description, category]
    );
    res.status(201).json({ message: "✅ Food category added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFoodCategories = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM foodcategory ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFoodCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM foodcategory WHERE id=?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Food category not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editFoodCategory = async (req, res) => {
  const { id } = req.params;
  const { image_url, title, description, category } = req.body;

  try {
    const db = await connectDB();
    const [result] = await db.query(
      "UPDATE foodcategory SET image_url=?, title=?, description=?, category=? WHERE id=?",
      [image_url, title, description, category, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Food category not found" });
    res.status(200).json({ message: "✏️ Food category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFoodCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [result] = await db.query("DELETE FROM foodcategory WHERE id=?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Food category not found" });
    res.status(200).json({ message: "🗑️ Food category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/////////////////////////////
// Food Items CRUD
/////////////////////////////

exports.addFoodItem = async (req, res) => {
  const { image_url, name, price, description, foodcategory_id, category } = req.body;
  if (!name || !price || !foodcategory_id || !category)
    return res
      .status(400)
      .json({ message: "Name, price, foodcategory_id, and category are required" });

  try {
    const db = await connectDB();
    await db.query(
      "INSERT INTO foodsitems (image_url, name, price, description, foodcategory_id, category) VALUES (?, ?, ?, ?, ?, ?)",
      [image_url, name, price, description, foodcategory_id, category]
    );
    res.status(201).json({ message: "✅ Food item added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllFoodItems = async (req, res) => {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM foodsitems ORDER BY id DESC");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFoodItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM foodsitems WHERE id=?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Food item not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editFoodItem = async (req, res) => {
  const { id } = req.params;
  const { image_url, name, price, description, foodcategory_id, category } = req.body;

  try {
    const db = await connectDB();
    const [result] = await db.query(
      "UPDATE foodsitems SET image_url=?, name=?, price=?, description=?, foodcategory_id=?, category=? WHERE id=?",
      [image_url, name, price, description, foodcategory_id, category, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Food item not found" });
    res.status(200).json({ message: "✏️ Food item updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteFoodItem = async (req, res) => {
  const { id } = req.params;
  try {
    const db = await connectDB();
    const [result] = await db.query("DELETE FROM foodsitems WHERE id=?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Food item not found" });
    res.status(200).json({ message: "🗑️ Food item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/////////////////////////////
// Combined GET (category + items)
/////////////////////////////

exports.getCombinedFoodData = async (req, res) => {
  try {
    const db = await connectDB();

    // Get all categories
    const [categories] = await db.query("SELECT * FROM foodcategory ORDER BY id DESC");

    // Get all food items
    const [items] = await db.query("SELECT * FROM foodsitems ORDER BY id DESC");

    // Combine items under their category
    const combined = categories.map((cat) => ({
      id: cat.id,
      image_url: cat.image_url,
      title: cat.title,
      description: cat.description,
      category: cat.category,
      items: items
        .filter((item) => item.foodcategory_id === cat.id)
        .map((item) => ({
          id: item.id,
          image_url: item.image_url,
          name: item.name,
          price: item.price,
          description: item.description,
          category: item.category,
        })),
    }));

    res.status(200).json(combined);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
