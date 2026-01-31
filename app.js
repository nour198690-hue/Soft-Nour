const API = "https://api.alquran.cloud/v1";
let showTranslation = true;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

/* UI */
function toggleSettings() {
  document.getElementById("settings").classList.toggle("hidden");
}

function goHome() {
  document.getElementById("suraView").classList.add("hidden");
  document.getElementById("suraList").classList.remove("hidden");
}

function toggleTranslation() {
  showTranslation = !showTranslation;
  document.querySelectorAll(".ayah-es").forEach(e => {
    e.style.display = showTranslation ? "block" : "none";
  });
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

/* Tema */
function changeTheme(theme) {
  const themes = {
    rosa: "#fdecef",
    lila: "#f1e9f7",
    verde: "#e9f4ef",
    celeste: "#e8f3fb",
    crema: "#fff5e6",
    plomo: "#f0f0f0"
  };
  document.documentElement.style.setProperty("--bg", themes[theme]);
}

/* Suras */
async function loadSuras() {
  const res = await fetch(`${API}/surah`);
  const data = await res.json();

  const list = document.getElementById("suraList");
  list.innerHTML = "";

  data.data.forEach(sura => {
    const card = document.createElement("div");
    card.className = "sura-card";
    card.innerHTML = `
      <strong>${sura.number}. ${sura.englishName}</strong><br>
      <small>${sura.englishNameTranslation}</small>
    `;
    card.onclick = () => openSura(sura.number, sura.englishName);
    list.appendChild(card);
  });
}

/* Abrir sura */
async function openSura(number, name) {
  document.getElementById("suraList").classList.add("hidden");
  document.getElementById("suraView").classList.remove("hidden");
  document.getElementById("suraTitle").innerText = name;

  const res = await fetch(`${API}/surah/${number}/editions/quran-uthmani,es.asad`);
  const data = await res.json();

  const ar = data.data[0].ayahs;
  const es = data.data[1].ayahs;

  const container = document.getElementById("ayahContainer");
  container.innerHTML = "";

  ar.forEach((a, i) => {
    const div = document.createElement("div");
    div.className = "ayah";
    div.innerHTML = `
      <div class="ayah-ar">${a.text}</div>
      <div class="ayah-num">${a.numberInSurah}</div>
      <div class="ayah-es">${es[i].text}</div>
      <div class="ayah-actions">
        <button onclick="saveFavorite('${number}:${a.numberInSurah}')">🤍</button>
      </div>
    `;
    container.appendChild(div);
  });
}

/* Favoritos */
function saveFavorite(id) {
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Aleya guardada 🤍");
  }
}

function showFavorites() {
  alert("Página de favoritos (lista lista para extender)");
}

/* Init */
loadSuras();
