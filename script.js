"use strict";

/* =========================================================
   TEMU BALLERS — SHARED CLUB DATA
   Edit this object when player or match information changes.
   ========================================================= */

const teamData = {
  clubName: "Temu Ballers",
  season: "2026",

  players: [
    { name: "Josh",     goals: 2, assists: 0, appearances: 2, greenCards: 0, yellowCards: 0 },
    { name: "Ethan",    goals: 0, assists: 1, appearances: 2, greenCards: 1, yellowCards: 0 },
    { name: "Jose",     goals: 0, assists: 2, appearances: 2, greenCards: 0, yellowCards: 0 },
    { name: "Abdou",    goals: 0, assists: 0, appearances: 2, greenCards: 0, yellowCards: 0 },
    { name: "Adam",     goals: 2, assists: 0, appearances: 2, greenCards: 2, yellowCards: 0 },
    { name: "Alex",     goals: 0, assists: 0, appearances: 0, greenCards: 0, yellowCards: 0 },
    { name: "Brandon",  goals: 0, assists: 0, appearances: 2, greenCards: 0, yellowCards: 0 },
    { name: "Lathi",    goals: 0, assists: 0, appearances: 0, greenCards: 0, yellowCards: 0 },
    { name: "Zach",     goals: 1, assists: 0, appearances: 2, greenCards: 1, yellowCards: 1 },
    { name: "Manu",     goals: 0, assists: 0, appearances: 0, greenCards: 0, yellowCards: 0 }
  ],

  results: [
    {
      opponent: "Dark Knights",
      teamGoals: 3,
      opponentGoals: 3,
      scorers: ["Josh", "Zach", "Adam"],
      date: null
    },
    {
      opponent: "FC Sparta",
      teamGoals: 2,
      opponentGoals: 1,
      scorers: ["Josh", "Adam"],
      date: null
    }
  ],

  fixtures: [
    { date: "2026-11-04", time: "18:15", opponent: "Superstrikers", venue: "Fairview Action Arena" },
    { date: "2026-11-11", time: "20:30", opponent: "Depot Utd FC", venue: "Fairview Action Arena" },
    { date: "2026-11-18", time: "19:00", opponent: "Von-Boeties FC", venue: "Fairview Action Arena" },
    { date: "2026-11-25", time: "18:15", opponent: "Teknology FC", venue: "Fairview Action Arena" },
    { date: "2026-12-02", time: "19:45", opponent: "The Unknowns", venue: "Fairview Action Arena" },
    { date: "2026-12-09", time: "21:15", opponent: "Quality Control", venue: "Fairview Action Arena" },
    { date: "2026-12-16", time: "20:30", opponent: "Toray Logistics", venue: "Fairview Action Arena" }
  ],

  injuries: [
    { player: "Alex", injury: "Ear injury", status: "Reported" }
  ],

  teamOfWeek: {
    player: "Jose",
    gameweek: 1
  },

  rules: [
    "A yellow card results in one shot.",
    "A green card results in one shot.",
    "An own goal results in one shot.",
    "Not scoring results in one shot.",
    "Missing an open goal results in one shot.",
    "Finishing below fourth place means everyone takes a shot.",
    "The injury rule applies only if the team agrees."
  ]
};

/* =========================================================
   HELPERS
   ========================================================= */

const $ = (selector, root = document) => root.querySelector(selector);

const escapeHTML = (value) =>
  String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);

const number = value => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

const playerInitials = name =>
  String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join("");

const getPlayer = name =>
  teamData.players.find(player => player.name === name);

function getPlayerStats(player) {
  const goals = number(player.goals);
  const assists = number(player.assists);

  return {
    appearances: number(player.appearances),
    goals,
    assists,
    contributions: goals + assists,
    greenCards: number(player.greenCards),
    yellowCards: number(player.yellowCards)
  };
}

