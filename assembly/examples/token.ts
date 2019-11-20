import {runtime_api} from "../runtime_api";
import {Source} from "../abi/source";
import {Sink} from "../abi/sink";
import {database} from "../database";
import {u128} from 'bignum';
import { util } from "../utils";
import {Address} from '../types';
import { Notify } from "../notify";

const KEY_TOTAL_SUPPLY = 'total_supply';
const NAME = "wasm_token";
const SYMBOL = "WTK";
const TOTAL_SUPPLY = 100000000000;
const DECIMALS = 1;

const BALANCE_PREFIX = "01";
const APPROVE_PREFIX = "02";

const ADMIN = 'dca1305cc8fc2b3d3127a2c4849b43301545d84e';

function init():bool {
    let u = database.get(KEY_TOTAL_SUPPLY);
    if(u.byteLength != 0){
        return false;
    }
    let sink = new Sink();
    sink.write_u128(u128.fromU64(TOTAL_SUPPLY))
    database.put(KEY_TOTAL_SUPPLY,sink.toUint8Array());
    database.put(get_balance_key(util.hexToAddress(ADMIN)), sink.toUint8Array());
    let notify = new Notify();
    let addr = util.hexToAddress(ADMIN);
    notify.address(addr).bytearray(addr.value).notify();
    return true;
}

function balanceOf(addr:Address):u128{
    let res = database.get(get_balance_key(addr));
    if (res.byteLength == 0){
        return u128.fromU32(0);
    }
    let source = new Source(res);
    return source.read_u128();
}

function transfer(from:Address,to:Address,amount:u128):bool {
    if (runtime_api.check_witness(from)==false){
        (new Notify()).string('99999999').notify();
        return false;
    }
    let from_val = balanceOf(from);
    let to_val = balanceOf(to);
    
    if(u128.cmp(amount, u128.Zero) <0 || u128.cmp(from_val, amount) < 0){
        return false;
    }
    let key_from = get_balance_key(from);
    let key_to = get_balance_key(to);
    let sink = new Sink();
    sink.write_u128(u128.sub(from_val,amount));
    database.put(key_from,sink.toUint8Array());
    sink.reset();
    sink.write_u128(u128.add(to_val,amount));
    database.put(key_to,sink.toUint8Array());
    let notify = new Notify();
    notify.string('transfer').address(from).address(to).number(amount).notify();
    return true;
}

function approve(owner:Address, spender:Address, amount:u128):bool {
    if(runtime_api.check_witness(owner) == false){
        return false;
    }
    if (u128.cmp(amount,u128.Zero) < 0 || u128.cmp(amount, balanceOf(owner))>0) {
        return false;
    }
    let key = get_approve_key(owner, spender);
    let sink = new Sink();
    sink.write_u128(amount);
    database.put(key, sink.toUint8Array());
    let notify = new Notify();
    notify.string('approve').address(owner).address(spender).number(amount).notify();
    return true;
}
function allowance(owner:Address, spender:Address):u128{
    let key = get_approve_key(owner, spender);
    let res = database.get(key);
    let source = new Source(res);
    return source.read_u128();
}
function transfer_from(spender:Address,owner:Address,to:Address,amount:u128):bool {
    if(!runtime_api.check_witness(spender)){
        return false;
    }
    let owner_bal = balanceOf(owner);
    if(u128.cmp(amount, u128.Zero) <0||u128.cmp(owner_bal, amount) < 0){
        return false;
    }
    let approve_key = get_approve_key(owner, spender);
    let approve_amount_bs = database.get(approve_key);
    let source = new Source(approve_amount_bs);
    let approve_amount = source.read_u128();
    if (u128.cmp(amount, approve_amount) > 0) {
        return false;
    }
    let owner_key = get_balance_key(owner);
    let sink = new Sink();
    if (u128.cmp(amount, approve_amount) == 0) {
        database.del(approve_key);
        let res = u128.sub(owner_bal, amount);
        sink.write_u128(res);
        database.put(owner_key, sink.toUint8Array());
    } else {
        sink.write_u128(u128.sub(approve_amount, amount));
        database.put(approve_key, sink.toUint8Array());
        sink.reset();
        sink.write_u128(u128.sub(owner_bal, amount));
        database.put(owner_key, sink.toUint8Array());
    }
    let to_key = get_balance_key(to);
    let to_bal = balanceOf(to);
    sink.reset();
    sink.write_u128(u128.add(to_bal, amount));
    database.put(to_key, sink.toUint8Array());
    return true;
}

export function invoke():void {
    let data = runtime_api.input();
    let reader = new Source(data);
    let method = reader.readString();
    let sink = new Sink();
    if (method == 'init') {
        sink.write_bool(init());
    } else if (method == 'name') {
        sink.write_bytes(util.stringToUint8Array(NAME));
        runtime_api.ret(sink.toUint8Array());
        return;
    } else if(method == 'decimals') {
        sink.write_u128(u128.fromI32(DECIMALS));
        runtime_api.ret(sink.toUint8Array());
        return;
    } else if(method == 'symbol'){
        sink.write_bytes(util.stringToUint8Array(SYMBOL));
        runtime_api.ret(sink.toUint8Array());
        return;
    } else if(method == 'totalSupply') {
        sink.write_u128(u128.fromU64(TOTAL_SUPPLY));
        runtime_api.ret(sink.toUint8Array());
        return;
    } else if (method == 'balanceOf') {
        let addr = reader.read_address();
        let ba = balanceOf(addr);
        sink.write_u128(ba);
    } else if(method=='transfer') {
        let from = reader.read_address();
        let to = reader.read_address();
        let amt = reader.read_u128();
        (new Notify()).address(from).address(to).number(amt).notify();
        sink.write_bool(transfer(from,to,amt));
    } else if (method == 'approve') {
        let from = reader.read_address();
        let to = reader.read_address();
        let amt = reader.read_u128();
        sink.write_bool(approve(from,to,amt));
    } else if(method == 'allowance') {
        let owner = reader.read_address();
        let spender = reader.read_address();
        sink.write_u128(allowance(owner,spender));
    } else if (method == 'transfer_from'){
        let spender = reader.read_address();
        let owner = reader.read_address();
        let to = reader.read_address();
        let amt = reader.read_u128();
        sink.write_bool(transfer_from(spender,owner,to,amt));
    } else {
        sink.write_bool(false);
    }
    runtime_api.ret(sink.toUint8Array());
}

function get_balance_key(addr:Address):string{
    return BALANCE_PREFIX+util.bytesToHexString(addr.value.buffer);
}

function get_approve_key(owner:Address, spender:Address):string {
    return APPROVE_PREFIX+util.bytesToHexString(owner.value.buffer)+util.bytesToHexString(spender.value.buffer);
}