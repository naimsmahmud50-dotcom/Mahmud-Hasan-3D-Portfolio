import time
from playwright.sync_api import sync_playwright

urls = [
    ("Root Live", "https://naimsmahmud50-dotcom.github.io/"),
    ("Root Lite", "https://naimsmahmud50-dotcom.github.io/lite"),
    ("Subpath Live", "https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/"),
    ("Subpath Lite", "https://naimsmahmud50-dotcom.github.io/Mahmud-Hasan-3D-Portfolio/lite")
]

print("Starting in-depth live verification with full shader render wait...")

results = {}

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=True,
        args=["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-webgpu"]
    )
    
    for label, url in urls:
        print(f"\n==================== Testing: {label} ({url}) ====================")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: console_logs.append(f"[ERROR] {err}"))
        
        t0 = time.time()
        try:
            page.goto(url, wait_until="load", timeout=25000)
            
            # Wait for canvas to be present and let WebGL render for 3.5 seconds
            time.sleep(3.5)
            
            final_url = page.url
            has_canvas = page.evaluate("() => !!document.querySelector('canvas')")
            body_text = page.evaluate("() => document.body ? document.body.innerText : ''")
            has_error = "WebGPU Not Available" in body_text
            
            screenshot_path = f"/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/live_verify_{label.lower().replace(' ', '_')}.png"
            page.screenshot(path=screenshot_path)
            
            elapsed = time.time() - t0
            results[label] = {
                "elapsed": round(elapsed, 2),
                "final_url": final_url,
                "has_canvas": has_canvas,
                "has_error_overlay": has_error,
                "screenshot": screenshot_path,
                "errors": [l for l in console_logs if "[error]" in l.lower() or "[error]" in l]
            }
            print(f"[{label}] Done: Canvas={has_canvas}, ErrorBox={has_error}, FinalURL={final_url}, Duration={elapsed:.2f}s")
            
        except Exception as e:
            print(f"[{label}] Exception: {e}")
            results[label] = {"error": str(e)}
        finally:
            page.close()
            
    browser.close()

print("\n==================== VERIFICATION SUMMARY ====================")
for k, v in results.items():
    print(f"\n--- {k} ---")
    for field, val in v.items():
        if field == "errors" and val:
            print(f"  {field}: {val[:3]}")
        else:
            print(f"  {field}: {val}")
