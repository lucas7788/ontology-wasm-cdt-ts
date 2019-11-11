import {ADDR_VERSION} from "./consts";

const ADDRESS_LEN = 20;
export class Address {
    /**
       * Base58 or Hex encoded address
       */
      value: Uint8Array = new Uint8Array(ADDRESS_LEN);
  
      constructor(value: Uint8Array) {
          if (value.length != 20) {
            throw new Error("param wrong");
          }  else {
              this.value = value;
          }
      }
  }

