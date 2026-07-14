const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    try {
        console.log("Launching browser for screenshot...");
        const browser = await puppeteer.launch({
            args: ['--use-gl=swiftshader', '--enable-webgl', '--no-sandbox', '--disable-web-security'],
            defaultViewport: { width: 1200, height: 1600 }
        });
        const page = await browser.newPage();
        
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err));
        
        console.log("Loading about.html...");
        await page.goto('file:///C:/Users/Mridul/Desktop/Don/about.html', { waitUntil: 'networkidle2' });
        
        console.log("Waiting for rendering...");
        await new Promise(r => setTimeout(r, 3000));
        
        const screenshotPath = 'C:/Users/Mridul/.gemini/antigravity-ide/brain/265c0af6-062f-4c05-8be2-d953ae876ad4/about_desktop_preview.png';
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Saved screenshot to ${screenshotPath}`);
        
        // Capture mobile viewport
        console.log("Capturing mobile layout...");
        await page.setViewport({ width: 390, height: 1200 });
        await new Promise(r => setTimeout(r, 1000));
        
        const mobileScreenshotPath = 'C:/Users/Mridul/.gemini/antigravity-ide/brain/265c0af6-062f-4c05-8be2-d953ae876ad4/about_mobile_preview.png';
        await page.screenshot({ path: mobileScreenshotPath, fullPage: true });
        console.log(`Saved mobile screenshot to ${mobileScreenshotPath}`);
        
        await browser.close();
    } catch(e) {
        console.error("Screenshot error:", e);
    }
})();
