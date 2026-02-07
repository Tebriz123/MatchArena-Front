// Update Field Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to update field
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.UPDATE_FIELD, 'fields.html')) {
            return; // User will be redirected
        }
    }

    // Get field ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const fieldId = urlParams.get('id');

    if (!fieldId) {
        alert('Meydança ID-si tapılmadı!');
        window.location.href = 'fields.html';
        return;
    }

    // Load field data
    const fields = JSON.parse(localStorage.getItem('fields') || '[]');
    const field = fields.find(f => f.id == fieldId);

    if (!field) {
        alert('Meydança tapılmadı!');
        window.location.href = 'fields.html';
        return;
    }

    // Populate form with field data
    document.getElementById('fieldName').value = field.name || '';
    document.getElementById('city').value = field.city || '';
    document.getElementById('district').value = field.district || '';
    document.getElementById('address').value = field.address || '';
    document.getElementById('fieldIcon').value = field.icon || '';
    document.getElementById('fieldSize').value = field.size || '';
    document.getElementById('surfaceType').value = field.surface || '';
    document.getElementById('lighting').value = field.lighting || '';
    document.getElementById('covered').value = field.covered || '';
    document.getElementById('capacity').value = field.capacity || '';
    document.getElementById('parkingSpaces').value = field.parkingSpaces || 0;
    document.getElementById('pricePerHour').value = field.pricePerHour || '';
    document.getElementById('ownerName').value = field.ownerName || '';
    document.getElementById('contactPhone').value = field.contactPhone || '';
    document.getElementById('contactEmail').value = field.contactEmail || '';
    document.getElementById('openingHours').value = field.openingHours || '';
    document.getElementById('available').checked = field.available !== false;
    document.getElementById('description').value = field.description || '';

    // Populate amenities checkboxes
    if (field.amenities && Array.isArray(field.amenities)) {
        field.amenities.forEach(amenity => {
            const checkbox = document.getElementById(`amenity-${amenity}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
    }

    // Handle form submission
    const updateFieldForm = document.getElementById('updateFieldForm');
    
    if (updateFieldForm) {
        updateFieldForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.UPDATE_FIELD)) {
                    alert('Meydança yeniləmək üçün icazəniz yoxdur!');
                    return;
                }
            }
            
            // Get selected amenities
            const amenitiesCheckboxes = document.querySelectorAll('input[name="amenities"]:checked');
            const amenities = Array.from(amenitiesCheckboxes).map(cb => cb.value);
            
            // Get surface type text
            const surfaceSelect = document.getElementById('surfaceType');
            const surfaceText = surfaceSelect.options[surfaceSelect.selectedIndex].text;
            
            // Update field data
            const updatedData = {
                ...field,
                name: document.getElementById('fieldName').value,
                city: document.getElementById('city').value,
                district: document.getElementById('district').value || null,
                address: document.getElementById('address').value,
                icon: document.getElementById('fieldIcon').value || '⚽',
                size: document.getElementById('fieldSize').value,
                surface: document.getElementById('surfaceType').value,
                surfaceText: surfaceText,
                lighting: document.getElementById('lighting').value || null,
                covered: document.getElementById('covered').value || null,
                capacity: parseInt(document.getElementById('capacity').value) || null,
                parkingSpaces: parseInt(document.getElementById('parkingSpaces').value) || 0,
                pricePerHour: parseFloat(document.getElementById('pricePerHour').value),
                ownerName: document.getElementById('ownerName').value || null,
                contactPhone: document.getElementById('contactPhone').value,
                contactEmail: document.getElementById('contactEmail').value || null,
                amenities: amenities,
                openingHours: document.getElementById('openingHours').value || null,
                available: document.getElementById('available').checked,
                description: document.getElementById('description').value || '',
                updatedBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                updatedAt: new Date().toISOString()
            };

            console.log('Field Updated:', updatedData);
            
            // Update field in localStorage
            const fieldIndex = fields.findIndex(f => f.id == fieldId);
            if (fieldIndex !== -1) {
                fields[fieldIndex] = updatedData;
                localStorage.setItem('fields', JSON.stringify(fields));
                
                alert('Meydança uğurla yeniləndi!');
                window.location.href = 'field-detail.html?id=' + fieldId;
            } else {
                alert('Xəta baş verdi!');
            }
        });
        
        // Form validation
        const priceInput = document.getElementById('pricePerHour');
        priceInput.addEventListener('input', function() {
            if (this.value < 0) {
                this.setCustomValidity('Qiymət mənfi ola bilməz');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
