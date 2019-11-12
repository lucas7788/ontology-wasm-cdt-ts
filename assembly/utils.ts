
export namespace util {
    
  const HEX :string[]= ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
  export function stringToArrayBuffer(s: string): ArrayBuffer {
    return String.UTF8.encode(s);
  }

  export function stringToUint8Array(s: string): Uint8Array {
    let buffer = String.UTF8.encode(s);
    return Uint8Array.wrap(buffer) as Uint8Array;
  }

  export function strToHexString(data: string): string {
    let bytes = stringToArrayBuffer(data);
    return bytesToHexString(bytes);
  }

  export function bytesToHexString(bytes:ArrayBuffer):string {
    if (bytes.byteLength == 0) {
      return '00';
    }
    let dataView:DataView = new DataView(bytes);
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
  export function bytesToString(bytes: ArrayBuffer): string {
    if (bytes == null) {
      return '';
    }
    return String.UTF8.decode(bytes, true)
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