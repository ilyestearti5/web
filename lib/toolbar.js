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
var _ToolBar_types;
import { ListBox } from "./listbox.js";
import { createElement } from "./utils.js";
export class ToolBar extends ListBox {
    constructor(title, ...types) {
        var root = createElement("ul", "", {});
        super(root, title);
        _ToolBar_types.set(this, []);
        __classPrivateFieldSet(this, _ToolBar_types, types, "f");
        this.root.setAttribute("role", "toolbar");
    }
    get types() {
        return __classPrivateFieldGet(this, _ToolBar_types, "f");
    }
    findTip(label) {
        var element = this.ITEMS.find((content) => content.ariaLabel == label);
        return element
            ? {
                label,
                click: element.onclick,
                element: element,
                iconElement: element.querySelector("i"),
            }
            : null;
    }
    addTip(label, click) {
        var fdTip = this.findTip(label);
        if (fdTip)
            throw Error(`The Label ${label.toString()} is defined`);
        var element = createElement("li", `<i></i>`, {
            "aria-label": label,
        });
        this.root.appendChild(element);
        element.onclick = click;
    }
    removeTip(label) {
        var _a;
        (_a = this.findTip(label)) === null || _a === void 0 ? void 0 : _a.element.remove();
    }
    exec(label) {
        var find = this.findTip(label);
        if (!find)
            return;
        find.element.click();
    }
}
_ToolBar_types = new WeakMap();
