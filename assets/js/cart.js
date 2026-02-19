// ==========================================
// SHOPPING CART - MATCHARENA
// ==========================================

let cart = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayCart();
    updateCartBadge();
});

// ==========================================
// LOAD CART FROM LOCALSTORAGE
// ==========================================

function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// ==========================================
// SAVE CART TO LOCALSTORAGE
// ==========================================

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// ==========================================
// DISPLAY CART
// ==========================================

function displayCart() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (!cartItemsList) return;
    
    // Check if cart is empty
    if (cart.length === 0) {
        emptyCart.style.display = 'flex';
        cartContent.style.display = 'none';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartContent.style.display = 'block';
    
    // Display cart items
    cartItemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            
            <div class="cart-item-details">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-meta">Ölçü: ${item.size}</p>
                <p class="cart-item-price">${item.price.toFixed(2)}₼</p>
            </div>
            
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="10" readonly>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                
                <div class="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}₼
                </div>
                
                <button class="btn-remove" onclick="removeFromCart(${index})" title="Sil">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    // Update summary
    updateCartSummary();
}

// ==========================================
// UPDATE QUANTITY
// ==========================================

function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    if (newQuantity > 10) {
        alert('Maksimum miqdar 10-dur');
        return;
    }
    
    cart[index].quantity = newQuantity;
    saveCart();
    displayCart();
}

// ==========================================
// REMOVE FROM CART
// ==========================================

function removeFromCart(index) {
    const item = cart[index];
    
    if (confirm(`"${item.name}" məhsulunu səbətdən silmək istədiyinizdən əminsiniz?`)) {
        cart.splice(index, 1);
        saveCart();
        displayCart();
        
        // Show notification
        showNotification('Məhsul səbətdən silindi');
    }
}

// ==========================================
// CLEAR CART
// ==========================================

function clearCart() {
    if (cart.length === 0) {
        alert('Səbət artıq boşdur');
        return;
    }
    
    if (confirm('Səbəti tamamilə təmizləmək istədiyinizdən əminsiniz?')) {
        cart = [];
        saveCart();
        displayCart();
        showNotification('Səbət təmizləndi');
    }
}

// ==========================================
// UPDATE CART SUMMARY
// ==========================================

function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 100 ? 0 : 5;
    const total = subtotal + shippingCost;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}₼`;
    document.getElementById('shippingCost').textContent = shippingCost > 0 ? `${shippingCost.toFixed(2)}₼` : 'Pulsuz';
    document.getElementById('totalAmount').textContent = `${total.toFixed(2)}₼`;
}

// ==========================================
// UPDATE CART BADGE
// ==========================================

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update all cart badges
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// ==========================================
// PROCEED TO CHECKOUT
// ==========================================

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Səbətiniz boşdur');
        return;
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal >= 100 ? 0 : 5;
    const total = subtotal + shippingCost;
    
    // Create payment data
    const paymentData = {
        type: 'product',
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            quantity: item.quantity
        })),
        total: total
    };
    
    // Save to localStorage for checkout page
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

// ==========================================
// SHOW NOTIFICATION
// ==========================================

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ==========================================
// ADD TO CART (Called from product pages)
// ==========================================

function addToCartFromPage(product) {
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => 
        item.id === product.id && item.size === product.size
    );
    
    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += product.quantity;
    } else {
        // Add new item
        cart.push(product);
    }
    
    saveCart();
    showNotification(`${product.name} səbətə əlavə edildi`);
}
