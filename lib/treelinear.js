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
var _TreeLinear_instances, _TreeLinear_mainTreeElement, _TreeLinear_callbackQuery, _TreeLinear_isLine, _TreeLinear_inner, _TreeLinear_outer, _TreeLinear_toQuery, _TreeLinear_toElement, _TreeLinear_getLevelElement, _TreeLinear_getIconElement, _TreeLinear_isOpend, _TreeLinear_isClosed, _TreeLinear_open, _TreeLinear_close, _TreeLinear_toggle;
import { Delay } from './delay.js';
import { Iterations } from './iterations.js';
import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { createElement, forEachAsync } from './utils.js';
export class TreeLinear extends Iterations {
    constructor(root, title, propertys, defaultValues) {
        super(root, title, propertys, defaultValues);
        _TreeLinear_instances.add(this);
        _TreeLinear_mainTreeElement.set(this, createElement('span', '', {
            'aria-level': -1,
            'aria-disabled': 'true',
        }));
        _TreeLinear_callbackQuery.set(this, i => `${i}`);
        this.separator = '/';
        this.treePropertys = [];
        this.closeIconElement = createElement('i', 'open', {});
        this.openIconElement = createElement('i', 'close', {});
        this.root.setAttribute('role', 'treelinear');
        this.rowname = 'treeitem';
        this.root.prepend(__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"));
        this.shortcuts.inner = {
            open: Sh.create(`${this.title}:open`, 'arrowright', [this.root], 'key').ondown(() => {
                var selectedElement = this.SELECTD_ELEMENTS;
                selectedElement.forEach(element => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element))
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element);
                    else {
                        var firstElement = this.firstChildOf(element);
                        if (firstElement) {
                            this.setSelect(element, false);
                            this.setSelect(firstElement, true);
                        }
                    }
                });
            }),
            close: Sh.create(`${this.title}:close`, 'arrowleft', [this.root], 'key').ondown(() => {
                var selectedElement = this.SELECTD_ELEMENTS;
                selectedElement.forEach(element => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element)) {
                        var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element);
                        if (outer && outer != __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
                            this.setSelect(element, false);
                            this.setSelect(outer, true);
                        }
                    }
                    else
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
                });
            }),
        };
    }
    get ITEMS() {
        return super.ITEMS;
    }
    getLevel(element) {
        return Number(element.ariaLevel);
    }
    line(element = '') {
        element = this.convertTo(element, 'element');
        var ele = createElement('div', '', { role: 'line' });
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element);
        this.root.appendChild(ele);
    }
    inner(element) {
        element = this.convertTo(element, 'element');
        return element ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element) : [];
    }
    outer(element) {
        element = this.convertTo(element, 'element');
        return element ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element) : null;
    }
    convertTo(any, to) {
        return (to == 'element' ? (typeof any == 'string' ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toElement).call(this, any) : any) : typeof any == 'string' ? any : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, any));
    }
    childsOf(any) {
        any = this.convertTo(any, 'element');
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        var result = [];
        inner.forEach(itemElement => result.push(itemElement, ...this.childsOf(itemElement)));
        return result;
    }
    lastChildOf(any) {
        any = this.convertTo(any, 'element');
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        var result = inner.at(-1);
        if (!result)
            return null;
        inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, result);
        while (inner.length) {
            result = inner.at(-1);
            inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, result);
        }
        return result;
    }
    firstChildOf(any) {
        any = this.convertTo(any, 'element');
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        return inner.length ? inner[0] : null;
    }
    isTree(element) {
        if (__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f") == element)
            return true;
        var columns = this.items(element);
        return this.treePropertys.every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML.trim() === `${value}`.trim());
    }
    createRow(input, lvl = 0, closed = false, visible = true) {
        var result = super.createRow(input);
        result.ariaLevel = `${lvl}`;
        result.ariaHidden = `${closed}`;
        this.setShow(result, visible);
        if (this.isTree(result)) {
            result.ariaExpanded = 'true';
            var showMoreIcon = createElement('span', ``, {
                role: 'icon',
            });
            showMoreIcon.appendChild((closed ? this.closeIconElement : this.openIconElement).cloneNode(true));
            showMoreIcon.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, result);
            result.querySelector('[role="level"]')?.prepend(showMoreIcon);
        }
        else
            result.ariaExpanded = 'false';
        return result;
    }
    read(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        var body = this.readRow(element);
        return {
            body,
            innerTree: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).map(ele => this.read(ele)),
        };
    }
    create(query, prop, from = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        if (query == '')
            return;
        var index = query.indexOf(this.separator);
        var firstQuery = query.slice(0, index);
        query = query.slice(index + 1);
        var element = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, from).find((ele, index) => __classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, this.readRow(ele), index) == firstQuery);
        if (!element) {
            var o = Object.create(null);
            o[prop] = firstQuery;
            var ele = this.appendSync(from, [o]);
            from = ele[0].row;
        }
        this.create(query, prop, from);
    }
    setTreePropertys(...propertys) {
        this.treePropertys = propertys;
        this.ITEMS.forEach(element => {
            var isTree = this.isTree(element);
            var iconShowMore = element.querySelector(`[role="level"] > [role="icon"]`);
            element.ariaExpanded = `${isTree}`;
            if (isTree) {
                if (!iconShowMore) {
                    var showMoreIcon = createElement('span', '', {
                        role: 'icon',
                    });
                    showMoreIcon.appendChild(this.closeIconElement);
                    showMoreIcon.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, element);
                    element.querySelector('[role="level"]')?.prepend(showMoreIcon);
                }
            }
            else
                iconShowMore?.remove();
        });
    }
    setTargetShortcut(targets = null) {
        super.setTargetShortcut(targets);
        this.shortcuts.inner.open.targets = targets;
        this.shortcuts.inner.close.targets = targets;
    }
    async append(element, data, timeout, limit) {
        element = this.convertTo(element, 'element');
        if (!this.isTree(element))
            throw Error('Cannot Be add in this item');
        var isOpend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        var initLevel = this.getLevel(element) + 1;
        element = this.lastChildOf(element) || element;
        data = data.reverse();
        var dl = new Delay(timeout);
        var result = [];
        for (let i = 0; i < data.length; i++) {
            if (!(i % limit))
                await dl.on();
            var ele = this.createRow(data[i], initLevel, true, isOpend);
            element.after(ele);
            result.push(this.readRow(ele));
        }
        return result;
    }
    async prepend(element, data, timeout, limit) {
        element = this.convertTo(element, 'element');
        if (!this.isTree(element))
            throw Error('Cannot Be add in this item');
        var isOpend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        var initLevel = this.getLevel(element) + 1;
        data = data.reverse();
        var dl = new Delay(timeout);
        var result = [];
        for (let i = 0; i < data.length; i++) {
            if (!(i % limit))
                dl.on();
            var ele = this.createRow(data[i], initLevel, true, isOpend);
            element.after(ele);
            result.push(this.readRow(ele));
        }
        return result;
    }
    async after(element, data, timeout, limit) {
        this.throwLoading();
        var lvl = this.getLevel(element);
        var inner = this.childsOf(element);
        var isClosed = element.style.display == 'none';
        element = inner.at(-1) || element;
        var result = [];
        await forEachAsync(data.reverse(), d => {
            var ele = this.createRow(d, lvl, false, isClosed);
            element.after(ele);
            result.push(this.readRow(ele));
        }, timeout, limit);
        return result;
    }
    async before(element, data, timeout, limit) {
        var lvl = this.getLevel(element);
        var isClosed = element.style.display == 'none';
        var result = [];
        await forEachAsync(data, d => {
            var ele = this.createRow(d, lvl, false, isClosed);
            element.before(ele);
            result.push(this.readRow(ele));
        }, timeout, limit);
        return result;
    }
    async delete(element, timeout, limit) {
        await forEachAsync(__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element), async (ele) => await this.delete(ele, timeout, limit), timeout, limit);
        element.remove();
    }
    async insert(element, tree, timeout, limit) {
        var result = [];
        var level = this.getLevel(element) + 1;
        var isOpend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        await forEachAsync(tree, async ({ body, innerTree }) => {
            var ele = this.createRow(body, level, true, isOpend);
            result.push(this.readRow(ele));
            var mainElement = this.lastChildOf(element) || element;
            mainElement.after(ele);
            Array.isArray(innerTree) && innerTree.length && result.push(...(await this.insert(ele, innerTree, timeout, limit)));
        }, timeout, limit);
        return result;
    }
    appendSync(element, data) {
        element = this.convertTo(element, 'element');
        if (!this.isTree(element))
            throw Error('Cannot Be add in this item');
        var isOpend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        var initLevel = this.getLevel(element) + 1;
        element = this.lastChildOf(element) || element;
        data = data.reverse();
        var result = [];
        for (let i = 0; i < data.length; i++) {
            var ele = this.createRow(data[i], initLevel, true, isOpend);
            element.after(ele);
            result.push(this.readRow(ele));
        }
        return result;
    }
    prependSync(element, data) {
        element = this.convertTo(element, 'element');
        if (!this.isTree(element))
            throw Error('Cannot Be add in this item');
        var isOpend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        var initLevel = this.getLevel(element) + 1;
        data = data.reverse();
        var result = [];
        for (let i = 0; i < data.length; i++) {
            var ele = this.createRow(data[i], initLevel, true, isOpend);
            element.after(ele);
            result.push(this.readRow(ele));
        }
        return result;
    }
    afterSync(element, data) {
        this.throwLoading();
        var lvl = this.getLevel(element);
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element);
        var isClosed = element.style.display == 'none';
        while (inner.length) {
            element = inner.at(-1);
            inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element);
        }
        var result = [];
        data.reverse().forEach(d => {
            var ele = this.createRow(d, lvl, false, !isClosed);
            element.after(ele);
            result.push(this.readRow(ele));
        });
        return result;
    }
    beforeSync(element, data) {
        var lvl = this.getLevel(element);
        var isClosed = element.style.display == 'none';
        var result = [];
        data.forEach(d => {
            var ele = this.createRow(d, lvl, false, !isClosed);
            element.before(ele);
            result.push(this.readRow(ele));
        });
        return result;
    }
    deleteSync(element) {
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).forEach(ele => this.deleteSync(ele));
        element.remove();
    }
    insertSync(element, tree) {
        var level = this.getLevel(element) + 1;
        var isOpend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        var result = [];
        tree.forEach(({ body, innerTree }) => {
            var ele = this.createRow(body, level, true, isOpend);
            var mainElement = this.lastChildOf(element) || element;
            mainElement.after(ele);
            Array.isArray(innerTree) && innerTree.length && result.push(...this.insertSync(ele, innerTree));
        });
        return result;
    }
    sortSync(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"), sortBy, orderby, deep = true) {
        var Tr = this.read(element).innerTree;
        function childs(tree) {
            var result = [tree.body];
            tree.innerTree.forEach(tr => result.push(tr.body, ...childs(tr)));
            return result;
        }
        var sort = (tree = Tr) => {
            var sortedData = tree.sort((a, b) => (a.body[sortBy] < b.body[sortBy] ? 1 : -1));
            if (orderby == 'DESC')
                sortedData = sortedData.reverse();
            sortedData.forEach(tree => {
                var ch = childs(tree).map(({ row }) => row);
                element.after(...ch);
            });
            console.log('-'.repeat(30));
            if (deep) {
                tree
                    .filter(({ body: { row } }) => this.isTree(row))
                    .forEach(({ innerTree }) => {
                    Array.isArray(innerTree) && innerTree.length && sort(innerTree);
                });
            }
        };
        sort();
    }
    async sort(element, sortBy, orderby, deep = true, timeout, limit) {
        var Tr = this.read(element).innerTree;
        function childs(tree) {
            var result = [tree.body];
            tree.innerTree.forEach(tr => result.push(tr.body, ...childs(tr)));
            return result;
        }
        var sort = async (tree = Tr) => {
            var sortedData = tree.sort((a, b) => (a.body[sortBy] < b.body[sortBy] ? 1 : -1));
            if (orderby == 'DESC')
                sortedData = sortedData.reverse();
            await forEachAsync(sortedData, async (tree) => {
                var ch = childs(tree).map(({ row }) => row);
                await forEachAsync(ch.reverse(), ele => {
                    element.after(ele);
                }, timeout, limit);
            }, timeout, limit);
            if (deep) {
                await forEachAsync(tree.filter(({ body: { row } }) => this.isTree(row)), ({ innerTree }) => {
                    Array.isArray(innerTree) && innerTree.length && sort(innerTree);
                }, timeout, limit);
            }
        };
        await sort();
    }
    async methode(methode, element, input, timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        element = this.convertTo(element, 'element');
        switch (methode) {
            case 'before': {
            }
            case 'append': {
            }
            case 'prepend': {
            }
            case 'after': {
                return await this[methode](element, input, timeout, limit);
            }
            case 'insert': {
                return await this.insert(element, input, timeout, limit);
            }
            case 'delete': {
                await this.delete(element, timeout, limit);
                break;
            }
            case 'sort': {
                var { by, orderby, deep } = input;
                await this.sort(element, by, orderby, deep, timeout, limit);
            }
        }
        this.isloading = false;
    }
    methodeSync(methode, element, input) {
        this.throwLoading();
        element = this.convertTo(element, 'element');
        switch (methode) {
            case 'before': {
            }
            case 'append': {
            }
            case 'prepend': {
            }
            case 'after': {
                return this[`${methode}Sync`](element, input);
            }
            case 'insert': {
                return this.insertSync(element, input);
            }
            case 'delete': {
                this.deleteSync(element);
                break;
            }
            case 'sort': {
                var { by, orderby, deep } = input;
                this.sortSync(element, by, orderby, deep);
            }
        }
    }
    setCallbackQuery(callback) {
        __classPrivateFieldSet(this, _TreeLinear_callbackQuery, callback, "f");
    }
    isOpend(element) {
        element = this.convertTo(element, 'element');
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
    }
    isClosed(element) {
        element = this.convertTo(element, 'element');
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element);
    }
    open(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        element = this.convertTo(element, 'element');
        if (this.isTree(element))
            throw Error('Cannot Be open element not subtree element');
        else
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element);
    }
    close(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        element = this.convertTo(element, 'element');
        if (this.isTree(element))
            throw Error('Cannot Be open element not subtree element');
        else
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
    }
    toggle(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        element = this.convertTo(element, 'element');
        if (this.isTree(element))
            throw Error('Cannot Be open element not subtree element');
        else
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
    }
    submit(type = 'call', element = this.ELEMENT_DIRECTION) {
        if (!this.SELECTD_ELEMENTS.length || this.isTree(element))
            return;
        this.onfunctionsubmit.forEach(fn => fn(type, element));
    }
    jsonTree(element) {
        return {
            body: super.json(element),
            innerTree: this.isTree(element) ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).map(ele => this.jsonTree(ele)) : [],
        };
    }
    async copy() {
        var selectedElement = this.SELECTD_ELEMENTS;
        await navigator.clipboard.writeText(JSON.stringify(selectedElement.map(ele => this.jsonTree(ele)), undefined, 1));
    }
    async cut(timeout = 20, limit = 1) {
        var selectedElement = this.SELECTD_ELEMENTS;
        await navigator.clipboard.writeText(JSON.stringify(selectedElement.map(ele => this.jsonTree(ele)), undefined, 1));
        selectedElement.forEach(element => this.delete(element, timeout, limit));
    }
    async paste(timeout = 5, limit = 1) {
        this.throwLoading();
        this.isloading = true;
        var result = [];
        var data = JSON.parse(await navigator.clipboard.readText());
        if (!Array.isArray(data))
            throw Error('paste ignore');
        var selected = this.SELECTD_ELEMENTS.filter(ele => this.isTree(ele));
        var div = selected.length / data.length;
        if (div >= 1 && div == parseInt(`${div}`))
            await forEachAsync(selected, async (element, index) => result.push(...(await this.insert(element, data.slice(index * div, (index + 1) * div), timeout, limit))), timeout, limit);
        else if (selected.length)
            await forEachAsync(selected, async (element) => result.push(...(await this.insert(element, data, timeout, limit))), timeout, limit);
        else
            result.push(...(await this.insert(__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"), data, timeout, limit)));
        this.isloading = false;
        return result;
    }
    static create(title, defaultValue) {
        var tree = super.create(title, defaultValue);
        return tree;
    }
    static title(title) {
        return super.title(title);
    }
}
_TreeLinear_mainTreeElement = new WeakMap(), _TreeLinear_callbackQuery = new WeakMap(), _TreeLinear_instances = new WeakSet(), _TreeLinear_isLine = function _TreeLinear_isLine(element) {
    return element.getAttribute('role') == 'line';
}, _TreeLinear_inner = function _TreeLinear_inner(element) {
    var initLvl = this.getLevel(element);
    var { nextElementSibling } = element;
    var result = [];
    while (nextElementSibling && initLvl < this.getLevel(nextElementSibling)) {
        var ele = nextElementSibling;
        if (!__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isLine).call(this, ele) && this.getLevel(ele) == initLvl + 1)
            result.push(ele);
        nextElementSibling = nextElementSibling.nextElementSibling;
    }
    return result;
}, _TreeLinear_outer = function _TreeLinear_outer(element) {
    var initLvl = this.getLevel(element);
    var { previousElementSibling } = element;
    while (previousElementSibling && initLvl <= this.getLevel(previousElementSibling))
        previousElementSibling = previousElementSibling.previousElementSibling;
    return previousElementSibling;
}, _TreeLinear_toQuery = function _TreeLinear_toQuery(element) {
    if (element === __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return '';
    var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element);
    var data = this.readRow(element);
    if (!outer)
        return `${__classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, data, 0)}`;
    else {
        var index = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, outer).indexOf(element);
        return `${__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, outer)}${this.separator}${__classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, data, index)}`;
    }
}, _TreeLinear_toElement = function _TreeLinear_toElement(query) {
    var result = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f");
    var spliting = query
        .split(this.separator)
        .map(content => content.trim())
        .filter(s => s !== '');
    for (let i = 0; i < spliting.length; i++) {
        if (!result)
            return null;
        var fd = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, result).find((element, index) => {
            var data = this.readRow(element);
            return __classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, data, index) == spliting[i];
        });
        result = fd ? fd : null;
    }
    return result;
}, _TreeLinear_getLevelElement = function _TreeLinear_getLevelElement(element) {
    return element.querySelector(`[role="level"]`);
}, _TreeLinear_getIconElement = function _TreeLinear_getIconElement(element) {
    return element.querySelector(`[role="level"] > [role="icon"]`);
}, _TreeLinear_isOpend = function _TreeLinear_isOpend(element) {
    if (element == __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return true;
    if (!this.isTree(element))
        return false;
    return element.ariaHidden === 'false';
}, _TreeLinear_isClosed = function _TreeLinear_isClosed(element) {
    if (element == __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return false;
    if (!this.isTree(element))
        return true;
    return element.ariaHidden === 'true';
}, _TreeLinear_open = function _TreeLinear_open(element) {
    element.ariaHidden = 'false';
    var showMoreIcon = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getIconElement).call(this, element);
    if (showMoreIcon) {
        showMoreIcon.innerHTML = ``;
        showMoreIcon.appendChild(this.openIconElement.cloneNode(true));
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).forEach(ele => {
            this.setShow(ele, true);
            if (ele.ariaAutoComplete == 'true') {
                ele.ariaAutoComplete = 'false';
                __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, ele);
            }
        });
    }
}, _TreeLinear_close = function _TreeLinear_close(element) {
    element.ariaHidden = 'true';
    var showMoreIcon = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getIconElement).call(this, element);
    if (showMoreIcon) {
        showMoreIcon.innerHTML = '';
        showMoreIcon.appendChild(this.closeIconElement.cloneNode(true));
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).forEach(ele => {
            this.setShow(ele, false);
            if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, ele)) {
                ele.ariaAutoComplete = 'true';
                __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, ele);
            }
            else
                ele.ariaAutoComplete = 'false';
        });
    }
}, _TreeLinear_toggle = function _TreeLinear_toggle(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element) ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element) : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
};
