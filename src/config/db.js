// db.js
const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const connectDB = async () => {
  try {
    // Connect without specifying database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      ssl: {
        ca: fs.readFileSync(process.env.DB_SSL_CA),
      },
      multipleStatements: true, // allows running multiple queries
    });

    console.log("✅ MySQL connected successfully!");

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Create todayspecial table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS todayspecial (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(500),
        type ENUM('veg','non-veg') NOT NULL DEFAULT 'veg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create menuname table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS menuname (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        image_url TEXT,
        banner_url TEXT
      )
    `);






    // Create menulist table
await connection.query(`
  CREATE TABLE IF NOT EXISTS menulist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menuname_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    type ENUM('veg','non-veg') NOT NULL DEFAULT 'veg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_menuname FOREIGN KEY (menuname_id) REFERENCES menuname(id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`);


const [rows, fields] = await connection.query('SELECT * FROM menulist');
console.log("📋 Total number:", rows.length);
console.log("📋 Columns:");
fields.forEach(field => {
  console.log('-', field.name);
 });

    console.log("✅ Tables created successfully (if not exist).");

    return connection;
  } catch (error) {
    console.error("❌ Error connecting to MySQL or creating tables:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
