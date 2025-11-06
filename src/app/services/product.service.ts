import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Premium Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      imageUrl: 'assets/images/headphones.svg',
      category: 'Electronics',
      stock: 50,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Fitness tracking smartwatch with heart rate monitor',
      price: 199.99,
      imageUrl: 'assets/images/smartwatch.svg',
      category: 'Electronics',
      stock: 30,
      rating: 4.3
    },
    {
      id: 3,
      name: 'Laptop Bag',
      description: 'Durable laptop bag with multiple compartments',
      price: 49.99,
      imageUrl: 'assets/images/bag.svg',
      category: 'Accessories',
      stock: 100,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse with precision tracking',
      price: 29.99,
      imageUrl: 'assets/images/mouse.svg',
      category: 'Accessories',
      stock: 75,
      rating: 4.4
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(p => p.id === id));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return of(this.products.filter(p => p.category === category));
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowerQuery = query.toLowerCase();
    return of(this.products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.description.toLowerCase().includes(lowerQuery)
    ));
  }
}
