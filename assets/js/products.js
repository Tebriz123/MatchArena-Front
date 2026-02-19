// ==========================================
// PRODUCTS PAGE - MATCHARENA
// ==========================================

const PRODUCTS = [
    {
        id: 1,
        name: 'Professional Match Football',
        category: 'balls',
        categoryName: '⚽ Toplar',
        price: 89.99,
        oldPrice: 119.99,
        image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
        brand: 'Nike',
        stock: 15,
        rating: 4.8,
        reviews: 124,
        isNew: true
    },
    {
        id: 2,
        name: 'Home Jersey 2024',
        category: 'jerseys',
        categoryName: '👕 Formalar',
        price: 79.99,
        oldPrice: null,
        image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
        brand: 'Adidas',
        stock: 30,
        rating: 4.7,
        reviews: 203,
        isNew: true
    },
    {
        id: 3,
        name: 'Professional Football Boots',
        category: 'boots',
        categoryName: '👟 Botinlər',
        price: 149.99,
        oldPrice: 199.99,
        image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
        brand: 'Puma',
        stock: 12,
        rating: 4.9,
        reviews: 312,
        isNew: false
    },
    {
        id: 4,
        name: 'Goalkeeper Gloves Pro',
        category: 'goalkeeper',
        categoryName: '🧤 Qapıçı',
        price: 65.99,
        oldPrice: null,
        image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
        brand: 'Uhlsport',
        stock: 8,
        rating: 4.6,
        reviews: 156,
        isNew: false
    },
    {
        id: 5,
        name: 'Training Cones Set (50pcs)',
        category: 'training',
        categoryName: '🏋️ Məşq',
        price: 34.99,
        oldPrice: 49.99,
        image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
        brand: 'Generic',
        stock: 25,
        rating: 4.4,
        reviews: 89,
        isNew: false
    },
    {
        id: 6,
        name: 'Football Socks (3 Pairs)',
        category: 'accessories',
        categoryName: '🎽 Aksessuarlar',
        price: 19.99,
        oldPrice: null,
        image: 'assets/img/WhatsApp Şəkil 2025-06-02 saat 15.17.05_c54a2834.jpg',
        brand: 'Nike',
        stock: 50,
        rating: 4.3,
        reviews: 178,
        isNew: false
    }
];

let allProducts = [...PRODUCTS];
let filteredProducts = [...PRODUCTS];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
});

function loadProducts() {
    showLoading(true);
    setTimeout(() => {
        showLoading(false);
        displayProducts(filteredProducts);
    }, 300);
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyState');
    
    if (products.length === 0) {
        grid.style.display = 'none';
        empty.style.display = 'flex';
        return;
    }
    
    grid.style.display = 'grid';
    empty.style.display = 'none';
    
    grid.innerHTML = products.map(product => {
        const discount = product.oldPrice 
            ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
            : 0;
        
        return `
            <div class="product-card-modern" onclick="goToProduct(${product.id})">
                <div class="product-img-box">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/img/placeholder.jpg'">
                    ${product.isNew ? '<span class="product-label label-new">YENİ</span>' : ''}
                    ${discount > 0 ? `<span class="product-label label-discount">-${discount}%</span>` : ''}
                </div>
                <div class="product-info-box">
                    <div class="product-cat">${product.categoryName}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-meta">${product.brand}</div>
                    <div class="product-rate">
                        <span class="rate-stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}</span>
                        <span class="rate-num">${product.rating} (${product.reviews})</span>
                    </div>
                    <div class="product-bottom">
                        <div class="product-pricing">
                            <span class="price-main">${product.price.toFixed(2)}₼</span>
                            ${product.oldPrice ? `<span class="price-cross">${product.oldPrice.toFixed(2)}₼</span>` : ''}
                        </div>
                        <button class="product-add-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    filteredProducts = [...allProducts];
    
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (priceRange) {
        if (priceRange === '200+') {
            filteredProducts = filteredProducts.filter(p => p.price >= 200);
        } else {
            const [min, max] = priceRange.split('-').map(Number);
            filteredProducts = filteredProducts.filter(p => p.price >= min && p.price <= max);
        }
    }
    
    switch (sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
    }
    
    loadProducts();
}

function resetFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('priceFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    document.getElementById('searchInput').value = '';
    filteredProducts = [...allProducts];
    loadProducts();
}

function performSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!query) {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(p =>
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.categoryName.toLowerCase().includes(query)
        );
    }
    
    loadProducts();
}

function goToProduct(id) {
    window.location.href = `product-detail.html?id=${id}`;
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (product) {
        alert(`✓ "${product.name}" səbətə əlavə edildi!`);
    }
}

function showLoading(show) {
    document.getElementById('loadingState').style.display = show ? 'flex' : 'none';
    document.getElementById('productsGrid').style.display = show ? 'none' : 'grid';
}
