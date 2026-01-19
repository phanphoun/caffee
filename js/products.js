/**
 * =============================================================================
 * Products Page JavaScript - CoffeeHouse
 * Clean, Organized, and Functional Code
 * =============================================================================
 */

// =============================================================================
// PRODUCT DATA
// =============================================================================

const allProducts = [
    {
        id: 'ethiopian-single-origin',
        title: 'Ethiopian Single Origin',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        category: 'single-origin',
        badge: 'New',
        rating: 4.8,
        reviews: 127,
        description: 'Bright, fruity notes with wine-like acidity from Ethiopian highlands'
    },
    {
        id: 'colombian-blend',
        title: 'Colombian Medium Blend',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1511920183359-35d252a30cb?w=400&h=300&fit=crop',
        category: 'blends',
        badge: 'Popular',
        rating: 4.6,
        reviews: 89,
        description: 'Well-balanced medium roast with nutty and chocolate notes'
    },
    {
        id: 'espresso-roast',
        title: 'Italian Espresso Roast',
        price: 22.99,
        image: 'https://images.unsplash.com/photo-1517669198052-6d39dc066c5a?w=400&h=300&fit=crop',
        category: 'espresso',
        badge: 'Hot',
        rating: 4.7,
        reviews: 234,
        description: 'Dark Italian roast perfect for espresso machines'
    },
    {
        id: 'decaf-house-blend',
        title: 'Decaf House Blend',
        price: 16.99,
        image: 'https://images.unsplash.com/photo-1509042279840-560ba5c1bd93?w=400&h=300&fit=crop',
        category: 'decaf',
        badge: 'Sale',
        rating: 4.5,
        reviews: 156,
        description: 'Swiss water decaffeinated process preserves flavor'
    },
    {
        id: 'organic-peru',
        title: 'Organic Peru Single Origin',
        price: 26.99,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
        category: 'organic',
        badge: 'Premium',
        rating: 4.9,
        reviews: 67,
        description: 'Certified organic with smooth, mild flavor profile'
    },
    {
        id: 'guatemalan-antigua',
        title: 'Guatemalan Antigua',
        price: 21.99,
        image: 'https://images.unsplash.com/photo-1511920183359-35d252a30cb?w=400&h=300&fit=crop',
        category: 'single-origin',
        badge: 'Limited',
        rating: 4.8,
        reviews: 45,
        description: 'Volcanic soil creates rich, complex flavor with spicy notes'
    },
    {
        id: 'breakfast-blend',
        title: 'Breakfast Blend',
        price: 17.99,
        image: 'https://images.unsplash.com/photo-1517669198052-6d39dc066c5a?w=400&h=300&fit=crop',
        category: 'blends',
        badge: 'Trending',
        rating: 4.4,
        reviews: 89,
        description: 'Smooth morning blend with caramel and vanilla undertones'
    },
    {
        id: 'french-roast-dark',
        title: 'French Roast Dark',
        price: 19.99,
        image: 'https://images.unsplash.com/photo-1517669198052-6d39dc066c5a?w=400&h=300&fit=crop',
        category: 'espresso',
        badge: 'Pro',
        rating: 4.6,
        reviews: 112,
        description: 'Bold, smoky flavor perfect for French press brewing'
    },
    {
        id: 'sumatra-mandheling',
        title: 'Sumatra Mandheling',
        price: 23.99,
        image: 'https://images.unsplash.com/photo-1511920183359-35d252a30cb?w=400&h=300&fit=crop',
        category: 'single-origin',
        badge: 'Rare',
        rating: 4.8,
        reviews: 78,
        description: 'Earthy, herbal notes with full body and low acidity'
    },
    {
        id: 'house-decaf-organic',
        title: 'House Organic Decaf',
        price: 18.99,
        image: 'https://images.unsplash.com/photo-1509042279840-560ba5c1bd93?w=400&h=300&fit=crop',
        category: 'decaf',
        badge: 'Exclusive',
        rating: 5.0,
        reviews: 23,
        description: 'Organic decaffeinated blend with bright, clean taste'
    }
];

// Make product data available globally so other modules can use canonical values
window.allProducts = allProducts;

// =============================================================================
// APPLICATION STATE
// =============================================================================

let currentProducts = [...allProducts];
let displayedProducts = 6;
let currentFilter = 'all';
let currentSort = 'featured';
let wishlist = JSON.parse(localStorage.getItem('coffeehouse_wishlist')) || [];
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
 * Product options
 */
