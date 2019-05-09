'use strict';

const sigma8 = require('./sigma8.js');

module.exports = new Uint8Array(sigma8.map((x) => {
	return x * 2;
}));
