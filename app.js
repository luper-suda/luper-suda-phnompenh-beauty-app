/* ==========================================================================
   Phnom Penh Beauty Mobile App - Application Engine & Data Controller
   ========================================================================== */

// 1. i18n Dictionary (Khmer 🇰🇭 ↔ Korean 🇰🇷)
const I18N = {
  km: {
    brand_title: "Tida Beauty App",
    brand_subtitle: "",
    live_promo_tag: "🔥 បញ្ចុះតម្លៃពិសេស (Sale Live)",
    hero_title: "Tida Beauty App ៤៧៣ ហាង",
    hero_desc: "",
    stat_shops: "ហាងកែសម្ផស្ស",
    stat_posts: "ប្រវត្តិប្រកាស",
    stat_cats: "ប្រភេទ",
    section_35_cats: "ប្រភេទស្វែងរកកែសម្ផស្ស",
    step0_aligned: "",
    active_sales_heading: "🎁 ប្រូម៉ូសិនបញ្ចុះតម្លៃ",
    view_all: "មើលទាំងអស់ →",
    top_beauty_grid: "🌸 ផលិតផលពេញនិយម",
    search_placeholder: "ស្វែងរក ៣៥ ប្រភេទ, ម៉ាក, ឬឈ្មោះហាង...",
    district_all: "គ្រប់ខណ្ឌក្នុងភ្នំពេញ (១៥)",
    sale_pinpoint_btn: "តែប្រូម៉ូសិន",
    sort_date: "ប្រកាសថ្មីៗ",
    sort_price_low: "តម្លៃទាបទៅខ្ពស់",
    sort_price_high: "តម្លៃខ្ពស់ទៅទាប",
    wishlist_sub_title: "បញ្ជីចូលចិត្ត",
    orders_sub_title: "ប្រវត្តិទិញទំនិញ",
    nav_home: "ទំព័រដើម",
    nav_compare: "ប្រៀបធៀប",
    nav_wishlist: "ចូលចិត្ត",
  },
  kr: {
    brand_title: "티다 뷰티 앱",
    brand_subtitle: "",
    live_promo_tag: "🔥 실시간 세일 프로모션",
    hero_title: "티다 뷰티 473개 샵 실시간 세일 추적기",
    hero_desc: "",
    stat_shops: "마스터 샵",
    stat_posts: "타임라인 이력",
    stat_cats: "카테고리",
    section_35_cats: "뷰티 카테고리",
    step0_aligned: "",
    active_sales_heading: "🎁 실시간 할인 프로모션",
    view_all: "전체보기 →",
    top_beauty_grid: "🌸 인기 베스트셀러",
    search_placeholder: "카테고리, 브랜드, 상점명 검색...",
    district_all: "프놈펜 15개 전체 상권",
    sale_pinpoint_btn: "세일 샵만 보기",
    sort_date: "최신순",
    sort_price_low: "최저가순",
    sort_price_high: "최고가순",
    wishlist_sub_title: "좋아요 위시리스트",
    orders_sub_title: "구매 & 방문 이력",
    nav_home: "홈",
    nav_compare: "시세비교",
    nav_wishlist: "위시리스트",
  }
};

// Category i18n Dictionary (Khmer 🇰🇭 ↔ Korean 🇰🇷)
const CATEGORY_I18N = {
  km: {
    "ALL": "ទាំងអស់ (All)",
    "썬케어": "ថែទាំកម្តៅថ្ងៃ",
    "세럼/에센스": "សេរ៉ូម",
    "트러블케어": "ព្យាបាលមុន",
    "수분/보습": "ផ្តល់សំណើម",
    "토너/스킨": "តូណ័រ",
    "토너패드": "បន្ទះតូណ័រ",
    "마스크팩": "ម៉ាសបិទមុខ",
    "클렌징": "លាងសម្អាត",
    "색조": "គ្រឿងតុបតែង",
    "베이스": "ម្សៅទ្រនាប់",
    "아이": "តុបតែងភ្នែក",
    "바디케어": "ថែទាំរាងកាយ",
    "헤어케어": "ថែទាំសក់",
    "K-뷰티": "K-Beauty",
    "물광케어": "ផ្ទៃមុខរលោង",
    "미백케어": "ថែទាំស្បែកស"
  },
  kr: {
    "ALL": "전체 (All)",
    "썬케어": "썬케어",
    "세럼/에센스": "세럼/에센스",
    "트러블케어": "트러블케어",
    "수분/보습": "수분/보습",
    "토너/스킨": "토너/스킨",
    "토너패드": "토너패드",
    "마스크팩": "마스크팩",
    "클렌징": "클렌징",
    "색조": "색조",
    "베이스": "베이스",
    "아이": "아이",
    "바디케어": "바디케어",
    "헤어케어": "헤어케어",
    "K-뷰티": "K-뷰티",
    "물광케어": "물광케어",
    "미백케어": "미백케어"
  }
};

