# haste-game-server

## Overview

The haste game server is an example an ILP based game server. It leverages [matter-js](https://brm.io/matter-js/) for physics support and integrates with `haste-game-client`. The haste game server acts as the [authoritative server](https://www.gabrielgambetta.com/client-server-game-architecture.html). Since there is a monetary incentive with Haste games, it will attact malicious actors who try to cheat the system. While cheating cannot be completely prevented, the authoritative game server architecture does make it a lot more difficult to do so. As a game developer it is important to understand the various attack vectors and this example provides some perspective into how these vectors can be prevented.

All game logic and scoring occurs within the haste-game-server. The client is used only to render the latest game state. No logic or scoring should occur on the client.

The haste-game-server also leverages the @hastearcade/haste to integrate with the Haste API. This supports authz, submitting scores, and retrieving information about the latest leaderboard.

Information is transferred between the client and server using socket.io.

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md) for an overview of the haste-sdk repository.

<Add deploy badge here>

## Table of Contents

- [Background and Use Case](#background)
- [Setup](#setup)
- [Usage](#usage)
- [Deploy](#deploy)
- [Documentation](#documentation)
- [License](#license)
- [Contributing](#contributing)
- [Authors](#authors)

## Background

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Background) for a detailed background.

## Setup

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Setup) for a detailed setup guide.

### Environment Variables

Since this is running on the server, these environment variables are not public, unlike the haste game client. These can store secrets as needed.

- `PORT` - the port the haste game server will run on
- `CORS_URL` - the haste game client url
- `AUTH_URL` - the issuer url from Auth0 tenant
- `HASTE_CLIENT_ID` - the client id from Auth0 for the haste game server application
- `HASTE_CLIENT_SECRET` - the client secret from Auth0 for the haste game server application
- `HASTE_API_PROTOCOL` - the protocol the haste api is running on. typically for local development this is `http`
- `HASTE_API_HOST` - the hostname the haste api is running on. typically for local development this is `localhost`
- `HASTE_API_PORT` - the port the haste api is running on. typically for local development this is `3000`

## Usage

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Usage) for a detailed usage guide.

### Testing

@hastearcade/haste-game-server utilizes Jest for running tests. To run all tests in the haste-game-server package use the following command

`npm run test`

## Documentation

Currently there is no documentation setup, but please check back in the future.

## License

haste-sdk is currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

Please read our contribution [policy](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md).

## Authors

- Keith LaForce ([klaforce](https://github.com/rallieon/))
- Eric LaForce ([elaforc](https://github.com/foundrium/))
- Dan Wagner ([danwag06](https://github.com/danwag06))
