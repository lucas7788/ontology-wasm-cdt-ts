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
  const ADDR_VERSION = '17';
  const CHARS = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const PREFIX: u8 = 23;
  /**
  * Encode Uint8Array in base58.
  * @param bytes Byte array of type Uint8Array.
  */
 function encode(val: Uint8Array): string {
    let data = new Uint8Array(25);
    data[0] = PREFIX;
    for (let i = 0; i < val.length; ++i){
        data[i+1] = val[i];
    };
    
    return 'str';
  }

// function dhash256(data: D):Uint8Array {
//     let mut hash = new Uint8Array(32);
//     let dhash = Sha256::digest(&Sha256::digest(data.as_ref()));
//     hash[..].copy_from_slice(&dhash);
//     hash
// }
//   export function decodeBase58(data:string):Address{
    
//     return new Address();
//   }