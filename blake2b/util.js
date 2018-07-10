'use strict';

const iv32 = require('./iv.js');
const sigma82 = require('./sigma82.js');

class Util {

	constructor() {
		this.v = new Uint32Array(32);
		this.m = new Uint32Array(32);
	}

	normalizeInput(input) {
		if (input instanceof Uint8Array) {
			return input;
		}
		throw new Error('Input must be an string, Buffer or Uint8Array');
	}

	toHex(bytes) {
		return Array.prototype.map.call(bytes, (n) => {
			return (n < 16 ? '0' : '') + n.toString(16);
		}).join('');
	}

	uint32ToHex(val) {
		return (0x100000000 + val).toString(16).substring(1);
	}

	add64AA(v, a, b) {
		let o0 = v[a] + v[b];
		let o1 = v[a + 1] + v[b + 1];
		if (o0 >= 0x100000000) {
			o1++;
		}
		v[a] = o0;
		v[a + 1] = o1;
	}

	add64AC(v, a, b0, b1) {
		let o0 = v[a] + b0;
		if (b0 < 0) {
			o0 += 0x100000000;
		}
		let o1 = v[a + 1] + b1;
		if (o0 >= 0x100000000) {
			o1++;
		}
		v[a] = o0;
		v[a + 1] = o1;
	}

	b2bGET32(arr, i) {
		return arr[i] ^ arr[i + 1] << 8 ^ arr[i + 2] << 16 ^ arr[i + 3] << 24;
	}

	b2bG(v, m, a, b, c, d, ix, iy) {
		let x0 = m[ix];
		let x1 = m[ix + 1];
		let y0 = m[iy];
		let y1 = m[iy + 1];

		this.add64AA(v, a, b);
		this.add64AC(v, a, x0, x1);

		let xor0 = v[d] ^ v[a];
		let xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor1;
		v[d + 1] = xor0;

		this.add64AA(v, c, d);

		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = xor0 >>> 24 ^ xor1 << 8;
		v[b + 1] = xor1 >>> 24 ^ xor0 << 8;

		this.add64AA(v, a, b);
		this.add64AC(v, a, y0, y1);

		xor0 = v[d] ^ v[a];
		xor1 = v[d + 1] ^ v[a + 1];
		v[d] = xor0 >>> 16 ^ xor1 << 16;
		v[d + 1] = xor1 >>> 16 ^ xor0 << 16;

		this.add64AA(v, c, d);

		xor0 = v[b] ^ v[c];
		xor1 = v[b + 1] ^ v[c + 1];
		v[b] = xor1 >>> 31 ^ xor0 << 1;
		v[b + 1] = xor0 >>> 31 ^ xor1 << 1;
	}

	compress(ctx, last) {
		for (let i = 0; i < 16; i++) {
			this.v[i] = ctx.h[i];
			this.v[i + 16] = iv32[i];
		}

		this.v[24] = this.v[24] ^ ctx.t;
		this.v[25] = this.v[25] ^ ctx.t / 0x100000000;

		if (last) {
			this.v[28] = ~this.v[28];
			this.v[29] = ~this.v[29];
		}

		for (let i = 0; i < 32; i++) {
			this.m[i] = this.b2bGET32(ctx.b, 4 * i);
		}

		for (let i = 0; i < 12; i++) {
			this.b2bG(this.v, this.m, 0, 8, 16, 24, sigma82[i * 16 + 0], sigma82[i * 16 + 1]);
			this.b2bG(this.v, this.m, 2, 10, 18, 26, sigma82[i * 16 + 2], sigma82[i * 16 + 3]);
			this.b2bG(this.v, this.m, 4, 12, 20, 28, sigma82[i * 16 + 4], sigma82[i * 16 + 5]);
			this.b2bG(this.v, this.m, 6, 14, 22, 30, sigma82[i * 16 + 6], sigma82[i * 16 + 7]);
			this.b2bG(this.v, this.m, 0, 10, 20, 30, sigma82[i * 16 + 8], sigma82[i * 16 + 9]);
			this.b2bG(this.v, this.m, 2, 12, 22, 24, sigma82[i * 16 + 10], sigma82[i * 16 + 11]);
			this.b2bG(this.v, this.m, 4, 14, 16, 26, sigma82[i * 16 + 12], sigma82[i * 16 + 13]);
			this.b2bG(this.v, this.m, 6, 8, 18, 28, sigma82[i * 16 + 14], sigma82[i * 16 + 15]);
		}

		for (let i = 0; i < 16; i++) {
			ctx.h[i] = ctx.h[i] ^ this.v[i] ^ this.v[i + 16];
		}
	}

}

module.exports = new Util();
