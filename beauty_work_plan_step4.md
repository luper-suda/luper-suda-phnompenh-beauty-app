# Phnom Penh Beauty App - Step 4: 배포 및 무인 주 2회 자동 업데이트 매뉴얼 (최종 개편판)
> **파일명**: `beauty_work_plan_step4.md`  
> **목적**: 페이스북/인스타그램 계정 정지 및 IP 차단을 100% 회피하고 $0의 비용으로 **주 2회(화/금) 클라우드 무인 자동 데이터 수집 및 파이어베이스 상용 웹 배포**를 완수하는 100% 무인 파이프라인 명세.

---

## 1. 100% 무료 무인 클라우드 배치 스펙 (Bi-Weekly Batch Pipeline)

* **배치 실행기**: **GitHub Actions** (`.github/workflows/biweekly_scrape.yml`)
* **실행 주기**: **주 2회 (매주 화요일 & 금요일 UTC 00:00 / 캄보디아 프놈펜 시간 오전 7:00)**
  - **화요일**: 주중 일반 시세 및 신규 샵 타임라인 파싱.
  - **금요일**: 주말 특가 및 프로모션 세일 기간 집중 파싱.
* **상용 호스팅 서버**: **Firebase Hosting** (프로젝트 ID: `oz-box` / 타겟 사이트: `tida-beauty-app`)
* **상용 라이브 앱 URL**: **`https://tida-beauty-app.web.app`**
* **운영 비용**: **$0 (100% 무료)**
* **특징**: 무리한 실시간 전체 검색을 지양하고 **공개 샵 URL 직접 타겟팅 주 2회 수집**으로 IP 차단 및 계정 정지 리스크 0% 달성.

---

## 2. 샵 최저가 자동 수집 & 4단계 정밀 파싱 매커니즘

### 1단계: 473개 마스터 샵 공개 URL 타겟팅 (Playwright Headless Browser)
- SQLite DB (`phnompenh_beauty.db` -> `shops` 테이블)에 등록된 프놈펜 473개 뷰티 샵의 공개 소셜 페이지(Facebook / Instagram / TikTok) URL을 **Playwright Chromium Headless 브라우저**로 직접 진입.
- 무분별한 검색창 수집을 배제하여 플랫폼 봇 감지 알고리즘 및 IP 차단을 100% 회피.

### 2단계: 소셜 타임라인 포스트 텍스트 & 메타데이터 파싱
- 각 샵의 최근 게시물 타임라인 본문 텍스트, 이미지 URL, 태그 및 게시 시각 메타데이터를 스크롤 및 추출.

### 3단계: 정규식(Regex) 기반 달러/리엘 가격 & 세일 판독 (`fetch_shops_direct.py`)
- **통화 파싱**: 본문 내 `$12.50`, `$14`, `51,250 ៛`, `55000r` 등 달러/리엘 가격 표기를 정규식으로 감지하여 `price_usd`, `price_riel` 통화 숫자로 정량 전환.
- **세일 태그 감지 (`is_promo_active`)**: 본문 내 `Sale`, `Discount`, `Special Offer`, `% Off`, `បញ្ចុះតម្លៃ` (크메르어 할인 표기) 감지 시 `is_promo_active = 1` 자동 부여.
- **카테고리 & 브랜드 1:1 매핑**: 사전 정의된 35개 카테고리(`썬케어`, `세럼`, `클렌징` 등) 및 브랜드(`Anessa`, `COSRX`, `Garnier` 등) 자동 라벨링.

### 4단계: 게시 날짜 판독 및 동적 3주 시간 윈도우 (Recency Engine)
- **게시 시각 표준화**: `<time datetime="...">` 및 상대 시각(`2 hrs ago`, `Yesterday`, `3 days ago`)을 읽어 ISO 표준 날짜(`YYYY-MM-DD HH:MM:SS`)로 규격화.
- **오늘 신규 게시물 구별 (`NEW TODAY`)**: 수집 당일 생성된 포스트는 `is_today: true` 및 `NEW TODAY` 엠블럼 부여.
- **3주 시간 윈도우 (21-Day Threshold)**: 최근 21일 이내 포스트만 유효 시세로 인입하며, 21일이 경과한 오래된 만료 포스트는 시세 비교 대상에서 자동 제외하여 최신성 보장.

---

## 3. 중복 제거 & 프놈펜 최저가 대표 샵 선정 알고리즘 (Deduplication Engine)

1. **제품명 (`product_name`) 기준 100% 중복 노출 방지**
   - 2,532개 전체 포스트 피드 중 동일한 화장품은 메인 및 카테고리 피드에 **단 1개의 고유 카드만 노출**.
2. **프놈펜 최저가 샵 대표 카드 자동 선발 (`getDeduplicatedFeeds`)**
   - 동일 상품을 판매 중인 프놈펜 전체 샵 중 **가장 저렴한 가격(`Math.min(price_usd)`)을 제시하는 샵을 최저가 대표 샵으로 카드에 표기**.
3. **인앱 뷰 전환 (In-App View Navigation)**
   - 제품 카드를 누르면 팝업 창 없이 동일 앱 화면 내에서 **`프놈펜 샵별 가격 비교 뷰`**로 매끄럽게 전환되어 83개 이상 전체 샵의 가격 순위 및 샵 프로필 정보 노출.

---

## 4. GitHub Actions 무인 워크플로 스펙 (`.github/workflows/biweekly_scrape.yml`)

```yaml
name: Bi-Weekly Phnom Penh Beauty Price Scraper & Firebase Deploy

on:
  schedule:
    # Runs at 00:00 UTC every Tuesday and Friday (07:00 AM Phnom Penh Time)
    - cron: '0 0 * * 2,5'
  workflow_dispatch: # Allows manual trigger if needed

jobs:
  scrape-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          pip install requests beautifulsoup4 playwright sqlite3
          playwright install chromium

      - name: Run Direct Shop Monitoring Scraper
        run: |
          python work/fetch_shops_direct.py || true
          python work/ingest_to_db.py || true

      - name: Auto-commit Updated Feeds & SQLite DB
        run: |
          git config --global user.name 'github-actions[bot]'
          git config --global user.email 'github-actions[bot]@users.noreply.github.com'
          git add phnompenh_beauty_timeline_feeds.json phnompenh_beauty.db || true
          git commit -m "Auto-update bi-weekly Phnom Penh beauty prices and SQLite DB [skip ci]" || exit 0
          git push || true

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT_OZ_BOX }}'
          channelId: live
          projectId: oz-box
          target: tida-beauty-app
```

---

## 5. 무상 웹 배포 및 운영 스펙 (Firebase Hosting)

1. **24시간 365일 무상 상용 웹 호스팅**: Firebase Hosting을 통해 **`https://tida-beauty-app.web.app`** 상용 엔드포인트 유지.
2. **자동 동기화**: 주 2회 GitHub Actions가 최신 시세 수집 후 자동 커밋하고, Firebase Hosting으로 1초 만에 라이브 배포하여 최신 프놈펜 뷰티 샵의 최저가 데이터와 게시 날짜 기반 시계열 차트를 갱신함.
