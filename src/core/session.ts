import { createPage, createPageContextLess } from './browser';

export const manualSessionActivation = async () => {
  console.log(`Launching chrome instance...`);

  const page = await createPageContextLess(
    false, //// NO HEADLESS, need manual auth
  );

  console.log(`Manual authentication requested`);

  await page.goto('https://www.facebook.com/login');
  const url = page.url();

  console.log(`Manual activation current URL: ${url}`);

  if (checkUrl(url)) {
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
        if (checkUrl(page.url())) {
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

export const checkActiveSession = async () => {
  console.log(`Launching chrome instance...`);

  const page = await createPage();

  console.log(`Check session run...`);

  await page.goto('https://www.facebook.com/home.php');
  const url = page.url();

  console.log(`Check session current url: ${url}`);

  if (checkUrl(url)) {
    console.log('Already been autenthicated');
    return true;
  }

  return false;
};

/**
 *
 */
export const checkUrl = (url: string) => {
  return (
    !url.includes('login') &&
    !url.includes('two_factor') &&
    !url.includes('auth') &&
    !url.includes('checkpoint')
  );
};
