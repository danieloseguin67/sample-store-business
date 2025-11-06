# SQL Server Connection Setup - SECURITY OPTIMIZED

This application has been optimized to follow security best practices for database connectivity.

## ⚠️ SECURITY UPDATE ⚠️

**The database service has been completely refactored to remove hardcoded passwords and implement secure practices.**

## Previous Security Issues (FIXED)

❌ **What was wrong**:
- Database password stored in clear text in frontend code
- Credentials exposed to anyone who could access the client-side code
- Direct database connection attempts from frontend (not recommended)

✅ **What was fixed**:
- Removed hardcoded password from frontend code
- Implemented environment-based configuration
- Added proper error handling and security headers
- Created secure backend API template
- Added comprehensive security documentation

## Database Configuration (Backend Only)

**These credentials should ONLY be used in the backend server, never in frontend code:**

- **Server**: localhost
- **User**: developer  
- **Password**: CheckInDotEnv (stored in backend .env file only)
- **Database**: service_business

## Important Security Notes

⚠️ **CRITICAL**: 
1. **Never store database credentials in frontend code**
2. **Always use a backend API layer for database operations**
3. **Use environment variables for sensitive configuration**
4. **Never commit .env files to version control**

## Recommended Architecture

The proper way to connect to SQL Server is:

```
[Angular Frontend] → HTTP → [Backend API] → SQL Server
```

### Backend Setup (Required)

1. **Install Backend Dependencies**:
   ```bash
   npm install express mssql cors dotenv
   ```

2. **Run the Backend Server**:
   ```bash
   node server.js
   ```

3. **Create Database Tables** (example SQL):
   ```sql
   CREATE DATABASE service_business;
   GO

   USE service_business;
   GO

   CREATE TABLE Services (
       Id INT PRIMARY KEY IDENTITY(1,1),
       Name NVARCHAR(100) NOT NULL,
       Description NVARCHAR(500),
       CreatedAt DATETIME DEFAULT GETDATE()
   );

   CREATE TABLE ContactInfo (
       Id INT PRIMARY KEY IDENTITY(1,1),
       AddressLine1 NVARCHAR(200),
       AddressLine2 NVARCHAR(200),
       City NVARCHAR(100),
       Province NVARCHAR(50),
       PostalCode NVARCHAR(20),
       Phone NVARCHAR(50),
       Email NVARCHAR(100)
   );

   CREATE TABLE ContactSubmissions (
       Id INT PRIMARY KEY IDENTITY(1,1),
       Name NVARCHAR(100) NOT NULL,
       Email NVARCHAR(100) NOT NULL,
       Message NTEXT,
       SubmittedAt DATETIME DEFAULT GETDATE()
   );
   ```

4. **Insert Sample Data**:
   ```sql
   INSERT INTO ContactInfo (AddressLine1, AddressLine2, City, Province, PostalCode, Phone, Email)
   VALUES ('7227 Newman Boulevard', 'Unit 1504', 'Montreal', 'Quebec', 'H8N 0H7', '(514) 555-0123', 'info@servicebusiness.com');

   INSERT INTO Services (Name, Description)
   VALUES 
       ('Consulting', 'Strategic guidance to help your business achieve its goals'),
       ('Maintenance', 'Comprehensive maintenance services for peak performance'),
       ('Support', '24/7 dedicated support team');
   ```

## Frontend Configuration

The Angular application includes a `DatabaseService` (`src/app/services/database.service.ts`) that is configured to communicate with the backend API.

### Usage Example:

```typescript
import { DatabaseService } from './services/database.service';

constructor(private dbService: DatabaseService) {}

ngOnInit() {
  // Fetch services from backend
  this.dbService.getData('services').subscribe(
    data => {
      console.log('Services:', data);
    },
    error => {
      console.error('Error:', error);
    }
  );
}
```

## Testing the Connection

1. Start the backend server:
   ```bash
   node server.js
   ```

2. Test the health check endpoint:
   ```bash
   curl http://localhost:3000/api/health
   ```

3. Expected response:
   ```json
   {
     "status": "OK",
     "message": "Backend server is running",
     "database": "Connected"
   }
   ```

## Production Considerations

For production deployment:
1. Use environment variables for sensitive data (never commit credentials)
2. Implement proper authentication and authorization
3. Use HTTPS for all communications
4. Implement rate limiting and input validation
5. Use connection pooling for better performance
6. Implement proper error handling and logging
7. Consider using Azure SQL or other managed database services

## Environment Variables

Create a `.env` file (never commit this file):

```
DB_SERVER=localhost
DB_USER=developer
DB_PASSWORD=CheckInEnvironment
DB_DATABASE=service_business
DB_ENCRYPT=true
API_PORT=3000
```

Update `server.js` to use these environment variables:

```javascript
require('dotenv').config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  // ...
};
```
