const mysql = require('mysql2/promise');
require('dotenv').config();

// Ensure this code runs only in a Node.js environment
if (typeof process === 'undefined') {
  throw new Error('This module must be run in a Node.js environment.');
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

module.exports = connectDB;