import { checkActiveSession } from '../core/session';

const main = async () => {
  const check = await checkActiveSession();

  if (!check) {
    console.error('The current session is not valid or has expired.');
    process.exit(1);
  }
  console.log('The current session is valid and usable');
  process.exit(0);
};

main().catch((e) => {
  throw e;
});
