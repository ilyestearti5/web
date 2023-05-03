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
var _a, _Watch_value, _Watch_all, _Watch_name;
import { createElement as crt } from './utils.js';
export class Watch {
    constructor(name) {
        _Watch_value.set(this, '');
        this.nodes = new Set();
        _Watch_name.set(this, void 0);
        name = name.replaceAll(/ +/gi, '-');
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
        this.nodes.forEach(node => {
            node.innerHTML = v;
            node.setAttribute(`data-${__classPrivateFieldGet(this, _Watch_name, "f")}`, v);
        });
        __classPrivateFieldSet(this, _Watch_value, v, "f");
    }
    enables(...elements) {
        return elements.map(ele => this.enable(ele));
    }
    enable(element) {
        const node = crt('span', __classPrivateFieldGet(this, _Watch_value, "f"), {});
        node.setAttribute(`data-${__classPrivateFieldGet(this, _Watch_name, "f")}`, __classPrivateFieldGet(this, _Watch_value, "f"));
        element.appendChild(node);
        this.nodes.add(node);
        return node;
    }
    disable(element) {
        var node = Array.from(element.children).find(ele => ele.hasAttribute(`data-${__classPrivateFieldGet(this, _Watch_name, "f")}`));
        if (node) {
            this.nodes.delete(node);
            node.remove();
        }
        return node;
    }
    disables(...elements) {
        return elements.map(ele => this.disable(ele));
    }
    static get all() {
        return [...__classPrivateFieldGet(this, _a, "f", _Watch_all)];
    }
    static get(name) {
        return Watch.all.find(({ name: n }) => n == name) || null;
    }
    static get settings() {
        var o = Object.create(null);
        __classPrivateFieldGet(this, _a, "f", _Watch_all).forEach(a => {
            Object.defineProperty(o, __classPrivateFieldGet(a, _Watch_name, "f"), {
                get() {
                    return __classPrivateFieldGet(a, _Watch_value, "f");
                },
                set(v) {
                    a.value = v;
                },
                configurable: false,
                enumerable: true,
            });
        });
        return o;
    }
}
_a = Watch, _Watch_value = new WeakMap(), _Watch_name = new WeakMap();
_Watch_all = { value: [] };
