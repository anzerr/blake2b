'use strict';

const Blake2b = require('./blake2b/blake2b.js');
const util = require('./blake2b/util.js');

// BLAKE.js v1.0.1
// Adaptation of https://github.com/dcposch/blakejs
//
// Blake2B in pure Javascript
// Adapted from the reference implementation in RFC7693
// Ported to Javascript by DC - https://github.com/dcposch

module.exports = {
	createHash: (options) => {
		return new Blake2b((options || {}).digestLength);
	},

	hash: function(input, length, key) {
		let handle = this.createHash({digestLength: length || 64, key: key});
		handle.update(util.normalizeInput(input));
		return handle.digest();
	},

	hex: function(input, key, length) {
		return util.toHex(this.hash(input, key, length));
	}
};
