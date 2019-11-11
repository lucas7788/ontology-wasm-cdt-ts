const DEFAULT_SIZE = 32;
import {util} from "../utils";
import { Address } from "../address";
import {H256} from "../types";
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

    write_bytes(params:ArrayBuffer) :void{
        this.val += util.bytesToHexString(params);
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

    write_address(addr:Address) :void {
        this.val += util.bytesToHexString(addr.value.buffer);
    }

    write_h256(hash:H256) :void {
        this.val += util.bytesToHexString(hash.value.buffer);
    }

    toUint8Array():Uint8Array {
        let buffer = util.hexStringToArrayBuffer(this.val);
        return Uint8Array.wrap(buffer,0,buffer.byteLength) as Uint8Array;
    }
}
