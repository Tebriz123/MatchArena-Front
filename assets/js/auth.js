// Role-Based Access Control System
// MatchArena Platform Authentication & Authorization

// Role definitions with permissions
const ROLES = {
    ADMIN: 'admin',
    CAPTAIN: 'captain',
    FIELD_OWNER: 'field-owner',
    ORGANIZER: 'organizer',
    PLAYER: 'player'
};

// Permission definitions
const PERMISSIONS = {
    // Tournament permissions
    CREATE_TOURNAMENT: 'create_tournament',
    EDIT_TOURNAMENT: 'edit_tournament',
    DELETE_TOURNAMENT: 'delete_tournament',
    MANAGE_TOURNAMENT: 'manage_tournament',
    
    // Team permissions
    CREATE_TEAM: 'create_team',
    EDIT_TEAM: 'edit_team',
    DELETE_TEAM: 'delete_team',
    MANAGE_TEAM_MEMBERS: 'manage_team_members',
    
    // Player permissions
    CREATE_PLAYER: 'create_player',
    EDIT_PLAYER: 'edit_player',
    DELETE_PLAYER: 'delete_player',
    
    // Field permissions
    CREATE_FIELD: 'create_field',
    EDIT_FIELD: 'edit_field',
    DELETE_FIELD: 'delete_field',
    MANAGE_BOOKINGS: 'manage_bookings',
    
    // Admin permissions
    ACCESS_ADMIN_PANEL: 'access_admin_panel',
    MANAGE_USERS: 'manage_users',
    MANAGE_REVIEWS: 'manage_reviews',
    VIEW_REPORTS: 'view_reports',
    
    // General permissions
    VIEW_CONTENT: 'view_content',
    CREATE_REVIEW: 'create_review',
    EDIT_PROFILE: 'edit_profile'
};

// Role-Permission mapping
const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: [
        // Admin has all permissions
        PERMISSIONS.CREATE_TOURNAMENT,
        PERMISSIONS.EDIT_TOURNAMENT,
        PERMISSIONS.DELETE_TOURNAMENT,
        PERMISSIONS.MANAGE_TOURNAMENT,
        PERMISSIONS.CREATE_TEAM,
        PERMISSIONS.EDIT_TEAM,
        PERMISSIONS.DELETE_TEAM,
        PERMISSIONS.MANAGE_TEAM_MEMBERS,
        PERMISSIONS.CREATE_PLAYER,
        PERMISSIONS.EDIT_PLAYER,
        PERMISSIONS.DELETE_PLAYER,
        PERMISSIONS.CREATE_FIELD,
        PERMISSIONS.EDIT_FIELD,
        PERMISSIONS.DELETE_FIELD,
        PERMISSIONS.MANAGE_BOOKINGS,
        PERMISSIONS.ACCESS_ADMIN_PANEL,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.MANAGE_REVIEWS,
        PERMISSIONS.VIEW_REPORTS,
        PERMISSIONS.VIEW_CONTENT,
        PERMISSIONS.CREATE_REVIEW,
        PERMISSIONS.EDIT_PROFILE
    ],
    
    [ROLES.CAPTAIN]: [
        // Captain can manage teams and players
        PERMISSIONS.CREATE_TEAM,
        PERMISSIONS.EDIT_TEAM,
        PERMISSIONS.MANAGE_TEAM_MEMBERS,
        PERMISSIONS.CREATE_PLAYER,
        PERMISSIONS.EDIT_PLAYER,
        PERMISSIONS.VIEW_CONTENT,
        PERMISSIONS.CREATE_REVIEW,
        PERMISSIONS.EDIT_PROFILE
    ],
    
    [ROLES.FIELD_OWNER]: [
        // Field owner can manage fields
        PERMISSIONS.CREATE_FIELD,
        PERMISSIONS.EDIT_FIELD,
        PERMISSIONS.MANAGE_BOOKINGS,
        PERMISSIONS.VIEW_CONTENT,
        PERMISSIONS.CREATE_REVIEW,
        PERMISSIONS.EDIT_PROFILE
    ],
    
    [ROLES.ORGANIZER]: [
        // Organizer can manage tournaments
        PERMISSIONS.CREATE_TOURNAMENT,
        PERMISSIONS.EDIT_TOURNAMENT,
        PERMISSIONS.MANAGE_TOURNAMENT,
        PERMISSIONS.VIEW_CONTENT,
        PERMISSIONS.CREATE_REVIEW,
        PERMISSIONS.EDIT_PROFILE
    ],
    
    [ROLES.PLAYER]: [
        // Player has basic permissions
        PERMISSIONS.VIEW_CONTENT,
        PERMISSIONS.CREATE_REVIEW,
        PERMISSIONS.EDIT_PROFILE
    ]
};

// Dashboard URLs for each role
const ROLE_DASHBOARDS = {
    [ROLES.ADMIN]: 'admin-panel.html',
    [ROLES.CAPTAIN]: 'captain-dashboard.html',
    [ROLES.FIELD_OWNER]: 'field-owner-dashboard.html',
    [ROLES.ORGANIZER]: 'organizer-dashboard.html',
    [ROLES.PLAYER]: 'player-dashboard.html'
};

// Auth utility class
class AuthManager {
    // Get current user from localStorage
    static getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    // Check if user is logged in
    static isLoggedIn() {
        return this.getCurrentUser() !== null;
    }
    
