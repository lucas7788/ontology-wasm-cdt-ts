import {runtime_api} from "./runtime_api";
import { util } from "./utils";
export namespace database {
    export function put(key:string, value:Uint8Array):void{
        runtime_api.storage_write(util.stringToUint8Array(key), value);
    }
    export function get(key:string):Uint8Array{
        return runtime_api.storage_read(util.stringToUint8Array(key))
    }
    export function del(key:string):void {
        runtime_api.storage_delete(util.stringToUint8Array(key));
    }
}