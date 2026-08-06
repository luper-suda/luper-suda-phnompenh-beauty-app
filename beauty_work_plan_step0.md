# Phnom Penh Beauty App - Step 0: 2단계 소셜 샵 수집 & DB 타겟팅 확정서
> **파일명**: `beauty_work_plan_step0.md`  
> **목적**: 페이스북 계정 정지(Ban)를 100% 원천 차단하기 위해 **1단계: 35개 키워드 기반 프놈펜 로컬 뷰티 샵 공개 URL 마스터 DB (`shops`) 발굴**과 **2단계: 공개 샵 URL 직접 타겟팅 모니터링**의 2-Stage 수집 체계를 확정함.

---

## 1. 35개 뷰티 검색어 키워드 스펙 (Shop Discovery Queries Spec)

| 순번 | 대분류 카테고리 | 영문 검색 키워드 | 캄보디아 크메르어 (실검 키워드) | 주요 모니터링 브랜드 |
| :---: | :--- | :--- | :--- | :--- |
| **1** | 썬케어 | `Sunscreen` | **`ឡេការពារកម្តៅថ្ងៃ`** | Anessa, Biore, Garnier, Vaseline |
| **2** | 썬케어 | `Tone-up Sun` | **`ឡេការពារកម្តៅថ្ងៃស`** | Garnier Sakura, Innisfree |
| **3** | 썬케어 | `Sun Milk / UV Gel` | **`Sun Stick`** | Anessa Milk, Biore Watery Essence |
| **4** | 세럼/에센스 | `Serum` | **`សេរ៉ូម`** | COSRX, La Roche-Posay, The Ordinary |
| **5** | 세럼/에센스 | `Vitamin C Serum` | **`សេរ៉ូមវីតាមីន C`** | Garnier Vitamin C, Melano CC |
| **6** | 세럼/에센스 | `Hyaluronic Ampoule` | **`Hydrating Serum`** | Torriden, Wellage, Laneige |
| **7** | 세럼/에센스 | `Retinol / Niacinamide` | **`Collagen Serum`** | Innisfree Retinol, COSRX Niacinamide |
| **8** | 트러블케어 | `Anti-acne Serum` | **`ថ្នាំមុន`** | Some By Mi, La Roche-Posay Effaclar |
| **9** | 트러블케어 | `Tea Tree / Cica` | **`Centella`** | Mediheal Tea Tree, Skin1004 |
| **10** | 트러블케어 | `Pimple Patch` | **`Salicylic Acid`** | COSRX Patch, Paula's Choice |
| **11** | 수분/보습 | `Moisturizer` | **`ឡេផ្តល់សំណើម`** | Cetaphil, CeraVe, Clinique |
| **12** | 토너/스킨 | `Toner` | **`ទឹកជូតមុខ`** | Bioderma Sensibio, Anua |
| **13** | 토너패드 | `Toner Pad` | **`Clearing Pad`** | Mediheal Pad, Abib |
| **14** | 마스크팩 | `Sheet Mask` | **`ម៉ាសបិទមុខ`** | Mediheal, LuLuLun, Nature Republic |
| **15** | 마스크팩 | `Clay Mask` | **`Sleeping Mask`** | Innisfree Super Volcanic, Laneige |
| **16** | 마스크팩 | `Eye Patch` | **`Eye Cream`** | Shangpree, AHC |
| **17** | 클렌징 | `Cleansing Foam` | **`ហ្វូមលាងមុខ`** | Senka Perfect Whip, Innisfree |
| **18** | 클렌징 | `Low pH Cleanser` | **`Deep Cleanser`** | COSRX Good Morning, CeraVe |
| **19** | 클렌징 | `Cleansing Water` | **`ទឹកជូតគ្រឿងសំអាង`** | Bioderma H2O, Garnier Micellar |
| **20** | 색조 | `Lipstick / Lip Tint` | **`ក្រែមលាបមាត់`** | Rom&nd, Etude, 3CE |
| **21** | 색조 | `Lip Balm / Lip Gloss` | **`Rosy Lips`** | Vaseline Lip Therapy, Nivea |
| **22** | 베이스 | `Cushion / Foundation` | **`ម្សៅទ្រនាប់`** | Laneige Neo Cushion, Clio |
| **23** | 베이스 | `Concealer` | **`BB Cream`** | The Saem, Maybelline |
| **24** | 베이스 | `Setting Powder` | **`No-Sebum`** | Innisfree No-Sebum, Laura Mercier |
| **25** | 아이 | `Mascara / Eyeliner` | **`Eyeshadow`** | Kiss Me Heroine, Maybelline |
| **26** | 바디케어 | `Body Lotion` | **`ឡេលាបខ្លួន`** | Vaseline Gluta-Hya, Nivea |
| **27** | 바디케어 | `Body Wash` | **`សាប៊ូដុសខ្លួន`** | Dove, Bath & Body Works |
| **28** | 바디케어 | `Cooling Powder` | **`Snake Powder`** | Snake Brand Prickly Heat |
| **29** | 바디케어 | `Body Scrub` | **`Body Mist`** | Tree Hut, Victoria's Secret |
| **30** | 헤어케어 | `Shampoo` | **`សាប៊ូកក់សក់`** | L'Oreal Elseve, Tsubaki |
| **31** | 헤어케어 | `Hair Treatment` | **`Hair Mask`** | Unove, Mise En Scene |
| **32** | 헤어케어 | `Hair Serum` | **`Hair Oil`** | Lucido-L, Perfect Serum |
| **33** | K-뷰티 | `Korean Skincare` | **`K-Beauty Cambodia`** | COSRX, Beauty of Joseon |
| **34** | 물광케어 | `Glass Skin` | **`Glow Skin`** | Numbuzin, TirTir |
| **35** | 미백케어 | `Brightening` | **`ធ្វើឱ្យស្បែកស`** | Garnier Sakura, Vaseline Gluta |

