// MatchArena Platform - JavaScript İşlevləri

// Declare the data variable
const data = {
  teams: [],
  players: [],
  fields: [],
  tournaments: []
};

// Tema Dəyişmə Funksiyası
function toggleTheme() {
  const root = document.documentElement;
  const currentBg = root.style.getPropertyValue('--background-color');
  
  if (currentBg === '#0f172a' || currentBg === '') {
    // Açıq tema
    root.style.setProperty('--background-color', '#f8fafc');
    root.style.setProperty('--secondary-color', '#ffffff');
    root.style.setProperty('--text-color', '#0f172a');
    root.style.setProperty('--text-muted', '#64748b');
    root.style.setProperty('--border-color', '#e2e8f0');
    root.style.setProperty('--card-bg', '#f8fafc');
    localStorage.setItem('theme', 'light');
  } else {
    // Koyu tema
    root.style.setProperty('--background-color', '#0f172a');
    root.style.setProperty('--secondary-color', '#1e293b');
    root.style.setProperty('--text-color', '#e2e8f0');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--border-color', '#334155');
    root.style.setProperty('--card-bg', '#1e293b');
    localStorage.setItem('theme', 'dark');
  }
}

// Tema Başlatma
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    toggleTheme();
  }
}

// Tema Toggle Düğməsinə Event Listener Əlavə Etmə
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Səhifə yükləndikdə temayı başlat
  initTheme();

  // Komandalar səhifəsində filtreleme
  const searchInput = document.getElementById('search-input');
  const cityFilter = document.getElementById('city-filter');
  const sortFilter = document.getElementById('sort-filter');
  const onlineFilter = document.getElementById('online-filter');

  if (searchInput) {
    searchInput.addEventListener('input', filterTeams);
  }
  if (cityFilter) {
    cityFilter.addEventListener('change', filterTeams);
  }
  if (sortFilter) {
    sortFilter.addEventListener('change', filterTeams);
  }
  if (onlineFilter) {
    onlineFilter.addEventListener('change', filterTeams);
  }

  // Oyunçular səhifəsində filtreleme
  const playerSearchInput = document.getElementById('player-search-input');
  const playerPositionFilter = document.getElementById('position-filter');
  const playerCityFilter = document.getElementById('player-city-filter');

  if (playerSearchInput) {
    playerSearchInput.addEventListener('input', filterPlayers);
  }
  if (playerPositionFilter) {
    playerPositionFilter.addEventListener('change', filterPlayers);
  }
  if (playerCityFilter) {
    playerCityFilter.addEventListener('change', filterPlayers);
  }

  // Meydançalar səhifəsində filtreleme
  const fieldSearchInput = document.getElementById('field-search-input');
  const fieldCityFilter = document.getElementById('field-city-filter');
  const fieldPriceFilter = document.getElementById('price-filter');

  if (fieldSearchInput) {
    fieldSearchInput.addEventListener('input', filterFields);
  }
  if (fieldCityFilter) {
    fieldCityFilter.addEventListener('change', filterFields);
  }
  if (fieldPriceFilter) {
    fieldPriceFilter.addEventListener('change', filterFields);
  }
});

// Komandaları Filtreleme Funksiyası
function filterTeams() {
  const searchInput = document.getElementById('search-input')?.value.toLowerCase() || '';
  const cityFilter = document.getElementById('city-filter')?.value || 'Bütün şəhərlər';
  const sortFilter = document.getElementById('sort-filter')?.value || 'Reytinqə görə';
  const onlySearching = document.getElementById('online-filter')?.checked || false;

  let filtered = data.teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchInput) || team.captain.toLowerCase().includes(searchInput);
    const matchesCity = cityFilter === 'Bütün şəhərlər' || team.city === cityFilter;
    const matchesSearching = !onlySearching || team.badge === 'Oyunçu axtarır';
    return matchesSearch && matchesCity && matchesSearching;
  });

  // Sıralama
  if (sortFilter === 'Ən yüksək') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortFilter === 'Ən aşağı') {
    filtered.sort((a, b) => a.rating - b.rating);
  }

  renderTeams(filtered);
}

