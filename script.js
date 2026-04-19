const partners = {
  Bride: [
    { name: "Ava", role: "Bride", traits: ["romantic", "shy"], style: "classic" },
    { name: "Samantha", role: "Bride", traits: ["dramatic", "organized"], style: "modern" },
    { name: "Carmen", role: "Bride", traits: ["adventurous", "spontaneous"], style: "bold" },
    { name: "Felicity", role: "Bride", traits: ["romantic", "organized"], style: "elegant" }
  ],
  Groom: [
    { name: "Justin", role: "Groom", traits: ["romantic", "spontaneous"], style: "modern" },
    { name: "Antonio", role: "Groom", traits: ["adventurous", "dramatic"], style: "bold" },
    { name: "Felix", role: "Groom", traits: ["shy", "organized"], style: "classic" },
    { name: "Douglas", role: "Groom", traits: ["organized", "romantic"], style: "elegant" }
  ]
};

const portraitMap = {
  Ava: "💐",
  Samantha: "👑",
  Carmen: "🔥",
  Felicity: "🌸",
  Justin: "💖",
  Antonio: "🎩",
  Felix: "📚",
  Douglas: "✨"
};

const reactionMap = {
  Ava: "Soft sparkle",
  Samantha: "Grand entrance",
  Carmen: "Chaotic energy",
  Felicity: "Storybook glow",
  Justin: "Hopeless romantic",
  Antonio: "Bold charm",
  Felix: "Quiet comfort",
  Douglas: "Elegant calm"
};

const styleDescriptions = {
  classic: "timeless vows",
  modern: "sleek celebration",
  bold: "spotlight romance",
  elegant: "graceful glamour"
};

const traitWeights = {
  romantic: 18,
  adventurous: 16,
  shy: 11,
  dramatic: 12,
  organized: 14,
  spontaneous: 15
};

const matchmakingMessages = [
  "Analyzing compatibility...",
  "Consulting wedding fate...",
  "Checking romantic energy..."
];

const resultVariants = {
  dream: [
    "The venue practically glows when this pair walks in together.",
    "Every speech lands, every dance hits, and the photographer cannot miss.",
    "This pairing feels like the kind of wedding guests talk about for years."
  ],
  beautiful: [
    "There is real chemistry here, even if the timeline gets a little dramatic.",
    "The mood is charming, the spark is real, and the surprises somehow work.",
    "This wedding has strong feelings, fabulous fashion, and manageable chaos."
  ],
  drama: [
    "The attraction is there, but the emotional weather forecast looks unstable.",
    "The energy is compelling, though someone may absolutely storm off mid-toast.",
    "This match could work, but it may need a miracle planner and extra cake."
  ],
  runaway: [
    "The chemistry is flickering, and the getaway car should stay warmed up.",
    "This pairing may turn the rehearsal into a full-scale emotional detour.",
    "There are vibes here, but not all of them are wedding-safe."
  ]
};

const resultEl = document.getElementById("result");
const partnerListEl = document.getElementById("partner-list");
const matchmakeBtn = document.getElementById("matchmake-btn");
const overlayEl = document.getElementById("matchmaking-overlay");
const matchmakingMessageEl = document.getElementById("matchmaking-message");
const musicToggleBtn = document.getElementById("music-toggle");
const weddingAudio = document.getElementById("wedding-audio");
const playerAvatarEl = document.getElementById("player-avatar");
const playerRoleStyleEl = document.getElementById("player-role-style");
const playerTraitSummaryEl = document.getElementById("player-trait-summary");
const desiredTraitSummaryEl = document.getElementById("desired-trait-summary");

const TRAIT_LIMIT = 2;
const MUSIC_TARGET_VOLUME = 0.25;

let matchmakingIntervalId = null;
let musicHasStarted = false;

function setupTraitLimits(groupName) {
  const checkboxes = document.querySelectorAll(`input[name="${groupName}"]`);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const checked = Array.from(checkboxes).filter((item) => item.checked);

      if (checked.length > TRAIT_LIMIT) {
        checkbox.checked = false;
        renderMessage(`You can only choose up to ${TRAIT_LIMIT} options in this section.`, true);
      } else if (resultEl.classList.contains("error")) {
        renderPlaceholder();
      }

      updatePlayerCard();
    });
  });
}

function getSelectedRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function getSelectedCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function createChipMarkup(values, emptyLabel) {
  if (!values.length) {
    return `<span class="chip is-empty">${emptyLabel}</span>`;
  }

  return values.map((value) => `<span class="chip">${capitalize(value)}</span>`).join("");
}

function updatePlayerCard() {
  const role = getSelectedRadioValue("person1-role");
  const style = getSelectedRadioValue("person1-style");
  const vibe = getSelectedRadioValue("player-vibe") || "💖";
  const traits = getSelectedCheckboxValues("person1-traits");
  const desiredTraits = getSelectedCheckboxValues("desired-traits");

  playerAvatarEl.textContent = vibe;
  playerRoleStyleEl.textContent = `${role} • ${capitalize(style)} style • ${styleDescriptions[style]}`;
  playerTraitSummaryEl.innerHTML = createChipMarkup(traits, "Choose traits");
  desiredTraitSummaryEl.innerHTML = createChipMarkup(desiredTraits, "Choose preferences");
}

function renderPartners(role) {
  const rolePartners = partners[role] || [];

  partnerListEl.innerHTML = rolePartners
    .map((partner, index) => `
      <label class="partner-card">
        <input type="radio" name="selected-partner" value="${partner.name}" ${index === 0 ? "checked" : ""}>
        <div class="card-content">
          <div class="portrait-row">
            <div class="portrait-emoji" aria-hidden="true">${portraitMap[partner.name] || "💘"}</div>
            <span class="reaction-badge">${reactionMap[partner.name] || "Cute energy"}</span>
          </div>
          <h3>${partner.name}</h3>
          <p class="meta">${partner.role}</p>
          <p class="archetype">Traits: ${partner.traits.map(capitalize).join(", ")}</p>
          <p class="style-line">Style: ${capitalize(partner.style)} • ${styleDescriptions[partner.style]}</p>
        </div>
      </label>
    `)
    .join("");
}

function calculateCompatibility(person1, partner) {
  const sharedTraits = person1.traits.filter((trait) => partner.traits.includes(trait));
  const desiredMatches = person1.desiredTraits.filter((trait) => partner.traits.includes(trait));
  const sharedTraitPoints = sharedTraits.reduce((total, trait) => total + (traitWeights[trait] || 10), 0);
  const desiredMatchPoints = desiredMatches.reduce((total, trait) => total + (traitWeights[trait] || 10) + 4, 0);
  const stylePoints = person1.style === partner.style ? 14 : 0;
  const rolePoints = person1.role !== partner.role ? 8 : 0;
  const chemistryFactor = randomNumber(-6, 8);

  let score = 18 + sharedTraitPoints + desiredMatchPoints + stylePoints + rolePoints + chemistryFactor;
  score = Math.max(0, Math.min(score, 100));

  return {
    score,
    sharedTraits,
    desiredMatches,
    styleMatched: person1.style === partner.style,
    chemistryFactor,
    breakdown: {
      base: 18,
      sharedTraitPoints,
      desiredMatchPoints,
      stylePoints,
      rolePoints,
      chemistryFactor
    }
  };
}

function getOutcome(score) {
  if (score >= 80) {
    return {
      key: "dream",
      icon: "💞",
      title: "Dream Wedding",
      description: "Champagne sparkles, vows land perfectly, and every guest leaves convinced they witnessed a legendary love story."
    };
  }

  if (score >= 50) {
    return {
      key: "beautiful",
      icon: "💐",
      title: "Beautiful but Chaotic Wedding",
      description: "The chemistry is strong, but so is the chance of a surprise dance battle, late bouquet, or a wildly emotional toast."
    };
  }

  if (score >= 20) {
    return {
      key: "drama",
      icon: "🎭",
      title: "Drama-Filled Wedding",
      description: "There is attraction here, but the seating chart may start a feud and somebody is definitely making a dramatic exit."
    };
  }

  return {
    key: "runaway",
    icon: "🏃",
    title: "Runaway Wedding",
    description: "This match is hanging on by a glitter-covered thread. Keep the getaway car ready just in case the vows never happen."
  };
}

function getOutcomeVariation(outcomeKey) {
  const options = resultVariants[outcomeKey] || resultVariants.beautiful;
  return options[randomNumber(0, options.length - 1)];
}

