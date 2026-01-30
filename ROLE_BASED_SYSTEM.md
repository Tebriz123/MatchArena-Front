# Role-Based Access Control System - FutbolBirlik

## 📋 Overview
Complete role-based authentication and authorization system implemented for the FutbolBirlik platform.

## 🎭 Roles & Permissions

### 1. **Admin** (Administrator)
- **Full platform access**
- Can create, edit, and delete: tournaments, teams, fields
- Access to admin panel
- Manage users, reviews, and reports
- All permissions granted

### 2. **Captain** (Komanda Kapitanı)
- **Team management focused**
- ✅ Create teams
- ✅ Edit teams
- ✅ Manage team members
- ✅ View all content
- ✅ Write reviews
- ❌ Cannot create tournaments
- ❌ Cannot create fields
- ❌ No admin panel access

### 3. **Field Owner** (Meydança Sahibi)
- **Field management focused**
- ✅ Create fields
- ✅ Edit fields
- ✅ Manage bookings
- ✅ View all content
- ✅ Write reviews
- ❌ Cannot create tournaments
- ❌ Cannot create teams
- ❌ No admin panel access

### 4. **Organizer** (Turnir Təşkilatçısı)
- **Tournament management focused**
- ✅ Create tournaments
- ✅ Edit tournaments
- ✅ Manage tournament operations
- ✅ View all content
- ✅ Write reviews
- ❌ Cannot create teams
- ❌ Cannot create fields
- ❌ No admin panel access

### 5. **Player** (Oyunçu)
- **Basic user access**
- ✅ View all content
- ✅ Write reviews
- ✅ Edit own profile
- ❌ Cannot create teams
- ❌ Cannot create tournaments
- ❌ Cannot create fields
- ❌ No admin panel access

## 🔐 Authentication Features

### Registration Process
- Users select their role during registration
- Role descriptions shown dynamically
- Email validation
- Password strength requirements (min 6 characters)
- Password confirmation matching
- Terms and conditions acceptance

### Login System
- Standard email/password login
- Test accounts available for each role:
  - 🔐 Admin
  - 👨‍✈️ Captain
  - 🏟️ Field Owner
  - 🏆 Organizer
  - Regular player login

### Session Management
- User data stored in localStorage
- Persistent sessions
- Automatic redirect after login
- Role-based dashboard routing

## 🎯 Access Control

### Page-Level Protection
All create pages are protected:
- **create-team.html** - Requires `CREATE_TEAM` permission
- **create-tournament.html** - Requires `CREATE_TOURNAMENT` permission
- **create-field.html** - Requires `CREATE_FIELD` permission
- **admin-panel.html** - Requires `ACCESS_ADMIN_PANEL` permission

### Permission Checks
- Client-side validation on page load
- Form submission validation
- Automatic redirect if unauthorized
- User-friendly error messages

### Navigation Updates
- Dynamic button hiding based on permissions
- Role-specific dashboard links
- User name displayed when logged in
- Logout functionality

## 🖥️ Dashboards

### Role-Specific Dashboards
Each role has a dedicated dashboard:
- `captain-dashboard.html` - For team captains
- `field-owner-dashboard.html` - For field owners
- `organizer-dashboard.html` - For organizers
- `player-dashboard.html` - For players
- `admin-panel.html` - For administrators

### Dashboard Features
- User information display
- Role badge
- Quick action buttons (based on permissions)
- List of all granted permissions
- Visual permission indicators

## 📁 File Structure

### New Files Created
```
assets/js/
├── auth.js           # Main authentication & authorization system
├── (Updated files)
├── create-team.js    # Added permission checks
├── create-tournament.js # Added permission checks
├── create-field.js   # Added permission checks
├── register.js       # Enhanced role selection
├── login.js          # Added test account functions
└── admin-panel.js    # Already had auth checks

captain-dashboard.html
field-owner-dashboard.html
organizer-dashboard.html
player-dashboard.html
```

## 🔧 Implementation Details

### AuthManager Class
Central authentication manager with methods:
- `getCurrentUser()` - Get logged-in user
- `isLoggedIn()` - Check login status
- `getUserRole()` - Get user's role
- `hasPermission(permission)` - Check single permission
- `hasAnyPermission(array)` - Check multiple permissions (OR)
- `hasAllPermissions(array)` - Check multiple permissions (AND)
- `requireLogin()` - Enforce login requirement
- `requirePermission()` - Enforce permission requirement
- `requireRole()` - Enforce role requirement
- `login(userData)` - Handle login
- `logout()` - Handle logout
- `updateNavigation()` - Update UI based on auth state

### Permission Constants
All permissions defined in `PERMISSIONS` object:
- Tournament permissions
- Team permissions
- Field permissions
- Admin permissions
- General permissions

### Role-Permission Mapping
`ROLE_PERMISSIONS` object maps each role to its permissions array.

## 🚀 Usage Examples

### Checking Permission in JavaScript
```javascript
if (AuthManager.hasPermission(PERMISSIONS.CREATE_TEAM)) {
    // User can create teams
}
```

### Requiring Permission
```javascript
// Redirect if no permission
AuthManager.requirePermission(PERMISSIONS.CREATE_TOURNAMENT, 'tournaments.html');
```

### Getting Current User
```javascript
const user = AuthManager.getCurrentUser();
console.log(user.name, user.role);
```

## 🧪 Testing

### Test Accounts
Use the login page test buttons:
1. **Admin** - Full access to everything
2. **Captain** - Can create and manage teams
3. **Field Owner** - Can create and manage fields
4. **Organizer** - Can create and manage tournaments
5. **Player** - Basic viewing and review permissions

### Testing Workflow
1. Go to login.html
2. Click one of the test account buttons
3. You'll be redirected to the appropriate dashboard
4. Try accessing different pages
5. Try creating content (based on role)
6. Unauthorized attempts will show alerts and redirect

## 🎨 UI Features

### Dynamic Elements
- Navigation shows user name when logged in
- Login button becomes logout button
- Create buttons hidden if no permission
- Role badge in dashboards
- Permission list with checkmarks
- Quick action cards with icons

### User Feedback
- Alert messages for unauthorized access
- Success messages on registration
- Role information during registration
- Permission descriptions

## 🔄 Flow Diagrams

### Registration Flow
```
User visits register.html
  → Selects role
  → Sees role description
  → Fills form
  → Submits
  → User created with role
  → Redirected to role-specific dashboard
```

### Login Flow
```
User visits login.html
  → Enters credentials (or clicks test button)
  → AuthManager.login() called
  → User stored in localStorage
  → Redirected to role-specific dashboard
```

### Permission Check Flow
```
User visits protected page
  → Page loads auth.js
  → AuthManager checks permission
  → If authorized: continue
  → If not authorized: alert + redirect
```

## 📝 Notes

- All authentication is client-side (demo purposes)
- In production, implement server-side authentication
- Add JWT tokens for API calls
- Implement password hashing
- Add session expiration
- Add refresh token mechanism

## 🎓 Best Practices Implemented

✅ Separation of concerns (auth logic separate)
✅ Reusable AuthManager class
✅ Clear permission naming
✅ Role-based routing
✅ User-friendly error messages
✅ Consistent UI updates
✅ Modular permission system
✅ Easy to extend with new roles/permissions
