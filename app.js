// Phnom Penh Beauty App Local Database (Localized for Cambodia)
const STORES = {
    guardian: { name: "가디언 BKK1 (Guardian Pharmacy)", type: "글로벌 H&B 체인" },
    aeon: { name: "이온 웰니스 (AEON Wellness)", type: "대형 몰 스토어" },
    goody: { name: "구디 샵 (Goody Shop)", type: "로컬 편집숍" },
    sokoskins: { name: "소코스킨스 (SoKoSkins)", type: "로컬 편집숍" }
};

// Standardized Catalog with Khmer and generic category search tags
const PRODUCTS = [
    {
        id: "prod-1",
        brand: "가니에 (Garnier)",
        name: "브라이트 컴플리트 비타민 C 세럼",
        emoji: "🍋",
        category: "세럼/에센스",
        search_tags: ["세럼", "에센스", "serum", "essence", "សេរ៉ូម", "garnier", "가니에", "미백", "brightening"],
        prices: {
            guardian: 14.50,
            aeon: 15.00,
            goody: 13.80,
            sokoskins: 13.50
        }
    },
    {
        id: "prod-2",
        brand: "바세린 (Vaseline)",
        name: "글루타-하야 브라이트 바디 로션 (330ml)",
        emoji: "🧴",
        category: "로션/바디로션",
        search_tags: ["로션", "바디로션", "lotion", "body lotion", "ឡេលាបខ្លួន", "vaseline", "바세린", "body care", "바디"],
        prices: {
            guardian: 8.50,
            aeon: 9.00,
            goody: 8.20,
            sokoskins: 7.90
        }
    },
    {
        id: "prod-3",
        brand: "센카 (Senka)",
        name: "퍼펙트 휩 페이셜 클렌저",
        emoji: "🧼",
        category: "클렌징폼",
        search_tags: ["폼클렌징", "클렌저", "cleanser", "cleansing foam", "ហ្វូមលាងមុខ", "senka", "센카", "세안", "foam"],
        prices: {
            guardian: 6.50,
            aeon: 7.00,
            goody: 5.90,
            sokoskins: 5.80
        }
    },
    {
        id: "prod-4",
        brand: "가니에 (Garnier)",
        name: "사쿠라 글로우 UV 선스크린 SPF50+",
        emoji: "☀️",
        category: "선크림",
        search_tags: ["선크림", "자외선차단제", "sunscreen", "sunblock", "ឡេការពារកម្តៅថ្ងៃ", "garnier", "가니에", "sun", "uv"],
        prices: {
            guardian: 11.20,
            aeon: 12.00,
            goody: 10.80,
            sokoskins: 10.50
        }
    },
    {
        id: "prod-5",
        brand: "메디힐 (Mediheal)",
        name: "티트리 에센셜 마스크팩 (10매)",
        emoji: "🎭",
        category: "마스크팩",
        search_tags: ["마스크팩", "마스크", "mask", "maskpack", "ម៉ាសបិទមុខ", "mediheal", "메디힐", "팩", "tea tree"],
        prices: {
            guardian: 12.00,
            aeon: 13.00,
            goody: 11.50,
            sokoskins: 11.00
        }
    },
    {
        id: "prod-6",
        brand: "스네이크 브랜드 (Snake Brand)",
        name: "클래식 쿨링 파우더 (280g)",
        emoji: "❄️",
        category: "바디/쿨링파우더",
        search_tags: ["파우더", "쿨링파우더", "powder", "cooling powder", "ម្សៅត្រជាក់", "snake brand", "스네이크", "땀띠"],
        prices: {
            guardian: 4.20,
            aeon: 4.50,
            goody: 3.90,
            sokoskins: 3.80
        }
    }
];

