
const blake = require('./index.js'),
	assert = require('assert');

const hex = '3346a0d3f9b3a626';
let context = blake.createHash({digestLength: 8});
context.update('cat');
context.update('dog');
assert.equal(context.digest().toString('hex'), hex);
assert.equal(blake.hex('catdog', 8), hex);
assert.equal(blake.hash('catdog', 8).toString('hex'), hex);
