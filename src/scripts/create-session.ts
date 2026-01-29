import { writeFile } from 'node:fs/promises';
import { manualSessionActivation } from '../core/get-session';
import { config } from '../config';

const main = async () => {
  const session = await manualSessionActivation();

  console.log('Saving session context for Playwright...');
  
  //
  await writeFile(config.fbSessionJsonPath, JSON.stringify(session, null, 2));

  console.log('Context saved in ' + config.fbSessionJsonPath + '!');
  process.exit(0);
};

main().catch((e) => {
  throw e;
});
