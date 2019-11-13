import {runtime_api} from "./runtime_api";
export namespace database {
    export function put(key:Uint8Array, value:Uint8Array):void{
        runtime_api.storage_write(key, value);
    }
    export function get(key:Uint8Array):Uint8Array{
        return runtime_api.storage_read(key)
    }
    export function del(key:Uint8Array):void {
        runtime_api.storage_delete(key);
    }
}