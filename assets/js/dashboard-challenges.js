// Dashboard Challenges Handler - Display and manage team challenges

document.addEventListener('DOMContentLoaded', function() {
    // Only run on captain dashboard
    if (!window.location.pathname.includes('captain-dashboard')) {
        return;
    }

    // Wait for auth to be ready
    setTimeout(function() {
        if (!window.AuthManager || !AuthManager.isLoggedIn()) {
            return;
        }

        const user = AuthManager.getCurrentUser();
        if (!user || user.role !== 'captain') {
            return;
        }

        loadChallenges(user);
    }, 500);
});

function loadChallenges(user) {
    // Get user's teams
    const userTeams = ChallengeManager.getUserTeams(user.id);
    
    if (userTeams.length === 0) {
        document.getElementById('matchInvitationsCard').style.display = 'none';
        return;
    }

    const teamIds = userTeams.map(t => t.id);
    
    // Get all pending invitations (received)
    let allPendingInvitations = [];
    teamIds.forEach(teamId => {
        const invitations = ChallengeManager.getPendingChallengesForTeam(teamId);
        allPendingInvitations = allPendingInvitations.concat(invitations);
    });

    // Get all sent invitations
    let allSentInvitations = [];
    teamIds.forEach(teamId => {
        const invitations = ChallengeManager.getSentChallengesByTeam(teamId);
        allSentInvitations = allSentInvitations.concat(invitations);
    });

    // Display pending invitations
    displayPendingInvitations(allPendingInvitations);
    
    // Display sent invitations
    displaySentInvitations(allSentInvitations);
}

function displayPendingInvitations(invitations) {
    const container = document.getElementById('pendingInvitations');
    
    if (!invitations || invitations.length === 0) {
        container.innerHTML = '<p style="color: #666; font-style: italic;">Gələn dəvət yoxdur</p>';
        return;
    }

    let html = '<h3 style="margin-bottom: 1rem; color: #22C55E;">📩 Gələn Dəvətlər (' + invitations.length + ')</h3>';
    
    invitations.forEach(inv => {
        const matchDateTime = new Date(inv.matchDate + 'T' + inv.matchTime);
        const dateStr = matchDateTime.toLocaleDateString('az-AZ', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
        const timeStr = inv.matchTime;

        html += `
            <div style="
                border: 2px solid #22C55E;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin-bottom: 1rem;
                background: #f0fdf4;
            ">
                <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 0.5rem; color: #15803d;">
                            ⚽ ${inv.challengerTeamName}
                        </h4>
                        <p style="color: #666; font-size: 0.9rem;">
                            <strong>${inv.challengedTeamName}</strong> komandasına dəvət göndərib
                        </p>
                    </div>
                </div>

                <div style="background: white; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; font-size: 0.95rem;">
                        <span style="font-weight: 600;">📅 Tarix:</span>
                        <span>${dateStr}</span>
                        
                        <span style="font-weight: 600;">⏰ Vaxt:</span>
                        <span>${timeStr}</span>
                        
                        <span style="font-weight: 600;">📍 Yer:</span>
                        <span>${inv.location}</span>
                        
                        ${inv.note ? `
                            <span style="font-weight: 600;">💬 Qeyd:</span>
                            <span style="color: #666;">${inv.note}</span>
                        ` : ''}
                    </div>
                </div>

                <div style="display: flex; gap: 0.75rem;">
                    <button onclick="acceptChallenge(${inv.id})" style="
                        flex: 1;
                        padding: 0.75rem;
                        border: none;
                        background: #22C55E;
                        color: white;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 1rem;
                        font-weight: 600;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#16a34a'" onmouseout="this.style.background='#22C55E'">
                        ✅ Qəbul et
                    </button>
                    <button onclick="rejectChallenge(${inv.id})" style="
                        flex: 1;
                        padding: 0.75rem;
                        border: 2px solid #ef4444;
                        background: white;
                        color: #ef4444;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 1rem;
                        font-weight: 600;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
                        ❌ Rədd et
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function displaySentInvitations(invitations) {
    const container = document.getElementById('sentInvitations');
    
    if (!invitations || invitations.length === 0) {
        container.innerHTML = '<p style="color: #666; font-style: italic; margin-top: 1rem;">Göndərilmiş dəvət yoxdur</p>';
        return;
    }

    let html = '<h3 style="margin-bottom: 1rem; margin-top: 1.5rem; color: #3b82f6;">📤 Göndərilmiş Dəvətlər (' + invitations.length + ')</h3>';
    
    invitations.forEach(inv => {
        const matchDateTime = new Date(inv.matchDate + 'T' + inv.matchTime);
        const dateStr = matchDateTime.toLocaleDateString('az-AZ', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        });
        const timeStr = inv.matchTime;

        html += `
            <div style="
                border: 2px solid #3b82f6;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin-bottom: 1rem;
                background: #eff6ff;
            ">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h4 style="margin-bottom: 0.5rem; color: #1e40af;">
                            ⚽ ${inv.challengedTeamName}
                        </h4>
                        <p style="color: #666; font-size: 0.9rem;">
                            <strong>${inv.challengerTeamName}</strong> tərəfindən dəvət
                        </p>
                    </div>
                    <span style="
                        background: #fbbf24;
                        color: #78350f;
                        padding: 0.25rem 0.75rem;
                        border-radius: 1rem;
                        font-size: 0.85rem;
                        font-weight: 600;
                    ">Gözləyir</span>
                </div>

                <div style="background: white; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1rem;">
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 0.5rem 1rem; font-size: 0.95rem;">
                        <span style="font-weight: 600;">📅 Tarix:</span>
                        <span>${dateStr}</span>
                        
                        <span style="font-weight: 600;">⏰ Vaxt:</span>
                        <span>${timeStr}</span>
                        
                        <span style="font-weight: 600;">📍 Yer:</span>
                        <span>${inv.location}</span>
                        
                        ${inv.note ? `
                            <span style="font-weight: 600;">💬 Qeyd:</span>
                            <span style="color: #666;">${inv.note}</span>
                        ` : ''}
                    </div>
                </div>

                <button onclick="cancelChallenge(${inv.id})" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #dc2626;
                    background: white;
                    color: #dc2626;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    font-weight: 600;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#fef2f2'" onmouseout="this.style.background='white'">
                    🗑️ Dəvəti ləğv et
                </button>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Global functions for button handlers
window.acceptChallenge = function(challengeId) {
    if (confirm('Bu dəvəti qəbul etmək istədiyinizə əminsiniz?')) {
        ChallengeManager.acceptChallenge(challengeId);
        alert('✅ Dəvət qəbul edildi! Oyun təsdiqləndi.');
        location.reload();
    }
};

window.rejectChallenge = function(challengeId) {
    if (confirm('Bu dəvəti rədd etmək istədiyinizə əminsiniz?')) {
        ChallengeManager.rejectChallenge(challengeId);
        alert('❌ Dəvət rədd edildi.');
        location.reload();
    }
};

window.cancelChallenge = function(challengeId) {
    if (confirm('Bu dəvəti ləğv etmək istədiyinizə əminsiniz?')) {
        ChallengeManager.cancelChallenge(challengeId);
        alert('🗑️ Dəvət ləğv edildi.');
        location.reload();
    }
};
