import {Sink} from "../abi/sink";
import {util} from "../utils";
import { Source } from "../abi/source";
import { H256, Address } from "../types";
import {u128} from "bignum";
import { Notify } from "../notify";


describe("sink",()=>{

  it("address test", () => {
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
    let h256 = new H256(h);
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
    sink.write_bytes(bs);
    expect<string>('03616263fe000000fe00fe01fe00000000000000fe000000000000000000000000000000000000000000000000000000000000000000000002fefe').toStrictEqual(sink.val);
    let buffer = util.hexToUint8Array(sink.val);
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
    expect<Uint8Array>(bs).toStrictEqual(source.readBytes(2));
  });
});
