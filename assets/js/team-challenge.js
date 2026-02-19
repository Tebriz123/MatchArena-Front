// Team Challenge System - Match Invitations between teams

// Challenge Manager
class ChallengeManager {
    // Save a challenge to localStorage
    static saveChallenge(challenge) {
        const challenges = this.getAllChallenges();
        challenge.id = Date.now();
        challenge.createdAt = new Date().toISOString();
        challenge.status = 'pending'; // pending, accepted, rejected, cancelled
        challenges.push(challenge);
        localStorage.setItem('teamChallenges', JSON.stringify(challenges));
        return challenge;
    }

    // Get all challenges
    static getAllChallenges() {
        const challengesStr = localStorage.getItem('teamChallenges');
        return challengesStr ? JSON.parse(challengesStr) : [];
    }

    // Get challenges for a specific team
    static getChallengesForTeam(teamId) {
        const challenges = this.getAllChallenges();
        return challenges.filter(c => 
            c.challengerTeamId == teamId || c.challengedTeamId == teamId
        );
    }

    // Get pending challenges (received by team)
    static getPendingChallengesForTeam(teamId) {
        const challenges = this.getAllChallenges();
        return challenges.filter(c => 
            c.challengedTeamId == teamId && c.status === 'pending'
        );
    }

    // Get sent challenges (sent by team)
    static getSentChallengesByTeam(teamId) {
        const challenges = this.getAllChallenges();
        return challenges.filter(c => 
            c.challengerTeamId == teamId && c.status === 'pending'
        );
    }

    // Accept a challenge
    static acceptChallenge(challengeId) {
        const challenges = this.getAllChallenges();
        const challenge = challenges.find(c => c.id == challengeId);
        if (challenge) {
            challenge.status = 'accepted';
            challenge.acceptedAt = new Date().toISOString();
            localStorage.setItem('teamChallenges', JSON.stringify(challenges));
            return true;
        }
        return false;
    }

    // Reject a challenge
    static rejectChallenge(challengeId) {
        const challenges = this.getAllChallenges();
        const challenge = challenges.find(c => c.id == challengeId);
        if (challenge) {
            challenge.status = 'rejected';
            challenge.rejectedAt = new Date().toISOString();
            localStorage.setItem('teamChallenges', JSON.stringify(challenges));
            return true;
        }
        return false;
    }

    // Cancel a challenge (by the sender)
    static cancelChallenge(challengeId) {
        const challenges = this.getAllChallenges();
        const challenge = challenges.find(c => c.id == challengeId);
        if (challenge) {
            challenge.status = 'cancelled';
            challenge.cancelledAt = new Date().toISOString();
            localStorage.setItem('teamChallenges', JSON.stringify(challenges));
            return true;
        }
        return false;
    }

    // Get user's teams (where user is captain)
    static getUserTeams(userId) {
        const teamsStr = localStorage.getItem('teams');
        if (!teamsStr) return [];
        
        const teams = JSON.parse(teamsStr);
        return teams.filter(t => t.createdBy == userId || t.captainId == userId);
    }
}

// Team Detail Page Handler
document.addEventListener('DOMContentLoaded', function() {
    const challengeBtn = document.getElementById('challengeTeamBtn');
    
    if (challengeBtn) {
        challengeBtn.addEventListener('click', function() {
            // Check if user is logged in
            if (!AuthManager.isLoggedIn()) {
                alert('Dəvət göndərmək üçün daxil olmalısınız!');
                window.location.href = 'login.html';
                return;
            }

            const user = AuthManager.getCurrentUser();
            
            // Get user's teams
            const userTeams = ChallengeManager.getUserTeams(user.id);
            
            if (userTeams.length === 0) {
                if (confirm('Dəvət göndərmək üçün komanda yaratmalısınız. Komanda yaratmaq istəyirsiniz?')) {
                    window.location.href = 'create-team.html';
                }
                return;
            }

            // Get challenged team ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const challengedTeamId = urlParams.get('id') || 1;
            
            // Get challenged team info
            const challengedTeamName = document.querySelector('h1') ? document.querySelector('h1').textContent : 'Bu komanda';

            // If user has only one team, use it directly
            if (userTeams.length === 1) {
                showChallengeDialog(userTeams[0], challengedTeamId, challengedTeamName);
            } else {
                // Show team selection dialog
                showTeamSelectionDialog(userTeams, challengedTeamId, challengedTeamName);
            }
        });
    }
});

