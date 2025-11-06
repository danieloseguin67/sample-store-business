import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { OrderStatus } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  
  shippingInfo = {
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  };

  paymentInfo = {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
      
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    const user = this.authService.getCurrentUser();
    if (user && user.address) {
      this.shippingInfo.fullName = user.name;
      this.shippingInfo.address = user.address.street;
      this.shippingInfo.city = user.address.city;
      this.shippingInfo.state = user.address.state;
      this.shippingInfo.zipCode = user.address.zipCode;
      this.shippingInfo.country = user.address.country;
      this.shippingInfo.phone = user.phone || '';
    }
  }

  submitOrder(): void {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      alert('Please login to complete your order');
      this.router.navigate(['/login']);
      return;
    }

    const order = {
      userId: user.id,
      items: this.cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: this.total,
      status: OrderStatus.PENDING,
      shippingAddress: this.shippingInfo
    };

    this.orderService.createOrder(order).subscribe(() => {
      this.cartService.clearCart();
      alert('Order placed successfully!');
      this.router.navigate(['/profile']);
    });
  }
}
