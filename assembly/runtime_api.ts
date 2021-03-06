import {H256,Address} from "./types";
import { util } from "./utils";
import { Notify } from "./notify";
export declare namespace env{

    // #############
    // # Registers #
    // #############
    //@ts-ignore
    @external("env", "ontio_timestamp")
    export function ontio_timestamp(): u64;

    //@ts-ignore
    @external("env", "ontio_block_height")
    export function ontio_block_height(): u32;

    //@ts-ignore
    @external("env", "ontio_self_address")
    export function ontio_self_address(dst:u32): void;


    // #############
    // # Registers #
    // #############
    //@ts-ignore
    @external("env", "ontio_caller_address")
    export function ontio_caller_address(dst:u32): void;


    // #############
    // # Registers #
    // #############
    //@ts-ignore
    @external("env", "ontio_entry_address")
    export function ontio_entry_address(dst:u32): void;

    //@ts-ignore
    @external("env", "ontio_check_witness")
    export function ontio_check_witness(addr:u32): u32;

    //@ts-ignore
    @external("env", "ontio_get_input")
    export function ontio_get_input(dst_ptr: u32): void;

   //@ts-ignore
   @external("env", "ontio_input_length")
   export function ontio_input_length(): u32;

   //@ts-ignore
   @external("env", "ontio_return")
   export function ontio_return(ptr:u32, len:u32):void;


   //@ts-ignore
   @external("env", "ontio_panic")
   export function ontio_panic(ptr:u32, len:u32):void;


   //@ts-ignore
   @external("env", "ontio_notify")
   export function ontio_notify(ptr:u32, len:u32):void;


   //@ts-ignore
   @external("env", "ontio_call_contract")
   export function ontio_call_contract(addr:u32,input_ptr:u32, input_len:u32):i32;

    //@ts-ignore
    @external("env", "ontio_call_output_length")
    export function ontio_call_output_length(): u32;


    //@ts-ignore
    @external("env", "ontio_get_call_output")
    export function ontio_get_call_output(dst_ptr: u32): void;


    //@ts-ignore
    @external("env", "ontio_current_blockhash")
    export function ontio_current_blockhash(block_hash: u32): u32;


    //@ts-ignore
    @external("env", "ontio_current_txhash")
    export function ontio_current_txhash(block_hash: u32): u32;


    //@ts-ignore
    @external("env", "ontio_contract_migrate")
    export function ontio_contract_migrate(code: u32,code_len:u32,vm_type:u32,name_ptr:u32,
        name_len:u32,ver_ptr:u32,ver_len:u32,author_ptr:u32,author_len:u32,
        email_ptr:u32,email_len:u32,desc_ptr:u32,desc_len:u32,new_addr_ptr:u32): i32;

    //@ts-ignore
    @external("env", "ontio_storage_read")
    export function ontio_storage_read(key: u32,klen:u32,val:u32,vlen:u32,offset:u32): u32;

    //@ts-ignore
    @external("env", "ontio_storage_write")
    export function ontio_storage_write(key: u32,klen:u32,val:u32,vlen:u32): void;


    //@ts-ignore
    @external("env", "ontio_storage_delete")
    export function ontio_storage_delete(key: u32,klen:u32): void;

    //@ts-ignore
    @external("env", "ontio_sha256")
    export function ontio_sha256(data: u32,len:u32,val:u32): void;

    //@ts-ignore
    @external("env", "ontio_contract_create")
    export function ontio_contract_create(code_ptr: u32,code_len:u32,need_storage:u32,name_ptr:u32,
        name_len:u32,ver_ptr:u32,ver_len:u32,author_ptr:u32,author_len:u32,email_ptr:u32,email_len:u32,
        desc_ptr:u32,desc_len:u32,new_addr_ptr:u32): u32;

    //@ts-ignore
    @external("env", "ontio_contract_destroy")
    export function ontio_contract_destroy(): void;


    //@ts-ignore
    @external("env", "ontio_debug")
    export function ontio_debug(data:u32, len:u32): void;
}

export namespace runtime_api {
    export function storage_write(key:Uint8Array, val:Uint8Array):void {
        env.ontio_storage_write(key.dataStart as u32,key.length, val.dataStart as u32,val.length);
    }
    
    export function storage_delete(key:Uint8Array):void {
        env.ontio_storage_delete(key.dataStart as u32, key.length);
    }
    