const TEST_QUESTIONS = [
    {
        question: "평소 이동하실 때 주로 어떤 수단을 사용하시나요?",
        options: [
            { text: "🏍️ 오토바이 또는 툭툭 (매연, 먼지, 뜨거운 태양광 노출)", type: "sensitive" },
            { text: "🚗 자동차 또는 종일 실내 근무 (에어컨 바람에 장시간 노출)", type: "dry" },
            { text: "🚶‍♀️ 도보 및 하이브리드 이동 (땀 분비와 피지 분비가 왕성함)", type: "oily" }
        ]
    },
    {
        question: "석회질이 섞인 프놈펜 수질로 세안한 직후 피부 느낌은 어떤가요?",
        options: [
            { text: "붉어지고 뾰루지가 쉽게 일어납니다.", type: "sensitive" },
            { text: "피부가 하얗게 트고 속당김이 심합니다.", type: "dry" },
            { text: "금방 번들거리고 개기름이 올라옵니다.", type: "oily" }
        ]
    },
    {
        question: "캄보디아의 날씨 주기 중 피부 상태가 가장 거칠어지는 시즌은 언제인가요?",
        options: [
            { text: "비가 잦고 습도가 극도로 높은 우기 (Rainy Season)", type: "oily" },
            { text: "바람이 불고 건조한 11월~1월 건기 (Dry Cool Season)", type: "dry" },
            { text: "한낮 기온이 40도까지 오르는 3월~5월 혹서기 (Hot Season)", type: "sensitive" }
        ]
    }
];

const TEST_RESULTS = {
    oily: {
        title: "산뜻 오일-컨트롤 레시피 (프놈펜 우기/땀대비)",
        desc: "습도가 높은 프놈펜 기후에서는 모공이 막히기 쉽습니다. 모공 청정과 과다 피지 조절에 집중한 스킨케어가 필요합니다.",
        routine: [
            "센카 퍼펙트 휩 클렌저로 모공 속 땀과 피지 딥클렌징",
            "세안 후 잔여 석회수를 닦아내기 위해 닦토(가니에 세럼 스킨 활용)",
            "바디 세정 후 보송함을 유지하도록 스네이크 브랜드 쿨링 파우더 전신 도포",
            "외출 시 끈적임이 적은 가니에 사쿠라 글로우 UV 선스크린 필수 도포"
        ]
    },
    dry: {
        title: "에어컨 밀폐실 철벽 보습 레시피",
        desc: "에어컨 가동이 잦은 실내 생활은 속건조를 유발합니다. 석회수 세안 후 증발하는 수분을 잡는 수분 레이어링이 핵심입니다.",
        routine: [
            "피부 마찰을 줄이기 위해 부드럽고 풍부한 폼 클렌징 수행",
            "세안 직후 물기가 마르기 전 가니에 비타민 C 세럼으로 깊은 보습 흡수",
            "바디에는 에어컨 바람에 건조해지지 않도록 바세린 글루타-하야 바디로션 꼼꼼히 도포",
            "주 2회 메디힐 티트리 에센셜 마스크팩으로 집중 스페셜 수분 충전"
        ]
    },
    sensitive: {
        title: "먼지 및 태양광 철벽 진정 레시피",
        desc: "매연, 먼지, 강력한 자외선 노출로 지친 민감성 피부를 보호하는 장벽 케어와 열감 쿨링이 시급합니다.",
        routine: [
            "외출 후 미세 먼지와 자외선 차단제를 제거하기 위한 부드러운 약산성 2차 세안",
            "달아오른 피부에 메디힐 티트리 마스크팩을 올려 즉각적인 피부 열감 다운 (쿨링)",
            "외출 전 가니에 사쿠라 글로우 UV 선스크린 SPF50+ 로 철저한 햇빛 차단",
            "땀으로 붉어진 목덜미와 등에 스네이크 쿨링 파우더를 톡톡 두드려 진정 효과 부여"
        ]
    }
};

// Application State
let cart = [];
let activeTab = "tab-home";
let currentQuestionIndex = 0;
let testAnswers = [];
let socialFeeds = [];

// DOM Elements
const tabHome = document.getElementById("tab-home");
const tabCompare = document.getElementById("tab-compare");
const tabTest = document.getElementById("tab-test");
const tabCart = document.getElementById("tab-cart");

const navItems = document.querySelectorAll(".nav-item");
const themeToggleBtn = document.getElementById("theme-toggle");

const socialFeedContainer = document.getElementById("social-feed-container");
const recommendGridContainer = document.getElementById("recommend-grid-container");

