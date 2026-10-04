// audit-runner.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://127.0.0.1:5173/';
const OUT_DIR = path.join(__dirname, 'audit-results');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Portfolio Audit (with Experience & Upgraded Certifications)...');
  
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  const consoleMessages = [];
  const pageErrors = [];

  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.error('❌ Browser Console Error:', msg.text());
    }
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
    console.error('❌ Page JS Exception:', err.toString());
  });

  // 1. Desktop Test (1280x800)
  console.log('\n--- 1. DESKTOP VIEWPORT TEST (1280x800) ---');
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  // Check horizontal overflow
  const desktopOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log('Desktop Overflow Check:', desktopOverflow);

  // Scroll smoothly down the page to trigger all lazy image loads
  console.log('\n--- Testing Full Page Scroll & Image Loading ---');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 350;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 80);
    });
  });
  await new Promise(r => setTimeout(r, 600));

  const allImagesStatus = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      alt: img.alt,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      loaded: img.complete && img.naturalWidth > 0
    }));
  });
  console.log(`Images loaded after scroll: ${allImagesStatus.filter(i => i.loaded).length}/${allImagesStatus.length} loaded successfully`);
  allImagesStatus.forEach(img => {
    if (!img.loaded) console.error('❌ Image failed to load:', img.src);
    else console.log(`✓ Image loaded (${img.naturalWidth}x${img.naturalHeight}): ${img.src.split('/').pop()}`);
  });

  // Test Experience Section
  console.log('\n--- Testing Experience Section ---');
  await page.evaluate(() => {
    const exp = document.getElementById('experience');
    if (exp) exp.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));
  const expCheck = await page.evaluate(() => {
    const section = document.getElementById('experience');
    const card = section ? section.querySelector('.experience-card') : null;
    const role = card ? card.querySelector('.exp-role').textContent.trim() : '';
    const company = card ? card.querySelector('.exp-company').textContent.trim() : '';
    const typeBadge = card ? card.querySelector('.exp-type-badge').textContent.trim() : '';
    return { hasSection: !!section, hasCard: !!card, role, company, typeBadge };
  });
  console.log('Experience Section Check:', expCheck);
  await page.screenshot({ path: path.join(OUT_DIR, '08_desktop_experience.png') });

  // Test Certifications Section
  console.log('\n--- Testing Certifications Section & Modals ---');
  await page.evaluate(() => {
    const cert = document.getElementById('certifications');
    if (cert) cert.scrollIntoView({ behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT_DIR, '09_desktop_certifications.png') });

  // Test Modal 5: WsCube Tech Certificate
  console.log('Testing WsCube Tech Certificate Modal...');
  await page.click('#btn-view-cert-wscube');
  await new Promise(r => setTimeout(r, 300));
  const wscubeModalState = await page.evaluate(() => {
    const m = document.getElementById('modal-cert-wscube');
    return m && m.classList.contains('active');
  });
  console.log('WsCube Modal Open:', wscubeModalState);
  await page.screenshot({ path: path.join(OUT_DIR, '10_modal_cert_wscube.png') });

  // Close modal
  await page.click('#modal-cert-wscube .modal-close');
  await new Promise(r => setTimeout(r, 300));
  const wscubeModalClosed = await page.evaluate(() => {
    const m = document.getElementById('modal-cert-wscube');
    return m && !m.classList.contains('active');
  });
  console.log('WsCube Modal Closed:', wscubeModalClosed);

  // Test Modal 6: PW Skills Certificate
  console.log('Testing PW Skills Certificate Modal...');
  await page.click('#btn-view-cert-pwskills');
  await new Promise(r => setTimeout(r, 300));
  const pwskillsModalState = await page.evaluate(() => {
    const m = document.getElementById('modal-cert-pwskills');
    return m && m.classList.contains('active');
  });
  console.log('PW Skills Modal Open:', pwskillsModalState);
  await page.screenshot({ path: path.join(OUT_DIR, '11_modal_cert_pwskills.png') });

  // Close modal
  await page.click('#modal-cert-pwskills .modal-close');
  await new Promise(r => setTimeout(r, 300));

  // Test Copy to Clipboard & Toast
  console.log('\n--- Testing Copy-to-Clipboard ---');
  await page.click('.copy-btn[data-copy="tiwarishagun2004@gmail.com"]');
  await new Promise(r => setTimeout(r, 300));
  const toastStatus = await page.evaluate(() => {
    const t = document.getElementById('toast');
    return {
      isVisible: t && t.classList.contains('show'),
      text: t ? t.textContent.trim() : ''
    };
  });
  console.log('Toast Status:', toastStatus);

  // Test Contact Form Validation
  console.log('\n--- Testing Contact Form Validation ---');
  const validationState = await page.evaluate(() => {
    const form = document.getElementById('contact-form');
    form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    const nameErr = document.getElementById('name-error').classList.contains('visible');
    const emailErr = document.getElementById('email-error').classList.contains('visible');
    const msgErr = document.getElementById('message-error').classList.contains('visible');
    return { nameErr, emailErr, msgErr };
  });
  console.log('Form Validation Errors (flagged empty fields):', validationState);

  // 2. Tablet Test (768x1024)
  console.log('\n--- 2. TABLET VIEWPORT TEST (768x1024) ---');
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
  const tabletOverflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  console.log('Tablet Overflow Check:', tabletOverflow);
  await page.screenshot({ path: path.join(OUT_DIR, '05_tablet_view.png') });

  // 3. Mobile Test (375x667)
  console.log('\n--- 3. MOBILE VIEWPORT TEST (375x667) ---');
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 1 });
  await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

  const mobileOverflow = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: docWidth,
      hasOverflow: document.documentElement.scrollWidth > docWidth
    };
  });
  console.log('Mobile Overflow Check:', mobileOverflow);

  // Test Mobile Hamburger Drawer containing Experience & Certifications
  console.log('\n--- Testing Mobile Hamburger Drawer ---');
  await page.click('#nav-toggle');
  await new Promise(r => setTimeout(r, 400));
  const drawerLinks = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.drawer-link'));
    return links.map(l => ({ text: l.textContent.trim(), href: l.getAttribute('href') }));
  });
  console.log('Drawer Navigation Links:', drawerLinks);
  await page.screenshot({ path: path.join(OUT_DIR, '07_mobile_drawer_open.png') });

  await page.click('#drawer-close');
  await new Promise(r => setTimeout(r, 300));

  await browser.close();

  console.log('\n=== AUDIT SUMMARY ===');
  console.log(`Console Errors: ${consoleMessages.filter(m => m.type === 'error').length}`);
  console.log(`Page JS Errors: ${pageErrors.length}`);
  console.log(`Desktop Overflow: ${desktopOverflow.hasOverflow}`);
  console.log(`Tablet Overflow: ${tabletOverflow.hasOverflow}`);
  console.log(`Mobile Overflow: ${mobileOverflow.hasOverflow}`);
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
