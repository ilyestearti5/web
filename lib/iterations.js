import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { ListBox } from './listbox.js';
import { createElement as crt, defaultObject as defO, forEachAsync as each, isLooked as like } from './utils.js';
export class Iterations extends ListBox {
    constructor(root, title, propertys = [], defaultValues) {
        super(root, title);
        this.propertys = propertys;
        this.defaultValues = defaultValues;
        this.isloading = false;
        this.hiddenPropertys = [];
        this.histroy = [];
        this.readSetFn = (c, p, v) => {
            c.innerHTML = v;
        };
        this.readGetFn = (c, p) => {
            var string = c.innerText;
            return isNaN(+string) ? ((string = string.trim()) === 'true' || string === 'false' ? (string == 'true' ? true : false) : string) : +string;
        };
        this.creationFunction = (input, c) => {
            return this.propertys.map(prop => {
                var columnElement = c(prop);
                columnElement.style.display = this.hiddenPropertys.includes(prop) ? 'none' : '';
                return columnElement;
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
                    if (this.configurations.scrolling && !like(next))
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
                    if (this.configurations.scrolling && !like(prev))
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
        input = defO(input, this.defaultValues);
        var result = crt('div', '', { role: this.rowname });
        if (this.drag)
            result.draggable = true;
        var levelElement = crt('div', '', {
            role: 'level',
            style: 'position: relative; height: 100%',
        });
        result.appendChild(levelElement);
        var contentElement = crt('div', '', { role: 'content' });
        var array = this.creationFunction(input, type => {
            var ele = crt('span', `${typeof input[type] == 'function' ? input[type](input) : input[type]}`, { 'aria-labelby': type.toString() });
            if (this.hiddenPropertys.includes(type))
                ele.style.display = 'none';
            return ele;
        }, result, contentElement);
        contentElement.append(...array);
        result.appendChild(contentElement);
        var rd = this.readRow(result);
        this.propertys.forEach(s => (rd[s] = rd[s]));
        return result;
    }
    readRow(element) {
        var result = Object.create(null);
        result.row = element;
        if (!element)
            return result;
        var cols = this.items(element);
        var array = [];
        for (let Prop in this.defaultValues)
            typeof this.defaultValues[Prop] == 'function' && array.push(this.defaultValues[Prop]);
        var fn1 = this.readGetFn;
        var fn2 = this.readSetFn;
        this.propertys.forEach((prop, index) => {
            Object.defineProperty(result, prop, {
                get() {
                    return fn1(cols[index], prop);
                },
                set(v) {
                    fn2(cols[index], prop, `${v}`);
                    array.forEach(fn => fn(result));
                },
                enumerable: false,
                configurable: true,
            });
        });
        return result;
    }
    setHiddenPropertys(...props) {
        this.hiddenPropertys = props;
        this.ITEMS.forEach(element => {
            var cols = this.items(element);
            var indexs = this.hiddenPropertys.map(prop => this.propertys.indexOf(prop));
            cols.forEach((col, index) => (col.style.display = indexs.includes(index) ? 'none' : ''));
        });
        return this;
    }
    get ITEMS() {
        return super.ITEMS.filter(ele => ele.getAttribute('role') == this.rowname);
    }
    addLine(element = this.ITEMS.at(-1), num = 1) {
        var array = [];
        if (element) {
            for (let i = 0; i < num; i++) {
                var line = crt('div', '', { role: 'line' });
                array.push(line);
                element.after(line);
                element = line;
            }
        }
        return array;
    }
    removeLine(element = this.ITEMS.at(-1) || null) {
        if (element) {
            while (element) {
                var next = element.nextElementSibling;
                element.remove();
                element = (next ? (next.getAttribute('role') == 'line' ? next : null) : null);
            }
        }
    }
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
        var root = crt('div', '', { role: 'iterations' });
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
        await each(this.ITEMS.map(ele => this.readRow(ele)), input => {
            var b = callback(input);
            if (b)
                result.push(input);
            this.setShow(input.row, b);
        }, timeout, limit);
        this.isloading = false;
        return result;
    }
    setCreationFunction(fn) {
        this.creationFunction = fn;
        return this;
    }
    setGetReadingFunction(fn) {
        this.readGetFn = fn;
    }
    setSetReadingFunction(fn) {
        this.readSetFn = fn;
    }
}