function getResultsStats() {
  const played = teamData.results.length;

  const wins = teamData.results.filter(
    match => match.teamGoals > match.opponentGoals
  ).length;

  const draws = teamData.results.filter(
    match => match.teamGoals === match.opponentGoals
  ).length;

  const losses = teamData.results.filter(
    match => match.teamGoals < match.opponentGoals
  ).length;

  const goalsFor = teamData.results.reduce(
    (total, match) => total + number(match.teamGoals), 0
  );

  const goalsAgainst = teamData.results.reduce(
    (total, match) => total + number(match.opponentGoals), 0
  );

  return {
    played,
    wins,
    draws,
    losses,
    points: wins * 3 + draws,
    goalsFor,
    goalsAgainst,
    goalDifference: goalsFor - goalsAgainst
  };
}

function formatDate(dateString, options = {}) {
  if (!dateString) return "Date not recorded";

  // Construct a local date from the date components to avoid
  // displaying the previous day in certain time zones.
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    ...(options.year ? { year: "numeric" } : {})
  });
}

function getFormResult(match) {
  if (match.teamGoals > match.opponentGoals) return "win";
  if (match.teamGoals < match.opponentGoals) return "loss";
  return "draw";
}

function getFormLabel(result) {
  return result === "win" ? "WIN" : result === "loss" ? "LOSS" : "DRAW";
}

function sortedPlayers(metric = "goals") {
  return [...teamData.players].sort((a, b) => {
    const statsA = getPlayerStats(a);
    const statsB = getPlayerStats(b);

    return (
      statsB[metric] - statsA[metric] ||
      statsB.appearances - statsA.appearances ||
      a.name.localeCompare(b.name)
    );
  });
}

function nextFixture() {
  // The fixture list is a scheduled list. The first item is
  // treated as the next fixture until the list is updated.
  return teamData.fixtures[0] || null;
}

function resultScorers(match) {
  return match.scorers.length
    ? match.scorers.map(escapeHTML).join(", ")
    : "No scorers recorded";
}

/* =========================================================
   SHARED HEADER AND FOOTER
   ========================================================= */

