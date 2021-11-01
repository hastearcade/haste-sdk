# haste-sdk

## Overview

This readme is intended for developers looking to utilize the Haste ecosystem to build a game on the Haste Arcade. If you are a developer looking to contribute to the Haste ecosystem please see [Contributing](#contributing).

The haste-sdk repository is a monorepo that contains the tooling required to create games quickly and easily for the [Haste Arcade](https://hastearcade.com/). Additionally it includes a sample game to provide a comprehensive example of how the Haste SDK can be used to apply the concept of Instant Leaderboard Payout (ILP).

Initially, TypeScript and JavaScript will be the only supported SDKs, but long term Haste will build SDKs for other technology stacks and will help support community driven SDKs. Haste plans to keep client SDKs open source to ensure a good developer experience and will make available documented APIs for developers that do not wish to utilize Typescript or Javascript.

## Table of Contents

- [Quickstart](#quickstart)
  - [Server](#server)
  - [Web](#web)
  - [Developer Checklist for Release](#release)
- [Background and Use Case](#background)
- [Packages](#packages)
- [Documentation](#documentation)
- [License](#license)
- [Contributing](#contributing)
- [Contriubtor Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Contributor Usage](#usage)
  - [Monorepo](#monorepo)
  - [Branching & Versioning](#branching-&-versioning)
  - [Developer Tooling](#developer-tooling)
- [Deploy](#deploy)
- [Authors](#authors)

## Quickstart

This quick start guide will demonstrate the use of the haste-sdk in a server side node environment and a browser based environment. To build a game for the haste arcade you will need both if you are building a web based game. If you are building a desktop or mobile game please contact us on [Discord](https://discord.gg/mqPN8gDF3A).

To start you need to register your game with Haste through the developer [portal](https://developer.hastearcade.com). Once you login, you can create a game to generate a set of access keys to be used by the SDK.

Additionally, you will need to adhere to the Haste [Security](./security.md) and [Branding](./branding.md) requirements before a game can be published. Once you request your game to be published, the Haste technical team will reach out to your team to ensure these requirements are met.

### Server

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
const transaction = await haste.play.transaction(play);  // takes id of play (string) as parameter
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

### Web

While the primary work of integrating with Haste is performed in the server (where all game logic and score state should be maintained), Haste does provide a web based sdk to assist in the authentication process. In order for a player to play your game, they will need to authenticate with the Haste Arcade.

The web SDK works by utilizing a SSO system with Haste Arcade. The SDK is a wrapper to help facilitate this process.

Similar to the server side SDK, `@hastearcade/web` starts by initializing a Haste object. In this case, the name of the object is `HasteClient` and the object should be maintained via an abstraction so it only need to be initialized one time.

```typescript
const hasteClient = await HasteClient.build(process.env.HASTE_GAME_CLIENT_ID);
```

The client id used here can be found in the developer portal and will be for your game _not your server_. See image below for a reference point:

![](https://github.com/playhaste/haste-sdk/blob/main/docs/assets/gameclientkeys.png)

#### Login

Once you have built your `HasteClient` object you may begin using it in your game. For the page/component in your application that displays the game the developer will need to handle two scenarios for the player: authenticated and unauthenticated.

To determine if a player is authenticated the developer can utilize the following code:

```typescript
const details = await hasteClient.getTokenDetails();
```

The `getTokenDetails` function will return a `HasteAuthentication` object with the following definition:

```typescript
export type HasteAuthentication = {
  token: string;
  isAuthenticated: boolean;
};
```

If the player is unauthenticated, then please present the user with the 'Sign in with Haste' branded button.

The button should execute the following code to redirect the player to the arcade for sign in. Once the player signs in to Haste Arcade the player will be redirected back to the game.:

```typescript
hasteClient.login();
```

If the player is already authenticated, then you can present the player with the leaderboard selection. The leaderboard selection will allow the player to select the payment amount and level they are playing for the Arcade. To display the leaderboards the developer will need to utilize the server side SDK.

#### Logout

To allow a user to log out of your game you can utilize the following code:

```typescript
hasteClient.logout(); /// does not need to be awaited
```

Note: Logout does not need to be awaited, but it is best practice to redirect your user back to your game's sign in page or state. In addition, it is best practice to submit the user's current score upon logout.

### Release

In order to release a game to the arcade a developer will need to check the following boxes:

- [ ] Branding
  - [ ] A game logo, artwork, and at least one photo must be added through the developer portal.
  - [ ] Your game must include a 'Sign in with Haste' button. The asset can be found [here](https://github.com/playhaste/haste-sdk/tree/main/docs/assets).
  - [ ] You game must include a 'Made with Haste' button. The asset can be found [here](https://github.com/playhaste/haste-sdk/tree/main/docs/assets).
- [ ] Security
  - [ ] Your game should adhere to an authoritative server or similar pattern to reduce the opportunity for malicious actors. You can read more [here](https://www.gabrielgambetta.com/client-server-game-architecture.html).
  - [ ] Your game should utilize the `web` and `server` SDKs to manage JWTs used by the Haste ecosystem. Your server side code should have JWT validation for any protected endpoint.
  - [ ] You have made every effort to follow industry best practices like adhering to OWASP. If you need help or desire a second opinion please discuss with the Haste community through [Discord](https://discord.gg/mqPN8gDF3A).
- [ ] Error handling
  - [ ] Both server and client code should handle errors appropriately and follow industry best practices. See [here](#errors) for specific haste errors that will need to be handled.
- [ ] Payment
  - [ ] You must connect a handcash wallet in order to create a game. Please ensure that the wallet used is where you desire your payments to be sent.
- [ ] Testing
  - [ ] The Haste SDK allows you to specify a non-production environment for testing. All non production environments for your game should use non-production to prevent payments from being made. Please use an environment variable as a parameter to the `.build` function.

## Background

Welcome to the world’s first ILP Arcade. Haste Arcade is a platform filled with ILP Games built by developers all around the world. Unlike traditional online games, ILP Games found on the Haste Arcade platform adhere to an exciting new real-time "Instant Leaderboard Payout" structure that was invented and made popular by Haste’s founding team members.

Imagine going to your local arcade, inserting 25 cents into the gaming console, posting a high score on Pac-Man, and then getting paid 2.5 cents every time subsequent players play the game but fail to beat your score. Now consider holding the top score in a global online arcade where millions of daily players are playing the game but failing to beat your score, and earning 2.5 cents per play. This is a "game changer". This is Haste Arcade.

## Packages

The following lists the packages contained in the haste-sdk monorepo:

- `models` - shared domain models and services for the server and web SDK.
- `server` - The primary package for server side integration with Haste. `server` provides a simple wrapper around the Haste API and makes it easy to configure integration with Haste.
- `web` - The primary package for client side integration with Haste. The web SDK is used to integrate with the Haste authentication system.
- `haste-game-domain` - A base package that allows sharing types between the sample game server and sample game client
- `haste-game-server` - An example [authoritative server](https://www.gabrielgambetta.com/client-server-game-architecture.html) leveraging [matter-js](https://brm.io/matter-js/) for game physics
- `haste-game-client` - An example game client integrated with the game server. Leverages [phaser3](https://phaser.io/phaser3) for rendering the game levels and game state.

## Documentation

This `README` and each package's `README` provides high-level documentation. Additionally the code has been reviewed and comments provided to aid future developers in understanding why certain decisions were made.

More comprehensive documentation can be found [here](https://haste-arcade.stoplight.io/).

## License

The haste-sdk repository along with the corresponding npm packages are currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

If you are a developer looking to contribute to the Haste ecosystem please review our
[Contributing Readme](https://github.com/playhaste/haste-sdk/blob/main/ContributingReadme.md) and our [Contributing Guidelines](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md)

## Setup

The follow sections detail how to contribute to this repository and the Haste ecosystem.

### Prerequisites

haste-sdk is built using the node.js and typescript ecosystem. In order to develop haste-sdk you will need to install [Node.js](https://nodejs.org/en/). haste-sdk was primarily developed on Ubuntu 20 via Windows WSL, but this is not a requirement to develop haste-sdk.

In addition, you will need [NVM](https://github.com/nvm-sh/nvm) installed. NVM is utilized to ensure a specific version of node is installed when contributing.

### Installation

Once you have Node.js and NVM installed you can run the following commands to test haste-sdk.

`git clone git@github.com:playhaste/haste-sdk.git`

`cd haste-sdk`

`nvm use`

`npm install commitizen -D -g`

`npm install`

`npm run huskyinstall`

`npm run build`

`npm run test`

It is strongly recommended to develop haste-sdk using an editing ecosystem that supports [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/). The haste-sdk team uses VSCode with the following extensions:

1. VSCode ESLint [link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. VSCode Prettier [link](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.prettier-vscode)

All pull requests will be reviewed for linting and styling to ensure a conssitent codebase. Please ensure that you run lint and prettier before submitting a pull request.

### Environment Variables

Within this monorepository, developers can see that `haste-game-client` and `haste-game-server` use [dotenv](https://github.com/motdotla/dotenv) and `.env` files. Their specifications are outlined in their corresponding `README`.

The `server`, `web`, `models`, and `haste-game-domain` pakcages do not require environment variables.

## Usage

The follow section describes the haste-sdk development experience.

### Monorepo

haste-sdk utilizes npm 7 and npm's workspaces to manage dependencies between the packages that comprise the haste arcade sdk. If you are not familiar with NPM 7 workspaces, please see their [website](https://docs.npmjs.com/cli/v7/using-npm/workspaces) for additional information.

haste-sdk is currently using a distinct semantic versioning strategy for each published package (server, web, and models).

Typically, you will not need to interact with workspaces directly as standard tooling commands will be run via `npm`.

### Branching & Versioning

The stable branch used by haste-sdk is the `main` branch. All stable npm package releases will be performed from the main branch. Any beta releases will be performed from the `next` branch and will use a `beta` npm distribution tag.

haste-sdk utilizes [semantic-release](https://github.com/semantic-release/semantic-release) to automatically manage versions of each npm package. Upon any merge to the main branch, a Github Action will run the release process to update npm repository.

### Developer Tooling

haste-sdk uses the following tools to ensure a consistent, standard development environment:

1. Typescript
2. NPM 7 Workspaces
3. Prettier
4. ESLint
5. Husky with lint-staged
6. Jest
7. Commitizen

_Through the use of npm package scripts and workspaces, all commands can be run from the root directory of haste-sdk._

#### Linting and Formatting

haste-sdk is configured to run all linting rules as part of a precommit hook defined via husky, but if you want to manually check your linting before you commit you can run

`npm run pretty && npm run lint`

#### Testing

haste-sdk utilizes Jest for running tests. To run all tests in the monorepo use the following command

`npm run test`

## Deploy

Github Actions is used to deploy the server, web, and models npm packages.

## Authors

- Keith LaForce ([rallieon](https://github.com/rallieon/))
- Eric LaForce ([foundrium](https://github.com/foundrium/))
- Dan Wagner ([danwag06](https://github.com/danwag06))