const GRIND_OPTIONS = [
    { value: 'whole-bean', label: 'Whole Bean' },
    { value: 'coarse', label: 'Coarse' },
    { value: 'medium', label: 'Medium' },
    { value: 'fine', label: 'Fine' }
];

const SIZE_OPTIONS = [
    { value: '250g', label: '250g' },
    { value: '500g', label: '500g' },
    { value: '1kg', label: '1kg' }
];

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
                    <div class="product-price">${CoffeeHouse.formatCurrency(product.price)}</div>
                    <button class="btn btn-add-cart" onclick="addToCartDirect('${product.id}', this)">
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
                    <strong>${CoffeeHouse.formatCurrency(product.price)}</strong>
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
    document.getElementById('quickViewPrice').textContent = CoffeeHouse.formatCurrency(product.price);
    document.getElementById('quickViewRating').innerHTML = `
        ${generateStars(product.rating)}
        <small class="text-muted">(${product.reviews} reviews)</small>
    `;

    // Initialize quick view inputs
    const qtyInput = document.getElementById('quickViewQuantity');
    const notesInput = document.getElementById('quickViewNotes');
    const grindSelect = document.getElementById('quickViewGrind');
    const sizeSelect = document.getElementById('quickViewSize');

    if (qtyInput) qtyInput.value = 1;
    if (notesInput) notesInput.value = '';

    if (grindSelect) {
        grindSelect.innerHTML = GRIND_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    }

    if (sizeSelect) {
        sizeSelect.innerHTML = SIZE_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    }

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
// CART DROPDOWN FUNCTIONALITY
// =============================================================================

/**
 * Update cart dropdown (delegates to central implementation)
 */
function updateCartDropdown() {
    if (window.CoffeeHouse && typeof window.CoffeeHouse.updateCartDropdown === 'function') {
        window.CoffeeHouse.updateCartDropdown();
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
    CoffeeHouse.showToast(`Comparison feature coming soon for ${product.title}`, 'info');
}

// 
// EVENT LISTENERS
// 

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

    // Cart dropdown toggle is handled in main.js to keep cart interactions centralized
}

// INITIALIZATION

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


// START APPLICATION


// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', initializeProductsPage);

/**
 * Add product to cart directly from the product card (fast add)
 */
function addToCartDirect(productId, btn) {
    // Use central addToCart
    if (window.CoffeeHouse && typeof window.CoffeeHouse.addToCart === 'function') {
        window.CoffeeHouse.addToCart(productId, 1, {});
    }

    // Button feedback animation
    let button = btn;
    if (!button) {
        button = document.querySelector(`[data-product-id="${productId}"] .btn-add-cart`);
    }

    if (button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
        button.disabled = true;
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 900);
    }

    // Open cart dropdown and show latest data
    const cartDropdown = document.getElementById('cartDropdown');
    if (cartDropdown) {
        cartDropdown.classList.add('active');
        if (window.CoffeeHouse && typeof window.CoffeeHouse.updateCartDropdown === 'function') {
            window.CoffeeHouse.updateCartDropdown();
        }

        // Close it after a short delay so it doesn't stay open forever
        setTimeout(() => {
            cartDropdown.classList.remove('active');
        }, 2500);
    }
}

/**
 * Add product to cart from Quick View
 */
function addToCartFromQuickView() {
    const qtyEl = document.getElementById('quickViewQuantity');
    const notesEl = document.getElementById('quickViewNotes');
    const grindEl = document.getElementById('quickViewGrind');
    const sizeEl = document.getElementById('quickViewSize');

    const qty = qtyEl ? parseInt(qtyEl.value, 10) || 1 : 1;
    const notes = notesEl ? notesEl.value.trim() : '';
    const grind = grindEl ? grindEl.value : GRIND_OPTIONS[0].value;
    const size = sizeEl ? sizeEl.value : SIZE_OPTIONS[0].value;

    if (!currentQuickViewProduct) return;

    if (window.CoffeeHouse && typeof window.CoffeeHouse.addToCart === 'function') {
        window.CoffeeHouse.addToCart(currentQuickViewProduct, qty, { notes, grind, size });
        closeQuickView();

        const cartDropdown = document.getElementById('cartDropdown');
        if (cartDropdown) {
            cartDropdown.classList.add('active');
            if (window.CoffeeHouse && typeof window.CoffeeHouse.updateCartDropdown === 'function') {
                window.CoffeeHouse.updateCartDropdown();
            }
            setTimeout(() => cartDropdown.classList.remove('active'), 2500);
        }
    }
}
