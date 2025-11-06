# Database Security Configuration Guide

## ⚠️ SECURITY IMPORTANT ⚠️

This document outlines the security best practices implemented in the database service and requirements for backend implementation.

## Frontend Security Changes

1. **Removed Hardcoded Password**: The password is no longer stored in the frontend code
2. **Environment-Based Configuration**: Database configuration now uses environment variables
3. **Secure API Communication**: Added proper error handling and HTTP headers
4. **Type Safety**: Implemented TypeScript interfaces for better type safety

## Backend Implementation Requirements

### Environment Variables
Create a `.env` file in your backend project with these variables:

```env
# Database Configuration
DB_SERVER=localhost
DB_USER=developer
DB_PASSWORD=CheckInEnvironment
DB_NAME=service_business
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=true

# API Configuration
PORT=3000
NODE_ENV=production

# Security
JWT_SECRET=your-super-secure-jwt-secret
API_RATE_LIMIT=100
SESSION_SECRET=your-session-secret
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use connection pooling** for database connections
3. **Implement authentication/authorization** (JWT tokens)
4. **Validate and sanitize all inputs** to prevent SQL injection
5. **Use HTTPS in production**
6. **Implement rate limiting** to prevent abuse
7. **Log security events** for monitoring
8. **Use prepared statements** for all SQL queries

### Example Backend Implementation (Node.js/Express)

```javascript
// server.js
require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4220',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database configuration
const dbConfig = {
  server: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

// Example secure database query
app.get('/api/tables/:tableName', async (req, res) => {
  try {
    const { tableName } = req.params;
    
    // Validate table name to prevent SQL injection
    const allowedTables = ['users', 'products', 'orders']; // Define allowed tables
    if (!allowedTables.includes(tableName)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid table name' 
      });
    }
    
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('tableName', sql.NVarChar, tableName)
      .query('SELECT * FROM @tableName'); // Use parameterized queries
    
    res.json({ 
      success: true, 
      data: result.recordset 
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
```

## Frontend Usage Examples

```typescript
// In a component
constructor(private dbService: DatabaseService) {}

// Get data with proper typing
this.dbService.getData<User[]>('users').subscribe({
  next: (response) => {
    if (response.success) {
      this.users = response.data || [];
    } else {
      console.error('API Error:', response.error);
    }
  },
  error: (error) => {
    console.error('Network Error:', error.message);
  }
});
```

## Additional Security Measures

1. **Environment File Security**:
   - Add `.env*` to `.gitignore`
   - Use different credentials for development/production
   - Rotate passwords regularly

2. **Network Security**:
   - Use HTTPS in production
   - Configure firewall rules
   - Use VPN for database access in production

3. **Database Security**:
   - Use least privilege principle for database users
   - Enable database auditing
   - Regular security updates
   - Backup encryption

4. **Monitoring**:
   - Log all database access attempts
   - Monitor for unusual activity patterns
   - Set up alerts for failed authentication attempts