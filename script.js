
/* =========================================================
   TEMU BALLERS — WEBSITE FUNCTIONALITY
   File: script.js
   ========================================================= */

"use strict";

/* ---------- 1. TEAM DATA ---------- */

const teamData = {
  name: "Temu Ballers",

  rules: [
    {
      title: "Yellow card",
      description: "One shot under the team rules."
    },
    {
      title: "Green card",
      description: "One shot under the team rules."
    },
    {
      title: "Own goal",
      description: "One shot under the team rules."
    },
    {
      title: "Not scoring",
      description: "One shot under the team rules."
    },
    {
      title: "Missing an open goal",
      description: "One shot under the team rules."
    },
    {
      title: "Finishing below 4th",
      description: "Everyone takes a shot."
    },
    {
      title: "Injury rule",
      description: "Only applies if the team has agreed to this rule."
    }
  ],

  players: [
    {
      name: "Josh",
      goals: 2,
      assists: null,
      appearances: 2,
      cards: { green: 0, yellow: 0 }
    },
    {
      name: "Ethan",
      goals: 0,
      assists: 1,
      appearances: 2,
      cards: { green: 1, yellow: 0 }
    },
    {
      name: "Jose",
      goals: 0,
      assists: 2,
      appearances: 2,
      cards: { green: 0, yellow: 0 }
    },
    {
      name: "Abdou",
      goals: 0,
      assists: null,
      appearances: 2,
      cards: { green: 0, yellow: 0 }
    },
    {
      name: "Adam",
      goals: 2,
      assists: null,
      appearances: 2,
      cards: { green: 2, yellow: 0 }
    },
    {
      name: "Alex",
      goals: 0,
      assists: null,
      appearances: null,
      cards: { green: 0, yellow: 0 }
    },
    {
      name: "Brandon",
      goals: 0,
      assists: null,
      appearances: 2,
      cards: { green: 0, yellow: 0 }
    },
    {
      name: "Lathi",
      goals: 0,
      assists: null,
      appearances: null,
      cards: { green: 0, yellow: 0 }
    },
    {
      name: "Zach",
      goals: 1,
      assists: null,
      appearances: 2,
      cards: { green: 1, yellow: 1 }
    },
    {
      name: "Manu",
      goals: 0,
      assists: null,
      appearances: null,
      cards: { green: 0, yellow: 0 }
    }
  ],

  results: [
    {
      date: null,
      opponent: "Dark Knights",
      teamScore: 3,
      opponentScore: 3,
      scorers: ["Josh", "Zach", "Adam"]
    },
    {
      date: null,
      opponent: "FC Sparta",
      teamScore: 2,
      opponentScore: 1,
      scorers: ["Josh", "Adam"]
    }
  ],

  fixtures: [
    {
      date: "2026-11-04",
      time: "18:15",
      opponent: "Superstrikers",
      venue: "Fairview Action Arena"
    },
    {
      date: "2026-11-11",
      time: "20:30",
      opponent: "Depot Utd FC",
      venue: "Fairview Action Arena"
    },
    {
      date: "2026-11-18",
      time: "19:00",
      opponent: "Von-Boeties FC",
      venue: "Fairview Action Arena"
    },
    {
      date: "2026-11-25",
      time: "18:15",
      opponent: "Teknology FC",
      venue: "Fairview Action Arena"
    },
    {
      date: "2026-12-02",
      time: "19:45",
      opponent: "The Unknowns",
      venue: "Fairview Action Arena"
    },
    {
      date: "2026-12-09",
      time: "21:15",
      opponent: "Quality Control",
      venue: "Fairview Action Arena"
    },
    {
      date: "2026-12-16",
      time: "20:30",
      opponent: "Toray Logistics",
      venue: "Fairview Action Arena"
    }
  ],

  injuries: [
    {
      player: "Alex",
      description: "Ear injury",
      status: "Reported"
    }
  ],

  teamOfWeek: {
    gameweek: 1,
    player: "Jose"
  }
};


