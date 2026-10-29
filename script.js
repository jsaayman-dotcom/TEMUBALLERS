
"use strict";

/* =========================================
   TEMU BALLERS — WEBSITE DATA & FUNCTIONALITY
   ========================================= */

const DATA = {
  players: [
    { name: "Josh", goals: 2, assists: null, appearances: 2 },
    { name: "Ethan", goals: 0, assists: 1, appearances: 2 },
    { name: "Jose", goals: 0, assists: 2, appearances: 2 },
    { name: "Abdou", goals: 0, assists: null, appearances: 2 },
    { name: "Adam", goals: 2, assists: null, appearances: 2 },
    { name: "Alex", goals: 0, assists: null, appearances: null },
    { name: "Brandon", goals: 0, assists: null, appearances: 2 },
    { name: "Lathi", goals: 0, assists: null, appearances: null },
    { name: "Zach", goals: 1, assists: null, appearances: 2 },
    { name: "Manu", goals: 0, assists: null, appearances: null }
  ],

  results: [
    {
      opponent: "Dark Knights",
      teamScore: 3,
      opponentScore: 3,
      scorers: ["Josh", "Zach", "Adam"],
      date: "Date not recorded"
    },
    {
      opponent: "FC Sparta",
      teamScore: 2,
      opponentScore: 1,
      scorers: ["Josh", "Adam"],
      date: "Date not recorded"
    }
  ],

  fixtures: [
    { date: "04 Nov 2026", time: "18:15", opponent: "Superstrikers" },
    { date: "11 Nov 2026", time: "20:30", opponent: "Depot Utd FC" },
    { date: "18 Nov 2026", time: "19:00", opponent: "Von-Boeties FC" },
    { date: "25 Nov 2026", time: "18:15", opponent: "Teknology FC" },
    { date: "02 Dec 2026", time: "19:45", opponent: "The Unknowns" },
    { date: "09 Dec 2026", time: "21:15", opponent: "Quality Control" },
    { date: "16 Dec 2026", time: "20:30", opponent: "Toray Logistics" }
  ],

  cards: [
    { player: "Ethan", type: "Green", date: null, shots: 1 },
    { player: "Adam", type: "Green", date: null, shots: 1 },
    { player: "Adam", type: "Green", date: null, shots: 1 },
    { player: "Zach", type: "Green", date: null, shots: 1 },
    { player: "Zach", type: "Yellow", date: null, shots: 1 }
  ],

  injuries: [
    { player: "Alex", description: "Ear injury", date: null }
  ],

  teamOfTheWeek: [
    { player: "Jose", gameweek: 1 }
  ],

  rules: [
    "Yellow card — one shot under team rules.",
    "Green card — one shot under team rules.",
    "Injury — only applies if the team has agreed to this rule.",
    "Own goal — one shot under team rules.",
    "Not scoring — one shot under team rules.",
    "Missing an open goal — one shot under team rules.",
    "Finishing below 4th place — everyone takes a shot."
  ],

  venue: "Fairview Action Arena"
};

/* ---------- HELPERS ---------- */

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function displayStat(value) {
  return value === null || value === undefined || value === ""
    ? "—"
    : value;
}

function getResult(result) {
  if (result.teamScore > result.opponentScore) return "W";
  if (result.teamScore < result.opponentScore) return "L";
  return "D";
}

function getPlayer(name) {
  return DATA.players.find(
    (player) => player.name.toLowerCase() === name.toLowerCase()
  );
}

function getGoalContributions(player) {
  return player.goals + (player.assists ?? 0);
}

function renderEmpty(message, className = "empty-state") {
  return `<div class="${className}">${escapeHTML(message)}</div>`;
}

/* ---------- OVERVIEW ---------- */

function renderOverview() {
  const played = DATA.results.length;

  const wins = DATA.results.filter(
    (result) => getResult(result) === "W"
  ).length;

  const draws = DATA.results.filter(
    (result) => getResult(result) === "D"
  ).length;

  const losses = DATA.results.filter(
    (result) => getResult(result) === "L"
  ).length;

  const goalsFor = DATA.results.reduce(
    (total, result) => total + result.teamScore,
    0
  );

  const goalsAgainst = DATA.results.reduce(
    (total, result) => total + result.opponentScore,
    0
  );

  const points = wins * 3 + draws;
  const difference = goalsFor - goalsAgainst;

  if ($("matchesPlayed")) $("matchesPlayed").textContent = played;
  if ($("points")) $("points").textContent = points;
  if ($("goalsFor")) $("goalsFor").textContent = goalsFor;

  if ($("goalDifference")) {
    $("goalDifference").textContent =
      difference > 0 ? `+${difference}` : difference;
  }

  if ($("winsCount")) $("winsCount").textContent = wins;
  if ($("drawsCount")) $("drawsCount").textContent = draws;
  if ($("lossesCount")) $("lossesCount").textContent = losses;

  renderResults();
  renderFormGuide();
}

