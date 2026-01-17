/**
 * =============================================================================
 * Products Page JavaScript - WatchStore
 * Clean, Organized, and Functional Code
 * =============================================================================
 */

// =============================================================================
// PRODUCT DATA
// =============================================================================

const allProducts = [
    {
        id: 'luxury-gold-watch',
        title: 'Luxury Gold Watch',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        category: 'luxury',
        badge: 'New',
        rating: 4.8,
        reviews: 127,
        description: 'Exquisite gold-plated luxury watch with Swiss movement'
    },
    {
        id: 'smart-watch-pro',
        title: 'Smart Watch Pro',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
        category: 'smart',
        badge: 'Sale',
        rating: 4.6,
        reviews: 89,
        description: 'Advanced smartwatch with health tracking and GPS'
    },
    {
        id: 'classic-leather',
        title: 'Classic Leather Watch',
        price: 599.99,
        image: 'https://images.unsplash.com/photo-1515347619252-f638703af87e?w=400&h=300&fit=crop',
        category: 'classic',
        badge: 'Popular',
        rating: 4.7,
        reviews: 234,
        description: 'Timeless design with genuine leather strap'
    },
    {
        id: 'sport-digital',
        title: 'Sport Digital Watch',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1542496650-6ac245b5fb4a?w=400&h=300&fit=crop',
        category: 'sport',
        badge: 'Hot',
        rating: 4.5,
        reviews: 156,
        description: 'Rugged digital watch for outdoor adventures'
    },
    {
        id: 'elegant-rose',
        title: 'Elegant Rose Gold',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1515372039030-ce4a3668c0ff?w=400&h=300&fit=crop',
        category: 'luxury',
        badge: 'Limited',
        rating: 4.9,
        reviews: 67,
        description: 'Elegant rose gold timepiece with mother-of-pearl dial'
    },
    {
        id: 'fitness-tracker',
        title: 'Fitness Tracker Watch',
        price: 149.99,
        image: 'https://images.unsplash.com/photo-1575311372332-9cfe6d3b8b8f?w=400&h=300&fit=crop',
        category: 'smart',
        badge: 'New',
        rating: 4.3,
        reviews: 198,
        description: 'Comprehensive fitness tracking with heart rate monitor'
    },
    {
        id: 'vintage-automatic',
        title: 'Vintage Automatic',
        price: 749.99,
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
        category: 'classic',
        badge: 'Rare',
        rating: 4.8,
        reviews: 45,
        description: 'Vintage automatic movement with exhibition case back'
    },
    {
        id: 'diving-watch',
        title: 'Professional Diving Watch',
        price: 449.99,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
        category: 'sport',
        badge: 'Pro',
        rating: 4.6,
        reviews: 112,
        description: 'Professional diving watch with 200m water resistance'
    },
    {
        id: 'minimalist-design',
        title: 'Minimalist Design Watch',
        price: 299.99,
        image: 'https://images.unsplash.com/photo-1515372039030-ce4a3668c0ff?w=400&h=300&fit=crop',
        category: 'classic',
        badge: 'Trending',
        rating: 4.4,
        reviews: 89,
        description: 'Clean minimalist design with Japanese movement'
    },
    {
        id: 'smartwatch-ultra',
        title: 'Smartwatch Ultra',
        price: 599.99,
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=300&fit=crop',
        category: 'smart',
        badge: 'Premium',
        rating: 4.7,
        reviews: 143,
        description: 'Premium smartwatch with advanced health features'
    },
    {
        id: 'chronograph-sport',
        title: 'Chronograph Sport Watch',
        price: 349.99,
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
        category: 'sport',
        badge: 'Sport',
        rating: 4.5,
        reviews: 78,
        description: 'Sport chronograph with tachymeter function'
    },
    {
        id: 'diamond-luxury',
        title: 'Diamond Luxury Watch',
        price: 2499.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        category: 'luxury',
        badge: 'Exclusive',
        rating: 5.0,
        reviews: 23,
        description: 'Luxury watch with genuine diamond bezel'
    }
];

// =============================================================================
// APPLICATION STATE
// =============================================================================

let currentProducts = [...allProducts];
let displayedProducts = 6;
let currentFilter = 'all';
let currentSort = 'featured';
let wishlist = JSON.parse(localStorage.getItem('watchstore_wishlist')) || [];
let currentQuickViewProduct = null;
let searchTimeout = null;

// =============================================================================
// DOM ELEMENTS
// =============================================================================

