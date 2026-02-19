// Player Team History Manager

class PlayerHistoryManager {
    // Get player's team history
    static getPlayerHistory(playerId) {
        const historyStr = localStorage.getItem('playerTeamHistory');
        if (!historyStr) return [];
        
        const allHistory = JSON.parse(historyStr);
        return allHistory.filter(h => h.playerId == playerId);
    }

    // Add team history for a player
    static addPlayerHistory(playerId, teamId, teamName, period, stats) {
        const allHistory = JSON.parse(localStorage.getItem('playerTeamHistory') || '[]');
        
        const history = {
            id: Date.now(),
            playerId: playerId,
            teamId: teamId,
            teamName: teamName,
            startDate: period.startDate,
            endDate: period.endDate,
            isCurrent: period.isCurrent || false,
            matchesPlayed: stats.matchesPlayed || 0,
            wins: stats.wins || 0,
            draws: stats.draws || 0,
            losses: stats.losses || 0,
            goals: stats.goals || 0,
            assists: stats.assists || 0,
            yellowCards: stats.yellowCards || 0,
            redCards: stats.redCards || 0,
            createdAt: new Date().toISOString()
        };

        allHistory.push(history);
        localStorage.setItem('playerTeamHistory', JSON.stringify(allHistory));
        return history;
    }

    // Calculate win percentage
    static getWinPercentage(wins, matchesPlayed) {
        if (matchesPlayed === 0) return 0;
        return Math.round((wins / matchesPlayed) * 100);
    }

    // Get performance color based on win percentage
    static getPerformanceColor(winPercentage) {
        if (winPercentage >= 70) return '#22C55E';
        if (winPercentage >= 50) return '#3b82f6';
        if (winPercentage >= 30) return '#f97316';
        return '#ef4444';
    }
}

// Display player history on the page
document.addEventListener('DOMContentLoaded', function() {
    // Only run on player-detail page
    if (!window.location.pathname.includes('player-detail')) {
        return;
    }

    // Get player ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id') || 1;

    loadPlayerHistory(playerId);
});

function loadPlayerHistory(playerId) {
    const container = document.getElementById('teamHistoryContainer');
    
    if (!container) return;

    const history = PlayerHistoryManager.getPlayerHistory(playerId);

    if (!history || history.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.6);">
                <p style="font-size: 1.1rem;">📋 Komanda tarixçəsi məlumatı yoxdur</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Bu oyunçunun keçmiş komanda məlumatları əlavə edilməyib</p>
            </div>
        `;
        return;
    }

    // Sort by date (current first, then by end date)
    history.sort((a, b) => {
        if (a.isCurrent) return -1;
        if (b.isCurrent) return 1;
        return new Date(b.endDate) - new Date(a.endDate);
    });

    let html = '';

    history.forEach((team, index) => {
        const winPercentage = PlayerHistoryManager.getWinPercentage(team.wins, team.matchesPlayed);
        const performanceColor = PlayerHistoryManager.getPerformanceColor(winPercentage);
        
        const startDate = new Date(team.startDate).toLocaleDateString('az-AZ', { 
            year: 'numeric', 
            month: 'short'
        });
        
        const endDate = team.isCurrent ? 'indiyə qədər' : new Date(team.endDate).toLocaleDateString('az-AZ', { 
            year: 'numeric', 
            month: 'short'
        });

        const borderColor = team.isCurrent ? '#22C55E' : 'rgba(255, 255, 255, 0.15)';
        const backgroundColor = team.isCurrent ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.05))' : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))';

        html += `
            <div style="
                border: 2px solid ${borderColor};
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin-bottom: 1rem;
                background: ${backgroundColor};
                transition: all 0.3s;
            " class="team-history-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div style="flex: 1;">
                        <h3 style="margin: 0 0 0.5rem 0; color: ${performanceColor}; display: flex; align-items: center; gap: 0.5rem;">
                            <a href="team-detail.html?id=${team.teamId}" style="color: inherit; text-decoration: none;">
                                ${team.teamName}
                            </a>
                            ${team.isCurrent ? '<span style="background: #22C55E; color: white; padding: 0.25rem 0.75rem; border-radius: 1rem; font-size: 0.75rem; font-weight: 600;">Hazırda</span>' : ''}
                        </h3>
                        <p style="color: rgba(255, 255, 255, 0.6); margin: 0; font-size: 0.9rem;">
                            📅 ${startDate} - ${endDate}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 1.5rem; font-weight: bold; color: ${performanceColor};">
                            ${winPercentage}%
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">Qələbə</div>
                    </div>
                </div>

                <!-- Match Statistics -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1rem;
                    border-radius: 0.5rem;
                    margin-bottom: 1rem;
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">
                            ${team.matchesPlayed}
                        </div>
                        <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">Oyun</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: bold; color: #22C55E;">
                            ${team.wins}
                        </div>
                        <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">Qələbə</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: bold; color: #3b82f6;">
                            ${team.draws}
                        </div>
                        <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">Bərabər</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.25rem; font-weight: bold; color: #ef4444;">
                            ${team.losses}
                        </div>
                        <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.6);">Məğlub</div>
                    </div>
                </div>

                <!-- Player Statistics -->
                <div style="
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem;
                    border-radius: 0.5rem;
                ">
                    <div style="text-align: center;">
                        <div style="font-size: 1.1rem; font-weight: bold; color: #22C55E;">
                            ⚽ ${team.goals}
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">Qol</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.1rem; font-weight: bold; color: #3b82f6;">
                            🎯 ${team.assists}
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">Asist</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.1rem; font-weight: bold; color: #fbbf24;">
                            🟨 ${team.yellowCards}
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">Sarı</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 1.1rem; font-weight: bold; color: #ef4444;">
                            🟥 ${team.redCards}
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">Qırmızı</div>
                    </div>
                </div>

                <!-- Match Results Detail -->
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <div style="display: flex; justify-content: space-around; font-size: 0.9rem;">
                        <div style="text-align: center;">
                            <span style="color: rgba(255, 255, 255, 0.6);">Qələbə Nisbəti:</span>
                            <strong style="color: ${performanceColor}; margin-left: 0.5rem;">
                                ${team.wins}/${team.matchesPlayed}
                            </strong>
                        </div>
                        <div style="text-align: center;">
                            <span style="color: rgba(255, 255, 255, 0.6);">Ortalama Qol:</span>
                            <strong style="color: #22C55E; margin-left: 0.5rem;">
                                ${team.matchesPlayed > 0 ? (team.goals / team.matchesPlayed).toFixed(2) : '0.00'}
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Add hover effect
    document.querySelectorAll('.team-history-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            this.style.transform = 'translateY(-2px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
        });
    });
}

// Export for use in other files
window.PlayerHistoryManager = PlayerHistoryManager;
