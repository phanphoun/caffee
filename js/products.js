/**
 * ============================================================================
 * Products Page JavaScript - CoffeeHouse
 * Handles product display, filtering, sorting, and user interactions
 * ============================================================================
 */

// ============================================================================
// PRODUCT DATA - All available products
// ============================================================================

const allProducts = [
    {
        id: 'ethiopian-single-origin',
        title: 'Ethiopian Single Origin',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
        category: 'single-origin',
        badge: 'New',
        rating: 4.8,
        reviews: 127,
        description: 'Bright, fruity notes with wine-like acidity from Ethiopian highlands',
        features: ['Fruity notes', 'Wine-like acidity', 'Ethiopian highlands', 'Light roast']
    },
    {
        id: 'colombian-blend',
        title: 'Colombian Medium Blend',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        category: 'blends',
        badge: 'Popular',
        rating: 4.6,
        reviews: 89,
        description: 'Well-balanced medium roast with nutty and chocolate notes',
        features: ['Medium roast', 'Nutty notes', 'Chocolate flavor', 'Well-balanced']
    },
    {
        id: 'espresso-roast',
        title: 'Italian Espresso Roast',
        price: 22.99,
        image: 'https://images.deliveryhero.io/image/fd-kh/LH/cnia-listing.jpg',
        category: 'espresso',
        badge: 'Hot',
        rating: 4.7,
        reviews: 234,
        description: 'Dark Italian roast perfect for espresso machines',
        features: ['Dark roast', 'Espresso perfect', 'Italian style', 'Rich flavor']
    },
    {
        id: 'decaf-house-blend',
        title: 'Decaf House Blend',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
        category: 'decaf',
        badge: 'Sale',
        rating: 4.5,
        reviews: 156,
        description: 'Swiss water decaffeinated process preserves flavor',
        features: ['Decaffeinated', 'Swiss water process', 'Flavor preserved', 'Smooth taste']
    },
    {
        id: 'organic-peru',
        title: 'Organic Peru Single Origin',
        price: 26.99,
        image: 'https://un-caffe.com/cdn/shop/files/image_13.jpg?v=1698174491&width=900',
        category: 'organic',
        badge: 'Premium',
        rating: 4.9,
        reviews: 67,
        description: 'Certified organic with smooth, mild flavor profile',
        features: ['Certified organic', 'Smooth flavor', 'Mild profile', 'Peru origin']
    },
    {
        id: 'guatemalan-antigua',
        title: 'Guatemalan Antigua',
        price: 21.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        category: 'single-origin',
        badge: 'Limited',
        rating: 4.8,
        reviews: 45,
        description: 'Volcanic soil creates rich, complex flavor with spicy notes',
        features: ['Volcanic soil', 'Complex flavor', 'Spicy notes', 'Limited edition']
    },
    {
        id: 'breakfast-blend',
        title: 'Breakfast Blend',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop',
        category: 'blends',
        badge: 'Trending',
        rating: 4.4,
        reviews: 89,
        description: 'Smooth morning blend with caramel and vanilla undertones',
        features: ['Morning blend', 'Caramel notes', 'Vanilla undertones', 'Smooth taste']
    },
    {
        id: 'french-roast-dark',
        title: 'French Roast Dark',
        price: 19.99,
        image: 'https://cdn.shopify.com/s/files/1/1083/2612/files/coffee13_480x480.jpg?v=1717389103',
        category: 'espresso',
        badge: 'Pro',
        rating: 4.6,
        reviews: 112,
        description: 'Bold, smoky flavor perfect for French press brewing',
        features: ['Bold flavor', 'Smoky notes', 'French press', 'Dark roast']
    },
    {
        id: 'sumatra-mandheling',
        title: 'Sumatra Mandheling',
        price: 23.99,
        image: 'https://static.vecteezy.com/system/resources/thumbnails/023/513/850/small/hot-coffee-cup-with-coffee-beans-wallpaper-coffee-photo.jpg',
        category: 'single-origin',
        badge: 'Rare',
        rating: 4.8,
        reviews: 78,
        description: 'Earthy, herbal notes with full body and low acidity',
        features: ['Earthy notes', 'Herbal flavor', 'Full body', 'Low acidity']
    },
    {
        id: 'house-decaf-organic',
        title: 'House Organic Decaf',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
        category: 'decaf',
        badge: 'Exclusive',
        rating: 5.0,
        reviews: 23,
        description: 'Organic decaffeinated blend with bright, clean taste',
        features: ['Organic decaf', 'Bright taste', 'Clean flavor', 'Exclusive blend']
    }
];

