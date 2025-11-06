// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  // Database configuration should be handled by the backend API
  // These are kept for reference but should not contain sensitive data
  database: {
    server: process.env['DB_SERVER'] || 'localhost',
    user: process.env['DB_USER'] || 'developer', 
    password: process.env['DB_PASSWORD'] || '',
    database: process.env['DB_NAME'] || 'service_business',
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  }
};