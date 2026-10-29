
const DATA = {
  players: [
    { name: "Josh", goals: 2, assists: 0, appearances: 2 },
    { name: "Ethan", goals: 0, assists: 0, appearances: 2 },
    { name: "José", goals: 0, assists: 0, appearances: 2 },
    { name: "Abdou", goals: 0, assists: 0, appearances: 2 },
    { name: "Adam", goals: 2, assists: 0, appearances: 2 },
    { name: "Alex", goals: 0, assists: 0, appearances: 0 },
    { name: "Brandon", goals: 0, assists: 0, appearances: 2 },
    { name: "Lathi", goals: 0, assists: 0, appearances: 0 },
    { name: "Zach", goals: 1, assists: 0, appearances: 2 },
    { name: "Manu", goals: 0, assists: 0, appearances: 0 }
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

  fines: [
    { player: "Ethan", type: "Green", date: "28 Oct 2026", shots: 1 },
    { player: "Zach", type: "Green", date: "28 Oct 2026", shots: 1 },
    { player: "Adam", type: "Green", date: "28 Oct 2026", shots: 1 },
    { player: "Brandon", type: "Green", date: "28 Oct 2026", shots: 1 },
    { player: "Abdou", type: "Green", date: "28 Oct 2026", shots: 1 },
    { player: "Alex", type: "Green", date: "28 Oct 2026", shots: 1 },
    { player: "Alex", type: "Yellow", date: "28 Oct 2026", shots: 1 }
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

// ---------- HELPERS ----------

const $ = (id) => document.getElementById(id);

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
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

function getGoalDifference() {
  const goalsFor = DATA.results.reduce(
    (total, result) => total + result.teamScore,
    0
  );

  const goalsAgainst = DATA.results.reduce(
    (total, result) => total + result.opponentScore,
    0
  );

  return goalsFor - goalsAgainst;
}

function getPlayer(name) {
  return DATA.players.find(
    (player) => player.name.toLowerCase() === name.toLowerCase()
  );
}

// ---------- OVERVIEW ----------

function renderOverview() {
  const played = DATA.results.length;
  const wins = DATA.results.filter((result) => getResult(result) === "W").length;
  const draws = DATA.results.filter((result) => getResult(result) === "D").length;
  const losses = DATA.results.filter((result) => getResult(result) === "L").length;

  const goalsFor = DATA.results.reduce(
    (total, result) => total + result.teamScore,
    0
  );

  const goalsAgainst = DATA.results.reduce(
    (total, result) => total + result.opponentScore,
    0
  );

  const points = wins * 3 + draws;

  if ($("matchesPlayed")) $("matchesPlayed").textContent = played;
  if ($("points")) $("points").textContent = points;
  if ($("goalsFor")) $("goalsFor").textContent = goalsFor;
  if ($("goalDifference")) {
    const difference = goalsFor - goalsAgainst;
    $("goalDifference").textContent =
      difference > 0 ? `+${difference}` : difference;
  }
  if ($("goalsAgainstLabel")) {
    $("goalsAgainstLabel").textContent = goalsAgainst;
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
    container.innerHTML = '<div class="empty-state">No match results recorded yet.</div>';
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
        <div class="result-score">${result.teamScore}–${result.opponentScore}</div>
        <span class="result-status status-${status}">${status}</span>
      </article>
    `;
  }).join("");
}

function renderFormGuide() {
  const container = $("formGuide");
  if (!container) return;

  const form = DATA.results.slice(-5).map(getResult);

  container.innerHTML = form.length
    ? form.map((result) =>
        `<span class="form-pill ${result}" title="${
          result === "W" ? "Win" : result === "D" ? "Draw" : "Loss"
        }">${result}</span>`
      ).join("")
    : '<span class="empty-state">No form recorded yet.</span>';
}

// ---------- SQUAD ----------

function renderPlayers(searchTerm = "") {
  const container = $("playersGrid");
  if (!container) return;

  const term = searchTerm.trim().toLowerCase();

  const filteredPlayers = DATA.players.filter((player) =>
    player.name.toLowerCase().includes(term)
  );

  if ($("playerCount")) {
    $("playerCount").textContent = filteredPlayers.length;
  }

  if (!filteredPlayers.length) {
    container.innerHTML = '<div class="empty-state">No players match your search.</div>';
    return;
  }

  container.innerHTML = filteredPlayers.map((player) => {
    const initial = player.name.charAt(0).toUpperCase();

    return `
      <button class="player-card" type="button"
        data-player="${escapeHTML(player.name)}"
        aria-label="View ${escapeHTML(player.name)}'s profile">
        <div class="player-avatar">${escapeHTML(initial)}</div>
        <div class="player-name">${escapeHTML(player.name)}</div>
        <div class="player-mini-stats">
          <span><strong>${displayStat(player.goals)}</strong> goals</span>
          <span><strong>${displayStat(player.assists)}</strong> assists</span>
          <span><strong>${displayStat(player.appearances)}</strong> apps</span>
        </div>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-player]").forEach((card) => {
    card.addEventListener("click", () => {
      openPlayerProfile(card.dataset.player);
    });
  });
}

function renderLeaderboard() {
  const goalContainer = $("goalsLeaderboard");
  const assistContainer = $("assistsLeaderboard");

  const goalLeaders = [...DATA.players].sort((a, b) =>
    b.goals - a.goals || a.name.localeCompare(b.name)
  );

  if (goalContainer) {
    const highestGoals = Math.max(
      0,
      ...DATA.players.map((player) => player.goals)
    );

    const leaders = goalLeaders.filter(
      (player) => player.goals === highestGoals && highestGoals > 0
    );

    goalContainer.innerHTML = highestGoals === 0
      ? '<div class="empty-state">No goals recorded yet.</div>'
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
    const recordedAssists = DATA.players.some(
      (player) => player.assists !== null && player.assists !== undefined
    );

    if (!recordedAssists) {
      assistContainer.innerHTML =
        '<div class="empty-state">Assist totals haven’t been recorded yet.</div>';
      return;
    }

    const sorted = [...DATA.players].sort((a, b) =>
      (b.assists ?? -1) - (a.assists ?? -1) ||
      a.name.localeCompare(b.name)
    );

    const highestAssists = Math.max(
      0,
      ...DATA.players.map((player) => player.assists ?? 0)
    );

    assistContainer.innerHTML = sorted
      .filter((player) => player.assists === highestAssists)
      .map((player, index) => `
        <div class="leader-row">
          <span class="leader-rank">${index + 1}</span>
          <span class="leader-player">${escapeHTML(player.name)}</span>
          <strong class="leader-value">
            ${displayStat(player.assists)} ${player.assists === 1 ? "assist" : "assists"}
          </strong>
        </div>
      `).join("");
  }
}

function renderPlayerStats() {
  const container = $("statsTable");
  if (!container) return;

  const sorted = [...DATA.players].sort((a, b) => {
    const gaA = a.goals + (a.assists ?? 0);
    const gaB = b.goals + (b.assists ?? 0);

    return gaB - gaA ||
      b.goals - a.goals ||
      (b.appearances ?? -1) - (a.appearances ?? -1) ||
      a.name.localeCompare(b.name);
  });

  container.innerHTML = sorted.map((player, index) => {
    const goalContributions = player.goals + (player.assists ?? 0);

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHTML(player.name)}</td>
        <td>${displayStat(player.appearances)}</td>
        <td>${displayStat(player.goals)}</td>
        <td>${displayStat(player.assists)}</td>
        <td>${goalContributions}</td>
      </tr>
    `;
  }).join("");
}

function openPlayerProfile(playerName) {
  const player = getPlayer(playerName);
  const dialog = $("playerDialog");
  const profile = $("playerProfile");

  if (!player || !dialog || !profile) return;

  const contributions = player.goals + (player.assists ?? 0);

  profile.innerHTML = `
    <div class="profile-header">
      <div class="player-avatar">${escapeHTML(player.name.charAt(0).toUpperCase())}</div>
      <div>
        <h2>${escapeHTML(player.name)}</h2>
        <p>Temu Ballers</p>
      </div>
    </div>
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
        <span>Goal contributions</span>
      </div>
    </div>
  `;

  if (typeof dialog.showModal === "function") {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
}

// ---------- FIXTURES ----------

function renderFixtures() {
  const container = $("fixturesTable");
  if (!container) return;

  if (!DATA.fixtures.length) {
    container.innerHTML = '<tr><td colspan="3">No upcoming fixtures recorded.</td></tr>';
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

// ---------- FINES REGISTER ----------

function renderFines() {
  const container = $("finesTable");
  const greenCards = DATA.fines.filter(
    (fine) => fine.type.toLowerCase() === "green"
  ).length;

  const yellowCards = DATA.fines.filter(
    (fine) => fine.type.toLowerCase() === "yellow"
  ).length;

  const totalShots = DATA.fines.reduce(
    (total, fine) => total + fine.shots,
    0
  );

  if ($("totalFines")) $("totalFines").textContent = DATA.fines.length;
  if ($("greenCards")) $("greenCards").textContent = greenCards;
  if ($("yellowCards")) $("yellowCards").textContent = yellowCards;
  if ($("totalShots")) $("totalShots").textContent = totalShots;

  if (container) {
    if (!DATA.fines.length) {
      container.innerHTML =
        '<tr><td colspan="4">No cards or fines recorded yet.</td></tr>';
    } else {
      container.innerHTML = [...DATA.fines].reverse().map((fine) => {
        const type = fine.type.toLowerCase();
        const dotClass = type === "green"
          ? "green"
          : type === "yellow"
            ? "yellow"
            : "other";

        return `
          <tr>
            <td>${escapeHTML(fine.date)}</td>
            <td>${escapeHTML(fine.player)}</td>
            <td>
              <span class="card-type">
                <span class="card-dot ${dotClass}"></span>
                ${escapeHTML(fine.type)} card
              </span>
            </td>
            <td><span class="shot-status">${fine.shots} ${fine.shots === 1 ? "shot" : "shots"}</span></td>
          </tr>
        `;
      }).join("");
    }
  }

  renderRules();
}

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

// ---------- INITIALISE ----------

document.addEventListener("DOMContentLoaded", () => {
  renderOverview();
  renderPlayers();
  renderLeaderboard();
  renderPlayerStats();
  renderFixtures();
  renderFines();

  const search = $("playerSearch");
  if (search) {
    search.addEventListener("input", (event) => {
      renderPlayers(event.target.value);
    });
  }

  const closeButton = $("closeDialog");
  const dialog = $("playerDialog");

  if (closeButton && dialog) {
    closeButton.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && typeof dialog.close === "function") {
        dialog.close();
      }
    });
  }
});
