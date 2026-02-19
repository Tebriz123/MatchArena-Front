// Dashboard Notifications Handler - Display player notifications for captains

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

        loadPlayerNotifications(user);
    }, 500);
});

function loadPlayerNotifications(user) {
    const container = document.getElementById('playerNotifications');
    
    if (!container || !window.NotificationManager) return;

    // Get notifications for this captain
    const notifications = NotificationManager.getNotificationsForUser(user.id);
    
    // Filter only player looking for team notifications
    const playerNotifications = notifications.filter(n => n.type === 'player_looking_for_team');

    if (!playerNotifications || playerNotifications.length === 0) {
        container.innerHTML = '<p style="color: #666; font-style: italic;">Bildiriş yoxdur</p>';
        return;
    }

    // Sort by date (newest first)
    playerNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    let html = '';

    playerNotifications.forEach(notif => {
        const createdDate = new Date(notif.createdAt);
        const dateStr = createdDate.toLocaleDateString('az-AZ', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const bgColor = notif.isRead ? '#f9fafb' : '#f0fdf4';
        const borderColor = notif.isRead ? '#e5e7eb' : '#22C55E';

        html += `
            <div style="
                border: 2px solid ${borderColor};
                border-radius: 0.75rem;
                padding: 1.25rem;
                margin-bottom: 1rem;
                background: ${bgColor};
                transition: all 0.3s;
            " class="notification-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.25rem 0; color: #22C55E; display: flex; align-items: center; gap: 0.5rem;">
                            🔍 ${notif.playerName}
                            ${!notif.isRead ? '<span style="background: #22C55E; color: white; padding: 0.2rem 0.5rem; border-radius: 0.5rem; font-size: 0.7rem;">YENİ</span>' : ''}
                        </h4>
                        <p style="color: #666; margin: 0; font-size: 0.9rem;">
                            Keçmiş oyunçunuz yeni komanda axtarır
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span style="color: #999; font-size: 0.8rem;">${dateStr}</span>
                    </div>
                </div>

                <p style="color: #333; margin-bottom: 1rem; padding: 0.75rem; background: white; border-radius: 0.5rem;">
                    ${notif.message}
                </p>

                <div style="display: flex; gap: 0.75rem;">
                    <a href="player-detail.html?id=${notif.playerId}" style="
                        flex: 1;
                        padding: 0.75rem;
                        border: none;
                        background: #22C55E;
                        color: white;
                        border-radius: 0.5rem;
                        cursor: pointer;
                        font-size: 0.95rem;
                        font-weight: 600;
                        text-decoration: none;
                        text-align: center;
                        transition: all 0.3s;
                    " onmouseover="this.style.background='#16a34a'" onmouseout="this.style.background='#22C55E'">
                        👤 Profili Gör
                    </a>
                    ${!notif.isRead ? `
                        <button onclick="markNotificationAsRead(${notif.id})" style="
                            flex: 1;
                            padding: 0.75rem;
                            border: 2px solid #3b82f6;
                            background: white;
                            color: #3b82f6;
                            border-radius: 0.5rem;
                            cursor: pointer;
                            font-size: 0.95rem;
                            font-weight: 600;
                            transition: all 0.3s;
                        " onmouseover="this.style.background='#eff6ff'" onmouseout="this.style.background='white'">
                            ✓ Oxundu işarələ
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    });

    // Add "Mark All as Read" button if there are unread notifications
    const unreadCount = playerNotifications.filter(n => !n.isRead).length;
    if (unreadCount > 0) {
        html = `
            <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #666;">
                    <strong>${unreadCount}</strong> oxunmamış bildiriş
                </span>
                <button onclick="markAllNotificationsAsRead(${user.id})" style="
                    padding: 0.5rem 1rem;
                    border: 2px solid #22C55E;
                    background: white;
                    color: #22C55E;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 600;
                    transition: all 0.3s;
                " onmouseover="this.style.background='#f0fdf4'" onmouseout="this.style.background='white'">
                    ✓ Hamısını oxundu işarələ
                </button>
            </div>
        ` + html;
    }

    container.innerHTML = html;
}

// Global functions for button handlers
window.markNotificationAsRead = function(notificationId) {
    NotificationManager.markAsRead(notificationId);
    location.reload();
};

window.markAllNotificationsAsRead = function(userId) {
    if (confirm('Bütün bildirişləri oxundu işarələmək istədiyinizə əminsiniz?')) {
        NotificationManager.markAllAsRead(userId);
        location.reload();
    }
};
