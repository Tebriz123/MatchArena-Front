# 🛒 Səbət (Shopping Cart) Funksionallığı

## ✅ Nə Əlavə Edildi

### 🎯 Yeni Səhifələr:

1. **[cart.html](cart.html)** - Səbət səhifəsi
   - Səbətdəki məhsulları göstərir
   - Miqdarı artır/azaldır
   - Məhsul silir
   - Səbəti təmizləyir
   - Ödənişə keçid

### 📝 Yeni JavaScript Faylları:

1. **[assets/js/cart.js](assets/js/cart.js)** - Səbət idarəetməsi
   - localStorage ilə səbət saxlanması
   - Məhsul əlavə/çıxarma
   - Miqdar yeniləmə
   - Cart badge yeniləmə
   - Checkout-a keçid

### 🎨 Yenilənmiş Fayllar:

1. **Navbar (bütün səhifələrdə):**
   - 🛒 Səbət ikonu əlavə edildi
   - Səbət badge (məhsul sayı) göstərilir

2. **[product-detail.js](assets/js/product-detail.js):**
   - "Səbətə əlavə et" funksiyası təkmilləşdirildi
   - Notification sistemi əlavə edildi
   - Səbət badge avtomatik yenilənir

3. **[checkout.js](assets/js/checkout.js):**
   - Ödəniş uğurlu olduqda səbət təmizlənir

4. **[payment-styles.css](assets/css/payment-styles.css):**
   - Səbət səhifəsi stilləri
   - Cart badge stilləri
   - Notification stilləri

## 🚀 Necə İşləyir

### 1️⃣ Məhsul Səbətə Əlavə Etmək:

```
Product Detail səhifəsi → Ölçü seç → Miqdar seç → "Səbətə əlavə et"
```

- Məhsul localStorage-ə əlavə edilir
- Notification göstərilir
- Navbar-daki səbət badge-i yenilənir

### 2️⃣ Səbətdən Alış-veriş:

```
Navbar → 🛒 ikonu → Səbət səhifəsi → "Ödənişə keç"
```

- Səbətdəki bütün məhsullar checkout-a göndərilir
- Ödəniş tamamlananda səbət avtomatik təmizlənir

### 3️⃣ Birbaşa Alış (Dərhal al):

```
Product Detail səhifəsi → Ölçü seç → "Dərhal al"
```

- Səbətə əlavə etmədən birbaşa checkout-a gedir
- Səbət təmizlənmir

## 📊 Səbət Xüsusiyyətləri

### ✨ Əsas Funksiyalar:

- ✅ Məhsul əlavə etmə
- ✅ Miqdar artırma/azaltma (1-10 arası)
- ✅ Məhsul silmə
- ✅ Səbəti tamamilə təmizləmə
- ✅ Real-time qiymət hesablama
- ✅ Çatdırılma haqqı hesablama (100₼-dən yuxarı pulsuz)
- ✅ localStorage ilə saxlama (səhifə yenilənəndə qalır)
- ✅ Boş səbət mesajı
- ✅ Notification sistemi

### 💰 Qiymət Hesablamaları:

```javascript
Ara cəm: Məhsulların ümumi qiyməti
Çatdırılma: 100₼-dən aşağı sifarişlər üçün 5₼
Ümumi: Ara cəm + Çatdırılma
```

**Nümunə:**
- 2x Top (45₼) + 1x Forma (80₼) = 170₼
- Çatdırılma: Pulsuz (100₼-dən yuxarı)
- **Ümumi: 170₼**

## 🎨 İstifadəçi İnterfeysi

### Səbət Badge:
```
🛒 3  ← Navbar-da
```
- Qırmızı badge
- Məhsul sayını göstərir
- Boş səbətdə gizlənir
- Bütün səhifələrdə avtomatik yenilənir

### Notification:
```
✓ 2 ədəd "Professional Match Football" səbətə əlavə edildi!
[Səbətə get]
```
- Yaşıl notification (5 saniyə)
- Səbətə keçid linki
- Animasiyalı giriş/çıxış

### Səbət Elementi:
```
[Şəkil] | Məhsul adı           | [-] 2 [+] | 90.00₼
        | Ölçü: M              |    [🗑️]   |
        | 45.00₼               |           |
```

## 📱 Responsive Dizayn

- ✅ Desktop: 2 sütunlu layout (məhsullar + xülasə)
- ✅ Tablet: 1 sütunlu layout
- ✅ Mobile: Kiçik şəkillər və kompakt dizayn

## 🔄 localStorage Strukturu

### Cart Data:
```javascript
[
  {
    id: 1,
    name: "Professional Match Football",
    price: 89.99,
    image: "assets/img/...",
    size: "M",
    quantity: 2
  },
  // ...
]
```

## 🛠️ Test Etmək

### 1. Səbətə Məhsul Əlavə Et:
```
1. products.html və ya product-detail.html-ə daxil ol
2. Məhsul seç və ölçü seç
3. "Səbətə əlavə et" düyməsini bas
4. Navbar-da badge-in artdığını gör
5. Notification-u gör
```

### 2. Səbəti İdarə Et:
```
1. Navbar-da 🛒 ikonuna klikləyin
2. Miqdarı artır/azalt
3. Məhsul sil
4. "Səbəti təmizlə" düyməsini test et
```

### 3. Ödəniş:
```
1. Səbətə bir neçə məhsul əlavə et
2. "Ödənişə keç" düyməsini bas
3. Checkout səhifəsində məhsulların göründüyünü yoxla
4. Test kartı ilə ödəniş et (4242 4242 4242 4242)
5. Uğurlu ödənişdən sonra səbətin boşaldığını yoxla
```

## 🔗 Bağlantılar

- **Səbət səhifəsi:** [cart.html](cart.html)
- **Məhsullar:** [products.html](products.html)
- **Ödəniş:** [checkout.html](checkout.html)

## 📋 Statuslar

| Funksiya | Status |
|----------|--------|
| Məhsul əlavə etmə | ✅ Tamamlandı |
| Miqdar dəyişmə | ✅ Tamamlandı |
| Məhsul silmə | ✅ Tamamlandı |
| Səbəti təmizləmə | ✅ Tamamlandı |
| Cart badge | ✅ Tamamlandı |
| Notification | ✅ Tamamlandı |
| Ödəniş inteqrasiyası | ✅ Tamamlandı |
| localStorage saxlama | ✅ Tamamlandı |
| Responsive dizayn | ✅ Tamamlandı |

## 🎉 İstifadəyə Hazırdır!

Səbət funksionallığı tam işləkdir. İstifadəçilər indi:
1. ✅ Məhsulları səbətə əlavə edə bilər
2. ✅ Səbəti idarə edə bilər
3. ✅ Səbətdən ödəniş edə bilər
4. ✅ Stripe ilə təhlükəsiz ödəniş edə bilər

---

**Test kartı:** 4242 4242 4242 4242 | Exp: 12/34 | CVC: 123
