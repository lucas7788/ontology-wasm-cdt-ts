import {Sink} from "../abi/sink";
import {util} from "../utils";
import { Source } from "../abi/source";
import { H256, Address } from "../types";
import {u128} from "bignum";
import { Notify } from "../notify";


describe("sink",()=>{

  it("address test", () => {
    // let addr = decodeBase58('AbtTQJYKfQxq4UdygDsbLVjE8uRrJ2H3tP');
    // log(addr);
    // let buffer = util.hexStringToArrayBuffer('dca1305cc8fc2b3d3127a2c4849b43301545d84e');
    // let addr = new Address(Uint8Array.wrap(buffer) as Uint8Array);
    // log(addr.to_base58());
    // //AbtTQJYKfQxq4UdygDsbLVjE8uRrJ2H3tP
    // let buffer2 = util.hexStringToArrayBuffer('4ed8451530439b84c4a227313d2bfcc85c30a1dc');
    // let addr2 = new Address(Uint8Array.wrap(buffer2) as Uint8Array);
    // log(addr2.to_base58());
    let sink = new Sink();
    let addr = util.hexToAddress('dca1305cc8fc2b3d3127a2c4849b43301545d84e');
    sink.write_native_address(addr);
    for (let i=0;i<100;i++){
      let res = util.u128ToNeoUint8Array(u128.fromI32(i));
      let u:u128 = util.u128FromNeoUint8Array(res);
      expect<u128>(u128.fromI32(i)).toStrictEqual(u);
    }
  });

  it("notify test", () => {
    let notify = new Notify();
    let addr = util.hexToAddress('dca1305cc8fc2b3d3127a2c4849b43301545d84e');
    let bs = new Uint8Array(2);
    bs[0] = 0;
    bs[1] = 1;
    let h = new Uint8Array(32);
    h[0] = 1;
    h[1] = 1;
    let h256 = new H256(h.buffer);
    notify.bool(true).string('test').address(addr).bytearray(bs).h256(h256).number(u128.fromI32(128)).notify();
  });

  it("sink soucre test", () => {
    let sink = new Sink();
    sink.write_string('abc');
    sink.write_u32(254 as u32);
    sink.write_u16(254 as u16);
    sink.write_byte(254 as u8);
    sink.write_bool(true);
    sink.write_u64(254);
    sink.write_u128(u128.fromI32(254));
    let addr = new Address(new Uint8Array(20));
    sink.write_address(addr);
    let bs = new Uint8Array(2);
    bs[0] = 254;
    bs[1] = 254;
    sink.write_varuint(bs.byteLength);
    sink.write_bytes(bs.buffer);
    expect<string>('03616263fe000000fe00fe01fe00000000000000fe000000000000000000000000000000000000000000000000000000000000000000000002fefe').toStrictEqual(sink.val);
    let buffer = util.hexStringToArrayBuffer(sink.val);
    let source = new Source(buffer);
    expect<string>('abc').toStrictEqual(source.readString());
    expect<u32>(254).toStrictEqual(source.readUint32());
    expect<u16>(254).toStrictEqual(source.readUint16());
    expect<u8>(254).toStrictEqual(source.readByte());
    expect<bool>(true).toStrictEqual(source.readBool());
    expect<u64>(254).toStrictEqual(source.readUint64());
    expect<u128>(u128.fromI32(254)).toStrictEqual(source.read_u128());
    expect<Uint8Array>(addr.value).toStrictEqual(source.read_address().value);
    expect<u64>(2).toStrictEqual(source.readVarUint());
    expect<ArrayBuffer>(bs.buffer).toStrictEqual(source.readBytes(2));
  });

  it("should be 1", () => {
    // log(util.strToHexString("abc"));
    // let buffer = new ArrayBuffer(4);
    // let d = new DataView(buffer);
    // d.setUint32(0,254,true);
    // log(buffer);
    // log(d.getUint32(0,true));
  });

  it("sink test", () => {

  });

// class Vec3 {
//   constructor(
//     public x: f64 = 0,
//     public y: f64 = 0,
//     public z: f64 = 0,
//   ) {}
// }
// describe("example", () => {
//   it("should be 42", () => {
//     expect<i32>(19 + 23).toBe(42, "19 + 23 is 42");
//   });

//   it("should be the same reference", () => {
//     let ref = new Vec3();
//     expect<Vec3>(ref).toBe(ref, "Reference Equality");
//   });

//   it("should perform a memory comparison", () => {
//     let a = new Vec3(1, 2, 3);
//     let b = new Vec3(1, 2, 3);

//     expect<Vec3>(a).toStrictEqual(b, "a and b have the same values, (discluding child references)");
//   });

//   it("should compare strings", () => {
//     expect<string>("a=" + "200").toBe("a=200", "both strings are equal");
//   });

//   it("should compare values", () => {
//     expect<i32>(10).toBeLessThan(200);
//     expect<i32>(1000).toBeGreaterThan(200);
//     expect<i32>(1000).toBeGreaterThanOrEqual(1000);
//     expect<i32>(1000).toBeLessThanOrEqual(1000);
//   });

//   it("can log some values to the console", () => {
//     log<string>("Hello world!"); // strings!
//     log<f64>(3.1415); // floats!
//     log<u8>(244); // integers!
//     log<u64>(0xFFFFFFFF); // long values!
//     log<ArrayBuffer>(new ArrayBuffer(50)); // bytes!
//   });
});
