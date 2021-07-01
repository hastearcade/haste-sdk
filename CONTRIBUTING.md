# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Pull Request Process

1. When submitting a PR, it should be submitted from a fork of haste-sdk. The PR will utilize the play-haste PR template. Please fill out as much detail as possible to ensure a smooth merge process.
2. Pleae ensure that you have added unit tests where applicable for your change.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

#### Behavior

Examples of behavior that contributes to creating a positive environment
include:

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

- The use of sexualized language or imagery and unwelcome sexual attention or
  advances
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information, such as a physical or electronic
  address, without explicit permission
- Other conduct which could reasonably be considered inappropriate in a
  professional setting

#### Technical Stack

The haste ecosystem will be built upon Node.js with Typescript as the language of choice. The haste ecosystem will support the latest LTS release of Node.js (v14 currently).

The default transpile target for Typescript should be ES6 for any repository in the haste ecosystem.

All releases will follow a semvar standard.

#### Repository Requirements

All new repositories in the haste ecosystem should contain the following:

1. A `.nvmrc` file to allow developers to quickly reference the supported Node.js version.
2. For open source components, an MIT license file. For non-open source components, no License file.
3. CONTRIBUTING.md
4. All top level `package.json` should have the following scripts: `test`, `lint`, `build`, `pretty`, `clean`, `prepare`.
5. `.gitignore`
6. Top level `package.json` should use the haste-sdk as a template for how to structure the `package.json`.
7. If using Lerna, you must include a `README` at the top level and in each package.

#### Coding Style

In order to maintain consistency in the coding style of the project, the haste development team chose to use a combination of Prettier and ESLint. These tools empower developers to write code and depend upon the tools to ensure consistency. Please see `prettier.config.js` and `.eslintrc.js` in the root folder for details on the standards chosen.

#### Package naming

All package names should scoped to `@haste`. For example, the `haste-sdk` has packages `@haste/domain` and `@haste/client`.

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

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [INSERT EMAIL ADDRESS]. All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
