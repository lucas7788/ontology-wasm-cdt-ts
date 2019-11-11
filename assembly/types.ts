const H256_LEN = 32;
export class H256 {
    /**
       * Base58 or Hex encoded address
       */
      value: Uint8Array = new Uint8Array(H256_LEN);
  
      constructor(value: Uint8Array) {
          if (value.byteLength != 32) {
            throw new Error("param wrong");
          }  else {
              this.value = value;
          }
      }
  }