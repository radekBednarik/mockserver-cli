# mockserver-cli

Utility for handling expectations setup, teardown and other action on [MockServer](https://www.mock-server.com/mock_server/creating_expectations.html) instance.

## System Preconditions

- [Node.js](https://nodejs.org/en/) - developed and tested on v20.10.0

## Installation for usage of the library

1. run `npm i -g mockserver-cli`. Global installation is recommended for usage of the library. So it will be accessible from any directory.

2. run `npx expectations -h` to see the list of available commands. Will display something like this:

```bash
npx expectations -h

# output
Usage: expectations [options] [command]

Options:
  -V, --version           output the version number
  -c, --config <path>     set config path. defaults to './mockserver.config.json' (default: "./mockserver.config.json")
  --concurrency <number>  set number of concurrent requests. defaults to '10' (default: "10")
  -h, --help              display help for command

Commands:
  set <paths...>          send prepared expectations up to the mockserver instance
  clear <paths...>        clear all expectations from the mockserver instance
  reset                   resets everything in the running mockserver instance
  help [command]          display help for command
```

## Installation for development

1. clone the [repository](git@github.com:radekBednarik/mockserver-cli.git)

2. run `npm i` to install dependencies

## How to Run

### Global options

#### Set config path

```bash
npx expectations set -c ./examples/mockserver.config.json ./examples/expectations/expectation1.json
```

#### Configuration file format

Example:

```json
{
  "host": "localhost",
  "port": 5999,
  "protocol": "<http|https>"
}
```

File can be placed anywhere. If `-c` or `--config` option is not provided, program will look for `mockserver.config.json` in the current directory.

#### Set concurrency

```bash
npx expectations --concurrency=5 set ./examples/expectations/expectation1.json
```

### Set Expectations

Expectations definitions are stored in `json` files. These files can be placed anywhere.

#### Expectation file format

- file name must end with `.expectations.json`

- file must contain array of expectations objects

- see [Mockserver documentation](https://www.mock-server.com/mock_server/creating_expectations.html) for more details about expectations

Example:

```json
[
  {
    "httpRequest": {
      "method": "GET",
      "path": "/api/test/endpoint/v1"
    },
    "httpResponse": {
      "statusCode": 200,
      "body": "Hello World!"
    }
  },
  {
    "httpRequest": {
      "method": "GET",
      "path": "/api/test/endpoint/v2"
    },
    "httpResponse": {
      "statusCode": 200,
      "body": {
        "message": "Hello World!",
        "flag": "test"
      }
    }
  }
]
```

#### Set Expectations from a single file

```bash
npx expectations -c=some/filepath/mockserver.config.json --concurrency=50 set ./examples/expectations/expectation1.json
```

#### Set Expectations from multiple files

```bash
npx expectations set ./examples/expectations/expectation1.json ./examples/expectations/expectation2.json
```

#### Set Expectations from a directory

```bash
npx expectations set ./examples/expectations
```

#### Set Expectations from multiple directories

```bash
npx expectations set ./examples/expectations ./examples/expectations2
```

### Clear Expectations

#### Clear Expectations from a single file

```bash
npx expectations clear ./examples/expectations/expectation1.json
```

#### Clear Expectations from multiple files

```bash

npx expectations clear ./examples/expectations/expectation1.json ./examples/expectations/expectation2.json
```

#### Clear Expectations from a directory

```bash
npx expectations clear ./examples/expectations
```

#### Clear Expectations from multiple directories

```bash
npx expectations clear ./examples/expectations ./examples/expectations2
```

### Reset MockServer

```bash
npx expectations reset
```

## Logging

Logging is done via [pino.js](https://getpino.io/) library. Currently, there is only the possibility to log to the console.

### Log Levels

- see [logger levels in pino docs](https://getpino.io/#/docs/api?id=levels)

### Logger settings

These are done via `ENV` variables.

- `LOG_LEVEL` - set log level. Defaults to `info` if not provided.

- `LOG_ENABLED` - set log enabled. Defaults to `true` if not provided.
