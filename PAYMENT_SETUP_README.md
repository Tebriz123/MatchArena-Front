# MatchArena Stripe Ödəniş Sistemi - Quraşdırma və İstifadə

## 📋 İcmal

MatchArena platformasında **Stripe** ödəniş sistemi tam inteqrasiya edilmişdir. Bu sistem 2 əsas funksionallığı dəstəkləyir:

1. **Meydança Rezervasiyası** - İstifadəçilər meydançaları saatlıq olaraq rezerv edə bilərlər
2. **Məhsul Alışı** - İstifadəçilər idman məhsulları (top, forma, botinka və s.) ala bilərlər

## 🎯 Frontend Strukturu

### Yeni Yaradılmış Fayllar:

```
MatchArena-Front/
├── checkout.html                    # Ödəniş səhifəsi
├── payment-success.html             # Uğurlu ödəniş səhifəsi
├── CSHARP_BACKEND_GUIDE.md         # C# Backend quraşdırma bələdçisi
├── assets/
│   ├── css/
│   │   └── payment-styles.css      # Ödəniş səhifəsi stilləri
│   └── js/
│       ├── api-config.js           # API konfiqurasiya və servis
│       ├── checkout.js             # Ödəniş səhifəsi məntiqi
│       └── field-detail.js         # Meydança rezervasiya məntiqi
```

### Yenilənmiş Fayllar:

```
✓ product-detail.html               # Məhsul ödəniş düymələri
✓ product-detail.js                 # Məhsul ödəniş funksiyaları
✓ field-detail.html                 # Rezervasiya modalı
```

## 🔧 Quraşdırma

### 1. Stripe Açarlarını Konfiqurasiya Edin

`assets/js/api-config.js` faylını açın və aşağıdakı parametrləri yeniləyin:

```javascript
const API_CONFIG = {
    // C# Backend URL-nizi buraya yazın
    baseURL: 'https://localhost:7001/api',
    
    stripe: {
        // Stripe Dashboard-dan Publishable Key götürün
        publishableKey: 'pk_test_your_key_here',
    }
};
```

### 2. Backend URL-ni Təyin Edin

`api-config.js` faylında backend URL-ni production URL-nə dəyişdirin:

```javascript
baseURL: 'https://your-backend-api.com/api'
```

### 3. C# Backend-i Quraşdırın

`CSHARP_BACKEND_GUIDE.md` faylına baxaraq C# ASP.NET Core backend-də:
- Stripe NuGet paketini yükləyin
- Database modelləri yaradın
- API Controller-ləri əlavə edin
- Stripe Secret Key konfiqurasiya edin

## 💳 İstifadə Ssenariləri

### A) Məhsul Alışı

1. İstifadəçi `product-detail.html` səhifəsinə daxil olur
2. Ölçü və miqdar seçir
3. **"Dərhal al"** düyməsini basır
4. `checkout.html` səhifəsinə yönləndirilir
5. Şəxsi məlumatları və çatdırılma ünvanını daxil edir
6. Stripe Card Element-də kart məlumatlarını daxil edir
7. **"Ödənişi Tamamla"** düyməsini basır
8. Backend-də Payment Intent yaradılır
9. Stripe-da ödəniş təsdiqlənir
10. `payment-success.html` səhifəsinə yönləndirilir

### B) Meydança Rezervasiyası

1. İstifadəçi `field-detail.html` səhifəsinə daxil olur
2. **"Rezerv Et"** düyməsini basır
3. Modal açılır:
   - Tarix seçir
   - Vaxt aralığı seçir
   - Müddət (saat) seçir
   - İştirakçı sayı daxil edir
4. **"Ödənişə keç"** düyməsini basır
5. `checkout.html` səhifəsinə yönləndirilir
6. Şəxsi məlumatlarını daxil edir
7. Stripe Card Element-də kart məlumatlarını daxil edir
8. **"Ödənişi Tamamla"** düyməsini basır
9. Backend-də Payment Intent və Rezervasiya yaradılır
10. `payment-success.html` səhifəsinə yönləndirilir

## 🔄 İş Axını

### Frontend → Backend İş Prosesi:

```
1. Frontend: createPaymentIntent() çağırılır
   ↓
2. Backend: POST /api/payments/create-intent
   - Stripe Payment Intent yaradılır
   - Database-ə yazılır
   - clientSecret qaytarılır
   ↓
3. Frontend: stripe.confirmCardPayment(clientSecret)
   - Stripe hosted form ilə ödəniş təsdiqlənir
   ↓
4. Backend: POST /api/payments/confirm
   - Payment statusu yoxlanılır
   - Order/Reservation yaradılır
   - Database-ə yazılır
   ↓
5. Frontend: payment-success.html səhifəsinə redirect
```

## 🎨 UI Komponentləri

### Checkout Səhifəsi

- **Sol panel:** Sifariş xülasəsi
  - Məhsul/Rezervasiya detalları
  - Qiymət hesablamaları
  - Ümumi məbləğ