function renderHeader() {
  const currentPage = document.body.dataset.page || "home";

  const links = [
    { page: "home", label: "Home", href: "index.html" },
    { page: "matches", label: "Matches", href: "matches.html" },
    { page: "squad", label: "Squad", href: "squad.html" },
    { page: "statistics", label: "Statistics", href: "statistics.html" },
    { page: "records", label: "Club Records", href: "records.html" }
  ];

  const mount = $("#site-header");
  if (!mount) return;

  mount.innerHTML = `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="index.html" aria-label="Temu Ballers home">
          <span class="brand-mark">TB</span>
          <span class="brand-copy">
            <span class="brand-name">TEMU BALLERS</span>
            <span class="brand-tagline">THE CLUB. THE STANDARD.</span>
          </span>
        </a>

        <button class="menu-toggle" type="button"
          aria-label="Toggle navigation" aria-expanded="false"
          aria-controls="main-navigation">☰</button>

        <nav class="main-nav" id="main-navigation" aria-label="Main navigation">
          ${links.map(link => `
            <a class="nav-link ${currentPage === link.page ? "active" : ""}"
              href="${link.href}"
              ${currentPage === link.page ? 'aria-current="page"' : ""}>
              ${link.label}
            </a>
          `).join("")}
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  const mount = $("#site-footer");
  if (!mount) return;

  mount.innerHTML = `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <a class="brand" href="index.html">
            <span class="brand-mark">TB</span>
            <span class="brand-copy">
              <span class="brand-name">TEMU BALLERS</span>
              <span class="brand-tagline">THE CLUB. THE STANDARD.</span>
            </span>
          </a>
          <p class="footer-copy">
            © ${new Date().getFullYear()} Temu Ballers.
            All rights reserved.
          </p>
        </div>
        <nav class="footer-links" aria-label="Footer navigation">
          <a href="matches.html">Matches</a>
          <a href="squad.html">Squad</a>
          <a href="statistics.html">Statistics</a>
          <a href="records.html">Club Records</a>
        </nav>
      </div>
    </footer>
  `;
}

/* =========================================================
   REUSABLE COMPONENTS
   ========================================================= */

function pageHeading(eyebrow, title, description) {
  return `
    <section class="page-heading">
      <div>
        <div class="eyebrow">${escapeHTML(eyebrow)}</div>
        <h1>${escapeHTML(title)}</h1>
        <p>${escapeHTML(description)}</p>
      </div>
    </section>
  `;
}

function sectionHeading(title, description, linkText, linkHref) {
  return `
    <div class="section-heading">
      <div>
        <h2>${escapeHTML(title)}</h2>
        ${description ? `<p>${escapeHTML(description)}</p>` : ""}
      </div>
      ${linkText && linkHref
        ? `<a class="text-link" href="${linkHref}">${escapeHTML(linkText)} →</a>`
        : ""}
    </div>
  `;
}

function statCard(label, value, note = "", highlight = false) {
  return `
    <article class="stat-card ${highlight ? "highlight" : ""}">
      <span class="stat-label">${escapeHTML(label)}</span>
      <strong class="stat-value">${escapeHTML(value)}</strong>
      ${note ? `<span class="stat-note">${escapeHTML(note)}</span>` : ""}
    </article>
  `;
}

function playerCard(player) {
  const stats = getPlayerStats(player);

  return `
    <button class="player-card" type="button"
      data-player="${escapeHTML(player.name)}"
      aria-label="View ${escapeHTML(player.name)}'s profile">
      <div class="player-card-top">
        <span class="player-initials">${escapeHTML(playerInitials(player.name))}</span>
        <span class="player-number">${String(teamData.players.indexOf(player) + 1).padStart(2, "0")}</span>
      </div>
      <div class="player-card-body">
        <h3 class="player-card-name">${escapeHTML(player.name)}</h3>
        <div class="player-card-subtitle">Temu Ballers squad</div>
        <div class="player-mini-stats">
          <div class="player-mini-stat">
            <strong>${stats.appearances}</strong>
            <span>Apps</span>
          </div>
          <div class="player-mini-stat">
            <strong>${stats.goals}</strong>
            <span>Goals</span>
          </div>
          <div class="player-mini-stat">
            <strong>${stats.assists}</strong>
            <span>Assists</span>
          </div>
        </div>
      </div>
    </button>
  `;
}

function resultCard(match) {
  const outcome = getFormResult(match);

  return `
    <article class="result-card">
      <div class="result-status ${outcome}">${getFormLabel(outcome)}</div>
      <div>
        <div class="result-opponent">${escapeHTML(match.opponent)}</div>
        <div class="result-meta">
          ${match.date ? formatDate(match.date, { year: true }) : "Date not recorded"}
        </div>
        <div class="result-meta">Scorers: ${resultScorers(match)}</div>
      </div>
      <div class="result-score">${number(match.teamGoals)}–${number(match.opponentGoals)}</div>
    </article>
  `;
}

function fixtureCard(fixture) {
  const parts = fixture.date.split("-");
  const day = Number(parts[2]);
  const month = new Date(Number(parts[0]), Number(parts[1]) - 1, 1)
    .toLocaleDateString("en-ZA", { month: "short" });

  return `
    <article class="fixture-card">
      <div class="fixture-date">
        <span class="day">${day}</span>
        <span class="month">${escapeHTML(month)}</span>
      </div>
      <div>
        <div class="fixture-opponent">${escapeHTML(fixture.opponent)}</div>
        <div class="fixture-meta">${escapeHTML(fixture.venue)}</div>
        <div class="fixture-meta">${formatDate(fixture.date, { year: true })}</div>
      </div>
      <div class="fixture-time">${escapeHTML(fixture.time)}</div>
    </article>
  `;
}

function leaderboardRows(metric, limit = Infinity) {
  return sortedPlayers(metric).slice(0, limit).map((player, index) => {
    const stats = getPlayerStats(player);

    return `
      <div class="leaderboard-row">
        <span class="leaderboard-rank">${String(index + 1).padStart(2, "0")}</span>
        <div>
          <div class="leaderboard-player">${escapeHTML(player.name)}</div>
          <span class="leaderboard-note">${stats.appearances} appearances</span>
        </div>
        <span class="leaderboard-value">${stats[metric]}</span>
      </div>
    `;
  }).join("");
}

function leaderboardPanel(title, metric, link = true) {
  return `
    <section class="panel panel-pad">
      <div class="panel-title">
        <h3>${escapeHTML(title)}</h3>
        ${link ? '<a class="text-link" href="statistics.html">FULL TABLE →</a>' : ""}
      </div>
      <div class="leaderboard">${leaderboardRows(metric)}</div>
    </section>
  `;
}

/* =========================================================
   HOME PAGE
   ========================================================= */

function renderHome() {
  const app = $("#app");
  const stats = getResultsStats();
  const latest = teamData.results[teamData.results.length - 1];
  const upcoming = nextFixture();

  app.innerHTML = `
    <section class="hero">
      <div class="hero-content">
        <div class="hero-label">Welcome to the club</div>
        <h1>OUR CLUB.<br><span>OUR GAME.</span></h1>
        <p class="hero-description">
          Every player counts. Every performance matters.
          Follow the Temu Ballers journey, from matchday results
          to the numbers behind every performance.
        </p>
        <div class="hero-actions">
          <a class="btn" href="matches.html">Match centre ↗</a>
          <a class="btn btn-secondary" href="squad.html">Meet the squad</a>
        </div>
      </div>
    </section>

    <section class="section">
      ${sectionHeading("THE SEASON SO FAR", "The numbers behind our campaign.", "FULL STATISTICS", "statistics.html")}
      <div class="stats-grid">
        ${statCard("Matches played", stats.played, "Recorded results")}
        ${statCard("Points", stats.points, `${stats.wins} wins · ${stats.draws} draws`, true)}
        ${statCard("Goals scored", stats.goalsFor, `${stats.goalsAgainst} conceded`)}
        ${statCard("Goal difference", stats.goalDifference > 0 ? `+${stats.goalDifference}` : stats.goalDifference, `${stats.wins}W · ${stats.draws}D · ${stats.losses}L`, true)}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("MATCH CENTRE", "Results and what's coming next.", "ALL MATCHES", "matches.html")}
      <div class="two-column">
        <section class="panel panel-pad">
          <div class="panel-title">
            <h3>Latest result</h3>
            <span class="tag tag-orange">FULL TIME</span>
          </div>
          ${latest ? resultCard(latest) : '<div class="empty-state">No match results recorded yet.</div>'}
        </section>

        <section class="panel panel-pad">
          <div class="panel-title">
            <h3>Next fixture</h3>
            <span class="tag">UPCOMING</span>
          </div>
          ${upcoming ? fixtureCard(upcoming) : '<div class="empty-state">No upcoming fixtures recorded.</div>'}
          <p class="muted" style="font-size:11px;margin:13px 0 0">
            Fixture details are based on the current schedule.
          </p>
        </section>
      </div>
    </section>

    <section class="section">
      ${sectionHeading("THE SQUAD", "Every player is part of the story.", "VIEW ALL PLAYERS", "squad.html")}
      <div class="player-grid">
        ${teamData.players.slice(0, 4).map(playerCard).join("")}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("PLAYER PERFORMANCE", "A snapshot of individual contributions.", "COMPLETE RANKINGS", "statistics.html")}
      <div class="two-column">
        ${leaderboardPanel("Goals leaderboard", "goals")}
        ${leaderboardPanel("Assists leaderboard", "assists")}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("CLUB RECORDS", "The details that keep the club organised.", "VIEW CLUB RECORDS", "records.html")}
      <div class="three-column">
        <article class="panel panel-pad">
          <div class="eyebrow">Discipline</div>
          <h3>Cards</h3>
          <p>Track recorded green and yellow cards across the squad.</p>
          <a class="text-link" href="records.html">VIEW RECORDS →</a>
        </article>
        <article class="panel panel-pad">
          <div class="eyebrow">Recognition</div>
          <h3>Team of the Week</h3>
          <p>Highlight a player's performance each gameweek.</p>
          <a class="text-link" href="records.html#team-of-the-week">VIEW FEATURE →</a>
        </article>
        <article class="panel panel-pad">
          <div class="eyebrow">Club management</div>
          <h3>Rules & injuries</h3>
          <p>Keep club rules and reported injuries together.</p>
          <a class="text-link" href="records.html">VIEW DETAILS →</a>
        </article>
      </div>
    </section>
  `;
}

/* =========================================================
   MATCHES PAGE
   ========================================================= */

function renderMatches() {
  const app = $("#app");
  const stats = getResultsStats();

  const reversedResults = [...teamData.results].reverse();

  app.innerHTML = `
    ${pageHeading("THE MATCH CENTRE", "MATCHES", "Every result. Every fixture. All in one place.")}

    <section class="section">
      ${sectionHeading("SEASON RECORD", "Temu Ballers match summary.")}
      <div class="stats-grid">
        ${statCard("Played", stats.played)}
        ${statCard("Wins", stats.wins, "3 points each", true)}
        ${statCard("Draws", stats.draws)}
        ${statCard("Losses", stats.losses)}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("RESULTS", "Recorded matches and their scorers.")}
      <div class="result-list">
        ${reversedResults.length
          ? reversedResults.map(resultCard).join("")
          : '<div class="empty-state">No match results recorded yet.</div>'}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("UPCOMING FIXTURES", "The current scheduled programme.")}
      <div class="fixture-list">
        ${teamData.fixtures.length
          ? teamData.fixtures.map(fixtureCard).join("")
          : '<div class="empty-state">No upcoming fixtures recorded.</div>'}
      </div>
    </section>
  `;
}

/* =========================================================
   SQUAD PAGE AND PLAYER PROFILES
   ========================================================= */

function renderSquad() {
  const app = $("#app");

  app.innerHTML = `
    ${pageHeading("THE PEOPLE BEHIND THE BADGE", "THE SQUAD", "Every player. Every contribution. One club.")}

    <div class="toolbar">
      <div class="search-box">
        <input id="player-search" type="search"
          placeholder="Search players by name..."
          aria-label="Search players by name" autocomplete="off">
      </div>
      <span id="player-count" class="tag">${teamData.players.length} players</span>
    </div>

    <section class="section" style="padding-top:0">
      <div class="player-grid" id="players-grid">
        ${teamData.players.map(playerCard).join("")}
      </div>
      <div class="empty-state" id="no-players-message" hidden>
        No players match your search.
      </div>
    </section>

    <section class="section">
      ${sectionHeading("SQUAD TOTALS", "The combined figures recorded for the team.")}
      <div class="stats-grid">
        ${statCard("Registered players", teamData.players.length)}
        ${statCard("Goals", teamData.players.reduce((n, p) => n + getPlayerStats(p).goals, 0), "", true)}
        ${statCard("Assists", teamData.players.reduce((n, p) => n + getPlayerStats(p).assists, 0))}
        ${statCard("Appearances", teamData.players.reduce((n, p) => n + getPlayerStats(p).appearances, 0))}
      </div>
    </section>
  `;

  const search = $("#player-search");
  const grid = $("#players-grid");
  const count = $("#player-count");
  const empty = $("#no-players-message");

  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    const filtered = teamData.players.filter(player =>
      player.name.toLowerCase().includes(query)
    );

    grid.innerHTML = filtered.map(playerCard).join("");
    count.textContent = `${filtered.length} player${filtered.length === 1 ? "" : "s"}`;
    empty.hidden = filtered.length > 0;
  });
}

function openPlayerProfile(playerName) {
  const player = getPlayer(playerName);
  const dialog = $("#player-dialog");
  const mount = $("#player-profile");

  if (!player || !dialog || !mount) return;

  const stats = getPlayerStats(player);

  mount.innerHTML = `
    <div class="profile-hero">
      <span class="player-initials">${escapeHTML(playerInitials(player.name))}</span>
      <div>
        <div class="eyebrow">Temu Ballers player</div>
        <h2>${escapeHTML(player.name)}</h2>
        <span class="tag tag-orange">SQUAD MEMBER</span>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-stat-grid">
        <div class="profile-stat"><strong>${stats.appearances}</strong><span>Appearances</span></div>
        <div class="profile-stat"><strong>${stats.goals}</strong><span>Goals</span></div>
        <div class="profile-stat"><strong>${stats.assists}</strong><span>Assists</span></div>
        <div class="profile-stat"><strong>${stats.contributions}</strong><span>Contributions</span></div>
        <div class="profile-stat"><strong>${stats.greenCards}</strong><span>Green cards</span></div>
        <div class="profile-stat"><strong>${stats.yellowCards}</strong><span>Yellow cards</span></div>
      </div>
      <p class="muted" style="font-size:11px;margin:18px 0 0">
        Profile figures reflect the current club records.
      </p>
      <a class="btn btn-secondary" style="margin-top:16px" href="statistics.html">
        View full statistics
      </a>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

