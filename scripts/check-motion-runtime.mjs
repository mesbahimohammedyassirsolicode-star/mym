import { chromium } from './node_modules/playwright/index.js';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('http://localhost:4174/', { waitUntil: 'networkidle', timeout: 60000 });

const result = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.mobile-nav__list > li')].map((li, index) => ({
    index,
    opacity: getComputedStyle(li).opacity,
  }));
  const hv = document.querySelector('.hv');
  const cs = hv ? getComputedStyle(hv) : null;
  return {
    items,
    hvTransform: cs?.transform,
    hvInlineTransform: hv?.style.transform,
    hasMotionChunk: [...document.querySelectorAll('script[src],link[href]')].some((el) =>
      (el.getAttribute('src') || el.getAttribute('href') || '').includes('motionFeatures'),
    ),
  };
});

console.log(JSON.stringify(result, null, 2));
await browser.close();
