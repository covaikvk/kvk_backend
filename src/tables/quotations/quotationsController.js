const connectDB = require('../../config/db');

// Add a new quotation
const addQuotation = async (req, res) => {
  const { name, phone, whatsappNumber, address1, address2, pincode, city, state, landmark, numberOfPerson, list } = req.body;

  try {
    const connection = await connectDB();
    const [result] = await connection.query(`
      INSERT INTO quotations (name, phone, whatsappNumber, address1, address2, pincode, city, state, landmark, numberOfPerson, list)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [name, phone, whatsappNumber, address1, address2, pincode, city, state, landmark, numberOfPerson, JSON.stringify(list)]
    );
    
    res.status(201).json({ message: 'Quotation created successfully', id: result.insertId });
  } catch (error) {
    console.error("❌ Error creating quotation:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get all quotations
const getAllQuotations = async (req, res) => {
  try {
    const connection = await connectDB();
    const [quotations] = await connection.query("SELECT * FROM quotations");
    res.status(200).json(quotations);
  } catch (error) {
    console.error("❌ Error fetching quotations:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get a single quotation by id
const getQuotationById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectDB();
    const [quotation] = await connection.query("SELECT * FROM quotations WHERE id = ?", [id]);

    if (quotation.length === 0) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.status(200).json(quotation[0]);
  } catch (error) {
    console.error("❌ Error fetching quotation:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update a quotation
const updateQuotation = async (req, res) => {
  const { id } = req.params;
  const { name, phone, whatsappNumber, address1, address2, pincode, city, state, landmark, numberOfPerson, list } = req.body;

  try {
    const connection = await connectDB();
    const [result] = await connection.query(`
      UPDATE quotations SET name = ?, phone = ?, whatsappNumber = ?, address1 = ?, address2 = ?, pincode = ?, city = ?, state = ?, landmark = ?, numberOfPerson = ?, list = ?
      WHERE id = ?`, 
      [name, phone, whatsappNumber, address1, address2, pincode, city, state, landmark, numberOfPerson, JSON.stringify(list), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.status(200).json({ message: 'Quotation updated successfully' });
  } catch (error) {
    console.error("❌ Error updating quotation:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Delete a quotation
const deleteQuotation = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectDB();
    const [result] = await connection.query("DELETE FROM quotations WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.status(200).json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting quotation:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation
};
