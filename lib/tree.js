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
var _Tree_instances, _Tree_subtreepropertys, _Tree_callbackquery, _Tree_mainTreeElement, _Tree_getitemelement, _Tree_getcontentelement, _Tree_getinnertreeelement, _Tree_getoutertreeelement, _Tree_inner, _Tree_outer, _Tree_toelement, _Tree_toquery;
import { Iterations } from "./iterations";
import { KeyboardShortcut } from "./keyboardshortcuts";
import { createElement } from "./utils";
export class Tree extends Iterations {
    constructor(root, title, propertys, defaultValues) {
        super(root, title, propertys, defaultValues);
        _Tree_instances.add(this);
        _Tree_subtreepropertys.set(this, []);
        _Tree_callbackquery.set(this, (d, i) => `${i}`);
        _Tree_mainTreeElement.set(this, void 0);
        this.separator = "/";
        this.root.role = "tree";
        this.rowname = "treegrid";
        __classPrivateFieldSet(this, _Tree_mainTreeElement, this.createrow(this.defaultValues), "f");
        __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getcontentelement).call(this, __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")).innerHTML = "";
        __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getitemelement).call(this, __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")).style.display = "none";
        this.root.prepend(__classPrivateFieldGet(this, _Tree_mainTreeElement, "f"));
        if (this.shortcuts.find) {
            this.shortcuts.find.forword.clear("down");
            this.shortcuts.find.forword.ondown(({ Keys }) => {
                if (!Keys)
                    return;
                var ky = KeyboardShortcut.keyOf(Keys[0]);
                var { EFFECTIVE_ELEMENTS: effeEle, MIN_ELEMENT_EFFECTIVE: minEff, ELEMENT_DIRECTION: eleDir, } = this;
                var findFrom = eleDir || minEff;
                if (!findFrom)
                    return;
                var index = effeEle.indexOf(findFrom);
                var get = effeEle
                    .slice(index + 1)
                    .find((ele) => `${this.readrow(ele)[this.searcherKey]}`[0].toUpperCase() == ky);
                if (get)
                    this.select(get);
            });
            this.shortcuts.find.backword.clear("down");
            this.shortcuts.find.backword.ondown(({ Keys }) => {
                if (!Keys)
                    return;
                var ky = KeyboardShortcut.keyOf(Keys[0]);
                var { EFFECTIVE_ELEMENTS: effeEle, MIN_ELEMENT_EFFECTIVE: minEff, ELEMENT_DIRECTION: eleDir, } = this;
                var findFrom = eleDir || minEff;
                effeEle = effeEle.reverse();
                if (!findFrom)
                    return;
                var index = effeEle.indexOf(findFrom);
                var get = effeEle
                    .slice(index + 1)
                    .find((ele) => `${this.readrow(ele)[this.searcherKey]}`[0].toUpperCase() === ky);
                if (get)
                    this.select(get);
            });
        }
        this.shortcuts.inner = {
            open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
                this.root,
            ]).ondown(() => {
                this.SELECTD_ELEMENTS.forEach((ele) => {
                    if (this.isopend(ele)) {
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
            close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
                this.root,
            ]).ondown(() => {
                this.SELECTD_ELEMENTS.forEach((ele) => {
                    if (this.isopend(ele))
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
        this.shortcuts.status.submit.ondown((cmb, event) => {
            this.SELECTD_ELEMENTS.forEach((ele) => this.issubtree(ele) && this.open(ele));
        });
    }
    get ITEMS() {
        var fn = (element) => {
            var inner = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element);
            var result = [];
            inner.map((ele) => {
                result.push(ele, ...fn(ele));
            });
            return result;
        };
        return fn(__classPrivateFieldGet(this, _Tree_mainTreeElement, "f"));
    }
    convertto(any, to) {
        return (to == "element"
            ? typeof any == "string"
                ? __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_toelement).call(this, any)
                : any
            : typeof any == "string"
                ? any
                : __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_toquery).call(this, any));
    }
    forword(count) {
        if (!count) {
            this.configurations.scrolling && this.scroll("forword");
            return;
        }
        var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir, MIN_ELEMENT_EFFECTIVE: minEff, } = this;
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
            this.configurations.scrolling && this.scroll("backword");
            return;
        }
        var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir, MAX_ELEMENT_EFFCTIVE: maxEff, } = this;
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
        this.configurations.scrolling && this.scroll("forword");
    }
    createrow(input) {
        var treeitem = super.createrow(input);
        treeitem.role = "treeitem";
        var result = createElement("div", "", { role: this.rowname });
        result.appendChild(treeitem);
        if (this.issubtree(result)) {
            var subtree = createElement("div", "", { role: "tree" });
            result.appendChild(subtree);
        }
        return result;
    }
    readrow(element) {
        var o = super.readrow(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getitemelement).call(this, element));
        o.row = element;
        return o;
    }
    submit(type, element) {
        if (this.issubtree(element))
            return;
        super.submit(type, element);
    }
    issubtree(element) {
        if (__classPrivateFieldGet(this, _Tree_mainTreeElement, "f") == element)
            return true;
        var columns = this.columns(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getitemelement).call(this, element));
        return __classPrivateFieldGet(this, _Tree_subtreepropertys, "f").every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML == value);
    }
    setsubtreepropertys(...propertys) {
        __classPrivateFieldSet(this, _Tree_subtreepropertys, propertys, "f");
        this.ITEMS.forEach((element) => {
            if (this.issubtree(element)) {
                if (!__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element)) {
                    var subtree = createElement("div", "", { role: "tree" });
                    element.appendChild(subtree);
                }
            }
            else {
                __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element)?.remove();
            }
        });
    }
    setcallbackquery(callback) {
        __classPrivateFieldSet(this, _Tree_callbackquery, callback, "f");
    }
    appendSync(element, data) {
        this.throwLoading();
        if (!this.issubtree(element))
            return;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        subtreeElement.append(...data.map((input) => this.createrow(input)));
    }
    prependSync(element, data) {
        this.throwLoading();
        if (!this.issubtree(element))
            return;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        subtreeElement.prepend(...data.map((input) => this.createrow(input)));
    }
    beforeSync(element, data) {
        this.throwLoading();
        element.before(...data.map((input) => this.createrow(input)));
    }
    afterSync(element, data) {
        this.throwLoading();
        element.after(...data.reverse().map((input) => this.createrow(input)));
    }
    insertSync(element, data) {
        this.throwLoading();
        if (!this.issubtree(element))
            return;
        var subtreeElement = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        data.forEach(({ body, innerTree }) => {
            var row = this.createrow(body);
            subtreeElement.appendChild(row);
            Array.isArray(innerTree) &&
                innerTree.length &&
                this.insertSync(row, innerTree);
        });
    }
    methodeSync(event, any, data) {
        any = this.convertto(any, "element");
        switch (event) {
            case "append": {
            }
            case "prepend": {
            }
            case "after": {
            }
            case "before": {
                this[`${event}Sync`](any, data);
                break;
            }
            case "insert": {
                this.insertSync(any, data);
                break;
            }
        }
    }
    static create(title, defaultValue) {
        return super.create(title, defaultValue);
    }
    isopend(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        if (ele)
            return ele.style.display !== "none";
        else
            return false;
    }
    isclosed(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        if (ele)
            return ele.style.display === "none";
        else
            return true;
    }
    open(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        if (ele) {
            ele.style.display = "";
            __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).forEach((e) => this.setEffective(e, true));
        }
    }
    close(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        if (ele) {
            ele.style.display = "none";
            __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).forEach((e) => this.setEffective(e, false));
        }
    }
    toggle(element) {
        var ele = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
        if (ele) {
            let { display } = ele.style;
            __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, element).forEach((e) => this.setEffective(e, display !== "none"));
            ele.style.display = display == "none" ? "" : "none";
        }
    }
}
_Tree_subtreepropertys = new WeakMap(), _Tree_callbackquery = new WeakMap(), _Tree_mainTreeElement = new WeakMap(), _Tree_instances = new WeakSet(), _Tree_getitemelement = function _Tree_getitemelement(element) {
    return Array.from(element.children).find((ele) => ele.role == "treeitem");
}, _Tree_getcontentelement = function _Tree_getcontentelement(element) {
    return Array.from(__classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getitemelement).call(this, element).children).find((ele) => ele.role == "content");
}, _Tree_getinnertreeelement = function _Tree_getinnertreeelement(element) {
    return Array.from(element.children).find((ele) => ele.role == "tree");
}, _Tree_getoutertreeelement = function _Tree_getoutertreeelement(element) {
    var result = element.closest(`[role="tree"]`);
    return result && this.root.contains(result) ? result : null;
}, _Tree_inner = function _Tree_inner(element) {
    var innerTree = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_getinnertreeelement).call(this, element);
    return innerTree ? Array.from(innerTree.children) : [];
}, _Tree_outer = function _Tree_outer(element) {
    var result = element.parentElement.closest(`[role="${this.rowname}"]`);
    return result && this.root.contains(result)
        ? result
        : null;
}, _Tree_toelement = function _Tree_toelement(query) {
    var spliting = query
        .split(this.separator)
        .map((s) => s.trim())
        .filter((s) => s !== "");
    var result = __classPrivateFieldGet(this, _Tree_mainTreeElement, "f");
    for (let i = 0; i < spliting.length; i++) {
        if (!result)
            return null;
        var inner = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_inner).call(this, result);
        var fdElement = inner.find((e, index) => __classPrivateFieldGet(this, _Tree_callbackquery, "f").call(this, this.readrow(e), index) == spliting[i]);
        result = fdElement || null;
    }
    return result;
}, _Tree_toquery = function _Tree_toquery(element) {
    if (element == __classPrivateFieldGet(this, _Tree_mainTreeElement, "f"))
        return "";
    var string = __classPrivateFieldGet(this, _Tree_callbackquery, "f").call(this, this.readrow(element), 0);
    var outer = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_outer).call(this, element);
    while (outer && outer !== __classPrivateFieldGet(this, _Tree_mainTreeElement, "f")) {
        string = `${__classPrivateFieldGet(this, _Tree_callbackquery, "f").call(this, this.readrow(outer), 0)}${this.separator}${string}`;
        outer = __classPrivateFieldGet(this, _Tree_instances, "m", _Tree_outer).call(this, element);
    }
    return string;
};
