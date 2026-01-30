// FutbolBirlik Platform - Statik Məlumatlar

const data = {
  players: [
    {
      id: 1,
      name: "Nihad Qasimov",
      position: "Qapiçi",
      age: 30,
      city: "Baki",
      team: "Qarabag",
      rating: 4.9,
      games: 312,
      goals: 156,
      assists: 89,
      badge: "Oyunçu axtarır"
    },
    {
      id: 2,
      name: "Elvin Hüseynov",
      position: "Müdəfi",
      age: 28,
      city: "Gəncə",
      team: "Gəncə FC",
      rating: 4.8,
      games: 267,
      goals: 12,
      assists: 45,
      badge: "Oyunçu axtarır"
    },
    {
      id: 3,
      name: "Tural Mammadov",
      position: "Orta sahə",
      age: 26,
      city: "Baki",
      team: "FC Baki",
      rating: 4.7,
      games: 245,
      goals: 34,
      assists: 67,
      badge: "Oyunçu axtarır"
    },
    {
      id: 4,
      name: "Samair Rəhimov",
      position: "Hücumçu",
      age: 24,
      city: "Sumqayıt",
      team: "Sumqayıt United",
      rating: 4.6,
      games: 178,
      goals: 78,
      assists: 34,
      badge: "Oyunçu axtarır"
    },
    {
      id: 5,
      name: "Fərid Məmmədov",
      position: "Hücumçu",
      age: 25,
      city: "Mingəçevir",
      team: "Mingəçevir",
      rating: 4.5,
      games: 156,
      goals: 89,
      assists: 23,
      badge: "Oyunçu axtarır"
    },
    {
      id: 6,
      name: "Aydın Məmmədov",
      position: "Müdəfi",
      age: 29,
      city: "Şəmkir",
      team: "Şəmkir Stars",
      rating: 4.4,
      games: 298,
      goals: 5,
      assists: 12,
      badge: "Oyunçu axtarır"
    },
    {
      id: 7,
      name: "Rəşad Biliyev",
      position: "Qapiçi",
      age: 32,
      city: "Lənkəran",
      team: "Lənkəran United",
      rating: 4.3,
      games: 412,
      goals: 2,
      assists: 89,
      badge: "Oyunçu axtarır"
    },
    {
      id: 8,
      name: "Kenan Əliyev",
      position: "Orta sahə",
      age: 23,
      city: "Baki",
      team: "Qarabag",
      rating: 4.2,
      games: 89,
      goals: 23,
      assists: 34,
      badge: "Oyunçu axtarır"
    }
  ],

  teams: [
    {
      id: 1,
      name: "Qarabag Legends",
      captain: "Öli Kazimov",
      city: "Baki",
      members: 15,
      rating: 4.9,
      games: 67,
      wins: 45,
      draws: 12,
      losses: 10,
      badge: "Oyunçu axtarır"
    },
    {
      id: 2,
      name: "Gəncə FC",
      captain: "Elvin Hüseynov",
      city: "Gəncə",
      members: 14,
      rating: 4.8,
      games: 58,
      wins: 38,
      draws: 14,
      losses: 6,
      badge: "Oyunçu axtarır"
    },
    {
      id: 3,
      name: "FC Baki",
      captain: "Tural Mammadov",
      city: "Baki",
      members: 12,
      rating: 4.7,
      games: 45,
      wins: 32,
      draws: 9,
      losses: 4,
      badge: "Oyunçu axtarır"
    },
    {
      id: 4,
      name: "Neftoçiler",
      captain: "Nihad Qasimov",
      city: "Baki",
      members: 11,
      rating: 4.6,
      games: 41,
      wins: 28,
      draws: 8,
      losses: 5,
      badge: "Oyunçu axtarır"
    },
    {
      id: 5,
      name: "Sumqayıt United",
      captain: "Rəşad Biliyev",
      city: "Sumqayıt",
      members: 10,
      rating: 4.5,
      games: 32,
      wins: 22,
      draws: 6,
      losses: 4,
      badge: "Oyunçu axtarır"
    },
    {
      id: 6,
      name: "Mingəçevir",
      captain: "Fərid Məmmədov",
      city: "Mingəçevir",
      members: 13,
      rating: 4.4,
      games: 29,
      wins: 20,
      draws: 5,
      losses: 4,
      badge: "Oyunçu axtarır"
    },
    {
      id: 7,
      name: "Şəmkir Stars",
      captain: "Samair Rəhimov",
      city: "Şəmkir",
      members: 9,
      rating: 4.3,
      games: 23,
      wins: 16,
      draws: 4,
      losses: 3,
      badge: "Oyunçu axtarır"
    },
    {
      id: 8,
      name: "Lənkəran United",
      captain: "Samair Rəhimov",
      city: "Lənkəran",
      members: 11,
      rating: 4.2,
      games: 18,
      wins: 12,
      draws: 3,
      losses: 3,
      badge: "Oyunçu axtarır"
    }
  ],

  fields: [
    {
      id: 1,
      name: "Mini Futbol Arena",
      city: "Baki",
      address: "Nizami r., 45A",
      price: 120,
      rating: 4.5,
      reviews: 127,
      size: "40 x 20 m",
      hours: "08:00 - 23:00",
      phone: "+994 50 XXX XX XX",
      services: ["Şual meydançası", "Dəmir kafestir", "Soyunma otağı", "Şower", "Parklandırma"]
    },
    {
      id: 2,
      name: "Futbol Kompleksi",
      city: "Baki",
      address: "Heydar Aliyev pr., 123",
      price: 150,
      rating: 4.6,
      reviews: 95,
      size: "50 x 30 m",
      hours: "07:00 - 22:00",
      phone: "+994 50 XXX XX XX",
      services: ["Şual meydançası", "Dəmir kafestir", "Soyunma otağı", "Şower", "Kafe", "Parklandırma"]
    },
    {
      id: 3,
      name: "Gəncə Futbol Sarayı",
      city: "Gəncə",
      address: "Samədoğlu st., 56",
      price: 100,
      rating: 4.4,
      reviews: 78,
      size: "40 x 20 m",
      hours: "09:00 - 21:00",
      phone: "+994 50 XXX XX XX",
      services: ["Şual meydançası", "Dəmir kafestir", "Soyunma otağı", "Parklandırma"]
    },
    {
      id: 4,
      name: "Sumqayıt Futbol Merkezi",
      city: "Sumqayıt",
      address: "Azərbaycan pr., 78",
      price: 110,
      rating: 4.3,
      reviews: 56,
      size: "40 x 20 m",
      hours: "08:00 - 23:00",
      phone: "+994 50 XXX XX XX",
      services: ["Şual meydançası", "Dəmir kafestir", "Soyunma otağı", "Parklandırma"]
    },
    {
      id: 5,
      name: "Mingəçevir Arena",
      city: "Mingəçevir",
      address: "Lenin pr., 34",
      price: 90,
      rating: 4.2,
      reviews: 42,
      size: "40 x 20 m",
      hours: "08:00 - 22:00",
      phone: "+994 50 XXX XX XX",
      services: ["Şual meydançası", "Dəmir kafestir", "Parklandırma"]
    }
  ],

  tournaments: [
    {
      id: 1,
      name: "Bakı Futbol Liqası",
      city: "Baki",
      teams: 12,
      rating: 4.7,
      startDate: "2024-02-15",
      endDate: "2024-06-30",
      prize: "50,000₼",
      status: "Davam etməkdə"
    },
    {
      id: 2,
      name: "Azərbaycan Mini Futbol Kuboku",
      city: "Baki",
      teams: 16,
      rating: 4.8,
      startDate: "2024-03-01",
      endDate: "2024-05-31",
      prize: "100,000₼",
      status: "Davam etməkdə"
    },
    {
      id: 3,
      name: "Gəncə Futbol Turniri",
      city: "Gəncə",
      teams: 8,
      rating: 4.4,
      startDate: "2024-02-20",
      endDate: "2024-04-30",
      prize: "30,000₼",
      status: "Davam etməkdə"
    },
    {
      id: 4,
      name: "Sumqayıt Açıq Çempionatlı",
      city: "Sumqayıt",
      teams: 10,
      rating: 4.5,
      startDate: "2024-03-10",
      endDate: "2024-05-15",
      prize: "40,000₼",
      status: "Davam etməkdə"
    },
    {
      id: 5,
      name: "Mingəçevir Futbol Festivalı",
      city: "Mingəçevir",
      teams: 9,
      rating: 4.3,
      startDate: "2024-04-01",
      endDate: "2024-06-15",
      prize: "25,000₼",
      status: "Tezliklə"
    }
  ]
};
