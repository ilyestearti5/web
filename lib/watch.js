var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Watch_value, _Watch_nodes, _Watch_all, _Watch_name;
import { createElement } from "./utils";
export class Watch {
    constructor(name) {
        _Watch_value.set(this, "");
        _Watch_nodes.set(this, new Set());
        _Watch_name.set(this, void 0);
        name = name.replaceAll(/ +/gi, "-");
        var finded = Watch.get(name);
        if (finded)
            throw Error(`Cannot be use same data watch "${finded.name}"`);
        __classPrivateFieldSet(this, _Watch_name, name, "f");
        __classPrivateFieldGet(Watch, _a, "f", _Watch_all).push(this);
    }
    get name() {
        return __classPrivateFieldGet(this, _Watch_name, "f");
    }
    get value() {
        return __classPrivateFieldGet(this, _Watch_value, "f");
    }
    set value(v) {
        __classPrivateFieldGet(this, _Watch_nodes, "f").forEach((node) => {
            node.innerHTML = v;
            node.setAttribute(`data-${__classPrivateFieldGet(this, _Watch_name, "f")}`, v);
        });
        __classPrivateFieldSet(this, _Watch_value, v, "f");
    }
    enable(element) {
        const node = createElement("span", __classPrivateFieldGet(this, _Watch_value, "f"), {});
        node.setAttribute(`data-${__classPrivateFieldGet(this, _Watch_name, "f")}`, __classPrivateFieldGet(this, _Watch_value, "f"));
        element.appendChild(node);
        __classPrivateFieldGet(this, _Watch_nodes, "f").add(node);
        return node;
    }
    disable(element) {
        var node = Array.from(element.children).find((ele) => ele.hasAttribute(`data-${__classPrivateFieldGet(this, _Watch_name, "f")}`));
        if (node) {
            __classPrivateFieldGet(this, _Watch_nodes, "f").delete(node);
            node.remove();
        }
        return node;
    }
    static get all() {
        return [...__classPrivateFieldGet(this, _a, "f", _Watch_all)];
    }
    static get(name) {
        return Watch.all.find(({ name: n }) => n == name) || null;
    }
}
_a = Watch, _Watch_value = new WeakMap(), _Watch_nodes = new WeakMap(), _Watch_name = new WeakMap();
_Watch_all = { value: [] };
