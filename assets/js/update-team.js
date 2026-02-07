// Update Team Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to update team
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.UPDATE_TEAM, 'teams.html')) {
            return; // User will be redirected
        }
    }

    // Get team ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const teamId = urlParams.get('id');

    if (!teamId) {
        alert('Komanda ID-si tapılmadı!');
        window.location.href = 'teams.html';
        return;
    }

    // Load team data
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const team = teams.find(t => t.id == teamId);

    if (!team) {
        alert('Komanda tapılmadı!');
        window.location.href = 'teams.html';
        return;
    }

    // Populate form with team data
    document.getElementById('teamName').value = team.name || '';
    document.getElementById('captainName').value = team.captain || '';
    document.getElementById('city').value = team.city || '';
    document.getElementById('teamLogo').value = team.logo || '';
    document.getElementById('currentPlayers').value = team.currentPlayers || 0;
    document.getElementById('maxPlayers').value = team.maxPlayers || 15;
    document.getElementById('wins').value = team.wins || 0;
    document.getElementById('draws').value = team.draws || 0;
    document.getElementById('losses').value = team.losses || 0;
    document.getElementById('lookingForPlayers').checked = team.lookingForPlayers || false;
    document.getElementById('description').value = team.description || '';

    // Handle form submission
    const updateTeamForm = document.getElementById('updateTeamForm');
    
    if (updateTeamForm) {
        updateTeamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.UPDATE_TEAM)) {
                    alert('Komanda yeniləmək üçün icazəniz yoxdur!');
                    return;
                }
            }
            
            // Update team data
            const updatedData = {
                ...team,
                name: document.getElementById('teamName').value,
                captain: document.getElementById('captainName').value,
                city: document.getElementById('city').value,
                logo: document.getElementById('teamLogo').value || 'T',
                currentPlayers: parseInt(document.getElementById('currentPlayers').value),
                maxPlayers: parseInt(document.getElementById('maxPlayers').value),
                wins: parseInt(document.getElementById('wins').value) || 0,
                draws: parseInt(document.getElementById('draws').value) || 0,
                losses: parseInt(document.getElementById('losses').value) || 0,
                lookingForPlayers: document.getElementById('lookingForPlayers').checked,
                description: document.getElementById('description').value,
                updatedBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                updatedAt: new Date().toISOString()
            };

            console.log('Team Updated:', updatedData);
            
            // Update team in localStorage
            const teamIndex = teams.findIndex(t => t.id == teamId);
            if (teamIndex !== -1) {
                teams[teamIndex] = updatedData;
                localStorage.setItem('teams', JSON.stringify(teams));
                
                alert('Komanda uğurla yeniləndi!');
                window.location.href = 'team-detail.html?id=' + teamId;
            } else {
                alert('Xəta baş verdi!');
            }
        });
        
        // Form validation
        const currentPlayersInput = document.getElementById('currentPlayers');
        const maxPlayersInput = document.getElementById('maxPlayers');
        
        function validatePlayers() {
            const current = parseInt(currentPlayersInput.value) || 0;
            const max = parseInt(maxPlayersInput.value) || 0;
            
            if (current > max) {
                currentPlayersInput.setCustomValidity('Cari oyunçu sayı maksimumdan çox ola bilməz');
            } else {
                currentPlayersInput.setCustomValidity('');
            }
        }
        
        currentPlayersInput.addEventListener('input', validatePlayers);
        maxPlayersInput.addEventListener('input', validatePlayers);
    }
});
