# @hastearcade/server

[![npm version](https://badge.fury.io/js/%40hastearcade%2Fserver.svg)](https://badge.fury.io/js/%40hastearcade%2Fserver)

## Overview

The `@hastearcade/server` sdk empowers developers to leverage the Haste Arcade ecosystem to build Instant Leaderboard Payout (ILP) based games. The SDK is intended to be used only on the server side, but it is required to be used in conjunction with `@hastearcade/web`. See details [here](https://github.com/playhaste/haste-sdk/blob/main/packages/web/README.md).

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md) for an overview of the haste-sdk repository.

## Table of Contents

- [Quickstart](#quickstart)
- [Background and Use Case](#background)
- [Setup](#setup)
- [Testing](#testing)
- [Documentation](#documentation)
- [License](#license)
- [Contributing](#contributing)
- [Authors](#authors)

## Quickstart

The `@hastearcade/server` package is the primary entry point to the Haste ecosystem. The sdk is a wrapper for the Haste API and allows developers to ILP enable a game. The Haste ecosystem provides tools to handle the following components of ILP:

1. Authentication
2. Leaderboard management
3. Payouts to the leaderboard and game developers
4. Play & Score submission

#### Initialize Haste

To initialize the Haste sdk for use in your server, you need to perform the following:

```typescript
const environment = 'nonproduction';
const haste = await Haste.build(
  process.env.HASTE_SERVER_CLIENT_ID,
  process.env.HASTE_SERVER_CLIENT_SECRET,
  environment,
);
/// Now do things with the haste object like submit a play or a score.
```

The client id and secret are defined in the developer portal on your game page. See image below for reference:

![](https://github.com/playhaste/haste-sdk/blob/main/docs/assets/gameserverkeys.png)

**NOTE: It is recommneded to create an abstraction (service, lib, etc) around the haste-sdk in your codebase. This will allow you to initialize one haste object.**

For the third parameter to build you can use `nonproduction` or `production`. Please use `nonproduction` when testing as it will not send payouts. When you are ready to test payouts and/or you are in your true production environment please change the third parameter to `production`. The best practice is to use an environment variable to manage this process.

#### Authentication

Integrating the Haste authentication system into your server is one of the first steps needed. This step is important because it allows players in the arcade to receive payment for their skill. If the user is not logged in, then they can not submit and score, and ultimately can not be paid for placing on a leaderboard. The game client (using `@hastearcade/web`) will send the token to the server with each request. The server can use the following code to validate the token:

```typescript
import { Haste } from '@hastearcade/server';
/// this is custom code specific to your server to retrieve the token from the web request
const token = receiveTokenFromRequest();

try {
  const playerId = await Haste.validatePlayerAccess(token);
  console.log(`The player authenticated has an id of ${playerId}`);
} catch (err) {
  console.error(`An error occurred while validating the player's token.`);
}
```

Note: the above code does not use the haste object created from `build`. `build` and `validatePlayerAccess` are both static async functions. All other functions (get leaderboards, submit score, etc should utilize the haste object created from `build`).

As an example of retreieving an auth token in a socket.io based environment, here is the code from the `haste-game-server`:

```typescript
private jwtMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      Haste.validatePlayerAccess(socket.handshake.auth.token, process.env.AUTH_URL)
        .then((playerId) => {
          this.playerId = playerId;
          next();
        })
        .catch((err: Error) => {
          next(err);
        });
    } else {
      next(new Error('Authentication error'));
    }
  };
```

#### Player Details

If you require additional details about a player like their handcash profile id or user name you can use the `getPlayerDetails` function.

```typescript
import { Haste } from '@hastearcade/server';
/// this is custom code specific to your server to retrieve the token from the web request
const token = receiveTokenFromRequest();

try {
  const { playerId, userName, handcashProfileId } = await Haste.getPlayerDetails(token);
  console.log(`The player authenticated has an id of ${playerId}`);
} catch (err) {
  console.error(`An error occurred while validating the player's token.`);
}
```

#### Leaderboard management

The Haste ecosystem currently has multiple leaderboards that can be played for every game. Each tier requires additional funds to play the game (i.e. paying a penny vs paying a "quarter"). Every game in the arcade must support this concept in game. Thus, most games will display a dropdown UI to allow the player to select what leaderboard they wish to participate in. In order to retrieve the list of leaderboards to show in your dropdown you can use the following:

```typescript
const haste = await Haste.build(process.env.HASTE_SERVER_CLIENT_ID, process.env.HASTE_SERVER_CLIENT_SECRET);
const leaderBoards = haste.game.leaderboards();
console.log(leaderBoards);

/*
output:

[{
  id: "guid",
  name: "Beginner",
  cost: 4, // cost to play in this leaderboard in Duro.
}]
```

#### Get Leaders

In order to get a list of the current leaders for your game you can use the following function:

```typescript
const haste = await Haste.build(process.env.HASTE_SERVER_CLIENT_ID, process.env.HASTE_SERVER_CLIENT_SECRET);
const leaders = await haste.game.leaders(new Leaderboard(leaderboardId));
console.log(leaders);

/*
output:

[
  {
    playerId: 'player guid',
    name: 'player username',
    score: 150,
    avatar: 'https://www.gravatar.com/avatar/fb69ae3186660885da0fffa0f9f578e5.jpg'
  }
]
```

#### Submit Play & Score

When playing a game in an arcade, in order to play you must first insert your quarter. The `@hastearcade/server` sdk requires a similar flow. Once a player has selected their leaderboard, the developer will need to submit a "play" to the Haste api via the sdk. The following code shows a demonstration of this concept:

```typescript
const haste = await Haste.build(process.env.HASTE_SERVER_CLIENT_ID, process.env.HASTE_SERVER_CLIENT_SECRET);
const play = await haste.game.play(new Player(playerId), new Leaderboard(leaderboardId));
console.log(play);

/*
output:

{
  id: "guid",
  gameId: "your game guid",
  playerId: "player guid",
  leaderboard: {
    id: "guid",
    name: "Beginner",
    cost: 2000, // cost to play in this leaderboard in Duro.
  }
}
```

Once the play submission is you completed you should allow the user the play your game.

**Always maintain the business logic and scoring logic server side for security reasons in your game. Do not keep score or make any important game state decisions on the client.**

Upon hitting an end state for your game (i.e. the player gets hit by a bomb and dies) it is time to submit your score. To submit a score, you'll need the original play object. The play object can be maintained however you choose (memory, database, cache, etc). The score sdk method takes the current Play object, the Leaderboard the score is being submitted against, and the score.

```typescript
await haste.game.score(currentPlay, score);
```

##### Get Play

There are times when you may prefer not to serialize the entire Play object and store in a database or in memory. If you want to store the id only, then you will need to retrieve the play object before calling `score`. To retrieve the full Play object from the Haste API you may use the following:

```typescript
const play = await haste.play.find(playId);
console.log(play);

/*
output:

{
  id: "guid",
  gameId: "your game guid",
  playerId: "player guid",
  leaderboard: {
    id: "guid",
    name: "Beginner",
    cost: 2000, // cost to play in this leaderboard in Duro.
  }
}
```

##### Payment Transaction

When submitting a play the Haste ecosystem is performing a payout on behalf of the player. The underlying system uses the wallet to perform the payout, and every payout has a transaction hash associated with it. If you need access to the transaction you can use the following function call:

```typescript
const haste = await Haste.build(process.env.HASTE_SERVER_CLIENT_ID, process.env.HASTE_SERVER_CLIENT_SECRET);
const play = await haste.game.play(new Player(playerId), new Leaderboard(leaderboardId));
const transaction = await haste.play.transaction(play);
console.log(transaction);

/*
output:

{
  id: "guid",
  status: "COMPLETE",
  tx: "transactionhash",
}
```

**NOTE: Payments are performed via asyncronous methods and thus you may not receive the transaction hash if you call `getPlayTransaction` immediately after a play. The best practice is to poll `getPlayTransaction` until you receive a `tx`.**

##### Errors

The play endpoint has the potential to return errors from the Haste system. The potential errors are:

1. The player must validate their email before playing the game.
2. The player must connect a wallet before playing.
3. The player does not have sufficient funds to play the game
4. An error occurred while retrieving the wallets spendable balance.

Please ensure that you server handles these exceptions appropriately and displays a message to the user.

#### Payouts

All payouts are handled internal to the Haste ecosystem and do not require any additional code for the game developer.

## Background

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Background) for a detailed background.

## Setup

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Setup) for a detailed setup guide.

### Testing

`@hastearcade/server` utilizes Jest for running tests. To run all tests in the server package use the following command

`npm run test`

## Documentation

This `README` and each package's `README` provides high-level documentation. Additionally the code has been reviewed and comments provided to aid future developers in understanding why certain decisions were made.

More comprehensive documentation can be found [here](https://haste-arcade.stoplight.io/).

## License

The haste-sdk repository along with the corresponding npm packages are currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

If you are a developer looking to contribute to the Haste ecosystem please review our
[Contributing Readme](https://github.com/playhaste/haste-sdk/blob/main/ContributingReadme.md) and our [Contributing Guidelines](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md)

## Authors

- Keith LaForce ([rallieon](https://github.com/rallieon/))
- Eric LaForce ([foundrium](https://github.com/foundrium/))
- Dan Wagner ([danwag06](https://github.com/danwag06))
