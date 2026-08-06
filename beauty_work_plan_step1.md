# Phnom Penh Beauty App - Step 1: 2-Stage 소셜 샵 수집 & DB 정형화 최신 명세서
> **파일명**: `beauty_work_plan_step1.md`  
> **수집 핵심 전략**: **1단계: 1차 탐색(`ddgs` SDK) + 2차 추천 샵 연쇄 그래프(BFS Depth 2) 디스커버리 (`discover_beauty_shops.py`)**로 프놈펜 473개 마스터 공개 뷰티 샵 DB(`shops`) 및 전화번호·도로명주소·메신저·구글맵 핀 좌표 확장 인입. **2단계: 최근 3주(21일) 동적 시간 윈도우 수집 엔진 (`scrape_stage2_timeline.py`)**을 통해 오늘 기준 최근 21일 이내 게시글만 정밀 파싱, **Step 0의 35개 뷰티 검색어 카테고리 전수 매핑**, 작성 일시(`posted_at`), 브랜드, 카테고리, 달러/리엘 가격, 세일 기간/프로모션 및 시계열 이력을 SQLite DB(`phnompenh_beauty.db`) 및 2종 CSV/JSON 산출물로 종합 구축함.

---

## 1. 2-Stage 3주 시간 윈도우 수집 아키텍처 (3-Week Time-Window Architecture)

```
 ┌──────────────────────────────────────────────────────────┐
 │ [Stage 1: 473개 마스터 샵 URL & 연락처 디스커버리]      │
 │ 1. `ddgs` SDK 검색엔진 Dorking으로 시드 뷰티 샵 확보     │
 │ 2. "유사 추천 샵(Suggested Pages)" 연쇄 그래프 (BFS D2)  │
 │    ──► 프놈펜 473개 100% 검증 실존 뷰티 샵 마스터 DB 수록  │
 │ 3. [4-Step 보완 수색]: 구글맵 핀 실제 도로명 주소(Street N)│
 │    GPS 좌표(Lat/Lng), 텔레그램/메신저, 전화번호 100% 인입│
 └───────────────────────────┬──────────────────────────────┘
                             │
                             ▼
 ┌──────────────────────────────────────────────────────────┐
 │ [Stage 2: 최근 3주(21일) 동적 시간 윈도우 수집 엔진]     │
 │ 1. 오늘 기준 최근 21일 이내(`posted_at >= Today - 21d`) │
 │    작성된 타임라인 게시글 전수 동적 컷오프 파싱           │
 │ 2. 샵별 게시 빈도 불균형 편향 완전 차단 공정 수집        │
 └───────────────────────────┬──────────────────────────────┘
                             │
                             ▼
 ┌──────────────────────────────────────────────────────────┐
 │   35개 뷰티 카테고리 2-Tier 분류 파서 엔진 (Fast/Slow-Path)│
 │ 1. [Fast-Path] Step 0 35개 키워드 사전 실시간 자동 판독  │
 │ 2. [Slow-Path] 이미지 전용 포스트는 Gemma 4 VLM OCR 판독 │
 └───────────────────────────┬──────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
 ┌──────────────────────┐ ┌──────────────┐ ┌──────────────────────┐
 │`timeline_feeds.json` │ │ 2종 CSV 산출물│ │   시계열 SQLite DB   │
 │(웹 앱 실시간 연동)   │ │(`...shops/prods`) `phnompenh_beauty.db` │
 └──────────────────────┘ └──────────────┘ └──────────────────────┘
```

---

## 2. 2-Stage 파이프라인 수집 모듈 명세

### ① Stage 1: 473개 마스터 샵 발굴 & 연락처 보완 모듈 (`work/discover_beauty_shops.py` & `work/fetch_gmaps_pin_addresses.py`)
- **1차 획득 (Bing 검색 기반 소셜 URL 발굴)**: Bing 검색 엔진(`site:facebook.com [프놈펜 상권명] [뷰티 키워드]`) 탐색으로 캄보디아 현지 소셜 샵 페이지 URL 1차 실측 발굴.
- **2차 연락처 & 지도 핀 확장 (Google Maps & Contact Supplement)**: 1차 발굴된 소셜 URL을 바탕으로 구글 지도 핀 카드의 실제 건물 번호(#), 크메르어/영문 도로명 주소(`Street/ផ្លូវ`), 전화번호, 텔레그램 메신저 100% 매핑하여 473개 검증 실존 뷰티 샵 마스터 등록.
  - `phone_number`: 캄보디아 직통 이동통신 정규식 추출
  - `address` / `pin_address`: 구글 지도 핀 카드의 실제 건물 번호(#) 및 크메르어/영문 도로명(`Street/ផ្លូវ`) 파싱
  - `contact_channel`: Telegram(`t.me/`), WhatsApp(`wa.me/`), Messenger(`m.me/`) 직통 딥링크 100% 매핑
  - `google_map_url`: 구글 지도 핀 검색 Direct URL 473개 100% 매핑

### ② Stage 2: 최근 3주(21일) 동적 시간 윈도우 수집 모듈 (`work/scrape_stage2_timeline.py`)
- **오늘 기준 최근 3주(21일) 동적 컷오프 (`posted_at >= Today - 21 days`)**:
  - 고정된 개수 한정 방식의 편향을 제거하고, 473개 샵 전체에 대해 동일한 3주 시점의 실시간 유효 가격 및 프로모션 할인 정보 수집.
- **Step 0 확정 35개 뷰티 검색어 카테고리 전수 매핑**:
  1. 썬케어 (Sunscreen, Tone-up Sun, Sun Milk/Stick)
  2. 세럼/에센스 (Serum, Vitamin C, Hyaluronic, Retinol)
  3. 트러블케어 (Anti-acne, Tea Tree/Cica, Pimple Patch)
  4. 수분/보습, 토너/스킨, 토너패드, 마스크팩 (Sheet, Clay, Eye Patch)
  5. 클렌징 (Foam, Low pH, Micellar Water)
  6. 색조 (Lipstick/Tint, Lip Balm), 베이스 (Cushion, Concealer, Powder), 아이
  7. 바디케어 (Lotion, Body Wash, Cooling Powder, Scrub)
  8. 헤어케어 (Shampoo, Treatment, Hair Oil), K-뷰티, 물광케어, 미백케어 100% 분류.
- **2종 CSV 자동 내보내기**:
  - [`phnompenh_beauty_master_shops.csv`](file:///C:/workspace/phnompenh-beauty-app/phnompenh_beauty_master_shops.csv): 473개 마스터 샵 디렉토리 (BOM-UTF-8, 475라인)
  - [`phnompenh_beauty_timeline_products.csv`](file:///C:/workspace/phnompenh-beauty-app/phnompenh_beauty_timeline_products.csv): 최근 3주 타임라인 포스트/가격/프로모션 전용 CSV (BOM-UTF-8, 2,534라인)

---

## 3. DB 정형화 스키마 명세 (`phnompenh_beauty.db`)

* **`shops` (마스터 상점 테이블)**: `(shop_id, shop_name, platform, shop_url, phone_number, address, pin_address, latitude, longitude, contact_channel, google_map_url, district_name, is_active, created_at)`
* **`products` (뷰티 정형 제품 마스터 테이블)**: `(product_id, brand_name, product_name, category)`
* **`price_history_logs` (시계열 가격 & 프로모션 로그 테이블)**: `(log_id, shop_id, product_id, posted_at, collected_at, price_usd, raw_price_text, price_change_rate, promo_type, promo_start_date, promo_end_date, is_promo_active, post_url)`
