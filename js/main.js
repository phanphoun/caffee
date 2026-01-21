/**
 * ============================================================================
 * CoffeeHouse E-Commerce Website - Main JavaScript
 * Handles cart management, user authentication, and general functionality
 * ============================================================================
 */

// ============================================================================
// GLOBAL CONFIGURATION
// ============================================================================

const CONFIG = {
    API_BASE_URL: '/api',
    STORAGE_KEYS: {
        CART: 'coffeehouse_cart',
        USER: 'coffeehouse_user',
        WISHLIST: 'coffeehouse_wishlist'
    },
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 3000
};

// ============================================================================
// APPLICATION STATE (Loaded from localStorage)
// ============================================================================

let cart = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CART)) || [];
let currentUser = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USER)) || null;

// ============================================================================
// UTILITY FUNCTIONS - Formatting & Notifications
// ============================================================================

/**
 * Format amount as currency (USD)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string (e.g., "$24.99")
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * Display a toast notification message
 * Automatically hides existing toasts before showing a new one
 * @param {string} message - The message to display
 * @param {string} type - The notification type: 'success', 'error', 'warning', or 'info'
 */
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;

    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'error' ? 'fa-exclamation-circle' :
            type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} me-2"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? 'var(--success-color)' :
            type === 'error' ? 'var(--danger-color)' :
                type === 'warning' ? 'var(--warning-color)' : 'var(--info-color)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        zIndex: '9999',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        maxWidth: '350px',
        fontSize: '14px'
    });

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, CONFIG.TOAST_DURATION);
}

/**
 * Update the cart badge count display with animation
 * Adds bounce effect when count changes
 */
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;

    const total = cart.reduce((sum, item) => sum + item.qty, 0);

    // Add bounce animation
    cartCount.style.transform = 'scale(1.3)';
    cartCount.style.transition = 'transform 0.3s ease';

    setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
    }, 200);

    cartCount.textContent = total;
}

/**
 * Save cart to localStorage for persistence across sessions
 */
function saveCart() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartCount();
}

/**
 * Extract product information from a product card element
 * Used when card element is available instead of product object
 * @param {HTMLElement} card - The product card DOM element
 * @returns {Object} Product data with id, title, price, and image
 * @throws {Error} If required product information is missing
 */
function getProductDataFromCard(card) {
    const title = card.querySelector('.product-title')?.textContent ||
        card.querySelector('h3')?.textContent ||
        card.querySelector('h2')?.textContent;
    const priceText = card.querySelector('.product-price')?.textContent ||
        card.querySelector('.price')?.textContent;
    const image = card.querySelector('img')?.src;
    const id = card.dataset.productId || title?.toLowerCase().replace(/\s+/g, '-');

    if (!title || !priceText) {
        throw new Error('Missing product information');
    }

    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    return { id, title, price, image };
}

// ============================================================================
// CART FUNCTIONS
// ============================================================================

/**
 * Add a product to the shopping cart
 * Updates quantity if product already exists, shows user feedback
 * @param {string} productId - The unique product identifier
 * @param {number} quantity - Number of items to add (default: 1)
 */
function addToCart(productId, quantity = 1) {
    try {
        const card = document.querySelector(`[data-product-id="${productId}"]`) ||
            document.querySelector('.product-card');

        if (!card) {
            showToast('Product not found', 'error');
            return;
        }

        const productData = getProductDataFromCard(card);

        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === productData.id);

        if (existingItem) {
            existingItem.qty += quantity;
            showToast(`${productData.title} quantity updated (${existingItem.qty} in cart)`, 'success');
        } else {
            cart.push({
                ...productData,
                qty: quantity
            });
            showToast(`${productData.title} added to cart!`, 'success');
        }

        saveCart();

        // Animate button if it exists
        const button = card.querySelector('.btn-add-cart');
        if (button) {
            animateButton(button);
        }

    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Failed to add product to cart', 'error');
    }
}

/**
 * Animate button to show success feedback
 * Changes button text and color, then reverts after 1 second
 * @param {HTMLElement} button - The button element to animate
 */
function animateButton(button) {
    const originalText = button.innerHTML;
    const originalBg = button.style.background;

    // Show success state
    button.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
    button.style.background = 'var(--success-color)';
    button.disabled = true;

    // Reset after delay
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = originalBg;
        button.disabled = false;
    }, 1000);
}

/**
 * Remove a product from the shopping cart
 * @param {string} productId - The product ID to remove
 */
function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        const item = cart[index];
        cart.splice(index, 1);
        saveCart();
        showToast(`${item.title} removed from cart`, 'success');
    }
}

/**
 * Update quantity for a cart item or remove if quantity <= 0
 * @param {string} productId - The product ID to update
 * @param {number} newQuantity - The new quantity amount
 */
function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.qty = newQuantity;
            saveCart();
        }
    }
}

/**
 * Calculate the total cost of all items in the cart
 * @returns {number} Total cart value
 */
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// ============================================================================
// USER AUTHENTICATION & SESSION
// ============================================================================

/**
 * Check if user is logged in and update UI accordingly
 * Shows/hides login/logout buttons and displays user name
 */
function checkUserSession() {
    const accountName = document.getElementById('accountName');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const divider = document.getElementById('divider');

    if (currentUser && accountName) {
        // User is logged in
        accountName.textContent = currentUser.name || currentUser.username || 'User';

        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (divider) divider.style.display = 'block';
    } else {
        // User is not logged in
        if (accountName) accountName.textContent = 'Account';

        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (divider) divider.style.display = 'none';
    }
}

