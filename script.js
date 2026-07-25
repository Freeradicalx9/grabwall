let wallpapers = [];
let bundles = [];
let activeCat = "All";

async function loadWallpapers(){
  try{
    const res = await fetch("data.json");
    const data = await res.json();
    wallpapers = data.wallpapers || [];
    bundles = data.bundles || [];
    renderGrid();
    renderBundles();
  }catch(e){
    console.error("Could not load data.json", e);
  }
}

function renderBundles(){
  const row = document.getElementById("bundle-row");
  if(!row) return;
  row.innerHTML = "";
  bundles.forEach(b => {
    const card = document.createElement("a");
    card.className = "bundle-card";
    card.href = `bundle/${b.id}.html`;
    const previewIds = b.items.slice(0, 3);
    card.innerHTML = `
      <div class="bundle-stack">
        ${previewIds.map(id => `<img src="images/${id}-thumb.jpg" alt="">`).join("")}
      </div>
      <h3>${b.title}</h3>
      <p class="bundle-desc">${b.description}</p>
      <div class="bundle-meta">
        <span class="bundle-count">${b.items.length} wallpapers</span>
        <span class="bundle-price">₹${b.price}</span>
      </div>
    `;
    card.addEventListener("click", (e) => { e.preventDefault(); openBundleModal(b); });
    row.appendChild(card);
  });
}

function openBundleModal(b){
  document.getElementById("bundle-modal-title").textContent = b.title;
  document.getElementById("bundle-modal-desc").textContent = b.description;
  document.getElementById("bundle-modal-price").textContent = `₹${b.price}`;
  document.getElementById("bundle-modal-buy").href = b.paymentLink;
  document.getElementById("bundle-modal-thumbs").innerHTML =
    b.items.map(id => `<img src="images/${id}-thumb.jpg" alt="">`).join("");
  document.getElementById("bundle-modal").classList.add("open");
}

document.getElementById("bundle-modal-close").addEventListener("click", () => {
  document.getElementById("bundle-modal").classList.remove("open");
});
document.getElementById("bundle-modal").addEventListener("click", (e) => {
  if(e.target.id === "bundle-modal") e.target.classList.remove("open");
});

function renderGrid(){
  const grid = document.getElementById("wallpaper-grid");
  grid.innerHTML = "";
  const list = activeCat === "All" ? wallpapers : wallpapers.filter(w => w.category === activeCat);

  list.forEach(w => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = `wallpaper/${w.id}.html`;
    card.innerHTML = `
      <img src="images/${w.id}-thumb.jpg" alt="${w.title} — ${w.category} wallpaper for phone and desktop" loading="lazy">
      <span class="card-cat">${w.category}</span>
      <span class="card-tag">${w.title}</span>
      <div class="peel"><span class="price">₹${w.price}</span></div>
    `;
    card.addEventListener("click", (e) => { e.preventDefault(); openModal(w); });
    grid.appendChild(card);
  });
}

function openModal(w){
  document.getElementById("modal-img").src = `images/${w.id}.jpg`;
  document.getElementById("modal-title").textContent = w.title;
  document.getElementById("modal-cat").textContent = w.category;
  document.getElementById("modal-price").textContent = `₹${w.price}`;
  document.getElementById("modal-buy").href = w.paymentLink;
  document.getElementById("preview-modal").classList.add("open");
}

function closeModal(){
  document.getElementById("preview-modal").classList.remove("open");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("preview-modal").addEventListener("click", (e) => {
  if(e.target.id === "preview-modal") closeModal();
});

document.getElementById("filters").addEventListener("click", (e) => {
  if(!e.target.classList.contains("filter-pill")) return;
  document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
  e.target.classList.add("active");
  activeCat = e.target.dataset.cat;
  renderGrid();
});

// Hero phone/desktop toggle
const heroPreviewImages = ["violet-hour", "midnight-neon", "sakura-dream", "glacier"];
let heroIndex = 0;
document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const mock = document.getElementById("hero-preview").parentElement;
    if(btn.dataset.frame === "desktop"){
      mock.classList.add("desktop");
    }else{
      mock.classList.remove("desktop");
    }
  });
});

loadWallpapers();
