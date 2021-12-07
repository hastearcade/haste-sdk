# haste-cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/haste.svg)](https://npmjs.org/package/haste)
[![Downloads/week](https://img.shields.io/npm/dw/haste.svg)](https://npmjs.org/package/haste)
[![License](https://img.shields.io/npm/l/haste.svg)](https://github.com/foundrium/haste/blob/master/package.json)

<!-- toc -->

- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g haste
$ haste COMMAND
running command...
$ haste (-v|--version|version)
haste/0.0.0 linux-x64 node-v16.3.0
$ haste --help [COMMAND]
USAGE
  $ haste COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`haste hello [FILE]`](#haste-hello-file)
- [`haste help [COMMAND]`](#haste-help-command)

## `haste hello [FILE]`

describe the command here

```
USAGE
  $ haste hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ haste hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/foundrium/haste/blob/v0.0.0/src/commands/hello.ts)_

## `haste help [COMMAND]`

display help for haste

```
USAGE
  $ haste help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.11/src/commands/help.ts)_

<!-- commandsstop -->
