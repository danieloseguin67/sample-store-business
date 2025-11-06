/**
 * Example Backend Server for Angular Database Service
 * 
 * This is a secure implementation example using Node.js and Express
 * Install required dependencies:
 * npm install express mssql cors helmet express-rate-limit dotenv
 * npm install --save-dev nodemon
 */

require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4220',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.API_RATE_LIMIT) || 100,
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database configuration
const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  }
};

// Database connection pool
let pool = null;

// Initialize database connection
async function initDatabase() {
  try {
    pool = await sql.connect(dbConfig);
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

// Middleware to validate database connection
const checkDbConnection = (req, res, next) => {
  if (!pool || !pool.connected) {
    return res.status(503).json({
      success: false,
      error: 'Database connection unavailable'
    });
  }
  next();
};

// Error handling middleware
const errorHandler = (error, req, res, next) => {
  console.error('API Error:', error);
  
  if (error.code === 'EREQUEST') {
    return res.status(400).json({
      success: false,
      error: 'Invalid database request'
    });
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = pool && pool.connected ? 'connected' : 'disconnected';
  res.json({ 
    success: true, 
    message: 'API is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Generic table data endpoint with security validation
app.get('/api/tables/:tableName', checkDbConnection, async (req, res, next) => {
  try {
    const { tableName } = req.params;
    
    // Whitelist of allowed table names to prevent SQL injection
    const allowedTables = ['users', 'products', 'orders', 'categories'];
    
    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: `Table '${tableName}' is not accessible through this API`
      });
    }
    
    const request = pool.request();
    const query = `SELECT * FROM [${tableName}] ORDER BY id`;
    const result = await request.query(query);
    
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
    
  } catch (error) {
    next(error);
  }
});

// Get specific record by ID
app.get('/api/tables/:tableName/:id', checkDbConnection, async (req, res, next) => {
  try {
    const { tableName, id } = req.params;
    
    // Validate table name
    const allowedTables = ['users', 'products', 'orders', 'categories'];
    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: `Table '${tableName}' is not accessible through this API`
      });
    }
    
    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }
    
    const request = pool.request();
    request.input('id', sql.Int, parseInt(id));
    
    const query = `SELECT * FROM [${tableName}] WHERE id = @id`;
    const result = await request.query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Record not found'
      });
    }
    
    res.json({
      success: true,
      data: result.recordset[0]
    });
    
  } catch (error) {
    next(error);
  }
});

// Example POST endpoint for creating records
app.post('/api/tables/:tableName', checkDbConnection, async (req, res, next) => {
  try {
    const { tableName } = req.params;
    const data = req.body;
    
    // Validate table name
    const allowedTables = ['users', 'products', 'orders', 'categories'];
    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({
        success: false,
        error: `Table '${tableName}' is not accessible for creation through this API`
      });
    }
    
    // Basic validation (implement more robust validation based on your schema)
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Request body cannot be empty'
      });
    }
    
    // Example implementation - customize based on your table schema
    const request = pool.request();
    
    // For demonstration - implement proper column mapping and validation
    if (tableName === 'users' && data.name && data.email) {
      request.input('name', sql.NVarChar, data.name);
      request.input('email', sql.NVarChar, data.email);
      
      const query = `
        INSERT INTO [${tableName}] (name, email, created_at) 
        OUTPUT inserted.id
        VALUES (@name, @email, GETDATE())
      `;
      
      const result = await request.query(query);
      
      res.status(201).json({
        success: true,
        data: { id: result.recordset[0].id },
        message: 'Record created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid data format for this table'
      });
    }
    
  } catch (error) {
    next(error);
  }
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  if (pool) {
    await pool.close();
  }
  process.exit(0);
});

// Start server
async function startServer() {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:4220'}`);
  });
}

startServer().catch(console.error);