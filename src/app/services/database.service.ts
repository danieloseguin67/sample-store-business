import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

/**
 * Database Service
 * 
 * SECURITY NOTE: This service follows security best practices:
 * 1. No sensitive data (passwords) stored in frontend code
 * 2. All database operations go through a secure backend API
 * 3. Uses environment-based configuration
 * 4. Implements proper error handling
 * 
 * Backend Implementation Requirements:
 * 1. Backend API should use environment variables for database credentials
 * 2. Implement authentication/authorization (JWT tokens, etc.)
 * 3. Use HTTPS in production
 * 4. Validate and sanitize all inputs
 * 5. Use connection pooling and prepared statements
 * 
 * Example backend environment variables:
 * - DB_SERVER=localhost
 * - DB_USER=developer  
 * - DB_PASSWORD=your_secure_password
 * - DB_NAME=service_business
 */

export interface DatabaseConfig {
  server: string;
  user: string;
  database?: string;
  options?: {
    encrypt?: boolean;
    trustServerCertificate?: boolean;
  };
  // Note: Password intentionally removed from interface
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly apiUrl: string;
  private readonly dbConfig: DatabaseConfig;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
    this.dbConfig = {
      server: environment.database.server,
      user: environment.database.user,
      database: environment.database.database,
      options: environment.database.options
    };
  }

  /**
   * Get HTTP headers with common security settings
   */
  private getHttpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Add authentication headers here when implementing authentication
      // 'Authorization': `Bearer ${this.getAuthToken()}`
    });
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Database Service Error:', error);
    let errorMessage = 'An error occurred while communicating with the server.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Generic GET request to the backend API
   * @param endpoint - API endpoint (without base URL)
   * @param params - Optional query parameters
   */
  getData<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = {
      headers: this.getHttpHeaders(),
      params: params
    };
    
    return this.http.get<ApiResponse<T>>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic POST request to the backend API
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request payload
   */
  postData<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = { headers: this.getHttpHeaders() };
    
    return this.http.post<ApiResponse<T>>(url, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic PUT request to the backend API
   * @param endpoint - API endpoint (without base URL)
   * @param data - Request payload
   */
  updateData<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = { headers: this.getHttpHeaders() };
    
    return this.http.put<ApiResponse<T>>(url, data, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Generic DELETE request to the backend API
   * @param endpoint - API endpoint (without base URL)
   */
  deleteData<T>(endpoint: string): Observable<ApiResponse<T>> {
    const url = `${this.apiUrl}/${endpoint}`;
    const options = { headers: this.getHttpHeaders() };
    
    return this.http.delete<ApiResponse<T>>(url, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get database configuration (for backend reference only)
   * Note: This does not contain sensitive information like passwords
   */
  getDbConfig(): DatabaseConfig {
    return { ...this.dbConfig };
  }

  /**
   * Check if the API is available
   */
  healthCheck(): Observable<ApiResponse<any>> {
    return this.getData('health');
  }

  /**
   * Example: Get all records from a specific table
   * Usage: getTableData<User[]>('users')
   */
  getTableData<T>(tableName: string): Observable<ApiResponse<T>> {
    return this.getData<T>(`tables/${tableName}`);
  }

  /**
   * Example: Get a specific record by ID
   * Usage: getRecordById<User>('users', 123)
   */
  getRecordById<T>(tableName: string, id: number): Observable<ApiResponse<T>> {
    return this.getData<T>(`tables/${tableName}/${id}`);
  }
}
