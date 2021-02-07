<a href="https://github.com/treedoc/cli-arg-deco"><img alt="GitHub Actions status" src="https://github.com/treedoc/cli-arg-deco/workflows/Node%20CI/badge.svg"></a> [![codecov](https://codecov.io/gh/treedoc/cli-arg-deco/branch/master/graph/badge.svg)](https://codecov.io/gh/treedoc/cli-arg-deco)

# CLI-ARG-DECO

A typescript decorator based simple meta data driven CLI argument parser.

## Background
Using decorator (aka. Annotation) to describe CLI argument is quite popular in other languages. But it's not available in Javascript (AFAIK). This library allow developers to describe the argument schema using the Typescript experimental feature [`decorator`](https://www.typescriptlang.org/docs/handbook/decorators.html). With this library, developer can avoid calling cumbersome APIs to retrieve parsed argument and format the usage text. The schema defined by the decorator will be the single source of truth which will be used for both parsing and print the usage text. So that developer can spend minimum time on the CLI argument concerns. 

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

- Here is example on how to use it: https://github.com/treedoc/cli-arg-deco/blob/main/src/__tests__/CliParser.spec.ts

## License

Copyright 2021 TreeDoc.org <BR>
Author/Developer: Jianwu Chen

Use of this source code is governed by an MIT-style license that can be found in the LICENSE file or at <https://opensource.org/licenses/MIT>.
