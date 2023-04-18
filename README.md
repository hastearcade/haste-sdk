# haste-sdk

## Overview

This readme is intended for developers looking to utilize the Haste ecosystem to build a game on the Haste Arcade. If you are a developer looking to contribute to the Haste ecosystem please see [Contributing](#contributing).

The haste-sdk repository is a monorepo that contains the tooling required to create games quickly and easily for the [Haste Arcade](https://hastearcade.com/). Additionally it includes a sample game to provide a comprehensive example of how the Haste SDK can be used to apply the concept of Haste Leaderboard Payout (HLP).

Initially, TypeScript and JavaScript will be the only supported SDKs, but long term Haste will build SDKs for other technology stacks and will help support community driven SDKs. Haste plans to keep client SDKs open source to ensure a good developer experience and will make available documented APIs for developers that do not wish to utilize Typescript or Javascript.

Ensure you read our [Documentation](https://docs.hastearcade.com/) site for important details about building your game. Specifically you cannot just build a client side game, there must be a server side component to your games known as an authoritative server that can be found in the [Security](https://docs.hastearcade.com/game-security) details.

## Table of Contents

- [Developer Documentation](#developer-documentation)
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

## Developer Documentation

Please visit our [Documentation](https://docs.hastearcade.com/) site for details on integration of Haste HLP into your game.

## Background

Welcome to the world’s first HLP Arcade. Haste Arcade is a platform filled with HLP Games built by developers all around the world. Unlike traditional online games, HLP Games found on the Haste Arcade platform adhere to an exciting new real-time "Haste Leaderboard Payout" structure that was invented and made popular by Haste’s founding team members.

Imagine going to your local arcade, inserting 25 cents into the gaming console, posting a high score on Pac-Man, and then getting paid 2.5 cents every time subsequent players play the game but fail to beat your score. Now consider holding the top score in a global online arcade where millions of daily players are playing the game but failing to beat your score, and earning 2.5 cents per play. This is a "game changer". This is Haste Arcade.

## Packages

The following lists the packages contained in the haste-sdk monorepo:

- `models` - shared domain models and services for the server and web SDK.
- `server` - The primary package for server side integration with Haste. `server` provides a simple wrapper around the Haste API and makes it easy to configure integration with Haste.
- `web` - The primary package for client side integration with Haste. The web SDK is used to integrate with the Haste authentication system.

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
