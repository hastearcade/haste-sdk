import 'dotenv/config';
import { Haste } from '@hastearcade/server';

async function initialize() {
  // see Testing for more details
  const environment = 'nonproduction';
  const haste = await Haste.build(
    // Retrieve from Developer Portal
    process.env.HASTE_SERVER_CLIENT_ID,
    // Retrieve from Developer Portal
    process.env.HASTE_SERVER_CLIENT_SECRET,
    environment,
  );

  const leaderBoards = haste.game.leaderboards();
  // eslint-disable-next-line no-console
  console.log(leaderBoards);
}

async function run() {
  await initialize();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
