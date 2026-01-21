# CoffeeHouse - Premium Coffee E-Commerce Platform

☕ A modern, fully functional e-commerce website for premium coffee beans with an exceptional shopping experience, user profiles, and complete checkout system.

## 🚀 Features

### **Core E-Commerce Functionality**
- ✅ **Product Catalog**: Browse premium coffee beans with detailed descriptions
- ✅ **Shopping Cart**: Add/remove items, adjust quantities with real-time updates
- ✅ **Cart Dropdown**: Quick cart view with subtotals on any page
- ✅ **Checkout System**: Complete checkout flow with shipping and payment info
- ✅ **Promo Codes**: Apply discount codes (WELCOME10, COFFEE15, SAVE20)
- ✅ **Order Confirmation**: Beautiful order confirmation page with order details
- ✅ **User Profiles**: Users can view and edit their profile information
- ✅ **User Authentication**: Login, register, and session management
- ✅ **Responsive Design**: Perfect experience on all devices (mobile, tablet, desktop)

### **Shopping System**
- **Cart Management**: Persistent shopping cart with localStorage
- **Real-time Calculations**: Automatic subtotal, tax, and total calculation
- **Discount System**: Multiple promo codes with percentage-based discounts
- **Shipping Cost**: Fixed $5.99 shipping (configurable)
- **Tax Calculation**: 8% tax rate applied after discounts
- **Order History**: Orders saved to localStorage for review

### **User Experience**
- **Toast Notifications**: Modern feedback for all user actions
- **Smooth Animations**: Professional transitions and micro-interactions
- **Form Validation**: Real-time email and phone validation
- **Modal Dialogs**: Beautiful profile modal with form controls
- **Visual Feedback**: Button states, loading indicators, success messages
- **Mobile Optimized**: Responsive navigation and layouts

### **Technical Features**
- **Local Storage**: Persistent cart, user data, and order history
- **Clean Code**: Well-organized, documented, modular JavaScript
- **Error Handling**: Graceful error management with user feedback
- **Performance**: Optimized animations and efficient DOM manipulation
- **Accessibility**: Semantic HTML5 with ARIA labels

## 📁 Project Structure

```
CoffeeHouse/
├── index.html                    # Homepage with hero section
├── products.html                 # Product catalog and browsing
├── checkout.html                 # Complete checkout page
├── order-confirmation.html       # Order confirmation page
├── about.html                    # About CoffeeHouse
├── contact.html                  # Contact page
├── login.html                    # User login
├── register.html                 # User registration
├── README.md                     # This file
├── QUICK_START.md                # Quick start guide
├── SHOPPING_SYSTEM.md            # Shopping system documentation
├── PROFILE_FEATURE.md            # Profile feature guide
├── API_REFERENCE.md              # JavaScript API reference
├── css/
│   └── style.css                 # Main stylesheet (900+ lines)
└── js/
    ├── main.js                   # Core cart & app functionality
    ├── products.js               # Product page logic
    ├── checkout.js               # Checkout & order processing
    ├── auth.js                   # Authentication system
    ├── contact.js                # Contact form handling
    └── profile.js                # User profile management
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with proper structure
- **CSS3**: Modern features (variables, animations, gradients, flexbox, grid)
- **JavaScript ES6+**: Clean, modular code with modern practices
- **Bootstrap 5.3.0**: Responsive framework for consistent design
- **Font Awesome 6.0.0**: Icon library for visual elements
- **Remix Icon 4.8.0**: Additional icon set
- **LocalStorage API**: Client-side data persistence

## 🎨 Design System

### **Color Palette** (Coffee Theme)
- **Primary**: #6F4E37 (Coffee Brown)
- **Secondary**: #8B6F47 (Tan/Beige)
- **Light**: #FFF8DC (Cream)
- **Dark**: #3E2723 (Dark Brown)
- **Accent**: #D2691E (Chocolate)
- **Success**: #28a745 (Green)
- **Danger**: #dc3545 (Red)

### **Typography**
- **Font Family**: Segoe UI, Tahoma, Geneva, Verdana (system fonts)
- **Headings**: Bold weights with clear hierarchy
- **Body Text**: 16px for optimal readability

### **Animations**
- **Modal**: Slide-up animation on open, fade-in background
- **Buttons**: Scale and shadow effects on hover
- **Cart**: Badge bounce animation on updates
- **Transitions**: 0.3s cubic-bezier easing for smooth interactions

## 🚀 Getting Started

### **Installation**
1. Clone the repository: `git clone https://github.com/phanphoun/caffee.git`
2. Navigate to project: `cd caffee`
3. Open `index.html` in your browser

