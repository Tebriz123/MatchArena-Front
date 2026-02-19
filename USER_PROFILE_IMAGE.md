# İstifadəçi Profil Şəkli - Dokumentasiya

## 📸 Xüsusiyyət

İstifadəçilər artıq **player dashboard** və digər dashboard səhifələrində öz profil şəkillərini görə və idarə edə bilərlər.

## ✅ Əlavə Edilən Funksiyalar

### 1. **Navbar-da Profil Şəkli**
Bütün dashboard səhifələrində navbar-ın sağ tərəfində istifadəçinin profil şəkli və adı göstərilir:
- 📷 Profil şəkli (36x36px, dairəvi)
- 👤 İstifadəçi adı
- 🎨 Yaşıl border və kölgə effekti

**Dəstəklənən səhifələr:**
- `player-dashboard.html`
- `captain-dashboard.html`
- `field-owner-dashboard.html`
- `organizer-dashboard.html`
- `admin-panel.html`

### 2. **Dashboard Profil Şəkli İdarəsi**
Hər dashboard səhifəsinin "Hesab Məlumatları" bölməsində:

**Göstərilən elementlər:**
- 🖼️ Böyük profil şəkli (80x80px, dairəvi)
- 🔤 Şəkil olmadıqda - istifadəçinin adının ilk hərfi gradient fonda
- 📷 "Şəkli Yenilə" düyməsi - yeni şəkil yükləmək üçün
- 🗑️ "Şəkli Sil" düyməsi - mövcud şəkli silmək üçün

**İmkanlar:**
- ✅ Şəkil yükləmə (PNG, JPG, JPEG, GIF)
- ✅ Maksimum ölçü: 5MB
- ✅ Avtomatik base64 formatında saxlanma
- ✅ Browser localStorage-də saxlanma
- ✅ Real-time preview

### 3. **Üzə Tanıma inteqrasiyası**
Qeydiyyat zamanı üz şəkli çəkdikdə, həmin şəkil avtomatik olaraq profil şəkli kimi saxlanır:
- Qeydiyyat zamanı üz şəkli çəksəniz → avtomatik profil şəkli olur
- Login zamanı navbar və dashboard-da görünür

## 🖥️ Texniki Detallar

### Şəkil Saxlama
```javascript
// 3 formada saxlanır:
localStorage.setItem(`profileImage_${user.id}`, imageData);        // İstifadəçi ID ilə
localStorage.setItem(`faceImage_${user.email}`, imageData);       // Email ilə (üzə tanıma)
user.profileImage = imageData;                                     // User obyektində
```

### Şəkil Yükləmə Prioriteti
```javascript
1. localStorage: profileImage_{userId}
2. localStorage: faceImage_{userEmail}
3. user.faceImage (üzə tanıma şəkli)
4. user.profileImage
5. Placeholder (ad hərf ilə)
```

### Yeniləmə və Silmə
```javascript
// Şəkil yenilə
openProfileImageUploader() → File seçimi → base64 konversiya → Saxlama

// Şəkil sil
removeProfileImage() → localStorage-dən sil → User obyektindən sil → Placeholder göstər
```

## 📁 Dəyişdirilmiş Fayllar

### HTML Faylları
✅ `player-dashboard.html` - Navbar və profil şəkli bölməsi
✅ `captain-dashboard.html` - Navbar və profil şəkli bölməsi
✅ `field-owner-dashboard.html` - Navbar və profil şəkli bölməsi
✅ `organizer-dashboard.html` - Navbar və profil şəkli bölməsi
✅ `admin-panel.html` - Navbar profil şəkli

### JavaScript Faylları
✅ `assets/js/dashboard.js` - Profil şəkli idarəetmə funksiyaları
✅ `assets/js/app.js` - Navbar profil şəkli yükləmə (global)
✅ `assets/js/register.js` - Qeydiyyat zamanı üz şəkli saxlama

### CSS Faylları
✅ `assets/css/style.css` - Profil şəkli stilləri

## 🎨 CSS Stilləri

```css
/* Navbar Avatar */
.user-profile-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.user-avatar-nav {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--primary-color);
    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

/* Dashboard Profile Image */
.user-profile-image {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-profile-image:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4) !important;
}
```

## 🚀 İstifadə Nümunələri

### 1. Qeydiyyat zamanı üz şəkli
```
Register səhifəsi → Üz şəkli çək (opsional) → Qeydiyyat
→ Dashboard açılır → Həmin şəkil navbar və profildə görünür
```

### 2. Dashboard-da şəkil yenilə
```
Dashboard → Hesab Məlumatları → "📷 Şəkli Yenilə" düyməsi
→ File seç → Avtomatik yüklənir və görünür
```

### 3. Şəkil sil
```
Dashboard → Hesab Məlumatları → "🗑️ Şəkli Sil" düyməsi
→ Təsdiq et → Şəkil silinir, placeholder görünür
```

## 🔄 Avtomatik Yeniləmə

Profil şəkli dəyişdikdə:
1. ✅ Navbar avatarı yenilənir
2. ✅ Dashboard profil şəkli yenilənir
3. ✅ localStorage-də saxlanır
4. ✅ User obyekti yenilənir

## 📱 Responsive Dizayn

- Desktop: Tam ölçüdə şəkillər
- Tablet: Orta ölçü
- Mobil: Kiçik ölçü, lakin keyfiyyətli

## ⚠️ Məhdudiyyətlər

- **Maksimum ölçü:** 5MB
- **Dəstəklənən formatlar:** JPG, PNG, JPEG, GIF
- **Saxlanma yeri:** Browser localStorage (müvəqqəti)
- **Backend varsa:** API-yə göndərmək üçün `saveProfileImage()` funksiyasını yeniləyin

## 🔧 Backend İnteqrasiyası (Opsional)

Backend-iniz varsa, `dashboard.js`-də `saveProfileImage()` funksiyasını yeniləyin:

```javascript
async function saveProfileImage(imageData) {
    const user = AuthManager.getCurrentUser();
    
    try {
        // Backend-ə göndər
        const response = await fetch('http://api.example.com/user/profile-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                userId: user.id,
                profileImage: imageData
            })
        });

        if (response.ok) {
            // LocalStorage-də də saxla
            localStorage.setItem(`profileImage_${user.id}`, imageData);
            user.profileImage = imageData;
            localStorage.setItem('user', JSON.stringify(user));
            
            loadUserProfileImage();
            alert('✅ Profil şəkli yeniləndi!');
        }
    } catch (error) {
        console.error('Profil şəkli yüklənə bilmədi:', error);
        alert('❌ Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
}
```

## 📞 Dəstək

Hər hansı sual və ya problem olarsa, layihənin GitHub issues bölməsində məlumat verə bilərsiniz.

---

✨ **MatchArena** - Futbol həvəskarları üçün ən yaxşı platforma!