function renderResults() {
  const container = $("resultsList");
  if (!container) return;

  if (!DATA.results.length) {
    container.innerHTML = renderEmpty("No match results recorded yet.");
    return;
  }

  container.innerHTML = [...DATA.results].reverse().map((result) => {
    const status = getResult(result);

    const scorers = result.scorers.length
      ? result.scorers.map(escapeHTML).join(", ")
      : "No scorers recorded";

    return `
      <article class="result-row">
        <div class="result-team">
          <strong>Temu Ballers</strong>
          <span>vs ${escapeHTML(result.opponent)}</span>
          <small>${escapeHTML(result.date)}</small>
          <small>Scorers: ${scorers}</small>
        </div>

        <div class="result-score">
          ${result.teamScore}–${result.opponentScore}
        </div>

        <span class="result-status status-${status}">
          ${status}
        </span>
      </article>
    `;
  }).join("");
}

function renderFormGuide() {
  const container = $("formGuide");
  if (!container) return;

  const form = DATA.results.slice(-5).map(getResult);

  container.innerHTML = form.length
    ? form.map((result) => {
        const label = {
          W: "Win",
          D: "Draw",
          L: "Loss"
        }[result];

        return `
          <span class="form-pill ${result}" title="${label}">
            ${result}
          </span>
        `;
      }).join("")
    : renderEmpty("No form recorded yet.");
}

/* ---------- SQUAD & PLAYER CARDS ---------- */

