import { util } from "./utils";
import {} from 'bignum';

const H256_LEN = 32;
export class H256 {
    /**
     * Base58 or Hex encoded address
     */
    value :Uint8Array = new Uint8Array(H256_LEN);
    constructor(val: Uint8Array) {
        if (val.byteLength != 32) {
            throw new Error("param wrong");
        }
        this.value = val;
    }
  }

const ADDRESS_LEN = 20;
export class Address {
    /**
       * Base58 or Hex encoded address
       */
      value: Uint8Array = new Uint8Array(ADDRESS_LEN);
  
      constructor(value: Uint8Array) {
          if (value.length != 20) {
            throw new Error("param wrong");
          } 
          this.value = value;
      }

      to_base58():string {
          return encode(this.value);
      }
  }