/* Cart page script */

const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08;

function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('coffeehouse_cart')) || [];
    const container = document.getElementById('cartPageContainer');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                <h5>Your cart is empty</h5>
                <p class="text-muted">Add some coffee beans to get started!</p>
                <a href="products.html" class="btn btn-primary mt-3">Shop Now</a>
            </div>
        `;
        updateTotals();
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="cart-page-item p-3 mb-3 border rounded d-flex gap-3 align-items-start" data-id="${item.cartItemId}">
            <img src="${item.image}" alt="${item.title}" style="width:80px; height:80px; object-fit:cover; border-radius:8px;">
            <div class="flex-grow-1">
                <h5 class="mb-1">${item.title}</h5>
                ${item.description ? `<p class="text-muted small mb-2">${item.description}</p>` : ''}
                <div class="row g-2 align-items-center">
                    <div class="col-auto">
                        <label class="form-label small mb-1">Grind</label>
                        <select id="grind-${item.cartItemId}" class="form-select form-select-sm">
                            <option value="whole-bean">Whole Bean</option>
                            <option value="coarse">Coarse</option>
                            <option value="medium">Medium</option>
                            <option value="fine">Fine</option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="form-label small mb-1">Size</label>
                        <select id="size-${item.cartItemId}" class="form-select form-select-sm">
                            <option value="250g">250g</option>
                            <option value="500g">500g</option>
                            <option value="1kg">1kg</option>
                        </select>
                    </div>
                    <div class="col-auto">
                        <label class="form-label small mb-1">Qty</label>
                        <input id="qty-${item.cartItemId}" type="number" min="1" value="${item.qty}" class="form-control form-control-sm" style="width:80px;">
                    </div>
                    <div class="col-12 mt-2">
                        <input id="note-${item.cartItemId}" type="text" class="form-control form-control-sm" placeholder="Note (optional)" value="${item.options && item.options.notes ? item.options.notes : ''}">
                    </div>
                </div>
            </div>
            <div class="text-end">
                <div class="fw-bold mb-2">${CoffeeHouse.formatCurrency(item.price * item.qty)}</div>
                <button class="btn btn-sm btn-outline-danger remove-item-btn" data-id="${item.cartItemId}">Remove</button>
            </div>
        </div>
    `).join('\n');

    // Initialize selects to current values
    cart.forEach(item => {
        const grindEl = document.getElementById(`grind-${item.cartItemId}`);
        const sizeEl = document.getElementById(`size-${item.cartItemId}`);
        const qtyEl = document.getElementById(`qty-${item.cartItemId}`);
        const noteEl = document.getElementById(`note-${item.cartItemId}`);

        if (grindEl && item.options && item.options.grind) grindEl.value = item.options.grind;
        if (sizeEl && item.options && item.options.size) sizeEl.value = item.options.size;

        // Events
        if (grindEl) grindEl.addEventListener('change', () => {
            CoffeeHouse.updateCartItem(item.cartItemId, { options: { ...(item.options || {}), grind: grindEl.value } });
            renderCartPage();
        });

        if (sizeEl) sizeEl.addEventListener('change', () => {
            CoffeeHouse.updateCartItem(item.cartItemId, { options: { ...(item.options || {}), size: sizeEl.value } });
            renderCartPage();
        });

        if (qtyEl) qtyEl.addEventListener('change', () => {
            const newQty = parseInt(qtyEl.value, 10) || 1;
            CoffeeHouse.updateCartQuantity(item.cartItemId, newQty);
            renderCartPage();
        });

        if (noteEl) noteEl.addEventListener('change', () => {
            CoffeeHouse.updateCartItem(item.cartItemId, { options: { ...(item.options || {}), notes: noteEl.value } });
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            CoffeeHouse.removeFromCart(id);
            renderCartPage();
        });
    });

    updateTotals();
}

function updateTotals() {
    const cart = JSON.parse(localStorage.getItem('coffeehouse_cart')) || [];
    const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + SHIPPING_COST + tax;

    document.getElementById('cartSubtotal').textContent = CoffeeHouse.formatCurrency(subtotal);
    document.getElementById('cartShipping').textContent = CoffeeHouse.formatCurrency(SHIPPING_COST);
    document.getElementById('cartTax').textContent = CoffeeHouse.formatCurrency(tax);
    document.getElementById('cartTotalPage').textContent = CoffeeHouse.formatCurrency(total);
}

function initializeCartPage() {
    document.getElementById('continueShopping').addEventListener('click', () => { window.location.href = 'products.html'; });
    document.getElementById('proceedToCheckout').addEventListener('click', () => { window.location.href = 'checkout.html'; });
    document.getElementById('updateCartBtn').addEventListener('click', () => { renderCartPage(); CoffeeHouse.showToast('Cart updated', 'success'); });

    renderCartPage();
}

document.addEventListener('DOMContentLoaded', initializeCartPage);