const searchInput = document.getElementById("search-input");
const compareListContainer = document.getElementById("compare-list-container");
const productCountSpan = document.getElementById("product-count");

const startTestBtn = document.getElementById("start-test-btn");
const testQuestionsCard = document.getElementById("test-questions-card");
const testResultCard = document.getElementById("test-result-card");
const testProgressBar = document.getElementById("test-progress-bar");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options-list");
const restartTestBtn = document.getElementById("restart-test-btn");
const resultTitle = document.getElementById("result-title");
const resultDesc = document.getElementById("result-desc");
const resultRoutineList = document.getElementById("result-routine-list");

const cartItemsContainer = document.getElementById("cart-items-container");
const cartBadge = document.getElementById("cart-badge");
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryShipping = document.getElementById("summary-shipping");
const summaryTotal = document.getElementById("summary-total");
const placeOrderBtn = document.getElementById("place-order-btn");
const orderModal = document.getElementById("order-modal");
const orderModalDesc = document.getElementById("order-modal-desc");
const closeModalBtn = document.getElementById("close-modal-btn");
const toastNotification = document.getElementById("toast-notification");

// Navigation Handler
navItems.forEach(item => {
    item.addEventListener("click", () => {
        const tabId = item.getAttribute("data-tab");
        switchTab(tabId);
    });
});

function switchTab(tabId) {
    activeTab = tabId;
    
    navItems.forEach(nav => {
        if (nav.getAttribute("data-tab") === tabId) {
            nav.classList.add("active");
        } else {
            nav.classList.remove("active");
        }
    });

    document.querySelectorAll(".tab-pane").forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add("active");
        } else {
            pane.classList.remove("active");
        }
    });

    if (tabId === "tab-compare") {
        renderCompareList(PRODUCTS);
    } else if (tabId === "tab-cart") {
        renderCart();
    }
}

// Light / Dark Theme Toggle
themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "dark") {
        document.body.removeAttribute("data-theme");
        themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    } else {
        document.body.setAttribute("data-theme", "dark");
        themeToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
});

// Toast Notifier Helper
function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.remove("hidden");
    toastNotification.style.opacity = "1";
    setTimeout(() => {
        toastNotification.style.opacity = "0";
        setTimeout(() => {
            toastNotification.classList.add("hidden");
        }, 300);
    }, 2000);
}

// Fetch Social Feeds dynamically
async function loadSocialFeeds() {
    try {
        const response = await fetch("social_feeds.json");
        if (response.ok) {
            socialFeeds = await response.json();
        } else {
            console.warn("Failed to load social_feeds.json, using fallback.");
            socialFeeds = [
                {
                    id: "fallback-1",
                    source: "facebook",
                    store: "가디언 BKK1 (Guardian)",
                    badge: "로컬 캐시",
                    content: "기본 피드 데이터를 로드하고 있습니다. 가니에 세럼과 바세린 로션의 최신 최저가를 비교해 보세요!",
                    likes: 12,
                    price: "$14.50",
                    productId: "prod-1"
                }
            ];
        }
    } catch (e) {
        console.error("Error fetching social feeds:", e);
    }
}

