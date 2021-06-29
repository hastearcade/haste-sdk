# haste-game-server

## Overview

The haste game server is an example of the @haste-sdk/sdk package. It utilizes the haste arcade api to demonstrate how to leverge a shared leaderboard and payouts.

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

- `PORT` - the port the haste game server will run on
- `CORS_URL` - the haste game client url
- `AUTH0_ISSUER` - the issuer url from Auth0 tenant
- `HASTE_CLIENT_ID` - the client id from Auth0 for the haste game server application
- `HASTE_CLIENT_SECRET` - the client secret from Auth0 for the haste game server application
- `HASTE_API_PROTOCOL` - the protocol the haste api is running on. typically for local development this is `http`
- `HASTE_API_HOST` - the hostname the haste api is running on. typically for local development this is `localhost`
- `HASTE_API_PORT` - the port the haste api is running on. typically for local development this is `3000`

## Usage

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Usage) for a detailed usage guide.

### Testing

@haste-sdk/haste-game-server utilizes Jest for running tests. To run all tests in the haste-game-server package use the following command

`npm run test`

## Documentation

Currently there is no documentation setup, but please check back in the future.

## License

haste-sdk is currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

Please read our contribution [policy](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md).

## Authors

- Keith LaForce ([klaforce](https://github.com/klaforce/))
- Eric LaForce ([elaforc](https://github.com/elaforc/))
- Dan Wagner ([danwag06](https://github.com/danwag06))
