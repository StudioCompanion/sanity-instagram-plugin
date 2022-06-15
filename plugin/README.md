# sanity-plugin-instagram

## Installation

```
npm install --save sanity-plugin-instagram
```

or

```
yarn add sanity-plugin-instagram
```

## Usage

Add it as a plugin in sanity.config.ts (or .js):

```
 import {createConfig} from 'sanity'
 import {myPlugin} from 'sanity-plugin-instagram'

 export const createConfig({
     /...
     plugins: [
         myPlugin({})
     ]
 })
```

## License

MIT © Josh
See LICENSE
