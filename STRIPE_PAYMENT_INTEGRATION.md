# Stripe Ödəniş Sistemi Dokumentasiyası

## 📋 Ümumi Məlumat

Bu sistem turnirə qoşulan komandalar üçün Stripe ödəniş inteqrasiyasını təmin edir. İstifadəçilər turnir səhifəsində komandalarını seçərək, Stripe vasitəsilə təhlükəsiz ödəniş edə bilərlər.

## 🎯 Əsas Xüsusiyyətlər

- ✅ Komanda seçimi
- ✅ Stripe Card Elements ilə təhlükəsiz ödəniş
- ✅ Real-time kart validasiyası
- ✅ Payment Intent API istifadəsi
- ✅ 3 addımlı proses (Komanda seçimi → Ödəniş → Uğur)
- ✅ Responsive dizayn
- ✅ Loading state-ləri
- ✅ Xəta idarəetməsi

## 🔧 Quraşdırma

### 1. Stripe Açarlarının Konfiqurasiyası

`assets/js/tournament-detail.js` faylında Stripe açarlarınızı daxil edin:

```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_xxxxxxxxxxxxxxxxxx'; // Stripe Dashboard-dan alın
const API_BASE_URL = 'http://localhost:3000/api'; // Backend API URL-nizi daxil edin
```

### 2. Stripe Dashboard Ayarları