---

## 2. 2-Stage 소셜 수집 아키텍처 및 타겟 상권 (2-Stage Architecture)

* **1단계: 샵 URL 디스커버리 파이프라인 (Shop Discovery Phase - 수 주에 1회 가동)**:
  - 35개 키워드로 프놈펜 로컬 뷰티 샵, 편집숍, 1인 소셜 셀러의 **페이스북/틱톡 공개 샵 페이지 URL (Shop Profile URLs)**을 수집하여 `shops` 마스터 DB 테이블로 구축.
* **2단계: 공개 샵 다이렉트 모니터링 파이프라인 (Direct Shop Monitoring Phase - 배치 가동)**:
  - 확보된 공개 샵 페이지 URL(예: `facebook.com/SreyNeangSkincare/`)로 로그인 없이/안전하게 직접 접속하여 최신 포스트의 작성 날짜(`posted_at`), 브랜드, 가격 및 세일 기간 정형 파싱.
* **타겟 지역 상권**: 프놈펜 BKK1, 뚤뚬뿡(Toul Tum Poung), 센속(Sensok), 뚤콕(Toul Kork), 층에악, 찌바អំពៅ, 올림픽 마켓 등 15개 전 지역

---

## 3. 정형 데이터베이스(DB) 파싱 및 수집 스키마 명세 (Data Schema & Time-Series Spec)

### 3.1. DB 테이블 구조 명세 (`phnompenh_beauty.db`)

#### ① `shops` (상점 마스터 테이블)
| DB 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `shop_id` | INTEGER PK AUTO | 상점 고유 ID |
| `shop_name` | VARCHAR(100) | 상호명 (예: `SreyNeang Skincare`) |
| `platform` | ENUM | `FACEBOOK`, `TIKTOK` |
| `shop_url` | TEXT | 공개 샵 페이지 고유 URL |
| `district_name` | VARCHAR(50) | 15개 구/동 상권 (예: `Sensok`, `BKK1`) |

#### ② `products` (뷰티 정형 제품 마스터 테이블)
| DB 컬럼명 | 데이터 타입 | 설명 |
| :--- | :--- | :--- |
| `product_id` | INTEGER PK AUTO | 제품 고유 ID |
| `brand_name` | VARCHAR(100) | 브랜드명 (예: `Anessa`, `COSRX`) |
| `product_name` | VARCHAR(150) | 정형 제품명 (예: `Anessa Perfect UV Sunscreen Milk 60ml`) |
| `category` | VARCHAR(50) | 35개 대분류 카테고리 (예: `썬케어`, `세럼`) |

#### ③ `price_history_logs` (시계열 가격 이력 테이블)
| DB 컬럼명 | 데이터 타입 | 설명 및 비고 |
| :--- | :--- | :--- |
| `log_id` | BIGINT PK AUTO | 이력 고유 ID |
| `shop_id` | INTEGER FK | `shops.shop_id` |
| `product_id` | INTEGER FK | `products.product_id` |
| **`posted_at`** | **DATETIME** | **🚨 실존 포스트 작성/게시 날짜 (ISO YYYY-MM-DD HH:MM:SS)** |
| `collected_at` | DATETIME | 시스템 수집 일시 |
| **`price_usd`** | **DECIMAL(10,2)** | **수집 시점 달러 판매 가격 ($)** |
| `price_change_rate`| DECIMAL(5,2) | 직전 가격 대비 변동률 (%) |
| `promo_type` | VARCHAR(100) | 이벤트 종류 (예: `1+1`, `20% OFF`) |
| `promo_start_date` | DATE | 세일 시작일 |
| `promo_end_date` | DATE | 세일 종료일/만료일 |
| `is_promo_active` | BOOLEAN | 현재 시점 세일 진행 유효 여부 (`TRUE/FALSE`) |
| `post_url` | TEXT | 원본 포스트 URL 링크 |

---

### 3.2. DB 구축을 통한 핵심 서비스 기능
1. **계정 정지 리스크 0%**: 페이스북/틱톡 로그인 검색창을 쏘지 않고 공개 샵 URL 타임라인을 파싱하여 정지 위험 완벽 회피.
2. **게시 날짜 기반 가격 변동 그래프 (Price Trends Chart)**: 동일 상품의 게시 날짜(`posted_at`)별 시세 추이 및 역대 최저가 시각화.
3. **실시간 유효 세일 샵 필터 (Active Sales Filter)**: `is_promo_active = TRUE` 조건을 만족하는 진행 중인 세일 샵 핀포인트 제공.


