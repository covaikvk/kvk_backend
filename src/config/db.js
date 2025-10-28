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

    // ✅ Create orders table (updated with payment_status)
await connection.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    payment_method ENUM('Cash On Delivery', 'Online') NOT NULL,
    payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
    instructions TEXT,
    items JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    order_status ENUM('Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id)
      REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_address FOREIGN KEY (address_id)
      REFERENCES address(id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`);


// ✅ Create videos table
await connection.query(`
  CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_url VARCHAR(500) NOT NULL,
    orderno INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);


// ✅ Create regularmenu table
await connection.query(`
  CREATE TABLE IF NOT EXISTS regularmenu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    type ENUM('veg', 'non-veg') NOT NULL DEFAULT 'veg',
    food_category ENUM('breakfast', 'lunch', 'dinner') NOT NULL,
    packagename VARCHAR(255) NOT NULL,
    package_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);



// ✅ Create regulartabellist table
await connection.query(`
  CREATE TABLE IF NOT EXISTS regulartabellist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regularmenu_id INT NOT NULL,
    sunday JSON,
    monday JSON,
    tuesday JSON,
    wednesday JSON,
    thursday JSON,
    friday JSON,
    saturday JSON,
    days_and_price JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_regularmenu FOREIGN KEY (regularmenu_id)
      REFERENCES regularmenu(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);



// ✅ Create favorites table (without item_id)
await connection.query(`
  CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    type ENUM('veg','non-veg') NOT NULL DEFAULT 'veg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fav_user FOREIGN KEY (user_id)
      REFERENCES users(id)
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`);


// ✅ Create customize_menu table
await connection.query(`
  CREATE TABLE IF NOT EXISTS customize_menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sunday JSON,
    monday JSON,
    tuesday JSON,
    wednesday JSON,
    thursday JSON,
    friday JSON,
    saturday JSON,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    whatsapp_number VARCHAR(15),
    address_1 VARCHAR(255),
    address_2 VARCHAR(255),
    pincode VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(100),
    landmark VARCHAR(255),
    number_of_persons INT,
    total DECIMAL(10,2),
    gst DECIMAL(10,2),
    grand_total DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);


    console.log("✅ Tables created successfully (if not exist).");

    // // Optional: log address table details
    // const [rows, fields] = await connection.query("SELECT * FROM customize_menu");
    // console.log("📋 Total number:", rows.length);
    // console.log("📋 Columns:");
    // fields.forEach((field) => console.log("-", field.name));

    return connection;
  } catch (error) {
    console.error("❌ Error connecting to MySQL:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;