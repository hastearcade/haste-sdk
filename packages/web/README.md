# @hastearcade/web

[![npm version](https://badge.fury.io/js/%40hastearcade%2Fweb.svg)](https://badge.fury.io/js/%40hastearcade%2Fweb)

## Overview

The `@hastearcade/web` SDK empowers developers to incoroporate the Haste authentication system into their web based game. The SDK is intended to be used only on the client side, but it is required to be used in conjunction with `@hastearcade/server`. See details [here](https://github.com/playhaste/haste-sdk/blob/main/packages/server/README.md).

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md) for an overview of the haste-sdk repository.

The Haste team prefers to install libraries via npm install like `npm install @hastearcade/web`.

However, if you prefer to utilize a single script tag you can include the following tag in your HTML:

`<script src="https://unpkg.com/@hastearcade/web/dist/umd/index.js" />`

_SPECIAL NOTE_

If you utilize the script tag above you must preface all your code with `haste.` For example instead of

```typescript
const hasteClient = await HasteClient.build(process.env.HASTE_GAME_CLIENT_ID);
```

you would need to use

```typescript
const hasteClient = await haste.HasteClient.build(process.env.HASTE_GAME_CLIENT_ID);
```

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
  picture: string; // Url
  displayName: string;
};
```

If the player is unauthenticated, then please present the user with the ['Sign in with Haste' branded button](https://www.hastearcade.com/brand).

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

## Background

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Background) for a detailed background.

## Setup

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Setup) for a detailed setup guide.

### Testing

`@hastearcade/web` utilizes Jest for running tests. To run all tests in the server package use the following command

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
