const fs = require('fs');
const puppeteer = require('puppeteer');
(async () => {
    try {
        const browser = await puppeteer.launch({
            args: ['--use-gl=swiftshader', '--enable-webgl', '--no-sandbox']
        });
        const page = await browser.newPage();
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));
        
        const scriptContent = fs.readFileSync('C:/Users/Mridul/Desktop/Don/custom-scripts.js', 'utf8');
        
        await page.setContent(`
            <canvas id='about-fluid-bg' style='width: 800px; height: 600px; background: red;'></canvas>
            <div id='about-section'></div>
            <script>${scriptContent}</script>
        `);
        await new Promise(r => setTimeout(r, 2000));
        await browser.close();
    } catch(e) {
        console.error(e);
    }
})();
