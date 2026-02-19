# MatchArena Backend - Face Recognition API Documentation

## Üzə Tanıma Sisteminin Tələbləri

Bu dokument MatchArena frontend tərəfindən istifadə olunan üzə tanıma API endpoint'lərini və gözlənilən cavab formatlarını təsvir edir.

## Base URL
```
http://localhost:5000/api
```

**Qeyd:** Bu URL'i `assets/js/face-recognition.js` faylında dəyişdirə bilərsiniz.

---

## API Endpoints

### 1. Qeydiyyat zamanı üz şəklini qeyd etmək

#### `POST /auth/register-face`

Yeni istifadəçinin üz şəklini qeyd edir və profildə saxlayır.

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "faceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // Base64 encoded JPEG image
  "userId": null,                      // Yeni istifadəçi üçün null ola bilər
  "email": "user@example.com",
  "firstName": "Ali",
  "lastName": "Məmmədov",
  "phone": "+994501234567",
  "role": "player"                     // player, captain, field-owner, organizer
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Üz şəkli uğurla qeyd edildi",
  "user": {
    "id": 12345,
    "email": "user@example.com",
    "firstName": "Ali",
    "lastName": "Məmmədov",
    "role": "player",
    "faceRegistered": true,
    "faceId": "face_abc123xyz"        // Üzün unique ID'si (DB-də saxlanır)
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Üz aşkarlanmadı",
  "error": "NO_FACE_DETECTED"
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "message": "Bu üz artıq qeydiyyatdan keçib",
  "error": "FACE_ALREADY_REGISTERED"
}
```

---

### 2. Login zamanı üz tanıma

#### `POST /auth/login-face`

Üz şəklinə əsasən istifadəçini tanıyır və authenticate edir.

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "faceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // Base64 encoded JPEG image
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Uğurla tanındınız",
  "user": {
    "id": 12345,
    "email": "user@example.com",
    "name": "Ali Məmmədov",
    "firstName": "Ali",
    "lastName": "Məmmədov",
    "role": "player",
    "phone": "+994501234567",
    "isActive": true,
    "createdAt": "2026-02-12T10:30:00Z",
    "hasPlayerProfile": true,
    "playerProfileId": 678
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT token
  "confidence": 98.5                                      // Tanıma əminlik dərəcəsi (0-100)
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Üz tanınmadı",
  "error": "FACE_NOT_FOUND"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "message": "Üz aşkarlanmadı",
  "error": "NO_FACE_DETECTED"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Tanıma əminlik dərəcəsi çox aşağıdır",
  "error": "LOW_CONFIDENCE",
  "confidence": 45.2
}
```

---

### 3. Üz aşkarlama (Opsional)

#### `POST /auth/detect-face`

