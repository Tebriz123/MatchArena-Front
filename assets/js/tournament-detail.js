// Tournament Detail Page Handler
document.addEventListener('DOMContentLoaded', function() {
    // Tab Management
    const detailTabs = document.querySelectorAll('.detail-tab');
    
    if (detailTabs.length > 0) {
        detailTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const targetTab = this.dataset.tab;
                
                // Remove active class from all tabs and contents
                document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.detail-tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const targetContent = document.getElementById(targetTab);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // Get tournament ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');
    
    if (tournamentId) {
        console.log('Tournament ID:', tournamentId);
        // Load tournament data based on ID
    }
});
