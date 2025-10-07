// ==================== CONFIG ====================
const api_key = "26598474b20888815634fdfe3de15996"; // Your GNews key
const base_url = "https://gnews.io/api/v4/top-headlines";

// ==================== LOAD DEFAULT ====================
window.addEventListener("load", () => fetchNews("world"));

// ==================== FETCH NEWS ====================
async function fetchNews(categoryOrQuery = "general", isCategory = true) {
  try {
    let url = "";
    if (isCategory) {
      url = `${base_url}?token=${api_key}&topic=${categoryOrQuery}&lang=en`;
    } else {
      url = `${base_url}?token=${api_key}&q=${categoryOrQuery}&lang=en`;
    }

    const res = await fetch(url);
    const data = await res.json();

    displayArticles(data.articles || []);
  } catch (error) {
    console.error("Error fetching news:", error);
    const cardsContainer = document.getElementById("cards-container");
    cardsContainer.innerHTML = `<p>Error fetching news. Try again later.</p>`;
  }
}

// ==================== DISPLAY ARTICLES ====================
function displayArticles(articles = []) {
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    cardsContainer.innerHTML = `<p>No articles found. Try another search.</p>`;
    return;
  }

  articles.forEach((article) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${
        article.image || "https://via.placeholder.com/300x180"
      }" alt="news" />
      <div class="card-containt">
        <h3>${article.title || "No Title"}</h3>
        <p>${article.description || "No description available."}</p>
        <p class="news-source">
          <b>${article.source?.name || "Source"}</b> – 
          ${new Date(article.publishedAt).toLocaleDateString()}
        </p>
      </div>
    `;
    card.addEventListener("click", () => window.open(article.url, "_blank"));
    cardsContainer.appendChild(card);
  });
}

// ==================== SEARCH FUNCTION ====================
document.getElementById("search-btn").addEventListener("click", () => {
  const query = document.getElementById("search-input").value.trim();
  if (query) fetchNews(query, false);
});

// ==================== DROPDOWN MENU ====================
document.querySelector(".user-menu button").addEventListener("click", () => {
  document.querySelector(".dropdown-menu").classList.toggle("show");
});

// ==================== HAMBURGER MENU ====================
const hamburger = document.querySelector(".hamburger");
const cancelBtn = document.querySelector(".hamburger-cancel");
const navContainer = document.querySelector(".main-navigation .nav-container");

hamburger.addEventListener("click", () => {
  navContainer.classList.add("active");
  hamburger.style.display = "none";
  cancelBtn.style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  navContainer.classList.remove("active");
  hamburger.style.display = "block";
  cancelBtn.style.display = "none";
});

// ==================== NAVIGATION ITEMS ====================
const navItems = document.querySelectorAll(".nav-item");
let curSelectedNav = document.querySelector(".nav-item.active");

const categoryMap = {
  latest: "general",
  "top-stories": "world",
  trending: "nation",
  sports: "sports",
  entertainment: "entertainment",
  stock: "business",
};

navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    const category = categoryMap[item.id] || "general";
    fetchNews(category, true);

    if (curSelectedNav) curSelectedNav.classList.remove("active");
    item.classList.add("active");
    curSelectedNav = item;

    if (window.innerWidth <= 768) {
      navContainer.classList.remove("active");
      hamburger.style.display = "block";
      cancelBtn.style.display = "none";
    }
  });
});
