import asyncio
import json
import re
import urllib.parse
from datetime import datetime, timezone
import os
import sys
import io
import csv
import random
import base64
from playwright.async_api import async_playwright
from bs4 import BeautifulSoup

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

STEP0_SEARCH_TERMS = [
    {"no": 1, "cat": "썬케어", "en": "Sunscreen", "kh": "ឡេការពារកម្តៅថ្ងៃ"},
    {"no": 4, "cat": "세럼/에센스", "en": "Serum", "kh": "សេរ៉ូម"},
    {"no": 11, "cat": "수분/보습", "en": "Moisturizer", "kh": "ឡេផ្តល់សំណើម"},
    {"no": 14, "cat": "마스크팩", "en": "Sheet Mask", "kh": "ម៉ាសបិទមុខ"},
    {"no": 17, "cat": "클렌징", "en": "Cleansing Foam", "kh": "ហ្វូមលាងមុខ"},
    {"no": 20, "cat": "색조", "en": "Lipstick", "kh": "ក្រែមលាបមាត់"},
]

DISTRICTS = ["BKK1", "Toul Kork", "Sensok", "Toul Tum Poung", "Daun Penh", "Chamkar Mon"]
BRANDS = ["Anessa", "Biore", "COSRX", "La Roche-Posay", "Innisfree", "Garnier", "Vaseline", "Rom&nd", "Laneige", "The Ordinary", "Bioderma", "Mediheal"]

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
]

def decode_bing_url(bing_href):
    match = re.search(r'u=a1([a-zA-Z0-9%_-]+)', bing_href)
    if match:
        b64_str = urllib.parse.unquote(match.group(1))
        rem = len(b64_str) % 4
        if rem > 0:
            b64_str += '=' * (4 - rem)
        try:
            return base64.b64decode(b64_str).decode('utf-8', errors='ignore')
        except Exception:
            pass
    return bing_href

def extract_clean_fb_url(raw_href):
    real_url = decode_bing_url(raw_href)
    unquoted = urllib.parse.unquote(real_url)
    if 'facebook.com/' in unquoted:
        clean_path = unquoted.split('facebook.com/')[-1].strip('/')
        if clean_path and not any(x in unquoted for x in ['/login', '/help', '/sharer', '/policies', 'r.php', 'play.google', 'apps.apple']):
            return unquoted
    return None

def clean_title_text(title):
    cleaned = re.sub(r'^(?:https?://)?(?:www\.)?(?:facebook|tiktok)\.com[^\s]*', '', title, flags=re.IGNORECASE).strip(' ›-')
    return cleaned if cleaned else title

def extract_event_promo(text):
    text_lower = text.lower()
    promos = []
    if "1+1" in text_lower or "buy 1 get 1" in text_lower or "ទិញ ១ ថែម ១" in text or "ថែម" in text:
        promos.append("🎁 1+1 ពិសេស (1+1 증정)")
    if "free delivery" in text_lower or "ហ្វ្រីដឹក" in text or "ដឹកហ្វ្រី" in text:
        promos.append("🚚 ហ្វ្រីដឹកភ្នំពេញ (프놈펜 무료 배송)")
    if "%" in text or "off" in text_lower or "discount" in text_lower or "promotion" in text_lower or "ពិសេស" in text:
        promos.append("🔥 Promotion ពិសេស (특별 할인 혜택)")
    if "gift" in text_lower or "sample" in text_lower or "កាដូ" in text or "ថែមជូន" in text:
        promos.append("✨ ថែមជូនកាដូ (사은품 증정)")
    return " | ".join(promos[:2]) if promos else "✨ ហាងលក់ទំនិញផ្ទាល់ (현지 로컬 샵 파싱)"

def parse_price_from_text(text):
    usd_match = re.search(r'(?:\$\s*([0-9]+(?:\.[0-9]+)?)|([0-9]+(?:\.[0-9]+)?)\s*\$)', text)
    if usd_match:
        val_str = usd_match.group(1) or usd_match.group(2)
        try:
            val = float(val_str)
            if 0.5 <= val <= 250.0:
                return f"${val:.2f}"
        except ValueError:
            pass
            
    khr_match = re.search(r'([0-9]{1,3}(?:,[0-9]{3})*|[0-9]{4,6})\s*(?:riel|khr|៛)', text, re.IGNORECASE)
    if khr_match:
        khr_str = khr_match.group(1).replace(",", "")
        try:
            khr_val = float(khr_str)
            usd_equiv = khr_val / 4000.0
            if 0.5 <= usd_equiv <= 250.0:
                return f"${usd_equiv:.2f}"
        except ValueError:
            pass
    return "미기재 (포스트 본문 파싱)"

def clean_store_name(title, url, fallback_district):
    clean_t = clean_title_text(title)
    unquoted = urllib.parse.unquote(url)
    match = re.search(r'facebook\.com/([^/\?&]+)', unquoted)
    if match:
        raw = match.group(1).replace('.', ' ').replace('-', ' ').title()
        return f"{raw} ({fallback_district} FB)"
    clean = clean_t.split('-')[0].split('|')[0].strip() or f"{fallback_district} FB Shop"
    return f"{clean} ({fallback_district} FB)"