1. [Stripe Dashboard](https://dashboard.stripe.com) > Developers > API Keys
2. Test və ya Live environment üçün **Publishable Key** götürün
3. Backend üçün **Secret Key** götürün (FRONTEND-də istifadə ETMƏYİN!)

## 🔄 İş Prosesi

### Addım 1: Modal Açılması
İstifadəçi "Komanda Qeyd Et" düyməsini basır:
- İstifadəçi autentifikasiyası yoxlanılır
- İstifadəçinin komandaları backend-dən yüklənir
- Payment modal açılır

### Addım 2: Komanda Seçimi
İstifadəçi turnirə qoşmaq istədiyi komandanı seçir:
- Radio button ilə komanda seçimi
- "Ödənişə keç" düyməsi aktivləşir

### Addım 3: Ödəniş
Stripe Card Element ilə kart məlumatları daxil edilir:
1. Backend-də Payment Intent yaradılır
2. Stripe-da ödəniş təsdiqlənir (confirmCardPayment)
3. Uğurlu ödənişdən sonra backend-də qeydiyyat təsdiqlənir

### Addım 4: Uğur
Uğurlu ödəniş mesajı və təfərrüatlar göstərilir.

## 🖥️ Backend API Endpoints

Backend-də aşağıdakı endpoint-ləri yaratmalısınız:

### 1. Komandaları Yüklə

```
GET /api/teams/user/:userId
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Qarabağ Legends",
    "playerCount": 15
  }
]
```

### 2. Payment Intent Yarat

```
POST /api/payments/create-intent
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "tournamentId": 1,
  "teamId": 5,
  "amount": 50
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxxxx_secret_xxxxx",
  "paymentIntentId": "pi_xxxxx"
}
```

**Backend-də ediləcək işlər:**
```javascript
// Stripe SDK ilə Payment Intent yaradın
const stripe = require('stripe')('sk_test_your_secret_key');

const paymentIntent = await stripe.paymentIntents.create({
  amount: amount * 100, // Manatı qəpiyə çevir (50₼ = 5000 qəpik)
  currency: 'azn',
  metadata: {
    tournamentId: tournamentId,
    teamId: teamId,
    userId: userId
  }
});

return {
  clientSecret: paymentIntent.client_secret,
  paymentIntentId: paymentIntent.id
};
```

### 3. Qeydiyyatı Təsdiqlə

```
POST /api/payments/confirm-registration
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentIntentId": "pi_xxxxx",
  "stripePaymentId": "pi_xxxxx",
  "tournamentId": 1,
  "teamId": 5
}
```

**Response:**
```json
{
  "success": true,
  "registrationId": 123,
  "message": "Qeydiyyat uğurla tamamlandı"
}
```

**Backend-də ediləcək işlər:**
```javascript
// 1. Stripe-dan ödəniş statusunu yoxlayın
const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

if (paymentIntent.status !== 'succeeded') {
  throw new Error('Ödəniş uğursuz oldu');
}

// 2. Verilənlər bazasına yazın
const registration = await db.tournamentRegistrations.create({
  tournamentId: tournamentId,
  teamId: teamId,
  userId: userId,
  paymentId: stripePaymentId,
  amount: paymentIntent.amount / 100,
  status: 'confirmed',
  paidAt: new Date()
});

// 3. Email göndərin (optional)
await sendConfirmationEmail(userId, tournamentId, teamId);

return {
  success: true,
  registrationId: registration.id
};
```

### 4. Turnir Məlumatlarını Yüklə

```
GET /api/tournaments/:id
```

**Response:**
```json
{
  "id": 1,
  "name": "Yay Çempionatı 2026",
  "registrationFee": 50,
  "maxTeams": 16,
  "currentTeams": 12
}
```

## 💾 Verilənler Bazası Strukturu

### Tournament Registrations Cədvəli

```sql
CREATE TABLE tournament_registrations (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  team_id INTEGER NOT NULL REFERENCES teams(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  payment_id VARCHAR(255) NOT NULL, -- Stripe Payment Intent ID
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed', -- confirmed, cancelled
  paid_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tournament_id, team_id) -- Bir komanda bir turnirə 1 dəfə qoşula bilər
);
```

## 🔐 Təhlükəsizlik

### ⚠️ MÜHÜM QEYDLƏR:

1. **HEÇVAXT Secret Key-i frontend-də istifadə etməyin!**
   - `sk_test_xxx` və `sk_live_xxx` yalnız backend-də olmalıdır
   - Frontend-də yalnız Publishable Key (`pk_test_xxx` və ya `pk_live_xxx`)

2. **Ödəniş məbləğini həmişə backend-də yoxlayın:**
   ```javascript
   // Backend-də
   const tournament = await db.tournaments.findById(tournamentId);
   
   // Frontend-dən gələn məbləği QƏBUL ETMƏYİN!
   // Həmişə verilənlər bazasından götürün:
   const actualAmount = tournament.registrationFee;
   ```

3. **Webhook-lar qurun:**
   Stripe webhook-larını konfiqurasiya edərək ödəniş statuslarını real-time izləyin.

## 🧪 Test Kartları

Stripe test mühitində aşağıdakı kartları istifadə edə bilərsiniz:

| Kart Nömrəsi | CVV | Tarix | Nəticə |
|--------------|-----|-------|--------|
| 4242 4242 4242 4242 | 123 | İstənilən gələcək tarix | ✅ Uğurlu |
| 4000 0000 0000 0002 | 123 | İstənilən gələcək tarix | ❌ Rədd edildi |
| 4000 0025 0000 3155 | 123 | İstənilən gələcək tarix | 🔐 3D Secure tələb edir |

## 📱 UI/UX Xüsusiyyətləri

### Modal Struktur:
1. **Header:** Başlıq və bağla düyməsi
2. **Step 1:** Komanda seçimi
3. **Step 2:** Ödəniş forması və sifariş xülasəsi
4. **Step 3:** Uğur mesajı

### Animasiyalar:
- Modal slide-in effekti
- Step-lər arası fade effekti
- Success icon scale-in animasiyası
- Button hover effektləri

### Responsive:
- Desktop (600px modal width)
- Mobile (Full-width modal)

## 🐛 Xəta İdarəetməsi

### Frontend Xətaları:

```javascript
// Kart validasiya xətaları
cardElement.on('change', function(event) {
  if (event.error) {
    document.getElementById('card-errors').textContent = event.error.message;
  }
});

// Ödəniş xətaları
catch (error) {
  alert('Ödəniş zamanı xəta baş verdi: ' + error.message);
  // Button-u yenidən aktivləşdir
  submitBtn.disabled = false;
}
```

### Backend Xətaları:

Aşağıdakı xəta kodlarını qaytarın:

- `400` - Yanlış məlumat (validation error)
- `401` - Autentifikasiya tələb olunur
- `403` - İcazə verilməyib
- `404` - Turnir və ya komanda tapılmadı
- `409` - Komanda artıq qeydiyyatdan keçib
- `500` - Server xətası

## 🚀 Production-a Keçid

1. **Test Environment-də tam test edin**
2. **Stripe Dashboard-da Live mode-a keçin**
3. **Live API Key-lərini yeniləyin:**
   ```javascript
   // Production
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_xxxxxxxxxx';
   ```
4. **Webhook-ları konfiqurasiya edin**
5. **SSL sertifikatı quraşdırın (HTTPS)**
6. **Payout məlumatlarını tamamlayın**

## 📞 Dəstək

Stripe dokumentasiyası: https://stripe.com/docs
Stripe Dashboard: https://dashboard.stripe.com

## ✅ Checklist

Backend Developer üçün:

- [ ] Stripe SDK quraşdırıldı (`npm install stripe`)
- [ ] Secret Key konfiqurasiya edildi
- [ ] Payment Intent endpoint hazırlandı (`POST /api/payments/create-intent`)
- [ ] Registration confirmation endpoint hazırlandı (`POST /api/payments/confirm-registration`)
- [ ] Teams list endpoint hazırlandı (`GET /api/teams/user/:userId`)
- [ ] Tournament detail endpoint hazırlandı (`GET /api/tournaments/:id`)
- [ ] Verilənlər bazası cədvəli yaradıldı (`tournament_registrations`)
- [ ] Webhook endpoint quruldu (optional)
- [ ] Email bildirişləri konfiqurasiya edildi (optional)
- [ ] Test kartları ilə test edildi
- [ ] Təhlükəsizlik yoxlamaları aparıldı

Frontend Developer üçün:

- [x] Stripe.js əlavə edildi
- [x] Payment modal yaradıldı
- [x] CSS style-ları əlavə edildi
- [x] JavaScript funksiyaları yazıldı
- [x] Publishable Key konfiqurasiya ediləcək
- [x] API URL konfiqurasiya ediləcək
- [ ] Test mühitində yoxlanacaq
- [ ] Production-da yoxlanacaq

## 🎨 Customization

### Rəngləri Dəyişdirmək:

`style.css` faylında:
```css
:root {
    --primary-color: #22c55e; /* Əsas rəng */
    --accent-red: #ef4444;    /* Xəta rəngi */
}
```

### Modal Genişliyini Dəyişdirmək:

```css
.payment-modal-content {
    max-width: 700px; /* Default: 600px */
}
```

## 📄 Lisenziya

Bu kod nümunəsi təhsil məqsədi ilə təqdim edilib.
