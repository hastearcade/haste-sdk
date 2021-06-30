# haste-sdk

## Overview

A monorepo that contains the tooling required to create games quickly and easily for the [Haste Arcade](https://www.playhaste.com/).

<Add deploy badge here>

## Table of Contents

- [Background and Use Case](#background)
- [Packages](#packages)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [PNPM Monorepo](#pnpm-monorepo)
  - [Changesets](#changesets)
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

- [ ] Shared domain models and services
- [ ] Client SDK
- [ ] Server SDK
- [ ] CLI
- [ ] Documentation Site
- [ ] Sample Game

## Setup

### Prerequisites

haste-sdk is built using the node.js and typescript ecosystem. In order to develop haste-sdk you will need to install [Node.js](https://nodejs.org/en/). haste-sdk was primarily developed on Ubuntu 20 via Windows WSL, but this is not a requirement to develop haste-sdk.

In addition, you will need [NVM](https://github.com/nvm-sh/nvm) installed. NVM is utilized to ensure a specific version of node is installed when contributing.

### Installation

Once you have Node.js and NVM installed you can run the following commands to test haste-sdk. For dependency management and management of the monorepo, the repository is utilizing `pnpm`.

`npm install -g pnpm`

`pnpm install commitizen -D -g`

`git clone git@github.com:playhaste/haste-sdk.git`

`cd haste-sdk`

`nvm use`

`pnpm install`

`pnpm run prepare`

`pnpm run boostrap`

`pnpm run build`

`pnpm run test`

It is strongly recommended to develop haste-sdk using an editing ecosystem that supports [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/). The haste-sdk team uses VSCode with the following extensions:

1. VSCode ESLint [link](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. VSCode Prettier [link](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.prettier-vscode)

### Environment Variables

No environment variables are needed at this time.

## Usage

The follow section describes the haste-sdk development experience.

### PNPM Monorepo

haste-sdk utilizes a monorepo via PNPM to manage dependencies between the packages that comprise the haste arcade sdk. If you are not familiar with PNPM, please see their [website](https://pnpm.io/) for additional information.

haste-sdk is currently using a independent versioning strategy for all packages. This means that all packages' version numbers will remain independent and will be released separately as needed based on change sets.

Typically, you will need to interact with PNPM directly and standard tooling commands will be run via `pnpm`.

### Changesets

haste-sdk utilizes [changesets](https://github.com/atlassian/changesets) to manage versioning and publishing of the packages in the PNPM monorepo. Atlassion developed changesets to solve the following problem:

```
The changesets workflow is designed to help when people are making changes, all the way through to publishing. It lets contributors declare how their changes should be released, then we automate updating package versions, and changelogs, and publishing new versions of packages based on the provided information.
```

Developers making modifications to any package in the haste-sdk should create a changeset. The developer flow will be:

1. Identify change needed to the repository
2. Create feature branch off of main.
3. Implement changes
4. Create changeset `pnpm changeset` at the root directory.
5. Select (spacebar) which packages have been modified
6. Give a description of the change. This description will flow through to the changelog of the package so please review the [contribution guide](./CONTRIBUTING.md).
7. Push code
8. Submit PR

### Developer Tooling

haste-sdk uses the following tools to ensure a consistent, standard development environment:

1. Typescript
2. PNPM
3. Prettier
4. ESLint
5. Husky with lint-staged
6. Jest
7. Commitizen

#### Linting and Formatting

haste-sdk is configured to run all linting rules as part of a precommit hook defined via husky, but if you want to manually check your linting before you commit you can run

`pnpm run pretty && pnpm run lint`

#### Testing

haste-sdk utilizes Jest for running tests. To run all tests in the monorepo use the following command

`pnpm run test`

## Deploy

No deploy process is utilized at this time.

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
