import { chromium, Browser } from 'playwright';
import { config } from '../config';

let browserInstance: Browser | null = null;
export const getBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      executablePath: config.executablePath,
      headless: config.headless,
    });
  }

  return browserInstance;
};

export const createPage = async () => {
  const browser = await getBrowser();
  const context = await browser.newContext({
    storageState: config.getFbSession(),
  });

  const page = await context.newPage();
  page.on('close', () => context.close());

  return page;
};

export const closeBrowser = async () => {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
};
