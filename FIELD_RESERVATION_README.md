# Field Reservation System
## Advanced Multi-Step Booking with Payment Integration

### Overview
Field reservation system with visual time slot selection, customer information collection, and integrated Stripe payment processing - all within a single modal experience.

---

## 📋 Features

### 1. **3-Step Booking Process**
- **Step 1**: Date & Time Selection
  - Calendar date picker
  - Visual time slot selection (09:00 - 23:00)
  - Real-time availability display
  - Booked slots marked automatically
  
- **Step 2**: Personal Information
  - Customer name, email, phone
  - Optional notes/requirements
  - Full form validation
  
- **Step 3**: Payment
  - Booking summary display
  - Integrated Stripe payment
  - Separate card fields (number, expiry, CVC)
  - Real-time payment processing

### 2. **Time Slot Management**
- **14 time slots** per day (09:00-10:00 to 22:00-23:00)
- Visual status indication:
  - 🟢 **Green** = Available
  - 🔴 **Red** = Booked
  - 🔵 **Blue** = Selected
- Click-to-select interaction
- Disabled state for booked slots

### 3. **Payment Integration**
- Stripe Elements API
- Separate card input fields
- Real-time validation
- Secure payment processing
- Loading states and error handling

---

## 🚀 How It Works

### User Flow
1. User clicks "Rezerv Et" button on field detail page
2. Modal opens showing Step 1 (Date & Time)
3. User selects date from calendar
4. Available time slots load automatically
5. User selects time slot and duration
6. Clicks "Növbəti" to go to Step 2
7. User enters name, email, phone
8. Clicks "Növbəti" to go to Step 3
9. Summary is displayed with total price
10. Stripe Elements mount automatically
11. User enters card details
12. Clicks "Ödəniş et və Təsdiqlə"
13. Payment processes in modal
14. Success message shown

### Data Flow
```
Frontend (field-detail.js)
  ↓
Create Payment Intent (API)
  ↓
Stripe confirmCardPayment
  ↓
Confirm with Backend (API)
  ↓
Save Reservation to Database
  ↓
Show Success Message
```

---

## 📂 Files

### HTML
- `field-detail.html` - Field detail page with multi-step modal

### JavaScript
- `assets/js/field-detail.js` - Reservation logic and Stripe integration
- `assets/js/api-config.js` - API configuration and services

### CSS
- `assets/css/payment-styles.css` - Modal, steps, time slots styling

---

## 🎨 UI Components

### Modal Structure
```html
<div class="modal modal-large">
  <div class="modal-content">
    <!-- Progress Indicator -->
    <div class="modal-steps">
      <div class="step active" data-step="1">...</div>
      <div class="step" data-step="2">...</div>
      <div class="step" data-step="3">...</div>
    </div>
    
    <!-- Step 1: Date & Time -->
    <div class="form-step active" data-step="1">
      <input type="date" id="reservationDate">
      <div id="availableSlots" class="time-slots-grid">
        <!-- Time slot buttons generated dynamically -->
      </div>
    </div>
    
    <!-- Step 2: Personal Info -->
    <div class="form-step" data-step="2">
      <input type="text" id="customerName">
      <input type="email" id="customerEmail">
      <input type="tel" id="customerPhone">
    </div>
    
    <!-- Step 3: Payment -->
    <div class="form-step" data-step="3">
      <!-- Summary Box -->
      <div class="payment-summary-box">...</div>
      
      <!-- Stripe Elements -->
      <div id="card-number-element-modal"></div>
      <div id="card-expiry-element-modal"></div>
      <div id="card-cvc-element-modal"></div>
    </div>
  </div>
</div>
```

### Time Slot Component
```javascript
<button class="time-slot available" onclick="selectTimeSlot('09:00-10:00', this)">
  <div class="time-slot-time">09:00-10:00</div>
  <div class="time-slot-status">Boş</div>
</button>
```

---

## 🔧 Configuration

### Mock Data (Development)
```javascript
const BOOKED_SLOTS = {
  '2026-02-18': ['10:00-11:00', '14:00-15:00', '18:00-19:00'],
  '2026-02-19': ['09:00-10:00', '19:00-20:00']
};
```

Replace this with actual API calls to your C# backend:
```javascript
async function loadAvailableSlots(date) {
  const response = await fetch(`${API_CONFIG.baseURL}/fields/${fieldId}/availability?date=${date}`);
  const data = await response.json();
  // Render slots based on data.bookedSlots
}
```

---

## 🎯 JavaScript Functions

### Core Functions

**Modal Management**
- `openReservationModal()` - Opens modal, resets to step 1
- `closeReservationModal()` - Closes modal, resets form
- `showStep(stepNumber)` - Shows specific step, mounts Stripe on step 3

**Navigation**
- `nextStep(stepNumber)` - Validates current step, moves forward
- `prevStep(stepNumber)` - Moves backward without validation

**Validation**
- `validateStep1()` - Check date and time slot selected
- `validateStep2()` - Check name, email, phone (with email regex)

**Time Slots**
- `loadAvailableSlots(date)` - Fetch and render time slots for date
- `selectTimeSlot(slot, element)` - Handle slot selection

**Stripe**
- `initializeStripe()` - Create Stripe Elements
- `mountStripeElements()` - Mount card inputs on step 3
- `handleReservationSubmit()` - Process payment

**Helpers**
- `updateTotal()` - Calculate and display total price
- `updateSummary()` - Populate summary in step 3
- `setLoading(isLoading)` - Toggle button loading state
- `formatDate(dateString)` - Format date for display