    export function storage_read(key:Uint8Array):Uint8Array {
        const INITIAL: usize = 32;
        let val = new Uint8Array(INITIAL);
        let size = env.ontio_storage_read(key.dataStart as u32, key.byteLength,val.dataStart as u32,val.byteLength as u32, 0);
        if (size == u32.MAX_VALUE) {
            return new Uint8Array(0);
        }
        let size_val = size as usize;
        if (size_val > INITIAL) {
            let res = new Uint8Array(size_val-INITIAL);
            env.ontio_storage_read(key.dataStart as u32, key.length,res.dataStart as u32,res.length as u32, INITIAL as u32);
            return res;
        } else {
            let res = new Uint8Array(size_val);
            memory.copy(res.dataStart,val.dataStart,size_val);
            return res;
        }
    }
    /**
     * get current timestamp
     */
    export function timestamp():u64 {
        return env.ontio_timestamp();
    }
     /**
     * get current block height
     */
    export function block_height() :u32 {
        return env.ontio_block_height();
    }
     /**
     * get current contract address
     */
    export function address() :Address{
        let res = new Uint8Array(20);
        env.ontio_self_address(res.dataStart as u32);
        return new Address(res);
    }
    /**
     * get caller contract address
     */
    export function caller() :Address {
        let res = new Uint8Array(20);
        env.ontio_caller_address(res.dataStart as u32);
        return new Address(res);
    }
     /**
     * get entry contract address
     */
    export function entry_address():Address {
        let res = new Uint8Array(20);
        env.ontio_entry_address(res.dataStart as u32);
        return new Address(res);
    }
    /**
     * get current block hash
     */
    export function current_block_hash():H256 {
        let res = new Uint8Array(32);
        env.ontio_current_blockhash(res.dataStart as u32);
        return new H256(res);
    }
    /**
     * get current tx hash
     */
    export function current_tx_hash():H256 {
        let res = new Uint8Array(32);
        env.ontio_current_txhash(res.dataStart as u32);
        return new H256(res);
    }
     /**
     * sha256
     */
    export function sha256(data: Uint8Array) :H256 {
        let res = new Uint8Array(32);
        env.ontio_sha256(data.dataStart as u32, data.length, res.dataStart as u32);
        return new H256(res);
    }
    /**
     * check witness
     */
    export function check_witness(addr: Address) :bool {
        return env.ontio_check_witness(addr.value.dataStart as u32) == 1;
    }
    /**
     * get the function name and function args
     */
    export function input(): Uint8Array{
        const len = env.ontio_input_length();
        if (len == 0) {
            return new Uint8Array(0);
        } else {
            const data = new Uint8Array(len as i32);
            env.ontio_get_input(data.dataStart as u32);
            return data
        }
    }
     /**
     * contract return
     */
    export function ret(data: Uint8Array) :void {
        env.ontio_return(data.dataStart as u32, data.byteLength as u32);
    }
    
    export function notify(data:Uint8Array):void {
        env.ontio_notify(data.dataStart as u32, data.byteLength as u32);
    }
    
    export function panic(msg:Uint8Array):void {
        env.ontio_panic(msg.dataStart as u32,msg.byteLength);
    }

    export function debug(msg:string):void{
        let buffer = util.stringToArrayBuffer(msg);
        let u = Uint8Array.wrap(buffer) as Uint8Array;
        env.ontio_debug(u.dataStart, u.byteLength);
    }

    export function call_contract(addr: Address, input: Uint8Array):Uint8Array{
        let res = env.ontio_call_contract(addr.value.dataStart as u32,input.dataStart as u32,input.byteLength as u32);
        if (res < 0) {
            return new Uint8Array(0);
        }
        let size = env.ontio_call_output_length();
        let output = new Uint8Array(size);
        if (size != 0) {
            env.ontio_get_call_output(output.dataStart);
        }
        return output;
    }
    export function contract_create(code:Uint8Array,need_storage:u32,name: string, ver: string, author: string, email: string, desc: string) :Address {
        let array: Uint8Array = new Uint8Array(20);
        let nameU8Array = util.stringToUint8Array(name);
        let verU8Array = util.stringToUint8Array(ver);
        let authorU8Array = util.stringToUint8Array(author);
        let emailU8Array = util.stringToUint8Array(email);
        let descU8Array = util.stringToUint8Array(desc);
        env.ontio_contract_create(
            code.dataStart,
            code.byteLength as u32,
            need_storage,
            nameU8Array.dataStart,
            nameU8Array.byteLength as u32,
            verU8Array.dataStart,
            verU8Array.byteLength as u32,
            authorU8Array.dataStart,
            authorU8Array.byteLength as u32,
            emailU8Array.dataStart,
            emailU8Array.byteLength as u32,
            descU8Array.dataStart,
            descU8Array.byteOffset as u32,
            array.dataStart,
        );
        return new Address(array);
    }


    export function contract_migrate(code:Uint8Array,vmType:u32,name: string, ver: string, author: string, email: string, desc: string) :Address {
        let array: Uint8Array = new Uint8Array(20);
        let nameU8Array = util.stringToUint8Array(name);
        let verU8Array = util.stringToUint8Array(ver);
        let authorU8Array = util.stringToUint8Array(author);
        let emailU8Array = util.stringToUint8Array(email);
        let descU8Array = util.stringToUint8Array(desc);
        env.ontio_contract_migrate(
            code.dataStart,
            code.byteLength as u32,
            vmType,
            nameU8Array.dataStart,
            nameU8Array.byteLength as u32,
            verU8Array.dataStart,
            verU8Array.byteLength as u32,
            authorU8Array.dataStart,
            authorU8Array.byteLength as u32,
            emailU8Array.dataStart,
            emailU8Array.byteLength as u32,
            descU8Array.dataStart,
            descU8Array.byteOffset as u32,
            array.dataStart,
        );
        return new Address(array);
    }

    export function contract_destroy():void {
        env.ontio_contract_destroy();
    }
}

