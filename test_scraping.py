import requests
import re
import json

def test_facebook_mbasic():
    print("\n--- 1. 페이스북 모바일/데스크톱 접근 테스트 (requests 사용) ---")
    
    # Try the main desktop URL with high-fidelity headers
    urls = [
        "https://www.facebook.com/guardiancambodia"
    ]
    
    # Standard desktop browser headers, accepting gzip/deflate for WAF compatibility
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',  # Gzip/Deflate only (requests will auto-decode this, bypassing brotli issue)
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
    }
    
    for url in urls:
        print(f"URL 시도 중: {url}")
        try:
            session = requests.Session()
            response = session.get(url, headers=headers, timeout=10, allow_redirects=True)
            print(f"응답 코드: {response.status_code} | 크기: {len(response.text)} characters")
            
            if response.status_code == 200:
                html = response.text
                text_only = re.sub(r'<[^>]+>', ' ', html)
                matched_words = re.findall(r'(Guardian|beauty|Cambodia|ឡេ|ម៉ាស)', text_only, re.IGNORECASE)
                print(f"매칭된 키워드 개수: {len(matched_words)}개 (예: {matched_words[:5]})")
                
                if "login" in response.url or "checkpoint" in response.url:
                    print("⚠️ 페이스북 로그인 방어벽(Redirect to Login)에 걸렸습니다.")
                else:
                    lines = [line.strip() for line in text_only.split('\n') if line.strip()]
                    print("가져온 첫 5줄 텍스트:")
                    for line in lines[:5]:
                        if line:
                            print(f" > {line[:100]}")
                    return True
            else:
                print(f"실패: 상태 코드 {response.status_code}")
        except Exception as e:
            print(f"페이스북 URL {url} 시도 실패: {e}")
            
    return False

def test_tiktok_embedded():
    print("\n--- 2. 틱톡 내장 Rehydration 데이터 파싱 테스트 (requests 사용) ---")
    url = "https://www.tiktok.com/tag/cambodiabeauty"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"성공적으로 HTML 수신 완료! 크기: {len(response.text)} characters")
        html = response.text
        
        # Search for the JSON hydration block
        match = re.search(r'id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>(.*?)<\/script>', html)
        if match:
            json_str = match.group(1)
            print(f"Rehydration JSON 블록 발견! 크기: {len(json_str)} bytes")
            data = json.loads(json_str)
            print("JSON 파싱 성공. 정상적으로 틱톡 내부 데이터를 읽을 수 있습니다.")
        else:
            print("Rehydration JSON 블록을 찾지 못했습니다. 대체 텍스트/해시태그 매칭 탐색...")
            tags_found = re.findall(r'"title"\s*:\s*"([^"]+)"', html)
            print(f"검출된 메타 타이틀 데이터 예시: {tags_found[:3]}")
            
        return True
    except Exception as e:
        print(f"틱톡 테스트 실패: {e}")
        return False

if __name__ == "__main__":
    test_facebook_mbasic()
    test_tiktok_embedded()
