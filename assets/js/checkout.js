// ==========================================
// CHECKOUT PAGE - STRIPE INTEGRATION
// ==========================================

// Note: Load api-config.js before this file in HTML
// <script src="assets/js/api-config.js"></script>
// <script src="assets/js/checkout.js"></script>

let stripe;
let elements;
let cardNumberElement;
let cardExpiryElement;
let cardCvcElement;
let paymentData = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Get payment data from URL or localStorage
    loadPaymentData();
    
    // Initialize Stripe
    await initializeStripe();
    
    // Load order summary
    displayOrderSummary();
    
    // Setup form
    setupPaymentForm();
});

// ==========================================
// STRIPE INITIALIZATION
// ==========================================

async function initializeStripe() {
    try {
        // Initialize Stripe with config
        stripe = Stripe(API_CONFIG.stripe.publishableKey);
        
        // Create Elements instance
        elements = stripe.elements();
        
        // Common element style
        const elementStyle = {
            base: {
                fontSize: '16px',
                color: '#e2e8f0',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                '::placeholder': {
                    color: '#64748b'
                }
            },
            invalid: {
                color: '#ef4444',
                iconColor: '#ef4444'
            }
        };
        
        // Create and mount Card Number Element
        cardNumberElement = elements.create('cardNumber', {
            style: elementStyle,
            showIcon: true
        });
        cardNumberElement.mount('#card-number-element');
        
        // Create and mount Card Expiry Element
        cardExpiryElement = elements.create('cardExpiry', {
            style: elementStyle
        });
        cardExpiryElement.mount('#card-expiry-element');
        
        // Create and mount Card CVC Element
        cardCvcElement = elements.create('cardCvc', {
            style: elementStyle
        });
        cardCvcElement.mount('#card-cvc-element');
        
        // Handle real-time validation errors for all elements
        const displayError = document.getElementById('card-errors');
        
        cardNumberElement.on('change', (event) => {
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        cardExpiryElement.on('change', (event) => {
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        cardCvcElement.on('change', (event) => {
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
    } catch (error) {
        console.error('Stripe initialization error:', error);
        showMessage('Ödəniş sistemi yüklənə bilmədi. Səhifəni yeniləyin.', 'error');
    }
}

// ==========================================
// LOAD PAYMENT DATA
// ==========================================

function loadPaymentData() {
    // Get data from localStorage (set by product or field page)
    const storedData = localStorage.getItem('pendingPayment');
    
    if (storedData) {
        paymentData = JSON.parse(storedData);
    } else {
        // Redirect back if no payment data
        alert('Ödəniş məlumatları tapılmadı');
        window.location.href = 'index.html';
        return;
    }
    
    // Show delivery section for products
    if (paymentData.type === 'product') {
        document.getElementById('deliverySection').style.display = 'block';
    }
}

// ==========================================
// DISPLAY ORDER SUMMARY
// ==========================================

function displayOrderSummary() {
    const orderItemsDiv = document.getElementById('orderItems');
    let html = '';
    
    if (paymentData.type === 'product') {
        // Product purchase
        paymentData.items.forEach(item => {
            html += `
                <div class="summary-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>Ölçü: ${item.size} | Miqdar: ${item.quantity}</p>
                    </div>
                    <div class="item-price">
                        ${(item.price * item.quantity).toFixed(2)}₼
                    </div>
                </div>
            `;
        });
        
        // Calculate totals
        const subtotal = paymentData.items.reduce((sum, item) => 
            sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 100 ? 0 : 5; // Free shipping over 100₼
        const total = subtotal + shipping;
        
        document.getElementById('subtotal').textContent = `${subtotal.toFixed(2)}₼`;
        document.getElementById('shipping').textContent = shipping > 0 ? `${shipping.toFixed(2)}₼` : 'Pulsuz';
        document.getElementById('total').textContent = `${total.toFixed(2)}₼`;
        
        paymentData.total = total;
        
    } else if (paymentData.type === 'field') {
        // Field reservation
        html = `
            <div class="summary-item">
                <div class="item-details">
                    <h4>${paymentData.fieldName}</h4>
                    <p>📅 ${paymentData.date}</p>
                    <p>🕐 ${paymentData.timeSlot}</p>
                    <p>⏱️ ${paymentData.duration} saat</p>
                </div>
                <div class="item-price">
                    ${paymentData.total.toFixed(2)}₼
                </div>
            </div>
        `;
        
        document.getElementById('subtotal').textContent = `${paymentData.total.toFixed(2)}₼`;
        document.getElementById('shipping').textContent = '-';
        document.getElementById('total').textContent = `${paymentData.total.toFixed(2)}₼`;
    }
    
    orderItemsDiv.innerHTML = html;
}

// ==========================================
// SETUP PAYMENT FORM
// ==========================================

function setupPaymentForm() {
    const form = document.getElementById('payment-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            // Step 1: Create Payment Intent
            const { clientSecret, paymentIntentId } = await createPaymentIntent();
            
            // Step 2: Confirm payment with Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardNumberElement,
                    billing_details: {
                        name: document.getElementById('customerName').value,
                        email: document.getElementById('customerEmail').value,
                        phone: document.getElementById('customerPhone').value,
                    }
                }
            });
            
            if (error) {
                showMessage(error.message, 'error');
                setLoading(false);
                return;
            }
            
            // Step 3: Confirm with backend
            if (paymentIntent.status === 'succeeded') {
                await confirmPaymentWithBackend(paymentIntentId, paymentIntent.id);
                
                // Clear pending payment
                localStorage.removeItem('pendingPayment');
                
                // Clear cart if payment was from cart
                if (paymentData.type === 'product') {
                    localStorage.removeItem('cart');
                }
                
                // Redirect to success page
                window.location.href = `payment-success.html?id=${paymentIntent.id}`;
            }
            
        } catch (error) {
            console.error('Payment error:', error);
            showMessage('Ödəniş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.', 'error');
            setLoading(false);
        }
    });
}

// ==========================================
// VALIDATE FORM
// ==========================================

function validateForm() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    
    if (!name || !email || !phone) {
        showMessage('Zəhmət olmasa bütün məcburi sahələri doldurun', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Düzgün email daxil edin', 'error');
        return false;
    }
    
    // Check delivery address for products
    if (paymentData.type === 'product') {
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        
        if (!address || !city) {
            showMessage('Çatdırılma ünvanını doldurun', 'error');
            return false;
        }
    }
    
    return true;
}

// ==========================================
// CREATE PAYMENT INTENT
// ==========================================

async function createPaymentIntent() {
    const requestData = {
        type: paymentData.type,
        amount: paymentData.total,
        currency: 'azn',
        metadata: {
            fieldId: paymentData.fieldId,
            productIds: paymentData.items?.map(i => i.id).join(','),
            customerName: document.getElementById('customerName').value,
            customerEmail: document.getElementById('customerEmail').value,
            customerPhone: document.getElementById('customerPhone').value,
        }
    };
    
    return await paymentAPI.createIntent(requestData);
}

// ==========================================
// CONFIRM PAYMENT WITH BACKEND
// ==========================================

async function confirmPaymentWithBackend(paymentIntentId, stripePaymentId) {
    const requestBody = {
        paymentIntentId,
        stripePaymentId,
        type: paymentData.type,
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
    };
    
    // Add type-specific data
    if (paymentData.type === 'product') {
        requestBody.items = paymentData.items;
        requestBody.deliveryAddress = {
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipCode').value,
        };
    } else if (paymentData.type === 'field') {
        requestBody.fieldId = paymentData.fieldId;
        requestBody.date = paymentData.date;
        requestBody.timeSlot = paymentData.timeSlot;
        requestBody.duration = paymentData.duration;
        requestBody.playerCount = paymentData.playerCount;
    }
    
    return await paymentAPI.confirmPayment(requestBody);
}

// ==========================================
// UI HELPERS
// ==========================================

function setLoading(isLoading) {
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const buttonLoader = document.getElementById('button-loader');
    
    if (isLoading) {
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'inline-block';
    } else {
        submitButton.disabled = false;
        buttonText.style.display = 'inline';
        buttonLoader.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('payment-message');
    messageDiv.textContent = message;
    messageDiv.className = `payment-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
