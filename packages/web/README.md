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

- [Background and Use Case](#background)
- [Setup](#setup)
- [Testing](#testing)
- [Documentation](#documentation)
- [License](#license)
- [Contributing](#contributing)
- [Authors](#authors)

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
