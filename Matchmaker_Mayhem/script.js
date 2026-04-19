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

const resultEl = document.getElementById("result");
const partnerListEl = document.getElementById("partner-list");
const matchmakeBtn = document.getElementById("matchmake-btn");

const TRAIT_LIMIT = 2;

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
    });
  });
}

function getSelectedRadioValue(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function getSelectedCheckboxValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function renderPartners(role) {
  const rolePartners = partners[role] || [];

  partnerListEl.innerHTML = rolePartners
    .map((partner, index) => `
      <label class="partner-card">
        <input type="radio" name="selected-partner" value="${partner.name}" ${index === 0 ? "checked" : ""}>
        <div class="card-content">
          <h3>${partner.name}</h3>
          <p class="meta">${partner.role} • ${capitalize(partner.style)} style</p>
          <p class="traits">Traits: ${partner.traits.map(capitalize).join(", ")}</p>
        </div>
      </label>
    `)
    .join("");
}

function calculateCompatibility(person1, partner) {
  let score = 10;

  const sharedTraits = person1.traits.filter((trait) => partner.traits.includes(trait));
  const desiredMatches = person1.desiredTraits.filter((trait) => partner.traits.includes(trait));

  score += sharedTraits.length * 25;
  score += desiredMatches.length * 20;

  if (person1.style === partner.style) {
    score += 10;
  }

  if (person1.role !== partner.role) {
    score += 5;
  }

  score = Math.min(score, 100);

  return {
    score,
    sharedTraits,
    desiredMatches,
    styleMatched: person1.style === partner.style
  };
}

function getOutcome(score) {
  if (score >= 80) {
    return {
      title: "Dream Wedding",
      description: "Champagne sparkles, vows land perfectly, and every guest leaves convinced they witnessed a legendary love story."
    };
  }

  if (score >= 50) {
    return {
      title: "Beautiful but Chaotic Wedding",
      description: "The chemistry is strong, but so is the chance of a surprise dance battle, late bouquet, or a wildly emotional toast."
    };
  }

  if (score >= 20) {
    return {
      title: "Drama-Filled Wedding",
      description: "There is attraction here, but the seating chart may start a feud and somebody is definitely making a dramatic exit."
    };
  }

  return {
    title: "Runaway Wedding",
    description: "This match is hanging on by a glitter-covered thread. Keep the getaway car ready just in case the vows never happen."
  };
}

function renderPlaceholder() {
  resultEl.className = "result empty";
  resultEl.innerHTML = "<p>Your compatibility score and wedding story will appear here.</p>";
}

function renderMessage(message, isError = false) {
  resultEl.className = `result ${isError ? "error" : ""}`;
  resultEl.innerHTML = `<p>${message}</p>`;
}

function renderResult(details) {
  const { score, sharedTraits, desiredMatches, styleMatched, partnerName, outcome } = details;

  const chips = [
    `Shared traits: ${sharedTraits.length ? sharedTraits.map(capitalize).join(", ") : "None"}`,
    `Desired trait matches: ${desiredMatches.length ? desiredMatches.map(capitalize).join(", ") : "None"}`,
    `Style bonus: ${styleMatched ? "Yes" : "No"}`
  ];

  resultEl.className = "result";
  resultEl.innerHTML = `
    <p class="result-score">${score}%</p>
    <h3>${outcome.title}</h3>
    <p>${partnerName} might just be the perfect plus-one for this wild celebration.</p>
    <p>${outcome.description}</p>
    <div class="chips">
      ${chips.map((chip) => `<span class="chip">${chip}</span>`).join("")}
    </div>
  `;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function handleMatchmake() {
  const person1 = {
    role: getSelectedRadioValue("person1-role"),
    style: getSelectedRadioValue("person1-style"),
    traits: getSelectedCheckboxValues("person1-traits"),
    desiredTraits: getSelectedCheckboxValues("desired-traits")
  };

  const partnerRole = getSelectedRadioValue("partner-role");
  const selectedPartnerName = getSelectedRadioValue("selected-partner");
  const partner = (partners[partnerRole] || []).find((item) => item.name === selectedPartnerName);

  if (person1.traits.length === 0) {
    renderMessage("Choose at least 1 personality trait for Person 1 before matchmaking.", true);
    return;
  }

  if (person1.desiredTraits.length === 0) {
    renderMessage("Choose at least 1 desired partner trait to make the match meaningful.", true);
    return;
  }

  if (!partner) {
    renderMessage("Select a partner before clicking Matchmake.", true);
    return;
  }

  const compatibility = calculateCompatibility(person1, partner);
  const outcome = getOutcome(compatibility.score);

  renderResult({
    ...compatibility,
    partnerName: partner.name,
    outcome
  });
}

document.querySelectorAll('input[name="partner-role"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    renderPartners(radio.value);
    renderPlaceholder();
  });
});

matchmakeBtn.addEventListener("click", handleMatchmake);

setupTraitLimits("person1-traits");
setupTraitLimits("desired-traits");
renderPartners(getSelectedRadioValue("partner-role"));
renderPlaceholder();
