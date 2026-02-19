// ==========================================
// PRODUCT DETAIL PAGE - MATCHARENA
// ==========================================

const PRODUCTS = {
    1: {
        id: 1,
        name: 'Professional Match Football',
        category: 'balls',
        categoryName: '⚽ Toplar',
        price: 89.99,
        oldPrice: 119.99,
        brand: 'Nike',
        stock: 15,
        rating: 4.7,
        reviews: 203,
        description: 'Yüksək keyfiyyətli idman forması. Nəfəs ala bilən material, tez quruyan texnologiya. Komanda iştirakı və məşqlər üçün idealdır.',
        images: [
            'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
            'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
            'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg'
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        features: [
            '✓ Nəfəs ala bilən material',
            '✓ Tez quruyur',
            '✓ Anti-bacterial texnologiya',
            '✓ Rahat dizayn',
            '✓ Yüksək keyfiyyət'
        ]
    },
    2: {
        id: 2,
        name: 'Home Jersey 2024',
        category: 'jerseys',
        categoryName: '👕 Formalar',
        price: 79.99,
        oldPrice: null,
        brand: 'Adidas',
        stock: 30,
        rating: 4.7,
        reviews: 203,
        description: 'Yüksək keyfiyyətli idman forması. Nəfəs ala bilən material, tez quruyan texnologiya. Komanda iştirakı və məşqlər üçün idealdır.',
        images: ['assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg'],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        features: [
            '✓ Nəfəs ala bilən material',
            '✓ Tez quruyur',
            '✓ Anti-bacterial texnologiya',
            '✓ Rahat dizayn',
            '✓ Yüksək keyfiyyət'
        ]
    },
    3: {
        id: 3,
        name: 'Professional Football Boots',
        category: 'boots',
        categoryName: '👟 Botinlər',
        price: 149.99,
        oldPrice: 199.99,
        brand: 'Puma',
        stock: 12,
        rating: 4.9,
        reviews: 312,
        description: 'Professional futbol botinkası. Yüngül və davamlı konstruksiya, mükəmməl yol tutumu və rahatlıq.',
        images: ['assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg'],
        sizes: ['39', '40', '41', '42', '43', '44', '45'],
        features: [
            '✓ Yüngül konstruksiya',
            '✓ Mükəmməl yol tutumu',
            '✓ Anti-slip texnologiya',
            '✓ Rahat daxili',
            '✓ Davamlı material'
        ]
    }
};

let currentProduct = null;
let selectedSize = null;
let quantity = 1;

document.addEventListener('DOMContentLoaded', () => {
    const productId = new URLSearchParams(window.location.search).get('id');
    if (productId && PRODUCTS[productId]) {
        loadProduct(productId);
    } else {
        alert('Məhsul tapılmadı');
        window.location.href = 'products.html';
    }
});

function loadProduct(id) {
    currentProduct = PRODUCTS[id];
    
    document.getElementById('productCategory').textContent = currentProduct.categoryName;
    document.getElementById('productTitle').textContent = currentProduct.name;
    document.getElementById('productBrand').textContent = currentProduct.brand;
    
    const stars = '★'.repeat(Math.floor(currentProduct.rating)) + '☆'.repeat(5 - Math.floor(currentProduct.rating));
    document.getElementById('productStars').textContent = stars;
    document.getElementById('ratingCount').textContent = `${currentProduct.rating} (${currentProduct.reviews} rəy)`;
    
    document.getElementById('currentPrice').textContent = `${currentProduct.price.toFixed(2)}₼`;
    
    if (currentProduct.oldPrice) {
        document.getElementById('oldPrice').textContent = `${currentProduct.oldPrice.toFixed(2)}₼`;
        document.getElementById('oldPrice').style.display = 'inline';
    } else {
        document.getElementById('oldPrice').style.display = 'none';
    }
    
    document.getElementById('stockCount').textContent = `${currentProduct.stock} ədəd stokda`;
    document.getElementById('productDescription').textContent = currentProduct.description;
    
    document.getElementById('mainImage').src = currentProduct.images[0];
    
    const thumbs = document.getElementById('thumbnails');
    thumbs.innerHTML = currentProduct.images.map((img, i) => `
        <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="changeImage('${img}', this)">
            <img src="${img}" alt="Thumb ${i + 1}">
        </div>
    `).join('');
    
    const sizeOptions = document.getElementById('sizeOptions');
    sizeOptions.innerHTML = currentProduct.sizes.map(size => `
        <button class="size-button" onclick="selectSize('${size}', this)">${size}</button>
    `).join('');
    
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = currentProduct.features.map(f => `<li>${f}</li>`).join('');
    
    loadRelatedProducts();
}

function changeImage(src, element) {
    document.getElementById('mainImage').src = src;
    document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
}

function selectSize(size, element) {
    selectedSize = size;
    document.querySelectorAll('.size-button').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function increaseQty() {
    if (quantity < currentProduct.stock) {
        quantity++;
        document.getElementById('quantity').value = quantity;
    }
}

function decreaseQty() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('quantity').value = quantity;
    }
}