function renderPlaceholder() {
  clearResultEffects();
  resultEl.className = "result empty";
  resultEl.innerHTML = "<p>Your compatibility score, chemistry notes, and wedding story will appear here.</p>";
}

function renderMessage(message, isError = false) {
  clearResultEffects();
  resultEl.className = `result ${isError ? "error" : ""}`;
  resultEl.innerHTML = `<p>${message}</p>`;
}

function renderResult(details) {
  const { score, sharedTraits, desiredMatches, styleMatched, chemistryFactor, partnerName, outcome, breakdown } = details;
  const chemistryLabel = chemistryFactor >= 0 ? `+${chemistryFactor}` : `${chemistryFactor}`;
  const chemistryMood = chemistryFactor >= 5 ? "Fireworks" : chemistryFactor >= 0 ? "Steady spark" : "Wobbly tension";

  clearResultEffects();
  resultEl.className = `result ${getResultClass(outcome.key)}`;
  resultEl.innerHTML = `
    <p class="result-score">${score}%</p>
    <div class="result-title-row">
      <span class="result-icon" aria-hidden="true">${outcome.icon}</span>
      <h3>${outcome.title}</h3>
    </div>
    <p>${partnerName} might just be the perfect plus-one for this pastel whirlwind.</p>
    <p>${outcome.description}</p>
    <p class="helper-text">${getOutcomeVariation(outcome.key)}</p>
    <div class="breakdown">
      <div class="breakdown-card">
        <strong>Score breakdown</strong>
        <div class="chips">
          <span class="chip">Base ${breakdown.base}</span>
          <span class="chip">Shared +${breakdown.sharedTraitPoints}</span>
          <span class="chip">Desired +${breakdown.desiredMatchPoints}</span>
          <span class="chip">Style ${styleMatched ? `+${breakdown.stylePoints}` : "+0"}</span>
          <span class="chip">Role +${breakdown.rolePoints}</span>
          <span class="chip">Chemistry ${chemistryLabel}</span>
        </div>
      </div>
      <div class="breakdown-card">
        <strong>Match notes</strong>
        <div class="chips">
          <span class="chip">Shared traits: ${sharedTraits.length ? sharedTraits.map(capitalize).join(", ") : "None"}</span>
          <span class="chip">Desired matches: ${desiredMatches.length ? desiredMatches.map(capitalize).join(", ") : "None"}</span>
          <span class="chip">Chemistry vibe: ${chemistryMood}</span>
        </div>
      </div>
    </div>
  `;

  if (score >= 80) {
    launchConfetti();
  }
}

function getResultClass(outcomeKey) {
  if (outcomeKey === "dream") {
    return "dream";
  }

  if (outcomeKey === "beautiful") {
    return "sparkle";
  }

  if (outcomeKey === "runaway") {
    return "runaway";
  }

  return "";
}

function clearResultEffects() {
  resultEl.querySelectorAll(".confetti-piece").forEach((piece) => piece.remove());
}

