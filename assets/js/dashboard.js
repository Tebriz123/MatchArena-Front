// Dashboard Page Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!AuthManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = AuthManager.getCurrentUser();
    const role = user.role;

    // Update page title and info
    document.getElementById('dashboardTitle').textContent = `${AuthManager.getRoleDisplayName(role)} Paneli`;
    document.getElementById('dashboardSubtitle').textContent = `Xoş gəlmisiniz, ${user.name}`;
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').textContent = AuthManager.getRoleDisplayName(role);

    // Load user profile image
    loadUserProfileImage();

    // Show available actions based on role
    const permissionsGrid = document.getElementById('permissionsGrid');
    const actions = [];

    if (AuthManager.hasPermission(PERMISSIONS.CREATE_TEAM)) {
        actions.push({
            title: 'Komanda Yarat',
            icon: '👥',
            link: 'create-team.html',
            color: 'var(--primary-color)'
        });
    }

    if (AuthManager.hasPermission(PERMISSIONS.CREATE_TOURNAMENT)) {
        actions.push({
            title: 'Turnir Yarat',
            icon: '🏆',
            link: 'create-tournament.html',
            color: '#3b82f6'
        });
    }

    if (AuthManager.hasPermission(PERMISSIONS.CREATE_FIELD)) {
        actions.push({
            title: 'Meydança Yarat',
            icon: '⚽',
            link: 'create-field.html',
            color: '#f97316'
        });
    }

    if (AuthManager.hasPermission(PERMISSIONS.ACCESS_ADMIN_PANEL)) {
        actions.push({
            title: 'Admin Panel',
            icon: '🔐',
            link: 'admin-panel.html',
            color: '#ef4444'
        });
    }

    actions.forEach(action => {
        const actionCard = document.createElement('a');
        actionCard.href = action.link;
        actionCard.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.5rem;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid ${action.color};
            border-radius: 0.5rem;
            text-decoration: none;
            color: inherit;
            transition: all 0.3s ease;
        `;
        actionCard.innerHTML = `
            <span style="font-size: 2rem;">${action.icon}</span>
            <span style="font-weight: 600; color: ${action.color};">${action.title}</span>
        `;
        actionCard.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        };
        actionCard.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        permissionsGrid.appendChild(actionCard);
    });

    if (actions.length === 0) {
        permissionsGrid.innerHTML = '<p style="color: var(--text-muted);">Hal-hazırda əlavə icazələriniz yoxdur.</p>';
    }

    // Show all permissions
    const featuresList = document.getElementById('featuresList');
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    
    const featureNames = {
        [PERMISSIONS.CREATE_TOURNAMENT]: '🏆 Turnir yaratma',
        [PERMISSIONS.EDIT_TOURNAMENT]: '✏️ Turnir redaktəsi',
        [PERMISSIONS.DELETE_TOURNAMENT]: '🗑️ Turnir silmə',
        [PERMISSIONS.MANAGE_TOURNAMENT]: '⚙️ Turnir idarəsi',
        [PERMISSIONS.CREATE_TEAM]: '👥 Komanda yaratma',
        [PERMISSIONS.EDIT_TEAM]: '✏️ Komanda redaktəsi',
        [PERMISSIONS.DELETE_TEAM]: '🗑️ Komanda silmə',
        [PERMISSIONS.MANAGE_TEAM_MEMBERS]: '👨‍👩‍👧‍👦 Komanda üzvlərinin idarəsi',
        [PERMISSIONS.CREATE_FIELD]: '⚽ Meydança yaratma',
        [PERMISSIONS.EDIT_FIELD]: '✏️ Meydança redaktəsi',
        [PERMISSIONS.DELETE_FIELD]: '🗑️ Meydança silmə',
        [PERMISSIONS.MANAGE_BOOKINGS]: '📅 Rezervasiya idarəsi',
        [PERMISSIONS.ACCESS_ADMIN_PANEL]: '🔐 Admin panelinə giriş',
        [PERMISSIONS.MANAGE_USERS]: '👤 İstifadəçi idarəsi',
        [PERMISSIONS.MANAGE_REVIEWS]: '⭐ Rəy idarəsi',
        [PERMISSIONS.VIEW_REPORTS]: '📊 Hesabat görüntüləmə',
        [PERMISSIONS.VIEW_CONTENT]: '👁️ Məzmun görüntüləmə',
        [PERMISSIONS.CREATE_REVIEW]: '💬 Rəy yazma',
        [PERMISSIONS.EDIT_PROFILE]: '✏️ Profil redaktəsi'
    };

    rolePermissions.forEach(permission => {
        const featureItem = document.createElement('div');
        featureItem.className = 'service-item';
        featureItem.innerHTML = `
            <span class="service-check">✓</span>
            <span>${featureNames[permission] || permission}</span>
        `;
        featuresList.appendChild(featureItem);
    });
});

// Profile Image Management
function loadUserProfileImage() {
    const user = AuthManager.getCurrentUser();
    const userProfileImage = document.getElementById('userProfileImage');
    const noProfileImage = document.getElementById('noProfileImage');
    const navUserAvatar = document.getElementById('navUserAvatar');
    const removeProfileImageBtn = document.getElementById('removeProfileImageBtn');

    // Check if user has a profile image (from face recognition or uploaded)
    const profileImageUrl = localStorage.getItem(`profileImage_${user.id}`) || 
                           localStorage.getItem(`faceImage_${user.email}`) || 
                           user.faceImage || 
                           user.profileImage;

    if (profileImageUrl) {
        // Show profile image
        if (userProfileImage) {
            userProfileImage.src = profileImageUrl;
            userProfileImage.style.display = 'block';
        }
        if (noProfileImage) {
            noProfileImage.style.display = 'none';
        }
        if (navUserAvatar) {
            navUserAvatar.src = profileImageUrl;
            navUserAvatar.style.display = 'block';
            const userProfileNav = document.querySelector('.user-profile-nav');
            if (userProfileNav) userProfileNav.style.display = 'flex';
        }
        if (removeProfileImageBtn) {
            removeProfileImageBtn.style.display = 'inline-block';
        }
    } else {
        // Show placeholder with user initial
        const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
        if (noProfileImage) {
            noProfileImage.textContent = initial;
            noProfileImage.style.display = 'flex';
        }
        if (userProfileImage) {
            userProfileImage.style.display = 'none';
        }
        if (removeProfileImageBtn) {
            removeProfileImageBtn.style.display = 'none';
        }
    }

    // Update profile image button
    const updateBtn = document.getElementById('updateProfileImageBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', openProfileImageUploader);
    }

    // Remove profile image button
    if (removeProfileImageBtn) {
        removeProfileImageBtn.addEventListener('click', removeProfileImage);
    }
}

function openProfileImageUploader() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Şəkil çox böyükdür. Maksimum 5MB ola bilər.');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Zəhmət olmasa şəkil faylı seçin.');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageData = event.target.result;
            saveProfileImage(imageData);
        };
        reader.readAsDataURL(file);
    });

    // Trigger file input
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

function saveProfileImage(imageData) {
    const user = AuthManager.getCurrentUser();
    
    // Save to localStorage
    localStorage.setItem(`profileImage_${user.id}`, imageData);
    
    // Update user object
    user.profileImage = imageData;
    localStorage.setItem('user', JSON.stringify(user));

    // Reload image display
    loadUserProfileImage();

    // Show success message
    alert('✅ Profil şəkli yeniləndi!');
}

function removeProfileImage() {
    const user = AuthManager.getCurrentUser();
    
    if (!confirm('Profil şəklini silmək istədiyinizdən əminsiniz?')) {
        return;
    }

    // Remove from localStorage
    localStorage.removeItem(`profileImage_${user.id}`);
    localStorage.removeItem(`faceImage_${user.email}`);
    
    // Update user object
    delete user.profileImage;
    delete user.faceImage;
    localStorage.setItem('user', JSON.stringify(user));

    // Reload image display
    loadUserProfileImage();

    alert('✅ Profil şəkli silindi!');
}