function renderPlayers(searchTerm = "") {
  const container = $("playersGrid");
  if (!container) return;

  const term = searchTerm.trim().toLowerCase();

  const players = DATA.players.filter((player) =>
    player.name.toLowerCase().includes(term)
  );

  if ($("playerCount")) {
    $("playerCount").textContent = players.length;
  }

  if (!players.length) {
    container.innerHTML = renderEmpty("No players match your search.");
    return;
  }

  container.innerHTML = players.map((player) => {
    const initial = player.name.charAt(0).toUpperCase();

    return `
      <button class="player-card"
        type="button"
        data-player="${escapeHTML(player.name)}"
        aria-label="View ${escapeHTML(player.name)}'s profile">

        <span class="player-avatar">${escapeHTML(initial)}</span>

        <span class="player-name">${escapeHTML(player.name)}</span>

        <span class="player-mini-stats">
          <span><span>Goals</span><strong>${displayStat(player.goals)}</strong></span>
          <span><span>Assists</span><strong>${displayStat(player.assists)}</strong></span>
          <span><span>Apps</span><strong>${displayStat(player.appearances)}</strong></span>
        </span>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-player]").forEach((card) => {
    card.addEventListener("click", () => {
      openPlayerProfile(card.dataset.player);
    });
  });
}

/* ---------- TEAM OF THE WEEK ---------- */

function renderTeamOfTheWeek() {
  const container = document.querySelector(".totw-feature");
  if (!container) return;

  const selection = DATA.teamOfTheWeek[0];
  if (!selection) {
    container.hidden = true;
    return;
  }

  const player = getPlayer(selection.player);
  if (!player) return;

  const heading = container.querySelector(".totw-copy h3");
  const gameweek = container.querySelector(".totw-copy p");
  const playerName = container.querySelector(".totw-player strong");
  const badge = container.querySelector(".totw-gameweek");

  if (heading) heading.textContent = "Team of the Week";
  if (gameweek) gameweek.textContent = `Gameweek ${selection.gameweek}`;
  if (playerName) playerName.textContent = player.name;
  if (badge) {
    badge.textContent = `GW ${String(selection.gameweek).padStart(2, "0")}`;
  }

  container.setAttribute(
    "aria-label",
    `${player.name}, Team of the Week, Gameweek ${selection.gameweek}`
  );
}

/* ---------- LEADERBOARDS ---------- */

function renderLeaderboard() {
  const goalContainer = $("goalsLeaderboard");
  const assistContainer = $("assistsLeaderboard");

  const sortedGoals = [...DATA.players].sort((a, b) =>
    b.goals - a.goals || a.name.localeCompare(b.name)
  );

  if (goalContainer) {
    const highestGoals = Math.max(
      0,
      ...DATA.players.map((player) => player.goals)
    );

    const leaders = sortedGoals.filter(
      (player) => player.goals === highestGoals && highestGoals > 0
    );

    goalContainer.innerHTML = highestGoals === 0
      ? renderEmpty("No goals recorded yet.")
      : leaders.map((player, index) => `
          <div class="leader-row">
            <span class="leader-rank">${index + 1}</span>
            <span class="leader-player">${escapeHTML(player.name)}</span>
            <strong class="leader-value">
              ${player.goals} ${player.goals === 1 ? "goal" : "goals"}
            </strong>
          </div>
        `).join("");
  }

  if (assistContainer) {
    const recordedPlayers = DATA.players.filter(
      (player) => player.assists !== null && player.assists !== undefined
    );

    if (!recordedPlayers.length) {
      assistContainer.innerHTML =
        '<div class="unrecorded">Assist totals haven’t been recorded yet.</div>';
      return;
    }

    const sortedAssists = [...recordedPlayers].sort((a, b) =>
      b.assists - a.assists || a.name.localeCompare(b.name)
    );

    const highestAssists = sortedAssists[0].assists;

    const leaders = sortedAssists.filter(
      (player) => player.assists === highestAssists
    );

    assistContainer.innerHTML = leaders.map((player, index) => `
      <div class="leader-row">
        <span class="leader-rank">${index + 1}</span>
        <span class="leader-player">${escapeHTML(player.name)}</span>
        <strong class="leader-value">
          ${player.assists} ${player.assists === 1 ? "assist" : "assists"}
        </strong>
      </div>
    `).join("");
  }
}

/* ---------- SQUAD STATISTICS TABLE ---------- */

function renderPlayerStats() {
  const container = $("statsTable");
  if (!container) return;

  const sorted = [...DATA.players].sort((a, b) =>
    getGoalContributions(b) - getGoalContributions(a) ||
    b.goals - a.goals ||
    (b.appearances ?? -1) - (a.appearances ?? -1) ||
    a.name.localeCompare(b.name)
  );

  container.innerHTML = sorted.map((player, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHTML(player.name)}</td>
      <td>${displayStat(player.appearances)}</td>
      <td>${displayStat(player.goals)}</td>
      <td>${displayStat(player.assists)}</td>
      <td>${getGoalContributions(player)}</td>
    </tr>
  `).join("");
}

/* ---------- PLAYER PROFILE DIALOG ---------- */

function openPlayerProfile(playerName) {
  const player = getPlayer(playerName);
  const dialog = $("playerDialog");
  const profile = $("playerProfile");

  if (!player || !dialog || !profile) return;

  const contributions = getGoalContributions(player);

  const teamOfTheWeek = DATA.teamOfTheWeek.find(
    (selection) => selection.player.toLowerCase() === player.name.toLowerCase()
  );

  const cards = DATA.cards.filter(
    (card) => card.player.toLowerCase() === player.name.toLowerCase()
  );

  const injuries = DATA.injuries.filter(
    (injury) => injury.player.toLowerCase() === player.name.toLowerCase()
  );

  profile.innerHTML = `
    <div class="profile-header">
      <div class="player-avatar">${escapeHTML(player.name.charAt(0).toUpperCase())}</div>
      <div>
        <h2>${escapeHTML(player.name)}</h2>
        <p>Temu Ballers</p>
      </div>
    </div>

    ${teamOfTheWeek ? `
      <div class="profile-recognition">
        <strong>Team of the Week</strong>
        <span>Gameweek ${teamOfTheWeek.gameweek}</span>
      </div>
    ` : ""}

    <div class="profile-stats">
      <div class="profile-stat">
        <strong>${displayStat(player.appearances)}</strong>
        <span>Appearances</span>
      </div>
      <div class="profile-stat">
        <strong>${displayStat(player.goals)}</strong>
        <span>Goals</span>
      </div>
      <div class="profile-stat">
        <strong>${displayStat(player.assists)}</strong>
        <span>Assists</span>
      </div>
      <div class="profile-stat">
        <strong>${contributions}</strong>
        <span>Recorded G+A</span>
      </div>
    </div>

    <div class="profile-extra">
      <h3>Disciplinary record</h3>
      <p>${cards.length
        ? cards.map((card) => `${escapeHTML(card.type)} card`).join(", ")
        : "No cards recorded."}</p>
    </div>

    ${injuries.length ? `
      <div class="profile-extra">
        <h3>Injury record</h3>
        <p>${injuries.map((injury) => escapeHTML(injury.description)).join(", ")}</p>
      </div>
    ` : ""}
  `;

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

function initialisePlayerDialog() {
  const closeButton = $("closeDialog");
  const dialog = $("playerDialog");

  if (!dialog) return;

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });
  }

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && typeof dialog.close === "function") {
      dialog.close();
    }
  });
}

