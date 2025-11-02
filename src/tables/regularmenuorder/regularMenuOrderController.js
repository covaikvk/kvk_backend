const connectDB = require("../../config/db");

// 🟩 Add a new Regular Menu Order
const addRegularMenuOrder = async (req, res) => {
  try {
    const connection = await connectDB();

    // 🧾 Log the request body for debugging
    console.log("📦 Incoming Order Request:", req.body);

    const {
      user_id,
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
      regularmenuname,
      payment_status,
      order_status,
      plan_price,
      total_amount,
      numberOfPerson,
      numberOfWeeks,
      numPersons,
      numWeeks,
    } = req.body;

    // ✅ Normalize persons & weeks (frontend might send either)
    const persons = Number(numberOfPerson || numPersons || 1);
    const weeks = Number(numberOfWeeks || numWeeks || 1);

    // ✅ Determine plan price (preserve frontend value if sent)
    let finalPlanPrice = Number(plan_price);
    if (!finalPlanPrice || isNaN(finalPlanPrice)) {
      const planName = (regularmenuname || "").toLowerCase();
      if (planName.includes("veg") && !planName.includes("non")) {
        finalPlanPrice = 1500;
      } else if (planName.includes("non veg") || planName.includes("non-veg")) {
        finalPlanPrice = 2000;
      } else {
        finalPlanPrice = 1000; // fallback base price
      }
    }

    // ✅ Calculate total (preserve frontend total if provided)
    const finalTotal =
      Number(total_amount) && !isNaN(total_amount)
        ? Number(total_amount)
        : finalPlanPrice * persons * weeks;

    // 🧾 Debug confirmation
    console.log("🧾 Final Computed Order:", {
      regularmenuname,
      persons,
      weeks,
      plan_price: finalPlanPrice,
      total_amount: finalTotal,
    });

    // ✅ Insert into DB
    const [result] = await connection.query(
      `INSERT INTO regularmenuorder 
      (
        user_id, name, phone_number, alternate_phone_number, pincode, state, city, 
        address_1, address_2, landmark, type_of_address, regularmenuname, 
        payment_status, order_status, numberOfPerson, numberOfWeeks, plan_price, total_amount
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
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
        regularmenuname,
        payment_status || "pending",
        order_status || "pending",
        persons,
        weeks,
        finalPlanPrice,
        finalTotal,
      ]
    );

    res.status(201).json({
      message: "✅ Regular menu order created successfully",
      id: result.insertId,
      plan_price: finalPlanPrice,
      total_amount: finalTotal,
    });
  } catch (error) {
    console.error("❌ Error creating regular menu order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🟦 Get All Regular Menu Orders
const getAllRegularMenuOrders = async (req, res) => {
  try {
    const connection = await connectDB();
    const [orders] = await connection.query(
      "SELECT * FROM regularmenuorder ORDER BY id DESC"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🟦 Get Regular Menu Order by ID
const getRegularMenuOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectDB();
    const [order] = await connection.query(
      "SELECT * FROM regularmenuorder WHERE id = ?",
      [id]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: "Regular menu order not found" });
    }

    res.status(200).json(order[0]);
  } catch (error) {
    console.error("❌ Error fetching regular menu order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🟨 Update Regular Menu Order
const updateRegularMenuOrder = async (req, res) => {
  const { id } = req.params;

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
    regularmenuname,
    payment_status,
    order_status,
    numberOfPerson,
    numberOfWeeks,
    plan_price,
    total_amount,
  } = req.body;

  try {
    const connection = await connectDB();

    const [result] = await connection.query(
      `UPDATE regularmenuorder
      SET name = ?, phone_number = ?, alternate_phone_number = ?, pincode = ?, state = ?, city = ?, 
          address_1 = ?, address_2 = ?, landmark = ?, type_of_address = ?, regularmenuname = ?, 
          payment_status = ?, order_status = ?, numberOfPerson = ?, numberOfWeeks = ?, 
          plan_price = ?, total_amount = ?
      WHERE id = ?
      `,
      [
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
        regularmenuname,
        payment_status,
        order_status,
        numberOfPerson || null,
        numberOfWeeks || null,
        plan_price || null,
        total_amount || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Regular menu order not found" });
    }

    res
      .status(200)
      .json({ message: "✅ Regular menu order updated successfully" });
  } catch (error) {
    console.error("❌ Error updating regular menu order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🟥 Delete Regular Menu Order
const deleteRegularMenuOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectDB();
    const [result] = await connection.query(
      "DELETE FROM regularmenuorder WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Regular menu order not found" });
    }

    res
      .status(200)
      .json({ message: "🗑️ Regular menu order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting regular menu order:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 🟩 Get Regular Menu Orders by User ID
const getRegularMenuOrdersByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const connection = await connectDB();
    const [orders] = await connection.query(
      "SELECT * FROM regularmenuorder WHERE user_id = ? ORDER BY id DESC",
      [user_id]
    );

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No regular menu orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching regular menu orders by user:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addRegularMenuOrder,
  getAllRegularMenuOrders,
  getRegularMenuOrderById,
  getRegularMenuOrdersByUserId,
  updateRegularMenuOrder,
  deleteRegularMenuOrder,
};