/* =========================================================
   STATISTICS PAGE
   ========================================================= */

function renderStatistics() {
  const app = $("#app");

  app.innerHTML = `
    ${pageHeading("THE NUMBERS BEHIND THE GAME", "STATISTICS", "Complete squad rankings and individual performance.")}

    <section class="section">
      ${sectionHeading("SQUAD OVERVIEW", "Every registered player is included.")}
      <div class="stats-grid">
        ${statCard("Players", teamData.players.length)}
        ${statCard("Team goals", teamData.players.reduce((n, p) => n + getPlayerStats(p).goals, 0), "", true)}
        ${statCard("Team assists", teamData.players.reduce((n, p) => n + getPlayerStats(p).assists, 0))}
        ${statCard("Appearances", teamData.players.reduce((n, p) => n + getPlayerStats(p).appearances, 0))}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("SQUAD LEAGUE TABLE", "Sort the rankings or search for a player.")}
      <div class="toolbar">
        <div class="search-box">
          <input id="stats-search" type="search"
            placeholder="Search the statistics table..."
            aria-label="Search statistics by player" autocomplete="off">
        </div>
        <select id="stats-sort" class="control-select" aria-label="Sort statistics">
          <option value="goals">Sort: Goals</option>
          <option value="assists">Sort: Assists</option>
          <option value="appearances">Sort: Appearances</option>
          <option value="contributions">Sort: Contributions</option>
          <option value="name">Sort: Name</option>
        </select>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th class="numeric"><button class="sort-button" data-sort="appearances">Apps ↕</button></th>
              <th class="numeric"><button class="sort-button" data-sort="goals">Goals ↕</button></th>
              <th class="numeric"><button class="sort-button" data-sort="assists">Assists ↕</button></th>
              <th class="numeric"><button class="sort-button" data-sort="contributions">Contrib. ↕</button></th>
              <th class="numeric">Green</th>
              <th class="numeric">Yellow</th>
            </tr>
          </thead>
          <tbody id="stats-table-body"></tbody>
        </table>
      </div>
      <p class="table-footnote">
        Values display as 0 when no figure is currently recorded.
        Contributions are goals plus assists. Rankings use the selected
        metric, with appearances and player name as tie-breakers.
      </p>
    </section>

    <section class="section">
      ${sectionHeading("INDIVIDUAL LEADERBOARDS", "Every squad member appears, including players on zero.")}
      <div class="two-column">
        ${leaderboardPanel("Goals leaderboard", "goals", false)}
        ${leaderboardPanel("Assists leaderboard", "assists", false)}
      </div>
    </section>
  `;

  let activeSort = "goals";
  let query = "";

  const tbody = $("#stats-table-body");
  const search = $("#stats-search");
  const sortSelect = $("#stats-sort");

  function drawTable() {
    let players = [...teamData.players].filter(player =>
      player.name.toLowerCase().includes(query)
    );

    if (activeSort === "name") {
      players.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      players.sort((a, b) => {
        const A = getPlayerStats(a);
        const B = getPlayerStats(b);

        return B[activeSort] - A[activeSort]
          || B.appearances - A.appearances
          || a.name.localeCompare(b.name);
      });
    }

    tbody.innerHTML = players.map((player, index) => {
      const stats = getPlayerStats(player);

      return `
        <tr class="${index === 0 ? "table-top-row" : ""}">
          <td class="rank-cell">${index + 1}</td>
          <td>
            <button class="table-player-button"
              type="button" data-player="${escapeHTML(player.name)}">
              ${escapeHTML(player.name)}
            </button>
          </td>
          <td class="numeric">${stats.appearances}</td>
          <td class="numeric">${stats.goals}</td>
          <td class="numeric">${stats.assists}</td>
          <td class="numeric">${stats.contributions}</td>
          <td class="numeric">${stats.greenCards}</td>
          <td class="numeric">${stats.yellowCards}</td>
        </tr>
      `;
    }).join("");

    if (!players.length) {
      tbody.innerHTML = `
        <tr><td colspan="8" style="text-align:center;padding:25px">
          No players match your search.
        </td></tr>
      `;
    }
  }

  search?.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    drawTable();
  });

  sortSelect?.addEventListener("change", () => {
    activeSort = sortSelect.value;
    drawTable();
  });

  app.querySelectorAll("[data-sort]").forEach(button => {
    button.addEventListener("click", () => {
      activeSort = button.dataset.sort;
      if (sortSelect) sortSelect.value = activeSort;
      drawTable();
    });
  });

  drawTable();
}