/* ---------- 2. HELPER FUNCTIONS ---------- */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function displayValue(value) {
  return value === null || value === undefined || value === ""
    ? "—"
    : String(value);
}

function formatDate(dateString) {
  if (!dateString) {
    return "Date not recorded";
  }

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Date not recorded";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatShortDate(dateString) {
  if (!dateString) {
    return "—";
  }

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "short"
  }).format(date);
}

function formatDifference(value) {
  return value > 0 ? `+${value}` : String(value);
}

function getResultType(result) {
  if (result.teamScore > result.opponentScore) {
    return "win";
  }

  if (result.teamScore < result.opponentScore) {
    return "loss";
  }

  return "draw";
}

function getResultLetter(result) {
  const type = getResultType(result);

  if (type === "win") return "W";
  if (type === "loss") return "L";

  return "D";
}


/* ---------- 3. CALCULATE TEAM STATISTICS ---------- */

function calculateTeamStats() {
  const played = teamData.results.length;

  const wins = teamData.results.filter(
    result => getResultType(result) === "win"
  ).length;

  const draws = teamData.results.filter(
    result => getResultType(result) === "draw"
  ).length;

  const losses = teamData.results.filter(
    result => getResultType(result) === "loss"
  ).length;

  const goalsFor = teamData.results.reduce(
    (total, result) => total + result.teamScore,
    0
  );

  const goalsAgainst = teamData.results.reduce(
    (total, result) => total + result.opponentScore,
    0
  );

  const goalDifference = goalsFor - goalsAgainst;

  const points = wins * 3 + draws;

  const greenCards = teamData.players.reduce(
    (total, player) => total + player.cards.green,
    0
  );

  const yellowCards = teamData.players.reduce(
    (total, player) => total + player.cards.yellow,
    0
  );

  return {
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    points,
    greenCards,
    yellowCards,
    totalCards: greenCards + yellowCards,
    totalShots: greenCards + yellowCards,
    injuryCount: teamData.injuries.length,
    playerCount: teamData.players.length
  };
}


/* ---------- 4. OVERVIEW ---------- */

function renderOverview() {
  const stats = calculateTeamStats();

  setText("matchesPlayed", stats.played);
  setText("points", stats.points);
  setText("goalsFor", stats.goalsFor);
  setText("goalDifference", formatDifference(stats.goalDifference));

  setText("heroGoals", stats.goalsFor);
  setText(
    "heroGoalDifference",
    formatDifference(stats.goalDifference)
  );

  setText(
    "heroRecord",
    `${stats.wins}–${stats.draws}–${stats.losses}`
  );

  setText("winsCount", stats.wins);
  setText("drawsCount", stats.draws);
  setText("lossesCount", stats.losses);

  setText("greenCards", stats.greenCards);
  setText("yellowCards", stats.yellowCards);
  setText("totalShots", stats.totalShots);
  setText("injuryCount", stats.injuryCount);

  setText("playerCount", `${stats.playerCount} players`);
  setText(
    "resultsCount",
    `${stats.played} ${stats.played === 1 ? "match" : "matches"}`
  );

  renderFormGuide();
}


/* ---------- 5. RECENT FORM ---------- */

function renderFormGuide() {
  const container = $("#formGuide");

  if (!container) return;

  const recentResults = [...teamData.results].reverse();

  if (recentResults.length === 0) {
    container.innerHTML = '<span class="empty-state">No results yet.</span>';
    return;
  }

  container.innerHTML = recentResults.map(result => {
    const type = getResultType(result);
    const letter = getResultLetter(result);

    const labels = {
      win: "Win",
      draw: "Draw",
      loss: "Loss"
    };

    return `
      <span
        class="form-result form-${type}"
        title="${labels[type]} vs ${escapeHTML(result.opponent)}"
        aria-label="${labels[type]} against ${escapeHTML(result.opponent)}"
      >${letter}</span>
    `;
  }).join("");
}


