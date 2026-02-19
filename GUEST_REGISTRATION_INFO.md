# 🎯 Qonaq Qeydiyyat Sistemi

## 📝 Ümumi Məlumat

İstifadəçilər artıq turnirə qeydiyyat olmaq üçün **daxil olmağa ehtiyac duymurlar**. Sistem 2 növ qeydiyyatı dəstəkləyir:

### 1️⃣ Qeydiyyatlı İstifadəçilər
- Daxil olmuş istifadəçilər
- Mövcud komandalardan seçim
- Komandanın captain-i olmalıdır

### 2️⃣ Qonaq İstifadəçilər (YENİ!)
- Daxil olmadan qeydiyyat
- Email və əlaqə məlumatları ilə
- Yeni komanda məlumatları daxil edilir
- Əlaqə məlumatları saxlanılır

## 🎨 İstifadəçi Təcrübəsi

### İstifadəçi Növü Seçimi (Addım 0)

İstifadəçi "Komanda Qeyd Et" düyməsinə basdıqdan sonra 2 seçim görür:

```
┌─────────────────────────────────────┐
│   Turnirə necə qoşulmaq istəyirsiniz?   │
├─────────────────────────────────────┤
│                                     │
│  👤 Hesabımla daxil ol              │
│  Mövcud hesab və komandalarımla     │
│  qeydiyyatdan keç                   │
│                                     │
│  ✨ Qonaq olaraq davam et           │
│  Daxil olmadan turnirə qeydiyyat    │
│                                     │
└─────────────────────────────────────┘
```

### Qonaq Proses Flow

```
1. User Type Seçimi
   ↓
2. Əlaqə Məlumatları
   • İstifadəçi adı
   • Email
   • Telefon
   ↓
3. Komanda Məlumatları
   • Komanda adı
   • Oyunçu sayı
   • Əlavə qeyd (optional)
   ↓
4. Ödəniş (Stripe)
   ↓
5. Uğur Mesajı
```

## 💾 Verilənlər Bazası Strukturu

### Guest Registrations Cədvəli

```sql
CREATE TABLE guest_registrations (
  id SERIAL PRIMARY KEY,
  tournament_id INTEGER NOT NULL,
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
```

### Guest Payment Intents Cədvəli

```sql
CREATE TABLE guest_payment_intents (
  id SERIAL PRIMARY KEY,
  payment_intent_id VARCHAR(255) NOT NULL UNIQUE,
  tournament_id INTEGER NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50) NOT NULL,
  team_name VARCHAR(255) NOT NULL,
  player_count INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔧 Backend API Dəyişiklikləri

### 1. Payment Intent Yaratma

**Endpoint:** `POST /api/payments/create-intent`

**Qonaq üçün Request Body:**
```json
{
  "type": "guest",
  "tournamentId": 1,
  "amount": 50,
  "guestData": {
    "name": "Əli Həsənov",
    "email": "ali@example.com",
    "phone": "+994501234567",
    "teamName": "Test FC",
    "playerCount": 15,
    "notes": "Əlavə məlumat"
  }
}
```

**Qeydiyyatlı istifadəçi üçün Request Body:**
```json
{
  "type": "registered",
  "tournamentId": 1,
  "teamId": 5,
  "amount": 50
}
```

### 2. Qeydiyyatı Təsdiqləmə

**Endpoint:** `POST /api/payments/confirm-registration`

**Qonaq üçün Request Body:**
```json
{
  "type": "guest",
  "paymentIntentId": "pi_xxxxx",
  "stripePaymentId": "pi_xxxxx",
  "tournamentId": 1,
  "guestData": {
    "name": "Əli Həsənov",
    "email": "ali@example.com",
    "phone": "+994501234567",
    "teamName": "Test FC",
    "playerCount": 15,
    "notes": "Əlavə məlumat"
  }
}
```

## 📊 Qonaq və Qeydiyyatlı İstifadəçilər Arasında Fərqlər

| Xüsusiyyət | Qeydiyyatlı İstifadəçi | Qonaq İstifadəçi |
|-----------|------------------------|------------------|
| **Autentifikasiya** | Bearer Token tələb olunur | Token lazım deyil |
| **Komanda** | Mövcud komandadan seçim | Manuel olaraq daxil edilir |
| **Email Göndərmə** | User database-dən götürülür | Daxil edilən email-ə göndərilir |
| **Verilənlər Saxlama** | `tournament_registrations` | `guest_registrations` |
| **Duplicate Yoxlama** | Team ID ilə | Email ilə |
| **Profil** | Dashboard-da görünür | Yalnız email ilə izlənir |

## ✅ Validasiya Qaydaları

### Qonaq İstifadəçi Validasiyası

**Frontend:**
- Ad: Minimum 3 simvol
- Email: Valid email formatı (`example@domain.com`)
- Telefon: Minimum 10 simvol
- Komanda adı: Minimum 3 simvol
- Oyunçu sayı: Minimum 11, maksimum 25

**Backend:**
- Bütün tələb olunan sahələr doldurulmalıdır
- Email regex validasiyası
- Eyni email ilə duplicate qeydiyyat yoxlanır
- Turnir kapasitəsi yoxlanır (registered + guest)

## 🔐 Təhlükəsizlik

### Qonaq İstifadəçilər üçün:

1. **Rate Limiting:** Eyni IP-dən çox sayda qonaq qeydiyyatını məhdudlaşdırın
2. **Email Verification:** Email təsdiqi göndərin (optional)
3. **reCAPTCHA:** Bot qoruması əlavə edin (tövsiyə olunur)
4. **Duplicate Prevention:** Eyni email ilə duplicate qeydiyyatı bloklayın

## 📧 Email Bildirişləri

### Qonaq İstifadəçi Email Template:

```html
<h2>Təbriklər Əli Həsənov!</h2>
<p>Test FC komandanız Yay Çempionatı 2026 turnirinə uğurla qeydiyyatdan keçdi.</p>
<p>Ödəniş ID: pi_xxxxxxxxxxxxx</p>
<p>Məbləğ: 50₼</p>
<p><strong>Qeyd:</strong> Turnir haqqında əlavə məlumat emailinizə göndəriləcək.</p>
<p>Təşkilatçı sizinlə tezliklə əlaqə saxlayacaq.</p>

