import {runtime_api} from "../runtime_api";
import {Source} from "../abi/source";
import {Sink} from "../abi/sink";
import {database} from "../database";
import { util } from "../utils";

export function invoke():void {
    let data = runtime_api.input();
    let reader = new Source(data);
    let method = reader.readString();
    let sink = new Sink();
    if (method == 'put') {
        let key = reader.readString();
        let value = reader.readString();
        let valueBuffer = util.stringToArrayBuffer(value);
        let val = Uint8Array.wrap(valueBuffer) as Uint8Array;
        database.put(key,val);
        sink.write_bool(true);
    } else if(method == 'get') {
        let key = reader.readString();
        let res = database.get(key);
        sink.write_bytes(res);
    } else if(method == 'del') {
        let key = reader.readString();
        let keyBuffer = util.stringToArrayBuffer(key);
        database.del(key);
        sink.write_bool(true);
    } else if (method == 'contractDelete') {
        runtime_api.contract_destroy();
        sink.write_bool(true);
    } else {
        sink.write_bool(false);
    }
    runtime_api.ret(sink.toUint8Array());
}
