# haste-game-client

## Overview

The haste game client is an example an ILP based game. It leverages [phaser3](https://phaser.io/phaser3) for rendering and integrates with `haste-game-server` which acts as the [authoritative server](https://www.gabrielgambetta.com/client-server-game-architecture.html). Since there is a monetary incentive with Haste games, it will attact malicious actors who try to cheat the system. While cheating cannot be completely prevented, the authoritative game server architecture does make it a lot more difficult to do so. As a game developer it is important to understand the various attack vectors and this example provides some perspective into how these vectors can be prevented.

All game logic and scoring occurs within the haste-game-server. The client is used only to render the latest game state. No logic or scoring should occur on the client.

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

When deploying a client side game like this, there should be no secrets stored as an environment variable. Anything that is client side can be viewed by an end user through tools such as Chrome DevTools. The following environment variables aid deployment and local development are are fine to be made public.

- `SERVER_HOST` - the hostname of the haste game server
- `SERVER_PORT` - the port the haste game server runs on
- `SERVER_PROTOCOL` - the protocol the haste game server runs on. for local development this is typically `http`.

## Usage

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Usage) for a detailed usage guide.

The haste-game-client can only be run in conjunction with the haste-game-server. It is recommended that one start the server first before starting up the client. For local development, both the client and server are configured for hotreloading to aid developers.

### Testing

@hastearcade/haste-game-client utilizes Jest for running tests. To run all tests in the haste-game-client package use the following command

`npm run test`

## Documentation

Currently there is no formal documentation setup, but please check back in the future. Haste developers have attempted to provide comments within the code to explain certain decisions and aid prospective game developers.

## License

haste-sdk is currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

Please read our contribution [policy](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md).

## Authors

- Keith LaForce ([klaforce](https://github.com/rallieon/))
- Eric LaForce ([elaforc](https://github.com/foundrium/))
- Dan Wagner ([danwag06](https://github.com/danwag06))