function launchConfetti() {
  const colors = ["#ffd6a5", "#ffcad4", "#cdb4db", "#b8e0d2", "#a7c7e7"];

  for (let index = 0; index < 18; index += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${randomNumber(2, 96)}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${index * 0.03}s`;
    resultEl.appendChild(piece);
  }
}

function showMatchmakingOverlay() {
  let messageIndex = 0;

  matchmakingMessageEl.textContent = matchmakingMessages[0];
  overlayEl.classList.remove("hidden");
  overlayEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("overlay-open");
  setInteractionDisabled(true);

  matchmakingIntervalId = window.setInterval(() => {
    messageIndex = (messageIndex + 1) % matchmakingMessages.length;
    matchmakingMessageEl.textContent = matchmakingMessages[messageIndex];
  }, 550);
}

function hideMatchmakingOverlay() {
  window.clearInterval(matchmakingIntervalId);
  overlayEl.classList.add("hidden");
  overlayEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overlay-open");
  setInteractionDisabled(false);
}

function setInteractionDisabled(isDisabled) {
  matchmakeBtn.disabled = isDisabled;
  musicToggleBtn.disabled = isDisabled;
  document.querySelectorAll("input").forEach((input) => {
    input.disabled = isDisabled;
  });
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function collectPerson1() {
  return {
    role: getSelectedRadioValue("person1-role"),
    style: getSelectedRadioValue("person1-style"),
    vibe: getSelectedRadioValue("player-vibe"),
    traits: getSelectedCheckboxValues("person1-traits"),
    desiredTraits: getSelectedCheckboxValues("desired-traits")
  };
}

function validateMatchmakingState(person1, partner) {
  if (person1.traits.length === 0) {
    renderMessage("Choose at least 1 personality trait for Person 1 before matchmaking.", true);
    return false;
  }

  if (person1.desiredTraits.length === 0) {
    renderMessage("Choose at least 1 desired partner trait to make the match meaningful.", true);
    return false;
  }

  if (!partner) {
    renderMessage("Select a partner before clicking Matchmake.", true);
    return false;
  }

  return true;
}

async function handleMatchmake() {
  const person1 = collectPerson1();
  const partnerRole = getSelectedRadioValue("partner-role");
  const selectedPartnerName = getSelectedRadioValue("selected-partner");
  const partner = (partners[partnerRole] || []).find((item) => item.name === selectedPartnerName);

  if (!validateMatchmakingState(person1, partner)) {
    return;
  }

  showMatchmakingOverlay();

  await delay(randomNumber(1200, 1900));

  const compatibility = calculateCompatibility(person1, partner);
  const outcome = getOutcome(compatibility.score);

  hideMatchmakingOverlay();
  renderResult({
    ...compatibility,
    partnerName: partner.name,
    outcome
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function toggleMusic() {
  if (weddingAudio.paused) {
    try {
      if (!musicHasStarted) {
        weddingAudio.volume = 0;
      }

      await weddingAudio.play();
      musicHasStarted = true;
      updateMusicButton(true);
      fadeAudioTo(MUSIC_TARGET_VOLUME, 700);
    } catch (error) {
      renderMessage("The music could not start in this browser until a direct button press is fully allowed.", true);
    }

    return;
  }

  weddingAudio.pause();
  updateMusicButton(false);
}

function updateMusicButton(isPlaying) {
  musicToggleBtn.textContent = isPlaying ? "Pause Music" : "Play Music";
  musicToggleBtn.setAttribute("aria-pressed", String(isPlaying));
}

function fadeAudioTo(targetVolume, durationMs) {
  const startingVolume = weddingAudio.volume;
  const steps = 12;
  const volumeStep = (targetVolume - startingVolume) / steps;
  const intervalDuration = durationMs / steps;
  let currentStep = 0;

  const intervalId = window.setInterval(() => {
    currentStep += 1;
    weddingAudio.volume = Math.max(0, Math.min(1, startingVolume + volumeStep * currentStep));

    if (currentStep >= steps) {
      weddingAudio.volume = targetVolume;
      window.clearInterval(intervalId);
    }
  }, intervalDuration);
}

function bindChoiceUpdates() {
  document.querySelectorAll('input[name="partner-role"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      renderPartners(radio.value);
      renderPlaceholder();
    });
  });

  document.querySelectorAll('input[name="person1-role"], input[name="person1-style"], input[name="player-vibe"]').forEach((input) => {
    input.addEventListener("change", () => {
      updatePlayerCard();

      if (resultEl.classList.contains("error")) {
        renderPlaceholder();
      }
    });
  });

  partnerListEl.addEventListener("change", (event) => {
    if (event.target.matches('input[name="selected-partner"]') && resultEl.classList.contains("error")) {
      renderPlaceholder();
    }
  });
}

function initializeAudio() {
  weddingAudio.volume = MUSIC_TARGET_VOLUME;
  weddingAudio.loop = true;
  weddingAudio.addEventListener("play", () => updateMusicButton(true));
  weddingAudio.addEventListener("pause", () => updateMusicButton(false));
}

matchmakeBtn.addEventListener("click", handleMatchmake);
musicToggleBtn.addEventListener("click", toggleMusic);

setupTraitLimits("person1-traits");
setupTraitLimits("desired-traits");
renderPartners(getSelectedRadioValue("partner-role"));
bindChoiceUpdates();
updatePlayerCard();
initializeAudio();
renderPlaceholder();
