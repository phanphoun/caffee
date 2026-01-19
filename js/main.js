/**
 * CoffeeHouse - Main Application JS
 * Cleaned and de-duplicated version
 */

// =============================================================================
// CONFIG & STATE
// =============================================================================

const CONFIG = {
    STORAGE_KEYS: {
        CART: 'coffeehouse_cart',
        USER: 'coffeehouse_user',
        WISHLIST: 'coffeehouse_wishlist'
    },
    TOAST_DURATION: 3000
};

let cart = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CART)) || [];
let currentUser = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.USER)) || null;

// =============================================================================
// UTILITIES
// =============================================================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function showToast(message, type = 'success') {
    // Simple toast implementation
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    Object.assign(toast.style, {
        position: 'fixed', top: '20px', right: '20px', padding: '0.75rem 1rem', background: '#333', color: 'white', borderRadius: '8px', zIndex: 9999
    });
    document.body.appendChild(toast);

    setTimeout(() => { toast.remove(); }, CONFIG.TOAST_DURATION);
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    const total = cart.reduce((sum, it) => sum + it.qty, 0);
    cartCount.textContent = total;
}

function saveCart() {
    localStorage.setItem(CONFIG.STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartCount();
}

function getProductDataFromCard(card) {
    if (!card) return null;
    const title = card.querySelector('.product-title')?.textContent || card.querySelector('h3')?.textContent || '';
    const priceText = card.querySelector('.product-price')?.textContent || '';
    const image = card.querySelector('img')?.src || '';
    const id = card.dataset.productId || title.toLowerCase().replace(/\s+/g, '-');
    const description = card.querySelector('p')?.textContent || '';
    const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
    return { id, title, price, image, description };
}

function generateCartItemId(productId) {
    return `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

function animateButton(button) {
    const original = { html: button.innerHTML, bg: button.style.background };
    button.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
    button.style.background = 'var(--success-color)';
    button.disabled = true;
    setTimeout(() => {
        button.innerHTML = original.html;
        button.style.background = original.bg;
        button.disabled = false;
    }, 1000);
}

// =============================================================================
// CART OPERATIONS
// =============================================================================

function addToCart(productId, quantity = 1, options = {}) {
    // Find canonical product if available
    let product = null;
    if (window.allProducts && Array.isArray(window.allProducts)) {
        product = window.allProducts.find(p => p.id === productId);
    }

    if (!product) {
        // Try DOM card
        const card = document.querySelector(`[data-product-id="${productId}"]`);
        if (card) product = getProductDataFromCard(card);
    }

    if (!product) {
        showToast('Product not found', 'error');
        return;
    }

    const normalizedOptions = { ...(options || {}) };

    // Merge if same id + options
    const existing = cart.find(i => i.id === product.id && JSON.stringify(i.options || {}) === JSON.stringify(normalizedOptions));
    if (existing) {
        existing.qty += quantity;
        showToast(`${existing.title} quantity updated (${existing.qty})`, 'success');
    } else {
        const item = {
            cartItemId: generateCartItemId(product.id),
            id: product.id,
            title: product.title,
            price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
            image: product.image || '',
            description: product.description || '',
            qty: quantity,
            options: normalizedOptions
        };
        cart.push(item);
        showToast(`${item.title} added to cart`, 'success');
    }

    saveCart();
    updateCartDropdown();
}

function removeFromCart(cartItemId) {
    const idx = cart.findIndex(i => i.cartItemId === cartItemId);
    if (idx > -1) {
        const removed = cart.splice(idx, 1)[0];
        saveCart();
        updateCartDropdown();
        showToast(`${removed.title} removed from cart`, 'success');
    }
}

function updateCartQuantity(cartItemId, newQty) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    if (newQty <= 0) return removeFromCart(cartItemId);
    item.qty = newQty;
    saveCart();
    updateCartDropdown();
}

function updateCartItem(cartItemId, updates = {}) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    if (typeof updates.qty === 'number') item.qty = updates.qty;
    if (updates.options && typeof updates.options === 'object') item.options = { ...(item.options || {}), ...updates.options };
    if (typeof updates.note === 'string') item.options = { ...(item.options || {}), notes: updates.note };
    saveCart();
    updateCartDropdown();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartDropdown();
}

function getCartTotal() {
    return cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
}

// =============================================================================
// SAMPLE PRODUCT (Featured)
// =============================================================================

const sampleProducts = [
    { id: 'ethiopian-single-origin', title: 'Ethiopian Single Origin', price: 24.99, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', category: 'single-origin', badge: 'New', rating: 4.8, reviews: 127 },
    { id: 'colombian-blend', title: 'Colombian Medium Blend', price: 18.99, image: 'https://images.unsplash.com/photo-1511920183359-35d252a30cb?w=400&h=300&fit=crop', category: 'blends', badge: 'Popular', rating: 4.6, reviews: 89 },
    { id: 'espresso-roast', title: 'Italian Espresso Roast', price: 22.99, image: 'https://images.unsplash.com/photo-1517669198052-6d39dc066c5a?w=400&h=300&fit=crop', category: 'espresso', badge: 'Hot', rating: 4.7, reviews: 234 },
    { id: 'decaf-house-blend', title: 'Decaf House Blend', price: 16.99, image: 'https://images.unsplash.com/photo-1509042279840-560ba5c1bd93?w=400&h=300&fit=crop', category: 'decaf', badge: 'Sale', rating: 4.5, reviews: 156 }
];

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = (rating % 1) >= 0.5;
    const empty = 5 - fullStars - (hasHalf ? 1 : 0);
    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star text-warning"></i>';
    if (hasHalf) html += '<i class="fas fa-star-half-alt text-warning"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star text-warning"></i>';
    return html;
}

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
                    <div class="product-rating mb-2">${generateStars(product.rating)} <small class="text-muted">(${product.reviews})</small></div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    <button class="btn btn-add-cart" onclick="showQuickView('${product.id}')">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    container.innerHTML = sampleProducts.slice(0, 4).map(p => createProductCard(p)).join('');
}

// =============================================================================
// FORMS / INIT
// =============================================================================

function handleNewsletterSubmit(ev) { ev.preventDefault(); showToast('Newsletter subscription successful!', 'success'); ev.target.reset(); }

function checkUserSession() {
    const accountName = document.getElementById('accountName');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const divider = document.getElementById('divider');

    if (currentUser && accountName) {
        accountName.textContent = currentUser.name || currentUser.username || 'User';
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (divider) divider.style.display = 'block';
    } else {
        if (accountName) accountName.textContent = 'Account';
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (divider) divider.style.display = 'none';
    }
}

function logout() { localStorage.removeItem(CONFIG.STORAGE_KEYS.USER); currentUser = null; checkUserSession(); showToast('Logged out successfully', 'success'); setTimeout(() => { window.location.href = 'index.html'; }, 1000); }

function addScrollAnimations() {
    const observer = new IntersectionObserver((entries, obs) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('animate-fade-in'); obs.unobserve(entry.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.feature-card, .product-card').forEach(el => observer.observe(el));
}

function updateCartDropdown() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    if (!cartItems || !cartTotal) return;
    cart = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEYS.CART)) || cart;
    if (cart.length === 0) {
        cartItems.innerHTML = `<div class="text-center py-4"><i class="bi bi-cart-x fa-2x text-muted mb-2"></i><p class="text-muted">Your cart is empty</p></div>`;
        cartTotal.textContent = formatCurrency(0);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                ${item.description ? `<div class="cart-item-desc text-muted small">${item.description}</div>` : ''}
                ${item.options && item.options.notes ? `<div class="text-muted small">Note: ${item.options.notes}</div>` : ''}
                ${item.options && item.options.grind ? `<div class="text-muted small">Grind: ${item.options.grind}</div>` : ''}
                ${item.options && item.options.size ? `<div class="text-muted small">Size: ${item.options.size}</div>` : ''}
                <div class="cart-item-meta d-flex align-items-center justify-content-between mt-2">
                    <div>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.cartItemId}', ${item.qty - 1})">-</button>
                            <span class="mx-2">${item.qty}</span>
                            <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.cartItemId}', ${item.qty + 1})">+</button>
                        </div>
                    </div>
                    <div class="fw-bold">${formatCurrency(item.price * item.qty)}</div>
                </div>
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="CoffeeHouse.removeFromCart('${item.cartItemId}')"><i class="bi bi-trash"></i></button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    cartTotal.textContent = formatCurrency(total);

    cartItems.innerHTML += `
        <div class="text-center mt-3 pt-3 border-top">
            <a href="cart.html" class="btn btn-light w-100 mb-2">View Cart</a>
            <a href="checkout.html" class="btn btn-primary w-100"><i class="fas fa-lock me-2"></i>Proceed to Checkout</a>
        </div>
    `;
}

function setupEventListeners() {
    const logoutBtn = document.getElementById('logoutBtn'); if (logoutBtn) logoutBtn.addEventListener('click', logout);
    const newsletterForm = document.getElementById('newsletterForm'); if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterSubmit);

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => { e.stopPropagation(); saveCart(); const cartDropdown = document.getElementById('cartDropdown'); if (cartDropdown) { cartDropdown.classList.toggle('active'); updateCartDropdown(); } });
        document.addEventListener('click', (e) => { const cartDropdown = document.getElementById('cartDropdown'); if (!e.target.closest('#cartBtn') && !e.target.closest('#cartDropdown')) { if (cartDropdown) cartDropdown.classList.remove('active'); } });
    }
}

function initializeApp() {
    checkUserSession();
    updateCartCount();
    loadFeaturedProducts();
    setupEventListeners();
    addScrollAnimations();
}

document.addEventListener('DOMContentLoaded', initializeApp);

// Export minimal API
window.CoffeeHouse = { addToCart, removeFromCart, updateCartQuantity, updateCartItem, clearCart, getCartTotal, showToast, formatCurrency, updateCartDropdown, saveCart };