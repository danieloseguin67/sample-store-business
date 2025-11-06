/**
 * Backend Server Example for SQL Server Connection
 * 
 * This is a Node.js/Express server example that shows how to connect to SQL Server
 * from the backend. This file is for reference and would need to be run separately.
 * 
 * To use this:
 * 1. Install dependencies: npm install express mssql cors dotenv
 * 2. Run: node server.js
 * 3. The Angular app will connect to this backend API
 */

const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// SQL Server configuration
const sqlConfig = {
  user: process.env['DB_USER'] || 'developer',
  password: process.env['DB_PASSWORD'] || '',
  server: process.env['DB_SERVER'] || 'localhost',  
  database: process.env['DB_NAME'] || 'service_business',
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true // Trust self-signed certificates
  }
};

// Database connection pool
let pool;

// Initialize database connection
async function initializeDatabase() {
  try {
    pool = await sql.connect(sqlConfig);
    console.log('Connected to SQL Server successfully');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend server is running',
    database: pool ? 'Connected' : 'Disconnected'
  });
});

// Example: Get all services
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT * FROM Services');
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Example: Get contact information
app.get('/api/contact', async (req, res) => {
  try {
    const result = await pool.request()
      .query('SELECT * FROM ContactInfo');
    res.json(result.recordset);
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Example: Add contact form submission
app.post('/api/contact/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const result = await pool.request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('message', sql.Text, message)
      .query('INSERT INTO ContactSubmissions (Name, Email, Message, SubmittedAt) VALUES (@name, @email, @message, GETDATE())');
    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error('SQL error:', err);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  initializeDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  if (pool) {
    await pool.close();
  }
  process.exit(0);
});