### **Quick Test**
1. Browse to **Products** page
2. Click "Add to Cart" on any product
3. Click cart icon to view cart
4. Proceed to checkout
5. Enter shipping info and apply promo code
6. Complete order to see confirmation

### **Test Credentials**
- Any email and password can be used for testing
- User data is stored in localStorage

## 📱 Pages Overview

### **Homepage (index.html)**
- Hero section with featured coffee image
- Call-to-action buttons
- Featured products showcase
- Company benefits section
- Newsletter subscription

### **Products Page (products.html)**
- Product grid with images and pricing
- "Add to Cart" buttons
- Product filtering options
- Price display with ratings
- Real-time cart updates

### **Checkout Page (checkout.html)**
- Shipping information form (name, email, address, etc.)
- Payment method selection (3 options)
- Promo code input field
- Order summary with breakdown:
  - Subtotal
  - Discount (if promo applied)
  - Shipping ($5.99)
  - Tax (8%)
  - **Total**
- Place Order button

### **Order Confirmation (order-confirmation.html)**
- Success animation with checkmark
- Order ID and confirmation details
- Order items list with quantities
- 4-step "Next Steps" guidance
- Action buttons (Continue Shopping, Home)
- Contact information

### **User Profile Modal**
- Accessible from Account dropdown on any page
- Edit fields: Name, Username, Email, Phone, Bio
- Real-time validation
- Save changes to localStorage
- Navbar automatically updates

### **Authentication (login.html & register.html)**
- Modern, clean design
- Form validation with feedback
- Session management
- Remember user between visits

### **About Page (about.html)**
- Company story
- Mission and values
- Company statistics
- Professional presentation

### **Contact Page (contact.html)**
- Contact information
- Contact form
- FAQ section
- Newsletter subscription

## 🛒 Shopping System Details

### **Cart Operations**
```javascript
// Add to cart
CoffeeHouse.addToCart(productId, quantity);

// Remove from cart
CoffeeHouse.removeFromCart(productId);

// Update quantity
CoffeeHouse.updateCartQuantity(productId, newQuantity);

// Get cart total
const total = CoffeeHouse.getCartTotal();
```

### **Promo Codes**
Built-in test codes:
- `WELCOME10` - 10% discount
- `COFFEE15` - 15% discount
- `SAVE20` - 20% discount

### **Data Structure: Order**
```javascript
{
    orderId: 'COF1234567890',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main Street',
    city: 'New York',
    zipCode: '10001',
    country: 'US',
    paymentMethod: 'credit-card',
    cart: [...items],
    subtotal: '$100.00',
    discount: '$10.00',
    shipping: '$5.99',
    tax: '$7.60',
    total: '$103.59',
    orderDate: '2026-01-21T10:30:00Z',
    status: 'confirmed'
}
```

## 🔧 Customization

### **Add New Products**
Edit `js/products.js` and add to the product array:

```javascript
{
    id: 'unique-product-id',
    title: 'Ethiopian Single Origin',
    price: 24.99,
    image: 'https://image-url.jpg',
    category: 'single-origin',
    badge: 'New',
    rating: 4.8,
    reviews: 127
}
```

### **Change Promo Codes**
Edit `js/checkout.js`:

```javascript
const PROMO_CODES = {
    'WELCOME10': 0.10,   // 10% discount
    'COFFEE15': 0.15,    // 15% discount
    'SAVE20': 0.20       // 20% discount
};
```

### **Modify Pricing**
In `js/checkout.js`:

```javascript
let shippingCost = 5.99;     // Change shipping
let taxRate = 0.08;          // Change tax rate (8%)
```

### **Update Colors**
Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #6F4E37;     /* Coffee brown */
    --secondary-color: #8B6F47;   /* Tan */
    --light-color: #FFF8DC;       /* Cream */
    /* ... more variables ... */
}
```

## 📊 localStorage Schema

```javascript
// Shopping Cart
localStorage.coffeehouse_cart = JSON.stringify([
    { id: '1', title: 'Product', price: 24.99, image: 'url', qty: 2 }
]);

// User Data
localStorage.coffeehouse_user = JSON.stringify({
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    bio: 'Coffee lover',
    updatedAt: '2026-01-21T10:30:00Z'
});

// Order History
localStorage.coffeehouse_orders = JSON.stringify([
    { orderId: 'COF...', ...orderData }
]);
```

## 🔐 Security Notes

⚠️ **Current Implementation**: Uses localStorage for demonstration/MVP purposes.

**For Production**, implement:
- [ ] Backend API with Node.js/Express
- [ ] Secure user authentication with JWT tokens
- [ ] Real payment gateway integration (Stripe, PayPal)
- [ ] HTTPS encryption
- [ ] Server-side validation
- [ ] Password hashing and salting
- [ ] CORS security headers
- [ ] Rate limiting
- [ ] SQL injection prevention
- [ ] XSS protection

## 📱 Browser Compatibility

- ✅ **Chrome**: 90+ (full support)
- ✅ **Firefox**: 88+ (full support)
- ✅ **Safari**: 14+ (full support)
- ✅ **Edge**: 90+ (full support)
- ✅ **Mobile**: iOS Safari 12+, Chrome Android
- ✅ **Tablets**: Full responsive support

## 🚀 Performance Optimizations

- **Lazy Loading**: Images load efficiently
- **Debounced Events**: Optimized search and filtering
- **CSS Animations**: GPU-accelerated transitions
- **Local Storage**: Fast data persistence
- **Event Delegation**: Efficient event handling
- **Minified Assets**: Production-ready code

## 📚 Documentation

Additional documentation files included:

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Quick reference and testing guide |
| `SHOPPING_SYSTEM.md` | Complete shopping system documentation |
| `PROFILE_FEATURE.md` | User profile feature guide |
| `API_REFERENCE.md` | JavaScript API and function reference |

## 🛠️ Future Enhancements

Potential improvements for production:

- [ ] Real payment gateway integration
- [ ] Email notifications for orders
- [ ] Order tracking system
- [ ] User accounts with login persistence
- [ ] Wishlist/save for later
- [ ] Product reviews and ratings
- [ ] Advanced filtering and search
- [ ] Abandoned cart recovery
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Shipping rate calculation
- [ ] Inventory management
- [ ] Two-factor authentication
- [ ] Social media integration

## 🐛 Troubleshooting

### **Cart not showing items**
- Check browser console (F12)
- Verify localStorage is enabled
- Clear cache and reload

### **Profile modal not opening**
- Ensure user is logged in (currentUser exists)
- Check profile.js is loaded
- Try refresh page

### **Promo codes not working**
- Verify code is spelled correctly
- Check code exists in PROMO_CODES object
- Ensure subtotal is greater than $0

## 📞 Support & Contact

For questions or issues:

1. Check the documentation files
2. Review code comments
3. Inspect browser console for errors
4. Test in multiple browsers

## 📄 License

This project is open source and available under the MIT License.

---

**CoffeeHouse** - Premium Coffee Beans Delivered 🚀☕

*Last Updated: January 21, 2026*
*Version: 1.0.0*