// Show team selection dialog
function showTeamSelectionDialog(userTeams, challengedTeamId, challengedTeamName) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
    `;

    let html = `
        <h2 style="margin-bottom: 1rem;">Komandanızı seçin</h2>
        <p style="color: #666; margin-bottom: 1.5rem;">Hansı komanda ilə dəvət göndərmək istəyirsiniz?</p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
    `;

    userTeams.forEach(team => {
        html += `
            <button class="team-select-btn" data-team-id="${team.id}" style="
                padding: 1rem;
                border: 2px solid #22C55E;
                border-radius: 0.5rem;
                background: white;
                cursor: pointer;
                text-align: left;
                transition: all 0.3s;
                font-size: 1rem;
            ">
                <strong>${team.name}</strong>
                <div style="color: #666; font-size: 0.9rem; margin-top: 0.25rem;">
                    ${team.city || 'Şəhər yoxdur'} • ${team.members || 0} oyunçu
                </div>
            </button>
        `;
    });

    html += `
        </div>
        <button id="cancelTeamSelect" style="
            margin-top: 1rem;
            width: 100%;
            padding: 0.75rem;
            border: none;
            background: #e5e7eb;
            border-radius: 0.5rem;
            cursor: pointer;
            font-size: 1rem;
        ">Ləğv et</button>
    `;

    content.innerHTML = html;
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // Add event listeners
    content.querySelectorAll('.team-select-btn').forEach(btn => {
        btn.addEventListener('mouseover', function() {
            this.style.background = '#f0fdf4';
        });
        btn.addEventListener('mouseout', function() {
            this.style.background = 'white';
        });
        btn.addEventListener('click', function() {
            const teamId = this.getAttribute('data-team-id');
            const team = userTeams.find(t => t.id == teamId);
            document.body.removeChild(dialog);
            showChallengeDialog(team, challengedTeamId, challengedTeamName);
        });
    });

    document.getElementById('cancelTeamSelect').addEventListener('click', function() {
        document.body.removeChild(dialog);
    });
}

// Show challenge dialog with date and location selection
function showChallengeDialog(challengerTeam, challengedTeamId, challengedTeamName) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        overflow-y: auto;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        margin: 2rem;
    `;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    const minDateStr = minDate.toISOString().split('T')[0];

    content.innerHTML = `
        <h2 style="margin-bottom: 1rem;">⚽ Oyun Dəvəti</h2>
        <p style="color: #666; margin-bottom: 1.5rem;">
            <strong>${challengerTeam.name}</strong> → <strong>${challengedTeamName}</strong>
        </p>

        <form id="challengeForm">
            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Oyun tarixi</label>
                <input type="date" id="matchDate" required min="${minDateStr}" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                ">
            </div>

            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Oyun vaxtı</label>
                <input type="time" id="matchTime" required value="18:00" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                ">
            </div>

            <div style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Meydança</label>
                <input type="text" id="matchLocation" required placeholder="Meydança adı və ya ünvan" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                ">
            </div>

            <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Əlavə qeyd (ixtiyari)</label>
                <textarea id="matchNote" rows="3" placeholder="Oyun haqqında əlavə məlumat..." style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    font-size: 1rem;
                    resize: vertical;
                "></textarea>
            </div>

            <div style="display: flex; gap: 0.75rem;">
                <button type="submit" style="
                    flex: 1;
                    padding: 0.75rem;
                    border: none;
                    background: #22C55E;
                    color: white;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                ">Dəvət Göndər</button>
                <button type="button" id="cancelChallenge" style="
                    flex: 1;
                    padding: 0.75rem;
                    border: none;
                    background: #e5e7eb;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                ">Ləğv et</button>
            </div>
        </form>
    `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);

    // Handle form submission
    document.getElementById('challengeForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const challenge = {
            challengerTeamId: challengerTeam.id,
            challengerTeamName: challengerTeam.name,
            challengedTeamId: challengedTeamId,
            challengedTeamName: challengedTeamName,
            matchDate: document.getElementById('matchDate').value,
            matchTime: document.getElementById('matchTime').value,
            location: document.getElementById('matchLocation').value,
            note: document.getElementById('matchNote').value
        };

        ChallengeManager.saveChallenge(challenge);
        document.body.removeChild(dialog);
        
        alert('✅ Dəvət uğurla göndərildi!\n\n' + 
              'Komanda: ' + challengedTeamName + '\n' +
              'Tarix: ' + challenge.matchDate + ' ' + challenge.matchTime + '\n' +
              'Yer: ' + challenge.location);
    });

    document.getElementById('cancelChallenge').addEventListener('click', function() {
        document.body.removeChild(dialog);
    });
}

// Export for use in other files
window.ChallengeManager = ChallengeManager;
