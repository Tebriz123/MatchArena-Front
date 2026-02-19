// ==========================================
// FIELD DETAIL PAGE - ADVANCED RESERVATION
// ==========================================

const FIELD_DATA = {
    id: 1,
    name: 'Mini Futbol Arena',
    location: 'Baki',
    pricePerHour: 120,
    rating: 4.5,
    reviews: 127
};

// Stripe Elements
let stripe;
let elements;
let cardNumberElement;
let cardExpiryElement;
let cardCvcElement;

// Current step
let currentStep = 1;

// Rezervasiyalar (mock data - backend-dən gələcək)
const BOOKED_SLOTS = {
    // Format: 'YYYY-MM-DD': ['09:00-10:00', '10:00-11:00', ...]
    '2026-02-18': ['10:00-11:00', '14:00-15:00', '18:00-19:00'],
    '2026-02-19': ['09:00-10:00', '19:00-20:00']
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Set min date to today
    const dateInput = document.getElementById('reservationDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
        
        // Load available slots for today
        loadAvailableSlots(today);
        
        // Listen to date changes
        dateInput.addEventListener('change', (e) => {
            loadAvailableSlots(e.target.value);
        });
    }
    
    // Listen to duration changes
    const durationInput = document.getElementById('duration');
    if (durationInput) {
        durationInput.addEventListener('change', () => {
            updateTotal();
            // Update summary if on step 3
            if (currentStep === 3) {
                updateSummary();
            }
        });
    }
    
    // Setup reservation form
    setupReservationForm();
    
    // Initialize Stripe
    initializeStripe();
});

// ==========================================
// STRIPE INITIALIZATION
// ==========================================

async function initializeStripe() {
    try {
        // Initialize Stripe
        stripe = Stripe(API_CONFIG.stripe.publishableKey);
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
        
        // Create Card Elements
        cardNumberElement = elements.create('cardNumber', {
            style: elementStyle,
            showIcon: true
        });
        
        cardExpiryElement = elements.create('cardExpiry', {
            style: elementStyle
        });
        
        cardCvcElement = elements.create('cardCvc', {
            style: elementStyle
        });
        
        // Mount will happen when step 3 is shown
        
    } catch (error) {
        console.error('Stripe initialization error:', error);
    }
}

// ==========================================
// MODAL MANAGEMENT
// ==========================================

function openReservationModal() {
    const modal = document.getElementById('reservationModal');
    modal.style.display = 'flex';
    currentStep = 1;
    showStep(1);
    updateTotal();
}

function closeReservationModal() {
    const modal = document.getElementById('reservationModal');
    modal.style.display = 'none';
    currentStep = 1;
    
    // Reset form
    document.getElementById('reservationForm').reset();
    
    // Clear selection
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('reservationModal');
    if (event.target === modal) {
        closeReservationModal();
    }
}

