# 🚀 Stripe Ödəniş Sistemi - Sürətli Başlanğıc

## 📝 Qısa İzahat

Bu sistem turnir səhifəsində komandaların qeydiyyatı zamanı Stripe ilə ödəniş qəbul edir.

## ⚡ 5 Dəqiqədə Quraşdırma

### 1️⃣ Frontend Konfiqurasiyası

**Fayl:** `assets/js/tournament-detail.js`

```javascript
// Bu sətirləri yeniləyin:
const API_BASE_URL = 'http://localhost:3000/api'; // Sizin backend URL
const STRIPE_PUBLISHABLE_KEY = 'pk_test_xxxxxxxxxxxxx'; // Stripe Dashboard-dan götürün
```

**Stripe açarını harada tapmaq olar:**
1. https://dashboard.stripe.com daxil olun
2. Developers → API Keys
3. **Publishable key** kopyalayın (pk_test_... ilə başlayır)

### 2️⃣ Backend Quraşdırma

**a) Paketləri quraşdırın:**
```bash
npm install express stripe cors dotenv jsonwebtoken
```

**b) `.env` faylı yaradın:**
```env
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
JWT_SECRET=your_secret_key_here
PORT=3000
```

**Stripe Secret Key-i harada tapmaq olar:**
1. https://dashboard.stripe.com daxil olun
2. Developers → API Keys
3. **Secret key** kopyalayın (sk_test_... ilə başlayır)
⚠️ **MÜHÜM:** Secret key-i HEÇVAXT frontend-də istifadə etməyin!

**c) Backend kodu əlavə edin:**

`backend-example-stripe.js` faylından lazımi endpoint-ləri kopyalayın və öz layihənizə əlavə edin.

### 3️⃣ Database Cədvəllərini Yaradın

```sql
-- 1. Turnir qeydiyyatları cədvəli (Qeydiyyatlı istifadəçilər)
CREATE TABLE tournament_registrations (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  team_id INTEGER NOT NULL REFERENCES teams(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  payment_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  paid_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(tournament_id, team_id)
);

-- 2. Payment intents tracking cədvəli (Qeydiyyatlı istifadəçilər)
CREATE TABLE payment_intents (
  id SERIAL PRIMARY KEY,
  payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  team_id INTEGER NOT NULL REFERENCES teams(id),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Qonaq qeydiyyatları cədvəli (Daxil olmadan)
CREATE TABLE guest_registrations (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  player_count INTEGER NOT NULL,
  notes TEXT,
  payment_id VARCHAR(255) NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  paid_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Qonaq payment intents tracking
CREATE TABLE guest_payment_intents (
  id SERIAL PRIMARY KEY,
  payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  tournament_id INTEGER NOT NULL REFERENCES tournaments(id),
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  player_count INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. İndekslər
CREATE INDEX idx_tournament_registrations_tournament ON tournament_registrations(tournament_id);
CREATE INDEX idx_tournament_registrations_team ON tournament_registrations(team_id);
CREATE INDEX idx_payment_intents_status ON payment_intents(status);
CREATE INDEX idx_guest_registrations_tournament ON guest_registrations(tournament_id);
CREATE INDEX idx_guest_registrations_email ON guest_registrations(guest_email);
CREATE INDEX idx_guest_payment_intents_status ON guest_payment_intents(status);
```

### 4️⃣ Test Edin!

**a) Backend-i işə salın:**
```bash
node server.js
# və ya
npm start
```

**b) Frontend-i açın:**
```
tournament-detail.html?id=1
```

**c) Test kartı ilə ödəniş edin:**
- Kart nömrəsi: `4242 4242 4242 4242`
- Tarix: İstənilən gələcək tarix
- CVV: `123`
- Ad: İstənilən ad

## 📋 Minimal Backend Endpoint-ləri

Backend-də bu 4 endpoint MÜTLƏQ olmalıdır:

### 1. İstifadəçinin komandalarını göstər
```
GET /api/teams/user/:userId
Authorization: Bearer {token}
→ Returns: [{id, name, playerCount}]
```

### 2. Payment Intent yarat
```
POST /api/payments/create-intent
Authorization: Bearer {token}
Body: {tournamentId, teamId, amount}
→ Returns: {clientSecret, paymentIntentId}
```

### 3. Qeydiyyatı təsdiqlə
```
POST /api/payments/confirm-registration
Authorization: Bearer {token}
Body: {paymentIntentId, stripePaymentId, tournamentId, teamId}
→ Returns: {success, registrationId}
```

### 4. Turnir məlumatlarını gətir
```
GET /api/tournaments/:id
→ Returns: {id, name, registrationFee, maxTeams, ...}
```

## 🧪 Test Ssenarisi

### A) Qeydiyyatlı İstifadəçi ilə Test:

