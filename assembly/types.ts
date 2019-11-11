const H256_LEN = 32;

export class H256 {
    /**
     * Base58 or Hex encoded address
     */
    value :ArrayBuffer = new ArrayBuffer(H256_LEN);
    constructor(val: ArrayBuffer) {
        if (val.byteLength != 32) {
            throw new Error("param wrong");
        }
        this.value = val;
    }
  }