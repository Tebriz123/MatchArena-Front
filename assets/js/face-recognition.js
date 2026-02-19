// Face Recognition Module
// Bu modul webcam vasitəsilə üz tanıma və qeydiyyat funksiyalarını təmin edir

class FaceRecognition {
    constructor() {
        this.stream = null;
        this.video = null;
        this.canvas = null;
        this.context = null;
        this.apiBaseURL = 'http://localhost:5000/api'; // Backend API URL'ini buradan dəyişdirin
    }

    // Kamera açmaq
    async startCamera(videoElement) {
        try {
            this.video = videoElement;
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                },
                audio: false 
            });
            this.video.srcObject = this.stream;
            await this.video.play();
            return true;
        } catch (error) {
            console.error('Kamera açılarkən xəta:', error);
            alert('Kamera açıla bilmədi. Zəhmət olmasa brauzerdə kamera icazəsini yoxlayın.');
            return false;
        }
    }

    // Kamera bağlamaq
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.video) {
            this.video.srcObject = null;
        }
    }

    // Şəkil çəkmək
    captureImage(videoElement, canvasElement) {
        this.canvas = canvasElement;
        this.context = this.canvas.getContext('2d');
        
        // Video ölçüsünə görə canvas ölçüsünü təyin et
        this.canvas.width = videoElement.videoWidth;
        this.canvas.height = videoElement.videoHeight;
        
        // Video frame'ini canvas'a çək
        this.context.drawImage(videoElement, 0, 0, this.canvas.width, this.canvas.height);
        
        // Canvas'dan base64 formatında şəkil al
        return this.canvas.toDataURL('image/jpeg', 0.8);
    }

    // Qeydiyyat zamanı üz şəklini göndərmək
    async registerFace(imageData, userData) {
        try {
            const response = await fetch(`${this.apiBaseURL}/auth/register-face`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    faceImage: imageData,
                    userId: userData.id || null,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: userData.phone,
                    role: userData.role
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Üz şəkli uğurla qeyd edildi',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Üz qeydiyyatı uğursuz oldu',
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Üz qeydiyyatı xətası:', error);
            return {
                success: false,
                message: 'Server ilə əlaqə qurula bilmədi',
                error: error.message
            };
        }
    }

    // Login zamanı üz tanıma
    async recognizeFace(imageData) {
        try {
            const response = await fetch(`${this.apiBaseURL}/auth/login-face`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    faceImage: imageData
                })
            });

            const result = await response.json();
            
            if (response.ok && result.user) {
                return {
                    success: true,
                    message: 'Uğurla tanındınız',
                    user: result.user,
                    token: result.token
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Üz tanınmadı',
                    error: result.error
                };
            }
        } catch (error) {
            console.error('Üz tanıma xətası:', error);
            return {
                success: false,
                message: 'Server ilə əlaqə qurula bilmədi',
                error: error.message
            };
        }
    }

    // Üz aşkarlanıb-aşkarlanmadığını yoxlamaq (opsional - əlavə təhlükəsizlik)
    async detectFace(imageData) {
        try {
            const response = await fetch(`${this.apiBaseURL}/auth/detect-face`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    faceImage: imageData
                })
            });

            const result = await response.json();
            
            return {
                success: response.ok,
                faceDetected: result.faceDetected || false,
                confidence: result.confidence || 0,
                message: result.message
            };
        } catch (error) {
            console.error('Üz aşkarlama xətası:', error);
            return {
                success: false,
                faceDetected: false,
                message: 'Üz aşkarlanmadı'
            };
        }
    }

    // Şəkil keyfiyyətini yoxlamaq
    checkImageQuality(canvas) {
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        const sizeInBytes = Math.round((imageData.length - 'data:image/jpeg;base64,'.length) * 3/4);
        const sizeInKB = sizeInBytes / 1024;

        // Minimum və maksimum ölçü yoxlaması
        if (sizeInKB < 10) {
            return {
                valid: false,
                message: 'Şəkil çox kiçikdir. Daha yaxın olun.'
            };
        }
        if (sizeInKB > 5000) {
            return {
                valid: false,
                message: 'Şəkil çox böyükdür. Zəhmət olmasa yenidən cəhd edin.'
            };
        }

        return {
            valid: true,
            sizeInKB: sizeInKB.toFixed(2)
        };
    }

    // Base64 şəkli Blob'a çevirmək (lazım olarsa)
    base64ToBlob(base64, mimeType = 'image/jpeg') {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ab], { type: mimeType });
    }
}

// Global instance yaratmaq
window.FaceRecognition = new FaceRecognition();