Şəkildə üzün olub-olmadığını yoxlayır. Bu endpoint opsionaldır, frontend tərəfdən istifadə oluna bilər.

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "faceImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "faceDetected": true,
  "confidence": 95.8,
  "message": "Üz aşkarlandı",
  "faceCount": 1,                    // Şəkildəki üz sayı
  "faceQuality": "good"              // good, medium, poor
}
```

**Response (200 OK - Face Not Detected):**
```json
{
  "success": true,
  "faceDetected": false,
  "confidence": 0,
  "message": "Üz aşkarlanmadı"
}
```

---

## Texniki Tələblər

### Şəkil Formatı
- **Format:** JPEG
- **Encoding:** Base64 (data URL format)
- **Keyfiyyət:** 0.8 (80%)
- **Ölçü:** 10 KB - 5 MB arası
- **Tövsiyə olunan resolution:** 640x480 və ya daha yüksək

### Şəkil Məlumat Strukturu
```javascript
// Base64 formatında şəkil
const imageData = "data:image/jpeg;base64,/9j/4AAQSkZJRg...";
```

### Üz Tanıma Alqoritmi Tövsiyələri

Backend üçün aşağıdakı kitabxanalardan istifadə edə bilərsiniz:

#### Python (Flask/Django):
1. **face_recognition** (dlib əsaslı - tövsiyə olunur)
```bash
pip install face-recognition
```

2. **OpenCV + Deep Learning**
```bash
pip install opencv-python opencv-contrib-python
```

3. **DeepFace** (TensorFlow/Keras əsaslı)
```bash
pip install deepface
```

#### Node.js (Express):
1. **face-api.js**
```bash
npm install face-api.js canvas
```

2. **@azure/cognitiveservices-face** (Microsoft Azure Face API)

#### Minimum Tələblər:
- Üz aşkarlama (face detection)
- Üz kodlaşdırma (face encoding/embedding)
- Üzlərin müqayisəsi (face comparison)
- Minimum 80% əminlik dərəcəsi (confidence threshold)

---

## Təhlükəsizlik Tövsiyələri

### 1. Üz Məlumatlarının Saxlanması
- Üz şəkillərini **base64 formatında** saxlamayın (çox yer tutur)
- Üzün **encoding/embedding** vektorunu (128/512 ölçülü array) saxlayın
- Şəkili **şifrələnmiş formada** file system və ya cloud storage'da saxlayın

### 2. Database Strukturu
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role ENUM('player', 'captain', 'field-owner', 'organizer', 'admin'),
    face_registered BOOLEAN DEFAULT FALSE,
    face_encoding TEXT,              -- JSON array: [0.123, -0.456, ...]
    face_image_path VARCHAR(500),    -- Şəklin serverə yolu
    face_registered_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Rate Limiting
- Login cəhdlərini limitləyin (məs: 5 cəhd / 15 dəqiqə)
- Eyni IP'dən çox sayda unsuccessful cəhd olarsa blok edin

### 4. CORS və HTTPS
```javascript
// Backend CORS konfiqurasiyası (Express misalı)
app.use(cors({
  origin: 'https://yourdomain.com',  // Production'da dəqiq domain
  credentials: true
}));
```

### 5. Token Autentifikasiyası
- JWT token istifadə edin
- Token'lərin expiry time'ı təyin edin (məs: 24 saat)
- Refresh token mexanizmi əlavə edin

---

## İstifadə Nümunələri

### Frontend'dən API çağırışı (JavaScript)
```javascript
// Face Recognition instance
const faceRecognition = new FaceRecognition();

// Login with face
const imageData = faceRecognition.captureImage(videoElement, canvasElement);
const result = await faceRecognition.recognizeFace(imageData);

if (result.success) {
    console.log('User logged in:', result.user);
    localStorage.setItem('token', result.token);
    // Redirect to dashboard
}
```

### Backend Python (Flask) Nümunəsi
```python
import face_recognition
from flask import Flask, request, jsonify

@app.route('/api/auth/register-face', methods=['POST'])
def register_face():
    data = request.json
    face_image_data = data['faceImage']
    
    # Base64'ü decode et
    image = decode_base64_image(face_image_data)
    
    # Üz aşkarla
    face_encodings = face_recognition.face_encodings(image)
    
    if len(face_encodings) == 0:
        return jsonify({
            'success': False,
            'message': 'Üz aşkarlanmadı',
            'error': 'NO_FACE_DETECTED'
        }), 400
    
    # Üzün encoding'ini saxla
    face_encoding = face_encodings[0].tolist()
    
    # Database'ə yaz
    user = create_user_with_face(data, face_encoding)
    
    return jsonify({
        'success': True,
        'message': 'Üz şəkli uğurla qeyd edildi',
        'user': user
    })

