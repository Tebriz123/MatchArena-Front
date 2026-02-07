// Update Tournament Form Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check permission to update tournament
    if (window.AuthManager && window.PERMISSIONS) {
        if (!AuthManager.requirePermission(PERMISSIONS.UPDATE_TOURNAMENT, 'tournaments.html')) {
            return; // User will be redirected
        }
    }

    // Get tournament ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    if (!tournamentId) {
        alert('Turnir ID-si tapılmadı!');
        window.location.href = 'tournaments.html';
        return;
    }

    // Load tournament data
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const tournament = tournaments.find(t => t.id == tournamentId);

    if (!tournament) {
        alert('Turnir tapılmadı!');
        window.location.href = 'tournaments.html';
        return;
    }

    // Populate form with tournament data
    document.getElementById('tournamentName').value = tournament.name || '';
    document.getElementById('location').value = tournament.location || '';
    document.getElementById('organizer').value = tournament.organizer || '';
    document.getElementById('tournamentIcon').value = tournament.icon || '';
    
    // Format dates for input fields (convert from ISO to YYYY-MM-DD)
    if (tournament.startDate) {
        document.getElementById('startDate').value = tournament.startDate.split('T')[0];
    }
    if (tournament.endDate) {
        document.getElementById('endDate').value = tournament.endDate.split('T')[0];
    }
    if (tournament.registrationDeadline) {
        document.getElementById('registrationDeadline').value = tournament.registrationDeadline.split('T')[0];
    }
    
    document.getElementById('currentTeams').value = tournament.currentTeams || 0;
    document.getElementById('maxTeams').value = tournament.maxTeams || 16;
    document.getElementById('format').value = tournament.format || '';
    document.getElementById('teamSize').value = tournament.teamSize || '';
    document.getElementById('entryFee').value = tournament.entryFee || 0;
    document.getElementById('prizeMoney').value = tournament.prizeMoney || 0;
    document.getElementById('status').value = tournament.status || 'upcoming';
    document.getElementById('acceptingRegistrations').checked = tournament.acceptingRegistrations !== false;
    document.getElementById('rules').value = tournament.rules || '';
    document.getElementById('description').value = tournament.description || '';

    // Handle form submission
    const updateTournamentForm = document.getElementById('updateTournamentForm');
    
    if (updateTournamentForm) {
        updateTournamentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Double-check permission before submission
            if (window.AuthManager && window.PERMISSIONS) {
                if (!AuthManager.hasPermission(PERMISSIONS.UPDATE_TOURNAMENT)) {
                    alert('Turnir yeniləmək üçün icazəniz yoxdur!');
                    return;
                }
            }
            
            // Date validation
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            const regDeadline = new Date(document.getElementById('registrationDeadline').value);
            
            if (endDate < startDate) {
                alert('Bitmə tarixi başlama tarixindən əvvəl ola bilməz!');
                return;
            }
            
            if (regDeadline > startDate) {
                alert('Qeydiyyat son tarixi turnir başlama tarixindən sonra ola bilməz!');
                return;
            }
            
            // Get format text
            const formatSelect = document.getElementById('format');
            const formatText = formatSelect.options[formatSelect.selectedIndex].text;
            
            // Update tournament data
            const updatedData = {
                ...tournament,
                name: document.getElementById('tournamentName').value,
                location: document.getElementById('location').value,
                organizer: document.getElementById('organizer').value,
                icon: document.getElementById('tournamentIcon').value || '🏆',
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                registrationDeadline: document.getElementById('registrationDeadline').value,
                currentTeams: parseInt(document.getElementById('currentTeams').value),
                maxTeams: parseInt(document.getElementById('maxTeams').value),
                format: document.getElementById('format').value,
                formatText: formatText,
                teamSize: parseInt(document.getElementById('teamSize').value),
                entryFee: parseFloat(document.getElementById('entryFee').value) || 0,
                prizeMoney: parseFloat(document.getElementById('prizeMoney').value) || 0,
                status: document.getElementById('status').value,
                acceptingRegistrations: document.getElementById('acceptingRegistrations').checked,
                rules: document.getElementById('rules').value || '',
                description: document.getElementById('description').value || '',
                updatedBy: window.AuthManager ? AuthManager.getCurrentUser().id : null,
                updatedAt: new Date().toISOString()
            };

            console.log('Tournament Updated:', updatedData);
            
            // Update tournament in localStorage
            const tournamentIndex = tournaments.findIndex(t => t.id == tournamentId);
            if (tournamentIndex !== -1) {
                tournaments[tournamentIndex] = updatedData;
                localStorage.setItem('tournaments', JSON.stringify(tournaments));
                
                alert('Turnir uğurla yeniləndi!');
                window.location.href = 'tournament-detail.html?id=' + tournamentId;
            } else {
                alert('Xəta baş verdi!');
            }
        });
        
        // Form validation
        const currentTeamsInput = document.getElementById('currentTeams');
        const maxTeamsInput = document.getElementById('maxTeams');
        
        function validateTeams() {
            const current = parseInt(currentTeamsInput.value) || 0;
            const max = parseInt(maxTeamsInput.value) || 0;
            
            if (current > max) {
                currentTeamsInput.setCustomValidity('Cari komanda sayı maksimumdan çox ola bilməz');
            } else {
                currentTeamsInput.setCustomValidity('');
            }
        }
        
        currentTeamsInput.addEventListener('input', validateTeams);
        maxTeamsInput.addEventListener('input', validateTeams);
        
        // Entry fee and prize money validation
        const entryFeeInput = document.getElementById('entryFee');
        const prizeMoneyInput = document.getElementById('prizeMoney');
        
        entryFeeInput.addEventListener('input', function() {
            if (this.value < 0) {
                this.setCustomValidity('Qeydiyyat haqqı mənfi ola bilməz');
            } else {
                this.setCustomValidity('');
            }
        });
        
        prizeMoneyInput.addEventListener('input', function() {
            if (this.value < 0) {
                this.setCustomValidity('Mükafat fondu mənfi ola bilməz');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});
