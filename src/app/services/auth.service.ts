import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulated login - in production, this would call an API
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: email,
      address: {
        street: '123 Main St',
        city: 'Montreal',
        state: 'Quebec',
        zipCode: 'H1A 1A1',
        country: 'Canada'
      },
      phone: '(514) 555-0123'
    };

    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    return of(user).pipe(delay(500));
  }

  register(user: User): Observable<User> {
    // Simulated registration - in production, this would call an API
    const newUser = { ...user, id: Date.now() };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
    
    return of(newUser).pipe(delay(500));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
