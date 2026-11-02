import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1000, 'height': 800})
        await page.goto('http://127.0.0.1:3001')
        await page.wait_for_timeout(1000)
        
        js_code = """
        () => {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.inset = '40px 100px';
            overlay.style.backgroundColor = '#f2f4f7';
            overlay.style.borderRadius = '16px';
            overlay.style.boxShadow = '0 20px 60px rgba(0,0,0,0.8)';
            overlay.style.zIndex = '99999';
            overlay.style.padding = '40px';
            overlay.style.display = 'flex';
            overlay.style.flexDirection = 'column';
            overlay.style.justifyContent = 'space-between';
            overlay.style.fontFamily = 'sans-serif';
            
            overlay.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                        <span style="font-size:12px; letter-spacing:0.2em; color:#666; font-weight:700;">PROJECT 01</span>
                        <h2 style="margin:8px 0; color:#111; font-size:28px; font-weight:900;">MAIJRUN TECH STORE</h2>
                        <p style="color:#555; max-width:400px; font-size:14px; line-height:1.5;">
                            Next.js full-stack 3D luxury computer retail platform with dynamic inventory and real-time GPU hardware filtering.
                        </p>
                    </div>
                    
                    <!-- HERO CONTROLS -->
                    <div class="_3nxWKG_heroControls" style="display:flex; flex-direction:column; align-items:flex-end;">
                        <button class="_3nxWKG_action _3nxWKG_control" data-control="close">CLOSE</button>
                        <button class="_3nxWKG_action _3nxWKG_control" data-control="previous">PREVIOUS</button>
                        <button class="_3nxWKG_action _3nxWKG_control" data-control="next">NEXT</button>
                    </div>
                </div>
                
                <div style="display:flex; justify-content:flex-end; margin-top:60px;">
                    <a class="_3nxWKG_action _3nxWKG_link" data-control="live" href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                        LIVE LINK
                    </a>
                </div>
            `;
            
            document.body.appendChild(overlay);
        }
        """
        await page.evaluate(js_code)
        await page.wait_for_timeout(500)
        await page.screenshot(path='/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/project_slide_controls_fixed_preview.png')
        print('Screenshot saved successfully!')
        
        # Hover over PREVIOUS to show hover state
        prev_btn = await page.query_selector('[data-control="previous"]')
        if prev_btn:
            await prev_btn.hover()
            await page.wait_for_timeout(500)
            await page.screenshot(path='/home/mahmud-hasan/.gemini/antigravity/brain/e6bc3d1f-e2b2-4748-b4d5-000419591376/project_slide_controls_hover_preview.png')
            print('Hover screenshot saved successfully!')
            
        await browser.close()

asyncio.run(run())
