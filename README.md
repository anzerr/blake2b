
### `Intro`
Blake2B in Javascript (cleaned up version)

#### `Install`
``` bash
npm install --save git+https://github.com/anzerr/blake2b.git
npm install --save @anzerr/blake2b
```

#### `Example`
```javascript
const blake = require('blake2b');

let context = blake.createHash({digestLength: 8});
context.update('cat');
context.update('dog');
console.log(context.digest().toString('hex')); // 3346a0d3f9b3a626
```