1. **Frontend-i açın:** `tournament-detail.html?id=1`
2. **Login olun:** Qeydiyyatdan keçmiş istifadəçi ilə
3. **"Komanda Qeyd Et" düyməsinə basın**
4. **"Hesabımla daxil ol" seçin**
5. **Komanda seçin:** Siyahıdan bir komanda seçin
6. **"Ödənişə keç" düyməsinə basın**
7. **Kart məlumatlarını daxil edin:**
   - 4242 4242 4242 4242
   - 12/25
   - 123
8. **"Ödəniş et" düyməsinə basın**
9. **Uğur mesajını gözləyin** ✅

### B) Qonaq İstifadəçi ilə Test:

1. **Frontend-i açın:** `tournament-detail.html?id=1`
2. **"Komanda Qeyd Et" düyməsinə basın**
3. **"Qonaq olaraq davam et" seçin**
4. **Əlaqə məlumatlarını doldurun:**
   - Ad: Əli Həsənov
   - Email: ali@example.com
   - Telefon: +994 50 123 45 67
5. **Komanda məlumatlarını doldurun:**
   - Komanda adı: Test FC
   - Oyunçu sayı: 15
6. **"Ödənişə keç" düyməsinə basın**
7. **Kart məlumatlarını daxil edin:**
   - 4242 4242 4242 4242
   - 12/25
   - 123
8. **"Ödəniş et" düyməsinə basın**
9. **Uğur mesajını gözləyin** ✅

## 🔍 Debug

### Problem: "Stripe is not defined"
**Həll:** `tournament-detail.html`-də Stripe script-in düzgün yüklənməsini yoxlayın:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Problem: "Payment Intent yaradıla bilmədi"
**Həll:** 
- Backend-in işlədiyini yoxlayın
- `.env` faylında `STRIPE_SECRET_KEY` düzgün qurulub?
- Console-da xəta mesajına baxın

### Problem: "Komanda seçilmir"
**Həll:**
- İstifadəçi login olub?
- `/api/teams/user/:userId` endpoint-i düzgün işləyir?
- Browser Console-da xəta varmı?

### Problem: "Token tələb olunur"
**Həll:**
- İstifadəçi autentifikasiyadan keçib?
- localStorage-də token var?
```javascript
// Console-da yoxlayın:
console.log(localStorage.getItem('user'));
```

## 📊 Payment Flow Diaqramı

```
Frontend                     Backend                     Stripe
   |                           |                           |
   |--1. Komanda seç---------->|                           |
   |                           |                           |
   |<--2. Komanda siyahısı-----|                           |
   |                           |                           |
   |--3. Ödənişə keç---------->|                           |
   |                           |                           |
   |--4. Create Intent-------->|                           |
   |                           |---5. Create PI----------->|
   |                           |<--6. Client Secret--------|
   |<--7. Client Secret--------|                           |
   |                           |                           |
   |--8. Confirm Card--------->|                           |
   |                           |                        [Process]
   |<--9. Payment Success------|                           |
   |                           |                           |
   |--10. Confirm Reg--------->|                           |
   |                           |---11. Verify Payment----->|
   |                           |<--12. Status: succeeded---|
   |                           |                           |
   |                      [Save to DB]                     |
   |<--13. Success Response----|                           |
   |                           |                           |
[Show Success Page]
```

## 💡 Məsləhətlər

### ✅ DO (Edin)
- Test environment-də həmişə test kartları istifadə edin
- Backend-də ödəniş məbləğini database-dən götürün
- Secret Key-i `.env` faylında saxlayın
- Ödəniş uğurlu olanda email göndərin
- Xətaları düzgün handle edin

### ❌ DON'T (Etməyin)
- Secret Key-i frontend-də istifadə etməyin
- Frontend-dən gələn məbləğə etibar etməyin
- Production-da test kartlarını qəbul etməyin
- API key-ləri Git-ə commit etməyin
- SSL olmadan production-a çıxmayın

## 🎯 Növbəti Addımlar

1. ✅ Test environment-də tam test edin
2. ✅ Webhook konfiqurasiya edin (optional amma tövsiyə olunur)
3. ✅ Email bildirişləri əlavə edin
4. ✅ Stripe Dashboard-da ödənişləri monitorinq edin
5. ✅ Production-a çıxmazdan əvvəl Live Key-lərə keçin

## 📚 Əlavə Resurlar

- **Tam Dokumentasiya:** `STRIPE_PAYMENT_INTEGRATION.md`
- **Backend Nümunəsi:** `backend-example-stripe.js`
- **Stripe Docs:** https://stripe.com/docs
- **Test Kartları:** https://stripe.com/docs/testing

## 🆘 Kömək Lazımdır?

Stripe Dashboard-da "Help" bölməsinə baxa bilərsiniz və ya aşağıdakı resurslardan istifadə edin:
- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Stripe Discord Community

---

**Uğurlar! 🚀**

Hər hansı sual olarsa, ətraflı dokumentasiya faylına (`STRIPE_PAYMENT_INTEGRATION.md`) baxa bilərsiniz.