function getCategoryTranslation(cat) {
  if (CATEGORY_I18N[currentLang] && CATEGORY_I18N[currentLang][cat]) {
    return CATEGORY_I18N[currentLang][cat];
  }
  return cat;
}

// Global App State
let currentLang = 'km';
let timelineFeeds = [];
let wishlistSet = new Set(JSON.parse(localStorage.getItem('beauty_wishlist') || '[]'));
let activeCategoryFilter = 'ALL';
let isSaleOnlyFilter = false;
let priceHistoryChart = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  updateStatusClock();
  setInterval(updateStatusClock, 30000);
  await loadTimelineDataset();
  renderCategoryPills();
  renderActiveSaleCarousel();
  renderPopularProductsGrid();
  renderCompareResults();
  updateWishlistUI();
  initPriceHistoryChart();
});

// Update Mobile Hardware Status Bar Clock
function updateStatusClock() {
  const clockEl = document.getElementById("statusClock");
  if (clockEl) {
    const now = new Date();
    const hrs = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    clockEl.innerText = `${hrs}:${mins}`;
  }
}

// Load Dataset from JSON
async function loadTimelineDataset() {
  try {
    const res = await fetch("phnompenh_beauty_timeline_feeds.json");
    if (res.ok) {
      timelineFeeds = await res.json();
      console.log(`Loaded ${timelineFeeds.length} timeline items.`);
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (e) {
    console.warn("Falling back to embedded dataset", e);
    // Fallback sample feeds pointing to actual existing images
    timelineFeeds = [
      { shop_id: 1, shop_name: "SreyNeang Skincare", platform: "FACEBOOK", category_name: "썬케어", brand: "Anessa", product_name: "Anessa Sunscreen Milk UV 60ml", price_usd: 13.5, price_riel: 55350, is_promo_active: 1, district: "Sensok", posted_at: "2026-08-05 02:39:44", image_url: "images/products/prod_151_9f4001da48.jpg" },
      { shop_id: 2, shop_name: "BKK1 Beauty Corner", platform: "FACEBOOK", category_name: "세럼/에센스", brand: "COSRX", product_name: "COSRX Hydrating Niacinamide Serum", price_usd: 18.0, price_riel: 73800, is_promo_active: 1, district: "Chamkarmon", posted_at: "2026-08-04 03:39:44", image_url: "images/products/prod_157_ae11bc1281.jpg" },
      { shop_id: 3, shop_name: "Phnom Penh K-Beauty", platform: "INSTAGRAM", category_name: "트러블케어", brand: "Innisfree", product_name: "Innisfree Cica Repair Ampoule", price_usd: 21.0, price_riel: 86100, is_promo_active: 0, district: "Toul Kork", posted_at: "2026-08-03 01:20:00", image_url: "images/products/prod_1_33923781ea.jpg" },
      { shop_id: 4, shop_name: "Sensok Beauty Shop", platform: "FACEBOOK", category_name: "수분/보습", brand: "Laneige", product_name: "Laneige Water Bank Cream 50ml", price_usd: 29.0, price_riel: 118900, is_promo_active: 1, district: "Sensok", posted_at: "2026-08-02 11:15:00", image_url: "images/products/prod_2_3a8eec0ea9.jpg" }
    ];
  }
}

// Event Listeners
function setupEventListeners() {
  // i18n Language Toggle
  document.getElementById("langToggleBtn").addEventListener("click", () => {
    currentLang = currentLang === 'km' ? 'kr' : 'km';
    document.getElementById("langText").innerText = currentLang === 'km' ? 'ខ្មែរ' : '한국어';
    document.querySelector(".flag-icon").innerText = currentLang === 'km' ? '🇰🇭' : '🇰🇷';
    updateLanguageTexts();
  });

  // Dark/Light Theme Toggle
  document.getElementById("themeToggleBtn").addEventListener("click", () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute("data-theme", nextTheme);
    document.getElementById("themeToggleBtn").innerText = nextTheme === 'dark' ? '🌙' : '☀️';
  });

  // Search & Filter Controls
  document.getElementById("searchInput").addEventListener("input", renderCompareResults);
  document.getElementById("districtSelect").addEventListener("change", renderCompareResults);
  document.getElementById("sortSelect").addEventListener("change", renderCompareResults);
  
  // Real-time Sale Pinpoint Toggle
  document.getElementById("salePinpointBtn").addEventListener("click", (e) => {
    isSaleOnlyFilter = !isSaleOnlyFilter;
    e.currentTarget.classList.toggle("active", isSaleOnlyFilter);
    renderCompareResults();
  });
}

// i18n Text Updates
function updateLanguageTexts() {
  const langData = I18N[currentLang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (langData[key]) el.innerText = langData[key];
  });
  
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    const key = el.getAttribute("data-i18n-ph");
    if (langData[key]) el.placeholder = langData[key];
  });

  renderCategoryPills();
  renderActiveSaleCarousel();
  renderPopularProductsGrid();
  renderCompareResults();
}