/**
 * Log out the current user
 * Clears user data, updates UI, and redirects to home page
 */
function logout() {
    localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
    currentUser = null;
    checkUserSession();
    showToast('Logged out successfully', 'success');

    // Redirect to home after a short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// ============================================================================
// PRODUCT FUNCTIONS
// ============================================================================

/**
 * Sample product data used for demonstration
 */
const sampleProducts = [
    {
        id: 'ethiopian-single-origin',
        title: 'Ethiopian Single Origin',
        price: 24.99,
        image: 'https://shotkit.com/wp-content/uploads/bb-plugin/cache/Featured-Image-1-landscape-8cdc89f23466421621b09d4e2ae1bc97-zybravgx2q47.jpg',
        category: 'single-origin',
        badge: 'New',
        rating: 4.8,
        reviews: 127
    },
    {
        id: 'colombian-blend',
        title: 'Colombian Medium Blend',
        price: 18.99,
        image: 'https://www.shutterstock.com/image-photo/pouring-milk-into-glass-iced-600nw-2315393453.jpg',
        category: 'blends',
        badge: 'Popular',
        rating: 4.6,
        reviews: 89
    },
    {
        id: 'espresso-roast',
        title: 'Italian Espresso Roast',
        price: 22.99,
        image: 'https://static.vecteezy.com/system/resources/previews/003/828/683/large_2x/roasted-coffee-beans-in-jute-bag-on-the-wooden-table-with-coffee-field-farm-background-in-brazil-photo.jpg',
        category: 'espresso',
        badge: 'Hot',
        rating: 4.7,
        reviews: 234
    },
    {
        id: 'decaf-house-blend',
        title: 'Decaf House Blend',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
        category: 'decaf',
        badge: 'Sale',
        rating: 4.5,
        reviews: 156
    }
];

/**
 * Create product card HTML from product data
 * @param {Object} product - Product object containing title, price, image, etc.
 * @returns {string} HTML string for product card
 */
function createProductCard(product) {
    return `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                </div>
                <div class="product-body">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating)}
                        <small class="text-muted">(${product.reviews})</small>
                    </div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    <button class="btn btn-add-cart" onclick="addToCart('${product.id}')">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate HTML for star rating display
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }

    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }

    return stars;
}

/**
 * Load featured products
 */
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    container.innerHTML = sampleProducts
        .slice(0, 4)
        .map(product => createProductCard(product))
        .join('');
}

// =============================================================================
// FORM HANDLERS
// =============================================================================

/**
 * Handle newsletter subscription
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;

    // Here you would normally send this to your backend
    showToast('Newsletter subscription successful!', 'success');
    event.target.reset();
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize application when DOM is ready
 */
function initializeApp() {
    console.log('🚀 CoffeeHouse Application Initializing...');

    // Check user session
    checkUserSession();

    // Update cart count
    updateCartCount();

    // Load featured products
    loadFeaturedProducts();

    // Setup event listeners
    setupEventListeners();

    // Add animations to elements
    addScrollAnimations();

    console.log('✅ CoffeeHouse Application Ready!');
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Cart button functionality
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (cart.length === 0) {
                showToast('Your cart is empty', 'info');
                return;
            }

            // Toggle cart dropdown
            const cartDropdown = document.getElementById('cartDropdown');
            if (cartDropdown) {
                cartDropdown.classList.toggle('active');
                updateCartDropdown();
            }
        });
    }

    // Close cart dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const cartDropdown = document.getElementById('cartDropdown');
        const cartBtn = document.getElementById('cartBtn');

        if (cartDropdown && !cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });
}

/**
 * Add scroll animations to elements
 */
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe feature cards and product cards
    document.querySelectorAll('.feature-card, .product-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Update cart dropdown
 */
function updateCartDropdown() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-cart-x fa-2x text-muted mb-2"></i>
                <p class="text-muted">Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${CoffeeHouse.formatCurrency(item.price)} each</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.id}', ${item.qty - 1})" title="Decrease quantity">−</button>
                        <span class="qty-display">${item.qty}</span>
                        <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.id}', ${item.qty + 1})" title="Increase quantity">+</button>
                    </div>
                    <div class="cart-item-subtotal">Subtotal: <strong>${CoffeeHouse.formatCurrency(item.price * item.qty)}</strong></div>
                </div>
                <button class="btn-remove-item" onclick="CoffeeHouse.removeFromCart('${item.id}')" title="Remove from cart">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotal.textContent = CoffeeHouse.formatCurrency(total);

        // Add checkout button if items exist
        if (cart.length > 0) {
            cartItems.innerHTML += `
                <div class="text-center mt-3 pt-3 border-top">
                    <a href="checkout.html" class="btn btn-primary w-100">
                        <i class="fas fa-lock me-2"></i>Proceed to Checkout
                    </a>
                </div>
            `;
        }
    }
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global access
window.CoffeeHouse = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    showToast,
    formatCurrency
};


// js/main.js
function applyAuthUI(user) {
    const show = (el, on) => el.classList.toggle('d-none', !on);
    show(document.getElementById('loginBtn'), !user);
    show(document.getElementById('registerBtn'), !user);
    show(document.getElementById('divider'), !!user);
    show(document.getElementById('logoutBtn'), !!user);
    document.getElementById('accountName').textContent = user ? user.name : 'Account';
}