def categorize_term(text):
    text_lower = text.lower()
    for term in STEP0_SEARCH_TERMS:
        if term["en"].lower() in text_lower or term["kh"] in text:
            return term
    return STEP0_SEARCH_TERMS[0]

def extract_brand_from_text(text, fallback_category_brand):
    text_lower = text.lower()
    for b in BRANDS:
        if b.lower() in text_lower:
            return b
    return fallback_category_brand

async def harvest_single_query_deep(browser, query, pages=3):
    context = await browser.new_context(
        user_agent=random.choice(USER_AGENTS),
        locale="en-US",
        viewport={'width': 1366, 'height': 768}
    )
    page = await context.new_page()
    await page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    
    results = []
    
    for i in range(pages):
        first_param = (i * 10) + 1
        url = f"https://www.bing.com/search?q={urllib.parse.quote(query)}&first={first_param}"
        try:
            await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            await page.wait_for_timeout(random.uniform(2500, 3500))
            
            html = await page.content()
            soup = BeautifulSoup(html, 'html.parser')
            
            items_found_this_page = 0
            for li in soup.find_all('li', class_='b_algo'):
                a = li.find('a', href=True)
                if not a:
                    continue
                clean_url = extract_clean_fb_url(a['href'])
                if clean_url:
                    raw_title = a.get_text().strip()
                    title = clean_title_text(raw_title)
                    p_elem = li.find('p') or li.find('div', class_='b_caption')
                    snippet = p_elem.get_text().strip() if p_elem else ''
                    results.append({'title': title, 'href': clean_url, 'snippet': snippet})
                    items_found_this_page += 1
            
            # If no items on this page, bing might have run out of results for this query. Break early.
            if items_found_this_page == 0:
                break
        except Exception as e:
            break
            
    await context.close()
    return results

def generate_mesh_queries():
    queries = []
    for d in DISTRICTS:
        for b in BRANDS:
            for c in STEP0_SEARCH_TERMS:
                queries.append({
                    "query": f"facebook {d} {b} {c['en']}",
                    "district": d
                })
    return queries

async def harvest_facebook_stealth():
    print("🔵 [스텔스 파서] 페이스북 뷰티 샵 딥 서치(Deep Paging & Mesh) 파싱 중...")
    results = []
    seen_urls = set()
    
    all_queries = generate_mesh_queries()
    # Sample 8 queries for this run to keep execution time reasonable but demonstrate deep paging
    sampled_queries = random.sample(all_queries, 8)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=['--disable-blink-features=AutomationControlled', '--no-sandbox']
        )
        
        for q_obj in sampled_queries:
            q_str = q_obj["query"]
            d_str = q_obj["district"]
            print(f"Deep Querying [{q_str}] (Up to 3 pages) ...")
            raw_items = await harvest_single_query_deep(browser, q_str, pages=3)
            print(f"  -> Found {len(raw_items)} live FB items from deep pages.")
            
            for item in raw_items:
                href = item["href"]
                base_url = href.split('?')[0].rstrip('/')
                if not base_url or base_url in seen_urls:
                    continue
                seen_urls.add(base_url)
                
                title = item["title"]
                snippet = item["snippet"]
                
                store_name = clean_store_name(title, href, d_str)
                price = parse_price_from_text(snippet)
                event_promo = extract_event_promo(snippet + " " + title)
                term_match = categorize_term(snippet + " " + title)
                
                # Extract actual brand via Regex / string matching
                real_brand = extract_brand_from_text(snippet + " " + title, term_match["en"].split()[0])
                
                results.append({
                    "id": f"fb-live-{len(results)+1}",
                    "source": "facebook",
                    "category": term_match["cat"],
                    "brand": real_brand,
                    "product_name": f"{real_brand} {term_match['en']}",
                    "store": store_name,
                    "badge": f"{d_str} FB [{term_match['no']}]: {term_match['kh']}",
                    "content": f"✨ [100% 라이브 수집] {title} - {snippet[:120]}...",
                    "likes": "FACEBOOK Live",
                    "price": price,
                    "event_promo": event_promo,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                })
                
            await asyncio.sleep(random.uniform(2.0, 4.0))
            
        await browser.close()
        
    print(f"🔵 [FACEBOOK 라이브 완수] 총 {len(results)}개 실존 라이브 샵 파싱 완료.")
    return results

def main():
    all_fb = asyncio.run(harvest_facebook_stealth())
    app_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(app_root, "facebook_feeds.json")
    csv_path = os.path.join(app_root, "phnompenh_beauty_facebook_prices.csv")
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(all_fb, f, ensure_ascii=False, indent=4)
        
    headers = ["Source", "Store Name", "Category", "Brand", "Product Name", "Price (USD)", "Special Event & Promo", "Social Content", "Likes Count", "Timestamp"]
    with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        for item in all_fb:
            writer.writerow([item["source"].upper(), item["store"], item["category"], item["brand"], item["product_name"], item["price"], item["event_promo"], item["content"], item["likes"], item["timestamp"]])
            
    print(f"📁 [FB JSON] '{json_path}' ({len(all_fb)}개)")
    print(f"📊 [FB CSV]  '{csv_path}' ({len(all_fb)}개)")

if __name__ == "__main__":
    main()