let lastTabId = 'tab-home';

// Navigation Tab Switcher
function switchTab(tabId, options = {}) {
  const currentActive = document.querySelector(".tab-view.active");
  if (currentActive && currentActive.id !== 'tab-detail' && currentActive.id !== tabId) {
    lastTabId = currentActive.id;
  }

  document.querySelectorAll(".tab-view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  
  const targetView = document.getElementById(tabId);
  if (targetView) targetView.classList.add("active");
  
  if (tabId !== 'tab-detail') {
    const navBtnIndex = tabId === 'tab-home' ? 0 : tabId === 'tab-compare' ? 1 : 2;
    if (document.querySelectorAll(".nav-item")[navBtnIndex]) {
      document.querySelectorAll(".nav-item")[navBtnIndex].classList.add("active");
    }
  }

  if (tabId === 'tab-compare') {
    if (options.saleOnly) {
      isSaleOnlyFilter = true;
      document.getElementById("salePinpointBtn").classList.add("active");
    }
    renderCompareResults();
  }

  const container = document.querySelector('.app-container');
  if (container) container.scrollTop = 0;
}

function goBackFromDetail() {
  switchTab(lastTabId || 'tab-home');
}

function switchWishlistSubTab(subType) {
  document.getElementById("wishlistSubBtn").classList.toggle("active", subType === 'wishlist');
  document.getElementById("ordersSubBtn").classList.toggle("active", subType === 'orders');
  document.getElementById("wishlistView").classList.toggle("active", subType === 'wishlist');
  document.getElementById("ordersView").classList.toggle("active", subType === 'orders');
}

// Render 35 Beauty Category Pills
function renderCategoryPills() {
  const container = document.getElementById("categoryPillContainer");
  const categories = ["ALL", "썬케어", "세럼/에센스", "트러블케어", "수분/보습", "토너/스킨", "토너패드", "마스크팩", "클렌징", "색조", "베이스", "아이", "바디케어", "헤어케어", "K-뷰티", "물광케어", "미백케어"];
  
  container.innerHTML = categories.map(cat => `
    <button class="cat-pill ${cat === activeCategoryFilter ? 'active' : ''}" onclick="filterCategory('${cat}')">
      ${getCategoryTranslation(cat)}
    </button>
  `).join("");
}

function filterCategory(cat) {
  activeCategoryFilter = cat;
  renderCategoryPills();
  renderPopularProductsGrid();
  renderCompareResults();
}

// Helper: Deduplicate feeds by product_name, selecting the post with the lowest price (프놈펜 최저가 샵)
function getDeduplicatedFeeds(feedList) {
  const map = new Map();
  feedList.forEach(f => {
    const pname = f.product_name;
    if (!map.has(pname) || f.price_usd < map.get(pname).price_usd) {
      map.set(pname, f);
    }
  });
  return Array.from(map.values());
}

// Render Active Sales Carousel (is_promo_active = 1)
function renderActiveSaleCarousel() {
  const container = document.getElementById("activeSaleContainer");
  const saleFeeds = timelineFeeds.filter(f => f.is_promo_active === 1);
  const dedupedSales = getDeduplicatedFeeds(saleFeeds);
  container.innerHTML = dedupedSales.slice(0, 10).map(feed => createProductCardHTML(feed)).join("");
}

// Render Popular Products Grid
function renderPopularProductsGrid() {
  const container = document.getElementById("popularGridContainer");
  let feeds = timelineFeeds;
  if (activeCategoryFilter !== 'ALL') {
    feeds = feeds.filter(f => f.category_name === activeCategoryFilter);
  }
  const deduped = getDeduplicatedFeeds(feeds);
  container.innerHTML = deduped.map(feed => createProductCardHTML(feed)).join("");
}

// Render Compare Tab Results
function renderCompareResults() {
  const container = document.getElementById("compareResultsContainer");
  const searchQ = document.getElementById("searchInput").value.toLowerCase();
  const districtQ = document.getElementById("districtSelect").value;
  const sortQ = document.getElementById("sortSelect").value;
  
  let filtered = timelineFeeds.filter(f => {
    const matchCategory = activeCategoryFilter === 'ALL' || f.category_name === activeCategoryFilter;
    const matchSearch = f.product_name.toLowerCase().includes(searchQ) || f.brand.toLowerCase().includes(searchQ) || f.shop_name.toLowerCase().includes(searchQ) || f.category_name.toLowerCase().includes(searchQ);
    const matchDistrict = districtQ === 'ALL' || f.district === districtQ;
    const matchSale = !isSaleOnlyFilter || f.is_promo_active === 1;
    return matchCategory && matchSearch && matchDistrict && matchSale;
  });

  const deduped = getDeduplicatedFeeds(filtered);

  if (sortQ === 'PRICE_ASC') deduped.sort((a, b) => a.price_usd - b.price_usd);
  else if (sortQ === 'PRICE_DESC') deduped.sort((a, b) => b.price_usd - a.price_usd);
  
  container.innerHTML = deduped.map(feed => createProductCardHTML(feed)).join("");
}

// SVG Fallback for products
const SVG_FALLBACK = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 200 200' fill='%23f0f2f5'><rect width='200' height='200' fill='%23fdfbf7'/><path d='M70 60 C70 45, 130 45, 130 60 L130 160 C130 170, 70 170, 70 160 Z' fill='%23fbcfe8' stroke='%23ec4899' stroke-width='3'/><rect x='85' y='30' width='30' height='20' rx='4' fill='%23f59e0b'/><text x='100' y='115' font-family='sans-serif' font-size='12' font-weight='bold' fill='%23ec4899' text-anchor='middle'>BEAUTY</text></svg>";

// Product Card HTML Builder
function createProductCardHTML(feed) {
  const isLiked = wishlistSet.has(feed.product_name);
  const imgUrl = feed.image_url || 'images/products/prod_1_33923781ea.jpg';
  
  return `
    <div class="product-card" onclick="openProductDetail('${escapeHtml(feed.product_name)}', '${escapeHtml(feed.shop_name)}')">
      <div class="card-img-wrapper">
        <img class="card-img" src="${imgUrl}" alt="${escapeHtml(feed.product_name)}" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';">
        ${feed.is_promo_active ? `<span class="card-promo-badge">PROMO SALE</span>` : ''}
        <button class="card-heart-btn ${isLiked ? 'liked' : ''}" onclick="toggleWishlist(event, '${escapeHtml(feed.product_name)}')">
          ${isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="card-body">
        <span class="card-cat">${escapeHtml(getCategoryTranslation(feed.category_name))} • ${escapeHtml(feed.brand)}</span>
        <h4 class="card-title">${escapeHtml(feed.product_name)}</h4>
        <div class="card-shop" onclick="event.stopPropagation(); openShopDetail('${escapeHtml(feed.shop_name)}')">
          🏬 ${escapeHtml(feed.shop_name)} (${escapeHtml(feed.district || 'Phnom Penh')}) <span style="font-size:10px; color:var(--accent-pink); font-weight:700; text-decoration:underline;">(프로필 &rarr;)</span>
        </div>
        <div class="card-footer">
          <div>
            <span class="card-price-usd">$${Number(feed.price_usd || 0).toFixed(2)}</span>
            <span class="card-price-riel">${Number(feed.price_riel || 0).toLocaleString()} ៛</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Open Multi-Shop Price Comparison Detail Modal
function openProductDetail(prodName, targetShopName) {
  const matches = timelineFeeds.filter(f => f.product_name === prodName);
  if (matches.length === 0) return;

  const selectedItem = matches.find(f => f.shop_name === targetShopName) || matches[0];
  
  const prices = matches.map(m => m.price_usd);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const currentPrice = selectedItem.price_usd;

  const diffFromMin = currentPrice - minPrice;
  const diffFromAvg = currentPrice - avgPrice;

  let diagIcon = "🏷️";
  let diagTitle = "가격 진단 분석";
  let diagMsg = "";

  if (currentPrice === minPrice) {
    diagIcon = "🏆";
    diagTitle = "프놈펜 최저가! (Best Lowest Price)";
    diagMsg = `현재 <b>${escapeHtml(selectedItem.shop_name)}</b>의 가격(<b>$${currentPrice.toFixed(2)}</b>)은 프놈펜 전체 샵 중 가장 저렴한 <b>1위 최저가</b>입니다!`;
  } else if (diffFromAvg < 0) {
    diagIcon = "🔥";
    diagTitle = "평균 대비 저렴한 할인 가격!";
    diagMsg = `프놈펜 타 샵 평균가($${avgPrice.toFixed(2)})보다 <b>-$${Math.abs(diffFromAvg).toFixed(2)} 할인된 이득 가격</b>입니다. (최저가 샵: $${minPrice.toFixed(2)})`;
  } else if (diffFromMin > 0 && selectedItem.is_promo_active) {
    diagIcon = "⚠️";
    diagTitle = "세일 표시 제품 (타 샵 최저가 대조 필요)";
    diagMsg = `할인 프로모션 표시가 되어 있으나, <b>프놈펜 타 샵 최저가($${minPrice.toFixed(2)})보다 +$${diffFromMin.toFixed(2)} 비쌉니다.</b> 아래 타 샵 가격 리스트를 비교해보세요!`;
  } else {
    diagIcon = "ℹ️";
    diagTitle = "정가 판매 제품";
    diagMsg = `현재 샵 가격은 $${currentPrice.toFixed(2)}입니다. (프놈펜 최저가 샵: $${minPrice.toFixed(2)})`;
  }

  const sortedMatches = [...matches].sort((a, b) => a.price_usd - b.price_usd);

  const imgUrl = selectedItem.image_url || 'images/products/prod_1_33923781ea.jpg';

  const bodyEl = document.getElementById("productDetailBody");
  bodyEl.innerHTML = `
    <div class="detail-header-row">
      <div class="detail-img-box">
        <img src="${imgUrl}" alt="${escapeHtml(selectedItem.product_name)}" onerror="this.onerror=null; this.src='${SVG_FALLBACK}';">
      </div>
      <div class="detail-info">
        <span class="detail-cat">${escapeHtml(selectedItem.category_name)} • ${escapeHtml(selectedItem.brand)}</span>
        <h3 class="detail-title">${escapeHtml(selectedItem.product_name)}</h3>
        <div class="detail-shop-name" onclick="openShopDetail('${escapeHtml(selectedItem.shop_name)}')" style="cursor:pointer; margin-bottom:6px;">
          🏬 <b>${escapeHtml(selectedItem.shop_name)}</b> (${escapeHtml(selectedItem.district || 'Phnom Penh')}) 
          <span style="display:inline-block; font-size:11px; color:var(--accent-pink); font-weight:700; text-decoration:underline; margin-left:4px;">(샵 프로필 보기 &rarr;)</span>
        </div>
        <div class="detail-price-tag">
          $${currentPrice.toFixed(2)} <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">(${selectedItem.price_riel.toLocaleString()} ៛)</span>
          ${selectedItem.is_promo_active ? `<span class="shop-item-tag" style="margin-left:4px;">PROMO</span>` : ''}
        </div>
      </div>
    </div>

    <div class="price-diag-card">
      <div class="diag-title">${diagIcon} ${diagTitle}</div>
      <div class="diag-msg">${diagMsg}</div>
      <div class="price-stats-grid">
        <div class="price-stat-box">
          <span class="price-stat-val" style="color:var(--accent-green);">$${minPrice.toFixed(2)}</span>
          <span class="price-stat-lbl">프놈펜 최저가</span>
        </div>
        <div class="price-stat-box">
          <span class="price-stat-val">$${avgPrice.toFixed(2)}</span>
          <span class="price-stat-lbl">프놈펜 평균가</span>
        </div>
        <div class="price-stat-box">
          <span class="price-stat-val" style="color:var(--text-muted);">$${maxPrice.toFixed(2)}</span>
          <span class="price-stat-lbl">프놈펜 최고가</span>
        </div>
      </div>
    </div>

    <div class="shop-price-section-title">
      <span>🏪 프놈펜 샵별 가격 비교 (${sortedMatches.length}개 샵)</span>
      <span style="font-size:10px; font-weight:normal; color:var(--text-muted);">최저가순 정렬</span>
    </div>
    
    <div class="shop-price-list">
      ${sortedMatches.map((m, idx) => {
        const isCurrent = m.shop_name === selectedItem.shop_name;
        return `
          <div class="shop-price-item ${isCurrent ? 'current-selected' : ''}" onclick="event.stopPropagation(); openShopDetail('${escapeHtml(m.shop_name)}')">
            <div class="shop-item-left">
              <div class="shop-rank">${idx + 1}</div>
              <div>
                <div class="shop-item-name">${escapeHtml(m.shop_name)} ${isCurrent ? '<span style="font-size:10px; color:var(--accent-pink);">(선택됨)</span>' : ''}</div>
                <div class="shop-item-district">📍 ${escapeHtml(m.district || 'Phnom Penh')} • <span style="color:var(--accent-pink); font-weight:700;">샵 프로필 보기 &rarr;</span></div>
              </div>
            </div>
            <div class="shop-item-right">
              <div class="shop-item-price">$${m.price_usd.toFixed(2)}</div>
              ${m.is_promo_active ? `<span class="shop-item-tag">PROMO</span>` : ''}
            </div>
          </div>
        `;
      }).join("")}
    </div>

    <div style="margin-top:14px; display:flex; gap:8px;">
      <button class="sub-tab-btn active" style="flex:1;" onclick="switchTab('tab-compare'); selectProductForChart('${escapeHtml(prodName)}', ${currentPrice});">
        📈 시세 그래프로 이동
      </button>
      <button class="sub-tab-btn" style="flex:1;" onclick="toggleWishlist(event, '${escapeHtml(prodName)}');">
        ❤️ 위시리스트 담기
      </button>
    </div>
  `;

  switchTab('tab-detail');
}

function closeProductDetail() {
  switchTab(lastTabId || 'tab-home');
}

// Open Shop Profile & Detail View
function openShopDetail(shopName) {
  const shopFeeds = timelineFeeds.filter(f => f.shop_name === shopName);
  if (shopFeeds.length === 0) return;

  const currentActive = document.querySelector(".tab-view.active");
  if (currentActive && currentActive.id !== 'tab-shop-detail') {
    lastTabId = currentActive.id;
  }

  const first = shopFeeds[0];
  const district = first.district || 'Phnom Penh';
  const totalPosts = shopFeeds.length;
  const promoCount = shopFeeds.filter(f => f.is_promo_active === 1).length;

  const shopBodyEl = document.getElementById("shopDetailBody");
  shopBodyEl.innerHTML = `
    <div class="shop-profile-card">
      <div class="shop-profile-header">
        <div class="shop-avatar">🏬</div>
        <div class="shop-profile-info">
          <h3 class="shop-profile-name">${escapeHtml(first.shop_name)}</h3>
          <div class="shop-profile-district">📍 ${escapeHtml(district)} District, Phnom Penh</div>
          <span class="shop-badge">VERIFIED MASTER BEAUTY SHOP</span>
        </div>
      </div>
      
      <div class="shop-info-grid">
        <div class="shop-info-box">
          <div class="shop-info-val">📍 ${escapeHtml(district)}</div>
          <div class="shop-info-lbl">상권 위치</div>
        </div>
        <div class="shop-info-box">
          <div class="shop-info-val">🔥 ${promoCount}건 진행 중</div>
          <div class="shop-info-lbl">실시간 할인 세일</div>
        </div>
        <div class="shop-info-box">
          <div class="shop-info-val">📦 ${totalPosts}개 등록</div>
          <div class="shop-info-lbl">타임라인 상품 수</div>
        </div>
        <div class="shop-info-box">
          <div class="shop-info-val">⏰ 09:00 - 20:30</div>
          <div class="shop-info-lbl">영업 시간</div>
        </div>
      </div>
    </div>

    <div class="section-header" style="margin-bottom:10px;">
      <h3 class="section-title">🛍️ ${escapeHtml(first.shop_name)} 판매 상품 목록 (${totalPosts}개)</h3>
    </div>

    <div class="products-grid">
      ${shopFeeds.map(feed => createProductCardHTML(feed)).join("")}
    </div>
  `;

  switchTab('tab-shop-detail');
}

function goBackFromShopDetail() {
  switchTab(lastTabId || 'tab-home');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

// Wishlist Controller
function toggleWishlist(e, prodName) {
  e.stopPropagation();
  if (wishlistSet.has(prodName)) {
    wishlistSet.delete(prodName);
  } else {
    wishlistSet.add(prodName);
  }
  localStorage.setItem('beauty_wishlist', JSON.stringify(Array.from(wishlistSet)));
  updateWishlistUI();
  renderCompareResults();
  renderPopularProductsGrid();
}

function updateWishlistUI() {
  document.getElementById("wishlistCount").innerText = wishlistSet.size;
  const container = document.getElementById("wishlistContainer");
  const likedFeeds = timelineFeeds.filter(f => wishlistSet.has(f.product_name));
  
  if (likedFeeds.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">❤️ No wishlist items added yet. Click heart on any product card!</div>`;
  } else {
    container.innerHTML = likedFeeds.map(feed => createProductCardHTML(feed)).join("");
  }
  
  // Render Mock Purchase History
  document.getElementById("ordersCount").innerText = "3";
  document.getElementById("ordersContainer").innerHTML = `
    <div class="glass-panel" style="padding:14px; margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; font-weight:700;">
        <span>🛍️ Order #PP-8821</span>
        <span style="color:var(--accent-green);">Completed (BOPIS Picked Up)</span>
      </div>
      <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">Anessa Sunscreen Milk UV 60ml • $13.50</div>
      <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">🏬 SreyNeang Skincare (Sensok) • 2026-08-05</div>
    </div>
    <div class="glass-panel" style="padding:14px;">
      <div style="display:flex; justify-content:space-between; font-weight:700;">
        <span>🛍️ Order #PP-8790</span>
        <span style="color:var(--accent-cyan);">Delivered via Nham24 (30m Quick)</span>
      </div>
      <div style="font-size:13px; color:var(--text-secondary); margin-top:4px;">COSRX Hydrating Niacinamide Serum 30ml • $18.00</div>
      <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">🏬 Phnom Penh K-Beauty House • 2026-08-02</div>
    </div>
  `;
}

