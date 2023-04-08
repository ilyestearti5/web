var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Delay_counter, _Delay_is_loading;
export class Delay {
    constructor(timeout) {
        this.timeout = timeout;
        _Delay_counter.set(this, 0);
        _Delay_is_loading.set(this, false);
    }
    get isLoading() {
        return __classPrivateFieldGet(this, _Delay_is_loading, "f");
    }
    on() {
        this.off();
        __classPrivateFieldSet(this, _Delay_is_loading, true, "f");
        return new Promise((rs) => {
            __classPrivateFieldSet(this, _Delay_counter, setTimeout(() => {
                rs();
                this.off();
            }, this.timeout), "f");
        });
    }
    off() {
        if (__classPrivateFieldGet(this, _Delay_is_loading, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _Delay_counter, "f"));
            __classPrivateFieldSet(this, _Delay_is_loading, false, "f");
        }
    }
}
_Delay_counter = new WeakMap(), _Delay_is_loading = new WeakMap();
