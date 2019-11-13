import {Address} from "./types";
import {Sink} from "./abi/sink";
import { runtime_api } from "./runtime_api";
import { u128 } from "bignum";
import { util } from "./utils";
import { Source } from "./abi/source";
import { sin } from "bindings/Math";
export namespace wasm{
    export function call_wasm<T>(contract_addr:Address,params:Uint8Array):void {
        runtime_api.call_contract(contract_addr, params);
    }
}

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
        export function balanceOf():u128{

        }
    }

    function getOntAddress():Address {
        return util.hexToAddress('0100000000000000000000000000000000000000');
    }

    function getOngAddress():Address {
        return util.hexToAddress('0200000000000000000000000000000000000000');
    }

    function balanceOf_inner(contract_address:Address,addr:Address):u128 {
        let sink = new Sink();
        sink.write_native_address(contract_address);
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('balanceOf');
        sink_param.write_bytes(sink.toUint8Array().buffer);
        let res = runtime_api.call_contract(getOntAddress(),sink_param.toUint8Array());
        let source = new Source(res);
        return source.read_u128();
    }
    const VERSION: u8 = 0;
    function transfer_inner(contract_addr:Address,params:State[]):bool{
        let sink = new Sink();
        sink.write_native_varuint(params.length as u64);
        for (let i=0;i<params.length;i++) {
            sink.write_native_address(params[i].from);
            sink.write_native_address(params[i].to);
            let amt = util.u128ToUint8Array(params[i].amount);
            sink.write_bytes(amt.buffer);
        }
        let sink_param = new Sink();
        sink_param.write_byte(VERSION);
        sink_param.write_string('transfer');
        sink_param.write_bytes(sink.toUint8Array().buffer);
        let res = runtime_api.call_contract(contract_addr,sink_param.toUint8Array());
        let source = new Source(res.buffer);
        if (source.readBool()) {
            return true
        } else {
            return false;
        }
    }
}