/* ---------- 6. MATCH RESULTS ---------- */

function renderResults() {
  const container = $("#resultsList");

  if (!container) return;

  if (teamData.results.length === 0) {
    container.innerHTML = `
      <div class="panel">
        <p class="empty-state">No results have been recorded yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = [...teamData.results]
    .reverse()
    .map(result => {
      const type = getResultType(result);
      const status = {
        win: "Win",
        draw: "Draw",
        loss: "Loss"
      }[type];

      const scorers = result.scorers.length
        ? result.scorers.map(escapeHTML).join(", ")
        : "Not recorded";

      return `
        <article class="result-card">
          <div class="result-date">
            <span class="result-date-day">${escapeHTML(formatShortDate(result.date))}</span>
            <span>${escapeHTML(formatDate(result.date))}</span>
          </div>

          <div class="result-match">
            <span class="team-name">Temu Ballers</span>

            <div class="score-display" aria-label="${result.teamScore} to ${result.opponentScore}">
              <strong>${result.teamScore}</strong>
              <span>–</span>
              <strong>${result.opponentScore}</strong>
            </div>

            <span class="opponent-name">${escapeHTML(result.opponent)}</span>
          </div>

          <span class="result-status status-${type}">${status}</span>

          <div class="result-scorers">
            <span>Scorers</span>
            <p>${scorers}</p>
          </div>
        </article>
      `;
    })
    .join("");
}


/* ---------- 7. PLAYER CARDS ---------- */

function renderPlayers(searchTerm = "") {
  const container = $("#playersGrid");

  if (!container) return;

  const query = searchTerm.trim().toLowerCase();

  const filteredPlayers = teamData.players.filter(player =>
    player.name.toLowerCase().includes(query)
  );

  const count = $("#playerCount");

  if (count) {
    count.textContent =
      `${filteredPlayers.length} ${filteredPlayers.length === 1 ? "player" : "players"}`;
  }

  const emptyMessage = $("#noPlayersMessage");

  if (emptyMessage) {
    emptyMessage.hidden = filteredPlayers.length !== 0;
  }

  container.innerHTML = filteredPlayers.map((player, index) => {
    const initials = player.name
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return `
      <article
        class="player-card"
        data-player="${escapeHTML(player.name)}"
        tabindex="0"
        role="button"
        aria-label="View ${escapeHTML(player.name)}'s profile"
      >
        <div class="player-card-top">
          <span class="player-initials">${escapeHTML(initials)}</span>
          <span class="player-number">${String(teamData.players.indexOf(player) + 1).padStart(2, "0")}</span>
        </div>

        <h3>${escapeHTML(player.name)}</h3>
        <p class="player-role">Player</p>

        <div class="player-card-stats">
          <div>
            <strong>${player.goals}</strong>
            <span>Goals</span>
          </div>
          <div>
            <strong>${displayValue(player.appearances)}</strong>
            <span>Apps</span>
          </div>
        </div>
      </article>
    `;
  }).join("");
}


/* ---------- 8. PLAYER SEARCH ---------- */

function setupPlayerSearch() {
  const search = $("#playerSearch");

  if (!search) return;

  search.addEventListener("input", event => {
    renderPlayers(event.target.value);
  });
}


/* ---------- 9. PLAYER PROFILE DIALOG ---------- */

function openPlayerProfile(playerName) {
  const player = teamData.players.find(
    item => item.name === playerName
  );

  if (!player) return;

  const dialog = $("#playerDialog");
  const profile = $("#playerProfile");

  if (!dialog || !profile) return;

  const assists = displayValue(player.assists);
  const appearances = displayValue(player.appearances);
  const cards = player.cards.green + player.cards.yellow;

  profile.innerHTML = `
    <h2>${escapeHTML(player.name)}</h2>
    <p>Temu Ballers squad member</p>

    <div class="profile-stats">
      <div class="profile-stat">
        <strong>${player.goals}</strong>
        <span>Goals scored</span>
      </div>

      <div class="profile-stat">
        <strong>${assists}</strong>
        <span>Assists</span>
      </div>

      <div class="profile-stat">
        <strong>${appearances}</strong>
        <span>Appearances</span>
      </div>

      <div class="profile-stat">
        <strong>${cards}</strong>
        <span>Total cards</span>
      </div>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function setupPlayerProfiles() {
  const playersGrid = $("#playersGrid");
  const dialog = $("#playerDialog");
  const closeButton = $("#closeDialog");

  if (playersGrid) {
    playersGrid.addEventListener("click", event => {
      const card = event.target.closest("[data-player]");

      if (!card) return;

      openPlayerProfile(card.dataset.player);
    });

    playersGrid.addEventListener("keydown", event => {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      const card = event.target.closest("[data-player]");

      if (!card) return;

      event.preventDefault();
      openPlayerProfile(card.dataset.player);
    });
  }

  if (closeButton && dialog) {
    closeButton.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });
  }

  if (dialog) {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;

      const bounds = dialog.getBoundingClientRect();

      const clickedOutside =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;

      if (clickedOutside && typeof dialog.close === "function") {
        dialog.close();
      }
    });
  }
}


