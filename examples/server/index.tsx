import 'dotenv/config';
import { Haste, HasteConfiguration } from '@hastearcade/server';
import { Player } from '@hastearcade/models';

async function initialize() {
  // see Testing for more details
  const environment = 'nonproduction';
  const haste = await Haste.build(
    // Retrieve from Developer Portal
    process.env.HASTE_SERVER_CLIENT_ID,
    // Retrieve from Developer Portal
    process.env.HASTE_SERVER_CLIENT_SECRET,
    environment,
    new HasteConfiguration(environment, 'api.foundrium.hastearcade.com', 'https', 443),
  );

  const leaderBoards = haste.game.leaderboards();
  // eslint-disable-next-line no-console
  console.log(leaderBoards);

  const player = new Player(process.env.PLAYER_ID);
  const payouts = await haste.game.payouts(player);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payouts, null, 2));
}

async function run() {
  await initialize();
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
