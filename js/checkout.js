/**
 * ============================================================================
 * Checkout Page JavaScript - CoffeeHouse
 * Handles checkout process, cart display, and order processing
 * ============================================================================
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

let selectedPaymentMethod = 'credit-card';
let shippingCost = 5.99;
let taxRate = 0.08; // 8% tax rate
let discountPercentage = 0;
let cartItems = [];

// ============================================================================
// PROMO CODE MANAGEMENT
// ============================================================================

const PROMO_CODES = {
    'WELCOME10': 0.10,  // 10% discount
    'COFFEE15': 0.15,   // 15% discount
    'SAVE20': 0.20      // 20% discount
};

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize checkout page on page load
 */
function initializeCheckout() {
    console.log('🛒 Checkout Page Initializing...');

    // Load cart items
    loadCartItems();

    // Setup event listeners
    setupEventListeners();

    // Calculate totals
    calculateTotals();

    console.log('✅ Checkout Page Ready!');
}

/**
 * Load cart items from localStorage and display
 */
function loadCartItems() {
    cartItems = JSON.parse(localStorage.getItem('coffeehouse_cart')) || [];
    const cartItemsContainer = document.getElementById('checkoutCartItems');

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <h5 class="mt-3">Your cart is empty</h5>
                <p class="text-muted">Add some coffee to your cart before proceeding</p>
                <a href="products.html" class="btn btn-primary mt-3">
                    <i class="fas fa-coffee me-2"></i>Browse Products
                </a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item-checkout">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.title}</div>
                <div class="cart-item-details-row">
                    <span>Qty: <strong>${item.qty}</strong></span>
                    <span>${CoffeeHouse.formatCurrency(item.price)} each</span>
                </div>
                <div class="cart-item-details-row">
                    <span>Subtotal:</span>
                    <span><strong>${CoffeeHouse.formatCurrency(item.price * item.qty)}</strong></span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Calculate order totals including subtotal, tax, shipping, and discount
 */
function calculateTotals() {
    if (cartItems.length === 0) {
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('shipping').textContent = '$0.00';
        document.getElementById('tax').textContent = '$0.00';
        document.getElementById('total').textContent = '$0.00';
        document.getElementById('discountRow').style.display = 'none';
        return;
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);

    // Calculate discount
    const discount = subtotal * discountPercentage;
    const subtotalAfterDiscount = subtotal - discount;

    // Calculate tax
    const tax = subtotalAfterDiscount * taxRate;

    // Calculate total
    const total = subtotalAfterDiscount + shippingCost + tax;

    // Update UI
    document.getElementById('subtotal').textContent = CoffeeHouse.formatCurrency(subtotal);
    document.getElementById('shipping').textContent = CoffeeHouse.formatCurrency(shippingCost);
    document.getElementById('tax').textContent = CoffeeHouse.formatCurrency(tax);
    document.getElementById('total').textContent = CoffeeHouse.formatCurrency(total);

    // Show/hide discount row
    const discountRow = document.getElementById('discountRow');
    if (discountPercentage > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discount').textContent = CoffeeHouse.formatCurrency(discount);
    } else {
        discountRow.style.display = 'none';
    }
}

/**
 * Apply promo code to order
 */
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.toUpperCase().trim();
    const promoMessage = document.getElementById('promoMessage');

    if (!promoCode) {
        promoMessage.textContent = '';
        discountPercentage = 0;
        calculateTotals();
        return;
    }

    if (PROMO_CODES[promoCode]) {
        discountPercentage = PROMO_CODES[promoCode];
        const discountPercent = Math.round(discountPercentage * 100);
        promoMessage.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i>Promo code applied! ${discountPercent}% discount saved.`;
        promoMessage.className = 'text-success';
        calculateTotals();
        CoffeeHouse.showToast(`${discountPercent}% discount applied!`, 'success');
    } else {
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.className = 'text-danger';
        discountPercentage = 0;
        calculateTotals();
    }
}



/**
 * Select payment method
 */
function selectPayment(method) {
    selectedPaymentMethod = method;

    // Update UI
    document.querySelectorAll('.payment-method').forEach(el => {
        el.classList.remove('selected');
    });

    event.currentTarget.classList.add('selected');

    // Update radio button
    document.getElementById(method).checked = true;
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }

    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', (e) => {
            const radioButton = e.currentTarget.querySelector('input[type="radio"]');
            if (radioButton) {
                selectPayment(radioButton.value);
            }
        });
    });

    // Promo code application
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }

    // Allow Enter key to apply promo code
    const promoInput = document.getElementById('promoCode');
    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
}

/**
 * Handle checkout form submission
 */
function handleCheckoutSubmit(event) {
    event.preventDefault();

    // Validate form
    if (!validateCheckoutForm()) {
        return;
    }

    // Calculate final totals for order
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const discount = subtotal * discountPercentage;
    const subtotalAfterDiscount = subtotal - discount;
    const tax = subtotalAfterDiscount * taxRate;
    const total = subtotalAfterDiscount + shippingCost + tax;

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        zipCode: document.getElementById('zipCode').value,
        country: document.getElementById('country').value,
        paymentMethod: selectedPaymentMethod,
        cart: cartItems,
        subtotal: CoffeeHouse.formatCurrency(subtotal),
        discount: CoffeeHouse.formatCurrency(discount),
        shipping: CoffeeHouse.formatCurrency(shippingCost),
        tax: CoffeeHouse.formatCurrency(tax),
        total: CoffeeHouse.formatCurrency(total),
        orderDate: new Date().toISOString()
    };

    // Simulate order processing
    processOrder(formData);
}

/**
 * Validate checkout form
 */
function validateCheckoutForm() {
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'zipCode', 'country'];

    for (let field of required) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.classList.add('is-invalid');
            CoffeeHouse.showToast(`${field.replace(/([A-Z])/g, ' $1').trim()} is required`, 'error');
            element.focus();
            return false;
        } else {
            element.classList.remove('is-invalid');
        }
    }

    // Validate email
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email').classList.add('is-invalid');
        CoffeeHouse.showToast('Please enter a valid email address', 'error');
        return false;
    }

    return true;
}

/**
 * Process order (simulation)
 */
function processOrder(orderData) {
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';

    // Simulate API call
    setTimeout(() => {
        // Generate order ID
        const orderId = 'COF' + Date.now();

        // Save order to localStorage (for order history)
        const orders = JSON.parse(localStorage.getItem('coffeehouse_orders')) || [];
        orders.push({
            ...orderData,
            orderId: orderId,
            status: 'confirmed'
        });
        localStorage.setItem('coffeehouse_orders', JSON.stringify(orders));

        // Clear cart
        localStorage.removeItem('coffeehouse_cart');

        // Show success message
        CoffeeHouse.showToast('Order placed successfully! Order ID: ' + orderId, 'success');

        // Redirect to order confirmation
        setTimeout(() => {
            window.location.href = `order-confirmation.html?order=${orderId}`;
        }, 2000);

    }, 2000);
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeCheckout);
