/**
 * =============================================================================
 * Checkout Page JavaScript - CoffeeHouse
 * Clean, Organized, and Functional Code
 * =============================================================================
 */

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

let selectedPaymentMethod = 'credit-card';
let shippingCost = 5.99;
let taxRate = 0.08; // 8% tax rate

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize checkout page
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
 * Load cart items from localStorage
 */
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('coffeehouse_cart')) || [];
    const cartItemsContainer = document.getElementById('checkoutCartItems');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5>Your cart is empty</h5>
                <p class="text-muted">Add some coffee beans to get started!</p>
                <a href="products.html" class="btn btn-primary mt-3">
                    <i class="fas fa-coffee me-2"></i>Shop Now
                </a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" class="me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.title}</h6>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="text-muted">Quantity: ${item.qty}</span>
                        <span class="fw-bold">${CoffeeHouse.formatCurrency(item.price)}</span>
                    </div>
                </div>
                <div class="fw-bold">
                    ${CoffeeHouse.formatCurrency(item.price * item.qty)}
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Calculate order totals
 */
function calculateTotals() {
    const cart = JSON.parse(localStorage.getItem('coffeehouse_cart')) || [];

    if (cart.length === 0) {
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('shipping').textContent = '$0.00';
        document.getElementById('tax').textContent = '$0.00';
        document.getElementById('total').textContent = '$0.00';
        return;
    }

    const subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + shippingCost + tax;

    document.getElementById('subtotal').textContent = CoffeeHouse.formatCurrency(subtotal);
    document.getElementById('shipping').textContent = CoffeeHouse.formatCurrency(shippingCost);
    document.getElementById('tax').textContent = CoffeeHouse.formatCurrency(tax);
    document.getElementById('total').textContent = CoffeeHouse.formatCurrency(total);
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
 * Setup event listeners
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
            selectPayment(e.currentTarget.querySelector('input[type="radio"]').value);
        });
    });
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
        cart: JSON.parse(localStorage.getItem('coffeehouse_cart')) || [],
        subtotal: document.getElementById('subtotal').textContent,
        shipping: document.getElementById('shipping').textContent,
        tax: document.getElementById('tax').textContent,
        total: document.getElementById('total').textContent,
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
