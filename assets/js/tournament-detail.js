// Tournament Detail Page - Simple Payment System

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key';

// Global variables
let stripe = null;
let cardNumberElement = null;
let cardExpiryElement = null;
let cardCvcElement = null;
let currentTournament = {
    id: 1,
    name: 'Yay Çempionatı 2026',
    registrationFee: 50
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Stripe
    initializeStripe();
    
    // Tab Management
    initTabs();
    
    // Get tournament ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');
    if (tournamentId) {
        currentTournament.id = tournamentId;
    }
    
    // Register Button Handler
    const registerBtn = document.querySelector('.btn-primary.btn-large');
    if (registerBtn && registerBtn.textContent.includes('Komanda Qeyd Et')) {
        registerBtn.addEventListener('click', openPaymentModal);
    }
});

// Initialize Tab Management
function initTabs() {
    const detailTabs = document.querySelectorAll('.detail-tab');
    if (detailTabs.length > 0) {
        detailTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
}

// Initialize Stripe
function initializeStripe() {
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        const elements = stripe.elements();
        
        // Shared style for all elements
        const elementStyles = {
            base: {
                fontSize: '16px',
                color: '#e5e7eb',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                '::placeholder': {
                    color: '#6b7280'
                }
            },
            invalid: {
                color: '#ef4444',
                iconColor: '#ef4444'
            }
        };
        
        // Create separate elements
        cardNumberElement = elements.create('cardNumber', {
            style: elementStyles,
            placeholder: '1234 5678 9012 3456'
        });
        
        cardExpiryElement = elements.create('cardExpiry', {
            style: elementStyles,
            placeholder: 'MM / YY'
        });
        
        cardCvcElement = elements.create('cardCvc', {
            style: elementStyles,
            placeholder: 'CVC'
        });
        
        console.log('Stripe initialized with separate elements');
    } else {
        console.error('Stripe.js failed to load');
    }
}

// Open Payment Modal
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.style.display = 'flex';
    
    // Block body scroll
    document.body.classList.add('modal-open');
    
    // Mount card elements if not already mounted
    if (cardNumberElement && !document.querySelector('#card-number-element').hasChildNodes()) {
        cardNumberElement.mount('#card-number-element');
        cardExpiryElement.mount('#card-expiry-element');
        cardCvcElement.mount('#card-cvc-element');
        
        // Error handling for all elements
        const displayError = document.getElementById('card-errors');
        
        [cardNumberElement, cardExpiryElement, cardCvcElement].forEach(element => {
            element.on('change', function(event) {
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        });
    }
    
    showStep('stepPayment');
}

// Close Payment Modal
function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
    
    // Restore body scroll
    document.body.classList.remove('modal-open');
    
    resetPaymentForm();
}

// Submit Payment
async function submitPayment() {
    const submitBtn = document.getElementById('btnSubmitPayment');
    const btnText = document.getElementById('btnPaymentText');
    const btnLoader = document.getElementById('btnPaymentLoader');
    
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-flex';
    
    try {
        // Step 1: Create Payment Intent
        const intentResponse = await fetch(`${API_BASE_URL}/payments/create-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tournamentId: currentTournament.id,
                amount: currentTournament.registrationFee
            })
        });
        
        if (!intentResponse.ok) {
            throw new Error('Payment intent yaradıla bilmədi');
        }
        
        const { clientSecret, paymentIntentId } = await intentResponse.json();
        
        // Step 2: Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement
            }
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        if (paymentIntent.status === 'succeeded') {
            // Step 3: Confirm on backend
            await confirmPayment(paymentIntentId, paymentIntent.id);
        } else {
            throw new Error('Ödəniş uğursuz oldu');
        }
        
    } catch (error) {
        console.error('Payment error:', error);
        alert('Ödəniş zamanı xəta: ' + error.message);
        
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Confirm Payment
async function confirmPayment(paymentIntentId, stripePaymentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentIntentId,
                stripePaymentId,
                tournamentId: currentTournament.id
            })
        });
        
        if (!response.ok) {
            throw new Error('Ödəniş təsdiqlənə bilmədi');
        }
        
        // Show success
        document.getElementById('paymentId').textContent = stripePaymentId.substring(0, 20) + '...';
        document.getElementById('paymentDate').textContent = new Date().toLocaleDateString('az-AZ');
        showStep('stepSuccess');
        
    } catch (error) {
        throw error;
    }
}

// Show Step
function showStep(stepId) {
    document.querySelectorAll('.payment-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(stepId).classList.add('active');
}

// Reset Payment Form
function resetPaymentForm() {
    showStep('stepPayment');
    if (cardNumberElement) {
        cardNumberElement.clear();
        cardExpiryElement.clear();
        cardCvcElement.clear();
    }
    document.getElementById('card-errors').textContent = '';
    
    const submitBtn = document.getElementById('btnSubmitPayment');
    submitBtn.disabled = false;
    document.getElementById('btnPaymentText').style.display = 'inline';
    document.getElementById('btnPaymentLoader').style.display = 'none';
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closePaymentModal();
    }
}
