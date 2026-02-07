import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { retrieveRankedGroups } from '../logic/ranking';
import searchQueries from '../constants/search-queries.json';

const main = async () => {
  const ranking = await retrieveRankedGroups(searchQueries);

  console.log('Saving ranking...');

  //
  await writeFile(
    path.join(process.cwd(), 'output', `ranking_${Date.now()}.json`),
    JSON.stringify(ranking, null, 2),
  );

  process.exit(0);
};

main().catch((e) => {
  throw e;
});