// 1. Home Tab: Render Mock Crawled Social Feeds & Recommended Products
function initHomeTab() {
    socialFeedContainer.innerHTML = "";
    socialFeeds.forEach(feed => {
        const card = document.createElement("div");
        card.className = "social-card";
        
        let sourceIcon = feed.source === "facebook" ? "📘" : "🎵";
        
        card.innerHTML = `
            <div class="social-header">
                <span class="social-source ${feed.source}">
                    ${sourceIcon} ${feed.store}
                </span>
                <span class="social-badge">${feed.badge}</span>
            </div>
            <p class="social-content">${feed.content}</p>
            <div class="social-meta">
                <span class="social-price">최신 파싱가: ${feed.price}</span>
                <button class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:0.75rem;" onclick="addToCart('${feed.productId}', 'guardian')">
                    담기
                </button>
            </div>
        `;
        socialFeedContainer.appendChild(card);
    });

    // Render Recommended Items
    recommendGridContainer.innerHTML = "";
    PRODUCTS.slice(0, 4).forEach(prod => {
        let cheapestStoreKey = "guardian";
        let minPrice = Infinity;
        for (const [store, price] of Object.entries(prod.prices)) {
            if (price < minPrice) {
                minPrice = price;
                cheapestStoreKey = store;
            }
        }
        
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <div class="product-img-placeholder">${prod.emoji}</div>
            <div class="product-info">
                <p class="brand" style="font-size:0.7rem; color:var(--accent-dark);">${prod.brand}</p>
                <h5 style="font-size:0.8rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${prod.name}</h5>
            </div>
            <div class="product-price-row">
                <span class="price" style="font-size:0.85rem;">$${minPrice.toFixed(2)}</span>
                <button class="icon-btn" onclick="addToCart('${prod.id}', '${cheapestStoreKey}')" aria-label="담기">
                    ➕
                </button>
            </div>
        `;
        recommendGridContainer.appendChild(card);
    });
}

// 2. Compare Tab: Search and Store Price Comparisons (Categorical & Khmer Search support)
function renderCompareList(productsList) {
    compareListContainer.innerHTML = "";
    productCountSpan.textContent = productsList.length;
    
    if (productsList.length === 0) {
        compareListContainer.innerHTML = `<div style="text-align:center; padding:20px; font-size:0.85rem; color:var(--text-secondary);">매칭되는 종류나 브랜드가 없습니다.</div>`;
        return;
    }

    productsList.forEach(prod => {
        const sortedPrices = Object.entries(prod.prices).sort((a, b) => a[1] - b[1]);
        const cheapestPrice = sortedPrices[0][1];

        const card = document.createElement("div");
        card.className = "compare-card";
        
        let storeRowsHTML = "";
        sortedPrices.forEach(([storeKey, price], index) => {
            const storeInfo = STORES[storeKey];
            const isCheapest = price === cheapestPrice;
            const rowClass = isCheapest ? "store-price-row cheapest" : "store-price-row";
            const badgeHTML = isCheapest ? `<span class="store-name-badge">최저가</span>` : "";
            
            storeRowsHTML += `
                <div class="${rowClass}">
                    <span class="store-name">${storeInfo.name} ${badgeHTML}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-weight:700;">$${price.toFixed(2)}</span>
                        <button class="btn btn-secondary btn-sm" style="padding:4px 8px; font-size:0.7rem; border-radius:6px;" onclick="addToCart('${prod.id}', '${storeKey}')">
                            담기
                        </button>
                    </div>
                </div>
            `;
        });

        card.innerHTML = `
            <div class="compare-product-header">
                <div style="font-size:2rem; padding:8px; background-color:var(--accent-light); border-radius:10px;">${prod.emoji}</div>
                <div class="compare-product-title">
                    <p style="color:var(--accent-dark); font-weight:600; font-size:0.75rem;">${prod.brand}</p>
                    <h4 style="font-size:0.85rem; font-weight:600;">${prod.name}</h4>
                </div>
            </div>
            <div class="store-pricing-list">
                ${storeRowsHTML}
            </div>
        `;
        compareListContainer.appendChild(card);
    });
}

// Search Functionality Supporting Category/Types (English & Khmer)
searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
        renderCompareList(PRODUCTS);
        return;
    }
    const filtered = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.search_tags.some(tag => tag.includes(query))
    );
    renderCompareList(filtered);
});

// 3. Diagnostic Tab (Skincare Test)
startTestBtn.addEventListener("click", () => {
    document.querySelector(".test-intro-card").classList.add("hidden");
    testQuestionsCard.classList.remove("hidden");
    currentQuestionIndex = 0;
    testAnswers = [];
    showQuestion();
});

function showQuestion() {
    const qData = TEST_QUESTIONS[currentQuestionIndex];
    questionText.textContent = qData.question;
    
    const progressPercent = ((currentQuestionIndex + 1) / TEST_QUESTIONS.length) * 100;
    testProgressBar.style.width = `${progressPercent}%`;

    optionsList.innerHTML = "";
    qData.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = opt.text;
        btn.addEventListener("click", () => handleAnswer(opt.type));
        optionsList.appendChild(btn);
    });
}

function handleAnswer(type) {
    testAnswers.push(type);
    currentQuestionIndex++;
    if (currentQuestionIndex < TEST_QUESTIONS.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    testQuestionsCard.classList.add("hidden");
    testResultCard.classList.remove("hidden");

    const counts = {};
    let dominantType = "oily";
    let maxCount = 0;
    
    testAnswers.forEach(ans => {
        counts[ans] = (counts[ans] || 0) + 1;
        if (counts[ans] > maxCount) {
            maxCount = counts[ans];
            dominantType = ans;
        }
    });

    const result = TEST_RESULTS[dominantType];
    resultTitle.textContent = result.title;
    resultDesc.textContent = result.desc;

    resultRoutineList.innerHTML = "";
    result.routine.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        resultRoutineList.appendChild(li);
    });
}

restartTestBtn.addEventListener("click", () => {
    testResultCard.classList.add("hidden");
    document.querySelector(".test-intro-card").classList.remove("hidden");
});

// 4. Cart & Order Simulation
window.addToCart = function(productId, storeKey) {
    const product = PRODUCTS.find(p => p.id === productId);
    const price = product.prices[storeKey];
    
    const existing = cart.find(item => item.productId === productId && item.storeKey === storeKey);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            productId,
            storeKey,
            price,
            qty: 1
        });
    }

    updateCartBadge();
    showToast(`${product.name}이 장바구니에 담겼습니다!`);
};

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartBadge.textContent = totalQty;
}

function renderCart() {
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div style="text-align:center; padding:40px; font-size:0.85rem; color:var(--text-secondary);">장바구니가 비어 있습니다.</div>`;
        document.getElementById("cart-summary-card").classList.add("hidden");
        return;
    }

    document.getElementById("cart-summary-card").classList.remove("hidden");
    let subtotal = 0;

    cart.forEach((item, index) => {
        const product = PRODUCTS.find(p => p.id === item.productId);
        const storeInfo = STORES[item.storeKey];
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <div style="font-size:1.8rem;">${product.emoji}</div>
            <div class="cart-item-info">
                <h5>${product.name}</h5>
                <p style="font-size:0.7rem; color:var(--accent-dark);">${storeInfo.name}</p>
                <div class="cart-item-price-qty">
                    <span style="font-weight:700; font-size:0.9rem;">$${itemTotal.toFixed(2)}</span>
                    <div class="cart-qty">
                        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                        <span style="font-size:0.85rem; font-weight:600;">${item.qty}</span>
                        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    const shippingCost = deliveryMethod === "nham24" ? 1.50 : 0.00;
    summaryShipping.textContent = `$${shippingCost.toFixed(2)}`;
    
    const total = subtotal + shippingCost;
    summaryTotal.textContent = `$${total.toFixed(2)}`;
}

window.updateQty = function(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartBadge();
    renderCart();
};

document.querySelectorAll('input[name="delivery-method"]').forEach(radio => {
    radio.addEventListener("change", () => {
        document.querySelectorAll('.delivery-option-btn').forEach(btn => btn.classList.remove('active'));
        radio.closest('.delivery-option-btn').classList.add('active');
        renderCart();
    });
});

placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) return;
    
    const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
    
    if (deliveryMethod === "nham24") {
        orderModalDesc.innerHTML = `인근 화장품 숍들과 실시간 매칭이 완료되었습니다.<br><strong>Nham24 기사가 30분 이내에 배달을 시작합니다!</strong>`;
    } else {
        orderModalDesc.innerHTML = `선택하신 오프라인 매장 카운터에 주문서가 전송되었습니다.<br><strong>퇴근길 픽업 대기줄 없이 바로 받아 가실 수 있습니다!</strong>`;
    }

    cart = [];
    updateCartBadge();
    orderModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    orderModal.classList.add("hidden");
    switchTab("tab-home");
});

// App Initialization
document.addEventListener("DOMContentLoaded", async () => {
    await loadSocialFeeds();
    initHomeTab();
});