// ============================================================================
// APPLICATION STATE & VARIABLES
// ============================================================================

let currentProducts = [...allProducts];
let displayedProducts = 6;
let currentFilter = 'all';
let currentSort = 'featured';
let wishlist = JSON.parse(localStorage.getItem('coffeehouse_wishlist')) || [];
let currentQuickViewProduct = null;
let searchTimeout = null;

// ============================================================================
// DOM ELEMENT REFERENCES
// ============================================================================

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterButtons = document.querySelectorAll('[data-filter]');
const cartDropdown = document.getElementById('cartDropdown');
const cartBtn = document.getElementById('cartBtn');
const productCount = document.getElementById('productCount');
const totalProducts = document.getElementById('totalProducts');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

// View state
let currentView = 'grid'; // 'grid' or 'list'

// ============================================================================
// PRODUCT RENDERING FUNCTIONS
// ============================================================================

/**
 * Create product card HTML from product object
 * Includes product image, badge, price, and action buttons
 * @param {Object} product - Product data object
 * @returns {string} HTML string for the product card
 */
function createProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    const cardClass = currentView === 'list' ? 'col-12' : 'col-lg-4 col-md-6 mb-4';

    return `
        <div class="${cardClass} product-item" data-category="${product.category}">
            <div class="product-card ${currentView === 'list' ? 'product-card-list' : ''}" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    ${product.badge ? `<span class="product-badge badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
                    
                    <div class="product-overlay">
                        <button class="quick-view-btn" onclick="showQuickView('${product.id}')">
                            <i class="bi bi-eye me-2"></i>Quick View
                        </button>
                    </div>
                </div>
                <div class="product-body">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="text-muted small">${product.description}</p>
                    <div class="product-rating mb-2">
                        ${generateStars(product.rating)}
                        <span class="text-muted small">(${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price mb-3">
                        <span class="h4 text-primary fw-bold">$${product.price}</span>
                    </div>
                    ${product.features ? `
                        <div class="product-features mb-3">
                            ${product.features.slice(0, 2).map(feature =>
        `<span class="feature-tag">${feature}</span>`
    ).join('')}
                        </div>
                    ` : ''}
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm w-100" onclick="addToCart('${product.id}')">
                            <i class="bi bi-cart-plus me-2"></i>Add to Cart
                        </button>
                        <button class="btn btn-outline-danger btn-sm w-100 mt-2" onclick="toggleWishlist('${product.id}')">
                            <i class="bi ${isInWishlist ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            ${isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate HTML for star rating display
 * Shows full, half, and empty stars based on rating
 * @param {number} rating - Rating value (0-5)
 * @returns {string} HTML string with star icons
 */
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-warning"></i>';
    }

    return stars;
}


/**
 * Render products to the grid with optional loading state
 * Shows skeleton cards during loading, then displays actual products
 * @param {boolean} loading - Show loading skeleton state
 */
function renderProducts(loading = false) {
    if (!productsGrid) return;

    if (loading) {
        productsGrid.innerHTML = generateSkeletonCards(displayedProducts);
        setTimeout(() => {
            renderProducts(false);
        }, 800);
        return;
    }

    const productsToShow = currentProducts.slice(0, displayedProducts);

    productsGrid.innerHTML = productsToShow
        .map(product => createProductCard(product))
        .join('');

    // Update load more button
    if (loadMoreBtn) {
        loadMoreBtn.style.display = displayedProducts >= currentProducts.length ? 'none' : 'inline-block';
    }

    // Add animations
    setTimeout(() => {
        const cards = productsGrid.querySelectorAll('.product-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-fade-in');
            }, index * 100);
        });
    }, 100);
}

