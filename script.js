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

const descriptionMap = {
  Ava: "A sweet daydreamer who loves gentle moments and soft romance.",
  Samantha: "A polished social star who treats every entrance like a scene-stealer.",
  Carmen: "A fearless flirt with whirlwind energy and spontaneous plans.",
  Felicity: "A graceful storybook soul who keeps every detail heartfelt.",
  Justin: "A warmhearted charmer who wears his feelings right on his sleeve.",
  Antonio: "A bold showstopper with magnetic confidence and big gestures.",
  Felix: "A thoughtful introvert with cozy calm and dependable energy.",
  Douglas: "A refined romantic with elegant taste and steady devotion."
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

const preferenceBonusValues = {
  "cake-flavor": 3,
  "music-type": 4,
  "invitation-style": 2
};

const partnerPreferenceMap = {
  Ava: { "cake-flavor": "strawberry", "music-type": "acoustic", "invitation-style": "floral" },
  Samantha: { "cake-flavor": "red velvet", "music-type": "DJ", "invitation-style": "modern" },
  Carmen: { "cake-flavor": "chocolate", "music-type": "live band", "invitation-style": "modern" },
  Felicity: { "cake-flavor": "vanilla", "music-type": "orchestra", "invitation-style": "elegant" },
  Justin: { "cake-flavor": "strawberry", "music-type": "acoustic", "invitation-style": "vintage" },
  Antonio: { "cake-flavor": "red velvet", "music-type": "live band", "invitation-style": "modern" },
  Felix: { "cake-flavor": "vanilla", "music-type": "orchestra", "invitation-style": "elegant" },
  Douglas: { "cake-flavor": "chocolate", "music-type": "orchestra", "invitation-style": "vintage" }
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

const slides = Array.from(document.querySelectorAll(".wizard-slide"));
const resultEl = document.getElementById("result");
const partnerListEl = document.getElementById("partner-list");
const matchmakeBtn = document.getElementById("matchmake-btn");
const overlayEl = document.getElementById("matchmaking-overlay");
const matchmakingMessageEl = document.getElementById("matchmaking-message");
const gameplayPopupEl = document.getElementById("gameplay-popup");
const gameplayPopupKickerEl = document.getElementById("gameplay-popup-kicker");
const gameplayPopupTitleEl = document.getElementById("gameplay-popup-title");
const gameplayPopupMessageEl = document.getElementById("gameplay-popup-message");
const gameplayPopupScoreEl = document.getElementById("gameplay-popup-score");
const musicToggleBtn = document.getElementById("music-toggle");
const playAgainBtn = document.getElementById("play-again-btn");
const resultActionsEl = document.getElementById("result-actions");
const statusMessageEl = document.getElementById("status-message");
const weddingAudio = document.getElementById("wedding-audio");
const playerAvatarEl = document.getElementById("player-avatar");
const playerRoleStyleEl = document.getElementById("player-role-style");
const playerTraitSummaryEl = document.getElementById("player-trait-summary");
const desiredTraitSummaryEl = document.getElementById("desired-trait-summary");
const weddingPreferenceSummaryEl = document.getElementById("wedding-preference-summary");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const progressLabelEl = document.getElementById("journey-progress");
const progressFillEl = document.getElementById("progress-fill");

const TRAIT_LIMIT = 2;
const MUSIC_TARGET_VOLUME = 0.25;
const TOTAL_SLIDES = slides.length;

let currentSlide = 0;
let matchmakingIntervalId = null;
let matchmakingTimeoutId = null;
let musicHasStarted = false;
let bonusScore = 0;

const minigames = [
  {
    name: "Cake Timing",
    kicker: "Minigame 1",
    outcomes: [
      { label: "Perfect", score: 10, message: "The cake lands on the table at the exact dreamy moment. Frosting destiny approved." },
      { label: "Good", score: 5, message: "The cake reveal is charming, even if the timing is a little offbeat." },
      { label: "Miss", score: -5, message: "The cake rollout wobbles and the room winces for one dramatic second." }
    ],
    weights: [0.32, 0.46, 0.22]
  },
  {
    name: "Bouquet Catch",
    kicker: "Minigame 2",
    outcomes: [
      { label: "Success", score: 6, message: "The bouquet arc is perfect and the crowd erupts in delighted cheers." },
      { label: "Miss", score: 0, message: "The bouquet slips through the chaos and lands in decorative shrubbery." }
    ],
    weights: [0.58, 0.42]
  },
  {
    name: "Dance Floor Hype",
    kicker: "Minigame 3",
    outcomes: [
      { label: "High energy", score: 8, message: "The dance floor is glowing and even the shy guests are fully committed." },
      { label: "Medium", score: 4, message: "The dance circle finds a cute rhythm and keeps the mood afloat." },
      { label: "Low", score: 0, message: "The dance floor energy is gentle, polite, and a little sleepy." }
    ],
    weights: [0.34, 0.4, 0.26]
  }
];

const npcEvents = [
  {
    npc: "Isabella",
    kicker: "NPC Event",
    title: "Isabella (Wedding Planner)",
    score: 8,
    message: "Isabella, your wedding planner, secures a huge discount that impresses the guests!"
  },
  {
    npc: "Your Family",
    kicker: "NPC Event",
    title: "Your Family",
    score: 6,
    message: "Your family unexpectedly turns the reception into a warm, supportive celebration that boosts the mood."
  },
  {
    npc: "Andrew",
    kicker: "NPC Event",
    title: "Andrew (Friend)",
    score: -10,
    message: "Your friend Andrew objects your wedding as a prank, creating an awkward moment."
  },
  {
    npc: "DJ Marvin",
    kicker: "NPC Event",
    title: "DJ Marvin",
    score: 5,
    message: "DJ Marvin saves the room with a flawless transition and the guests instantly recover their sparkle."
  },
  {
    npc: "DJ Marvin",
    kicker: "NPC Event",
    title: "DJ Marvin",
    score: -6,
    message: "DJ Marvin misreads the room with a chaotic remix and the crowd loses momentum for a while."
  }
];

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
  const weddingChoices = collectWeddingPreferences();

  playerAvatarEl.textContent = vibe;
  playerRoleStyleEl.textContent = `${role} • ${capitalize(style)} style • ${styleDescriptions[style]}`;
  playerTraitSummaryEl.innerHTML = createChipMarkup(traits, "Choose traits");
  desiredTraitSummaryEl.innerHTML = createChipMarkup(desiredTraits, "Choose preferences");
  weddingPreferenceSummaryEl.innerHTML = createChipMarkup(
    Object.values(weddingChoices).filter(Boolean),
    "Choose wedding details"
  );
}

function renderPartners(role, selectedPartnerName = "") {
  const rolePartners = partners[role] || [];

  partnerListEl.innerHTML = rolePartners
    .map((partner) => `
      <label class="partner-card">
        <input type="radio" name="selected-partner" value="${partner.name}" ${selectedPartnerName === partner.name ? "checked" : ""}>
        <div class="card-content">
          <div class="portrait-row">
            <div class="portrait-emoji" aria-hidden="true">${portraitMap[partner.name] || "💘"}</div>
            <span class="reaction-badge">${reactionMap[partner.name] || "Cute energy"}</span>
          </div>
          <h3>${partner.name}</h3>
          <p class="meta">${partner.role}</p>
          <p class="blurb">${descriptionMap[partner.name]}</p>
        </div>
      </label>
    `)
    .join("");
}

function collectWeddingPreferences() {
  return {
    cakeFlavor: getSelectedRadioValue("cake-flavor"),
    musicType: getSelectedRadioValue("music-type"),
    invitationStyle: getSelectedRadioValue("invitation-style")
  };
}

function calculatePreferenceBonus(partner, preferences) {
  const partnerPreferences = partnerPreferenceMap[partner.name] || {};
  const matches = [];
  let bonus = 0;

  if (preferences.cakeFlavor && preferences.cakeFlavor === partnerPreferences["cake-flavor"]) {
    bonus += preferenceBonusValues["cake-flavor"];
    matches.push(`Cake +${preferenceBonusValues["cake-flavor"]}`);
  }

  if (preferences.musicType && preferences.musicType === partnerPreferences["music-type"]) {
    bonus += preferenceBonusValues["music-type"];
    matches.push(`Music +${preferenceBonusValues["music-type"]}`);
  }

  if (preferences.invitationStyle && preferences.invitationStyle === partnerPreferences["invitation-style"]) {
    bonus += preferenceBonusValues["invitation-style"];
    matches.push(`Invitation +${preferenceBonusValues["invitation-style"]}`);
  }

  return {
    bonus,
    matches
  };
}

function calculateCompatibility(person1, partner) {
  const sharedTraits = person1.traits.filter((trait) => partner.traits.includes(trait));
  const desiredMatches = person1.desiredTraits.filter((trait) => partner.traits.includes(trait));
  const sharedTraitPoints = sharedTraits.reduce((total, trait) => total + (traitWeights[trait] || 10), 0);
  const desiredMatchPoints = desiredMatches.reduce((total, trait) => total + (traitWeights[trait] || 10) + 4, 0);
  const stylePoints = person1.style === partner.style ? 14 : 0;
  const rolePoints = person1.role !== partner.role ? 8 : 0;
  const preferenceBonus = calculatePreferenceBonus(partner, person1.weddingPreferences);
  const chemistryFactor = randomNumber(-6, 8);

  let score = 18 + sharedTraitPoints + desiredMatchPoints + stylePoints + rolePoints + preferenceBonus.bonus + chemistryFactor + bonusScore;
  score = Math.max(0, Math.min(score, 100));

  return {
    score,
    sharedTraits,
    desiredMatches,
    styleMatched: person1.style === partner.style,
    chemistryFactor,
    preferenceMatches: preferenceBonus.matches,
    breakdown: {
      base: 18,
      sharedTraitPoints,
      desiredMatchPoints,
      stylePoints,
      rolePoints,
      preferenceBonus: preferenceBonus.bonus,
      chemistryFactor,
      bonusScore
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
  clearStatusMessage();
  togglePlayAgainButton(false);
  resultEl.className = "result empty";
  resultEl.innerHTML = "<p>Your compatibility score, chemistry notes, and wedding story will appear here.</p>";
}

function renderMessage(message, isError = false) {
  showStatusMessage(message, isError);
}

function renderResult(details) {
  const { score, sharedTraits, desiredMatches, styleMatched, chemistryFactor, partnerName, outcome, breakdown, preferenceMatches } = details;
  const chemistryLabel = chemistryFactor >= 0 ? `+${chemistryFactor}` : `${chemistryFactor}`;
  const chemistryMood = chemistryFactor >= 5 ? "Fireworks" : chemistryFactor >= 0 ? "Steady spark" : "Wobbly tension";
  const preferenceText = preferenceMatches.length ? preferenceMatches.join(", ") : "No wedding preference bonus";

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
          <span class="chip">Wedding +${breakdown.preferenceBonus}</span>
          <span class="chip">Minigames/NPC ${formatSignedScore(breakdown.bonusScore)}</span>
          <span class="chip">Chemistry ${chemistryLabel}</span>
        </div>
      </div>
      <div class="breakdown-card">
        <strong>Match notes</strong>
        <div class="chips">
          <span class="chip">Shared traits: ${sharedTraits.length ? sharedTraits.map(capitalize).join(", ") : "None"}</span>
          <span class="chip">Desired matches: ${desiredMatches.length ? desiredMatches.map(capitalize).join(", ") : "None"}</span>
          <span class="chip">${preferenceText}</span>
          <span class="chip">Wedding gameplay total: ${formatSignedScore(breakdown.bonusScore)}</span>
          <span class="chip">Chemistry vibe: ${chemistryMood}</span>
        </div>
      </div>
    </div>
  `;
  togglePlayAgainButton(true);

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

  clearMatchmakingTimers();
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

function showGameplayPopup({ kicker, title, message, score }) {
  gameplayPopupKickerEl.textContent = kicker;
  gameplayPopupTitleEl.textContent = title;
  gameplayPopupMessageEl.textContent = message;
  gameplayPopupScoreEl.textContent = `${formatSignedScore(score)} bonus`;
  gameplayPopupEl.classList.remove("hidden");
  gameplayPopupEl.setAttribute("aria-hidden", "false");
}

function hideGameplayPopup() {
  gameplayPopupEl.classList.add("hidden");
  gameplayPopupEl.setAttribute("aria-hidden", "true");
}

function hideMatchmakingOverlay() {
  clearMatchmakingTimers();
  overlayEl.classList.add("hidden");
  overlayEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("overlay-open");
  setInteractionDisabled(false);
}

function clearMatchmakingTimers() {
  if (matchmakingIntervalId) {
    window.clearInterval(matchmakingIntervalId);
    matchmakingIntervalId = null;
  }

  if (matchmakingTimeoutId) {
    window.clearTimeout(matchmakingTimeoutId);
    matchmakingTimeoutId = null;
  }
}

function formatSignedScore(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function setInteractionDisabled(isDisabled) {
  matchmakeBtn.disabled = isDisabled;
  musicToggleBtn.disabled = isDisabled;
  backBtn.disabled = isDisabled;
  nextBtn.disabled = isDisabled;
  document.querySelectorAll("input").forEach((input) => {
    input.disabled = isDisabled;
  });
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickWeightedOutcome(options, weights) {
  const roll = Math.random();
  let threshold = 0;

  for (let index = 0; index < options.length; index += 1) {
    threshold += weights[index];

    if (roll <= threshold) {
      return options[index];
    }
  }

  return options[options.length - 1];
}

function capitalize(value) {
  return value
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function collectPerson1() {
  return {
    role: getSelectedRadioValue("person1-role"),
    style: getSelectedRadioValue("person1-style"),
    vibe: getSelectedRadioValue("player-vibe"),
    traits: getSelectedCheckboxValues("person1-traits"),
    desiredTraits: getSelectedCheckboxValues("desired-traits"),
    weddingPreferences: collectWeddingPreferences()
  };
}

function validateSlide(index) {
  if (index === 1) {
    if (!getSelectedRadioValue("person1-role") || !getSelectedRadioValue("person1-style") || !getSelectedRadioValue("player-vibe")) {
      renderMessage("Complete the role, style, and vibe selections before continuing.", true);
      return false;
    }
  }

  if (index === 2) {
    if (getSelectedCheckboxValues("person1-traits").length === 0) {
      renderMessage("Choose at least 1 personality trait for Person 1 before continuing.", true);
      return false;
    }

    if (getSelectedCheckboxValues("desired-traits").length === 0) {
      renderMessage("Choose at least 1 desired partner trait before continuing.", true);
      return false;
    }
  }

  if (index === 3) {
    if (!getSelectedRadioValue("selected-partner")) {
      renderMessage("Select a partner before continuing.", true);
      return false;
    }
  }

  if (index === 4) {
    const preferences = collectWeddingPreferences();

    if (!preferences.cakeFlavor || !preferences.musicType || !preferences.invitationStyle) {
      renderMessage("Choose a cake flavor, music type, and invitation style before continuing.", true);
      return false;
    }
  }

  return true;
}

function updateNavigation() {
  progressLabelEl.textContent = `Step ${currentSlide + 1} of ${TOTAL_SLIDES}`;
  progressFillEl.style.width = `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%`;
  backBtn.disabled = currentSlide === 0;

  if (currentSlide >= TOTAL_SLIDES - 2) {
    nextBtn.classList.add("hidden-nav");
    nextBtn.style.visibility = "hidden";
  } else {
    nextBtn.classList.remove("hidden-nav");
    nextBtn.style.visibility = "visible";
    nextBtn.textContent = "Next";
  }
}

function goToSlide(index) {
  currentSlide = Math.max(0, Math.min(index, TOTAL_SLIDES - 1));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === currentSlide);
  });
  updateNavigation();
}

function showStatusMessage(message, isError = true) {
  statusMessageEl.textContent = message;
  statusMessageEl.classList.remove("hidden");
  statusMessageEl.style.color = isError ? "" : "#537f6b";
}

function clearStatusMessage() {
  statusMessageEl.textContent = "";
  statusMessageEl.classList.add("hidden");
  statusMessageEl.style.color = "";
}

function nextSlide() {
  const targetIndex = currentSlide + 1;

  if (targetIndex >= TOTAL_SLIDES || !validateSlide(targetIndex)) {
    return;
  }

  clearStatusMessage();
  goToSlide(targetIndex);
}

function prevSlide() {
  if (currentSlide === 0) {
    return;
  }

  clearStatusMessage();
  goToSlide(currentSlide - 1);
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
    renderMessage("Select a partner before clicking Start Matchmaking.", true);
    return false;
  }

  const preferences = person1.weddingPreferences;

  if (!preferences.cakeFlavor || !preferences.musicType || !preferences.invitationStyle) {
    renderMessage("Finish the wedding preference slide before matchmaking.", true);
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

  hideMatchmakingOverlay();
  await runWeddingGameplaySequence();

  const compatibility = calculateCompatibility(person1, partner);
  const outcome = getOutcome(compatibility.score);

  clearStatusMessage();
  goToSlide(5);
  renderResult({
    ...compatibility,
    partnerName: partner.name,
    outcome
  });
}

function delay(ms) {
  return new Promise((resolve) => {
    matchmakingTimeoutId = window.setTimeout(() => {
      matchmakingTimeoutId = null;
      resolve();
    }, ms);
  });
}

async function runWeddingGameplaySequence() {
  bonusScore = 0;

  for (const minigame of minigames) {
    const outcome = pickWeightedOutcome(minigame.outcomes, minigame.weights);
    bonusScore += outcome.score;
    showGameplayPopup({
      kicker: minigame.kicker,
      title: `${minigame.name}: ${outcome.label}`,
      message: outcome.message,
      score: outcome.score
    });
    await delay(randomNumber(1100, 1700));
    hideGameplayPopup();
    await delay(180);
  }

  const npcEvent = npcEvents[randomNumber(0, npcEvents.length - 1)];
  bonusScore += npcEvent.score;
  showGameplayPopup({
    kicker: npcEvent.kicker,
    title: npcEvent.title,
    message: npcEvent.message,
    score: npcEvent.score
  });
  await delay(randomNumber(1300, 1900));
  hideGameplayPopup();
}

function togglePlayAgainButton(shouldShow) {
  resultActionsEl.classList.toggle("hidden", !shouldShow);
}

function clearSelectedPartner() {
  document.querySelectorAll('input[name="selected-partner"]').forEach((input) => {
    input.checked = false;
  });
}

function resetToNewMatch() {
  clearMatchmakingTimers();
  bonusScore = 0;
  overlayEl.classList.add("hidden");
  overlayEl.setAttribute("aria-hidden", "true");
  hideGameplayPopup();
  document.body.classList.remove("overlay-open");
  clearResultEffects();
  clearSelectedPartner();
  togglePlayAgainButton(false);
  resultEl.classList.add("is-resetting");

  window.setTimeout(() => {
    renderPlaceholder();
    resultEl.classList.remove("is-resetting");
    goToSlide(0);
  }, 180);
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

      if (resultEl.classList.contains("error")) {
        renderPlaceholder();
      }
    });
  });

  document.querySelectorAll('input[name="person1-role"], input[name="person1-style"], input[name="player-vibe"], input[name="cake-flavor"], input[name="music-type"], input[name="invitation-style"]').forEach((input) => {
    input.addEventListener("change", () => {
      updatePlayerCard();
      clearStatusMessage();

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

backBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);
matchmakeBtn.addEventListener("click", handleMatchmake);
musicToggleBtn.addEventListener("click", toggleMusic);
playAgainBtn.addEventListener("click", resetToNewMatch);

setupTraitLimits("person1-traits");
setupTraitLimits("desired-traits");
renderPartners(getSelectedRadioValue("partner-role"));
bindChoiceUpdates();
updatePlayerCard();
initializeAudio();
renderPlaceholder();
goToSlide(0);
