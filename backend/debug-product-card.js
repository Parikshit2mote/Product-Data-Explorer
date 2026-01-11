const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto('https://www.worldofbooks.com/en-gb/collections/modern-fiction-books', { waitUntil: 'networkidle', timeout: 60000 });

        // Get first product card's full info
        const firstCard = await page.$$eval('.product-card', (cards) => {
            if (cards.length === 0) return null;
            const card = cards[0];
            return {
                tagName: card.tagName,
                className: card.className,
                href: card.getAttribute('href'),
                dataItemName: card.getAttribute('data-item_name'),
                dataPrice: card.getAttribute('data-price'),
                dataEan: card.getAttribute('data-item_ean'),
                innerText: card.innerText,
                outerHTML: card.outerHTML.substring(0, 300)
            };
        });

        console.log('First card details:');
        console.log(JSON.stringify(firstCard, null, 2));

        // Also check for images nearby
        const cardContainer = await page.$$eval('li.grid__item', (items) => {
            if (items.length === 0) return null;
            const item = items[0];
            const img = item.querySelector('img');
            const link = item.querySelector('a.product-card');
            return {
                hasImage: !!img,
                imageSrc: img?.getAttribute('src') || img?.getAttribute('data-src'),
                linkHref: link?.getAttribute('href'),
                linkText: link?.innerText
            };
        });

        console.log('\nCard container (li.grid__item):');
        console.log(JSON.stringify(cardContainer, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
