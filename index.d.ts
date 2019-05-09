
declare namespace blake2b {

	class Blake2b {
		constructor(outlen: number, key: Buffer | string | Uint8Array)
		update(data: Buffer | string | Uint8Array): void
		digest(): Buffer
	}

	function createHash(options: any): Blake2b
	function createHash(input: Buffer | string | Uint8Array, length: number, key: Buffer): Buffer
	function hex(input: Buffer, length: number, key: Buffer): string

}

export as namespace blake2b;
export = blake2b;