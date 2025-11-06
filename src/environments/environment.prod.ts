export const environment = {
  production: true,
  apiUrl: '/api', // Use relative path in production
  // Database configuration should be handled by the backend API
  // These are kept for reference but should not contain sensitive data
  database: {
    server: process.env['DB_SERVER'] || 'localhost',
    user: process.env['DB_USER'] || 'developer',
    // Password should be handled by backend environment variables
    password: process.env['DB_PASSWORD'] || '',
    database: process.env['DB_NAME'] || 'service_business',
    options: {
      encrypt: true,
      trustServerCertificate: false // More secure in production
    }
  }
};