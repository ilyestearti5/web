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
var _Structror_creationFunction;
import { Table } from "./index.js";
import { createElement, defaultObject } from "./utils.js";
export class Structror extends Table {
    constructor(root, title, propertys, defaultValues) {
        super(root, title, propertys, defaultValues);
        _Structror_creationFunction.set(this, undefined);
        this.rowname = "row";
    }
    createrow(input) {
        input = defaultObject(input, this.defaultValues);
        const element = createElement("div", "", { role: this.rowname });
        if (__classPrivateFieldGet(this, _Structror_creationFunction, "f")) {
            element.append(...__classPrivateFieldGet(this, _Structror_creationFunction, "f").call(this, (property) => {
                const span = createElement("span", `${input[property]}`, {
                    "aria-labelledby": property.toString(),
                });
                return span;
            }));
        }
        return element;
    }
    readrow(element) {
        var o = Object.create(null);
        o.row = element;
        this.propertys.forEach((prop) => {
            var readyelement = element.querySelector(`[aria-labelledby="${prop.toString()}"]`);
            Object.defineProperty(o, prop, {
                set(v) {
                    readyelement.innerHTML = `${v}`;
                },
                get() {
                    var content = readyelement.innerHTML;
                    return isNaN(+content) ? content : +content;
                },
                configurable: true,
                enumerable: false,
            });
        });
        return o;
    }
    setcreationfunction(creation) {
        __classPrivateFieldSet(this, _Structror_creationFunction, creation, "f");
    }
    static create(title, defaultValue) {
        return super.create(title, defaultValue);
    }
}
_Structror_creationFunction = new WeakMap();
