import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        print("Navigating to https://www.niraalpina.com/ ...")
        await page.goto("https://www.niraalpina.com/", wait_until="networkidle", timeout=30000)
        
        # Wait for page to fully load
        print("Waiting for page to load...")
        await asyncio.sleep(4)
        
        # Try to dismiss cookie banners
        cookie_selectors = [
            "button:has-text('Accept All')",
            "button:has-text('Accept all')",
            "button:has-text('Accept')",
            "button:has-text('Agree')",
            "button:has-text('Allow All')",
            "button:has-text('Allow all')",
            "button:has-text('OK')",
            "button:has-text('Got it')",
            "button:has-text('I agree')",
            "button:has-text('Consent')",
            "a:has-text('Accept All')",
            "a:has-text('Accept all')",
            "a:has-text('Accept')",
            "[id*='cookie'] button",
            "[class*='cookie'] button",
            "[id*='consent'] button",
            "[class*='consent'] button",
            "[id*='gdpr'] button",
            "[class*='gdpr'] button",
            "#onetrust-accept-btn-handler",
            ".cc-btn.cc-dismiss",
            "[data-action='accept']",
            "[aria-label*='accept']",
            "[aria-label*='Accept']",
        ]
        
        dismissed = False
        for selector in cookie_selectors:
            try:
                element = await page.query_selector(selector)
                if element and await element.is_visible():
                    await element.click()
                    print(f"Clicked cookie banner element: {selector}")
                    dismissed = True
                    break
            except Exception as e:
                continue
        
        if dismissed:
            print("Cookie banner dismissed. Waiting 2 seconds...")
            await asyncio.sleep(2)
        else:
            print("No cookie banner found or already dismissed.")
        
        # Take screenshot
        output_path = r"c:\Users\HP\Downloads\my portfolio\assets\images\web_niraalpina.png"
        await page.screenshot(path=output_path, full_page=False)
        print(f"Screenshot saved to: {output_path}")
        
        await browser.close()

asyncio.run(main())
