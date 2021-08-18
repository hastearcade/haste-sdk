# haste-sdk

## Overview

The SDK to be used to empower developers to leverage the Haste Arcade. The SDK is intended to be used only on the server side. The SDK current supports

- Authz
- Submitting Scores

On the roadmap the Haste team plans to provide

- [ ] Real time leaderboard updates
- [ ] Simpler authentication setup and support
- [ ] Access to player information
- [ ] Player cards

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

## Quick Start

### Initialize the Haste SDK

A game developer can access their game's client id and client secret through the developer portal.

```typescript
const haste = await Haste.build(process.env.HASTE_CLIENT_ID, process.env.HASTE_CLIENT_SECRET, {
  hostProtocol: process.env.HASTE_API_PROTOCOL,
  host: process.env.HASTE_API_HOST,
  port: parseInt(process.env.HASTE_API_PORT, 10),
});
```

### Authenticate a user

The example game server and client use socket.io so here is the necessary code to authenticate the user and setup the Haste SDK.

```typescript
this.io = new Server(server, {
  cors: {
    origin: process.env.CORS_URL,
    methods: ['GET', 'POST'],
  },
});

this.jwtClient = new JwksClient({
  jwksUri: 'https://playhaste.us.auth0.com/.well-known/jwks.json',
});

this.io.use(this.jwtMiddleware);

private getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
  this.jwtClient.getSigningKey(header.kid, (err: Error, key: SigningKey) => {
    const signingKey = key.getPublicKey();
    callback(err, signingKey);
  });
};

private jwtMiddleware = (socket: Socket, next: (err?: ExtendedError) => void) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token as string, this.getKey, {}, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      if (decoded.iss === process.env.AUTH0_ISSUER && decoded.exp > new Date().getTime() / 1000) {
        socket.data = decoded;
        return next();
      } else {
        return next(new Error('Authentication error'));
      }
    });
  } else {
    next(new Error('Authentication error'));
  }
};

```

### Submit a score

This assumes a user is already logged in and the developer has access to the JWT.

```typescript
const metadata = jwt['http://haste/metadata'].playerId;
const player = new Player(metadata.playerId);
const score = 1;
const play = await haste.game.play(player);
await haste.game.score(play, score);
```

## Usage

See [here](https://github.com/playhaste/haste-sdk/blob/main/README.md#Usage) for a detailed usage guide.

### Testing

@haste/haste utilizes Jest for running tests. To run all tests in the server package use the following command

`npm run test`

## Documentation

Currently there is no further documentation setup, but please check back in the future.

## License

haste is currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

Please read our contribution [policy](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md).

## Authors

- Keith LaForce ([klaforce](https://github.com/klaforce/))
- Eric LaForce ([elaforc](https://github.com/elaforc/))
- Dan Wagner ([danwag06](https://github.com/danwag06))
