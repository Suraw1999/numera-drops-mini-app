const tg = window.Telegram?.WebApp;

const config = {
  maxSelection: 5,
  spotPrice: 1.5,
  supportUrl: "https://t.me/+VuFHuRO4a8k0NmIx",
  paidNumbers: ["04", "18", "27", "63", "88", "91"],
  reservedNumbers: ["12", "39", "57"],
  emojis: ["◆", "✦", "●", "◇", "✧", "■"]
};

const state = {
  selected: new Set(),
  revealed: new Set(["07", "22", "41", "72"])
};

const grid = document.querySelector("#numberGrid");
const selectedCount = document.querySelector("#selectedCount");
const selectedNumbers = document.querySelector("#selectedNumbers");
const totalAmount = document.querySelector("#totalAmount");
const reserveButton = document.querySelector("#reserveButton");
const clearSelection = document.querySelector("#clearSelection");
const randomPick = document.querySelector("#randomPick");
const confirmedCount = document.querySelector("#confirmedCount");
const progressBar = document.querySelector("#progressBar");
const participantId = document.querySelector("#participantId");

function initTelegram() {
  if (!tg) return;
  tg.ready();
  tg.expand();
  tg.MainButton.setText("Reservar selección");
  tg.MainButton.onClick(sendReservation);

  const userId = tg.initDataUnsafe?.user?.id;
  if (userId) {
    participantId.textContent = `TG-${String(userId).slice(-4).padStart(4, "0")}`;
  }
}

function formatNumber(index) {
  return String(index).padStart(2, "0");
}

function renderGrid() {
  grid.innerHTML = "";
  for (let index = 0; index < 100; index += 1) {
    const id = formatNumber(index);
    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "tile";
    tile.dataset.id = id;
    tile.dataset.emoji = config.emojis[index % config.emojis.length];
    tile.textContent = id;
    tile.setAttribute("aria-label", `Número ${id}`);

    if (config.paidNumbers.includes(id)) {
      tile.classList.add("paid");
      tile.disabled = true;
    } else if (config.reservedNumbers.includes(id)) {
      tile.classList.add("reserved");
      tile.disabled = true;
    } else if (!state.revealed.has(id) && !state.selected.has(id)) {
      tile.classList.add("covered");
    }

    if (state.selected.has(id)) {
      tile.classList.add("selected");
    }

    tile.addEventListener("click", () => toggleTile(id));
    grid.appendChild(tile);
  }
}

function toggleTile(id) {
  if (config.paidNumbers.includes(id) || config.reservedNumbers.includes(id)) return;

  state.revealed.add(id);
  if (state.selected.has(id)) {
    state.selected.delete(id);
  } else {
    if (state.selected.size >= config.maxSelection) {
      pulseReserveButton();
      return;
    }
    state.selected.add(id);
  }

  render();
}

function randomSelection() {
  const available = Array.from({ length: 100 }, (_, index) => formatNumber(index)).filter(
    (id) => !config.paidNumbers.includes(id) && !config.reservedNumbers.includes(id)
  );

  state.selected.clear();
  shuffle(available)
    .slice(0, config.maxSelection)
    .forEach((id) => {
      state.selected.add(id);
      state.revealed.add(id);
    });
  render();
}

function shuffle(values) {
  const copy = [...values];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderSelection() {
  const numbers = [...state.selected].sort();
  selectedCount.textContent = String(numbers.length);
  selectedNumbers.textContent = numbers.length ? numbers.join(", ") : "Ninguno";
  totalAmount.textContent = `${(numbers.length * config.spotPrice).toFixed(numbers.length ? 1 : 0)} USDC`;
  reserveButton.disabled = numbers.length === 0;

  if (tg) {
    if (numbers.length) {
      tg.MainButton.show();
      tg.MainButton.enable();
      tg.MainButton.setText(`Reservar ${numbers.length} número${numbers.length > 1 ? "s" : ""}`);
    } else {
      tg.MainButton.hide();
    }
  }
}

function renderProgress() {
  const confirmed = config.paidNumbers.length + 34;
  confirmedCount.textContent = String(confirmed);
  progressBar.style.width = `${Math.min(100, (confirmed / 60) * 100)}%`;
}

function pulseReserveButton() {
  reserveButton.animate(
    [
      { transform: "translateX(0)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(4px)" },
      { transform: "translateX(0)" }
    ],
    { duration: 180, iterations: 1 }
  );
}

function sendReservation() {
  const numbers = [...state.selected].sort();
  if (!numbers.length) return;

  const payload = {
    action: "reserve",
    numbers,
    amount: numbers.length * config.spotPrice
  };

  if (tg?.sendData) {
    tg.sendData(JSON.stringify(payload));
    return;
  }

  window.alert(`Reserva demo: ${numbers.join(", ")} · ${payload.amount} USDC`);
}

function render() {
  renderGrid();
  renderSelection();
  renderProgress();
}

clearSelection.addEventListener("click", () => {
  state.selected.clear();
  render();
});

randomPick.addEventListener("click", randomSelection);
reserveButton.addEventListener("click", sendReservation);

initTelegram();
render();