/* =========================================================
   CLUB RECORDS PAGE
   ========================================================= */

function renderRecords() {
  const app = $("#app");

  const greenCards = teamData.players.reduce(
    (total, player) => total + getPlayerStats(player).greenCards, 0
  );

  const yellowCards = teamData.players.reduce(
    (total, player) => total + getPlayerStats(player).yellowCards, 0
  );

  const totalGoals = teamData.players.reduce(
    (total, player) => total + getPlayerStats(player).goals, 0
  );

  const shotsFromRules = teamData.players.reduce((total, player) => {
    const stats = getPlayerStats(player);
    return total + stats.greenCards + stats.yellowCards;
  }, 0);

  const teamOfWeek = teamData.teamOfWeek;
  const featuredPlayer = getPlayer(teamOfWeek.player);

  app.innerHTML = `
    ${pageHeading("THE DETAILS BEHIND THE CLUB", "CLUB RECORDS", "Discipline, player recognition and club information.")}

    <section class="section">
      ${sectionHeading("DISCIPLINE OVERVIEW", "Recorded card totals across the squad.")}
      <div class="record-stat-grid">
        ${statCard("Green cards", greenCards, "Recorded total", true)}
        ${statCard("Yellow cards", yellowCards, "Recorded total")}
        ${statCard("Total cards", greenCards + yellowCards, "All recorded cards")}
        ${statCard("Squad goals", totalGoals, "Recorded goals")}
      </div>
    </section>

    <section class="section" id="team-of-the-week">
      ${sectionHeading("TEAM OF THE WEEK", "Recognising an individual performance.")}
      <article class="totw-card">
        <span class="player-initials">${escapeHTML(playerInitials(teamOfWeek.player))}</span>
        <div class="eyebrow">Gameweek ${number(teamOfWeek.gameweek)}</div>
        <h2 class="totw-name">${escapeHTML(teamOfWeek.player)}</h2>
        <p>${featuredPlayer
          ? "Selected as the recorded Team of the Week player."
          : "Team of the Week selection."}</p>
        <a class="btn btn-secondary" href="squad.html">Explore the squad</a>
      </article>
    </section>

    <section class="section">
      ${sectionHeading("FINES & DISCIPLINE REGISTER", "Current card counts for every player.")}
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Player</th>
              <th class="numeric">Green cards</th>
              <th class="numeric">Yellow cards</th>
              <th class="numeric">Total cards</th>
              <th class="numeric">Fines recorded</th>
            </tr>
          </thead>
          <tbody>
            ${teamData.players.map(player => {
              const stats = getPlayerStats(player);
              return `
                <tr>
                  <td class="table-player">${escapeHTML(player.name)}</td>
                  <td class="numeric">${stats.greenCards}</td>
                  <td class="numeric">${stats.yellowCards}</td>
                  <td class="numeric">${stats.greenCards + stats.yellowCards}</td>
                  <td class="numeric">0</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
      <p class="table-footnote">
        Fine amounts have not been supplied, so the displayed fine values
        are placeholders and should be updated when actual fine records are available.
      </p>
    </section>

    <section class="section">
      ${sectionHeading("INJURY REGISTER", "Reported injuries and their recorded status.")}
      <div class="panel panel-pad">
        ${teamData.injuries.length ? `
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr><th>Player</th><th>Reported injury</th><th>Status</th></tr>
              </thead>
              <tbody>
                ${teamData.injuries.map(injury => `
                  <tr>
                    <td class="table-player">${escapeHTML(injury.player)}</td>
                    <td>${escapeHTML(injury.injury)}</td>
                    <td><span class="tag tag-orange">${escapeHTML(injury.status)}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        ` : '<div class="empty-state">No injuries recorded.</div>'}
      </div>
    </section>

    <section class="section">
      ${sectionHeading("CLUB RULES", "Current rules supplied for the team.")}
      <div class="panel panel-pad">
        <div class="record-list">
          ${teamData.rules.map((rule, index) => `
            <div class="rule-row">
              <span class="rule-number">${String(index + 1).padStart(2, "0")}</span>
              <p>${escapeHTML(rule)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

/* =========================================================
   NAVIGATION, MODAL AND INITIALISATION
   ========================================================= */

function setupNavigation() {
  const toggle = $(".menu-toggle");
  const nav = $("#main-navigation");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "×" : "☰";
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    });
  });
}

