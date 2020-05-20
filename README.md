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
mintere/0.3.2 darwin-x64 node-v12.4.0
$ mintere --help [COMMAND]
USAGE
  $ mintere COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mintere help [COMMAND]`](#mintere-help-command)
* [`mintere sites:deploy [DIR]`](#mintere-sitesdeploy-dir)
* [`mintere sites:local [DIR]`](#mintere-siteslocal-dir)
* [`mintere sites:new`](#mintere-sitesnew)

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

## `mintere sites:deploy [DIR]`

Deploy a site to the Mintere Sites Platform

```
USAGE
  $ mintere sites:deploy [DIR]

ARGUMENTS
  DIR  [default: ./theme] The directory of the theme to deploy

OPTIONS
  -e, --environment=environment      [default: production] the environment to deploy to
  -h, --help                         show CLI help
  -k, --deploymentKey=deploymentKey  (required) The key to use when deploying to the API.
  --api=api                          [default: https://app.mintere.com] The base URL of the API to deploy to.

EXAMPLE
  $ DEPLOYMENT_KEY=key mintere sites:deploy
```

_See code: [src/commands/sites/deploy.ts](https://github.com/mintere/mintere-cli/blob/v0.3.2/src/commands/sites/deploy.ts)_

## `mintere sites:local [DIR]`

Preview a site locally

```
USAGE
  $ mintere sites:local [DIR]

ARGUMENTS
  DIR  [default: ./theme] relative path to theme directory

OPTIONS
  -h, --help               show CLI help
  -m, --mocksDir=mocksDir  [default: ./mocks] relative path to mocks directory

EXAMPLE
  $ mintere sites:local
```

_See code: [src/commands/sites/local.ts](https://github.com/mintere/mintere-cli/blob/v0.3.2/src/commands/sites/local.ts)_

## `mintere sites:new`

Create a new site

```
USAGE
  $ mintere sites:new

OPTIONS
  -h, --help  show CLI help

EXAMPLE
  $ mintere sites:new
```

_See code: [src/commands/sites/new.ts](https://github.com/mintere/mintere-cli/blob/v0.3.2/src/commands/sites/new.ts)_
<!-- commandsstop -->
