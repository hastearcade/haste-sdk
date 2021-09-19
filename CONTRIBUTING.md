# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. When submitting a PR, it should be submitted from a fork of haste-sdk. The PR will utilize the play-haste PR template. Please fill out as much detail as possible to ensure a smooth merge process.
2. Pleae ensure that you have added unit tests where applicable for your change.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

See [Code of Conduct](./CODE_OF_CONDUCT.md)

## Technical Stack

The haste ecosystem will be built upon Node.js with Typescript as the language of choice. The haste ecosystem will support the latest LTS release of Node.js (v14 currently).

The default transpile target for Typescript should be ES6 for any repository in the haste ecosystem.

All releases will follow a semvar standard.

## Repository Requirements

All new repositories in the haste ecosystem should contain the following:

1. A `.nvmrc` file to allow developers to quickly reference the supported Node.js version.
2. For open source components, an MIT license file. For non-open source components, no License file.
3. CONTRIBUTING.md
4. All top level `package.json` should have the following scripts: `test`, `lint`, `build`, `pretty`, `clean`, `prepare`.
5. `.gitignore`
6. Top level `package.json` should use the haste-sdk as a template for how to structure the `package.json`.
7. You must include a `README` at the top level and in each package if using a monorepo.

## Coding Style

In order to maintain consistency in the coding style of the project, the haste development team chose to use a combination of Prettier and ESLint. These tools empower developers to write code and depend upon the tools to ensure consistency. Please see `prettier.config.js` and `.eslintrc.js` in the root folder for details on the standards chosen.

## Package naming

All package names should scoped to `@playhaste`. For example, the `haste-sdk` has packages `@playhaste/models` and `@playhaste/client`.

#### Tooling

Any repository in the haste ecosystem should leverage the following tools.

1. Prettier
2. ESLint
3. Jest
4. Commitizen
5. Husky

Please see an existing repository for example configurations for all tooling.

#### Testing Standards

Code coverage should be greater than 90% for any repository in the haste ecosystem.

Tests should be contained in a `__tests__` folder under `src`.