// Komandaları Render Etme Funksiyası
function renderTeams(teams) {
  const grid = document.getElementById('teams-grid');
  const countText = document.getElementById('count-text');
  
  if (!grid) return;

  grid.innerHTML = teams.map(team => `
    <a href="team-detail.html?id=${team.id}" class="team-card" style="text-decoration: none; color: inherit;">
      <div class="card-image">${team.name.charAt(0)}</div>
      <div class="card-content">
        <div class="team-badge">Oyunçu axtarır</div>
        <h3 class="card-title">${team.name}</h3>
        <div class="card-subtitle">Kapitain: ${team.captain} • 🏠 ${team.city}</div>
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-item-value">${team.members}/15</div>
            <div class="stat-item-label">qolaça</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${team.rating}</div>
            <div class="stat-item-label">⭐</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${team.games}</div>
            <div class="stat-item-label">oyun</div>
          </div>
        </div>
        <div class="card-buttons">
          <span class="btn-small">Profil bax</span>
          <button class="btn-small btn-small-secondary">Qoşul</button>
        </div>
      </div>
    </a>
  `).join('');

  if (countText) {
    countText.textContent = `${teams.length} komanda tapıldı`;
  }
}

// Oyunçuları Filtreleme Funksiyası
function filterPlayers() {
  const searchInput = document.getElementById('player-search-input')?.value.toLowerCase() || '';
  const positionFilter = document.getElementById('position-filter')?.value || 'Bütün vəzifələr';
  const cityFilter = document.getElementById('player-city-filter')?.value || 'Bütün şəhərlər';

  let filtered = data.players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchInput);
    const matchesPosition = positionFilter === 'Bütün vəzifələr' || player.position === positionFilter;
    const matchesCity = cityFilter === 'Bütün şəhərlər' || player.city === cityFilter;
    return matchesSearch && matchesPosition && matchesCity;
  });

  renderPlayers(filtered);
}

// Oyunçuları Render Etme Funksiyası
function renderPlayers(players) {
  const grid = document.getElementById('players-grid');
  const countText = document.getElementById('player-count-text');
  
  if (!grid) return;

  grid.innerHTML = players.map(player => `
    <a href="player-detail.html?id=${player.id}" class="player-card" style="text-decoration: none; color: inherit;">
      <div class="card-image">${player.name.charAt(0)}</div>
      <div class="card-content">
        <div class="player-badge">${player.badge}</div>
        <h3 class="card-title">${player.name}</h3>
        <div class="card-subtitle">${player.position} • 🏠 ${player.city}</div>
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-item-value">${player.age}</div>
            <div class="stat-item-label">yaş</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${player.rating}</div>
            <div class="stat-item-label">⭐</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${player.games}</div>
            <div class="stat-item-label">oyun</div>
          </div>
        </div>
        <div class="card-buttons">
          <span class="btn-small">Profil bax</span>
          <button class="btn-small btn-small-secondary">Dəvət et</button>
        </div>
      </div>
    </a>
  `).join('');

  if (countText) {
    countText.textContent = `${players.length} oyunçu tapıldı`;
  }
}

// Meydançaları Filtreleme Funksiyası
function filterFields() {
  const searchInput = document.getElementById('field-search-input')?.value.toLowerCase() || '';
  const cityFilter = document.getElementById('field-city-filter')?.value || 'Bütün şəhərlər';
  const priceFilter = document.getElementById('price-filter')?.value || 'Bütün qiymətlər';

  let filtered = data.fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchInput);
    const matchesCity = cityFilter === 'Bütün şəhərlər' || field.city === cityFilter;
    
    let matchesPrice = true;
    if (priceFilter === '0-100') {
      matchesPrice = field.price <= 100;
    } else if (priceFilter === '100-150') {
      matchesPrice = field.price > 100 && field.price <= 150;
    } else if (priceFilter === '150+') {
      matchesPrice = field.price > 150;
    }
    
    return matchesSearch && matchesCity && matchesPrice;
  });

  renderFields(filtered);
}

