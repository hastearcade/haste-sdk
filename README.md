# haste-sdk

## Overview

A monorepo that contains the tooling required to create games quickly and easily for the [Haste Arcade](https://www.playhaste.com/). Additionally it includes a sample game to provide a comprehensive example of how the Haste SDK can be used.

Initially, TypeScript and JavaScript will be the only supported SDKs, but long term Haste will build SDKs for other technology stacks and will help support community driven SDKs. Haste plans to keep client SDKs open source to ensure a good developer experience and will make available documented APIs.

<Add deploy badge here>

## Table of Contents

- [Background and Use Case](#background)
- [Packages](#packages)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Lerna Monorepo](#lerna-monorepo)
  - [Developer Tooling](#developer-tooling)
- [Deploy](#deploy)
- [Documentation](#documentation)
- [License](#license)
- [Contributing](#contributing)
- [Authors](#authors)

## Background

Welcome to the world’s first ILP Arcade. Haste Arcade is a platform filled with ILP Games
built by developers all around the world. Unlike traditional online games, ILP Games found on the Haste Arcade platform adhere to an exciting new real-time "Instant Leaderboard Payout" structure that was invented and made popular by Haste’s founding team members. Imagine going to your local arcade, inserting 25 cents into the gaming console, posting a high score on Pac-Man, and then getting paid 2.5 cents every time subsequent players play the game but fail to beat your score. Now consider holding the top score in a global online arcade where millions of daily players are playing the game but failing to beat your score, and earning 2.5 cents per play. This is a "game changer". This is Haste Arcade.

## Packages

- `domain` - shared domain models and services for the SDK
- `sdk` - The primary package. `sdk` provides a simple wrapper around the Haste API and makes it easy to configure integration with Haste.
- `haste-game-domain` - A base package that allows sharing types between the sample game server and sample game client
- `haste-game-server` - An example [authoritative server](https://www.gabrielgambetta.com/client-server-game-architecture.html) leveraging [matter-js](https://brm.io/matter-js/) for game physics
- `haste-game-client` - An example game client integrated with the game server. Leverages [phaser3](https://phaser.io/phaser3) for rendering the game levels and game state.

## Setup

### Prerequisites

haste-sdk is built using the node.js and typescript ecosystem. In order to develop haste-sdk you will need to install [Node.js](https://nodejs.org/en/). haste-sdk was primarily developed on Ubuntu 20 via Windows WSL, but this is not a requirement to develop haste-sdk.

In addition, you will need [NVM](https://github.com/nvm-sh/nvm) installed. NVM is utilized to ensure a specific version of node is installed when contributing.

### Installation

Once you have Node.js and NVM installed you can run the following commands to test haste-sdk.

`npm install commitizen -D -g`

`git clone git@github.com:playhaste/haste-sdk.git`

`cd haste-sdk`

`nvm use`

`npm i -g lerna`

`npm run boostrap`

`npm run build`

`npm run test`

It is strongly recommended to develop haste-sdk using an editing ecosystem that supports [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/). The haste-sdk team uses VSCode with the following extensions:

1. VSCode ESLint [link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. VSCode Prettier [link](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.prettier-vscode)

### Environment Variables

Within this monorepository, developers can see that `haste-game-client` and `haste-game-server` use [dotenv](https://github.com/motdotla/dotenv) and `.env` files. Their specifications are outlined in their corresponding `README`. The `sdk` does not require environment variables.

## Usage

The follow section describes the haste-sdk development experience.

### Lerna Monorepo

haste-sdk utilizes a monorepo via Lerna to manage dependencies between the packages that comprise the haste arcade sdk. If you are not familiar with Lerna, please see their [website](https://lerna.js.org/) for additional information.

haste-sdk is currently using a shared versioning strategy for all packages. This means that all packages' version numbers will remain in sync and will be released together.

Typically, you will not need to interact with Lerna directly as standard tooling commands will be run via `npm`.

### Changesets

haste-sdk utilizes [changesets](https://github.com/atlassian/changesets) to manage versioning and publishing of the packages in the PNPM monorepo. Atlassion developed changesets to solve the following problem:

> The changesets workflow is designed to help when people are making changes, all the way through to publishing. It lets contributors declare how their changes should be released, then we automate updating package versions, and changelogs, and publishing new versions of packages based on the provided information.

Developers making modifications to any package in the haste-sdk should create a changeset. The developer flow will be:

1. Identify change needed to the repository
2. Create feature branch off of development.
3. Implement changes
4. Create changeset by running `pnpm changeset` at the root directory.
5. Select which packages have been modified by using the spacebar key.
6. Give a description of the change. This description will flow through to the changelog of the package so please review the [contribution guide](./CONTRIBUTING.md).
7. Push code to feature branch
8. Submit PR to development and ask for review.

### Developer Tooling

haste-sdk uses the following tools to ensure a consistent, standard development environment:

1. Typescript
2. Lerna
3. Prettier
4. ESLint
5. Husky with lint-staged
6. Jest
7. Commitizen

_Through the use of npm package scripts and lerna, all commands can be run from the root directory of haste-sdk._

#### Linting and Formatting

haste-sdk is configured to run all linting rules as part of a precommit hook defined via husky, but if you want to manually check your linting before you commit you can run

`npm run pretty && npm run lint`

#### Testing

haste-sdk utilizes Jest for running tests. To run all tests in the monorepo use the following command

`npm run test`

## Deploy

No deploy process is utilized at this time.

## Documentation

This `README` and each package's `README` provides high-level documentation. Additionally the code has been reviewed and comments provided to aid future developers in understanding why certain decisions were made. In the future the Haste team will be providing links here to the Haste API documentation and any quick start documentation.

## License

haste-sdk is currently licensed under [MIT](https://github.com/playhaste/haste-sdk/blob/main/LICENSE)

## Contributing

Please read our contribution [policy](https://github.com/playhaste/haste-sdk/blob/main/CONTRIBUTING.md).

## Authors

- Keith LaForce ([klaforce](https://github.com/klaforce/))
- Eric LaForce ([elaforc](https://github.com/elaforc/))
- Dan Wagner ([danwag06](https://github.com/danwag06))

```

```