/* ---------- FIXTURES ---------- */

function renderFixtures() {
  const container = $("fixturesTable");
  if (!container) return;

  if (!DATA.fixtures.length) {
    container.innerHTML =
      '<tr><td colspan="3">No upcoming fixtures recorded.</td></tr>';
    return;
  }

  container.innerHTML = DATA.fixtures.map((fixture) => `
    <tr>
      <td>${escapeHTML(fixture.date)}</td>
      <td>${escapeHTML(fixture.time)}</td>
      <td>
        <strong>Temu Ballers</strong> vs ${escapeHTML(fixture.opponent)}
        <small class="fixture-venue">${escapeHTML(DATA.venue)}</small>
      </td>
    </tr>
  `).join("");
}

/* ---------- DISCIPLINARY REGISTER ---------- */

function renderDiscipline() {
  const container = $("finesTable");

  const greenCards = DATA.cards.filter(
    (card) => card.type.toLowerCase() === "green"
  ).length;

  const yellowCards = DATA.cards.filter(
    (card) => card.type.toLowerCase() === "yellow"
  ).length;

  const totalShots = DATA.cards.reduce(
    (total, card) => total + card.shots,
    0
  );

  if ($("totalFines")) $("totalFines").textContent = DATA.cards.length;
  if ($("greenCards")) $("greenCards").textContent = greenCards;
  if ($("yellowCards")) $("yellowCards").textContent = yellowCards;
  if ($("totalShots")) $("totalShots").textContent = totalShots;

  if (!container) return;

  if (!DATA.cards.length) {
    container.innerHTML =
      '<tr><td colspan="4">No cards recorded yet.</td></tr>';
    return;
  }

  container.innerHTML = [...DATA.cards].reverse().map((card) => {
    const dotClass = card.type.toLowerCase() === "green"
      ? "green"
      : card.type.toLowerCase() === "yellow"
        ? "yellow"
        : "other";

    return `
      <tr>
        <td>${displayStat(card.date)}</td>
        <td>${escapeHTML(card.player)}</td>
        <td>
          <span class="card-type">
            <span class="card-dot ${dotClass}"></span>
            ${escapeHTML(card.type)} card
          </span>
        </td>
        <td><span class="shot-status">${card.shots} ${card.shots === 1 ? "shot" : "shots"}</span></td>
      </tr>
    `;
  }).join("");
}

/* ---------- INJURY REGISTER ---------- */

function renderInjuries() {
  const container = $("injuriesList");
  if (!container) return;

  if (!DATA.injuries.length) {
    container.innerHTML = renderEmpty("No injuries recorded.");
    return;
  }

  container.innerHTML = DATA.injuries.map((injury) => `
    <div class="injury-row">
      <div class="injury-icon" aria-hidden="true">+</div>
      <div class="injury-details">
        <strong>${escapeHTML(injury.player)}</strong>
        <span>${escapeHTML(injury.description)}</span>
      </div>
      <span class="injury-status">Recorded</span>
    </div>
  `).join("");
}

/* ---------- TEAM RULES ---------- */

function renderRules() {
  const container = $("rulesList");
  if (!container) return;

  container.innerHTML = DATA.rules.map((rule, index) => `
    <li class="rule-item">
      <span class="rule-number">${String(index + 1).padStart(2, "0")}</span>
      <span>${escapeHTML(rule)}</span>
    </li>
  `).join("");
}

/* ---------- MOBILE NAVIGATION ---------- */

function initialiseNavigation() {
  const toggle = $("menuToggle");
  const nav = $("mainNav");

  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) {
      closeMenu();
    }
  });
}

/* ---------- ACTIVE NAVIGATION ---------- */

function initialiseActiveNavigation() {
  const links = [...document.querySelectorAll(".nav-link")];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!visibleEntries.length) return;

    const activeId = visibleEntries[0].target.id;

    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeId}`;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }, {
    rootMargin: "-15% 0px -65% 0px",
    threshold: [0, 0.15, 0.4]
  });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- START WEBSITE ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderOverview();
  renderPlayers();
  renderTeamOfTheWeek();
  renderLeaderboard();
  renderPlayerStats();
  renderFixtures();
  renderDiscipline();
  renderInjuries();
  renderRules();

  initialisePlayerDialog();
  initialiseNavigation();
  initialiseActiveNavigation();

  const search = $("playerSearch");

  if (search) {
    search.addEventListener("input", (event) => {
      renderPlayers(event.target.value);
    });
  }
});
