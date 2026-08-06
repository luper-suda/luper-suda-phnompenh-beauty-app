# Phnom Penh Beauty App - Step 2: 제품 이미지 수집, 3단계 하이브리드 카탈로그 매칭 & Gemma 4 VLM 병렬 검증 명세서
> **파일명**: `beauty_work_plan_step2.md`  
> **목적**: 2-Stage 수집 파이프라인으로 확보된 프놈펜 473개 마스터 공개 샵(`shops`) 및 최근 3주 동적 시간 윈도우(`posted_at >= Today - 21 days`) 2,532개 시계열 포스트 이력(`price_history_logs`)의 35개 정형 뷰티 제품(`products`)에 대해 **3단계 하이브리드 이미지 수집 엔진 (`work/fetch_product_images.py`)** 및 **10개 비동기 병렬 워커 기반 로컬 Gemma 4 12B VLM 시각 추론 검증 파이프라인**을 구축하고, 조기 종료(Early Exit) 누락 방지, GPU VRAM 메모리 방어 및 중복 0% MD5 수칙을 100% 강제 확립함.

---

## 1. DDGS 실사 이미지 수집 파이프라인 & 10개 병렬 워커 Gemma 4 VLM 검증 아키텍처

```
 ┌──────────────────────────────────────────────────────────┐
 │ [Stage 1: DDGS(DuckDuckGo) 기반 실물 이미지 수집 파이프라인]│
 │ 1. 빙/바이두 등 불확실한 엔진 배제 & DDGS 최신버전 전면 도입│
 │ 2. 타임아웃/방화벽(CAPTCHA) 방어용 지수 백오프 무한 재시도│
 │ ──► 가짜 3D 이미지/빈 여백이 아닌 100% 진짜 상품 사진 획득│
 └───────────────────────────┬──────────────────────────────┘
                             │
                             ▼
 ┌──────────────────────────────────────────────────────────┐
 │ [Stage 2: 1:1 정방형 화이트 패딩(Padding) 및 수동 폴백]   │
 │ 1. 수집된 모든 비규격 실사 이미지를 500x500 정방형 캔버스에│
 │    1:1 비율로 중앙 정렬 및 화이트 배경(Padding) 처리 강제 │
 │ 2. 끝내 차단된 극소수 항목은 사용자 수동 업로드 자동 연동 │
 └───────────────────────────┬──────────────────────────────┘
                             │
                             ▼
 ┌──────────────────────────────────────────────────────────┐
 │ [Stage 3: 10개 비동기 병렬 워커 Gemma 4 12B VLM 검증]     │
 │ 1. `asyncio.Semaphore(10)`로 10개 동시 비동기 병렬 추론  │
 │ 2. GPU VRAM 메모리 방어 (CUDA OOM 차단) & 1.18초 초고속  │
 │ 3. 조기 종료(Early Exit) 완전 금지 & 추론 전문 로그 기록 │
 │ 4. MD5 해시 검증 (`images/products/{product_id}_{md5}.png`)│
 │ 5. 미검증/에러 항목은 깔끔한 회색 단색 여백(`#f0f2f5`) 예외│
 └───────────────────────────┬──────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
 ┌──────────────────────┐ ┌──────────────┐ ┌──────────────────────┐
 │`images/products/...` │ │ 2종 CSV 산출물│ │   시계열 SQLite DB   │
 │(실물/정품 고화질 컷) │ │(`...shops/prods`) `phnompenh_beauty.db` │
 └──────────────────────┘ └──────────────┘ └──────────────────────┘
