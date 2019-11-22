# ontology-wasm-cdt-ts

Typescript library for writing ontology wasm smart contracts

## Build development environment
The requirements to build Ontology wasm contarct with typescript are:
* assemblyscript
* ontio-ts-cdt
* ontio-wasm-build

## Create ontology wasm contract with ontio-ts-cdt

1. create contract
```
npx asinit helloworld
```
2. add dependencies in `package.json`
```json
"dependencies": {
    "assemblyscript-json": "^0.2.0",
    "bignum": "github:MaxGraey/bignum.wasm",
    "ontio-ts-cdt": "^0.1.9"
  },
```

3. change `npm run asbuild:optimized` of scripts in `package.json`
```
"asbuild:optimized": "asc assembly/index.ts -b build/optimized.wasm -t build/optimized.wat --validate --optimize --use abort=",
```
4. edit contarct logic in `assembly/index.ts`
```
import {runtime_api,util} from 'ontio-ts-cdt';

export function invoke(): void {
  runtime_api.ret(util.stringToUint8Array('hello world'));
}
```


## compile contract
```
npm run asbuild
```

## optimized contract 
```
ontio-wasm-build ./build/optimized.wasm
```
After executing this command, the optimized_optimized.wasm file will be generated.
we can deploy and invoke the contract with optimized_optimized.wasm file.