/* ---------- 10. PLAYER LEADERBOARDS ---------- */

function renderLeaderboard(containerId, statistic, label) {
  const container = document.getElementById(containerId);

  if (!container) return;

  const rankedPlayers = teamData.players
    .filter(player => typeof player[statistic] === "number")
    .filter(player => player[statistic] > 0)
    .sort((a, b) => {
      if (b[statistic] !== a[statistic]) {
        return b[statistic] - a[statistic];
      }

      return a.name.localeCompare(b.name);
    });

  if (rankedPlayers.length === 0) {
    container.innerHTML = `
      <p class="empty-state">No ${escapeHTML(label.toLowerCase())} recorded yet.</p>
    `;
    return;
  }

  container.innerHTML = rankedPlayers.map((player, index) => {
    const value = player[statistic];

    return `
      <div class="leaderboard-row">
        <span class="leader-rank">${String(index + 1).padStart(2, "0")}</span>
        <strong>${escapeHTML(player.name)}</strong>
        <span class="leader-value">
          ${value} ${value === 1 ? label.slice(0, -1).toLowerCase() : label.toLowerCase()}
        </span>
      </div>
    `;
  }).join("");
}

function renderLeaderboards() {
  renderLeaderboard("goalsLeaderboard", "goals", "Goals");
  renderLeaderboard("assistsLeaderboard", "assists", "Assists");
}


/* ---------- 11. FULL SQUAD STATISTICS TABLE ---------- */

function renderStatsTable() {
  const container = $("#statsTable");

  if (!container) return;

  container.innerHTML = teamData.players.map(player => `
    <tr>
      <td>${escapeHTML(player.name)}</td>
      <td>${displayValue(player.appearances)}</td>
      <td>${player.goals}</td>
      <td>${displayValue(player.assists)}</td>
    </tr>
  `).join("");
}


/* ---------- 12. TEAM OF THE WEEK ---------- */

function renderTeamOfWeek() {
  setText("teamOfWeekPlayer", teamData.teamOfWeek.player);

  const label = $(".totw-label");

  if (label) {
    label.textContent = `GAMEWEEK ${teamData.teamOfWeek.gameweek}`;
  }
}


/* ---------- 13. FIXTURES ---------- */