<h3>Qeydiyyat Məlumatları:</h3>
<ul>
  <li>Komanda: Test FC</li>
  <li>Oyunçu sayı: 15</li>
  <li>Əlaqə email: ali@example.com</li>
  <li>Telefon: +994501234567</li>
</ul>
```

## 📱 Mobil Responsivlik

Qonaq qeydiyyat forması mobil cihazlar üçün tam optimize edilib:
- Touch-friendly input sahələri
- Auto-complete dəstəyi
- Keyboard type optimization (email, tel, number)
- Error mesajları aydın görünür

## 🎯 İstifadə Halları

### 1. Kiçik Komanda Lideri
**Problem:** Hesabı yoxdur, tez qeydiyyat lazımdır  
**Həll:** Qonaq qeydiyyatı - 2 dəqiqə ərzində tamamlanır

### 2. Bir Dəfəlik İştirak
**Problem:** Yalnız bu turnirdə iştirak edəcək  
**Həll:** Hesab yaratmadan qeydiyyat

### 3. Email ilə İzləmə
**Problem:** Təşkilatçı qonaqları izləməlidir  
**Həll:** Email və telefon məlumatları saxlanılır

## 🚀 Test Etmək

### Frontend Test:
```bash
# Browser-də aç:
tournament-detail.html?id=1

# Steps:
1. "Komanda Qeyd Et" düyməsinə bas
2. "Qonaq olaraq davam et" seç
3. Məlumatları doldur
4. Test kartı: 4242 4242 4242 4242
5. Ödənişi tamamla
```

### Backend Test:
```javascript
// Test qonaq qeydiyyatı
const testGuestRegistration = async () => {
  const response = await fetch('http://localhost:3000/api/payments/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'guest',
      tournamentId: 1,
      amount: 50,
      guestData: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+994501234567',
        teamName: 'Test FC',
        playerCount: 15
      }
    })
  });
  
  const result = await response.json();
  console.log(result);
};
```

## 📈 Statistika və Reporting

### Admin Dashboard-da Göstərmək:

```sql
-- Ümumi qeydiyyatlar (Registered + Guest)
SELECT 
  (SELECT COUNT(*) FROM tournament_registrations WHERE tournament_id = 1) +
  (SELECT COUNT(*) FROM guest_registrations WHERE tournament_id = 1) 
  AS total_registrations;

-- Qonaq qeydiyyatlar
SELECT 
  guest_name,
  guest_email,
  team_name,
  player_count,
  amount,
  paid_at
FROM guest_registrations
WHERE tournament_id = 1
ORDER BY paid_at DESC;
```

## 💡 Best Practices

### 1. Email Verification (Tövsiyə)
Qonaq qeydiyyatından sonra email təsdiq linki göndərin.

### 2. Follow-up Email
2-3 gün sonra xatırlatma emaili göndərin.

### 3. Təşkilatçı Bildirişi
Hər qonaq qeydiyyatında təşkilatçıya email göndərin.

### 4. Status Tracking
Qonaq qeydiyyatlarının statusunu izləyin (confirmed, contacted, completed).

### 5. Data Export
Qonaq məlumatlarını CSV/Excel formatında export edin.

## 🔍 Troubleshooting

### Problem: "Email artıq mövcuddur"
**Həll:** Duplicate email yoxlaması var. Başqa email istifadə edin və ya support ilə əlaqə saxlayın.

### Problem: Qonaq emaili gəlmir
**Həll:** 
- Email service düzgün konfiqurasiya olub?
- Spam qovluğunu yoxlayın
- SMTP credentials düzgündür?

### Problem: Qonaq qeydiyyatı database-ə yazılmır
**Həll:**
- `guest_registrations` cədvəli yaradılıb?
- Database bağlantısı düzgündür?
- Console-da error mesajı varmı?

## 📚 Əlavə Resurslar

- **Əsas Dokumentasiya:** `STRIPE_PAYMENT_INTEGRATION.md`
- **Sürətli Başlanğıc:** `QUICK_START_STRIPE.md`
- **Backend Nümunəsi:** `backend-example-stripe.js`

---

**Yeniləmə tarixi:** 16 Fevral 2026  
**Versiya:** 2.0 - Guest Registration Feature
