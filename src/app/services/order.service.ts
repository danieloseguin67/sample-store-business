import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Order, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];

  constructor() { }

  createOrder(order: Omit<Order, 'id' | 'createdAt'>): Observable<Order> {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      createdAt: new Date()
    };
    
    this.orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(this.orders));
    
    return of(newOrder).pipe(delay(500));
  }

  getOrdersByUserId(userId: number): Observable<Order[]> {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      this.orders = JSON.parse(savedOrders);
    }
    
    return of(this.orders.filter(order => order.userId === userId));
  }

  getOrderById(orderId: number): Observable<Order | undefined> {
    return of(this.orders.find(order => order.id === orderId));
  }

  updateOrderStatus(orderId: number, status: OrderStatus): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem('orders', JSON.stringify(this.orders));
    }
    return of(order);
  }
}
