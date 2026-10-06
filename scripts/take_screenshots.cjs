const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOTS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 }
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  console.log('1. Capturing 01-landing-hero-showcase.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01-landing-hero-showcase.png') });

  // Switch to Patient Dashboard (Clicking Logo or Role)
  console.log('Switching to Patient Dashboard...');
  await page.evaluate(() => {
    // Click on the sidebar logo or role button to turn off landing
    const sidebarLogo = document.querySelector('aside .cursor-pointer');
    if (sidebarLogo) {
      sidebarLogo.click();
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  console.log('2. Capturing 02-patient-home-dashboard.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02-patient-home-dashboard.png') });

  // Open Profile Manager Modal (Click "Manage All" or switch)
  console.log('Opening Profile Manager Modal...');
  await page.evaluate(() => {
    // Look for patient pill in header
    const btns = Array.from(document.querySelectorAll('button'));
    const patientHeaderBtn = btns.find(b => b.textContent && (b.textContent.includes('Ananya Jain') || b.textContent.includes('Bipin Gogoi')));
    if (patientHeaderBtn) {
      patientHeaderBtn.click();
      setTimeout(() => {
        const manageAllBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('Manage All'));
        if (manageAllBtn) manageAllBtn.click();
      }, 200);
    } else {
      const switchBtn = btns.find(b => b.textContent && b.textContent.trim() === 'Switch');
      if (switchBtn) switchBtn.click();
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('3. Capturing 03-patient-profile-manager.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03-patient-profile-manager.png') });

  // Close Modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // Navigate to Routine Tab
  console.log('Navigating to Routine tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const tab = btns.find(b => b.textContent && b.textContent.includes('Medicines & Routine'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('4. Capturing 04-daily-routine-medications.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04-daily-routine-medications.png') });

  // Navigate to Games Tab
  console.log('Navigating to Memory Games tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const tab = btns.find(b => b.textContent && (b.textContent.includes('6 Memory Games') || b.textContent.includes('Memory Games')));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('5. Capturing 05-cognitive-care-games.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05-cognitive-care-games.png') });

  // Navigate to Safety & Lab Tab
  console.log('Navigating to Safety tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const tab = btns.find(b => b.textContent && (b.textContent.includes('Medicine & Lab Safety') || b.textContent.includes('Medicine & Lab')));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('6. Capturing 06-ai-medicine-scanner.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06-ai-medicine-scanner.png') });

  // Navigate to Smriti Sathi AI Chat Tab
  console.log('Navigating to AI Chat tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div'));
    const tab = btns.find(b => b.textContent && b.textContent.includes('Smriti Sathi (AI)'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('7. Capturing 07-smriti-sathi-ai-companion.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07-smriti-sathi-ai-companion.png') });

  // Switch to ASHA Health Worker Portal
  console.log('Switching to ASHA Portal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ashaBtn = btns.find(b => b.textContent && b.textContent.includes('ASHA Health Worker'));
    if (ashaBtn) ashaBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('8. Capturing 08-asha-health-worker-portal.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08-asha-health-worker-portal.png') });

  // Open A11y & Display Settings Modal
  console.log('Opening A11y Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const a11yBtn = btns.find(b => b.textContent && b.textContent.includes('A11y'));
    if (a11yBtn) a11yBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('9. Capturing 09-accessibility-a11y-modal.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '09-accessibility-a11y-modal.png') });

  // Close A11y Modal
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 600));

  // Switch to Caregiver Portal
  console.log('Switching to Caregiver Portal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const caregiverBtn = btns.find(b => b.textContent && b.textContent.includes('Family Caregiver'));
    if (caregiverBtn) caregiverBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('10. Capturing 10-caregiver-portal.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '10-caregiver-portal.png') });

  // Switch to Clinician Portal
  console.log('Switching to Clinician Portal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const doctorBtn = btns.find(b => b.textContent && b.textContent.includes('Clinician / Doctor'));
    if (doctorBtn) doctorBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('11. Capturing 11-clinician-portal.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '11-clinician-portal.png') });

  // Open Emergency SOS Modal
  console.log('Opening SOS Modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sosBtn = btns.find(b => b.textContent && b.textContent.includes('SOS'));
    if (sosBtn) sosBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('12. Capturing 12-emergency-sos-modal.png...');
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '12-emergency-sos-modal.png') });

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