function addToCart() {
    if (!selectedSize) {
        alert('⚠️ Zəhmət olmasa ölçü seçin!');
        return;
    }
    
    // Get existing cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => 
        item.id === currentProduct.id && item.size === selectedSize
    );
    
    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new item
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images[0],
            size: selectedSize,
            quantity: quantity
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    showNotification(`✓ ${quantity} ədəd "${currentProduct.name}" səbətə əlavə edildi!`);
    
    // Update cart badge
    updateCartBadge();
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        ${message}
        <a href="cart.html" style="color: white; text-decoration: underline; margin-left: 10px;">Səbətə get</a>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function buyNow() {
    if (!selectedSize) {
        alert('⚠️ Zəhmət olmasa ölçü seçin!');
        return;
    }
    
    // Create payment data for checkout
    const paymentData = {
        type: 'product',
        items: [{
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images[0],
            size: selectedSize,
            quantity: quantity
        }],
        total: currentProduct.price * quantity
    };
    
    // Save to localStorage for checkout page
    localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
    
    // Redirect to checkout
    window.location.href = 'checkout.html';
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart badge if it exists
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function loadRelatedProducts() {
    const related = [
        { id: 2, name: 'Home Jersey 2024', price: 79.99, image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg', categoryName: '👕 Formalar', brand: 'Adidas', rating: 4.7, reviews: 203 },
        { id: 3, name: 'Professional Football Boots', price: 149.99, oldPrice: 199.99, image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg', categoryName: '👟 Botinlər', brand: 'Puma', rating: 4.9, reviews: 312 },
        { id: 4, name: 'Goalkeeper Gloves Pro', price: 65.99, image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg', categoryName: '🧤 Qapıçı', brand: 'Uhlsport', rating: 4.6, reviews: 156 }
    ];
    
    const grid = document.getElementById('relatedProducts');
    grid.innerHTML = related.map(p => {
        const discount = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
        return `
            <div class="product-card-modern" onclick="window.location.href='product-detail.html?id=${p.id}'">
                <div class="product-img-box">
                    <img src="${p.image}" alt="${p.name}">
                    ${discount > 0 ? `<span class="product-label label-discount">-${discount}%</span>` : ''}
                </div>
                <div class="product-info-box">
                    <div class="product-cat">${p.categoryName}</div>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-meta">${p.brand}</div>
                    <div class="product-rate">
                        <span class="rate-stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}</span>
                        <span class="rate-num">${p.rating}</span>
                    </div>
                    <div class="product-bottom">
                        <div class="product-pricing">
                            <span class="price-main">${p.price.toFixed(2)}₼</span>
                            ${p.oldPrice ? `<span class="price-cross">${p.oldPrice.toFixed(2)}₼</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}
