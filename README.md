
### `Intro`
Blake2B in Javascript (cleaned up version)

#### `Install`
```shell
npm install --save git+http://git@github.com/anzerr/blake2b.git
```

#### `Example`
```javascript
const blake = require('blake2b');

let context = blake.createHash({digestLength: 8});
context.update('cat');
context.update('dog');
console.log(context.digest()); // 3346a0d3f9b3a626
```