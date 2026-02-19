import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { retrieveRankedGroups } from '../logic/ranking';
import { SearchQuery } from '../types/SearchQuery';

const main = async () => {
  // get from env vars
  const filePrefix = process.env.PREFIX_OUTPUT_FILE || 'ranking';
  let searchQueries: SearchQuery[];

  if (process.env.SEARCH_QUERIES_JSON) {
    try {
      searchQueries = JSON.parse(
        process.env.SEARCH_QUERIES_JSON,
      ) as SearchQuery[];
      console.log('Env: Loaded search queries from environment variable');
    } catch (error) {
      console.error(
        'Env: Error parsing SEARCH_QUERIES_JSON from environment variable:',
        error,
      );
      console.log('Env: Falling back to imported JSON file...');

      // fallback to json
      searchQueries = (await import('../constants/search-queries.json'))
        .default;
    }
  } else {
    console.log(
      'Env: No SEARCH_QUERIES_JSON environment variable found, using search-queries.json file',
    );

    // use the example json
    searchQueries = (await import('../constants/search-queries.json')).default;
  }
  
  console.log(`Using ${searchQueries.length} search queries`);

  const ranking = await retrieveRankedGroups(searchQueries);

  console.log('Saving ranking...');

  const outputDir = path.join(process.cwd(), 'output');
  try {
    await import('node:fs/promises').then((fs) =>
      fs.mkdir(outputDir, { recursive: true }),
    );
  } catch {}

  const filename = `${filePrefix}_${Date.now()}.json`;
  const filepath = path.join(outputDir, filename);

  await writeFile(filepath, JSON.stringify(ranking, null, 2));

  console.log(`File saved as: ${filename}`);
  console.log(`Total groups ranked: ${ranking.length}`);

  process.exit(0);
};

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
