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
import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { ListBox } from './listbox.js';
import { createElement, defaultObject, forEachAsync, isLooked } from './utils.js';
export class Iterations extends ListBox {
    constructor(root, title, propertys = [], defaultValues) {
        super(root, title);
        this.propertys = propertys;
        this.defaultValues = defaultValues;
        this.isloading = false;
        _Iterations_hiddenPropertys.set(this, []);
        this.histroy = [];
        this.creationFunction = (ele, input) => {
            this.propertys.forEach(prop => {
                var columnElement = createElement('div', `${input[prop]}`, {
                    'aria-labelby': prop,
                });
                columnElement.style.display = __classPrivateFieldGet(this, _Iterations_hiddenPropertys, "f").includes(prop) ? 'none' : '';
                ele.appendChild(columnElement);
            });
        };
        this.root.tabIndex = 1;
        this.searcherKey = this.propertys[0];
        this.shortcuts.clipboard = {
            copy: Sh.create(`${this.title} copy`, `ctrl${Sh.separatorShortcuts}c`, [this.root], 'key').ondown(async () => this.configurations.clipboard && (await this.copy())),
            paste: Sh.create(`${this.title} paste`, `ctrl${Sh.separatorShortcuts}v`, [this.root], 'key').ondown(async () => this.configurations.clipboard && (await this.paste(2, 5))),
            cut: Sh.create(`${this.title} cut`, `ctrl${Sh.separatorShortcuts}x`, [this.root], 'key').ondown(async () => this.configurations.clipboard && (await this.cut())),
        };
        this.shortcuts.find = {
            forword: Sh.create(`${this.title}:find forword`, 'all', [this.root], 'key').ondown(({ keys }) => {
                if (!keys)
                    return;
                var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
                if (!selecteddirection)
                    return;
                var next = selecteddirection.nextElementSibling;
                while (next) {
                    var content = `${this.readRow(next)[this.searcherKey]}`.charAt(0).toUpperCase();
                    if (this.getEffective(next) && keys.includes(content))
                        break;
                    next = next.nextElementSibling;
                }
                next && this.select(next);
                if (next) {
                    this.select();
                    if (this.configurations.scrolling && !isLooked(next))
                        this.scroll('forword');
                }
            }),
            backword: Sh.create(`${this.title}:find backword`, `shift${Sh.separatorShortcuts}all`, [this.root]).ondown(({ keys }) => {
                if (!keys)
                    return;
                var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
                if (!selecteddirection)
                    return;
                var prev = selecteddirection.previousElementSibling;
                while (prev) {
                    var content = `${this.readRow(prev)[this.searcherKey]}`.charAt(0).toUpperCase();
                    if (this.getEffective(prev) && keys.includes(content))
                        break;
                    prev = prev.previousElementSibling;
                }
                prev && this.select(prev);
                if (prev) {
                    this.select();
                    if (this.configurations.scrolling && !isLooked(prev))
                        this.scroll('backword');
                }
            }),
        };
    }
    items(element) {
        var contentElement = element.querySelector(`[role="content"]`);
        return !contentElement ? [] : this.propertys.map(prop => contentElement.querySelector(`[aria-labelby="${prop.toString()}"]`));
    }
    item(element, column) {
        var cols = this.items(element);
        var index = this.propertys.indexOf(column);
        return cols[index];
    }
    createRow(input) {
        input = defaultObject(input, this.defaultValues);
        var result = createElement('div', '', { role: this.rowname });
        var levelElement = createElement('div', '', { role: 'level' });
        result.appendChild(levelElement);
        var contentElement = createElement('div', '', { role: 'content' });
        this.creationFunction(contentElement, input);
        result.appendChild(contentElement);
        return result;
    }
    readRow(element) {
        var result = Object.create(null);
        result.row = element;
        if (!element)
            return result;
        var cols = this.items(element);
        this.propertys.forEach((prop, index) => {
            Object.defineProperty(result, prop, {
                get() {
                    var string = cols[index].innerHTML;
                    return isNaN(+string) ? ((string = string.trim()) === 'true' || string === 'false' ? (string == 'true' ? true : false) : string) : +string;
                },
                set(v) {
                    cols[index].innerHTML = `${v}`;
                },
                enumerable: false,
                configurable: true,
            });
        });
        return result;
    }
    setHiddenPropertys(...props) {
        __classPrivateFieldSet(this, _Iterations_hiddenPropertys, props, "f");
        this.ITEMS.forEach(element => {
            var cols = this.items(element);
            var indexs = __classPrivateFieldGet(this, _Iterations_hiddenPropertys, "f").map(prop => this.propertys.indexOf(prop));
            cols.forEach((col, index) => (col.style.display = indexs.includes(index) ? 'none' : ''));
        });
    }
    get ITEMS() {
        return super.ITEMS.filter(ele => ele.getAttribute('role') == this.rowname);
    }
    line() { }
    async copy() { }
    async cut() { }
    async paste(timeout, limit) {
        return [];
    }
    json(element) {
        var o = Object.create(null);
        var items = this.items(element);
        this.propertys.forEach((prop, index) => {
            var innerHTML = items[index].innerHTML;
            o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML);
        });
        return o;
    }
    static create(title, defaultValue) {
        var root = createElement('div', '', { role: 'iterations' });
        var iterable = new this(root, title, Object.keys(defaultValue), defaultValue);
        return iterable;
    }
    throwLoading() {
        if (this.isloading)
            throw Error('cannot be update the content is stay loading...');
    }
    setTargetShortcut(targets = null) {
        super.setTargetShortcut(targets);
        this.shortcuts.find.forword.targets = targets;
        this.shortcuts.find.backword.targets = targets;
        this.shortcuts.clipboard.copy.targets = targets;
        this.shortcuts.clipboard.cut.targets = targets;
        this.shortcuts.clipboard.paste.targets = targets;
    }
    filterSync(callback) {
        this.throwLoading();
        return this.ITEMS.filter(element => {
            var b = callback(this.readRow(element));
            this.setShow(element, b);
            return b;
        });
    }
    async filter(callback, timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        var result = [];
        await forEachAsync(this.ITEMS.map(ele => this.readRow(ele)), input => {
            var b = callback(input);
            if (b)
                result.push(input);
            this.setShow(input.row, b);
        }, timeout, limit);
        this.isloading = false;
        return result;
    }
}
_Iterations_hiddenPropertys = new WeakMap();