const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');
const sortSelect = document.getElementById('sortSelect');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const filterButtons = document.querySelectorAll('[data-filter]');
const cartDropdown = document.getElementById('cartDropdown');
const cartBtn = document.getElementById('cartBtn');

// =============================================================================
// PRODUCT RENDERING
// =============================================================================

/**
 * Create product card HTML
 */
function createProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    return `
        <div class="col-lg-4 col-md-6 mb-4 product-item" data-category="${product.category}">
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="product-action-btn wishlist ${isInWishlist ? 'active' : ''}" 
                                onclick="toggleWishlist('${product.id}')" title="Add to Wishlist">
                            <i class="bi bi-heart${isInWishlist ? '-fill' : ''}"></i>
                        </button>
                        <button class="product-action-btn" onclick="showQuickView('${product.id}')" 
                                title="Quick View">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="product-action-btn" onclick="compareProduct('${product.id}')" 
                                title="Compare">
                            <i class="bi bi-arrows-angle-expand"></i>
                        </button>
                    </div>
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
                        <small class="text-muted">(${product.reviews} reviews)</small>
                    </div>
                    <div class="product-price">${WatchStore.formatCurrency(product.price)}</div>
                    <button class="btn btn-add-cart" onclick="WatchStore.addToCart('${product.id}')">
                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Generate star rating HTML
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
 * Render products to the grid with loading states
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

// =============================================================================
// FILTERING AND SORTING
// =============================================================================

/**
 * Filter products by category
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
 * Sort products
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
 * Search products with autocomplete
 */
function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();

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
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No products found</h4>
                <p class="text-muted">Try searching with different keywords</p>
            </div>
        `;
    }
}

/**
 * Show search autocomplete results
 */
function showSearchResults(query) {
    if (!searchResults) return;

    const matches = allProducts.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    ).slice(0, 5);

    if (matches.length > 0) {
        searchResults.innerHTML = matches.map(product => `
            <div class="search-result-item" onclick="selectSearchResult('${product.id}')">
                <img src="${product.image}" alt="${product.title}">
                <div class="search-result-info">
                    <h4>${product.title}</h4>
                    <p>${product.description}</p>
                </div>
                <div class="ms-auto">
                    <strong>${WatchStore.formatCurrency(product.price)}</strong>
                </div>
            </div>
        `).join('');
        searchResults.classList.add('active');
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
        searchInput.value = product.title;
        hideSearchResults();
        searchProducts(product.title);
    }
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
// WISHLIST FUNCTIONALITY
// =============================================================================

/**
 * Toggle wishlist status
 */
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const product = allProducts.find(p => p.id === productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        WatchStore.showToast(`${product.title} removed from wishlist`, 'info');
    } else {
        wishlist.push(productId);
        WatchStore.showToast(`${product.title} added to wishlist!`, 'success');
    }

    localStorage.setItem('watchstore_wishlist', JSON.stringify(wishlist));
    renderProducts();
    updateQuickViewWishlist();
}

// =============================================================================
// QUICK VIEW FUNCTIONALITY
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
        luxury: ['Swiss Movement', 'Sapphire Crystal', 'Water Resistant', 'Premium Materials'],
        smart: ['Heart Rate Monitor', 'GPS Tracking', 'Bluetooth Connectivity', 'Mobile App Integration'],
        classic: ['Japanese Quartz', 'Genuine Leather Strap', 'Date Display', 'Minimalist Design'],
        sport: ['Chronograph Function', 'Tachymeter', '200m Water Resistance', 'Shock Resistant']
    };

    return features[product.category] || features.classic;
}

// =============================================================================
// CART DROPDOWN FUNCTIONALITY
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
                        <button class="quantity-btn" onclick="WatchStore.updateCartQuantity('${item.id}', ${item.qty - 1})">-</button>
                        <span>${item.qty}</span>
                        <button class="quantity-btn" onclick="WatchStore.updateCartQuantity('${item.id}', ${item.qty + 1})">+</button>
                    </div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="WatchStore.removeFromCart('${item.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        cartTotal.textContent = WatchStore.formatCurrency(total);
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
// COMPARISON FUNCTIONALITY
// =============================================================================

/**
 * Add product to comparison
 */
function compareProduct(productId) {
    // This is a placeholder for comparison functionality
    const product = allProducts.find(p => p.id === productId);
    WatchStore.showToast(`Comparison feature coming soon for ${product.title}`, 'info');
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

    // Search functionality with autocomplete
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value;

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
                hideSearchResults();
                searchProducts(e.target.value);
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
            hideSearchResults();
            searchProducts(searchInput.value);
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