    // Get user role
    static getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }
    
    // Check if user has a specific permission
    static hasPermission(permission) {
        const role = this.getUserRole();
        if (!role) return false;
        
        const permissions = ROLE_PERMISSIONS[role] || [];
        return permissions.includes(permission);
    }
    
    // Check if user has any of the specified permissions
    static hasAnyPermission(permissionArray) {
        return permissionArray.some(permission => this.hasPermission(permission));
    }
    
    // Check if user has all specified permissions
    static hasAllPermissions(permissionArray) {
        return permissionArray.every(permission => this.hasPermission(permission));
    }
    
    // Get dashboard URL for current user
    static getDashboardUrl() {
        const role = this.getUserRole();
        return ROLE_DASHBOARDS[role] || 'index.html';
    }
    
    // Require login - redirect to login if not authenticated
    static requireLogin(redirectUrl = null) {
        if (!this.isLoggedIn()) {
            const currentUrl = redirectUrl || window.location.href;
            localStorage.setItem('redirectAfterLogin', currentUrl);
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
    
    // Require specific permission - redirect if not authorized
    static requirePermission(permission, redirectUrl = 'index.html') {
        if (!this.isLoggedIn()) {
            this.requireLogin();
            return false;
        }
        
        if (!this.hasPermission(permission)) {
            alert('Bu səhifəyə giriş icazəniz yoxdur!');
            window.location.href = redirectUrl;
            return false;
        }
        
        return true;
    }
    
    // Require specific role
    static requireRole(role, redirectUrl = 'index.html') {
        if (!this.isLoggedIn()) {
            this.requireLogin();
            return false;
        }
        
        if (this.getUserRole() !== role) {
            alert('Bu səhifəyə giriş icazəniz yoxdur!');
            window.location.href = redirectUrl;
            return false;
        }
        
        return true;
    }
    
    // Logout user
    static logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = 'index.html';
    }
    
    // Login user
    static login(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Check for redirect URL
        const redirectUrl = localStorage.getItem('redirectAfterLogin');
        if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectUrl;
        } else {
            // Redirect to role-specific dashboard
            window.location.href = this.getDashboardUrl();
        }
    }
    
    // Update navigation based on user role
    static updateNavigation() {
        const user = this.getCurrentUser();
        const userNameElement = document.querySelector('.user-name');
        const loginBtn = document.querySelector('.login-btn');
        
        if (user && userNameElement) {
            userNameElement.textContent = user.name;
            userNameElement.style.cursor = 'pointer';
            userNameElement.onclick = () => {
                window.location.href = this.getDashboardUrl();
            };
        }
        
        if (user && loginBtn) {
            loginBtn.textContent = 'Çıxış';
            loginBtn.onclick = (e) => {
                e.preventDefault();
                if (confirm('Çıxış etmək istədiyinizə əminsiniz?')) {
                    this.logout();
                }
            };
        }
        
        // Show/hide create buttons based on permissions
        this.updateCreateButtons();
    }
    
    // Update visibility of create buttons based on permissions
    static updateCreateButtons() {
        // Hide create team button if no permission
        const createTeamBtns = document.querySelectorAll('[href="create-team.html"]');
        if (!this.hasPermission(PERMISSIONS.CREATE_TEAM)) {
            createTeamBtns.forEach(btn => {
                btn.style.display = 'none';
            });
        }
        
        // Hide create tournament button if no permission
        const createTournamentBtns = document.querySelectorAll('[href="create-tournament.html"]');
        if (!this.hasPermission(PERMISSIONS.CREATE_TOURNAMENT)) {
            createTournamentBtns.forEach(btn => {
                btn.style.display = 'none';
            });
        }
        
        // Hide create field button if no permission
        const createFieldBtns = document.querySelectorAll('[href="create-field.html"]');
        if (!this.hasPermission(PERMISSIONS.CREATE_FIELD)) {
            createFieldBtns.forEach(btn => {
                btn.style.display = 'none';
            });
        }
        
        // Hide admin panel link if no permission
        const adminPanelBtns = document.querySelectorAll('[href="admin-panel.html"]');
        if (!this.hasPermission(PERMISSIONS.ACCESS_ADMIN_PANEL)) {
            adminPanelBtns.forEach(btn => {
                btn.style.display = 'none';
            });
        }
    }
    
    // Get role display name in Azerbaijani
    static getRoleDisplayName(role) {
        const roleNames = {
            [ROLES.ADMIN]: 'Administrator',
            [ROLES.CAPTAIN]: 'Komanda Kapitanı',
            [ROLES.FIELD_OWNER]: 'Meydança Sahibi',
            [ROLES.ORGANIZER]: 'Turnir Təşkilatçısı',
            [ROLES.PLAYER]: 'Oyunçu'
        };
        return roleNames[role] || 'İstifadəçi';
    }
    
    // Get role description
    static getRoleDescription(role) {
        const descriptions = {
            [ROLES.ADMIN]: 'Platformanın bütün funksiyalarına giriş',
            [ROLES.CAPTAIN]: 'Komanda yaratma və idarə etmə',
            [ROLES.FIELD_OWNER]: 'Meydança yaratma və idarə etmə',
            [ROLES.ORGANIZER]: 'Turnir yaratma və təşkil etmə',
            [ROLES.PLAYER]: 'Oyunçu kimi platforma iştirak'
        };
        return descriptions[role] || 'Əsas istifadəçi funksiyaları';
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    AuthManager.updateNavigation();
});

// Export for use in other files
window.AuthManager = AuthManager;
window.ROLES = ROLES;
window.PERMISSIONS = PERMISSIONS;