// Meydançaları Render Etme Funksiyası
function renderFields(fields) {
  const grid = document.getElementById('fields-grid');
  const countText = document.getElementById('field-count-text');
  
  if (!grid) return;

  grid.innerHTML = fields.map(field => `
    <a href="field-detail.html?id=${field.id}" class="field-card" style="text-decoration: none; color: inherit;">
      <div class="card-image">⚽</div>
      <div class="card-content">
        <h3 class="card-title">${field.name}</h3>
        <div class="card-subtitle">🏠 ${field.city}</div>
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-item-value">${field.price}₼</div>
            <div class="stat-item-label">/saat</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${field.rating}</div>
            <div class="stat-item-label">⭐</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${field.reviews}</div>
            <div class="stat-item-label">rəy</div>
          </div>
        </div>
        <div class="card-buttons">
          <span class="btn-small">Məlumat</span>
          <button class="btn-small btn-small-secondary">Rezerv et</button>
        </div>
      </div>
    </a>
  `).join('');

  if (countText) {
    countText.textContent = `${fields.length} meydança tapıldı`;
  }
}

// Turnirləri Render Etme Funksiyası
function renderTournaments(tournaments) {
  const grid = document.getElementById('tournaments-grid');
  const countText = document.getElementById('tournament-count-text');
  
  if (!grid) return;

  grid.innerHTML = tournaments.map(tournament => `
    <a href="tournament-detail.html?id=${tournament.id}" class="tournament-card" style="text-decoration: none; color: inherit;">
      <div class="card-image">🏆</div>
      <div class="card-content">
        <h3 class="card-title">${tournament.name}</h3>
        <div class="card-subtitle">🏠 ${tournament.city}</div>
        <div class="card-stats">
          <div class="stat-item">
            <div class="stat-item-value">${tournament.teams}</div>
            <div class="stat-item-label">komanda</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${tournament.rating}</div>
            <div class="stat-item-label">⭐</div>
          </div>
          <div class="stat-item">
            <div class="stat-item-value">${tournament.prize}</div>
            <div class="stat-item-label">mükafat</div>
          </div>
        </div>
        <div class="card-buttons">
          <span class="btn-small">${tournament.status}</span>
          <button class="btn-small btn-small-secondary">Qeydiyyat</button>
        </div>
      </div>
    </a>
  `).join('');

  if (countText) {
    countText.textContent = `${tournaments.length} turnir tapıldı`;
  }
}

// URL Parametrindən Detail Səhifəsi Yükləmə Funksiyası
function loadDetailPageData() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  // Səhifənin yolundan nə tapmalı olduğumuzu əldə edirik
  const pathname = window.location.pathname;

  if (pathname.includes('player-detail')) {
    const player = data.players.find(p => p.id === id);
    if (player) {
      populatePlayerDetail(player);
    }
  } else if (pathname.includes('team-detail')) {
    const team = data.teams.find(t => t.id === id);
    if (team) {
      populateTeamDetail(team);
    }
  } else if (pathname.includes('field-detail')) {
    const field = data.fields.find(f => f.id === id);
    if (field) {
      populateFieldDetail(field);
    }
  }
}

// Oyunçu Detail Səhifəsini Doldurma
function populatePlayerDetail(player) {
  // Burada HTML-də mövcud olan elementlər varsa, məlumatları əvəz edə biləriz
  document.title = `${player.name} - MatchArena`;
}

// Komanda Detail Səhifəsini Doldurma
function populateTeamDetail(team) {
  document.title = `${team.name} - MatchArena`;
}

// Meydança Detail Səhifəsini Doldurma
function populateFieldDetail(field) {
  document.title = `${field.name} - MatchArena`;
}

// Səhifə yükləndikdə detail səhifə məlumatlarını yüklə
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('-detail')) {
    loadDetailPageData();
  }

  // Oyunçular səhifəsi
  if (window.location.pathname.includes('players.html')) {
    renderPlayers(data.players);
  }

  // Komandalar səhifəsi
  if (window.location.pathname.includes('teams.html')) {
    renderTeams(data.teams);
  }

  // Meydançalar səhifəsi
  if (window.location.pathname.includes('fields.html')) {
    renderFields(data.fields);
  }

  // Turnirləri səhifəsi
  if (window.location.pathname.includes('tournaments.html')) {
    renderTournaments(data.tournaments);
  }
});
