const mysql = require("mysql2/promise");
const fs = require("fs");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      multipleStatements: true,
      ssl: process.env.DB_SSL_CA
        ? { ca: fs.readFileSync(process.env.DB_SSL_CA) }
        : undefined,
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
        CONSTRAINT fk_menuname FOREIGN KEY (menuname_id)
          REFERENCES menuname(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phonenumber VARCHAR(15) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // ✅ Create address table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS address (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(15) NOT NULL,
        alternate_phone_number VARCHAR(15),
        pincode VARCHAR(10) NOT NULL,
        state VARCHAR(50) NOT NULL,
        city VARCHAR(50) NOT NULL,
        address_1 VARCHAR(255),
        address_2 VARCHAR(255),
        landmark VARCHAR(255),
        type_of_address ENUM('Home','Work','Other') DEFAULT 'Home',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id)
          REFERENCES users(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    // ✅ Create foodcategory table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS foodcategory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(500),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ✅ Create foodsitems table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS foodsitems (
        id INT AUTO_INCREMENT PRIMARY KEY,
        image_url VARCHAR(500),
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        description TEXT,
        foodcategory_id INT NOT NULL,
        category VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_foodcategory FOREIGN KEY (foodcategory_id)
          REFERENCES foodcategory(id)
          ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    console.log("✅ Tables created successfully (if not exist).");

    // Optional: log address table details
    const [rows, fields] = await connection.query("SELECT * FROM address");
    console.log("📋 Total number of addresses:", rows.length);
    console.log("📋 Columns:");
    fields.forEach((field) => console.log("-", field.name));

    return connection;
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;






