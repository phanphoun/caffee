/**
 * ============================================================================
 * CoffeeHouse E-Commerce Website - Main JavaScript
 * Handles cart management, user login, and general features
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
// SECURE STORAGE UTILITIES - Error handling for localStorage operations
// ============================================================================

/**
 * Safely retrieve data from localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - Default value if retrieval fails
 * @returns {*} The parsed data or default value
 */
function safeStorageGet(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error(`Storage error for key ${key}:`, error);
        showToast('Data loading error. Some features may be limited.', 'warning');
        return defaultValue;
    }
}

/**
 * Safely save data to localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {*} data - The data to save
 * @returns {boolean} True if successful, false otherwise
 */
function safeStorageSet(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error(`Storage save error for key ${key}:`, error);
        if (error.name === 'QuotaExceededError') {
            showToast('Storage full. Please clear your browser data.', 'error');
        } else {
            showToast('Failed to save data. Please try again.', 'error');
        }
        return false;
    }
}

/**
 * Safely remove data from localStorage with error handling
 * @param {string} key - The localStorage key
 * @returns {boolean} True if successful, false otherwise
 */
function safeStorageRemove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Storage remove error for key ${key}:`, error);
        return false;
    }
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - The user input to sanitize
 * @returns {string} Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    return input.trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/["'<>]/g, '')
        .substring(0, 500); // Limit length
}

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\(\)+]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Show loading state on a button or element
 * @param {HTMLElement} element - The element to show loading state on
 * @param {string} loadingText - Text to display during loading
 * @param {string} originalContent - Original content to restore
 */
function showLoadingState(element, loadingText = 'Loading...', originalContent = null) {
    if (!element) return;

    // Store original content if not provided
    if (!originalContent) {
        element.dataset.originalContent = element.innerHTML;
    } else {
        element.dataset.originalContent = originalContent;
    }

    // Disable element and show loading state
    element.disabled = true;
    element.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${loadingText}`;

    // Add loading class for styling
    element.classList.add('loading');
}

/**
 * Hide loading state and restore original content
 * @param {HTMLElement} element - The element to hide loading state from
 */
function hideLoadingState(element) {
    if (!element) return;

    // Restore original content
    const originalContent = element.dataset.originalContent;
    if (originalContent) {
        element.innerHTML = originalContent;
        delete element.dataset.originalContent;
    }

    // Re-enable element and remove loading class
    element.disabled = false;
    element.classList.remove('loading');
}

/**
 * Show loading overlay for async operations
 * @param {string} message - Loading message to display
 * @returns {HTMLElement} The loading overlay element
 */
function showLoadingOverlay(message = 'Processing...') {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `
        <div class="loading-overlay-content">
            <div class="spinner"></div>
            <p>${message}</p>
        </div>
    `;

    // Add styles
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    // Style the content
    const content = overlay.querySelector('.loading-overlay-content');
    Object.assign(content.style, {
        background: 'white',
        padding: '2rem',
        borderRadius: '10px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    });

    // Style the spinner
    const spinner = overlay.querySelector('.spinner');
    Object.assign(spinner.style, {
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid var(--primary-color)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
    });

    document.body.appendChild(overlay);

    // Fade in
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);

    return overlay;
}

/**
 * Hide loading overlay
 * @param {HTMLElement} overlay - The overlay element to hide
 */
function hideLoadingOverlay(overlay) {
    if (!overlay) return;

    overlay.style.opacity = '0';
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }, 300);
}

/**
 * Add CSS animation for spinner
 */
function addLoadingStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading {
            opacity: 0.7;
            cursor: not-allowed !important;
        }
        
        .loading-overlay {
            backdrop-filter: blur(2px);
        }
    `;
    document.head.appendChild(style);
}

// ============================================================================
// APPLICATION STATE (Loaded from localStorage with error handling)
// ============================================================================

let cart = safeStorageGet(CONFIG.STORAGE_KEYS.CART, []);
let currentUser = safeStorageGet(CONFIG.STORAGE_KEYS.USER, null);

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
 * Uses secure storage with error handling
 */
function saveCart() {
    if (!safeStorageSet(CONFIG.STORAGE_KEYS.CART, cart)) {
        console.error('Failed to save cart data');
        return false;
    }
    updateCartCount();
    return true;
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
 * Add a product to the shopping cart with loading state
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

        const button = card.querySelector('.btn-add-cart');

        // Show loading state on button
        if (button) {
            showLoadingState(button, 'Adding...');
        }

        // Simulate async operation
        setTimeout(() => {
            try {
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

                if (saveCart()) {
                    // Animate button if it exists
                    if (button) {
                        hideLoadingState(button);
                        animateButton(button);
                    }
                } else {
                    if (button) {
                        hideLoadingState(button);
                    }
                    showToast('Failed to add product to cart', 'error');
                }

            } catch (error) {
                console.error('Error adding to cart:', error);
                if (button) {
                    hideLoadingState(button);
                }
                showToast('Failed to add product to cart', 'error');
            }
        }, 500); // Simulate network delay

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
// USER LOGIN & SESSION
// ============================================================================

/**
 * Check if user is logged in and update UI accordingly
 * Shows/hides login/logout buttons and displays user name
 */
function checkUserSession() {
    const accountName = document.getElementById('accountName');
    const userHeader = document.getElementById('userHeader');
    const headerUserName = document.getElementById('headerUserName');
    const headerUserEmail = document.getElementById('headerUserEmail');
    const loginMenuItem = document.getElementById('loginMenuItem');
    const registerMenuItem = document.getElementById('registerMenuItem');
    const profileMenuItem = document.getElementById('profileMenuItem');
    const ordersMenuItem = document.getElementById('ordersMenuItem');
    const wishlistMenuItem = document.getElementById('wishlistMenuItem');
    const settingsMenuItem = document.getElementById('settingsMenuItem');
    const logoutMenuItem = document.getElementById('logoutMenuItem');
    const divider = document.getElementById('divider');

    if (currentUser && accountName) {
        // User is logged in
        accountName.textContent = currentUser.name || currentUser.username || 'User';

        // Update user header
        if (userHeader && headerUserName && headerUserEmail) {
            userHeader.style.display = 'block';
            headerUserName.textContent = currentUser.name || currentUser.username || 'User';
            headerUserEmail.textContent = currentUser.email || 'No email';
        }

        // Show logged-in menu items
        if (loginMenuItem) loginMenuItem.style.display = 'none';
        if (registerMenuItem) registerMenuItem.style.display = 'none';
        if (profileMenuItem) profileMenuItem.style.display = 'block';
        if (ordersMenuItem) ordersMenuItem.style.display = 'block';
        if (wishlistMenuItem) wishlistMenuItem.style.display = 'block';
        if (settingsMenuItem) settingsMenuItem.style.display = 'block';
        if (logoutMenuItem) logoutMenuItem.style.display = 'block';
        if (divider) divider.style.display = 'block';
    } else {
        // User is not logged in
        if (accountName) accountName.textContent = 'Account';

        // Hide user header
        if (userHeader) userHeader.style.display = 'none';

        // Show logged-out menu items
        if (loginMenuItem) loginMenuItem.style.display = 'block';
        if (registerMenuItem) registerMenuItem.style.display = 'block';
        if (profileMenuItem) profileMenuItem.style.display = 'none';
        if (ordersMenuItem) ordersMenuItem.style.display = 'none';
        if (wishlistMenuItem) wishlistMenuItem.style.display = 'none';
        if (settingsMenuItem) settingsMenuItem.style.display = 'none';
        if (logoutMenuItem) logoutMenuItem.style.display = 'none';
        if (divider) divider.style.display = 'none';
    }
}

/**
 * Log out the current user
 * Clears user data, updates UI, and redirects to home page
 * Uses secure storage operations
 */
function logout() {
    if (safeStorageRemove(CONFIG.STORAGE_KEYS.USER)) {
        currentUser = null;
        checkUserSession();
        showToast('Logged out successfully', 'success');

        // Redirect to home after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showToast('Error during logout. Please try again.', 'error');
    }
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
 * Handle newsletter sign-up with loading state and input checks
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const email = sanitizeInput(emailInput.value);

    // Validate email
    if (!email) {
        showToast('Please enter an email address', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    if (submitBtn) {
        showLoadingState(submitBtn, 'Subscribing...');
    }

    // Simulate API call
    setTimeout(() => {
        // Here you would normally send this to your backend
        showToast('Newsletter subscription successful!', 'success');

        // Reset form and hide loading state
        event.target.reset();
        if (submitBtn) {
            hideLoadingState(submitBtn);
        }
    }, 1000);
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize application when DOM is ready
 */
function initializeApp() {
    console.log('🚀 CoffeeHouse Application Initializing...');

    // Add loading styles
    addLoadingStyles();

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
 * Setup all event listeners including keyboard navigation
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

    // Cart button features
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

                // Focus first cart item if dropdown opens
                if (cartDropdown.classList.contains('active')) {
                    const firstCartItem = cartDropdown.querySelector('.cart-item');
                    if (firstCartItem) {
                        setTimeout(() => firstCartItem.focus(), 100);
                    }
                }
            }
        });

        // Keyboard support for cart button
        cartBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cartBtn.click();
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

    // Keyboard navigation for cart dropdown
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
        cartDropdown.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                cartDropdown.classList.remove('active');
                cartBtn.focus();
            }
        });
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for quick search (if search feature exists)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // Future: implement quick search
        }

        // Alt + C to open cart
        if (e.altKey && e.key === 'c') {
            e.preventDefault();
            if (cartBtn) cartBtn.click();
        }

        // Alt + P to open profile
        if (e.altKey && e.key === 'p') {
            e.preventDefault();
            const loginBtn = document.getElementById('loginBtn');
            if (loginBtn) loginBtn.click();
        }
    });

    // Skip to main content link for accessibility
    addSkipToMainLink();
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
 * Add skip to main content link for accessibility
 */
function addSkipToMainLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-main';
    skipLink.textContent = 'Skip to main content';
    skipLink.setAttribute('aria-label', 'Skip to main content');

    // Add styles for skip link
    Object.assign(skipLink.style, {
        position: 'absolute',
        top: '-40px',
        left: '6px',
        background: 'var(--primary-color)',
        color: 'white',
        padding: '8px',
        textDecoration: 'none',
        borderRadius: '4px',
        zIndex: '10000',
        fontSize: '14px',
        fontWeight: 'bold'
    });

    // Show on focus
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    // Insert at beginning of body
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content id to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.id = 'main-content';
    }
}

/**
 * Update cart dropdown with accessibility improvements
 */
function updateCartDropdown() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center py-4" role="status" aria-live="polite">
                <i class="bi bi-cart-x fa-2x text-muted mb-2" aria-hidden="true"></i>
                <p class="text-muted">Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item" role="listitem" tabindex="0" 
                 aria-label="${item.title}, quantity ${item.qty}, price ${CoffeeHouse.formatCurrency(item.price * item.qty)}">
                <img src="${item.image}" alt="${sanitizeInput(item.title)}" aria-hidden="true">
                <div class="cart-item-info">
                    <div class="cart-item-title">${sanitizeInput(item.title)}</div>
                    <div class="cart-item-price">${CoffeeHouse.formatCurrency(item.price)} each</div>
                    <div class="cart-item-quantity" role="group" aria-label="Quantity controls">
                        <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.id}', ${item.qty - 1})" 
                                title="Decrease quantity" aria-label="Decrease quantity for ${sanitizeInput(item.title)}">−</button>
                        <span class="qty-display" aria-label="Current quantity: ${item.qty}">${item.qty}</span>
                        <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.id}', ${item.qty + 1})" 
                                title="Increase quantity" aria-label="Increase quantity for ${sanitizeInput(item.title)}">+</button>
                    </div>
                    <div class="cart-item-subtotal">Subtotal: <strong>${CoffeeHouse.formatCurrency(item.price * item.qty)}</strong></div>
                </div>
                <button class="btn-remove-item" onclick="CoffeeHouse.removeFromCart('${item.id}')" 
                        title="Remove from cart" aria-label="Remove ${sanitizeInput(item.title)} from cart">
                    <i class="bi bi-trash" aria-hidden="true"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotal.textContent = CoffeeHouse.formatCurrency(total);

        // Add checkout button if items exist
        if (cart.length > 0) {
            cartItems.innerHTML += `
                <div class="text-center mt-3 pt-3 border-top">
                    <a href="checkout.html" class="btn btn-primary w-100" 
                       aria-label="Proceed to checkout with ${cart.length} items">
                        <i class="fas fa-lock me-2" aria-hidden="true"></i>Proceed to Checkout
                    </a>
                </div>
            `;
        }

        // Add keyboard navigation to cart items
        setupCartItemKeyboardNavigation();
    }
}

/**
 * Setup keyboard navigation for cart items
 */
function setupCartItemKeyboardNavigation() {
    const cartItems = document.querySelectorAll('.cart-item[tabindex="0"]');

    cartItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextItem = cartItems[index + 1];
                    if (nextItem) nextItem.focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevItem = cartItems[index - 1];
                    if (prevItem) prevItem.focus();
                    break;
                case 'Delete':
                case 'Backspace':
                    e.preventDefault();
                    const removeBtn = item.querySelector('.btn-remove-item');
                    if (removeBtn) removeBtn.click();
                    break;
            }
        });
    });
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
    formatCurrency,
    checkUserSession,
    updateAccountDropdown
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