---

## 💳 Payment Processing

### Create Payment Intent
```javascript
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
```

### Confirm Payment with Stripe
```javascript
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
```

### Confirm with Backend
```javascript
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
}
```

---

## 🔐 Backend Integration

### Required API Endpoints

**1. Create Payment Intent**
```csharp
POST /api/payments/create-intent
Body: {
  type: 'field',
  amount: 120,
  currency: 'azn',
  metadata: { ... }
}
Response: {
  clientSecret: 'pi_xxx_secret_yyy',
  paymentIntentId: 'pi_xxx'
}
```

**2. Confirm Payment**
```csharp
POST /api/payments/confirm
Body: {
  paymentIntentId: 'pi_xxx',
  stripePaymentId: 'pi_xxx',
  type: 'field',
  fieldId: 1,
  date: '2026-02-18',
  timeSlot: '10:00-11:00',
  duration: 2,
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  customerPhone: '+994501234567'
}
Response: {
  success: true,
  reservationId: 123
}
```

**3. Get Available Slots**
```csharp
GET /api/fields/{fieldId}/availability?date=2026-02-18
Response: {
  date: '2026-02-18',
  bookedSlots: ['10:00-11:00', '14:00-15:00'],
  availableSlots: ['09:00-10:00', '11:00-12:00', ...]
}
```

---

## 📱 Responsive Design

### Breakpoints
- **Desktop** (> 992px): 3-column time slots grid
- **Tablet** (768px - 992px): 2-column time slots grid
- **Mobile** (< 768px): 
  - Steps shown vertically
  - Single-column time slots
  - Navigation buttons stacked

---

## 🎨 CSS Classes

### Modal
- `.modal-large` - Wider modal (900px)
- `.modal-steps` - Progress indicator container
- `.step` - Individual step in progress bar
- `.step.active` - Current step (green)
- `.step-indicator` - Step number circle

### Form Steps
- `.form-step` - Step container (hidden by default)
- `.form-step.active` - Visible step

### Time Slots
- `.time-slots-grid` - Grid container
- `.time-slot` - Individual slot button
- `.time-slot.available` - Green hover effect
- `.time-slot.booked` - Red, disabled
- `.time-slot.selected` - Green background

### Payment
- `.payment-summary-box` - Summary container
- `.summary-row` - Summary line item
- `.summary-row.total` - Total line (bold, green)

---

## ⚙️ Customization

### 1. Change Time Slots
Edit in `field-detail.js`:
```javascript
const allSlots = [
  '08:00-09:00',  // Add earlier slot
  '09:00-10:00',
  // ... rest
  '23:00-00:00'   // Add later slot
];
```

### 2. Field Pricing
```javascript
const FIELD_DATA = {
  id: 1,
  name: 'Mini Futbol Arena',
  pricePerHour: 150  // Change price
};
```

### 3. Validation Rules
Edit `validateStep2()`:
```javascript
// Add phone number format validation
const phoneRegex = /^(\+994|0)(50|51|55|70|77)[0-9]{7}$/;
if (!phoneRegex.test(phone)) {
  alert('Düzgün telefon nömrəsi daxil edin');
  return false;
}
```

---

## 🐛 Debugging

### Check Stripe Initialization
```javascript
console.log('Stripe:', stripe);
console.log('Card Element:', cardNumberElement);
```

### Check Time Slot Loading
```javascript
console.log('Loading slots for date:', selectedDate);
console.log('Booked slots:', BOOKED_SLOTS[selectedDate]);
```

### Check Payment Data
```javascript
console.log('Payment data:', {
  fieldId, date, timeSlot, duration, total, customerName
});
```

---

## 📝 Notes

- **Modal doesn't redirect** - All payment happens in-modal
- **Real-time updates** - Duration changes update total automatically
- **Mock data** - Time slots use hardcoded data (replace with API)
- **Stripe Elements** - Mounted only when step 3 is shown (performance)
- **Form validation** - Prevents moving to next step without completing current

---

## 🚦 Status Indicators

### Time Slot Colors
- **Gray** - Empty/Available slot
- **Green** - Hovered available slot
- **Blue** - Selected slot
- **Red** - Booked slot (disabled)

### Loading States
- Submit button shows spinner when processing
- Button disabled during payment
- Error messages shown below card inputs

---

## 🔗 Related Documentation
- [Payment Setup README](PAYMENT_SETUP_README.md)
- [C# Backend Guide](CSHARP_BACKEND_GUIDE.md)
- [Cart Documentation](CART_README.md)

---

## ✅ Testing Checklist

- [ ] Open field detail page
- [ ] Click "Rezerv Et" button
- [ ] Select today's date
- [ ] Verify time slots load
- [ ] Select an available time slot
- [ ] Try clicking "Növbəti" without selecting slot (should show error)
- [ ] Select slot and click "Növbəti"
- [ ] Try clicking "Növbəti" without filling form (should show error)
- [ ] Fill personal info and click "Növbəti"
- [ ] Verify summary displays correctly
- [ ] Change duration slider (summary should update)
- [ ] Verify Stripe card inputs are visible
- [ ] Enter test card: 4242 4242 4242 4242
- [ ] Enter expiry: 12/34
- [ ] Enter CVC: 123
- [ ] Click "Ödəniş et və Təsdiqlə"
- [ ] Wait for success message
- [ ] Modal closes automatically

---

**Last Updated**: February 2026  
**Version**: 1.0
