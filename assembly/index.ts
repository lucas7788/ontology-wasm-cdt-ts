import {runtime_api} from "./runtime_api";
import {Source} from "./abi/source";
import {Sink} from "./abi/sink";
import { util } from "./utils";
import {native} from "./contract";


export function invoke():void {
    let data = runtime_api.input();
    let reader = new Source(data.buffer);
    let method = reader.readString();
    let sink = new Sink();
    if (method == 'balanceOf') {
        let addr = reader.read_address();
        let res = native.ont.balanceOf(addr);
        
        sink.write_u128(res);
    } else if(method == 'transfer') {
        let from = reader.read_address();
        let to = reader.read_address();
        let amount = reader.read_u128();
        let res = native.ont.transfer(from,to,amount);
        sink.write_bool(res);
    } else if(method == 'approve') {
        let from = reader.read_address();
        let to = reader.read_address();
        let amount = reader.read_u128();
        let res = native.ont.approve(from,to,amount);
        sink.write_bool(res);
    } else if (method == 'allowance') {
        let from = reader.read_address();
        let to = reader.read_address();
        let res = native.ont.allowance(from,to);
        sink.write_u128(res);
    } else if (method == 'transferFrom'){
        let sender = reader.read_address();
        let from = reader.read_address();
        let to = reader.read_address();
        let amount = reader.read_u128();
        let res = native.ont.transfer_from(sender,from,to,amount);
        sink.write_bool(res);
    } else {
        sink.write_bool(false);
    }
    runtime_api.ret(sink.toUint8Array());
}
