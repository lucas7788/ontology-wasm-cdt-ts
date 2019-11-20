import {runtime_api} from "../runtime_api";
import {Source} from "../abi/source";
import {Sink} from "../abi/sink";
import { util } from "../utils";


export function invoke():void {
    const contract_hash = 'eb1e6f5b115bb8d0cc88ea4a4c8a3a5ee1f8fda6';
    var addr = util.hexToAddress(contract_hash);
    let data = runtime_api.input();
    let reader = new Source(data);
    let method = reader.readString();
    let sink = new Sink();
    if (method == 'put') {
        let key = reader.readString();
        let value = reader.readString();
        let sink_temp = new Sink();
        sink_temp.write_string('put');
        sink_temp.write_string(key);
        sink_temp.write_string(value);
        let res = runtime_api.call_contract(addr, sink_temp.toUint8Array());
        let source_temp = new Source(res);
        let r = source_temp.readBool();
        if (r) {
            sink.write_bool(true);
        } else {
            sink.write_bool(false);
        }
    } else if(method == 'get') {
        let key = reader.readString();
        let sink_temp = new Sink();
        sink_temp.write_string('get');
        sink_temp.write_string(key);
        let res = runtime_api.call_contract(addr,sink_temp.toUint8Array());
        sink.write_bytes(res);
    } else if(method == 'del') {
        let key = reader.readString();
        let sink_temp = new Sink();
        sink_temp.write_string('del');
        sink_temp.write_string(key);
        let res = runtime_api.call_contract(addr,sink_temp.toUint8Array());
        let source_temp = new Source(res);
        let r = source_temp.readBool();
        if (r) {
            sink.write_bool(true);
        } else {
            sink.write_bool(false);
        }
    } else if (method == 'contractDelete') {
        let sink_temp = new Sink();
        sink_temp.write_string('contractDelete');
        let res = runtime_api.call_contract(addr,sink_temp.toUint8Array());
        let source_temp = new Source(res);
        let r = source_temp.readBool();
        if (r) {
            sink.write_bool(true);
        } else {
            sink.write_bool(false);
        }
    } else {
        sink.write_bool(false);
    }
    runtime_api.ret(sink.toUint8Array());
}
