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
var _Iterations_hiddenPropertys;
import { KeyboardShortcut } from "./keyboardshortcuts.js";
import { ListBox } from "./listbox.js";
import { createElement, defaultObject, isLooked } from "./utils";
export class Iterations extends ListBox {
    constructor(root, title, propertys = [], defaultValues) {
        super(root, title);
        this.propertys = propertys;
        this.defaultValues = defaultValues;
        this.isloading = false;
        _Iterations_hiddenPropertys.set(this, []);
        this.histroy = [];
        this.root.tabIndex = 1;
        this.searcherKey = this.propertys[0];
        this.shortcuts.clipboard = {
            copy: KeyboardShortcut.create(`${this.title} copy`, `Ctrl${KeyboardShortcut.separatorShortcuts}C`, [this.root]).ondown(async () => {
                this.configurations.clipboard && (await this.copy());
            }),
            paste: KeyboardShortcut.create(`${this.title} paste`, `Ctrl${KeyboardShortcut.separatorShortcuts}V`, [this.root]).ondown(async () => {
                this.configurations.clipboard && (await this.paste());
            }),
            cut: KeyboardShortcut.create(`${this.title} cut`, `Ctrl${KeyboardShortcut.separatorShortcuts}X`, [this.root]).ondown(async () => {
                this.configurations.clipboard && (await this.cut());
            }),
        };
        this.shortcuts.find = {
            forword: KeyboardShortcut.create(`${this.title} find - forword -`, `All`, [this.root]).ondown(({ Keys }) => {
                if (!Keys)
                    return;
                var ky = KeyboardShortcut.keyOf(Keys[0]);
                var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
                if (!selecteddirection)
                    return;
                var next = selecteddirection.nextElementSibling;
                while (next) {
                    if (this.getEffective(next) &&
                        `${this.readrow(next)[this.searcherKey]}`[0].toUpperCase() === ky)
                        break;
                    next = next.nextElementSibling;
                }
                next && this.select(next);
                next &&
                    this.configurations.scrolling &&
                    !isLooked(next) &&
                    this.scroll("forword");
            }),
            backword: KeyboardShortcut.create(`${this.title} find - backword - `, `Shift${KeyboardShortcut.separatorShortcuts}All`, [this.root]).ondown(({ Keys }) => {
                if (!Keys)
                    return;
                var ky = KeyboardShortcut.keyOf(Keys[0]);
                var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
                if (!selecteddirection)
                    return;
                var prev = selecteddirection.previousElementSibling;
                while (prev) {
                    if (this.getEffective(prev) &&
                        `${this.readrow(prev)[this.searcherKey]}`[0].toUpperCase() === ky)
                        break;
                    prev = prev.previousElementSibling;
                }
                prev && this.select(prev);
                prev &&
                    this.configurations.scrolling &&
                    !isLooked(prev) &&
                    this.scroll("backword");
            }),
        };
    }
    columns(element) {
        return Array.from(element.querySelectorAll(`[role="content"] > [role="column"]`));
    }
    column(element, column) {
        var cols = this.columns(element);
        var index = this.propertys.indexOf(column);
        return cols[index];
    }
    createrow(input) {
        input = defaultObject(input, this.defaultValues);
        var result = createElement("div", "", { role: this.rowname });
        var levelElement = createElement("div", "", { role: "level" });
        result.appendChild(levelElement);
        var contentElement = createElement("div", "", { role: "content" });
        this.propertys.forEach((prop, index) => {
            var columnElement = createElement("div", `${input[prop]}`, {
                role: "column",
            });
            columnElement.style.display = __classPrivateFieldGet(this, _Iterations_hiddenPropertys, "f").includes(prop)
                ? "none"
                : "";
            contentElement.appendChild(columnElement);
        });
        result.appendChild(contentElement);
        return result;
    }
    readrow(element) {
        var result = Object.create(null);
        result.row = element;
        var cols = this.columns(element);
        this.propertys.forEach((prop, index) => {
            Object.defineProperty(result, prop, {
                get() {
                    var string = cols[index].innerHTML;
                    return isNaN(+string) ? string : +string;
                },
                set(v) {
                    cols[index].innerHTML = v;
                },
                enumerable: false,
                configurable: true,
            });
        });
        return result;
    }
    sethiddenpropertys(...props) {
        __classPrivateFieldSet(this, _Iterations_hiddenPropertys, props, "f");
        this.ITEMS.forEach((element) => {
            var cols = this.columns(element);
            var indexs = __classPrivateFieldGet(this, _Iterations_hiddenPropertys, "f").map((prop) => this.propertys.indexOf(prop));
            cols.forEach((col, index) => (col.style.display = indexs.includes(index) ? "none" : ""));
        });
    }
    get ITEMS() {
        return super.ITEMS.filter((ele) => ele.role == this.rowname);
    }
    line() { }
    async copy() { }
    async cut() { }
    async paste() { }
    json(element) {
        var o = Object.create(null);
        var columns = this.columns(element);
        this.propertys.forEach((prop, index) => {
            var innerHTML = columns[index].innerHTML;
            o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML);
        });
        return o;
    }
    static create(title, defaultValue) {
        var root = createElement("div", "", { role: "iterations" });
        var iterable = new this(root, title, Object.keys(defaultValue), defaultValue);
        return iterable;
    }
    throwLoading() {
        if (this.isloading)
            throw Error("cannot be update the content is stay loading...");
    }
    settargetsshortcuts(targets = null) {
        super.settargetsshortcuts(targets);
        this.shortcuts.find.forword.targets = targets;
        this.shortcuts.find.backword.targets = targets;
        this.shortcuts.clipboard.copy.targets = targets;
        this.shortcuts.clipboard.cut.targets = targets;
        this.shortcuts.clipboard.paste.targets = targets;
    }
}
_Iterations_hiddenPropertys = new WeakMap();