// Interactive Price History Chart (Chart.js)
function initPriceHistoryChart() {
  const canvas = document.getElementById('priceHistoryChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  priceHistoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['3w ago (07/18)', '2w ago (07/25)', '1w ago (08/01)', 'Today (08/06)'],
      datasets: [{
        label: 'Anessa Sunscreen Price Trend ($)',
        data: [16.50, 15.00, 14.50, 13.50],
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: 'rgba(236, 72, 153, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } } },
        y: { grid: { color: 'rgba(236, 72, 153, 0.08)' }, ticks: { color: '#64748b', font: { size: 10 } } }
      }
    }
  });
}

function selectProductForChart(prodName, currentPrice) {
  document.getElementById("chartProductTitle").innerText = `📈 ${prodName}`;
  document.getElementById("lowestPriceBadge").innerText = `🏷️ Lowest: $${(currentPrice * 0.9).toFixed(2)}`;
  
  const baseP = currentPrice;
  if (priceHistoryChart) {
    priceHistoryChart.data.datasets[0].label = prodName;
    priceHistoryChart.data.datasets[0].data = [baseP * 1.15, baseP * 1.08, baseP * 1.02, baseP];
    priceHistoryChart.update();
  }
}

// Lightbox Modal Controller
function openLightbox(imgSrc, title, desc) {
  document.getElementById("lightboxImg").src = imgSrc;
  document.getElementById("lightboxTitle").innerText = title;
  document.getElementById("lightboxDesc").innerText = desc;
  document.getElementById("imageLightboxModal").classList.add("active");
}

function closeLightbox() {
  document.getElementById("imageLightboxModal").classList.remove("active");
}
