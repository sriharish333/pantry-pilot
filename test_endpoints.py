import urllib.request
import json

def test_url(url, method='GET', data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data_bytes = json.dumps(data).encode('utf-8')
    else:
        data_bytes = None
    try:
        with urllib.request.urlopen(req, data=data_bytes, timeout=5) as resp:
            content = resp.read()
            print(f"[{resp.status}] {url} -> {len(content)} bytes")
            content_type = resp.headers.get('Content-Type', '')
            if 'application/json' in content_type:
                parsed = json.loads(content.decode('utf-8'))
                if 'items' in parsed:
                    print(f"   -> Found {len(parsed['items'])} items")
                elif 'status' in parsed:
                    print(f"   -> Status: {parsed['status']}")
                elif 'alerts' in parsed:
                    print(f"   -> Found {len(parsed['alerts'])} alerts")
                elif 'buy' in parsed:
                    print(f"   -> Buy recommendations: {len(parsed['buy'])}, Don't Buy: {len(parsed['dont_buy'])}")
                elif 'monthly_spending' in parsed:
                    print(f"   -> Monthly Spending: ₹{parsed['monthly_spending']}")
    except Exception as e:
        print(f"FAILED {url}: {e}")

if __name__ == "__main__":
    print("Testing PantryPilot Backend & Built Frontend:")
    test_url("http://127.0.0.1:8000/")
    test_url("http://127.0.0.1:8000/api/pantry")
    test_url("http://127.0.0.1:8000/api/predictions")
    test_url("http://127.0.0.1:8000/api/recommendations")
    test_url("http://127.0.0.1:8000/api/alerts")
    test_url("http://127.0.0.1:8000/api/insights")
    test_url("http://127.0.0.1:8000/api/verify", method='POST', data={'calculation_type': 'food_waste_and_savings'})
