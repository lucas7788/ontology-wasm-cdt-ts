import {Sink} from "../abi/sink";
import {util} from "../utils";
import { Source } from "../abi/source";
import { H256 } from "../types";


describe("sink",()=>{
  it("should be 1", () => {
    // let sink = new Sink();
    // sink.write_u32(254 as u32);
    // expect<string>(sink.val).toBe("fe000000", "both strings are equal");
    // log<string>(sink.val); // strings!
    // let u = util.hexStringToArrayBuffer(sink.val);
    // log(u);
    // let d = new DataView(u);
    // log(d.getUint32(0, true));
  });

  it("should be 1 source", () => {
    // let sink = new Sink();
    // sink.write_string('abc');
    // log('abc:'+util.strToHexString('abc'));
    // sink.write_u32(254);
    // sink.write_u16(15);
    // sink.write_byte(15);
    // log(sink.toUint8Array());
    // let buffer = util.hexStringToArrayBuffer(sink.val);
    // let source = new Source(buffer);
    // log('res:'+source.readString());
    // log(source.readUint32());
    // log(source.readUint16());
    // log(source.readByte());

    // let buffer = util.hexStringToArrayBuffer('02c8365b00000000');
    // let source = new Source(buffer);
    // log(source.readUint64());

    let buffer2 = util.hexStringToArrayBuffer('5ba8bac907e1172b55fccaf454f2d3e28dfb681ee3c7ae0e38f999914007da34');
    log(buffer2);
    let sink = new Sink();
    let hash:H256 = new H256(buffer2);
    log(hash.value);
    sink.write_h256(hash);
    log(sink.val);
    log(sink.toUint8Array()); 
    let source2 = new Source(util.hexStringToArrayBuffer(sink.val));
    log(util.bytesToHexString(source2.read_h256().value))
  });

  it("should be 1", () => {
    // log(util.strToHexString("abc"));
    // let buffer = new ArrayBuffer(4);
    // let d = new DataView(buffer);
    // d.setUint32(0,254,true);
    // log(buffer);
    // log(d.getUint32(0,true));
  });

  // it("should be 2", () => {
  //   let buffer = new Uint8Array(4);
  //   let da = new DataView(buffer as ArrayBuffer);
  //   da.setUint32(0, 10 as u32, true);
  //   log<ArrayBuffer>(buffer as ArrayBuffer); // bytes!

  //   let a = buffer.slice(buffer.byteOffset, buffer.byteOffset+buffer.byteLength);
  //   log<string>("data:"+String.UTF8.decode(a as ArrayBuffer, true)); // strings!
  //   log<string>(util.bytesToString(buffer)); // strings!
  // });
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
// });
