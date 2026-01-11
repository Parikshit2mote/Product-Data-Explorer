const { chromium } = require('playwright');
(async () => {
    console.log('Starting scrape...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://www.worldofbooks.com/en-gb/', { waitUntil: 'networkidle', timeout: 60000 });
        console.log('Page loaded');
        const links = await page.$$eval('a', (els) => els.map(el => ({ text: el.innerText, href: el.getAttribute('href') })));
        console.log('Found links:', links.filter(l => l.href && l.href.includes('/collections/')).length);
        console.log('Sample link:', links.find(l => l.href && l.href.includes('/collections/')));
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
