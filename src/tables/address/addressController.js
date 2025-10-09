// // src/tables/address/addressController.js
// const connectDB = require("../../../src/config/db");

// exports.getAllAddresses = async (req, res) => {
//   try {
//     const db = await connectDB();
//     const [rows] = await db.query("SELECT * FROM address");
//     res.status(200).json(rows);
//   } catch (error) {
//     console.error("❌ getAllAddresses:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getAddressById = async (req, res) => {
//   try {
//     const db = await connectDB();
//     const [rows] = await db.query("SELECT * FROM address WHERE id = ?", [req.params.id]);
//     if (rows.length === 0) return res.status(404).json({ message: "Address not found" });
//     res.json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.createAddress = async (req, res) => {
//   try {
//     const db = await connectDB();
//     const {
//       user_id,
//       name,
//       phone_number,
//       alternate_phone_number,
//       pincode,
//       state,
//       city,
//       address_1,
//       address_2,
//       landmark,
//       type_of_address,
//     } = req.body;

//     const [result] = await db.query(
//       `INSERT INTO address 
//       (user_id, name, phone_number, alternate_phone_number, pincode, state, city, address_1, address_2, landmark, type_of_address)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         user_id,
//         name,
//         phone_number,
//         alternate_phone_number,
//         pincode,
//         state,
//         city,
//         address_1,
//         address_2,
//         landmark,
//         type_of_address,
//       ]
//     );

//     res.status(201).json({ id: result.insertId, message: "Address created successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateAddress = async (req, res) => {
//   try {
//     const db = await connectDB();
//     const { id } = req.params;
//     const updates = req.body;
//     const [result] = await db.query("UPDATE address SET ? WHERE id = ?", [updates, id]);
//     if (result.affectedRows === 0) return res.status(404).json({ message: "Address not found" });
//     res.json({ message: "Address updated successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteAddress = async (req, res) => {
//   try {
//     const db = await connectDB();
//     const [result] = await db.query("DELETE FROM address WHERE id = ?", [req.params.id]);
//     if (result.affectedRows === 0) return res.status(404).json({ message: "Address not found" });
//     res.json({ message: "Address deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




const connectDB = require("../../../src/config/db");

// ✅ Get all addresses for logged-in user
exports.getAllAddresses = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user.id; // from JWT
    const [rows] = await db.query("SELECT * FROM address WHERE user_id = ?", [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create new address for logged-in user
exports.createAddress = async (req, res) => {
  try {
    const db = await connectDB();
    const userId = req.user.id;
    const {
      name,
      phone_number,
      alternate_phone_number,
      pincode,
      state,
      city,
      address_1,
      address_2,
      landmark,
      type_of_address,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO address 
      (user_id, name, phone_number, alternate_phone_number, pincode, state, city, address_1, address_2, landmark, type_of_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        phone_number,
        alternate_phone_number,
        pincode,
        state,
        city,
        address_1,
        address_2,
        landmark,
        type_of_address,
      ]
    );

    res.status(201).json({ id: result.insertId, message: "Address created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update address only if it belongs to logged-in user
exports.updateAddress = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const userId = req.user.id;
    const updates = req.body;

    const [result] = await db.query(
      "UPDATE address SET ? WHERE id = ? AND user_id = ?",
      [updates, id, userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Address not found or not authorized" });

    res.json({ message: "Address updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete address only if it belongs to logged-in user
exports.deleteAddress = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await db.query(
      "DELETE FROM address WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Address not found or not authorized" });

    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
    