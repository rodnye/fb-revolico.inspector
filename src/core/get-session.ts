import { chromium } from 'playwright';
import { config } from '../config';

export const manualSessionActivation = async () => {
  console.log(`Launching chrome instance...`);

  const browser = await chromium.launch({
    executablePath: config.executablePath,
    headless: false, // NO HEADLESS, need manual auth
  });
  const page = await browser.newPage();

  console.log(`Manual authentication requested`);

  await page.goto('https://www.facebook.com/login');
  const url = page.url();

  console.log(`Manual activation current URL: ${url}`);

  if (
    !url.includes('login') &&
    !url.includes('two_factor') &&
    !url.includes('auth') &&
    !url.includes('checkpoint')
  ) {
    console.log('Already been autenthicated');
    return page.context().storageState();
  }
  await page.bringToFront();

  try {
    console.log('Waiting for manual activation (5 minute timeout)');
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => {
          clear();
          reject();
        },
        1000 * 60 * 5,
      );

      const interval = setInterval(() => {
        const url = page.url();
        if (
          !url.includes('login') &&
          !url.includes('two_factor') &&
          !url.includes('auth') &&
          !url.includes('checkpoint')
        ) {
          clear();
          resolve();
        }
      }, 1000);

      const clear = () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    });
    console.log('Manual activation completed');

    page.evaluate(() =>
      window.alert('fb-revolico.inspector:: Successful authentication!!'),
    );
    return page.context().storageState();
  } catch (error) {
    throw new Error('Manual activation timeout. Please try again.');
  }
};
