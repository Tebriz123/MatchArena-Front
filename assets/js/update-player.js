// Update Player Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to update player
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.UPDATE_PLAYER, 'players.html')) {
            return; // User will be redirected
        }
    }

    // Get player ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id');

    if (!playerId) {
        alert('Oyunçu ID-si tapılmadı!');
        window.location.href = 'players.html';
        return;
    }

    // Load player data
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const player = players.find(p => p.id == playerId);

    if (!player) {
        alert('Oyunçu tapılmadı!');
        window.location.href = 'players.html';
        return;
    }

    // Populate form with player data
    document.getElementById('playerName').value = player.name || '';
    document.getElementById('age').value = player.age || '';
    document.getElementById('height').value = player.height || '';
    document.getElementById('weight').value = player.weight || '';
    document.getElementById('city').value = player.city || '';
    document.getElementById('nationality').value = player.nationality || '';
    document.getElementById('email').value = player.email || '';
    document.getElementById('phone').value = player.phone || '';
    document.getElementById('position').value = player.position || '';
    document.getElementById('preferredFoot').value = player.preferredFoot || '';
    document.getElementById('experience').value = player.experience || 0;
    document.getElementById('currentTeam').value = player.currentTeam || '';
    document.getElementById('matchesPlayed').value = player.matchesPlayed || 0;
    document.getElementById('goals').value = player.goals || 0;
    document.getElementById('assists').value = player.assists || 0;
    document.getElementById('yellowCards').value = player.yellowCards || 0;
    document.getElementById('redCards').value = player.redCards || 0;
    document.getElementById('rating').value = player.rating || '';
    document.getElementById('lookingForTeam').checked = player.lookingForTeam || false;
    document.getElementById('available').checked = player.available !== false; // Default to true
    document.getElementById('bio').value = player.bio || '';

    // Handle form submission
    const updatePlayerForm = document.getElementById('updatePlayerForm');
    
    if (updatePlayerForm) {
        updatePlayerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.UPDATE_PLAYER)) {
                    alert('Oyunçu yeniləmək üçün icazəniz yoxdur!');
                    return;
                }
            }
            
            // Get position text
            const positionSelect = document.getElementById('position');
            const positionText = positionSelect.options[positionSelect.selectedIndex].text;
            
            // Update player data
            const updatedData = {
                ...player,
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
                updatedBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                updatedAt: new Date().toISOString()
            };

            // Update avatar if name changed
            if (updatedData.name !== player.name) {
                updatedData.avatar = updatedData.name.charAt(0).toUpperCase();
            }

            console.log('Player Updated:', updatedData);
            
            // Update player in localStorage
            const playerIndex = players.findIndex(p => p.id == playerId);
            if (playerIndex !== -1) {
                players[playerIndex] = updatedData;
                localStorage.setItem('players', JSON.stringify(players));
                
                alert('Oyunçu uğurla yeniləndi!');
                window.location.href = 'player-detail.html?id=' + playerId;
            } else {
                alert('Xəta baş verdi!');
            }
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
