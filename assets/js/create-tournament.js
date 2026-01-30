// Create Tournament Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to create tournament - Only Admins and Organizers
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.CREATE_TOURNAMENT, 'tournaments.html')) {
            return; // User will be redirected
        }
    }
    
    const createTournamentForm = document.getElementById('createTournamentForm');
    
    if (createTournamentForm) {
        createTournamentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.CREATE_TOURNAMENT)) {
                    alert('Turnir yaratmaq üçün icazəniz yoxdur! Yalnız administratorlar və təşkilatçılar turnir yarada bilər.');
                    return;
                }
            }
            
            const formData = {
                name: document.getElementById('tournamentName').value,
                location: document.getElementById('location').value,
                organizer: document.getElementById('organizer').value,
                icon: document.getElementById('tournamentIcon').value || '🏆',
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                registrationDeadline: document.getElementById('registrationDeadline').value,
                currentTeams: parseInt(document.getElementById('currentTeams').value),
                maxTeams: parseInt(document.getElementById('maxTeams').value),
                entryFee: parseFloat(document.getElementById('entryFee').value) || 0,
                prizePool: parseFloat(document.getElementById('prizePool').value) || 0,
                format: document.getElementById('format').value,
                matchDuration: document.getElementById('matchDuration').value,
                status: document.getElementById('status').value,
                description: document.getElementById('description').value,
                rules: document.getElementById('rules').value,
                createdBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                createdAt: new Date().toISOString()
            };

            console.log('Tournament Created:', formData);
            
            // Store tournament in localStorage
            const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
            formData.id = Date.now();
            tournaments.push(formData);
            localStorage.setItem('tournaments', JSON.stringify(tournaments));
            
            alert('Turnir uğurla yaradıldı!');
            window.location.href = 'tournaments.html';
        });
    }
});
