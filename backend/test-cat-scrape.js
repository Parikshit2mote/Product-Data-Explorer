const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        const url = 'https://www.worldofbooks.com/en-gb/collections/crime-and-mystery-books';
        console.log('Navigating to', url);
        await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
        const products = await page.$$eval('.product-card', (cards) => {
            return cards.map((card) => {
                const titleEl = card.querySelector('.title, .card__heading, h3');
                const title = titleEl?.textContent?.trim() || '';
                const link = card.querySelector('a');
                const sourceUrl = link?.getAttribute('href') || '';
                const sourceId = sourceUrl.split('/').filter(Boolean).pop() || '';
                return { title, sourceId, sourceUrl };
            });
        });
        console.log('Found products:', products.length);
        if (products.length > 0) {
            console.log('First product sample:');
            console.log(JSON.stringify(products[0], null, 2));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
