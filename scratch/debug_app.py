from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Capture console messages
        logs = []
        page.on("console", lambda msg: logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: logs.append(f"[ERROR] {err}"))

        try:
            print("Navigating to http://localhost:5174...")
            page.goto('http://localhost:5174', timeout=30000)
            page.wait_for_load_state('networkidle')
            time.sleep(2) # Wait for any hydration errors
            
            page.screenshot(path='c:/Users/lenovo/Desktop/iptv/scratch/screenshot.png', full_page=True)
            print("Screenshot saved to c:/Users/lenovo/Desktop/iptv/scratch/screenshot.png")
            
            print("\n--- Console Logs ---")
            for log in logs:
                print(log)
            print("--- End of Logs ---\n")
            
        except Exception as e:
            print(f"Error during navigation: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
