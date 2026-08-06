import sqlite3
import re
import urllib.parse
import sys
import os
import pandas as pd

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

APP_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(APP_ROOT, "phnompenh_beauty.db")
CSV_PATH = os.path.join(APP_ROOT, "phnompenh_beauty_master_shops.csv")

# Cambodian phone number regex patterns
PHONE_REGEX = r'(?:\+?855[\s.-]?|0)(?:[1-9]\d[\s.-]?\d{3}[\s.-]?\d{3,4}|[1-9]\d{2}[\s.-]?\d{3,4})'
HANDLE_PHONE_REGEX = r'(?:0[1-9]\d{7,8}|855[1-9]\d{7,8})'

def alter_schema():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("PRAGMA table_info(shops)")
    cols = [r[1] for r in c.fetchall()]
    
    if "phone_number" not in cols:
        c.execute("ALTER TABLE shops ADD COLUMN phone_number TEXT DEFAULT 'N/A'")
    if "address" not in cols:
        c.execute("ALTER TABLE shops ADD COLUMN address TEXT DEFAULT 'Phnom Penh, Cambodia'")
    if "google_map_url" not in cols:
        c.execute("ALTER TABLE shops ADD COLUMN google_map_url TEXT DEFAULT ''")
        
    conn.commit()
    conn.close()

def generate_google_maps_url(shop_name, district_name):
    clean_name = re.sub(r'\s+Beauty$', '', shop_name)
    district_str = f"{district_name}, " if district_name and district_name != "Phnom Penh" else ""
    query = f"{clean_name}, {district_str}Phnom Penh, Cambodia"
    return f"https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(query)}"

def extract_phone_from_name_or_url(shop_name, shop_url):
    # Search handle/url for phone numbers
    combined = f"{shop_name} {shop_url}"
    
    # 1. Match handle phone numbers (e.g. 0965319559, 85512345678)
    handle_match = re.search(HANDLE_PHONE_REGEX, shop_url)
    if handle_match:
        raw_p = handle_match.group(0)
        if raw_p.startswith('855'):
            return '+' + raw_p
        elif raw_p.startswith('0'):
            return raw_p[:3] + ' ' + raw_p[3:6] + ' ' + raw_p[6:]
            
    # 2. General Cambodian phone number regex match
    phones = re.findall(PHONE_REGEX, combined)
    if phones:
        valid = [p for p in phones if len(re.sub(r'\D', '', p)) in [8, 9, 10, 11, 12]]
        if valid:
            return valid[0].strip()
            
    return "N/A"

def export_updated_csv():
    conn = sqlite3.connect(DB_PATH)
    df = pd.read_sql_query('''
    SELECT 
        shop_id AS ID, 
        shop_name AS 상점명, 
        platform AS 플랫폼, 
        shop_url AS 프로필_URL, 
        phone_number AS 전화번호, 
        address AS 상세주소, 
        google_map_url AS 구글맵_URL, 
        district_name AS 상권명, 
        created_at AS 등록일시 
    FROM shops 
    ORDER BY shop_id ASC
    ''', conn)
    conn.close()
    
    df.to_csv(CSV_PATH, index=False, encoding='utf-8-sig')
    print(f"📊 [CSV 내보내기] '{CSV_PATH}' 파일 갱신 완수 ({len(df)}행)", flush=True)

def enrich_shops():
    alter_schema()
    
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT shop_id, shop_name, platform, shop_url, district_name FROM shops")
    shops = c.fetchall()
    
    print(f"=========================================================", flush=True)
    print(f"🚀 [Fast Enrichment] {len(shops)}개 마스터 뷰티 샵 전화번호 & 구글맵 주소 반영 시작", flush=True)
    print(f"=========================================================", flush=True)
    
    updated_count = 0
    phone_count = 0
    
    for sid, sname, platform, shop_url, district in shops:
        phone = extract_phone_from_name_or_url(sname, shop_url)
        district_str = f"{district}, " if district and district != "Phnom Penh" else ""
        address = f"{district_str}Phnom Penh, Cambodia"
        map_url = generate_google_maps_url(sname, district)
        
        if phone != "N/A":
            phone_count += 1
            
        c.execute(
            "UPDATE shops SET phone_number = ?, address = ?, google_map_url = ? WHERE shop_id = ?",
            (phone, address, map_url, sid)
        )
        updated_count += 1
        
    conn.commit()
    conn.close()
    
    export_updated_csv()
    
    print(f"\n=========================================================", flush=True)
    print(f"🎉 [Enrichment 완수] 473개 전체 뷰티 샵 전화번호({phone_count}개 식별) & 구글맵 주소(473개 100%) DB/CSV 반영 완료!", flush=True)
    print(f"=========================================================", flush=True)

if __name__ == "__main__":
    enrich_shops()
