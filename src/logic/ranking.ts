import { GroupData } from '../types/GroupData';
import { SearchQuery } from '../types/SearchQuery';
import { scrapFirstGroups } from '../scraping/first-groups';

/**
 *
 */
export const retrieveRankedGroups = async (queries: SearchQuery[]) => {
  const groups = [];

  for (const { query, max } of queries) {
    groups.push(await scrapFirstGroups(query, max));
  }
  return mergeAndSortGroups(groups);
};

/**
 * Merges multiple arrays of groups, removing duplicates by URL
 * and sorts them by activity (postsPerDay descending, then memberCount descending, then name ascending)
 */
export const mergeAndSortGroups = (groupsArrays: GroupData[][]) => {
  const allGroups = groupsArrays.flat();

  const uniqueGroups = allGroups.filter(
    (group, index, self) =>
      index === self.findIndex((g) => g.url === group.url),
  );

  return uniqueGroups.sort((a, b) => {
    if (b.postsPerDay !== a.postsPerDay) {
      return b.postsPerDay - a.postsPerDay;
    }
    if (b.memberCount !== a.memberCount) {
      return b.memberCount - a.memberCount;
    }

    return a.name.localeCompare(b.name);
  });
};
