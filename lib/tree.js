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
var _Tree_instances, _a, _Tree_treepropertys, _Tree_callbackQuery, _Tree_mainTreeElement, _Tree_trees, _Tree_getItemElement, _Tree_getContentElement, _Tree_getInnerTreeElement, _Tree_getOuterTreeElement, _Tree_inner, _Tree_outer, _Tree_toElement, _Tree_toQuery;
import { Iterations as Itr } from './iterations.js';
import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { createElement as crt, forEachAsync as each } from './utils.js';
export class Tree extends Itr {
    constructor(root, title, propertys, defaultValues) {
        super(root, title, propertys, defaultValues);
        _Tree_instances.add(this);
        _Tree_treepropertys.set(this, []);
        this.onOpenFunctions = [];
        this.onCloseFunctions = [];
        _Tree_callbackQuery.set(this, (d, i) => `${i}`);
        _Tree_mainTreeElement.set(this, void 0);
        this.separator = '/';
        this.defaultVisibility = 'open';
        this.root.setAttribute('role', 'tree');
        this.rowname = 'treegrid';
        __classPrivateFieldSet(this, _Tree_mainTreeElement, this.createRow(this.defaultValues), "f");
        __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getContentElement).call(this, __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")).innerHTML = '';
        __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getItemElement).call(this, __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")).style.display = 'none';
        this.root.prepend(__classPrivateFieldGet(this, _Tree_mainTreeElement, "f"));
        if (this.shortcuts.find) {
            this.shortcuts.find.forword.clear('down');
            this.shortcuts.find.forword.ondown(({ keys }) => {
                if (!keys)
                    return;
                var { EFFECTIVE_ELEMENTS: effeEle, MIN_ELEMENT_EFFECTIVE: minEff, ELEMENT_DIRECTION: eleDir } = this;
                var findFrom = eleDir || minEff;
                if (!findFrom)
                    return;
                var index = effeEle.indexOf(findFrom);
                var get = effeEle.slice(index + 1).find(ele => {
                    var content = `${this.readRow(ele)[this.searcherKey]}`.charAt(0).toUpperCase();
                    return keys.includes(content);
                });
                if (get)
                    this.select(get);
            });
            this.shortcuts.find.backword.clear('down');
            this.shortcuts.find.backword.ondown(({ keys }) => {
                if (!keys)
                    return;
                var { EFFECTIVE_ELEMENTS: effeEle, MIN_ELEMENT_EFFECTIVE: minEff, ELEMENT_DIRECTION: eleDir } = this;
                var findFrom = eleDir || minEff;
                effeEle = effeEle.reverse();
                if (!findFrom)
                    return;
                var index = effeEle.indexOf(findFrom);
                var get = effeEle.slice(index + 1).find(ele => {
                    var content = `${this.readRow(ele)[this.searcherKey]}`.charAt(0).toUpperCase();
                    return keys.includes(content);
                });
                if (get)
                    this.select(get);
            });
        }
        this.shortcuts.inner = {
            open: Sh.create(`${this.title}:open`, 'arrowright', [this.root], 'key').ondown(() => {
                this.SELECTD_ELEMENTS.forEach(ele => {
                    if (this.isOpend(ele)) {
                        var inner = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, ele);
                        if (inner.length) {
                            this.setSelect(inner[0], true);
                            this.setSelect(ele, false);
                        }
                    }
                    else
                        this.open(ele);
                });
            }),
            close: Sh.create(`${this.title}:close`, 'arrowleft', [this.root], 'key').ondown(() => {
                this.SELECTD_ELEMENTS.forEach(ele => {
                    if (this.isOpend(ele))
                        this.close(ele);
                    else {
                        var outerElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_outer).call(this, ele);
                        if (outerElement && outerElement != __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")) {
                            this.setSelect(ele, false);
                            this.setSelect(outerElement, true);
                        }
                    }
                });
            }),
        };
        this.shortcuts.status.submit.ondown(() => {
            this.SELECTD_ELEMENTS.forEach(ele => this.isTree(ele) && this.open(ele));
        });
    }
    get ITEMS() {
        var fn = (element) => {
            var inner = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element);
            var result = [];
            inner.map(ele => {
                result.push(ele, ...fn(ele));
            });
            return result;
        };
        return fn(__classPrivateFieldGet(this, _Tree_mainTreeElement, "f")).filter(ele => ele.getAttribute('role') == this.rowname);
    }
    convertTo(any, to) {
        return (to == 'element' ? (typeof any == 'string' ? __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_toElement).call(this, any) : any) : typeof any == 'string' ? any : __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_toQuery).call(this, any));
    }
    forword(count) {
        if (!count) {
            this.configurations.scrolling && this.scroll('forword');
            return;
        }
        var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir, MIN_ELEMENT_EFFECTIVE: minEff } = this;
        var index = effEle.indexOf(eleDir);
        var ele = effEle[index + 1] || minEff;
        if (ele)
            this.select(ele);
        else if (minEff && this.configurations.redirect)
            this.select(minEff);
        else
            return;
        this.forword(count - 1);
    }
    backword(count) {
        if (!count) {
            this.configurations.scrolling && this.scroll('backword');
            return;
        }
        var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir, MAX_ELEMENT_EFFCTIVE: maxEff } = this;
        var index = effEle.reverse().indexOf(eleDir);
        var ele = effEle[index + 1] || maxEff;
        if (ele)
            this.select(ele);
        else if (maxEff && this.configurations.redirect)
            this.select(maxEff);
        else
            return;
        this.backword(count - 1);
    }
    forwordSelection(count) {
        var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir } = this;
        var index = effEle.indexOf(eleDir);
        this.select(...effEle.slice(index, index + count));
        this.configurations.scrolling && this.scroll('forword');
    }
    createRow(input) {
        var treeitem = super.createRow(input);
        treeitem.setAttribute('role', 'treeitem');
        var result = crt('div', '', { role: this.rowname });
        result.appendChild(treeitem);
        if (this.isTree(result)) {
            var subtree = crt('div', '', { role: 'tree' });
            var t = typeof this.defaultVisibility == 'function' ? this.defaultVisibility(input) : this.defaultVisibility;
            if (t == 'close')
                subtree.style.display = 'none';
            result.appendChild(subtree);
        }
        return result;
    }
    readRow(element) {
        var o = super.readRow(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getItemElement).call(this, element));
        o.row = element;
        return o;
    }
    submit(type, element) {
        if (this.isTree(element))
            return;
        super.submit(type, element);
    }
    isTree(element) {
        if (__classPrivateFieldGet(this, _Tree_mainTreeElement, "f") == element)
            return true;
        var columns = this.items(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getItemElement).call(this, element));
        return __classPrivateFieldGet(this, _Tree_treepropertys, "f").every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML == value);
    }
    setTreePropertys(...propertys) {
        __classPrivateFieldSet(this, _Tree_treepropertys, propertys, "f");
        this.ITEMS.forEach(element => {
            if (this.isTree(element)) {
                if (!__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element)) {
                    var subtree = crt('div', '', { role: 'tree' });
                    element.appendChild(subtree);
                }
            }
            else {
                __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element)?.remove();
            }
        });
    }
    setCallbackQuery(callback) {
        __classPrivateFieldSet(this, _Tree_callbackQuery, callback, "f");
    }
    getDefaultVisibility() {
        return this.defaultVisibility;
    }
    setDefaultVisibility(value) {
        this.defaultVisibility = value;
    }
    appendSync(element, data) {
        this.throwLoading();
        if (!this.isTree(element))
            return;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        subtreeElement.append(...data.map(input => this.createRow(input)));
    }
    prependSync(element, data) {
        this.throwLoading();
        if (!this.isTree(element))
            return;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        subtreeElement.prepend(...data.map(input => this.createRow(input)));
    }
    beforeSync(element, data) {
        this.throwLoading();
        element.before(...data.map(input => this.createRow(input)));
    }
    afterSync(element, data) {
        this.throwLoading();
        element.after(...data.reverse().map(input => this.createRow(input)));
    }
    insertSync(element, data) {
        this.throwLoading();
        if (!this.isTree(element))
            return;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        data.forEach(({ body, innerTree }) => {
            var row = this.createRow(body);
            subtreeElement.appendChild(row);
            Array.isArray(innerTree) && innerTree.length && this.insertSync(row, innerTree);
        });
    }
    sortSync(element, by, orderby, deep = true) {
        var innersElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element);
        var readyinners = innersElement.sort((a, b) => (this.readRow(a)[by] <= this.readRow(b)[by] ? -1 : 1));
        if (orderby == 'DESC')
            readyinners.reverse();
        var innerMainElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (innerMainElement)
            readyinners.forEach(ele => innerMainElement.appendChild(ele));
        if (deep)
            innersElement.filter(ele => this.isTree(ele)).forEach(ele => this.sortSync(ele, by, orderby, true));
    }
    methodeSync(event, any, data) {
        any = this.convertTo(any, 'element');
        switch (event) {
            case 'append': {
            }
            case 'prepend': {
            }
            case 'after': {
            }
            case 'before': {
                this[`${event}Sync`](any, data);
                break;
            }
            case 'insert': {
                this.insertSync(any, data);
                break;
            }
            case 'sort': {
                var { by, orderby, deep } = data;
                this.sortSync(any, by, orderby, deep);
            }
        }
    }
    async append(element, data, timeout, limit) {
        this.throwLoading();
        if (!this.isTree(element))
            return;
        this.isloading = true;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        each(data, input => {
            const ele = this.createRow(input);
            subtreeElement.append(ele);
        }, timeout, limit);
        this.isloading = false;
    }
    async prepend(element, data, timeout, limit) {
        this.throwLoading();
        if (!this.isTree(element))
            return;
        this.isloading = true;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        each(data.reverse(), input => {
            const ele = this.createRow(input);
            subtreeElement.prepend(ele);
        }, timeout, limit);
        this.isloading = false;
    }
    async before(element, data, timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        each(data, input => {
            const ele = this.createRow(input);
            element.before(ele);
        }, timeout, limit);
        this.isloading = false;
    }
    async after(element, data, timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        each(data.reverse(), input => {
            const ele = this.createRow(input);
            element.after(ele);
        }, timeout, limit);
        this.isloading = false;
    }
    async insert(element, data, timeout, limit) {
        this.throwLoading();
        if (!this.isTree(element))
            return;
        this.isloading = true;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        each(data, async ({ body, innerTree }) => {
            var row = this.createRow(body);
            subtreeElement.appendChild(row);
            Array.isArray(innerTree) && innerTree.length && (await this.insert(row, innerTree, timeout, limit));
        }, timeout, limit);
        this.isloading = false;
    }
    async sort(element, by, orderby, deep = true, timeout, limit) {
        var innersElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element);
        var readyinners = innersElement.sort((a, b) => (this.readRow(a)[by] <= this.readRow(b)[by] ? -1 : 1));
        if (orderby == 'DESC')
            readyinners.reverse();
        var innerMainElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (innerMainElement) {
            await each(readyinners, ele => {
                innerMainElement.appendChild(ele);
            }, timeout, limit);
        }
        if (deep)
            await each(innersElement.filter(ele => this.isTree(ele)), async (ele) => await this.sort(ele, by, orderby, true, timeout, limit), timeout, limit);
    }
    async methode(event, any, data, timeout, limit) {
        any = this.convertTo(any, 'element');
        switch (event) {
            case 'append': {
            }
            case 'prepend': {
            }
            case 'after': {
            }
            case 'before': {
                await this[`${event}`](any, data, timeout, limit);
                break;
            }
            case 'insert': {
                await this.insert(any, data, timeout, limit);
                break;
            }
            case 'sort': {
                var { by, orderby, deep } = data;
                await this.sort(any, by, orderby, deep, timeout, limit);
            }
        }
    }
    get DATA() {
        var fn = (element) => {
            var body = this.readRow(element);
            return {
                body,
                innerTree: this.isTree(element) ? __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).map(ele => fn(ele)) : [],
            };
        };
        return fn(__classPrivateFieldGet(this, _Tree_mainTreeElement, "f"));
    }
    onopen(listener) {
        typeof listener == 'function' && this.onOpenFunctions.push(listener);
        return this;
    }
    offopen(listener) {
        const index = this.onOpenFunctions.indexOf(listener);
        if (index < 0)
            return false;
        this.onOpenFunctions.splice(index, 1);
        return true;
    }
    onclose(listener) {
        typeof listener == 'function' && this.onCloseFunctions.push(listener);
        return this;
    }
    offclose(listener) {
        const index = this.onCloseFunctions.indexOf(listener);
        if (index < 0)
            return false;
        this.onOpenFunctions.splice(index, 1);
        return true;
    }
    isOpend(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (ele)
            return ele.style.display !== 'none';
        else
            return false;
    }
    isClosed(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (ele)
            return ele.style.display === 'none';
        else
            return true;
    }
    open(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (ele && this.isClosed(element)) {
            ele.style.display = '';
            __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).forEach(e => this.setEffective(e, true));
            this.onOpenFunctions.forEach(fn => fn(element));
        }
    }
    close(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (ele && this.isOpend(element)) {
            ele.style.display = 'none';
            __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).forEach(e => this.setEffective(e, false));
            this.onCloseFunctions.forEach(fn => fn(element));
        }
    }
    toggle(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
        if (ele) {
            let { display } = ele.style;
            __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).forEach(e => this.setEffective(e, display !== 'none'));
            ele.style.display = display == 'none' ? '' : 'none';
        }
    }
    jsonTree(element) {
        var body = this.json(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getContentElement).call(this, element));
        return {
            body,
            innerTree: this.isTree(element) ? __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).map(ele => this.jsonTree(ele)) : [],
        };
    }
    async copy() {
        var array = this.SELECTD_ELEMENTS.map(element => {
            return this.jsonTree(element);
        });
        await navigator.clipboard.writeText(JSON.stringify(array, undefined, 1));
    }
    async cut() {
        var array = this.SELECTD_ELEMENTS.map(element => {
            var json = this.jsonTree(element);
            element.remove();
            return json;
        });
        await navigator.clipboard.writeText(JSON.stringify(array, undefined, 1));
    }
    async paste(timeout, limit) {
        const selectedElement = this.SELECTD_ELEMENTS;
        var array = JSON.parse(await navigator.clipboard.readText());
        var div = array.length / selectedElement.length;
        var result = [];
        if (div >= 1 && div == parseInt(`${div}`))
            await each(selectedElement, () => null, timeout, limit);
        else if (selectedElement.length)
            await each(selectedElement, () => null, timeout, limit);
        return result;
    }
    static get trees() {
        return [...__classPrivateFieldGet(this, _a, "f", _Tree_trees)];
    }
    static create(title, defaultValue) {
        var tree = super.create(title, defaultValue);
        return tree;
    }
    static title(title) {
        return __classPrivateFieldGet(this, _a, "f", _Tree_trees).find(({ title: tlt }) => tlt == title) || null;
    }
}
_a = Tree, _Tree_treepropertys = new WeakMap(), _Tree_callbackQuery = new WeakMap(), _Tree_mainTreeElement = new WeakMap(), _Tree_instances = new WeakSet(), _Tree_getItemElement = function _Tree_getItemElement(element) {
    return Array.from(element.children).find(ele => ele.getAttribute('role') == 'treeitem');
}, _Tree_getContentElement = function _Tree_getContentElement(element) {
    return Array.from(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getItemElement).call(this, element).children).find(ele => ele.getAttribute('role') == 'content');
}, _Tree_getInnerTreeElement = function _Tree_getInnerTreeElement(element) {
    return Array.from(element.children).find(ele => ele.getAttribute('role') == 'tree');
}, _Tree_getOuterTreeElement = function _Tree_getOuterTreeElement(element) {
    var result = element.closest(`[role="tree"]`);
    return result && this.root.contains(result) ? result : null;
}, _Tree_inner = function _Tree_inner(element) {
    var innerTree = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getInnerTreeElement).call(this, element);
    return innerTree ? Array.from(innerTree.children).filter(child => child.getAttribute('role') == this.rowname) : [];
}, _Tree_outer = function _Tree_outer(element) {
    var result = element.parentElement.closest(`[role="${this.rowname}"]`);
    return result && this.root.contains(result) ? result : null;
}, _Tree_toElement = function _Tree_toElement(query) {
    var spliting = query
        .split(this.separator)
        .map(s => s.trim())
        .filter(s => s !== '');
    var result = __classPrivateFieldGet(this, _Tree_mainTreeElement, "f");
    for (let i = 0; i < spliting.length; i++) {
        if (!result)
            return null;
        var inner = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, result);
        var fdElement = inner.find((e, index) => __classPrivateFieldGet(this, _Tree_callbackQuery, "f").call(this, this.readRow(e), index) == spliting[i]);
        result = fdElement || null;
    }
    return result;
}, _Tree_toQuery = function _Tree_toQuery(element) {
    if (element == __classPrivateFieldGet(this, _Tree_mainTreeElement, "f"))
        return '';
    var string = __classPrivateFieldGet(this, _Tree_callbackQuery, "f").call(this, this.readRow(element), 0);
    var outer = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_outer).call(this, element);
    while (outer && outer !== __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")) {
        string = `${__classPrivateFieldGet(this, _Tree_callbackQuery, "f").call(this, this.readRow(outer), 0)}${this.separator}${string}`;
        outer = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_outer).call(this, element);
    }
    return string;
};
_Tree_trees = { value: [] };
