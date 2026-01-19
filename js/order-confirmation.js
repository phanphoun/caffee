/**
 * =============================================================================
 * Order Confirmation Page JavaScript - CoffeeHouse
 * Clean, Organized, and Functional Code
 * =============================================================================
 */

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize order confirmation page
 */
function initializeOrderConfirmation() {
    console.log('📋 Order Confirmation Page Initializing...');

    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');

    if (!orderId) {
        // If no order ID, redirect to home
        window.location.href = 'index.html';
        return;
    }

    // Load order details
    loadOrderDetails(orderId);

    console.log('✅ Order Confirmation Page Ready!');
}

/**
 * Load order details from localStorage
 */
function loadOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('coffeehouse_orders')) || [];
    const order = orders.find(o => o.orderId === orderId);

    if (!order) {
        // Order not found, show error
        document.querySelector('.confirmation-body').innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4>Order Not Found</h4>
                <p class="text-muted">We couldn't find order #${orderId}</p>
                <a href="index.html" class="btn btn-primary mt-3">
                    <i class="fas fa-home me-2"></i>Return to Home
                </a>
            </div>
        `;
        return;
    }

    // Display order information
    displayOrderInformation(order);
}

/**
 * Display order information
 */
function displayOrderInformation(order) {
    // Order number and date
    document.getElementById('orderNumber').textContent = order.orderId;
    document.getElementById('orderDate').textContent = new Date(order.orderDate).toLocaleDateString();

    // Order items
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = order.cart.map(item => `
        <div class="order-item">
            <div class="d-flex align-items-center">
                <img src="${item.image}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" class="me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.title}</h6>
                    <div class="d-flex justify-content-between">
                        <span class="text-muted">Quantity: ${item.qty}</span>
                        <span>${CoffeeHouse.formatCurrency(item.price)}</span>
                    </div>
                </div>
                <div class="fw-bold">
                    ${CoffeeHouse.formatCurrency(item.price * item.qty)}
                </div>
            </div>
        </div>
    `).join('');

    // Order totals
    document.getElementById('orderSubtotal').textContent = order.subtotal;
    document.getElementById('orderShipping').textContent = order.shipping;
    document.getElementById('orderTax').textContent = order.tax;
    document.getElementById('orderTotal').textContent = order.total;

    // Shipping address
    const shippingAddressContainer = document.getElementById('shippingAddress');
    shippingAddressContainer.innerHTML = `
        <div class="mb-2">
            <strong>${order.firstName} ${order.lastName}</strong>
        </div>
        ${order.address ? `<div class="mb-2">${order.address}</div>` : ''}
        ${order.city && order.zipCode ? `<div class="mb-2">${order.city}, ${order.zipCode}</div>` : ''}
        ${order.country ? `<div class="mb-2">${order.country}</div>` : ''}
        ${order.email ? `<div class="mb-2"><i class="fas fa-envelope me-2"></i>${order.email}</div>` : ''}
        ${order.phone ? `<div><i class="fas fa-phone me-2"></i>${order.phone}</div>` : ''}
    `;

    // Update page title
    document.title = `Order #${order.orderId} - CoffeeHouse`;
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeOrderConfirmation);
