mintere
=======



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/mintere.svg)](https://npmjs.org/package/mintere)
[![Downloads/week](https://img.shields.io/npm/dw/mintere.svg)](https://npmjs.org/package/mintere)
[![License](https://img.shields.io/npm/l/mintere.svg)](https://github.com/mintere/mintere-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mintere
$ mintere COMMAND
running command...
$ mintere (-v|--version|version)
mintere/0.1.0 darwin-x64 node-v12.4.0
$ mintere --help [COMMAND]
USAGE
  $ mintere COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mintere hello [FILE]`](#mintere-hello-file)
* [`mintere help [COMMAND]`](#mintere-help-command)

## `mintere hello [FILE]`

describe the command here

```
USAGE
  $ mintere hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ mintere hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/mintere/mintere-cli/blob/v0.1.0/src/commands/hello.ts)_

## `mintere help [COMMAND]`

display help for mintere

```
USAGE
  $ mintere help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.1/src/commands/help.ts)_
<!-- commandsstop -->