@app.route('/api/auth/login-face', methods=['POST'])
def login_face():
    data = request.json
    face_image_data = data['faceImage']
    
    # Base64'ü decode et
    image = decode_base64_image(face_image_data)
    
    # Üz aşkarla
    face_encodings = face_recognition.face_encodings(image)
    
    if len(face_encodings) == 0:
        return jsonify({
            'success': False,
            'message': 'Üz aşkarlanmadı'
        }), 400
    
    unknown_encoding = face_encodings[0]
    
    # Database'dəki bütün üzlərlə müqayisə et
    users = get_all_users_with_faces()
    
    for user in users:
        known_encoding = np.array(user['face_encoding'])
        matches = face_recognition.compare_faces([known_encoding], unknown_encoding)
        distance = face_recognition.face_distance([known_encoding], unknown_encoding)[0]
        
        if matches[0]:
            confidence = (1 - distance) * 100
            
            if confidence >= 80:
                token = generate_jwt_token(user)
                return jsonify({
                    'success': True,
                    'message': 'Uğurla tanındınız',
                    'user': user,
                    'token': token,
                    'confidence': confidence
                })
    
    return jsonify({
        'success': False,
        'message': 'Üz tanınmadı'
    }), 404
```

---

## Test Məlumatları

### Test İstifadəçiləri
Backend'də test üçün bu istifadəçiləri yarada bilərsiniz:

```json
[
  {
    "email": "player@test.com",
    "firstName": "Oyunçu",
    "lastName": "Test",
    "role": "player",
    "faceRegistered": false
  },
  {
    "email": "captain@test.com",
    "firstName": "Kapitan",
    "lastName": "Test",
    "role": "captain",
    "faceRegistered": true
  }
]
```

---

## Xətaların İdarə Edilməsi

### Frontend Tərəfdə
Frontend aşağıdakı xətaları idarə edir:
- Kamera icazəsi verilməyib
- Üz aşkarlanmadı
- Şəkil keyfiyyəti aşağıdır
- Server cavab vermir
- Üz tanınmadı

### Backend Tərəfdə Qaytarılmalı Xəta Kodları
- `NO_FACE_DETECTED` - Şəkildə üz aşkarlanmadı
- `FACE_ALREADY_REGISTERED` - Bu üz artıq qeydiyyatdan keçib
- `FACE_NOT_FOUND` - Verilənlər bazasında uyğun üz tapılmadı
- `LOW_CONFIDENCE` - Tanıma əminliyi çox aşağıdır (< 80%)
- `MULTIPLE_FACES` - Şəkildə birdən çox üz aşkarlandı
- `INVALID_IMAGE` - Şəkil formatı düzgün deyil
- `SERVER_ERROR` - Server daxili xəta

---

## Frontend Fayllar

Üzə tanıma üçün yaradılmış frontend faylları:

1. **assets/js/face-recognition.js** - Əsas üzə tanıma modulu
2. **assets/js/login.js** - Login səhifəsi üzə tanıma inteqrasiyası
3. **assets/js/register.js** - Qeydiyyat səhifəsi üzə tanıma inteqrasiyası
4. **assets/css/style.css** - Üzə tanıma komponentlərinin stilleri
5. **login.html** - Üzə tanıma ilə login interfeysi
6. **register.html** - Üzə tanıma qeydiyyatı interfeysi

---

## Əlavə Qeydlər

1. **API URL Dəyişiklyi:**
   `assets/js/face-recognition.js` faylında `apiBaseURL` dəyişənini backend URL'inizə uyğun olaraq dəyişdirin:
   ```javascript
   this.apiBaseURL = 'http://localhost:5000/api';
   ```

2. **HTTPS Tələbi:**
   Production mühitində webcam istifadə etmək üçün **HTTPS protokolu məcburidir**.

3. **Brauzer Dəstəyi:**
   - Chrome 53+
   - Firefox 36+
   - Safari 11+
   - Edge 12+

4. **Mobil Dəstək:**
   - iOS Safari 11+
   - Chrome for Android 53+

---

## Suallar və Dəstək

Frontend hissəsi tam hazırdır. Backend implementasiyası üçün bu dokumentdən istifadə edərək API endpoint'lərini hazırlayın.

**Əhəmiyyətli:** Üzə tanıma məlumatlarının təhlükəsizliyinə xüsusi diqqət yetirin və məlumat müdafiəsi qaydalarına (GDPR, KVKK) uyğun hərəkət edin.
