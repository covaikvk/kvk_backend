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
      ssl: process.env.DB_SSL_CA ? { ca: fs.readFileSync(process.env.DB_SSL_CA) } : undefined,
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

//user table
await connection.query(`
  CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phonenumber VARCHAR(15) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
)
`);



const [rows, fields] = await connection.query('SELECT * FROM users');
console.log("📋 Total number:", rows.length);
console.log("📋 Columns:");
fields.forEach(field => {
  console.log('-', field.name);
 });

    console.log("✅ Tables created successfully (if not exist).");

    return connection; // Return connection
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
