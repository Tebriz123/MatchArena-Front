// Players Page Handler
document.addEventListener('DOMContentLoaded', function() {
    const createPlayerBtn = document.getElementById('createPlayerProfileBtn');
    
    if (createPlayerBtn) {
        const user = AuthManager.getCurrentUser();
        
        // Hide button if user has a player profile
        if (user && user.hasPlayerProfile) {
            createPlayerBtn.style.display = 'none';
        } else {
            // Show button and add click handler
            createPlayerBtn.addEventListener('click', function() {
                // Check if user is logged in
                if (AuthManager.isLoggedIn()) {
                    // Redirect to create-player page
                    window.location.href = 'create-player.html';
                } else {
                    // Redirect to register page
                    window.location.href = 'register.html';
                }
            });
        }
    }
});
