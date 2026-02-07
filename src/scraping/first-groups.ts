import { Locator } from 'playwright';
import { createPage } from '../core/browser';
import { parseMemberCount, parsePostsPerDay } from './pipes/parse';
import { GroupData } from '../types/GroupData';

/**
 * 
 */
export const scrapFirstGroups = async (search: string, max = 10) => {
  const page = await createPage();

  console.debug('Navigating to Facebook groups search');
  await page.goto(
    'https://www.facebook.com/search/groups/?q=' + encodeURIComponent(search),
  );

  const listLocator = page.locator('div[role=main] div[role=feed]');
  const groups: GroupData[] = [];

  while (groups.length < max) {
    await page.waitForSelector(
      'div[role=main] div[role=feed] div[role=article]',
      { state: 'attached', timeout: 5000 },
    );

    const groupLocators = await listLocator.locator('div[role=article]').all();

    console.debug(`Found ${groupLocators.length} groups in current view`);

    const newGroupLocators = groupLocators.slice(groups.length);
    const newGroups = await Promise.all(newGroupLocators.map(extractGroupData));

    groups.push(...newGroups);

    if (groups.length >= max) {
      break;
    }

    console.debug(`Only ${groups.length} groups found, scrolling for more...`);

    // scroll for more groups...
    await page.evaluate(() => {
      const feed = document.querySelector('html')!;
      feed.scrollTop = feed.scrollHeight;
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(2000);

    const previousCount = groups.length;
    await page.waitForTimeout(1000);
    const updatedLocators = await listLocator
      .locator('div[role=article]')
      .all();

    if (updatedLocators.length <= previousCount) {
      console.debug('No more groups loading, stopping scroll');
      break;
    }
  }

  console.debug(`Extracted ${groups.length} groups (max requested: ${max})`);
  await page.close();
  return groups.slice(0, max);
};

/**
 * 
 */
export const extractGroupData = async (card: Locator): Promise<GroupData> => {
  const nameLinkLocator = card.locator('a[role=presentation]');
  const url = (await nameLinkLocator.getAttribute('href')) || '';
  const name = (await nameLinkLocator.textContent()) || '';
  const infoText =
    (await card
      .locator('span.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6')
      .first()
      .textContent()) || '';

  console.debug(`Processing group: ${name.substring(0, 30)}...`);

  let isPublic = false;
  let memberCount = '';
  let postsPerDay = '';

  if (infoText) {
    const parts = infoText.split('·').map((part) => part.trim());

    isPublic = parts[0]?.toLowerCase().includes('público') || false;
    memberCount = parts[1] || '';
    postsPerDay = parts[2] || '';
  }

  return {
    name: name.trim(),
    url: url.trim(),
    isPublic,
    memberCount: parseMemberCount(memberCount.trim()),
    postsPerDay: parsePostsPerDay(postsPerDay.trim()),
  };
};
