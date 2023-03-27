var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _TreeLinear_instances, _TreeLinear_parentRoot, _TreeLinear_propertys, _TreeLinear_writable, _TreeLinear_hiddenPropertys, _TreeLinear_on_change_function, _TreeLinear_writingShortcut, _TreeLinear_callbackQuery, _TreeLinear_getWritable, _TreeLinear_setWritable, _TreeLinear_getLevel, _TreeLinear_outerTree, _TreeLinear_innerTree, _TreeLinear_open, _TreeLinear_close, _TreeLinear_isOpend, _TreeLinear_isClosed, _TreeLinear_toQuery, _TreeLinear_toElement, _TreeLinear_append, _TreeLinear_appendSync, _TreeLinear_after, _TreeLinear_afterSync, _TreeLinear_before, _TreeLinear_beforeSync, _TreeLinear_insertSync, _TreeLinear_insert, _TreeLinear_methode, _TreeLinear_methodeSync, _TreeLinear_delete;
import { KeyboardShortcut } from "./keyboard-shortcuts.js";
import { ListBox } from "./listbox.js";
import { createElement, defaultObject, forEachAsync } from "./utils.js";
export class TreeLinear extends ListBox {
    constructor(root, title, propertys, defProp) {
        super(root, title);
        this.defProp = defProp;
        _TreeLinear_instances.add(this);
        _TreeLinear_parentRoot.set(this, createElement("span", "", { "aria-level": -1 }));
        _TreeLinear_propertys.set(this, []);
        _TreeLinear_writable.set(this, true);
        _TreeLinear_hiddenPropertys.set(this, []);
        _TreeLinear_on_change_function.set(this, []);
        _TreeLinear_writingShortcut.set(this, KeyboardShortcut.create(`${this.title} - write`, `Ctrl${KeyboardShortcut.separatorShortcuts}Enter`, null).ondown(() => {
            var _a;
            if (!this.root.contains(document.activeElement))
                return;
            (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
        }));
        _TreeLinear_callbackQuery.set(this, (d, i) => `${i}`);
        __classPrivateFieldSet(this, _TreeLinear_propertys, propertys, "f");
        this.root.setAttribute("role", "table");
        this.root.tabIndex = -1;
        this.setEffective(__classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), false);
        this.shortcuts.clipboard = {
            copy: KeyboardShortcut.create(`${this.title} - copy`, `Ctrl${KeyboardShortcut.separatorShortcuts}C`, [this.root]).ondown(() => __awaiter(this, void 0, void 0, function* () {
                yield this.copy();
            })),
            paste: KeyboardShortcut.create(`${this.title} - paste`, `Ctrl${KeyboardShortcut.separatorShortcuts}V`, [this.root]).ondown(() => __awaiter(this, void 0, void 0, function* () {
                yield this.paste();
            })),
            cut: KeyboardShortcut.create(`${this.title} - cut`, `Ctrl${KeyboardShortcut.separatorShortcuts}X`, [this.root]).ondown(() => __awaiter(this, void 0, void 0, function* () {
                yield this.cut();
            })),
        };
        this.shortcuts.inner = {
            open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
                this.root,
            ]).ondown(() => {
                this.SELECT_ELEMENTS.forEach((ele) => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, ele)) {
                        var effective = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, ele).filter((ele) => this.getEffective(ele));
                        if (effective.length) {
                            this.setSelect(effective[0], true);
                            this.setSelect(ele, false);
                        }
                    }
                    else
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, ele);
                });
            }),
            close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
                this.root,
            ]).ondown(() => {
                this.SELECT_ELEMENTS.forEach((ele) => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, ele)) {
                        var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outerTree).call(this, ele);
                        outer && this.setSelect(outer, true) && this.setSelect(ele, false);
                    }
                    else
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, ele);
                });
            }),
        };
        this.root.prepend(__classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"));
    }
    get propertys() {
        return __classPrivateFieldGet(this, _TreeLinear_propertys, "f");
    }
    get hiddenPropertys() {
        return __classPrivateFieldGet(this, _TreeLinear_hiddenPropertys, "f");
    }
    set hiddenPropertys(v) {
        __classPrivateFieldSet(this, _TreeLinear_hiddenPropertys, v, "f");
        this.columns(__classPrivateFieldGet(this, _TreeLinear_propertys, "f")).forEach((eles) => eles.forEach((ele) => (ele.style.display = "")));
        this.columns(__classPrivateFieldGet(this, _TreeLinear_hiddenPropertys, "f")).forEach((eles) => eles.forEach((ele) => (ele.style.display = "none")));
    }
    getWritable() {
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getWritable).call(this);
    }
    setWritable(flag = true) {
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_setWritable).call(this, flag);
    }
    get DATA() {
        return this.read().innerTree;
    }
    get ITEMS() {
        return super.ITEMS.slice(1);
    }
    getCallbackQuery() {
        return __classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f");
    }
    setCallbackQuery(callback) {
        __classPrivateFieldSet(this, _TreeLinear_callbackQuery, callback, "f");
    }
    createRow(feild, level) {
        feild = defaultObject(feild, this.defProp);
        const result = createElement("div", "", {
            role: "treeitem",
            "aria-level": level,
        });
        var row = createElement("div", "", { role: "row" });
        result.appendChild(row);
        __classPrivateFieldGet(this, _TreeLinear_propertys, "f").forEach((prop) => {
            var col = createElement("span", `${feild[prop]}`, { role: "col" });
            col.style.display = this.hiddenPropertys.includes(prop) ? "none" : "";
            row.appendChild(col);
        });
        return result;
    }
    readRow(element) {
        var o = Object.create(null);
        o.row = element;
        if (o.row == __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"))
            return o;
        var row = Array.from(element.children).find((ele) => ele.getAttribute("role") == "row");
        if (!row)
            return o;
        var columns = Array.from(row.children).filter((ele) => ele.getAttribute("role") == "col");
        __classPrivateFieldGet(this, _TreeLinear_propertys, "f").forEach((prop, index) => {
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
    }
    read(element = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f")) {
        var body = this.readRow(element);
        return {
            body,
            innerTree: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).map((ele) => this.read(ele)),
        };
    }
    innerTree(element) {
        element = this.convertTo(element, "element");
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    }
    outerTree(element) {
        element = this.convertTo(element, "element");
        return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outerTree).call(this, element);
    }
    open(element) {
        element = this.convertTo(element, "element");
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element);
    }
    close(element) {
        element = this.convertTo(element, "element");
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
    }
    isOpend(element) {
        element = this.convertTo(element, "element");
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
    }
    isClosed(element) {
        element = this.convertTo(element, "element");
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element);
    }
    convertTo(element, to) {
        return (to == "element"
            ? typeof element == "string"
                ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toElement).call(this, element)
                : element
            : typeof element == "string"
                ? element
                : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, element));
    }
    methode(method, direction = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), timeout, limit, ...data) {
        return __awaiter(this, void 0, void 0, function* () {
            direction = this.convertTo(direction, "element");
            direction &&
                (yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_methode).call(this, method, direction, timeout, limit, ...data));
        });
    }
    methodeSync(method, direction = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), ...data) {
        direction = this.convertTo(direction, "element");
        direction && __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_methodeSync).call(this, method, direction, ...data);
    }
    delete(direction) {
        return __awaiter(this, void 0, void 0, function* () {
            var element = this.convertTo(direction, "element");
            element && (yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_delete).call(this, element));
        });
    }
    json(...elements) {
        var fn = (treeContent) => {
            var body = Object.create(null);
            __classPrivateFieldGet(this, _TreeLinear_propertys, "f").forEach((prop) => (body[prop] = treeContent.body[prop]));
            return {
                body,
                innerTree: treeContent.innerTree.map((content) => fn(content)),
            };
        };
        return elements.map((element) => fn(this.read(element)));
    }
    copy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(JSON.stringify(this.json(...this.SELECT_ELEMENTS), undefined, 1));
        });
    }
    paste() {
        return __awaiter(this, void 0, void 0, function* () {
            var content = JSON.parse(yield navigator.clipboard.readText());
            var array = (Array.isArray(content) ? content : [content]);
            var last = this.LAST_ELEMENT_SELECT;
            console.log(last);
            last
                ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, last, 200, 2, ...array)
                : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), 20, 2, ...array);
        });
    }
    cut() {
        return __awaiter(this, void 0, void 0, function* () {
            var elements = this.SELECT_ELEMENTS;
            yield navigator.clipboard.writeText(JSON.stringify(this.json(...elements), undefined, 1));
            yield forEachAsync(elements, (ele) => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_delete).call(this, ele), 20, 1);
        });
    }
    columns(propertys) {
        var indexes = propertys.map((prop) => __classPrivateFieldGet(this, _TreeLinear_propertys, "f").indexOf(prop));
        return this.ITEMS.map((ele) => {
            var finded = Array.from(ele.children).find((e) => e.getAttribute("role") == "row");
            if (!finded)
                return [];
            ele = finded;
            var columns = Array.from(ele.children).filter((e) => e.getAttribute("role") == "col");
            return indexes.map((i) => columns[i]);
        });
    }
    static create(title, def) {
        var root = createElement("div", "", {});
        const tb = new this(root, title, Object.keys(def), def);
        return tb;
    }
}
_TreeLinear_parentRoot = new WeakMap(), _TreeLinear_propertys = new WeakMap(), _TreeLinear_writable = new WeakMap(), _TreeLinear_hiddenPropertys = new WeakMap(), _TreeLinear_on_change_function = new WeakMap(), _TreeLinear_writingShortcut = new WeakMap(), _TreeLinear_callbackQuery = new WeakMap(), _TreeLinear_instances = new WeakSet(), _TreeLinear_getWritable = function _TreeLinear_getWritable() {
    return __classPrivateFieldGet(this, _TreeLinear_writable, "f");
}, _TreeLinear_setWritable = function _TreeLinear_setWritable(flag) {
    __classPrivateFieldSet(this, _TreeLinear_writable, Boolean(flag), "f");
}, _TreeLinear_getLevel = function _TreeLinear_getLevel(element) {
    return +`${element.ariaLevel}`;
}, _TreeLinear_outerTree = function _TreeLinear_outerTree(element) {
    var level = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
    var { previousElementSibling } = element;
    while (previousElementSibling &&
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, previousElementSibling) >= level)
        previousElementSibling = previousElementSibling.previousElementSibling;
    return previousElementSibling == __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f")
        ? null
        : previousElementSibling;
}, _TreeLinear_innerTree = function _TreeLinear_innerTree(element) {
    var level = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
    var nextElementSibling = element.nextElementSibling;
    var lvl;
    var result = [];
    while (nextElementSibling &&
        (lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, nextElementSibling)) > level) {
        level + 1 === lvl && result.push(nextElementSibling);
        nextElementSibling = nextElementSibling.nextElementSibling;
    }
    return result;
}, _TreeLinear_open = function _TreeLinear_open(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).forEach((ele) => {
        ele.style.display = "";
        if (ele.hasAttribute("inneropened")) {
            ele.removeAttribute("inneropened");
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, ele);
        }
    });
}, _TreeLinear_close = function _TreeLinear_close(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).forEach((ele) => {
        ele.style.display = "none";
        if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, ele)) {
            ele.setAttribute("inneropened", "");
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, ele);
        }
        else
            ele.removeAttribute("inneropened");
    });
}, _TreeLinear_isOpend = function _TreeLinear_isOpend(element) {
    return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).every((ele) => ele.style.display !== "none");
}, _TreeLinear_isClosed = function _TreeLinear_isClosed(element) {
    return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).every((ele) => ele.style.display === "none");
}, _TreeLinear_toQuery = function _TreeLinear_toQuery(element = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f")) {
    var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outerTree).call(this, element);
    var inner = outer ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, outer) : [];
    var index = inner.indexOf(element);
    return ((outer ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, outer) + "/" : "") +
        __classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, this.readRow(element), index));
}, _TreeLinear_toElement = function _TreeLinear_toElement(query) {
    var array = query.split("/");
    var element = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f");
    for (let i = 0; i < array.length; i++) {
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
        var finded = inner.find((ele, index) => __classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, this.readRow(ele), index) === array[i]);
        if (!finded)
            return null;
        element = finded;
    }
    return element;
}, _TreeLinear_append = function _TreeLinear_append(element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element) + 1;
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
        element = inner.length ? inner[inner.length - 1] : element;
        yield forEachAsync(data.reverse(), (d) => {
            element.after(this.createRow(d, lvl));
        }, timeout, limit);
    });
}, _TreeLinear_appendSync = function _TreeLinear_appendSync(element, ...data) {
    var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element) + 1;
    var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    element = inner.length ? inner[inner.length - 1] : element;
    data.reverse().forEach((d) => element.after(this.createRow(d, lvl)));
}, _TreeLinear_after = function _TreeLinear_after(element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
        while (inner.length) {
            element = inner[inner.length - 1];
            inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
        }
        yield forEachAsync(data.reverse(), (d) => element.after(this.createRow(d, lvl)), timeout, limit);
    });
}, _TreeLinear_afterSync = function _TreeLinear_afterSync(element, ...data) {
    var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
    var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    while (inner.length) {
        element = inner[inner.length - 1];
        inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    }
    data.reverse().forEach((d) => element.after(this.createRow(d, lvl)));
}, _TreeLinear_before = function _TreeLinear_before(element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
        yield forEachAsync(data, (d) => element.before(this.createRow(d, lvl)), timeout, limit);
    });
}, _TreeLinear_beforeSync = function _TreeLinear_beforeSync(element, ...data) {
    var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
    data.forEach((d) => element.before(this.createRow(d, lvl)));
}, _TreeLinear_insertSync = function _TreeLinear_insertSync(element, ...tree) {
    var level = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element) + 1;
    tree.forEach(({ body, innerTree }) => {
        var ele = this.createRow(body, level);
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
        var mainElement = inner.length ? inner[inner.length - 1] : element;
        mainElement.after(ele);
        Array.isArray(innerTree) &&
            innerTree.length &&
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insertSync).call(this, ele, ...innerTree);
    });
}, _TreeLinear_insert = function _TreeLinear_insert(element, timeout, limit, ...tree) {
    return __awaiter(this, void 0, void 0, function* () {
        var level = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element) + 1;
        yield forEachAsync(tree, ({ body, innerTree }) => __awaiter(this, void 0, void 0, function* () {
            var ele = this.createRow(body, level);
            var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
            var mainElement = inner.length ? inner[inner.length - 1] : element;
            mainElement.after(ele);
            Array.isArray(innerTree) &&
                innerTree.length &&
                (yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, ele, timeout, limit, ...innerTree));
        }), timeout, limit);
    });
}, _TreeLinear_methode = function _TreeLinear_methode(name, element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (name) {
            case "append": {
                yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_append).call(this, element, timeout, limit, ...data);
                break;
            }
            case "after": {
                yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_after).call(this, element, timeout, limit, ...data);
                break;
            }
            case "before": {
                yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_before).call(this, element, timeout, limit, ...data);
                break;
            }
            case "insert": {
                yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, element, timeout, limit, ...data);
                break;
            }
        }
        __classPrivateFieldGet(this, _TreeLinear_on_change_function, "f").forEach((fn) => fn());
    });
}, _TreeLinear_methodeSync = function _TreeLinear_methodeSync(name, element, ...data) {
    switch (name) {
        case "append": {
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_appendSync).call(this, element, ...data);
            break;
        }
        case "after": {
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_afterSync).call(this, element, ...data);
            break;
        }
        case "before": {
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_beforeSync).call(this, element, ...data);
            break;
        }
        case "insert": {
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insertSync).call(this, element, ...data);
            break;
        }
    }
    __classPrivateFieldGet(this, _TreeLinear_on_change_function, "f").forEach((fn) => fn());
}, _TreeLinear_delete = function _TreeLinear_delete(element) {
    return __awaiter(this, void 0, void 0, function* () {
        yield forEachAsync(__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element), (ele) => __awaiter(this, void 0, void 0, function* () { return yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_delete).call(this, ele); }), 4, 1);
        element.remove();
    });
};
