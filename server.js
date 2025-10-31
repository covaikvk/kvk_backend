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
app.get("/test", (req, res) => {
  res.send("🚀 Test endpoint working!");
});

// Import notification helper
const sendPushNotification = require("./src/utils/sendPush");

// Test Notification Route
app.get("/notification", async (req, res) => {
  const testToken = "ExponentPushToken[ciLDMZICJMSaIyn6jw_Vlf]"; 

  await sendPushNotification(
    testToken,
    "Hello 👋",
    "This is your first server push notification!"
  );

  res.json({ success: true, message: "Notification sent!" });
});


// app.use("/api/address", require("./src/tables/address/addressRoutes"));
app.use("/api/address", require("./src/tables/address/addressRoutes"));
app.use("/api/upload", require("./src/tables/upload/upload"));
app.use("/api/videos", require("./src/tables/videos/videoRoutes"));
app.use("/api/regularmenu", require("./src/tables/regularmenu/regularMenuRoutes"));
app.use("/api/customizemenu", require("./src/tables/CustomizeMenu/customizeMenuRoutes"));
app.use("/api/todayspecial",require("./src/tables/todayspecial/todayspecialRoutes"));
app.use("/api/favourites", require("./src/tables/Favourites/favouritesRoutes"));
app.use("/api/menu", require("./src/tables/menu/menuRoutes"));
app.use("/api/auth", require("./src/tables/user/authRoutes"));
app.use("/api/foods", require("./src/tables/Foods/foodsRoutes"));
app.use("/api/orders", require("./src/tables/order/orderRoutes"));
app.use("/api/quotations", require("./src/tables/quotations/quotationsRoutes"));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

