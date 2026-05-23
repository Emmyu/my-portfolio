const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  console.log('Navigating to https://aspire-hr.com/...');
  await page.goto('https://aspire-hr.com/', { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for page to fully load
  console.log('Waiting for page to settle...');
  await new Promise(r => setTimeout(r, 4000));

  // Try to dismiss cookie consent banners
  console.log('Looking for cookie banners...');
  const cookieSelectors = [
    // Common cookie consent button selectors
    'button[id*="accept"]',
    'button[id*="cookie"]',
    'button[class*="accept"]',
    'button[class*="cookie-accept"]',
    'a[id*="accept"]',
    '#cookie-accept',
    '#accept-cookies',
    '#acceptAll',
    '.cookie-accept',
    '.accept-cookies',
    '[data-action="accept"]',
    '[aria-label*="accept"]',
    '[aria-label*="Accept"]',
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    '#onetrust-accept-btn-handler',
    '.cc-accept',
    '.cc-btn.cc-dismiss',
    '#gdpr-cookie-accept',
    '.js-cookie-consent-agree',
    'button[title="Accept"]',
    'button[title="Accept All"]',
  ];

  for (const selector of cookieSelectors) {
    try {
      const btn = await page.$(selector);
      if (btn) {
        const text = await page.evaluate(el => el.textContent.trim(), btn);
        console.log(`Found cookie button with selector "${selector}", text: "${text}"`);
        await btn.click();
        console.log('Clicked cookie button!');
        await new Promise(r => setTimeout(r, 2000));
        break;
      }
    } catch (e) {
      // Ignore and try next selector
    }
  }

  // Also try finding by text content
  try {
    const buttons = await page.$$('button, a.btn, a.button, [role="button"]');
    for (const button of buttons) {
      const text = await page.evaluate(el => el.textContent.trim().toLowerCase(), button);
      if (text.includes('accept all') || text === 'accept' || text === 'accept cookies' || text === 'i accept' || text === 'got it' || text === 'agree') {
        console.log(`Found cookie button by text: "${text}"`);
        await button.click();
        console.log('Clicked cookie button by text!');
        await new Promise(r => setTimeout(r, 2000));
        break;
      }
    }
  } catch (e) {
    console.log('No cookie buttons found by text search');
  }

  // Wait a moment after cookie dismissal
  await new Promise(r => setTimeout(r, 2000));

  // Take the screenshot
  const outputPath = 'c:\\Users\\HP\\Downloads\\my portfolio\\assets\\images\\web_aspirehr.png';
  console.log(`Taking screenshot and saving to: ${outputPath}`);
  await page.screenshot({ path: outputPath, type: 'png' });
  console.log('Screenshot saved successfully!');

  await browser.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
