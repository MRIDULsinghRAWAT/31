const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({
            args: ['--use-gl=swiftshader', '--enable-webgl', '--no-sandbox'],
            defaultViewport: { width: 1920, height: 1080 }
        });
        const page = await browser.newPage();
        
        await page.goto('file:///C:/Users/Mridul/Desktop/Don/index.html', { waitUntil: 'networkidle0' });
        
        await new Promise(r => setTimeout(r, 4000));
        
        await page.evaluate(() => {
            const el = document.getElementById('about-section');
            if (el) el.scrollIntoView();
        });
        
        await new Promise(r => setTimeout(r, 2000));
        
        const canvasInfo = await page.evaluate(() => {
            const c = document.getElementById('about-fluid-bg');
            if (!c) return 'No canvas found';
            const rect = c.getBoundingClientRect();
            return {
                width: c.width,
                height: c.height,
                styleWidth: c.style.width,
                styleHeight: c.style.height,
                rectWidth: rect.width,
                rectHeight: rect.height,
                display: window.getComputedStyle(c).display,
                visibility: window.getComputedStyle(c).visibility
            };
        });
        console.log("CANVAS INFO:", canvasInfo);
        
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
