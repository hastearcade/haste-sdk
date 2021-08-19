# @hastearcade/web

[![npm version](https://badge.fury.io/js/%40hastearcade%2Fweb.svg)](https://badge.fury.io/js/%40hastearcade%2Fweb)

## Overview

The `@hastearcade/web` SDK empowers developers to incoroporate the Haste authentication system into their web based game. The SDK is intended to be used only on the client side, but it is required to be used in conjunction with `@hastearcade/server`. See details [here](https://github.com/playhaste/haste-sdk/blob/main/packages/server/README.md).

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

While the primary work of integrating with Haste is performed in the server (where all game logic and score state should be maintained), Haste does provide a web based sdk to assist in the authentication process. In order for a player to play your game, they will need to authenticate with the Haste Arcade.

Your client side game will need to handle the following scenarios:

1. Login button with a click event
2. Handle redirect from Authentication system
3. Determine if player is authenticated
4. Get authentication token
5. Logout button with a redirect

Similar to the server side SDK, `@hastearcade/web` starts by initializing a Haste object. In this case, the name of the object is `HasteClient` and the object should be maintained via an abstraction so it only need to be initialized one time.

```typescript
const hasteClient = await HasteClient.build(process.env.HASTE_GAME_CLIENT_ID);
```

The client id used here can be found in the developer portal and will be for your game _not your server_. See image below for a reference point:

![](docs\assets\gameclientkeys.png)

#### Login

Once you have built your `HasteClient` object you may begin using it in your game. At the appropriate time in your game's flow, you will need to present them with a login button. The login button's click event should perform the following:

```typescript
await hasteClient.loginWithRedirect();
```

This code will redirect your user to Haste's authentication system for the player to login with their Haste credentials

Once the user authenticates, the authentication system will redirect the user back to your game's url. Additional code will be needed in your implementation to handle this redirect.

```typescript
await hasteClient.handleRedirect(async () => {
  /// perform any code necessary to initialize your game with
  /// the player ready to initiate a start action like a start
  /// button
  this.update();
});
```

#### Check Authenticated status

To check if the current user is authenticated please utilize the following method:

```typescript
const isAuth = await hasteClient.isAuthenticated();
```

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
