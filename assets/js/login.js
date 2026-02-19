// Login Page Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            console.log('Login attempt:', { email, remember });

            // Simulate login - create user with player role by default
            const user = {
                id: Date.now(),
                email: email,
                name: email.split('@')[0],
                role: 'player', // Default role
                isActive: true,
                createdAt: new Date().toISOString(),
                hasPlayerProfile: false,
                playerProfileId: null
            };

            // Use AuthManager to handle login
            if (window.AuthManager) {
                AuthManager.login(user);
            } else {
                localStorage.setItem('user', JSON.stringify(user));
                alert('Uğurla daxil oldunuz!');
                window.location.href = 'index.html';
            }
        });
    }
});

function loginAsAdmin() {
    const adminUser = {
        id: 1,
        email: 'admin@matcharena.az',
        name: 'Admin',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        hasPlayerProfile: false,
        playerProfileId: null
    };
    
    if (window.AuthManager) {
        AuthManager.login(adminUser);
    } else {
        localStorage.setItem('user', JSON.stringify(adminUser));
        alert('Admin kimi daxil oldunuz!');
        window.location.href = 'admin-panel.html';
    }
}

function loginAsCaptain() {
    const captainUser = {
        id: 2,
        email: 'captain@matcharena.az',
        name: 'Kapitan Əli',
        role: 'captain',
        isActive: true,
        createdAt: new Date().toISOString(),
        hasPlayerProfile: false,
        playerProfileId: null
    };
    
    if (window.AuthManager) {
        AuthManager.login(captainUser);
    } else {
        localStorage.setItem('user', JSON.stringify(captainUser));
        alert('Kapitan kimi daxil oldunuz!');
        window.location.href = 'index.html';
    }
}

function loginAsFieldOwner() {
    const fieldOwnerUser = {
        id: 3,
        email: 'owner@matcharena.az',
        name: 'Meydança Sahibi',
        role: 'field-owner',
        isActive: true,
        createdAt: new Date().toISOString(),
        hasPlayerProfile: false,
        playerProfileId: null
    };
    
    if (window.AuthManager) {
        AuthManager.login(fieldOwnerUser);
    } else {
        localStorage.setItem('user', JSON.stringify(fieldOwnerUser));
        alert('Meydança sahibi kimi daxil oldunuz!');
        window.location.href = 'index.html';
    }
}

function loginAsOrganizer() {
    const organizerUser = {
        id: 4,
        email: 'organizer@matcharena.az',
        name: 'Təşkilatçı',
        role: 'organizer',
        isActive: true,
        createdAt: new Date().toISOString(),
        hasPlayerProfile: false,
        playerProfileId: null
    };
    
    if (window.AuthManager) {
        AuthManager.login(organizerUser);
    } else {
        localStorage.setItem('user', JSON.stringify(organizerUser));
        alert('Təşkilatçı kimi daxil oldunuz!');
        window.location.href = 'index.html';
    }
}

// Face Recognition Login Functionality
document.addEventListener('DOMContentLoaded', function() {
    const startFaceLoginBtn = document.getElementById('startFaceLogin');
    const captureFaceLoginBtn = document.getElementById('captureFaceLogin');
    const cancelFaceLoginBtn = document.getElementById('cancelFaceLogin');
    const faceLoginContainer = document.getElementById('faceLoginContainer');
    const faceLoginVideo = document.getElementById('faceLoginVideo');
    const faceLoginCanvas = document.getElementById('faceLoginCanvas');
    const faceLoginStatus = document.getElementById('faceLoginStatus');
    const loginForm = document.getElementById('loginForm');

    let isCameraActive = false;

    // Üzə tanıma ilə daxil olmağı başlat
    if (startFaceLoginBtn) {
        startFaceLoginBtn.addEventListener('click', async function() {
            // Form və düyməni gizlət, kameranı göstər
            if (loginForm) loginForm.style.display = 'none';
            this.style.display = 'none';
            faceLoginContainer.style.display = 'block';
            
            faceLoginStatus.innerHTML = '<div class="loading">🎥 Kamera açılır...</div>';

            // Kameranı başlat
            const cameraStarted = await window.FaceRecognition.startCamera(faceLoginVideo);
            
            if (cameraStarted) {
                isCameraActive = true;
                faceLoginStatus.innerHTML = '<div class="success">✅ Kamera hazırdır. Üzünüzü kameraya tutun və şəkil çəkin.</div>';
            } else {
                faceLoginStatus.innerHTML = '<div class="error">❌ Kamera açıla bilmədi. Zəhmət olmasa icazələri yoxlayın.</div>';
                resetFaceLogin();
            }
        });
    }

    // Şəkil çək və tanıma et
    if (captureFaceLoginBtn) {
        captureFaceLoginBtn.addEventListener('click', async function() {
            if (!isCameraActive) {
                faceLoginStatus.innerHTML = '<div class="error">❌ Kamera aktiv deyil</div>';
                return;
            }

            faceLoginStatus.innerHTML = '<div class="loading">📸 Şəkil çəkilir...</div>';

            // Şəkil çək
            const imageData = window.FaceRecognition.captureImage(faceLoginVideo, faceLoginCanvas);
            
            // Şəkili göstər
            const previewDiv = document.getElementById('faceLoginPreview');
            if (previewDiv) {
                previewDiv.innerHTML = `<img src="${imageData}" alt="Çəkilmiş şəkil" style="max-width: 100%; border-radius: 8px;" />`;
                previewDiv.style.display = 'block';
            }

            faceLoginStatus.innerHTML = '<div class="loading">🔍 Üz tanınır...</div>';

            // Backend'ə göndər və tanıma et
            const result = await window.FaceRecognition.recognizeFace(imageData);

            if (result.success && result.user) {
                faceLoginStatus.innerHTML = `<div class="success">✅ ${result.message}! Yönləndirilirsiniz...</div>`;
                
                // Kameranı bağla
                window.FaceRecognition.stopCamera();
                
                // İstifadəçi məlumatlarını saxla və yönləndir
                setTimeout(() => {
                    if (window.AuthManager) {
                        AuthManager.login(result.user);
                    } else {
                        localStorage.setItem('user', JSON.stringify(result.user));
                        if (result.token) {
                            localStorage.setItem('token', result.token);
                        }
                        window.location.href = 'index.html';
                    }
                }, 1500);
            } else {
                faceLoginStatus.innerHTML = `<div class="error">❌ ${result.message}. Zəhmət olmasa yenidən cəhd edin.</div>`;
            }
        });
    }

    // İmtina et və geri qayıt
    if (cancelFaceLoginBtn) {
        cancelFaceLoginBtn.addEventListener('click', function() {
            resetFaceLogin();
        });
    }

    function resetFaceLogin() {
        // Kameranı bağla
        window.FaceRecognition.stopCamera();
        isCameraActive = false;

        // UI'ı sıfırla
        faceLoginContainer.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        if (startFaceLoginBtn) startFaceLoginBtn.style.display = 'block';
        
        const previewDiv = document.getElementById('faceLoginPreview');
        if (previewDiv) {
            previewDiv.style.display = 'none';
            previewDiv.innerHTML = '';
        }
        
        faceLoginStatus.innerHTML = '';
    }
});
