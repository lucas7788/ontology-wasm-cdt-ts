import {runtime_api} from "./runtime_api";
import {Source} from "./abi/source";
import {Sink} from "./abi/sink";

export function invoke():void {
    let data = runtime_api.input();
    let reader = new Source(data.buffer);
    let method = reader.readString();
    let sink = new Sink();
    if (method == "timestamp") {
        let res = runtime_api.timestamp();
        sink.write_u64(res);
    } else if(method == 'block_height') {
        let h = runtime_api.block_height();
        sink.write_u32(h);
    } else if(method == 'caller') {
        let addr = runtime_api.caller();
        sink.write_address(addr);
    } else if (method == 'current_block_hash') {
        let hash = runtime_api.current_block_hash();
        sink.write_h256(hash);
    } else if (method == 'current_tx_hash') {
        let hash = runtime_api.current_tx_hash();
        sink.write_h256(hash);
    } else if (method == 'current_tx_hash') {
        let addr = runtime_api.entry_address();
        sink.write_address(addr);
    } else {
        sink.write_string('unreach');
    }
    runtime_api.ret(sink.toUint8Array());
}
