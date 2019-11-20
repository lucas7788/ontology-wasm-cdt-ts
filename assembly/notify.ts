import {Sink} from "./abi/sink";
import { util } from "./utils";
import { Address,H256 } from "./types";
import {u128} from "bignum";
import { runtime_api } from "./runtime_api";

const TYPE_BYTEARRAY: u8 = 0x00;
const TYPE_STRING: u8 = 0x01;
const TYPE_ADDRESS: u8 = 0x02;
const TYPE_BOOL: u8 = 0x03;
const TYPE_INT: u8 = 0x04;
const TYPE_H256: u8 = 0x05;

const TYPE_LIST: u8 = 0x10;

export class Notify {
    sink: Sink;
    numEntry: i32;
    constructor() {
        this.sink = new Sink();
        this.numEntry = 0;
        this.sink.write_bytes(util.stringToUint8Array('evt\0'));
        this.sink.write_byte(TYPE_LIST);
        this.sink.write_u32(this.numEntry as u32);
    }
    string(val:string):Notify {
        this.sink.write_byte(TYPE_STRING);
        this.sink.write_u32(val.length as u32);
        this.sink.write_bytes(util.stringToUint8Array(val));
        this.numEntry += 1;
        return this;
    }
    bytearray(bs:Uint8Array):Notify{
        this.sink.write_byte(TYPE_BYTEARRAY);
        this.sink.write_u32(bs.length as u32);
        this.sink.write_bytes(bs);
        this.numEntry += 1;
        return this;
    }
    address(addr:Address):Notify{
        this.sink.write_byte(TYPE_ADDRESS);
        this.sink.write_bytes(addr.value);
        this.numEntry += 1;
        return this;
    }
    number(amt:u128):Notify{
        this.sink.write_byte(TYPE_INT);
        this.sink.write_u128(amt);
        this.numEntry += 1;
        return this;
    }
    bool(b:bool):Notify{
        this.sink.write_byte(TYPE_BOOL);
        this.sink.write_bool(b);
        this.numEntry += 1;
        return this;
    }
    h256(hash:H256):Notify {
        this.sink.write_byte(TYPE_H256);
        this.sink.write_bytes(hash.value);
        this.numEntry += 1;
        return this;
    }
    notify():void{
        let val = this.sink.toUint8Array();
        let d = new DataView(val.buffer);
        d.setUint32(5,this.numEntry,true);
        runtime_api.notify(Uint8Array.wrap(d.buffer) as Uint8Array);
    }
}