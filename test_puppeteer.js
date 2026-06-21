const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
        await page.goto('file:///C:/Users/Mridul/Desktop/Don/index.html');
        await new Promise(r => setTimeout(r, 3000)); // wait for animations and scripts
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
