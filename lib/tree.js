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
var _Tree_instances, _Tree_propertys, _Tree_writable, _Tree_getBody, _Tree_bodyElement, _Tree_innerTreeElement, _Tree_inner, _Tree_to_query;
import { ListBox } from "./listbox";
import { createElement, defaultObject } from "./utils";
export class Tree extends ListBox {
    constructor(root, title, propertys, def) {
        super(root, title);
        this.def = def;
        _Tree_instances.add(this);
        _Tree_propertys.set(this, []);
        _Tree_writable.set(this, false);
        __classPrivateFieldSet(this, _Tree_propertys, propertys, "f");
        this.root.setAttribute("role", "tree");
    }
    get ITEMS() {
        return Array.from(this.root.querySelectorAll("[role=row]"));
    }
    createItem(info) {
        info = defaultObject(info, this.def);
        var result = createElement("div", "", { role: "tree-item" });
        var row = createElement("div", "", { role: "row" });
        __classPrivateFieldGet(this, _Tree_propertys, "f").forEach((prop) => {
            var span = createElement("span", `${info[prop]}`, { role: "col" });
            span.ondblclick = () => {
                if (!__classPrivateFieldGet(this, _Tree_writable, "f"))
                    return;
                span.contentEditable = "true";
                span.focus();
            };
            span.onblur = () => {
                if (!__classPrivateFieldGet(this, _Tree_writable, "f"))
                    return;
                span.contentEditable = "false";
            };
            row.appendChild(span);
        });
        var innerTree = createElement("div", "", { role: "tree" });
        result.appendChild(row);
        result.appendChild(innerTree);
        return result;
    }
}
_Tree_propertys = new WeakMap(), _Tree_writable = new WeakMap(), _Tree_instances = new WeakSet(), _Tree_getBody = function _Tree_getBody(element) {
    var fd = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_bodyElement).call(this, element);
    if (!fd)
        return null;
    var o = Object.create(null);
    o.row = fd;
    var columns = Array.from(fd.children).filter((ele) => ele.role == "col");
    __classPrivateFieldGet(this, _Tree_propertys, "f").forEach((prop, index) => {
        var ele = columns[index];
        Object.defineProperty(o, prop, {
            get() {
                return ele.textContent
                    ? isNaN(+ele.textContent)
                        ? ele.textContent
                        : +ele.textContent
                    : "";
            },
            set(value) {
                ele.innerHTML = `${value}`;
            },
            enumerable: true,
            configurable: false,
        });
    });
    return o;
}, _Tree_bodyElement = function _Tree_bodyElement(element) {
    var elements = Array.from(element.children);
    var fd = elements.find((ele) => ele.role == "row");
    return fd ? fd : null;
}, _Tree_innerTreeElement = function _Tree_innerTreeElement(element) {
    var elements = Array.from(element.children);
    var fd = elements.find((ele) => ele.role == "tree");
    return fd ? fd : null;
}, _Tree_inner = function _Tree_inner(element) {
    var innerTree = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_innerTreeElement).call(this, element);
    if (!innerTree)
        return [];
    var inner = Array.from(innerTree.children);
    return inner.map((ele) => __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getBody).call(this, ele));
}, _Tree_to_query = function _Tree_to_query(element) {
    var string = "";
    return string;
};
