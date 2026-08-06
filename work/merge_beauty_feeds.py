import json
import csv
import os
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def merge_feeds():
    print("🔄 [이원화 병합 모듈] 페이스북 + 틱톡 데이터 통합 처리 중...")
    app_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    fb_json_path = os.path.join(app_root, "facebook_feeds.json")
    tt_json_path = os.path.join(app_root, "tiktok_feeds.json")
    
    merged_items = []
    seen_urls = set()
    
    if os.path.exists(fb_json_path):
        try:
            with open(fb_json_path, "r", encoding="utf-8") as f:
                fb_data = json.load(f)
                merged_items.extend(fb_data)
                print(f"  • 페이스북 수집 데이터 인입: {len(fb_data)}개")
        except Exception as e:
            print(f"FB JSON 읽기 에러: {e}")
            
    if os.path.exists(tt_json_path):
        try:
            with open(tt_json_path, "r", encoding="utf-8") as f:
                tt_data = json.load(f)
                merged_items.extend(tt_data)
                print(f"  • 틱톡 수집 데이터 인입: {len(tt_data)}개")
        except Exception as e:
            print(f"TT JSON 읽기 에러: {e}")
            
    # Output to master social_feeds.json
    master_json_path = os.path.join(app_root, "social_feeds.json")
    with open(master_json_path, "w", encoding="utf-8") as f:
        json.dump(merged_items, f, ensure_ascii=False, indent=4)
        
    # Output to master CSV (with Excel lock safety)
    master_csv_path = os.path.join(app_root, "phnompenh_beauty_live_prices.csv")
    headers = ["Source", "Store Name", "Category", "Brand", "Product Name", "Price (USD)", "Special Event & Promo", "Social Content", "Likes Count", "Timestamp"]
    
    try:
        with open(master_csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            for item in merged_items:
                writer.writerow([
                    item.get("source", "").upper(),
                    item.get("store", ""),
                    item.get("category", ""),
                    item.get("brand", ""),
                    item.get("product_name", ""),
                    item.get("price", ""),
                    item.get("event_promo", ""),
                    item.get("content", ""),
                    item.get("likes", ""),
                    item.get("timestamp", "")
                ])
        target_csv_written = master_csv_path
    except PermissionError:
        # Fallback to secondary CSV if user has main CSV open in Excel
        alt_csv_path = os.path.join(app_root, "phnompenh_beauty_live_prices_updated.csv")
        with open(alt_csv_path, "w", encoding="utf-8-sig", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            for item in merged_items:
                writer.writerow([
                    item.get("source", "").upper(),
                    item.get("store", ""),
                    item.get("category", ""),
                    item.get("brand", ""),
                    item.get("product_name", ""),
                    item.get("price", ""),
                    item.get("event_promo", ""),
                    item.get("content", ""),
                    item.get("likes", ""),
                    item.get("timestamp", "")
                ])
        target_csv_written = alt_csv_path
        print(f"⚠️ 'phnompenh_beauty_live_prices.csv'가 엑셀에서 열려 있어 '{alt_csv_path}' 파일로 대체 기록되었습니다.")
            
    print("====================================================")
    print(f"🎉 이원화 병합 완수! 총 {len(merged_items)}개 데이터 통합 완료.")
    print(f"📁 [마스터 JSON] '{master_json_path}' ({len(merged_items)}개)")
    print(f"📊 [마스터 CSV]  '{target_csv_written}' ({len(merged_items)}개)")
    print("====================================================")

if __name__ == "__main__":
    merge_feeds()
