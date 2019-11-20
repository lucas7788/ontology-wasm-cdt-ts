const DEFAULT_SIZE = 32;
import {util} from "../utils";
import {H256,Address} from "../types";
import {u128} from "bignum";
export class Sink {
    val: string;
    constructor(){
       this.val = '';
    }

    write_byte(params:u8):void {
        let buffer = new ArrayBuffer(1);
        let dataView = new DataView(buffer);
        dataView.setUint8(0,params);
        this.val += util.bytesToHexString(buffer);
    }

    write_bool(param:bool):void {
        if (param) {
            this.write_byte(1 as u8);
        } else {
            this.write_byte(0 as u8);
        }
    }

    write_bytes(params:Uint8Array) :void{
        this.val += util.bytesToHexString(params.buffer);
    }

    write_string(data:string):void {
        this.write_varuint(data.length);
        this.val += util.strToHexString(data);
    }
    write_u16(data:u16) :void{
        this.val += util.u16ToHexString(data);
    }
    write_u32(data:u32) :void{
        this.val += util.u32ToHexString(data);
    }
    
    write_u64(data:u64) :void {
        let buffer = new ArrayBuffer(8);
        let dv = new DataView(buffer);
        dv.setUint64(0,data,true);
        this.val += util.bytesToHexString(buffer);
    }

    write_varuint(data:u64):void {
        if (data < 0xfd) {
            this.write_byte(data as u8);
        } else if (data <0xffff) {
            this.write_byte(0xfd);
            this.write_u16(data as u16);
        } else if (data <= 0xffffffff) {
            this.write_byte(0xfe);
            this.write_u32(data as u32);
        } else {
            this.write_byte(0xff);
            this.write_u64(data);
        }
    }

    write_native_varuint(val:u64):void{
        this.write_byte(varuint_encode_size(val));
        this.write_varuint(val);
    }

    write_address(addr:Address) :void {
        this.val += util.bytesToHexString(addr.value.buffer);
    }

    write_native_address(addr:Address):void {
        this.write_byte(20);
        this.write_address(addr);
    }

    write_h256(hash:H256) :void {
        this.val += util.bytesToHexString(hash.value);
    }
    write_u128(data:u128):void {
        let buffer = data.toUint8Array();
        this.val += util.bytesToHexString(buffer.buffer);
    }

    toUint8Array():Uint8Array {
        let buffer = util.hexStringToArrayBuffer(this.val);
        return Uint8Array.wrap(buffer) as Uint8Array;
    }
    reset():void{
        this.val = '';
    }
}

function varuint_encode_size(val:u64):u8{
    if (val <0xfd){
        return 1;
    } else if (val <= 0xffff) {
        return 3;
    } else if (val <=0xffffffff) {
        return 5;
    } else {
        return 9;
    }
}