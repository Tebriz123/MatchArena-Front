// Register Page Handler
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const userTypeSelect = document.getElementById('userType');
    const roleDescriptionElement = document.getElementById('roleDescription');
    
    // Show role description when user selects a role
    if (userTypeSelect && roleDescriptionElement) {
        userTypeSelect.addEventListener('change', function() {
            const role = this.value;
            if (role && window.AuthManager) {
                roleDescriptionElement.textContent = AuthManager.getRoleDescription(role);
                roleDescriptionElement.style.display = 'block';
            } else {
                roleDescriptionElement.style.display = 'none';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            const userType = document.getElementById('userType').value;

            // Validation
            if (!userType) {
                alert('Zəhmət olmasa hesab növünü seçin!');
                return;
            }

            if (password.length < 6) {
                alert('Şifrə minimum 6 simvol olmalıdır!');
                return;
            }

            if (password !== confirmPassword) {
                alert('Şifrələr uyğun gəlmir!');
                return;
            }

            if (!terms) {
                alert('İstifadə şərtlərini qəbul etməlisiniz!');
                return;
            }

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                role: userType, // This is the role (captain, field-owner, etc.)
                newsletter: document.querySelector('input[name="newsletter"]').checked
            };

            console.log('Registration data:', formData);

            // Create user object with proper role
            const user = {
                id: Date.now(),
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone,
                role: formData.role,
                newsletter: formData.newsletter,
                createdAt: new Date().toISOString(),
                isActive: true,
                hasPlayerProfile: false, // Initially no player profile
                playerProfileId: null
            };

            // Add face image if captured
            if (capturedFaceImage) {
                user.faceImage = capturedFaceImage;
                // Also save separately for easy access
                localStorage.setItem(`faceImage_${user.email}`, capturedFaceImage);
                localStorage.setItem(`profileImage_${user.id}`, capturedFaceImage);
            }

            // Store user data
            localStorage.setItem('user', JSON.stringify(user));

            // Show success message with role-specific information
            const roleName = window.AuthManager ? 
                AuthManager.getRoleDisplayName(formData.role) : 
                formData.role;
            
            alert(`Qeydiyyat uğurla tamamlandı!\nRolunuz: ${roleName}`);

            // Use AuthManager to redirect to appropriate dashboard
            if (window.AuthManager) {
                AuthManager.login(user);
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Face Registration Functionality
    const startFaceCaptureBtn = document.getElementById('startFaceCapture');
    const captureFaceRegisterBtn = document.getElementById('captureFaceRegister');
    const retakeFacePhotoBtn = document.getElementById('retakeFacePhoto');
    const removeFacePhotoBtn = document.getElementById('removeFacePhoto');
    const faceCameraWrapper = document.getElementById('faceCameraWrapper');
    const facePreviewWrapper = document.getElementById('facePreviewWrapper');
    const faceRegisterVideo = document.getElementById('faceRegisterVideo');
    const faceRegisterCanvas = document.getElementById('faceRegisterCanvas');
    const faceRegisterStatus = document.getElementById('faceRegisterStatus');
    const faceImageDataInput = document.getElementById('faceImageData');
    const facePreviewImg = document.getElementById('facePreview');

    let isFaceCameraActive = false;
    let capturedFaceImage = null;

    // Üz şəkli çəkməyə başla
    if (startFaceCaptureBtn) {
        startFaceCaptureBtn.addEventListener('click', async function() {
            faceCameraWrapper.style.display = 'block';
            this.style.display = 'none';
            captureFaceRegisterBtn.style.display = 'inline-block';
            
            faceRegisterStatus.innerHTML = '<div class="loading">🎥 Kamera açılır...</div>';

            const cameraStarted = await window.FaceRecognition.startCamera(faceRegisterVideo);
            
            if (cameraStarted) {
                isFaceCameraActive = true;
                faceRegisterStatus.innerHTML = '<div class="success">✅ Üzünüzü kameraya tutun və şəkil çəkin</div>';
            } else {
                faceRegisterStatus.innerHTML = '<div class="error">❌ Kamera açıla bilmədi</div>';
                resetFaceCapture();
            }
        });
    }

    // Şəkil çək
    if (captureFaceRegisterBtn) {
        captureFaceRegisterBtn.addEventListener('click', function() {
            if (!isFaceCameraActive) {
                faceRegisterStatus.innerHTML = '<div class="error">❌ Kamera aktiv deyil</div>';
                return;
            }

            // Şəkil çək
            capturedFaceImage = window.FaceRecognition.captureImage(faceRegisterVideo, faceRegisterCanvas);
            
            // Şəkil keyfiyyətini yoxla
            const quality = window.FaceRecognition.checkImageQuality(faceRegisterCanvas);
            
            if (!quality.valid) {
                faceRegisterStatus.innerHTML = `<div class="error">❌ ${quality.message}</div>`;
                return;
            }

            // Şəkili göstər
            facePreviewImg.src = capturedFaceImage;
            facePreviewWrapper.style.display = 'block';
            
            // Hidden input'a məlumatı yaz
            faceImageDataInput.value = capturedFaceImage;

            // Kameranı bağla və düymələri dəyiş
            window.FaceRecognition.stopCamera();
            isFaceCameraActive = false;
            faceCameraWrapper.style.display = 'none';
            captureFaceRegisterBtn.style.display = 'none';
            retakeFacePhotoBtn.style.display = 'inline-block';
            removeFacePhotoBtn.style.display = 'inline-block';

            faceRegisterStatus.innerHTML = `<div class="success">✅ Üz şəkli qeyd edildi (${quality.sizeInKB} KB)</div>`;
        });
    }

    // Yenidən çək
    if (retakeFacePhotoBtn) {
        retakeFacePhotoBtn.addEventListener('click', async function() {
            facePreviewWrapper.style.display = 'none';
            faceCameraWrapper.style.display = 'block';
            this.style.display = 'none';
            removeFacePhotoBtn.style.display = 'none';
            captureFaceRegisterBtn.style.display = 'inline-block';
            
            faceRegisterStatus.innerHTML = '<div class="loading">🎥 Kamera açılır...</div>';

            const cameraStarted = await window.FaceRecognition.startCamera(faceRegisterVideo);
            
            if (cameraStarted) {
                isFaceCameraActive = true;
                faceRegisterStatus.innerHTML = '<div class="success">✅ Yenidən çəkin</div>';
            } else {
                faceRegisterStatus.innerHTML = '<div class="error">❌ Kamera açıla bilmədi</div>';
                resetFaceCapture();
            }
        });
    }

    // Şəkli sil
    if (removeFacePhotoBtn) {
        removeFacePhotoBtn.addEventListener('click', function() {
            capturedFaceImage = null;
            faceImageDataInput.value = '';
            resetFaceCapture();
            faceRegisterStatus.innerHTML = '<div class="info">ℹ️ Üz şəkli silindi</div>';
        });
    }

    function resetFaceCapture() {
        window.FaceRecognition.stopCamera();
        isFaceCameraActive = false;
        faceCameraWrapper.style.display = 'none';
        facePreviewWrapper.style.display = 'none';
        captureFaceRegisterBtn.style.display = 'none';
        retakeFacePhotoBtn.style.display = 'none';
        removeFacePhotoBtn.style.display = 'none';
        if (startFaceCaptureBtn) startFaceCaptureBtn.style.display = 'inline-block';
    }
});
