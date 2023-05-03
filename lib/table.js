var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Table_tables;
import { Iterations as Itr } from './iterations.js';
import { forEachAsync as each } from './utils.js';
export class Table extends Itr {
    constructor(root, title, propertys = [], defaultValue) {
        super(root, title, propertys, defaultValue);
        this.root.setAttribute('role', 'table');
        this.rowname = 'row';
        __classPrivateFieldGet(Table, _a, "f", _Table_tables).push(this);
    }
    get DATA() {
        return this.ITEMS.map(element => this.readRow(element));
    }
    get EFFECTIVE_DATA() {
        return this.EFFECTIVE_ELEMENTS.map(element => this.readRow(element));
    }
    get SELECTED_DATA() {
        return this.SELECTD_ELEMENTS.map(element => this.readRow(element));
    }
    appendSync(data) {
        return data.map(input => {
            var row = this.createRow(input);
            this.root.appendChild(row);
            return this.readRow(row);
        });
    }
    async append(data, timeout, limit) {
        var result = [];
        await each(data, input => {
            var row = this.createRow(input);
            this.root.appendChild(row);
            result.push(this.readRow(row));
        }, timeout, limit);
        return result;
    }
    prependSync(data) {
        return data.map(input => {
            var row = this.createRow(input);
            this.root.prepend(row);
            return this.readRow(row);
        });
    }
    async prepend(data, timeout, limit) {
        var result = [];
        await each(data, input => {
            var row = this.createRow(input);
            this.root.appendChild(row);
            result.push(this.readRow(row));
        }, timeout, limit);
        return result;
    }
    afterSync(element, data) {
        var result = [];
        data.reverse().forEach(input => {
            const row = this.createRow(input);
            element.after(row);
            result.unshift(this.readRow(row));
        });
        return result;
    }
    async after(element, data, timeout, limit) {
        var result = [];
        await each(data.reverse(), input => {
            const row = this.createRow(input);
            element.after(row);
            result.unshift(this.readRow(row));
        }, timeout, limit);
        return result;
    }
    beforeSync(element, data) {
        return data.map(input => {
            const row = this.createRow(input);
            element.before(row);
            return this.readRow(row);
        });
    }
    async before(element, data, timeout, limit) {
        var result = [];
        await each(data, input => {
            const row = this.createRow(input);
            element.before(row);
            result.push(this.readRow(row));
        }, timeout, limit);
        return result;
    }
    async copy() {
        if (!this.configurations.clipboard)
            throw Error('cannot use the clipboard shortcuts');
        var selectedData = this.SELECTD_ELEMENTS.map(element => this.json(element));
        await navigator.clipboard.writeText(JSON.stringify(selectedData, undefined, 1));
    }
    async cut() {
        if (!this.configurations.clipboard)
            throw Error('cannot use the clipboard shortcuts');
        var selectedData = this.SELECTD_ELEMENTS.map(element => {
            element.remove();
            return this.json(element);
        });
        await navigator.clipboard.writeText(JSON.stringify(selectedData, undefined, 1));
    }
    async paste(timeout, limit) {
        if (!this.configurations.clipboard)
            throw Error('cannot use the clipboard shortcuts');
        var array = Array.from(JSON.parse(await navigator.clipboard.readText()));
        var { SELECTD_ELEMENTS: selectedElement, LAST_ELEMENT_SELECT: lastSelectedElement } = this;
        var result = [];
        var div = array.length / selectedElement.length;
        if (div >= 1 && div == parseInt(`${div}`))
            each(selectedElement, (element, index) => result.push(...this.afterSync(element, array.slice(index * div, (index + 1) * div))), timeout, limit);
        else if (selectedElement.length)
            each(selectedElement, element => result.push(...this.afterSync(element, array)), timeout, limit);
        else
            result.push(...(await this.append(array, timeout, limit)));
        return result;
    }
    sortSync(by, to = 'DESC') {
        this.throwLoading();
        var allDataSorted = this.DATA.sort((a, b) => (a[by] < b[by] ? 1 : -1));
        if (to == 'DESC')
            allDataSorted = allDataSorted.reverse();
        allDataSorted.forEach(({ row }) => this.root.appendChild(row));
    }
    async sort(by, to = 'DESC', timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        var allDataSorted = this.DATA.sort((a, b) => (a[by] < b[by] ? 1 : -1));
        await each(to == 'DESC' ? allDataSorted.reverse() : allDataSorted, ({ row }) => {
            this.root.appendChild(row);
        }, timeout, limit);
        this.isloading = false;
    }
    async methode(methode, input, element = this.ITEMS[0], timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        var result = [];
        switch (methode) {
            case 'after': {
            }
            case 'before': {
                result = await this[methode](element, input, timeout, limit);
                break;
            }
            case 'prepend': {
            }
            case 'append': {
                result = await this[methode](input, timeout, limit);
                break;
            }
            case 'sort': {
                var { by, direction } = input;
                await this.sort(by, direction, timeout, limit);
            }
        }
        this.isloading = false;
        return result;
    }
    methodeSync(methode, input, element = this.ITEMS[0]) {
        this.throwLoading();
        this.isloading = true;
        var result = [];
        switch (methode) {
            case 'after': {
            }
            case 'before': {
                result = this[`${methode}Sync`](element, input);
                break;
            }
            case 'prepend': {
            }
            case 'append': {
                result = this[`${methode}Sync`](input);
                break;
            }
            case 'sort': {
                var { by, direction } = input;
                this.sortSync(by, direction);
            }
        }
        this.isloading = false;
        return result;
    }
    static create(title, defaultValue) {
        return super.create(title, defaultValue);
    }
    static get tables() {
        return [...__classPrivateFieldGet(this, _a, "f", _Table_tables)];
    }
    static title(title) {
        return __classPrivateFieldGet(this, _a, "f", _Table_tables).find(({ title: tlt }) => tlt == title) || null;
    }
}
_a = Table;
_Table_tables = { value: [] };