function setupPlayerDialog() {
  const dialog = $("#player-dialog");
  const closeButton = $(".dialog-close");

  if (!dialog) return;

  closeButton?.addEventListener("click", () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  });

  dialog.addEventListener("click", event => {
    if (event.target === dialog && typeof dialog.close === "function") {
      dialog.close();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && dialog.open &&
        typeof dialog.close === "function") {
      dialog.close();
    }
  });
}

function setupPlayerClicks() {
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-player]");
    if (!button) return;

    const playerName = button.dataset.player;
    if (playerName) openPlayerProfile(playerName);
  });
}

function initialiseSite() {
  renderHeader();
  renderFooter();

  const page = document.body.dataset.page || "home";

  const renderers = {
    home: renderHome,
    matches: renderMatches,
    squad: renderSquad,
    statistics: renderStatistics,
    records: renderRecords
  };

  const renderPage = renderers[page];

  if (renderPage) {
    renderPage();
  } else {
    $("#app").innerHTML = `
      ${pageHeading("TEMU BALLERS", "PAGE NOT FOUND", "This page could not be found.")}
      <a class="btn" href="index.html">Return home</a>
    `;
  }

  setupNavigation();
  setupPlayerDialog();
  setupPlayerClicks();
}

document.addEventListener("DOMContentLoaded", initialiseSite);