// ==========================================
// MULTI-STEP NAVIGATION
// ==========================================

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
    document.querySelector(`.step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Mount Stripe elements when reaching step 3
    if (stepNumber === 3 && !cardNumberElement._mounted) {
        mountStripeElements();
        updateSummary();
    }
}

function nextStep(stepNumber) {
    // Validate current step
    if (currentStep === 1) {
        if (!validateStep1()) return;
    } else if (currentStep === 2) {
        if (!validateStep2()) return;
    }
    
    currentStep = stepNumber;
    showStep(stepNumber);
}

function prevStep(stepNumber) {
    currentStep = stepNumber;
    showStep(stepNumber);
}

// ==========================================
// STEP VALIDATION
// ==========================================

function validateStep1() {
    const date = document.getElementById('reservationDate').value;
    const timeSlot = document.getElementById('selectedTimeSlot').value;
    
    if (!date) {
        alert('Zəhmət olmasa tarix seçin');
        return false;
    }
    
    if (!timeSlot) {
        alert('Zəhmət olmasa saat aralığı seçin');
        return false;
    }
    
    return true;
}

function validateStep2() {
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    
    if (!name || !email || !phone) {
        alert('Zəhmət olmasa bütün məcburi sahələri doldurun');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Düzgün email daxil edin');
        return false;
    }
    
    return true;
}

// ==========================================
// TIME SLOTS
// ==========================================

function loadAvailableSlots(selectedDate) {
    const slotsContainer = document.getElementById('availableSlots');
    const bookedSlots = BOOKED_SLOTS[selectedDate] || [];
    
    // All possible time slots
    const allSlots = [
        '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00',
        '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
        '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00',
        '21:00-22:00', '22:00-23:00'
    ];
    
    // Generate time slot buttons
    slotsContainer.innerHTML = allSlots.map(slot => {
        const isBooked = bookedSlots.includes(slot);
        const isDisabled = isBooked ? 'disabled' : '';
        const statusClass = isBooked ? 'booked' : 'available';
        
        return `
            <button type="button" 
                    class="time-slot ${statusClass}" 
                    data-slot="${slot}"
                    ${isDisabled}
                    onclick="selectTimeSlot('${slot}', this)">
                <div class="time-slot-time">${slot}</div>
                <div class="time-slot-status">${isBooked ? 'Dolu' : 'Boş'}</div>
            </button>
        `;
    }).join('');
}

function selectTimeSlot(slot, element) {
    // Remove previous selection
    document.querySelectorAll('.time-slot').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selection to clicked element
    element.classList.add('selected');
    
    // Save selected slot
    document.getElementById('selectedTimeSlot').value = slot;
}

// ==========================================
// STRIPE ELEMENTS
// ==========================================

function mountStripeElements() {
    if (cardNumberElement._mounted) return;
    
    cardNumberElement.mount('#card-number-element-modal');
    cardExpiryElement.mount('#card-expiry-element-modal');
    cardCvcElement.mount('#card-cvc-element-modal');
    
    // Mark as mounted
    cardNumberElement._mounted = true;
    
    // Handle errors
    const displayError = document.getElementById('card-errors-modal');
    
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
        }
    });
    
    cardCvcElement.on('change', (event) => {
        if (event.error) {
            displayError.textContent = event.error.message;
        }
    });
}

// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {
    const date = document.getElementById('reservationDate').value;
    const timeSlot = document.getElementById('selectedTimeSlot').value;
    const duration = parseInt(document.getElementById('duration').value);
    const total = FIELD_DATA.pricePerHour * duration;
    
    document.getElementById('summaryField').textContent = FIELD_DATA.name;
    document.getElementById('summaryDate').textContent = formatDate(date);
    document.getElementById('summaryTime').textContent = timeSlot;
    document.getElementById('summaryDuration').textContent = `${duration} saat`;
    document.getElementById('summaryTotal').textContent = `${total}₼`;
}

// ==========================================
// RESERVATION FORM
// ==========================================

function setupReservationForm() {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleReservationSubmit();
    });
}

function updateTotal() {
    const duration = parseInt(document.getElementById('duration').value) || 1;
    const total = FIELD_DATA.pricePerHour * duration;
    
    document.getElementById('totalAmount').textContent = `${total}₼`;
}

async function handleReservationSubmit() {
    // Show loading
    setLoading(true);
    
    try {
        // Get form values
        const date = document.getElementById('reservationDate').value;
        const timeSlot = document.getElementById('selectedTimeSlot').value;
        const duration = parseInt(document.getElementById('duration').value);
        const playerCount = parseInt(document.getElementById('playerCount').value);
        const customerName = document.getElementById('customerName').value;
        const customerEmail = document.getElementById('customerEmail').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const customerNote = document.getElementById('customerNote').value;
        const total = FIELD_DATA.pricePerHour * duration;
        
        // Step 1: Create Payment Intent
        const { clientSecret, paymentIntentId } = await createPaymentIntent({
            type: 'field',
            amount: total,
            currency: 'azn',
            metadata: {
                fieldId: FIELD_DATA.id,
                customerName,
                customerEmail,
                customerPhone
            }
        });
        
        // Step 2: Confirm payment with Stripe
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: cardNumberElement,
                billing_details: {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone
                }
            }
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        // Step 3: Confirm with backend
        if (paymentIntent.status === 'succeeded') {
            await confirmPaymentWithBackend({
                paymentIntentId,
                stripePaymentId: paymentIntent.id,
                type: 'field',
                customerName,
                customerEmail,
                customerPhone,
                fieldId: FIELD_DATA.id,
                date,
                timeSlot,
                duration,
                playerCount,
                note: customerNote
            });
            
            // Success!
            alert('✓ Rezervasiya uğurla tamamlandı!');
            closeReservationModal();
            
            // Optionally redirect
            // window.location.href = 'payment-success.html?id=' + paymentIntent.id;
        }
        
    } catch (error) {
        console.error('Reservation error:', error);
        alert('Xəta: ' + error.message);
    } finally {
        setLoading(false);
    }
}

// ==========================================
// API CALLS
// ==========================================

async function createPaymentIntent(data) {
    return await paymentAPI.createIntent(data);
}

async function confirmPaymentWithBackend(data) {
    return await paymentAPI.confirmPayment(data);
}

// ==========================================
// LOADING STATE
// ==========================================

function setLoading(isLoading) {
    const submitBtn = document.getElementById('submitReservation');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitText.style.display = 'none';
        submitLoader.style.display = 'inline-block';
    } else {
        submitBtn.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('az-AZ', options);
}

// Check availability (to be implemented with backend)
async function checkAvailability(fieldId, date, timeSlot) {
    // This will call your C# backend API
    // For now, return mock data from BOOKED_SLOTS
    const bookedSlots = BOOKED_SLOTS[date] || [];
    return !bookedSlots.includes(timeSlot);
}
