import { Address } from "./types";
import { u128 } from "bignum";

export namespace util {
    
  const HEX :string[]= ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  export function stringToArrayBuffer(s: string): ArrayBuffer {
    return String.UTF8.encode(s);
  }

  export function hexToAddress(hex:string):Address {
    let buffer = util.hexStringToArrayBuffer(hex);
    return new Address(Uint8Array.wrap(buffer) as Uint8Array);
  }

  export function stringToUint8Array(s: string): Uint8Array {
    let buffer = String.UTF8.encode(s);
    return Uint8Array.wrap(buffer) as Uint8Array;
  }

  export function strToHexString(data: string): string {
    let bytes = stringToUint8Array(data);
    return bytesToHexString(bytes);
  }

  export function bytesToHexString(bytes:Uint8Array):string {
    if (bytes.byteLength == 0) {
      return '00';
    }
    let dataView:DataView = new DataView(bytes.buffer);
    let res :string= '';
    for(let i=0;i<bytes.byteLength;i++){
      res += u8ToHexString(dataView.getUint8(i));
    }
    return res;
  }

  export function u8ToHexString(u:u8):string{
    let h = u>>4;
    let l = u%16;
    return HEX[h]+HEX[l];
  }

  export function hexStringToArrayBuffer(hex:string):ArrayBuffer {
    if (hex.length %2 != 0) {
      throw new Error('error hexstring:'+hex);
    }
    let u:Uint8Array = new Uint8Array(hex.length/2);
    let buffer :ArrayBuffer= new ArrayBuffer(hex.length/2);
    let d :DataView= new DataView(buffer);
    for (let i=0;i<hex.length/2;i++) {
      let h = hex.charAt(2*i);
      let hi = HEX.indexOf(h);
      let l = hex.charAt(2*i+1);
      let li = HEX.indexOf(l);
      d.setUint8(i, (hi*16+li) as u8);
    }
    return buffer;
  }

  export function hexToUint8Array(data:string):Uint8Array {
    return Uint8Array.wrap(hexStringToArrayBuffer(data));
  }

  export function u16ToHexString(u:u16):string{
    let buffer:ArrayBuffer = new ArrayBuffer(2);
    let d:DataView = new DataView(buffer);
    d.setUint16(0,u,true);
    return u8ToHexString(d.getUint8(0))+u8ToHexString(d.getUint8(1));
  }
  
  export function u32ToHexString(u:u32):string{
    let buffer:ArrayBuffer = new ArrayBuffer(4);
    let d:DataView = new DataView(buffer);
    d.setUint32(0,u,true);
    let res = '';
    for (let i=0;i<buffer.byteLength;i++) {
      res += u8ToHexString(d.getUint8(i));
    }
    return res;
  }

  export function u128FromNeoUint8Array(buf:Uint8Array):u128{
    if (buf.byteLength == 0) {
      return u128.fromI32(0);
    }
    let neg = buf[buf.byteLength-1] >= 0x80;
    let default_val = u128.Max;
    if (neg) {
      default_val = u128.Min;
    } 
    let res = new Uint8Array(16);
    if (((buf.byteLength > 16) && neg == true) || (buf.byteLength>17 && (neg == false))) {
      return default_val;
    }
    if (buf.byteLength == 17 && buf[16] != 0){
      return default_val;
    }
    let copy = buf.byteLength;
    if (buf.byteLength > 16) {
      copy = 16;
    }
    {
      for (let i=0;i<copy;i++) {
        res[i] = buf[i];
      }
      if(neg) {
        for (let i=0;i<res.byteLength-copy;i++){
          res[copy+i] = 255;
        }
      }
    }
    return u128.fromUint8ArrayLE(res);
  }
  export function u128ToNeoUint8Array(val:u128):Uint8Array {
    let bs = val.toUint8Array(false);
    let temp = new Uint8Array(bs.byteLength);
    memory.copy(temp.dataStart,bs.dataStart,bs.byteLength);
    temp = temp.reverse();
    for (let i=0;i<temp.byteLength;i++) {
      if (temp[i] != 0) {
        let end = temp.byteLength - i;
        if (bs[end-1] >= 0x80) {
          let res = new Uint8Array(end+1);
          memory.copy(res.dataStart,bs.dataStart,end);
          res[end] = 0;
          return res;
        } else {
          let res = new Uint8Array(end);
          memory.copy(res.dataStart,bs.dataStart,end);
          return res;
        }
        break;
      }
    }
    return new Uint8Array(0);
  }

  export function u64ToHexString(u:u64):string{
    let buffer:ArrayBuffer = new ArrayBuffer(8);
    let d:DataView = new DataView(buffer);
    d.setUint64(0,u,true);
    let res = '';
    for (let i=0;i<buffer.byteLength;i++) {
      res += u8ToHexString(d.getUint8(i));
    }
    return res;
  }
  export function bytesToString(bytes: Uint8Array): string {
    if (bytes == null) {
      return '';
    }
    return String.UTF8.decode(bytes.buffer, true)
  }
  
  export function UTF8Length(str: string, nullTerminated: boolean = false): usize {
    return String.UTF8.byteLength(str, nullTerminated);
  }
  
  export function toUTF8(str: string, nullTerminated: boolean = false): usize {
    return changetype<usize>(String.UTF8.encode(str, nullTerminated)) as usize;
  }

  export function uint8ArrayToBuffer(array: Uint8Array): ArrayBuffer {
    return array.slice(array.byteOffset, array.byteLength+array.byteOffset) as ArrayBuffer;
  }
  
  /**
  * Parses the given bytes array to return a value of the given generic type.
  * Supported types: bool, integer, string and data objects defined in model.ts.
  *
  * @param bytes Bytes to parse. Bytes must be not null.
  * @returns A parsed value of type T.
  */
  export function parseFromBytes<T>(bytes: Uint8Array): T {
    if (isString<T>() || isInteger<T>()) {
      return parseFromString<T>(bytesToString(bytes));
    } else {
      //@ts-ignore v will have decode. Although second parameter is optional it causes compile error
      return decode<T>(bytes);
    }
  }
  
    /**
    * Parses the given string to return a value of the given generic type.
    * Supported types: bool, integer, string and data objects defined in model.ts.
    *
    * @param s String to parse. Must be not null.
    * @returns A parsed value of type T.
    */
    export function parseFromString<T>(s: string): T {
      if (isString<T>()) {
        //@ts-ignore
        return s;
      } else if (isInteger<T>()) {
        if (isBoolean<T>()) {
          //@ts-ignore
          return <T>(s == "true");
        } else if (isSigned<T>()) {
          //@ts-ignore
          return <T>I64.parseInt(s);
        } else {
          //@ts-ignore
          return <T>U64.parseInt(s);
        }
      } else {
        //@ts-ignore v will have decode method
        return decode<T>(stringToArrayBuffer(s));
      }
    }
  }