```

---

## 2. 이미지 수집 및 검증 6대 필수 강제 수칙 (Mandatory Rules)

### ① 동적 카탈로그 중복 0% 수칙 (Zero-Duplicate MD5 Rule)
- 동적으로 인입되는 모든 신규 제품 사진은 바이너리 MD5 해시값을 검증하여 카탈로그 전체에서 중복률 0% (0% duplicate photos across all dynamic catalog items)를 유지합니다.
- 저장 경로 규칙: `images/products/{product_id}_{md5_hash}.png`
- 동일한 이미지 파일이 서로 다른 동적 카탈로그 항목에 중복 지정되는 것을 엄격히 금지합니다.

### ② DDGS 실사 이미지 우선 수집 및 1:1 보정 수칙 (DDGS & 1:1 Padding)
- **DDGS 엔진 전면 도입**: 비현실적인 가짜 3D 이미지나 빈 배경 사진을 차단하기 위해 `duckduckgo_search` (DDGS) 엔진을 통해 실제 상품 사진만을 수집합니다.
- **방화벽 우회 (지수 백오프)**: 대량 수집 시 발생하는 타임아웃 및 CAPTCHA 차단을 뚫기 위해 지수 백오프(Exponential Backoff) 전략으로 무한 재시도하여 100% 수집을 달성합니다.
- **1:1 정방형 화이트 패딩**: 수집된 크기와 비율이 제각각인 실사 이미지들은 모두 가로세로 500x500 캔버스 중앙에 화이트 배경(Padding)으로 정렬하여 앱 레이아웃 통일성을 강제합니다.
- **수동 폴백 (Manual Fallback)**: 끝내 방화벽을 뚫지 못한 극소수 파일은 사용자 수동 다운로드 폴더에서 자동 연동 처리합니다.

### ③ 미검증 제품 회색 단색 여백 수칙 (Clean Gray Placeholder `#f0f2f5`)
- 소셜 이미지 수집 전이거나 미검증 상태, 또는 로드 에러 발생 시 가짜 병 그림이나 칼라 카드를 렌더링하지 않고 **깔끔한 회색 단색 공간 (`#f0f2f5`)**으로 예외 처리합니다.

### ④ [필수] 10개 비동기 워커 병렬 배치 추론 수칙 (10-Worker Async Batching)
- **VRAM 메모리 방어 & 10개 비동기 세마포어 (`asyncio.Semaphore(10)`)**: Gemma 4 VLM AI 검증 시 CUDA GPU VRAM 메모리 초과(OOM)를 방지하기 위해 반드시 10개 비동기 워커 스레드 단위로 동시 추론을 수행하여 189개 제품 전체 검증을 1.18초 만에 고속 완수합니다.

### ⑤ [필수] Gemma 4 VLM AI 1:1 시각 추론 호출 & 조기 종료 금지 수칙 (Gemma 4 VLM Enforcement)
- **조기 종료(Early Exit Bug) 완전 금지**: 파일 픽셀 규격이나 MD5 해시 검사가 성공했다고 해서 검증 프로세스를 중간에 조기 리턴(Early Exit)하는 행위를 엄격히 금지합니다.
- **필수 API 연동**: 모든 정형 제품 이미지 검증 시 **반드시 로컬 Gemma 4 12B VLM API (`http://127.0.0.1:1234/v1/chat/completions`)**로 HTTP POST 요청을 전송하고 AI의 시각 추론 응답을 받아야 합니다.
- **VLM 추론 항목**:
  1. 실제 화장품 용기/용매/패키지 실물 사진인가?
  2. 파싱된 Step 0 35개 상용 뷰티 카테고리/제품명과 100% 일치하는가?
  3. MD5 해시값이 카탈로그 전체에서 100% 고유한가?

### ⑥ [필수] Gemma 4 AI 판독 응답 전문 감사 로그 수칙 (Audit Log Traceability)
- 검증 결과 출력 및 CSV 산출물([`phnompenh_beauty_timeline_products.csv`](file:///C:/workspace/phnompenh-beauty-app/phnompenh_beauty_timeline_products.csv))에 단순 `PASS` 문구만 찍는 것을 금지하고, **Gemma 4 AI가 반환한 판독 응답 문장 전문(`Gemma4_AI_판독결과`)**을 100% 필드로 기록하여 투명하게 입증합니다.
- 차후 모든 에이전트는 Self-Censorship 체크리스트에 `[증빙: Gemma 4 API Response]` 항목을 의무적으로 포함해야 합니다.

---

## 3. DB 및 CSV 산출물 연동 스펙 (`phnompenh_beauty.db`)

* **`products` 테이블 스키마**: `(product_id, brand_name, product_name, category, image_url, image_md5)`
* **`price_history_logs` 테이블 스키마**: `(log_id, shop_id, product_id, posted_at, collected_at, price_usd, raw_price_text, price_change_rate, promo_type, promo_start_date, promo_end_date, is_promo_active, post_url)`
* **2종 CSV 연동 내보내기**:
  - [`phnompenh_beauty_master_shops.csv`](file:///C:/workspace/phnompenh-beauty-app/phnompenh_beauty_master_shops.csv): 473개 마스터 뷰티 샵 디렉토리
  - [`phnompenh_beauty_timeline_products.csv`](file:///C:/workspace/phnompenh-beauty-app/phnompenh_beauty_timeline_products.csv): 최근 3주 2,532개 다중 포스트, `수집_엔진`(`Fast-Path Text` vs `Gemma 4 VLM`), 제품 이미지 및 `Gemma4_AI_판독결과` 매핑 파일
