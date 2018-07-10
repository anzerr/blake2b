'use strict';

const iv32 = require('./iv.js');
const util = require('./util.js');

const blake2b = function(outlen, key) {
	if (outlen === 0 || outlen > 64) {
		throw new Error('Illegal output length, expected 0 < length <= 64');
	}
	if (key && key.length > 64) {
		throw new Error('Illegal key, expected Uint8Array with 0 < length <= 64');
	}

	this.ctx = {
		b: new Uint8Array(128),
		h: new Uint32Array(16),
		t: 0,
		c: 0,
		outlen: outlen
	};

	for (let i = 0; i < 16; i++) {
		this.ctx.h[i] = iv32[i];
	}
	let keylen = key ? key.length : 0;
	this.ctx.h[0] ^= 0x01010000 ^ keylen << 8 ^ outlen;

	if (key) {
		this.update(key);
		this.ctx.c = 128;
	}
};
blake2b.prototype = {
	update: function(input) {
		for (let i = 0; i < input.length; i++) {
			if (this.ctx.c === 128) {
				this.ctx.t += this.ctx.c;
				util.compress(this.ctx, false);
				this.ctx.c = 0;
			}
			this.ctx.b[this.ctx.c++] = input[i];
		}
	},

	digest: function() {
		this.ctx.t += this.ctx.c;

		while (this.ctx.c < 128) {
			this.ctx.b[this.ctx.c++] = 0;
		}
		util.compress(this.ctx, true);

		let out = new Uint8Array(this.ctx.outlen);
		for (let i = 0; i < this.ctx.outlen; i++) {
			out[i] = this.ctx.h[i >> 2] >> 8 * (i & 3);
		}
		return out;
	}
};

module.exports = blake2b;
