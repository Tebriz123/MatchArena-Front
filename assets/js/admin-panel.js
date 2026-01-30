// Admin Panel Page Handler
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in as admin
    function checkAuth() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.email || user.role !== 'admin') {
            alert('Bu səhifəyə daxil olmaq üçün admin hesabı ilə giriş etməlisiniz!');
            window.location.href = 'login.html';
            return;
        }
        
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = user.name || 'Admin';
        }
    }

    // Check authentication on page load
    checkAuth();

    // Update stats with real-time effect
    function animateStats() {
        const statNumbers = document.querySelectorAll('.admin-stat-number');
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent.replace(/,/g, ''));
            let currentValue = 0;
            const increment = finalValue / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue.toLocaleString();
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue).toLocaleString();
                }
            }, 20);
        });
    }

    // Animate stats on page load
    setTimeout(animateStats, 100);

    // Tab Management
    const adminTabs = document.querySelectorAll('.admin-tab');
    if (adminTabs.length > 0) {
        adminTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Remove active class from all tabs and contents
                document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
});

// Global functions
function logout() {
    localStorage.removeItem('user');
    alert('Çıxış uğurla həyata keçirildi!');
    window.location.href = 'login.html';
}

// Table Filter
function filterTable(tableId, searchValue) {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const rowText = rows[i].textContent.toLowerCase();
        if (rowText.includes(searchValue.toLowerCase())) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

// Player Management
function viewPlayer(id) {
    window.location.href = `player-detail.html?id=${id}`;
}

function editPlayer(id) {
    alert(`Oyunçu #${id} redaktə edilir...`);
}

function deletePlayer(id) {
    showDeleteModal('player', id);
}

// Team Management
function viewTeam(id) {
    window.location.href = `team-detail.html?id=${id}`;
}

function editTeam(id) {
    alert(`Komanda #${id} redaktə edilir...`);
}

function deleteTeam(id) {
    showDeleteModal('team', id);
}

// Tournament Management
function viewTournament(id) {
    alert(`Turnir #${id} detalları göstərilir...`);
}

function editTournament(id) {
    alert(`Turnir #${id} redaktə edilir...`);
}

function deleteTournament(id) {
    showDeleteModal('tournament', id);
}

// Field Management
function viewField(id) {
    window.location.href = `field-detail.html?id=${id}`;
}

function editField(id) {
    alert(`Meydança #${id} redaktə edilir...`);
}

function deleteField(id) {
    showDeleteModal('field', id);
}

// Review Management
function filterReviews(type) {
    alert(`${type} rəyləri filtrlənir...`);
}

function approveReview(id) {
    alert(`Rəy #${id} təsdiqləndi!`);
}

function deleteReview(id) {
    if (confirm('Bu rəyi silmək istədiyinizə əminsiniz?')) {
        alert(`Rəy #${id} silindi!`);
    }
}

// Pending Approvals
function approvePending(type, id) {
    alert(`${type} #${id} təsdiqləndi və platforma əlavə edildi!`);
}

function rejectPending(type, id) {
    const reason = prompt('Rədd etmə səbəbini daxil edin:');
    if (reason) {
        alert(`${type} #${id} rədd edildi. Səbəb: ${reason}`);
    }
}

// Reports Management
function filterReports(type) {
    alert(`${type} şikayətləri filtrlənir...`);
}

function viewReport(id) {
    alert(`Şikayət #${id} ətraflı göstərilir...`);
}

function warnUser(userId) {
    alert(`İstifadəçi #${userId} xəbərdarlıq aldı!`);
}

function banUser(userId) {
    if (confirm('Bu istifadəçini bloklamaq istədiyinizə əminsiniz?')) {
        const duration = prompt('Bloklama müddəti (gün):');
        if (duration) {
            alert(`İstifadəçi #${userId} ${duration} gün bloklandı!`);
        }
    }
}

function removeContent(contentId) {
    if (confirm('Bu məzmunu silmək istədiyinizə əminsiniz?')) {
        alert(`Məzmun #${contentId} silindi!`);
    }
}

function dismissReport(id) {
    alert(`Şikayət #${id} bağlandı!`);
}

// Modal Management
let deleteTarget = null;

function showDeleteModal(type, id) {
    deleteTarget = { type, id };
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.classList.remove('active');
    }
    deleteTarget = null;
}

function confirmDelete() {
    if (deleteTarget) {
        alert(`${deleteTarget.type} #${deleteTarget.id} silindi!`);
        closeModal();
    }
}

function showCreatePlayerModal() {
    alert('Oyunçu yaratma formu açılır...');
}
