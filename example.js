
const blake = require('./index.js'),
	assert = require('assert');

const hex = '3346a0d3f9b3a626';
let context = blake.createHash({digestLength: 8});
context.update('cat');
context.update('dog');
assert.equal(context.digest().toString('hex'), hex);
assert.equal(blake.hex('catdog', 8), hex);
assert.equal(blake.hash('catdog', 8).toString('hex'), hex);

(() => {
	let hash = () => {
		let c = blake.createHash({digestLength: 8});
		c.update('cat');
		return c.digest().toString('hex');
	};

	const NS_PER_SEC = 1e9, rounds = 100000;
	let start = process.hrtime();
	for (let i = 0; i < rounds; i++) {
		hash();
	}
	const diff = process.hrtime(start),
		hps = NS_PER_SEC / ((diff[0] * NS_PER_SEC + diff[1]) / rounds);
	console.log(`Benchmark ${hps.toFixed(2)}/ hashes per second`);
})();