- **Sağ panel:** Ödəniş forması
  - Şəxsi məlumatlar
  - Çatdırılma ünvanı (yalnız məhsullar üçün)
  - Stripe Card Element
  - Ödəniş düyməsi

### Rezervasiya Modalı

- Tarix seçimi (minimum bu gün)
- Vaxt aralığı seçimi (09:00 - 23:00)
- Müddət seçimi (1-4 saat)
- İştirakçı sayı
- Real-time qiymət hesablama

## 🧪 Test Məlumatları

### Stripe Test Kartları:

**Uğurlu ödəniş:**
```
Kart nömrəsi: 4242 4242 4242 4242
Expiry: 12/34 (istənilən gələcək tarix)
CVC: 123 (istənilən 3 rəqəm)
```

**Rədd edilmiş ödəniş:**
```
Kart nömrəsi: 4000 0000 0000 0002
Expiry: 12/34
CVC: 123
```

**3D Secure tələb edən:**
```
Kart nömrəsi: 4000 0025 0000 3155
Expiry: 12/34
CVC: 123
```

## 🔐 Təhlükəsizlik

### Frontend:
- ✅ Heç vaxt Secret Key-i frontend-də saxlamayın
- ✅ Yalnız Publishable Key istifadə edilir
- ✅ Stripe Elements ilə PCI uyğunluq
- ✅ HTTPS mütləqdir (production-da)

### Backend:
- ✅ Secret Key yalnız backend-də
- ✅ Payment Intent server-side yaradılır
- ✅ Webhook-lar ilə güvənli təsdiqləmə
- ✅ SQL Injection qorunması

## 🚀 Production-a Keçid

### 1. Stripe-ı Live Mode-a çevirin:

```javascript
// api-config.js
stripe: {
    publishableKey: 'pk_live_your_real_key', // Test-dən Live-a dəyişin
}
```

### 2. Backend-də Secret Key-i yeniləyin:

```json
// appsettings.json
{
  "Stripe": {
    "SecretKey": "sk_live_your_real_secret_key"
  }
}
```

### 3. HTTPS-i aktivləşdirin:
- SSL sertifikatı əlavə edin
- HTTPS yönləndirmələrini konfiqurasiya edin

### 4. CORS-u düzgün təyin edin:
```csharp
// Program.cs
policy.WithOrigins("https://your-domain.com")
```

## 📊 Database

Backend-də aşağıdakı cədvəllər lazımdır:

- `Payments` - Bütün ödənişlər
- `FieldReservations` - Meydança rezervasiyaları
- `ProductOrders` - Məhsul sifarişləri
- `OrderItems` - Sifariş elementləri

Tam SQL Schema-ları üçün `CSHARP_BACKEND_GUIDE.md` faylına baxın.

## 📝 API Endpoint-lər

### Payment Endpoints:

```
POST   /api/payments/create-intent    # Payment Intent yarat
POST   /api/payments/confirm           # Ödənişi təsdiqlə
GET    /api/payments/{id}              # Ödəniş detalları
```

### Field Endpoints:

```
GET    /api/fields/{id}                # Meydança detalları
POST   /api/fields/{id}/availability   # Müsaitlik yoxla
```

### Product Endpoints:

```
GET    /api/products/{id}              # Məhsul detalları
```

## 🐛 Troubleshooting

### Problem: "Stripe is not defined"
**Həll:** Əmin olun ki, `<script src="https://js.stripe.com/v3/"></script>` HTML-də var.

### Problem: "API_CONFIG is not defined"
**Həll:** `api-config.js` faylını `checkout.js`-dən əvvəl yükləyin.

### Problem: CORS Error
**Həll:** Backend-də CORS policy-ni düzgün konfiqurasiya edin.

### Problem: Payment Intent fails
**Həll:** Backend-də Stripe Secret Key-in düzgün olduğunu yoxlayın.

## 📞 Dəstək

- **Stripe Documentation:** https://stripe.com/docs
- **ASP.NET Core:** https://docs.microsoft.com/aspnet/core
- **Backend Guide:** `CSHARP_BACKEND_GUIDE.md`

## ✅ Hazırlanmış Xüsusiyyətlər

- ✅ Məhsul alışı və ödəniş
- ✅ Meydança rezervasiyası və ödəniş
- ✅ Stripe Card Elements inteqrasiyası
- ✅ Real-time kart validasiyası
- ✅ Responsive dizayn
- ✅ Loading state-ləri
- ✅ Error handling
- ✅ Success confirmation
- ✅ API Service abstraction
- ✅ C# Backend nümunə kodları

## 🔜 Gələcək Təkmilləşdirmələr

- [ ] Səbət (cart) funksionallığı
- [ ] Çoxlu məhsul alışı
- [ ] Sifarişə baxma
- [ ] Rezervasiyalara baxma
- [ ] Payment history
- [ ] Webhook-lar (ödəniş təsdiqləməsi)
- [ ] Email bildirişləri
- [ ] SMS bildirişləri

---

**Uğurlar! 🎉**