function renderFixtures() {
  const container = $("#fixturesTable");

  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  container.innerHTML = teamData.fixtures.map(fixture => {
    const fixtureDate = new Date(`${fixture.date}T00:00:00`);
    const isPast = fixtureDate < today;

    return `
      <tr>
        <td>${escapeHTML(formatDate(fixture.date))}</td>
        <td>${escapeHTML(fixture.time)}</td>
        <td>${escapeHTML(fixture.opponent)}</td>
        <td>${escapeHTML(fixture.venue)}</td>
        <td>
          <span class="table-status">
            ${isPast ? "Scheduled — verify result" : "Upcoming"}
          </span>
        </td>
      </tr>
    `;
  }).join("");
}


/* ---------- 14. DISCIPLINE REGISTER ---------- */

function renderDiscipline() {
  const container = $("#finesTable");

  if (!container) return;

  const playersWithCards = teamData.players.filter(player =>
    player.cards.green > 0 || player.cards.yellow > 0
  );

  if (playersWithCards.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="4">No cards recorded.</td>
      </tr>
    `;
    return;
  }

  container.innerHTML = playersWithCards.map(player => `
    <tr>
      <td>${escapeHTML(player.name)}</td>
      <td>${player.cards.green}</td>
      <td>${player.cards.yellow}</td>
      <td>—</td>
    </tr>
  `).join("");
}


/* ---------- 15. INJURY REGISTER ---------- */

function renderInjuries() {
  const container = $("#injuriesList");

  if (!container) return;

  if (teamData.injuries.length === 0) {
    container.innerHTML = `
      <p class="empty-state">No injuries recorded.</p>
    `;
    return;
  }

  container.innerHTML = teamData.injuries.map(injury => `
    <div class="injury-row">
      <span class="injury-indicator"></span>

      <div>
        <strong>${escapeHTML(injury.player)}</strong>
        <p>${escapeHTML(injury.description)}</p>
      </div>

      <span class="injury-status">${escapeHTML(injury.status)}</span>
    </div>
  `).join("");
}


/* ---------- 16. TEAM RULES ---------- */

function renderRules() {
  const container = $("#rulesList");

  if (!container) return;

  container.innerHTML = teamData.rules.map((rule, index) => `
    <article class="rule-card${index === teamData.rules.length - 1 ? " rule-card-wide" : ""}">
      <span class="rule-number">${String(index + 1).padStart(2, "0")}</span>

      <div>
        <h3>${escapeHTML(rule.title)}</h3>
        <p>${escapeHTML(rule.description)}</p>
      </div>
    </article>
  `).join("");
}


/* ---------- 17. MOBILE NAVIGATION ---------- */

function setupMobileNavigation() {
  const toggle = $("#menuToggle");
  const navigation = $("#mainNav");

  if (!toggle || !navigation) return;

  function closeMenu() {
    navigation.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  toggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  $$(".nav-link", navigation).forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", event => {
    if (
      !navigation.contains(event.target) &&
      !toggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}


/* ---------- 18. ACTIVE NAVIGATION LINK ---------- */

function setupActiveNavigation() {
  const links = $$(".nav-link");
  const sections = links
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(entries => {
    const visibleSections = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleSections.length === 0) return;

    const currentId = visibleSections[0].target.id;

    links.forEach(link => {
      const isActive = link.getAttribute("href") === `#${currentId}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-18% 0px -68% 0px",
    threshold: [0, 0.1, 0.25, 0.5]
  });

  sections.forEach(section => observer.observe(section));
}


/* ---------- 19. FOOTER YEAR ---------- */

function renderFooter() {
  setText("currentYear", new Date().getFullYear());
}


/* ---------- 20. INITIALISE WEBSITE ---------- */

function initialiseWebsite() {
  renderOverview();
  renderResults();
  renderPlayers();
  renderLeaderboards();
  renderStatsTable();
  renderTeamOfWeek();
  renderFixtures();
  renderDiscipline();
  renderInjuries();
  renderRules();
  renderFooter();

  setupPlayerSearch();
  setupPlayerProfiles();
  setupMobileNavigation();
  setupActiveNavigation();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialiseWebsite);
} else {
  initialiseWebsite();
}
