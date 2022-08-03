import 'dotenv/config';
import { Haste } from '@hastearcade/server';
import { Leaderboard, Play, Player } from '@hastearcade/models';

let haste: Haste;

// authenticate your game server against the Haste
// API. This will require the .env to be updated
// appropriately to run the example.
async function authenticate() {
  // see Testing for more details
  const environment = 'production';
  haste = await Haste.build(
    // Retrieve from Developer Portal
    process.env.HASTE_SERVER_CLIENT_ID,
    // Retrieve from Developer Portal
    process.env.HASTE_SERVER_CLIENT_SECRET,
    environment,
  );
}

// this function will retrieve the leaderboards
// to display to the player. This will allow
// the player to select which payment tier
// they would like to play at. Please use
// the 'formattedName' property when populating
// your game client UI to display to the user.
async function getLeaderboards(playerId?: string) {
  const leaderBoards = await haste.game.leaderboards(playerId);
  // eslint-disable-next-line no-console
  console.log(leaderBoards);
}

// this function will retrieve all payouts that
// have been paid to the player for this game
// The payouts will be across all leaderboards.
async function getPayouts(playerId: string) {
  const player = new Player(playerId);
  const payouts = await haste.game.payouts(player);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payouts, null, 2));
}

// perform a play against a specific leaderboard.
// The player should select a leaderboard from your
// game client and pass the id to the game server.
// The game server will then perform the 'insert quarter into arcade'
// process. This process will payout that quarter to all existing
// players on the leaderboard. The play endpoint will return a Play
// object which contains a play id. The play id and leaderboard id
// must be passed to the subsequent call to .score.
async function play(playerId: string, leaderboardId: string) {
  const play = await haste.game.play(new Player(playerId), new Leaderboard(leaderboardId));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(play));
}

// send the score to the Haste API once the game has completed.
async function score(play: Play, scoreValue: number) {
  const score = await haste.game.score(play, scoreValue);
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(score));
}

async function run() {
  await authenticate();
  await getLeaderboards(process.env.PLAYER_ID);
  await getPayouts(process.env.PLAYER_ID ?? '');
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
