const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./src/config/db");

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors());

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("🚀 API running with MySQL connection");
});

app.use("/api/upload", require("./src/tables/upload/upload"));
app.use("/api/todayspecial", require("./src/tables/todayspecial/todayspecialRoutes"));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
