const connectDB = require("../../config/db");

// 🟩 Create Order
exports.createOrder = async (req, res) => {
  try {
    const { address_id, payment_method, instructions, items, total_amount, name, phone_number } = req.body;
    const user_id = req.user.id; // ✅ from Bearer token

    if (!address_id || !payment_method || !items || !total_amount) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const connection = await connectDB();

    const [result] = await connection.query(
      `INSERT INTO orders 
        (user_id, address_id, name, phone_number, payment_method, instructions, items, total_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, address_id, name, phone_number, payment_method, instructions || "", JSON.stringify(items), total_amount]
    );

    res.status(201).json({ msg: "Order placed successfully", orderId: result.insertId });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🟩 Get All Orders (Admin View)
exports.getAllOrders = async (req, res) => {
  try {
    const connection = await connectDB();

    const [rows] = await connection.query(`
      SELECT 
        o.*,
        u.name AS user_name,
        u.phonenumber AS user_phone,
        a.name AS address_name,
        a.phone_number AS address_phone,
        a.city, a.state, a.pincode, a.address_1, a.address_2, a.landmark, a.type_of_address
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN address a ON o.address_id = a.id
      ORDER BY o.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🟩 Get Orders by User (using Bearer Token)
exports.getOrdersByUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    const connection = await connectDB();

    const [rows] = await connection.query(`
      SELECT 
        o.*,
        a.name AS address_name,
        a.phone_number AS address_phone,
        a.city, a.state, a.pincode, a.address_1, a.address_2, a.landmark, a.type_of_address
      FROM orders o
      JOIN address a ON o.address_id = a.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [user_id]);

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🟩 Get Single Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();

    const [rows] = await connection.query(`
      SELECT 
        o.*,
        u.name AS user_name,
        u.phonenumber AS user_phone,
        a.name AS address_name,
        a.phone_number AS address_phone,
        a.city, a.state, a.pincode, a.address_1, a.address_2, a.landmark, a.type_of_address
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN address a ON o.address_id = a.id
      WHERE o.id = ?
    `, [id]);

    if (rows.length === 0) return res.status(404).json({ msg: "Order not found" });

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🟩 Update Order Status or Payment Status (Admin or backend)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;

    const connection = await connectDB();

    const updates = [];
    const values = [];

    if (order_status) {
      updates.push("order_status = ?");
      values.push(order_status);
    }

    if (payment_status) {
      updates.push("payment_status = ?");
      values.push(payment_status);
    }

    if (updates.length === 0) {
      return res.status(400).json({ msg: "No fields provided for update" });
    }

    values.push(id);

    const [result] = await connection.query(
      `UPDATE orders SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({ msg: "Order updated successfully" });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
