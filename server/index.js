import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// API endpoint to save user data
app.post('/api/users', async (req, res) => {
  try {
    const { id, name, email, picture } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO users (google_id, name, email, picture)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE name = ?, email = ?, picture = ?;
    `;
    await connection.execute(query, [id, name, email, picture, name, email, picture]);
    await connection.end();

    res.status(201).json({ message: 'User saved successfully' });
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});