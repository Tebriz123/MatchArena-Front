// Test Data - Demo teams for challenge system testing

function createDemoTeams() {
    // Only create if no teams exist
    const existingTeams = localStorage.getItem('teams');
    if (existingTeams) {
        console.log('Demo teams already exist');
        return;
    }

    const demoTeams = [
        {
            id: 1,
            name: 'Qarabag Legends',
            city: 'Bakı',
            foundedYear: 2020,
            captainId: 1,
            captainName: 'Əli Kazimov',
            members: 15,
            maxMembers: 15,
            rating: 4.9,
            matchesPlayed: 67,
            wins: 45,
            draws: 12,
            losses: 10,
            goalsScored: 142,
            goalsConceded: 78,
            status: 'active',
            lookingForPlayers: true,
            createdBy: 1,
            createdAt: new Date('2020-01-15').toISOString()
        },
        {
            id: 2,
            name: 'Gəncə FC',
            city: 'Gəncə',
            foundedYear: 2019,
            captainId: 2,
            captainName: 'Elvin Hüseynov',
            members: 14,
            maxMembers: 15,
            rating: 4.8,
            matchesPlayed: 58,
            wins: 38,
            draws: 10,
            losses: 10,
            goalsScored: 118,
            goalsConceded: 65,
            status: 'active',
            lookingForPlayers: true,
            createdBy: 2,
            createdAt: new Date('2019-06-20').toISOString()
        },
        {
            id: 3,
            name: 'FC Bakı',
            city: 'Bakı',
            foundedYear: 2021,
            captainId: 3,
            captainName: 'Tural Məmmədov',
            members: 12,
            maxMembers: 15,
            rating: 4.7,
            matchesPlayed: 45,
            wins: 28,
            draws: 10,
            losses: 7,
            goalsScored: 95,
            goalsConceded: 48,
            status: 'active',
            lookingForPlayers: true,
            createdBy: 3,
            createdAt: new Date('2021-03-10').toISOString()
        }
    ];

    localStorage.setItem('teams', JSON.stringify(demoTeams));
    console.log('Demo teams created successfully');
}

// Create demo player history
function createDemoPlayerHistory() {
    // Only create if no history exists
    const existingHistory = localStorage.getItem('playerTeamHistory');
    if (existingHistory) {
        console.log('Demo player history already exists');
        return;
    }

    const playerHistory = [
        // Player 1 - Nihad Qasimov
        {
            id: 1,
            playerId: 1,
            teamId: 1,
            teamName: 'Qarabag Legends',
            startDate: '2020-01-15',
            endDate: null,
            isCurrent: true,
            matchesPlayed: 67,
            wins: 45,
            draws: 12,
            losses: 10,
            goals: 5,
            assists: 8,
            yellowCards: 3,
            redCards: 0,
            createdAt: new Date('2020-01-15').toISOString()
        },
        {
            id: 2,
            playerId: 1,
            teamId: 4,
            teamName: 'Sumqayıt Strikers',
            startDate: '2018-06-01',
            endDate: '2019-12-31',
            isCurrent: false,
            matchesPlayed: 52,
            wins: 28,
            draws: 14,
            losses: 10,
            goals: 3,
            assists: 5,
            yellowCards: 2,
            redCards: 0,
            createdAt: new Date('2018-06-01').toISOString()
        },
        {
            id: 3,
            playerId: 1,
            teamId: 5,
            teamName: 'Neftçi United',
            startDate: '2016-03-01',
            endDate: '2018-05-30',
            isCurrent: false,
            matchesPlayed: 89,
            wins: 52,
            draws: 20,
            losses: 17,
            goals: 7,
            assists: 12,
            yellowCards: 5,
            redCards: 1,
            createdAt: new Date('2016-03-01').toISOString()
        },
        // Player 2 - Elvin Hüseynov
        {
            id: 4,
            playerId: 2,
            teamId: 2,
            teamName: 'Gəncə FC',
            startDate: '2021-01-01',
            endDate: null,
            isCurrent: true,
            matchesPlayed: 58,
            wins: 38,
            draws: 10,
            losses: 10,
            goals: 2,
            assists: 6,
            yellowCards: 8,
            redCards: 1,
            createdAt: new Date('2021-01-01').toISOString()
        },
        {
            id: 5,
            playerId: 2,
            teamId: 6,
            teamName: 'Şəki Warriors',
            startDate: '2019-07-01',
            endDate: '2020-12-31',
            isCurrent: false,
            matchesPlayed: 45,
            wins: 22,
            draws: 13,
            losses: 10,
            goals: 1,
            assists: 4,
            yellowCards: 6,
            redCards: 0,
            createdAt: new Date('2019-07-01').toISOString()
        },
        // Player 3 - Tural Mammadov
        {
            id: 6,
            playerId: 3,
            teamId: 3,
            teamName: 'FC Bakı',
            startDate: '2022-01-01',
            endDate: null,
            isCurrent: true,
            matchesPlayed: 45,
            wins: 28,
            draws: 10,
            losses: 7,
            goals: 18,
            assists: 15,
            yellowCards: 4,
            redCards: 0,
            createdAt: new Date('2022-01-01').toISOString()
        },
        {
            id: 7,
            playerId: 3,
            teamId: 1,
            teamName: 'Qarabag Legends',
            startDate: '2020-03-01',
            endDate: '2021-12-31',
            isCurrent: false,
            matchesPlayed: 38,
            wins: 25,
            draws: 8,
            losses: 5,
            goals: 12,
            assists: 9,
            yellowCards: 3,
            redCards: 0,
            createdAt: new Date('2020-03-01').toISOString()
        }
    ];

    localStorage.setItem('playerTeamHistory', JSON.stringify(playerHistory));
    console.log('Demo player history created successfully');
}

// Create demo players
function createDemoPlayers() {
    // Only create if no players exist
    const existingPlayers = localStorage.getItem('players');
    if (existingPlayers) {
        console.log('Demo players already exist');
        return;
    }

    const demoPlayers = [
        {
            id: 1,
            name: 'Nihad Qasimov',
            age: 30,
            position: 'gk',
            city: 'Bakı',
            currentTeam: 'Qarabag Legends',
            matchesPlayed: 67,
            goals: 5,
            assists: 8,
            rating: 4.9,
            lookingForTeam: false,
            createdAt: new Date('2020-01-15').toISOString()
        },
        {
            id: 2,
            name: 'Elvin Hüseynov',
            age: 28,
            position: 'df',
            city: 'Gəncə',
            currentTeam: 'Gəncə FC',
            matchesPlayed: 58,
            goals: 2,
            assists: 6,
            rating: 4.8,
            lookingForTeam: false,
            createdAt: new Date('2021-01-01').toISOString()
        },
        {
            id: 3,
            name: 'Tural Məmmədov',
            age: 26,
            position: 'mf',
            city: 'Bakı',
            currentTeam: 'FC Bakı',
            matchesPlayed: 45,
            goals: 18,
            assists: 15,
            rating: 4.7,
            lookingForTeam: false,
            createdAt: new Date('2022-01-01').toISOString()
        }
    ];

    localStorage.setItem('players', JSON.stringify(demoPlayers));
    console.log('Demo players created successfully');
}

// Create demo teams on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        createDemoTeams();
        createDemoPlayerHistory();
        createDemoPlayers();
    });
} else {
    createDemoTeams();
    createDemoPlayerHistory();
    createDemoPlayers();
}
