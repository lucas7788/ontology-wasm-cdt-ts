import { util } from "../utils";
import { Address } from "../address";
import {H256} from "../types";
export class Source {
    dataView: DataView;
    pos: i32;
    size: i32;
    constructor(buffer: ArrayBuffer){
        this.dataView = new DataView(buffer);
        this.pos = 0;
        this.size = buffer.byteLength;
    }

    /**
     * Checks if reached the end of the string.
     */
    isEmpty():bool {
        return this.pos >= this.size-1;
    }

    /**
     * Reads some bytes.
     * @param {number} bytes - Number of bytes to read
     */
    readBytes(bytes: u64):ArrayBuffer{
        if (this.isEmpty()) {
            throw new Error('StringReader reached the end.');
        }
        let res = this.dataView.buffer.slice(this.pos,this.pos+bytes as i32)
        this.pos += bytes as i32;
        return res;
    }

    unreadBytes(bytes: u64) :void{
        if ((this.pos + bytes) >= this.size) {
            throw new Error('Can not unread too many bytes.');
        }
        this.pos -= bytes;
        return;
    }


    readByte():u8 {
        return this.readUint8();
    }

    /**
     * First, read one byte as the length of bytes to read. Then read the following bytes.
     */
    readVarBytes():ArrayBuffer {
        let bytesToRead = this.readVarUint();
        if (bytesToRead === 0) {
            return new ArrayBuffer(0);
        }
        return this.readBytes(bytesToRead);
    }

    /**
     * Reads one byte as int, which may indicates the length of following bytes to read.
     * @returns {number}
     */
    readVarUint():u64 {
        let len = this.readByte();
        let res: u64  = 0;
        if (len === 0xfd) {
            let temp = this.readUint16();
            res = u64(temp);
        } else if (len === 0xfe) {
            let temp = this.readUint32();
            res = u64(temp);
        } else if (len === 0xff) {
            let temp = this.readUint64();
            res = u64(temp);
        } else {
            res = len;
        }
        return res as u64;
    }

    /**
     * Read Uint8
     */
    readUint8():u8 {
        let res = this.dataView.getUint8(this.pos);
        this.pos += 1;
        return res;
    }

    /**
     * read 2 bytes as uint16 in littleEndian
     */
    readUint16():u16 {
        let res = this.dataView.getUint16(this.pos,true);
        this.pos += 2;
        return res;
    }

    /**
     * Read 4 bytes as uint32 in littleEndian
     */
    readUint32():u32 {
        let res = this.dataView.getUint32(this.pos,true);
        this.pos += 4;
        return res;
    }

    /**
     * Read 8 bytes as uint64 in littleEndian
     */
    readUint64() :u64{
        let res = this.dataView.getUint64(this.pos,true);
        this.pos += 8;
        return res;
    }

    readBoolean():bool{
        return this.readUint8() !== 0;
    }

    readString():string {
        let buffer = this.readVarBytes();
        return util.bytesToString(buffer);
    }

    read_address() :Address {
        let buffer = this.readBytes(20);
        return new Address(Uint8Array.wrap(buffer) as Uint8Array);
    }

    read_h256() :H256 {
        let buffer = this.readBytes(32);
        return new H256(Uint8Array.wrap(buffer) as Uint8Array);
    }
}