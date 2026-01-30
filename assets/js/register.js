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
                isActive: true
            };

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
});
