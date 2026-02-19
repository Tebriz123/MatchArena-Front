// Player Notification System - Notify former team captains when player is looking for team

class NotificationManager {
    // Get all notifications
    static getAllNotifications() {
        const notificationsStr = localStorage.getItem('notifications');
        return notificationsStr ? JSON.parse(notificationsStr) : [];
    }

    // Create a notification
    static createNotification(notification) {
        const notifications = this.getAllNotifications();
        const newNotification = {
            id: Date.now(),
            ...notification,
            isRead: false,
            createdAt: new Date().toISOString()
        };
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        return newNotification;
    }

    // Get notifications for a specific user (captain)
    static getNotificationsForUser(userId) {
        const notifications = this.getAllNotifications();
        return notifications.filter(n => n.recipientId == userId);
    }

    // Get unread notifications count
    static getUnreadCount(userId) {
        const notifications = this.getNotificationsForUser(userId);
        return notifications.filter(n => !n.isRead).length;
    }

    // Mark notification as read
    static markAsRead(notificationId) {
        const notifications = this.getAllNotifications();
        const notification = notifications.find(n => n.id == notificationId);
        if (notification) {
            notification.isRead = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
        }
    }

    // Mark all notifications as read for a user
    static markAllAsRead(userId) {
        const notifications = this.getAllNotifications();
        notifications.forEach(n => {
            if (n.recipientId == userId) {
                n.isRead = true;
            }
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    // Notify former team captains when player is looking for team
    static notifyFormerCaptains(playerId, playerName) {
        // Get player's team history
        if (!window.PlayerHistoryManager) return;
        
        const history = PlayerHistoryManager.getPlayerHistory(playerId);
        
        // Get unique captain IDs from former teams
        const teams = JSON.parse(localStorage.getItem('teams') || '[]');
        const captainIds = new Set();
        
        history.forEach(h => {
            const team = teams.find(t => t.id == h.teamId);
            if (team && team.captainId) {
                captainIds.add(team.captainId);
            }
        });

        // Create notifications for each captain
        const notifications = [];
        captainIds.forEach(captainId => {
            const notification = this.createNotification({
                type: 'player_looking_for_team',
                recipientId: captainId,
                playerId: playerId,
                playerName: playerName,
                title: '🔍 Keçmiş oyunçu komanda axtarır',
                message: `${playerName} komandanızda oynamış və hazırda yeni komanda axtarır.`
            });
            notifications.push(notification);
        });

        return notifications;
    }

    // Update player's lookingForTeam status
    static updatePlayerStatus(playerId, lookingForTeam) {
        const players = JSON.parse(localStorage.getItem('players') || '[]');
        const player = players.find(p => p.id == playerId);
        
        if (player) {
            player.lookingForTeam = lookingForTeam;
            localStorage.setItem('players', JSON.stringify(players));

            // If player is now looking for team, notify former captains
            if (lookingForTeam) {
                return this.notifyFormerCaptains(playerId, player.name);
            }
        }
        
        return [];
    }
}

// Player Detail Page Handler
document.addEventListener('DOMContentLoaded', function() {
    // Only run on player-detail page
    if (!window.location.pathname.includes('player-detail')) {
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const playerId = urlParams.get('id') || 1;
    
    // Load player status
    loadPlayerStatus(playerId);

    // Toggle button handler
    const toggleBtn = document.getElementById('toggleLookingForTeamBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            toggleLookingForTeam(playerId);
        });
    }
});

function loadPlayerStatus(playerId) {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const player = players.find(p => p.id == playerId);
    
    if (player && player.lookingForTeam) {
        document.getElementById('lookingForTeamBadge').style.display = 'block';
    }
}

function toggleLookingForTeam(playerId) {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const player = players.find(p => p.id == playerId);
    
    if (!player) {
        alert('Oyunçu tapılmadı!');
        return;
    }

    const currentStatus = player.lookingForTeam || false;
    const newStatus = !currentStatus;

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

    const statusText = newStatus ? 'aktiv' : 'deaktiv';
    const statusIcon = newStatus ? '🔍' : '❌';

    content.innerHTML = `
        <h2 style="margin-bottom: 1rem;">${statusIcon} Komanda Axtarma Statusu</h2>
        <p style="color: #666; margin-bottom: 1.5rem;">
            ${newStatus 
                ? 'Komanda axtarma statusunuzu aktiv etmək istəyirsiniz? <br><br><strong>Əvvəl oynadığınız komandaların kapitanlarına bildiriş göndəriləcək.</strong>' 
                : 'Komanda axtarma statusunuzu deaktiv etmək istəyirsiniz?'
            }
        </p>
        <div style="display: flex; gap: 0.75rem;">
            <button id="confirmStatusChange" style="
                flex: 1;
                padding: 0.75rem;
                border: none;
                background: ${newStatus ? '#22C55E' : '#ef4444'};
                color: white;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
                font-weight: 600;
            ">${newStatus ? '✅ Aktiv et' : '❌ Deaktiv et'}</button>
            <button id="cancelStatusChange" style="
                flex: 1;
                padding: 0.75rem;
                border: none;
                background: #e5e7eb;
                border-radius: 0.5rem;
                cursor: pointer;
                font-size: 1rem;
            ">Ləğv et</button>
        </div>
    `;

    dialog.appendChild(content);
    document.body.appendChild(dialog);

    document.getElementById('confirmStatusChange').addEventListener('click', function() {
        const notifications = NotificationManager.updatePlayerStatus(playerId, newStatus);
        
        document.body.removeChild(dialog);
        
        // Update badge visibility
        const badge = document.getElementById('lookingForTeamBadge');
        if (newStatus) {
            badge.style.display = 'block';
            alert(`✅ Status aktiv edildi!\n\n${notifications.length} kapitana bildiriş göndərildi.`);
        } else {
            badge.style.display = 'none';
            alert('❌ Komanda axtarma statusu deaktiv edildi.');
        }
    });

    document.getElementById('cancelStatusChange').addEventListener('click', function() {
        document.body.removeChild(dialog);
    });
}

// Export for use in other files
window.NotificationManager = NotificationManager;
