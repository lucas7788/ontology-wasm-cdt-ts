import {Address} from "./types";
import {Sink} from "./abi/sink";
import { runtime_api } from "./runtime_api";
import { u128 } from "bignum";
import { util } from "./utils";
import { Source } from "./abi/source";

export namespace native{
    export class State{
        from:Address;
        to:Address;
        amount:u128;
        constructor(from:Address,to:Address,amount:u128){
            this.from = from;
            this.to = to;
            this.amount = amount;
        }
    }
    export namespace ont {
        export function transfer(from:Address,to:Address,amount:u128):bool {
            let s = new State(from, to, amount);
            return transfer_inner(getOntAddress(), [s]);
        }
        export function transferMulti(states:State[]):bool {
            return transfer_inner(getOntAddress(),states);
        }
        export function balanceOf(addr:Address):u128{
            return balanceOf_inner(getOntAddress(), addr);
        }
        export function approve(from: Address, to: Address, amount: u128):bool {
            return approve_inner(getOntAddress(), from, to, amount);
        }
        export function allowance(from: Address, to: Address):u128{
            return allowance_inner(getOntAddress(), from,to);
        }
        export function transfer_from(sender: Address, from: Address, to: Address, amount: u128):bool {
            return transfer_from_inner(getOntAddress(),sender,from,to,amount);
        }
    }

    export namespace ong {
        export function transfer(from:Address,to:Address,amount:u128):bool {
            let s = new State(from, to, amount);
            return transfer_inner(getOngAddress(), [s]);
        }
        export function transferMulti(states:State[]):bool {
            return transfer_inner(getOngAddress(),states);
        }
        export function balanceOf(addr:Address):u128{
            return balanceOf_inner(getOngAddress(), addr);
        }
        export function approve(from: Address, to: Address, amount: u128):bool {
            return approve_inner(getOngAddress(), from, to, amount);
        }
        export function allowance(from: Address, to: Address):u128{
            return allowance_inner(getOngAddress(), from,to);
        }
        export function transfer_from(sender: Address, from: Address, to: Address, amount: u128):bool {
            return transfer_from_inner(getOngAddress(),sender,from,to,amount);
        }
    }

    function getOntAddress():Address {
        return util.hexToAddress('0000000000000000000000000000000000000001');
    }

    function getOngAddress():Address {
        return util.hexToAddress('0000000000000000000000000000000000000002');
    }

    function transfer_from_inner(contract_addr:Address,sender: Address, from: Address, to: Address, amount: u128):bool {
        let sink = new Sink();
        sink.write_native_address(sender);
        sink.write_native_address(from);
        sink.write_native_address(to);
        let amt = util.u128ToNeoUint8Array(amount);
        sink.write_varuint(amt.byteLength);
        sink.write_bytes(amt.buffer);
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('transferFrom');
        let temp = sink.toUint8Array();
        sink_param.write_varuint(temp.byteLength as u64);
        sink_param.write_bytes(temp.buffer);
        let res = runtime_api.call_contract(contract_addr, sink_param.toUint8Array());
        let source = new Source(res.buffer);
        return source.readBool();
    }
    function allowance_inner(contract_addr:Address,from: Address, to: Address):u128{
        let sink = new Sink();
        sink.write_native_address(from);
        sink.write_native_address(to);
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('allowance');
        let temp = sink.toUint8Array();
        sink_param.write_varuint(temp.byteLength as u64);
        sink_param.write_bytes(temp.buffer);
        let res = runtime_api.call_contract(contract_addr,sink_param.toUint8Array());
        return util.u128FromNeoUint8Array(res);
    }
    function approve_inner(contract_addr:Address,from: Address, to: Address, amount: u128):bool{
        let sink = new Sink();
        sink.write_native_address(from);
        sink.write_native_address(to);
        let amt = util.u128ToNeoUint8Array(amount);
        sink.write_varuint(amt.byteLength);
        sink.write_bytes(amt.buffer);
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('approve');
        let temp = sink.toUint8Array();
        sink_param.write_varuint(temp.byteLength as u64);
        sink_param.write_bytes(temp.buffer);
        let res = runtime_api.call_contract(contract_addr, sink_param.toUint8Array());
        let source = new Source(res.buffer);
        return source.readBool();
    }
    function balanceOf_inner(contract_addr:Address,addr:Address):u128 {
        let sink = new Sink();
        sink.write_native_address(addr);
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('balanceOf');
        let temp = sink.toUint8Array();
        sink_param.write_varuint(temp.byteLength as u64);
        sink_param.write_bytes(temp.buffer);
        let res = runtime_api.call_contract(contract_addr,sink_param.toUint8Array());
        return util.u128FromNeoUint8Array(res);
    }
    const VERSION: u8 = 0;
    function transfer_inner(contract_addr:Address,params:State[]):bool{
        let sink = new Sink();
        sink.write_native_varuint(params.length as u64);
        for (let i=0;i<params.length;i++) {
            sink.write_native_address(params[i].from);
            sink.write_native_address(params[i].to);
            let amt = util.u128ToNeoUint8Array(params[i].amount);
            sink.write_varuint(amt.byteLength as u64);
            sink.write_bytes(amt.buffer);
        }
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('transfer');
        let temp = sink.toUint8Array();
        sink_param.write_varuint(temp.byteLength as u64);
        sink_param.write_bytes(temp.buffer);
        let res = runtime_api.call_contract(contract_addr,sink_param.toUint8Array());
        let source = new Source(res.buffer);
        if (source.readBool()) {
            return true
        } else {
            return false;
        }
    }
}