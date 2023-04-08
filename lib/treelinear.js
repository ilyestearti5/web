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
var _TreeLinear_instances, _TreeLinear_mainTreeElement, _TreeLinear_callbackquery, _TreeLinear_subtree_propertys, _TreeLinear_isline, _TreeLinear_inner, _TreeLinear_outer, _TreeLinear_to_query, _TreeLinear_to_element, _TreeLinear_getLevelElement, _TreeLinear_getIconElement, _TreeLinear_isopend, _TreeLinear_isclosed, _TreeLinear_open, _TreeLinear_close, _TreeLinear_toggle;
import { Delay } from "./delay";
import { Iterations } from "./iterations";
import { KeyboardShortcut } from "./keyboardshortcuts";
import { createElement, forEachAsync } from "./utils";
export class TreeLinear extends Iterations {
    constructor(root, title, propertys, defaultValues) {
        super(root, title, propertys, defaultValues);
        _TreeLinear_instances.add(this);
        _TreeLinear_mainTreeElement.set(this, createElement("span", "", {
            "aria-level": -1,
            "aria-disabled": "true",
        }));
        _TreeLinear_callbackquery.set(this, (d, i) => `${i}`);
        this.separator = "/";
        _TreeLinear_subtree_propertys.set(this, []);
        this.root.role = "treelinear";
        this.rowname = "treeitem";
        this.root.prepend(__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"));
        this.shortcuts.inner = {
            open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
                this.root,
            ]).ondown(() => {
                var selectedElement = this.SELECTD_ELEMENTS;
                selectedElement.forEach((element) => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isclosed).call(this, element))
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element);
                    else {
                        var firstElement = this.firstchildof(element);
                        if (firstElement) {
                            this.setSelect(element, false);
                            this.setSelect(firstElement, true);
                        }
                    }
                });
            }),
            close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
                this.root,
            ]).ondown(() => {
                var selectedElement = this.SELECTD_ELEMENTS;
                selectedElement.forEach((element) => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isclosed).call(this, element)) {
                        var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element);
                        if (outer && outer != __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
                            this.setSelect(element, false);
                            this.setSelect(outer, true);
                        }
                    }
                    else {
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
                    }
                });
            }),
        };
    }
    get ITEMS() {
        return super.ITEMS;
    }
    getlevel(element) {
        return Number(element.ariaLevel);
    }
    line(element = "") {
        element = this.convertto(element, "element");
        var ele = createElement("div", "", { role: "line" });
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element);
        this.root.appendChild(ele);
    }
    inner(element) {
        element = this.convertto(element, "element");
        return element ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element) : [];
    }
    outer(element) {
        element = this.convertto(element, "element");
        return element ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element) : null;
    }
    convertto(any, to) {
        return (to == "element"
            ? typeof any == "string"
                ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_to_element).call(this, any)
                : any
            : typeof any == "string"
                ? any
                : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_to_query).call(this, any));
    }
    childsOf(any) {
        any = this.convertto(any, "element");
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        var result = [];
        inner.forEach((itemElement) => result.push(itemElement, ...this.childsOf(itemElement)));
        return result;
    }
    lastchildof(any) {
        any = this.convertto(any, "element");
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
    firstchildof(any) {
        any = this.convertto(any, "element");
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        return inner.length ? inner[0] : null;
    }
    issubtree(element) {
        if (__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f") == element)
            return true;
        var columns = this.columns(element);
        return __classPrivateFieldGet(this, _TreeLinear_subtree_propertys, "f").every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML == value);
    }
    createrow(input, lvl = 0, closed = false, visible = true) {
        var result = super.createrow(input);
        result.ariaLevel = `${lvl}`;
        result.ariaHidden = `${closed}`;
        this.setshow(result, visible);
        if (this.issubtree(result)) {
            result.ariaExpanded = "true";
            var showMoreIcon = createElement("span", `<i class="material-icons">${closed ? "chevron_right" : "expand_more"}</i>`, {
                role: "icon",
            });
            showMoreIcon.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, result);
            result.querySelector('[role="level"]')?.prepend(showMoreIcon);
        }
        else
            result.ariaExpanded = "false";
        return result;
    }
    read(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        var body = this.readrow(element);
        return {
            body,
            innerTree: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).map((ele) => this.read(ele)),
        };
    }
    setsubtreepropertys(...propertys) {
        __classPrivateFieldSet(this, _TreeLinear_subtree_propertys, propertys, "f");
        this.ITEMS.forEach((element) => {
            var issubtree = this.issubtree(element);
            var iconShowMore = element.querySelector(`[role="level"] > [role="icon"]`);
            element.ariaExpanded = `${issubtree}`;
            if (issubtree) {
                if (!iconShowMore) {
                    var showMoreIcon = createElement("span", `<i class="material-icons">chevron_right</i>`, {
                        role: "icon",
                    });
                    showMoreIcon.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, element);
                    element.querySelector('[role="level"]')?.prepend(showMoreIcon);
                }
            }
            else
                iconShowMore?.remove();
        });
    }
    setshow(rowElement, flag) {
        rowElement.style.display = flag ? "" : "none";
        this.setEffective(rowElement, flag);
    }
    settargetsshortcuts(targets = null) {
        super.settargetsshortcuts(targets);
        this.shortcuts.inner.open.targets = targets;
        this.shortcuts.inner.close.targets = targets;
    }
    async append(element, data, timeout, limit) {
        element = this.convertto(element, "element");
        if (!this.issubtree(element))
            throw Error("Cannot Be add in this item");
        var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        var initLevel = this.getlevel(element) + 1;
        element = this.lastchildof(element) || element;
        data = data.reverse();
        var dl = new Delay(timeout);
        for (let i = 0; i < data.length; i++) {
            if (!(i % limit))
                await dl.on();
            element.after(this.createrow(data[i], initLevel, true, isopend));
        }
    }
    async prepend(element, data, timeout, limit) {
        element = this.convertto(element, "element");
        if (!this.issubtree(element))
            throw Error("Cannot Be add in this item");
        var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        var initLevel = this.getlevel(element) + 1;
        data = data.reverse();
        var dl = new Delay(timeout);
        for (let i = 0; i < data.length; i++) {
            if (!(i % limit))
                dl.on();
            element.after(this.createrow(data[i], initLevel, true, isopend));
        }
    }
    async after(element, data, timeout, limit) {
        this.throwLoading();
        var lvl = this.getlevel(element);
        var inner = this.childsOf(element);
        var isclosed = element.style.display == "none";
        element = inner.at(-1) || element;
        await forEachAsync(data.reverse(), (d) => element.after(this.createrow(d, lvl, false, isclosed)), timeout, limit);
    }
    async before(element, data, timeout, limit) {
        var lvl = this.getlevel(element);
        var isclosed = element.style.display == "none";
        await forEachAsync(data, (d) => element.before(this.createrow(d, lvl, true, isclosed)), timeout, limit);
    }
    async delete(element, timeout, limit) {
        await forEachAsync(__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element), async (ele) => await this.delete(ele, timeout, limit), timeout, limit);
        element.remove();
    }
    async insert(element, tree, timeout, limit) {
        var level = this.getlevel(element) + 1;
        var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        await forEachAsync(tree, async ({ body, innerTree }) => {
            var ele = this.createrow(body, level, true, isopend);
            var mainElement = this.lastchildof(element) || element;
            mainElement.after(ele);
            Array.isArray(innerTree) &&
                innerTree.length &&
                (await this.insert(ele, innerTree, timeout, limit));
        }, timeout, limit);
    }
    appendSync(element, data) {
        element = this.convertto(element, "element");
        if (!this.issubtree(element))
            throw Error("Cannot Be add in this item");
        var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        var initLevel = this.getlevel(element) + 1;
        element = this.lastchildof(element) || element;
        data = data.reverse();
        for (let i = 0; i < data.length; i++) {
            element.after(this.createrow(data[i], initLevel, true, isopend));
        }
    }
    prependSync(element, data) {
        this.throwLoading();
        element = this.convertto(element, "element");
        if (!this.issubtree(element))
            throw Error("Cannot Be add in this item");
        var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        var initLevel = this.getlevel(element) + 1;
        data = data.reverse();
        for (let i = 0; i < data.length; i++)
            element.after(this.createrow(data[i], initLevel, true, isopend));
    }
    afterSync(element, data) {
        this.throwLoading();
        var lvl = this.getlevel(element);
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element);
        var isclosed = element.style.display == "none";
        while (inner.length) {
            element = inner.at(-1);
            inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element);
        }
        data
            .reverse()
            .forEach((d) => element.after(this.createrow(d, lvl, false, !isclosed)));
    }
    beforeSync(element, data) {
        var lvl = this.getlevel(element);
        var isclosed = element.style.display == "none";
        data.forEach((d) => element.before(this.createrow(d, lvl, true, isclosed)));
    }
    deleteSync(element) {
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).forEach((ele) => this.deleteSync(ele));
        element.remove();
    }
    insertSync(element, tree) {
        var level = this.getlevel(element) + 1;
        var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        tree.forEach(({ body, innerTree }) => {
            var ele = this.createrow(body, level, true, isopend);
            var mainElement = this.lastchildof(element) || element;
            mainElement.after(ele);
            Array.isArray(innerTree) &&
                innerTree.length &&
                this.insertSync(ele, innerTree);
        });
    }
    sortSync(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"), sortBy, direction, deep = true) {
        var tree = this.read(element).innerTree;
        for (let i = 0; i < tree.length; i++) {
            var X = tree[i];
            var { row } = X.body;
            deep && this.sortSync(row, sortBy, direction);
            var j = i - 1;
            var prec = tree[j];
            while (prec &&
                (direction == "down"
                    ? prec.body[sortBy] < X.body[sortBy]
                    : prec.body[sortBy] > X.body[sortBy])) {
                prec = tree[j];
                j--;
            }
            var childs = this.childsOf(row);
            if (prec)
                prec.body.row.before(...childs);
            else
                element.after(...childs);
            tree = this.read(element).innerTree;
        }
    }
    async sort(element, key, direction, deep = true, timeout, limit) {
        var dl = new Delay(timeout);
        var tree = this.read(element).innerTree;
        function childs(tree) {
            var result = [tree.body.row];
            tree.innerTree.forEach((tree) => result.push(...childs(tree)));
            return result;
        }
        for (let i = 0; i < tree.length; i++) {
            if (!(i % limit))
                await dl.on();
            var o = tree[i];
            var { body } = o;
            var { row } = body;
            var j = i - 1;
            var prec = tree[j];
            while (prec &&
                (direction == "down"
                    ? prec.body[key] < body[key]
                    : prec.body[key] > body[key])) {
                j--;
                prec = tree[j];
            }
            var c = childs(o);
            if (prec)
                prec.body.row.before(...c);
            else
                element.after(...c);
            deep && (await this.sort(row, key, direction, true, timeout, limit));
            tree = this.read(element).innerTree;
        }
    }
    async methode(methode, element, input, timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        element = this.convertto(element, "element");
        switch (methode) {
            case "before": {
            }
            case "append": {
            }
            case "prepend": {
            }
            case "after": {
                await this[methode](element, input, timeout, limit);
                break;
            }
            case "insert": {
                await this.insert(element, input, timeout, limit);
                break;
            }
            case "delete": {
                await this.delete(element, timeout, limit);
                break;
            }
            case "sort": {
                var { by, direction, deep } = input;
                await this.sort(element, by, direction, deep, timeout, limit);
            }
        }
        this.isloading = false;
    }
    methodeSync(methode, element, input) {
        this.throwLoading();
        element = this.convertto(element, "element");
        switch (methode) {
            case "before": {
            }
            case "append": {
            }
            case "prepend": {
            }
            case "after": {
                this[`${methode}Sync`](element, input);
                break;
            }
            case "insert": {
                this.insertSync(element, input);
                break;
            }
            case "delete": {
                this.deleteSync(element);
                break;
            }
            case "sort": {
                var { by, direction, deep } = input;
                this.sortSync(element, by, direction, deep);
            }
        }
    }
    setcallbackquery(callback) {
        __classPrivateFieldSet(this, _TreeLinear_callbackquery, callback, "f");
    }
    isopend(element) {
        element = this.convertto(element, "element");
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
    }
    isclosed(element) {
        element = this.convertto(element, "element");
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isclosed).call(this, element);
    }
    open(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        element = this.convertto(element, "element");
        if (this.issubtree(element))
            throw Error("Cannot Be open element not subtree element");
        else
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element);
    }
    close(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        element = this.convertto(element, "element");
        if (this.issubtree(element))
            throw Error("Cannot Be open element not subtree element");
        else
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
    }
    toggle(element = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f")) {
        element = this.convertto(element, "element");
        if (this.issubtree(element))
            throw Error("Cannot Be open element not subtree element");
        else
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
    }
    submit(type = "call", element = this.ELEMENT_DIRECTION) {
        if (!this.SELECTD_ELEMENTS.length || this.issubtree(element))
            return;
        this.onSubmitFunctions.forEach((fn) => fn(type, element));
    }
    jsontree(element) {
        return {
            body: super.json(element),
            innerTree: this.issubtree(element)
                ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).map((ele) => this.jsontree(ele))
                : [],
        };
    }
    async copy() {
        var selectedElement = this.SELECTD_ELEMENTS;
        await navigator.clipboard.writeText(JSON.stringify(selectedElement.map((ele) => this.jsontree(ele)), undefined, 1));
    }
    async cut(timeout = 20, limit = 1) {
        var selectedElement = this.SELECTD_ELEMENTS;
        await navigator.clipboard.writeText(JSON.stringify(selectedElement.map((ele) => this.jsontree(ele)), undefined, 1));
        selectedElement.forEach((element) => this.delete(element, timeout, limit));
    }
    async paste(timeout = 20, limit = 1) {
        this.throwLoading();
        var data = JSON.parse(await navigator.clipboard.readText());
        if (!Array.isArray(data))
            throw Error("paste ignore");
        var selected = this.SELECTD_ELEMENTS.filter((ele) => this.issubtree(ele));
        if (selected.length == data.length) {
            await forEachAsync(selected, async (element, index) => await this.insert(element, [data[index]], timeout, limit), timeout, limit);
        }
    }
    static create(title, defaultValue) {
        var tree = super.create(title, defaultValue);
        return tree;
    }
}
_TreeLinear_mainTreeElement = new WeakMap(), _TreeLinear_callbackquery = new WeakMap(), _TreeLinear_subtree_propertys = new WeakMap(), _TreeLinear_instances = new WeakSet(), _TreeLinear_isline = function _TreeLinear_isline(element) {
    return element.role == "line";
}, _TreeLinear_inner = function _TreeLinear_inner(element) {
    var initLvl = this.getlevel(element);
    var { nextElementSibling } = element;
    var result = [];
    while (nextElementSibling &&
        initLvl < this.getlevel(nextElementSibling)) {
        var ele = nextElementSibling;
        if (!__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isline).call(this, ele) && this.getlevel(ele) == initLvl + 1)
            result.push(ele);
        nextElementSibling = nextElementSibling.nextElementSibling;
    }
    return result;
}, _TreeLinear_outer = function _TreeLinear_outer(element) {
    var initLvl = this.getlevel(element);
    var { previousElementSibling } = element;
    while (previousElementSibling &&
        initLvl <= this.getlevel(previousElementSibling))
        previousElementSibling = previousElementSibling.previousElementSibling;
    return previousElementSibling;
}, _TreeLinear_to_query = function _TreeLinear_to_query(element) {
    if (element === __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return "";
    var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element);
    var data = this.readrow(element);
    if (!outer)
        return `${__classPrivateFieldGet(this, _TreeLinear_callbackquery, "f").call(this, data, 0)}`;
    else {
        var index = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, outer).indexOf(element);
        return `${__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_to_query).call(this, outer)}${this.separator}${__classPrivateFieldGet(this, _TreeLinear_callbackquery, "f").call(this, data, index)}`;
    }
}, _TreeLinear_to_element = function _TreeLinear_to_element(query) {
    var result = __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f");
    var spliting = query
        .split(this.separator)
        .map((content) => content.trim())
        .filter((s) => s !== "");
    for (let i = 0; i < spliting.length; i++) {
        if (!result)
            return null;
        var fd = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, result).find((element, index) => {
            var data = this.readrow(element);
            return __classPrivateFieldGet(this, _TreeLinear_callbackquery, "f").call(this, data, index) == spliting[i];
        });
        result = fd ? fd : null;
    }
    return result;
}, _TreeLinear_getLevelElement = function _TreeLinear_getLevelElement(element) {
    return element.querySelector(`[role="level"]`);
}, _TreeLinear_getIconElement = function _TreeLinear_getIconElement(element) {
    return element.querySelector(`[role="level"] > [role="icon"]`);
}, _TreeLinear_isopend = function _TreeLinear_isopend(element) {
    if (element == __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return true;
    if (!this.issubtree(element))
        return false;
    return element.ariaHidden === "false";
}, _TreeLinear_isclosed = function _TreeLinear_isclosed(element) {
    if (element == __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return false;
    if (!this.issubtree(element))
        return true;
    return element.ariaHidden === "true";
}, _TreeLinear_open = function _TreeLinear_open(element) {
    element.ariaHidden = "false";
    var showMoreIcon = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getIconElement).call(this, element);
    if (showMoreIcon)
        showMoreIcon.innerHTML = `<i class="material-icons">expand_more</i>`;
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).forEach((ele) => {
        this.setshow(ele, true);
        if (ele.ariaAutoComplete == "true") {
            ele.ariaAutoComplete = "false";
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, ele);
        }
    });
}, _TreeLinear_close = function _TreeLinear_close(element) {
    element.ariaHidden = "true";
    var showMoreIcon = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getIconElement).call(this, element);
    if (showMoreIcon)
        showMoreIcon.innerHTML = `<i class="material-icons">chevron_right</i>`;
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element).forEach((ele) => {
        this.setshow(ele, false);
        if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, ele)) {
            ele.ariaAutoComplete = "true";
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, ele);
        }
        else
            ele.ariaAutoComplete = "false";
    });
}, _TreeLinear_toggle = function _TreeLinear_toggle(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isclosed).call(this, element) ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element) : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
};