// ============================================================================
// FILTERING & SORTING FUNCTIONS
// ============================================================================

/**
 * Filter products by category
 * Updates current products and applies current sort option
 * @param {string} category - Category to filter by (or 'all')
 */
function filterProducts(category) {
    currentFilter = category;

    if (category === 'all') {
        currentProducts = [...allProducts];
    } else {
        currentProducts = allProducts.filter(product => product.category === category);
    }

    // Apply current sort
    sortProducts(currentSort);

    // Reset displayed products
    displayedProducts = 6;

    // Render filtered products
    renderProducts();

    // Update active filter button
    updateFilterButtons(category);
}

/**
 * Sort products based on specified criteria
 * Supports: featured, price-low, price-high, name, rating
 * @param {string} sortBy - Sort option (default: 'featured')
 */
function sortProducts(sortBy) {
    currentSort = sortBy;

    switch (sortBy) {
        case 'price-low':
            currentProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            currentProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            currentProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'rating':
            currentProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'featured':
        default:
            // Keep original order (featured items first)
            break;
    }
}

/**
 * Search products with autocomplete and input sanitization
 */
function searchProducts(query) {
    const searchTerm = sanitizeInput(query.toLowerCase().trim());

    if (!searchTerm) {
        currentProducts = [...allProducts];
        hideSearchResults();
    } else {
        currentProducts = allProducts.filter(product =>
            product.title.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
        showSearchResults(searchTerm);
    }

    // Reset displayed products
    displayedProducts = 6;

    // Render search results
    renderProducts(true);

    // Show message if no results
    if (currentProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5" role="status" aria-live="polite">
                <i class="fas fa-search fa-3x text-muted mb-3" aria-hidden="true"></i>
                <h4>No products found</h4>
                <p class="text-muted">Try searching with different keywords</p>
                <button class="btn btn-outline-primary mt-3" onclick="clearSearch()">
                    <i class="fas fa-times me-2" aria-hidden="true"></i>Clear Search
                </button>
            </div>
        `;

        // Announce to screen readers
        announceToScreenReader(`No products found for "${searchTerm}"`);
    } else {
        // Announce search results to screen readers
        announceToScreenReader(`Found ${currentProducts.length} products for "${searchTerm}"`);
    }
}

/**
 * Show search autocomplete results with accessibility
 */
function showSearchResults(query) {
    if (!searchResults) return;

    const matches = allProducts.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length > 0) {
        searchResults.innerHTML = matches.map((product, index) => `
            <div class="search-result-item" 
                 role="option" 
                 tabindex="0"
                 aria-selected="false"
                 data-product-id="${product.id}"
                 onclick="selectSearchResult('${product.id}')"
                 onkeydown="handleSearchResultKeydown(event, '${product.id}')">
                <img src="${product.image}" alt="${sanitizeInput(product.title)}" aria-hidden="true">
                <div class="search-result-info">
                    <h4>${sanitizeInput(product.title)}</h4>
                    <p>${sanitizeInput(product.description.substring(0, 100))}...</p>
                    <div class="search-result-price">${CoffeeHouse.formatCurrency(product.price)}</div>
                </div>
            </div>
        `).join('');

        searchResults.classList.add('active');
        searchResults.setAttribute('role', 'listbox');
        searchResults.setAttribute('aria-label', 'Search results');

        // Focus first result for keyboard navigation
        const firstResult = searchResults.querySelector('.search-result-item');
        if (firstResult) {
            setTimeout(() => firstResult.focus(), 100);
        }
    } else {
        hideSearchResults();
    }
}

/**
 * Hide search results
 */
function hideSearchResults() {
    if (searchResults) {
        searchResults.classList.remove('active');
    }
}

/**
 * Select search result
 */
function selectSearchResult(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        searchInput.value = sanitizeInput(product.title);
        hideSearchResults();
        searchProducts(product.title);

        // Return focus to search input
        searchInput.focus();
    }
}

/**
 * Handle keyboard navigation for search results
 */
function handleSearchResultKeydown(event, productId) {
    const results = Array.from(searchResults.querySelectorAll('.search-result-item'));
    const currentIndex = results.findIndex(item => item.dataset.productId === productId);

    switch (event.key) {
        case 'Enter':
        case ' ':
            event.preventDefault();
            selectSearchResult(productId);
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (currentIndex < results.length - 1) {
                results[currentIndex + 1].focus();
            }
            break;
        case 'ArrowUp':
            event.preventDefault();
            if (currentIndex > 0) {
                results[currentIndex - 1].focus();
            } else {
                searchInput.focus();
            }
            break;
        case 'Escape':
            event.preventDefault();
            hideSearchResults();
            searchInput.focus();
            break;
    }
}

/**
 * Clear search and reset results
 */
function clearSearch() {
    searchInput.value = '';
    hideSearchResults();
    searchProducts('');
    searchInput.focus();
}

/**
 * Announce message to screen readers
 */
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
        if (announcement.parentNode) {
            announcement.parentNode.removeChild(announcement);
        }
    }, 1000);
}

/**
 * Update filter button states
 */
function updateFilterButtons(activeCategory) {
    filterButtons.forEach(button => {
        if (button.dataset.filter === activeCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// =============================================================================
// WISHLIST FEATURES
// =============================================================================

/**
 * Toggle wishlist status
 */
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const product = allProducts.find(p => p.id === productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        CoffeeHouse.showToast(`${product.title} removed from wishlist`, 'info');
    } else {
        wishlist.push(productId);
        CoffeeHouse.showToast(`${product.title} added to wishlist!`, 'success');
    }

    localStorage.setItem('coffeehouse_wishlist', JSON.stringify(wishlist));
    renderProducts();
    updateQuickViewWishlist();
}

// =============================================================================
// QUICK VIEW FEATURES
// =============================================================================

/**
 * Show quick view modal
 */
function showQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    currentQuickViewProduct = productId;

    // Update modal content
    document.getElementById('quickViewImage').src = product.image;
    document.getElementById('quickViewImage').alt = product.title;
    document.getElementById('quickViewTitle').textContent = product.title;
    document.getElementById('quickViewDescription').textContent = product.description;
    document.getElementById('quickViewPrice').textContent = WatchStore.formatCurrency(product.price);
    document.getElementById('quickViewRating').innerHTML = `
        ${generateStars(product.rating)}
        <small class="text-muted">(${product.reviews} reviews)</small>
    `;

    // Update features
    const features = getProductFeatures(product);
    document.getElementById('quickViewFeatures').innerHTML = features
        .map(feature => `<li><i class="bi bi-check-circle text-success me-2"></i>${feature}</li>`)
        .join('');

    // Update wishlist button
    updateQuickViewWishlist();

    // Show modal
    document.getElementById('quickViewModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close quick view modal
 */
function closeQuickView() {
    document.getElementById('quickViewModal').classList.remove('active');
    document.body.style.overflow = '';
    currentQuickViewProduct = null;
}

/**
 * Update quick view wishlist button
 */
function updateQuickViewWishlist() {
    const btn = document.getElementById('quickViewWishlistBtn');
    if (btn && currentQuickViewProduct) {
        const isInWishlist = wishlist.includes(currentQuickViewProduct);
        btn.className = isInWishlist ? 'bi bi-heart-fill' : 'bi bi-heart';
    }
}

/**
 * Get product features based on category
 */
function getProductFeatures(product) {
    const features = {
        'single-origin': ['Single Farm Origin', 'Traceable Source', 'Unique Flavor Profile', 'Direct Trade'],
        'blends': ['Expertly Crafted Blend', 'Balanced Flavor', 'Consistent Quality', 'Versatile Brewing'],
        'espresso': ['Dark Roast Profile', 'Rich Crema', 'Low Acidity', 'Perfect for Espresso'],
        'decaf': ['Swiss Water Process', 'Flavor Preserved', '99.9% Caffeine Free', 'Same Great Taste'],
        'organic': ['USDA Organic Certified', 'No Pesticides', 'Sustainably Farmed', 'Eco-Friendly']
    };

    return features[product.category] || features.blends;
}

// =============================================================================
// CART DROPDOWN FEATURES
// =============================================================================

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
                    <div class="cart-item-price">${WatchStore.formatCurrency(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.id}', ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button class="quantity-btn" onclick="CoffeeHouse.updateCartQuantity('${item.id}', ${item.qty + 1})">+</button>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="CoffeeHouse.removeFromCart('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotal.textContent = CoffeeHouse.formatCurrency(total);
    }
}

// =============================================================================
// LOADING STATES
// =============================================================================

/**
 * Generate skeleton loading cards
 */
function generateSkeletonCards(count) {
    return Array(count).fill('').map(() => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text price"></div>
            </div>
        </div>
    `).join('');
}

// =============================================================================
// COMPARE FEATURES
// =============================================================================

/**
 * Add product to comparison
 */
function compareProduct(productId) {
    // This is a placeholder for compare feature
    const product = allProducts.find(p => p.id === productId);
    CoffeeHouse.showToast(`Comparison feature coming soon for ${product.title}`, 'info');
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterProducts(button.dataset.filter);
        });
    });

    // Sort select
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
            renderProducts(true);
        });
    }

    // Search feature with autocomplete and easy access
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = sanitizeInput(e.target.value);

            if (query.length > 0) {
                searchTimeout = setTimeout(() => {
                    searchProducts(query);
                }, 300);
            } else {
                hideSearchResults();
                searchProducts('');
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                hideSearchResults();
                searchProducts(e.target.value);
            }
        });

        // Enhanced keyboard navigation for search
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && searchResults.classList.contains('active')) {
                e.preventDefault();
                const firstResult = searchResults.querySelector('.search-result-item');
                if (firstResult) firstResult.focus();
            }
            if (e.key === 'Escape') {
                hideSearchResults();
            }
        });

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                hideSearchResults();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = sanitizeInput(searchInput.value);
            hideSearchResults();
            searchProducts(query);
        });

        // Keyboard support for search button
        searchBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                searchBtn.click();
            }
        });
    }

    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayedProducts = Math.min(displayedProducts + 6, currentProducts.length);
            renderProducts(true);

            // Scroll to newly loaded products
            if (displayedProducts < currentProducts.length) {
                setTimeout(() => {
                    const newProducts = productsGrid.querySelectorAll('.product-item');
                    const lastProduct = newProducts[newProducts.length - 1];
                    if (lastProduct) {
                        lastProduct.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        });
    }

    // Cart dropdown toggle
    if (cartBtn && cartDropdown) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartDropdown.classList.toggle('active');
            updateCartDropdown();
        });

        // Close cart dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#cartBtn') && !e.target.closest('#cartDropdown')) {
                cartDropdown.classList.remove('active');
            }
        });
    }
}

// =============================================================================
// INITIALIZATION
// =============================================================================

/**
 * Initialize products page
 */
function initializeProductsPage() {
    console.log('🛍️ Products Page Initializing...');

    // Setup event listeners
    setupEventListeners();

    // Load initial products with loading state
    renderProducts(true);

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });

    // Close modal on background click
    document.getElementById('quickViewModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'quickViewModal') {
            closeQuickView();
        }
    });

    console.log('✅ Products Page Ready!');
}

// =============================================================================
// START APPLICATION
// =============================================================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeProductsPage);
