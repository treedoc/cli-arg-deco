<a href="https://github.com/treedoc/CliArg_ts"><img alt="GitHub Actions status" src="https://github.com/treedoc/CliArg_ts/workflows/Node%20CI/badge.svg"></a> [![codecov](https://codecov.io/gh/treedoc/CliArg_ts/branch/master/graph/badge.svg)](https://codecov.io/gh/treedoc/CliArg_ts)

# CLI-ARG-DECO

A typescript decorator based simple meta data driven CLI argument parser.

## Background
Using decorator (or Annotation) to describe CLI argument is quite popular in other languages. But it's not available in Javascript (AFAIK). This library is using the Typescript experimental feature [`decorator`](https://www.typescriptlang.org/docs/handbook/decorators.html) to let developers describe the arguments. With this library, developer can avoid calling cumbersome APIs to retrieve parsed argument and format the usage text. The meta data in the decoration of any plain javascript object will be the single source of truth of CLI argument schema which will be used for both parsing and print the usage text. So that developer can spend minimum time on the CLI argument concerns. 

## Usage
### Install & Setup
- yarn install:  `yarn add cli-arg-deco`
- npm install: `npm i cli-arg-deco`
- Enable typescript decorator experimental feature.
  Edit `tsconfig.json`, add following entries:
  ```json
  {
    "target": "es5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
  }

  ```

```js


```


## License

Copyright 2021 TreeDoc.org <BR>
Author/Developer: Jianwu Chen

Use of this source code is governed by an MIT-style license that can be found in the LICENSE file or at <https://opensource.org/licenses/MIT>.
