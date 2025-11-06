# Store Business - Angular Template

A professional Angular 17 template website for e-commerce store businesses with shopping cart, product catalog, and user authentication.

## Features

- ✅ **Product Catalog**: Browse products with categories and filters
- ✅ **Shopping Cart**: Add products to cart with quantity management
- ✅ **User Authentication**: Login and registration system
- ✅ **Checkout Process**: Complete order placement with shipping details
- ✅ **User Profile**: View order history and account information
- ✅ **Responsive Design**: Mobile-friendly layout
- ✅ **Modern UI**: Clean and professional interface

## Project Structure

```
store-business/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── header/              # Navigation header with cart icon
│   │   │   ├── footer/              # Footer component
│   │   │   ├── product-list/        # Product listing with filters
│   │   │   ├── product-detail/      # Individual product details
│   │   │   ├── cart/                # Shopping cart
│   │   │   ├── checkout/            # Checkout form
│   │   │   └── user-profile/        # User profile and order history
│   │   ├── pages/
│   │   │   ├── home/                # Homepage with features
│   │   │   ├── shop/                # Shop page
│   │   │   ├── login/               # Login page
│   │   │   └── register/            # Registration page
│   │   ├── services/
│   │   │   ├── product.service.ts   # Product data management
│   │   │   ├── cart.service.ts      # Shopping cart management
│   │   │   ├── auth.service.ts      # Authentication service
│   │   │   └── order.service.ts     # Order management
│   │   ├── models/
│   │   │   ├── product.model.ts     # Product interface
│   │   │   ├── user.model.ts        # User interface
│   │   │   └── order.model.ts       # Order interface
│   │   ├── app.routes.ts            # Route configuration
│   │   └── app.component.ts         # Main app component
│   └── assets/
│       └── images/                  # Product images
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
ng serve
```

Navigate to `http://localhost:4220/`. The application will automatically reload if you change any of the source files.

### 3. Build for Production

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Routes

The application includes the following routes:

- `/` - Home page with store features
- `/shop` - Product catalog with filters
- `/product/:id` - Individual product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile and order history

## Features in Detail

### Product Catalog

- Browse products by category
- View product details including price, description, and availability
- Add products to cart from list or detail page

### Shopping Cart

- View all items in cart
- Update quantities
- Remove items
- See total price
- Proceed to checkout

### User Authentication

- Register new account
- Login with email and password
- Logout functionality
- User session management

### Checkout Process

- Enter shipping information
- Enter payment details (simulated)
- Place order
- Order confirmation

### User Profile

- View account information
- View order history
- See order status
- Logout

## Sample Data

The application includes sample product data for demonstration:

- Premium Headphones - $299.99
- Smart Watch - $199.99
- Laptop Bag - $49.99
- Wireless Mouse - $29.99

## Data Persistence

- **Cart**: Saved to browser localStorage
- **User Session**: Saved to browser localStorage
- **Orders**: Saved to browser localStorage

**Note**: In a production environment, you would replace localStorage with proper backend API calls.

## Technology Stack

- **Angular**: 17.3.0
- **TypeScript**: 5.4.2
- **RxJS**: 7.8.0
- **SCSS**: For styling

## Customization

### Adding Products

Edit `src/app/services/product.service.ts` to add or modify products in the `products` array.

### Styling

- Update colors and styles in component SCSS files
- Modify global styles in `src/styles.scss`

### API Integration

Replace the mock services with real API calls:

1. Update `ProductService` to fetch from your API
2. Update `AuthService` to use real authentication
3. Update `OrderService` to submit orders to your backend

## Running Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further Development

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Suggested Enhancements

- Add product search functionality
- Implement product reviews and ratings
- Add wishlist feature
- Implement email notifications
- Add payment gateway integration
- Add product inventory management
- Implement admin panel

## Support

For more help on Angular CLI, use `ng help` or check out the [Angular CLI Documentation](https://angular.io/cli).

## License

This project is a template and can be freely used and modified for your business needs.
