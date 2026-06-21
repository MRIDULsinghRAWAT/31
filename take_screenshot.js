const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({
            args: ['--use-gl=swiftshader', '--enable-webgl', '--no-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });
        const page = await browser.newPage();
        
        // Log console to catch any errors
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.error('PAGE ERROR:', err));
        
        await page.goto('file:///C:/Users/Mridul/Desktop/Don/index.html', { waitUntil: 'networkidle0' });
        
        // Wait a few seconds for animations and scripts
        await new Promise(r => setTimeout(r, 4000));
        
        // Scroll to about section to trigger IntersectionObserver
        await page.evaluate(() => {
            const el = document.getElementById('about-section');
            if (el) el.scrollIntoView();
        });
        
        await new Promise(r => setTimeout(r, 2000));
        
        const element = await page.$('#about-section');
        if (element) {
            await element.screenshot({path: 'C:/Users/Mridul/Desktop/Don/about_section_screenshot.png'});
            console.log("Screenshot saved.");
        } else {
            console.log("Element #about-section not found.");
            // Take full page screenshot
            await page.screenshot({path: 'C:/Users/Mridul/Desktop/Don/about_section_screenshot.png'});
        }
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
