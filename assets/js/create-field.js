// Create Field Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to create field - Only Admins and Field Owners
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.CREATE_FIELD, 'fields.html')) {
            return; // User will be redirected
        }
    }
    
    const createFieldForm = document.getElementById('createFieldForm');
    
    if (createFieldForm) {
        createFieldForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.CREATE_FIELD)) {
                    alert('Meydança yaratmaq üçün icazəniz yoxdur! Yalnız administratorlar və meydança sahibləri meydança yarada bilər.');
                    return;
                }
            }
            
            const formData = {
                name: document.getElementById('fieldName').value,
                city: document.getElementById('city').value,
                district: document.getElementById('district').value,
                address: document.getElementById('address').value,
                icon: document.getElementById('fieldIcon').value || '⚽',
                size: document.getElementById('fieldSize').value,
                surfaceType: document.getElementById('surfaceType').value,
                capacity: parseInt(document.getElementById('capacity').value) || 0,
                rating: parseFloat(document.getElementById('rating').value),
                indoor: document.getElementById('indoor').checked,
                lighting: document.getElementById('lighting').checked,
                parking: document.getElementById('parking').checked,
                locker: document.getElementById('locker').checked,
                pricePerHour: parseFloat(document.getElementById('pricePerHour').value),
                availability: document.getElementById('availability').value,
                contactPhone: document.getElementById('contactPhone').value,
                contactEmail: document.getElementById('contactEmail').value,
                website: document.getElementById('website').value,
                openTime: document.getElementById('openTime').value,
                closeTime: document.getElementById('closeTime').value,
                description: document.getElementById('description').value,
                createdBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                createdAt: new Date().toISOString()
            };

            console.log('Field Created:', formData);
            
            // Store field in localStorage
            const fields = JSON.parse(localStorage.getItem('fields') || '[]');
            formData.id = Date.now();
            fields.push(formData);
            localStorage.setItem('fields', JSON.stringify(fields));
            
            alert('Meydança uğurla yaradıldı!');
            window.location.href = 'fields.html';
        });
    }
});
