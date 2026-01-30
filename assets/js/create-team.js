// Create Team Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to create team
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.CREATE_TEAM, 'teams.html')) {
            return; // User will be redirected
        }
    }
    
    const createTeamForm = document.getElementById('createTeamForm');
    
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.CREATE_TEAM)) {
                    alert('Komanda yaratmaq üçün icazəniz yoxdur!');
                    return;
                }
            }
            
            const formData = {
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
                createdBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                createdAt: new Date().toISOString()
            };

            console.log('Team Created:', formData);
            
            // Store team in localStorage
            const teams = JSON.parse(localStorage.getItem('teams') || '[]');
            formData.id = Date.now();
            teams.push(formData);
            localStorage.setItem('teams', JSON.stringify(teams));
            
            alert('Komanda uğurla yaradıldı!');
            window.location.href = 'teams.html';
        });
    }
});
