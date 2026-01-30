// Login Page Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            console.log('Login attempt:', { email, remember });

            // Simulate login - create user with player role by default
            const user = {
                id: Date.now(),
                email: email,
                name: email.split('@')[0],
                role: 'player', // Default role
                isActive: true,
                createdAt: new Date().toISOString()
            };

            // Use AuthManager to handle login
            if (window.AuthManager) {
                AuthManager.login(user);
            } else {
                localStorage.setItem('user', JSON.stringify(user));
                alert('Uğurla daxil oldunuz!');
                window.location.href = 'index.html';
            }
        });
    }
});

function loginAsAdmin() {
    const adminUser = {
        id: 1,
        email: 'admin@matcharena.az',
        name: 'Admin',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    if (window.AuthManager) {
        AuthManager.login(adminUser);
    } else {
        localStorage.setItem('user', JSON.stringify(adminUser));
        alert('Admin kimi daxil oldunuz!');
        window.location.href = 'admin-panel.html';
    }
}

function loginAsCaptain() {
    const captainUser = {
        id: 2,
        email: 'captain@matcharena.az',
        name: 'Kapitan Əli',
        role: 'captain',
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    if (window.AuthManager) {
        AuthManager.login(captainUser);
    } else {
        localStorage.setItem('user', JSON.stringify(captainUser));
        alert('Kapitan kimi daxil oldunuz!');
        window.location.href = 'index.html';
    }
}

function loginAsFieldOwner() {
    const fieldOwnerUser = {
        id: 3,
        email: 'owner@matcharena.az',
        name: 'Meydança Sahibi',
        role: 'field-owner',
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    if (window.AuthManager) {
        AuthManager.login(fieldOwnerUser);
    } else {
        localStorage.setItem('user', JSON.stringify(fieldOwnerUser));
        alert('Meydança sahibi kimi daxil oldunuz!');
        window.location.href = 'index.html';
    }
}

function loginAsOrganizer() {
    const organizerUser = {
        id: 4,
        email: 'organizer@matcharena.az',
        name: 'Təşkilatçı',
        role: 'organizer',
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    if (window.AuthManager) {
        AuthManager.login(organizerUser);
    } else {
        localStorage.setItem('user', JSON.stringify(organizerUser));
        alert('Təşkilatçı kimi daxil oldunuz!');
        window.location.href = 'index.html';
    }
}
