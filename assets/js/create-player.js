// Create Player Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to create player
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.CREATE_PLAYER, 'players.html')) {
            return; // User will be redirected
        }
    }
    
    const createPlayerForm = document.getElementById('createPlayerForm');
    
    if (createPlayerForm) {
        createPlayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.CREATE_PLAYER)) {
                    alert('Oyunçu yaratmaq üçün icazəniz yoxdur!');
                    return;
                }
            }
            
            // Get position text
            const positionSelect = document.getElementById('position');
            const positionText = positionSelect.options[positionSelect.selectedIndex].text;
            
            const formData = {
                name: document.getElementById('playerName').value,
                age: parseInt(document.getElementById('age').value),
                height: parseInt(document.getElementById('height').value) || null,
                weight: parseInt(document.getElementById('weight').value) || null,
                city: document.getElementById('city').value,
                nationality: document.getElementById('nationality').value || 'Azərbaycan',
                email: document.getElementById('email').value || null,
                phone: document.getElementById('phone').value || null,
                position: document.getElementById('position').value,
                positionText: positionText,
                preferredFoot: document.getElementById('preferredFoot').value || null,
                experience: parseInt(document.getElementById('experience').value) || 0,
                currentTeam: document.getElementById('currentTeam').value || null,
                matchesPlayed: parseInt(document.getElementById('matchesPlayed').value) || 0,
                goals: parseInt(document.getElementById('goals').value) || 0,
                assists: parseInt(document.getElementById('assists').value) || 0,
                yellowCards: parseInt(document.getElementById('yellowCards').value) || 0,
                redCards: parseInt(document.getElementById('redCards').value) || 0,
                rating: parseFloat(document.getElementById('rating').value) || null,
                lookingForTeam: document.getElementById('lookingForTeam').checked,
                available: document.getElementById('available').checked,
                bio: document.getElementById('bio').value || '',
                createdBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                createdAt: new Date().toISOString()
            };

            console.log('Player Created:', formData);
            
            // Store player in localStorage
            const players = JSON.parse(localStorage.getItem('players') || '[]');
            formData.id = Date.now();
            
            // Generate avatar initial (first letter of name)
            formData.avatar = formData.name.charAt(0).toUpperCase();
            
            players.push(formData);
            localStorage.setItem('players', JSON.stringify(players));
            
            alert('Oyunçu uğurla yaradıldı!');
            window.location.href = 'players.html';
        });
        
        // Form validation helpers
        const ageInput = document.getElementById('age');
        ageInput.addEventListener('input', function() {
            if (this.value < 10) {
                this.setCustomValidity('Yaş ən azı 10 olmalıdır');
            } else if (this.value > 100) {
                this.setCustomValidity('Yaş ən çox 100 ola bilər');
            } else {
                this.setCustomValidity('');
            }
        });
        
        const ratingInput = document.getElementById('rating');
        ratingInput.addEventListener('input', function() {
            if (this.value < 0) {
                this.setCustomValidity('Reytinq 0-dan kiçik ola bilməz');
            } else if (this.value > 10) {
                this.setCustomValidity('Reytinq 10-dan böyük ola bilməz');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
