const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");

dotenv.config();

const app = express();

const pool = mysql.createPool({
  host: "autorack.proxy.rlwy.net",
  user: "root",
  password: "MvXqbckWjgJwXznxgCtcGoCehDmPHapv",
  database: "railway",
  port: 13225,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 120000,
});

async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to the MySQL database");
    await connection.query("SELECT 1 AS test_query");
    console.log("Database test query executed successfully");
    connection.release();
  } catch (err) {
    console.error("Error executing test query:", err.message);
    throw err;
  }
}

async function initializeServer() {
  try {
    await testDatabaseConnection();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("Error initializing server:", err.message);
    process.exit(1);
  }
}

initializeServer();

app.use((err, req, res, next) => {
  console.error("Unexpected error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});
