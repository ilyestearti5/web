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
var _TreeLinear_instances, _TreeLinear_parentRoot, _TreeLinear_propertys, _TreeLinear_writable, _TreeLinear_hiddenPropertys, _TreeLinear_on_change_function, _TreeLinear_writingShortcut, _TreeLinear_history, _TreeLinear_callbackQuery, _TreeLinear_getWritable, _TreeLinear_setWritable, _TreeLinear_getLevel, _TreeLinear_outerTree, _TreeLinear_innerTree, _TreeLinear_open, _TreeLinear_close, _TreeLinear_toggle, _TreeLinear_isOpend, _TreeLinear_isClosed, _TreeLinear_toQuery, _TreeLinear_toElement, _TreeLinear_append, _TreeLinear_appendSync, _TreeLinear_after, _TreeLinear_afterSync, _TreeLinear_before, _TreeLinear_beforeSync, _TreeLinear_insertSync, _TreeLinear_insert, _TreeLinear_childs, _TreeLinear_methode, _TreeLinear_methodeSync, _TreeLinear_deleteSync, _TreeLinear_delete, _TreeLinear_sortSync, _TreeLinear_sort;
import { Delay } from "./delay.js";
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
        _TreeLinear_history.set(this, []);
        _TreeLinear_callbackQuery.set(this, (d, i) => `${i}`);
        this.separator = "/";
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
        this.rowString = "treeitem";
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
    get history() {
        return __classPrivateFieldGet(this, _TreeLinear_history, "f");
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
    createRow(feild, level, closed = false) {
        feild = defaultObject(feild, this.defProp);
        const result = createElement("div", "", {
            role: "treeitem",
            "aria-level": level,
            draggable: this.dragging,
        });
        result.style.display = closed ? "none" : "";
        const span = createElement("span", "", { role: "open-close" });
        result.appendChild(span);
        span.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, result);
        var row = createElement("div", "", { role: "row" });
        result.appendChild(row);
        __classPrivateFieldGet(this, _TreeLinear_propertys, "f").forEach((prop) => {
            var col = createElement("span", `${feild[prop]}`, { role: "col" });
            col.ondblclick = () => __classPrivateFieldGet(this, _TreeLinear_writable, "f") && (col.contentEditable = "true");
            col.onblur = () => (col.contentEditable = "false");
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
    toggle(element) {
        element = this.convertTo(element, "element");
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, element);
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
            var element = direction;
            direction = this.convertTo(direction, "element");
            if (direction) {
                yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_methode).call(this, method, direction, timeout, limit, ...data);
                this.history.push({
                    event: method,
                    content: [
                        {
                            data: this.json(direction),
                            query: typeof element == "string" ? element : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, element),
                        },
                    ],
                });
            }
        });
    }
    methodeSync(method, direction = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), ...data) {
        var element = direction;
        direction = this.convertTo(direction, "element");
        if (direction) {
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_methodeSync).call(this, method, direction, ...data);
            this.history.push({
                event: method,
                content: [
                    {
                        data: this.json(direction),
                        query: typeof element == "string" ? element : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, element),
                    },
                ],
            });
        }
    }
    deleteSync(...directions) {
        var content = [];
        directions.forEach((direction) => {
            var element = this.convertTo(direction, "element");
            if (element) {
                content.push({
                    data: this.json(element),
                    query: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, element),
                });
                __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_deleteSync).call(this, element);
            }
        });
        __classPrivateFieldGet(this, _TreeLinear_history, "f").push({ content, event: "delete" });
    }
    delete(...directions) {
        return __awaiter(this, void 0, void 0, function* () {
            var content = [];
            for (let i = 0; i < directions.length; i++) {
                var element = this.convertTo(directions[i], "element");
                if (element) {
                    content.push({
                        data: this.json(element),
                        query: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, element),
                    });
                    yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_delete).call(this, element);
                }
            }
            __classPrivateFieldGet(this, _TreeLinear_history, "f").push({ content, event: "delete" });
        });
    }
    sortSync(sortBy, direction, element, deep) {
        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_sortSync).call(this, sortBy, direction, element, deep);
    }
    sort(key, direction, element, deep = true, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            element = this.convertTo(element, "element");
            element &&
                (yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_sort).call(this, key, direction, element, deep, timeout, limit));
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
            var selectionElement = this.SELECT_ELEMENTS;
            var json = this.json(...selectionElement);
            yield navigator.clipboard.writeText(JSON.stringify(json, undefined, 1));
            var content = json.map((info, index) => {
                return {
                    data: [info],
                    query: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, selectionElement[index]),
                };
            });
            __classPrivateFieldGet(this, _TreeLinear_history, "f").push({
                content,
                event: "copy",
            });
        });
    }
    paste() {
        return __awaiter(this, void 0, void 0, function* () {
            var json = JSON.parse(yield navigator.clipboard.readText());
            var array = (Array.isArray(json) ? json : [json]);
            var { SELECT_ELEMENTS } = this;
            var content = [];
            if (SELECT_ELEMENTS.length == array.length) {
                content = SELECT_ELEMENTS.map((ele, index) => {
                    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, ele, 130, 2, array[index]);
                    return {
                        data: [array[index]],
                        query: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, ele),
                    };
                });
            }
            else if (SELECT_ELEMENTS.length) {
                content = SELECT_ELEMENTS.map((ele) => {
                    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, ele, 130, 2, ...array);
                    return {
                        data: array,
                        query: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, ele),
                    };
                });
            }
            else {
                __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), 130, 2, ...array);
                content = [{ data: array, query: "" }];
            }
            if (content.length)
                __classPrivateFieldGet(this, _TreeLinear_history, "f").push({ content, event: "paste" });
        });
    }
    cut() {
        return __awaiter(this, void 0, void 0, function* () {
            var elements = this.SELECT_ELEMENTS;
            var json = this.json(...elements);
            yield navigator.clipboard.writeText(JSON.stringify(json, undefined, 1));
            yield forEachAsync(elements, (ele) => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_delete).call(this, ele), 130, 2);
            var content = json.map((data, i) => {
                return {
                    data: [data],
                    query: __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, elements[i]),
                };
            });
            __classPrivateFieldGet(this, _TreeLinear_history, "f").push({ content, event: "cut" });
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
_TreeLinear_parentRoot = new WeakMap(), _TreeLinear_propertys = new WeakMap(), _TreeLinear_writable = new WeakMap(), _TreeLinear_hiddenPropertys = new WeakMap(), _TreeLinear_on_change_function = new WeakMap(), _TreeLinear_writingShortcut = new WeakMap(), _TreeLinear_history = new WeakMap(), _TreeLinear_callbackQuery = new WeakMap(), _TreeLinear_instances = new WeakSet(), _TreeLinear_getWritable = function _TreeLinear_getWritable() {
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
        this.setEffective(ele, true);
        if (ele.hasAttribute("inneropened")) {
            ele.removeAttribute("inneropened");
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, ele);
        }
    });
}, _TreeLinear_close = function _TreeLinear_close(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).forEach((ele) => {
        ele.style.display = "none";
        this.setEffective(ele, false);
        if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, ele)) {
            ele.setAttribute("inneropened", "");
            __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, ele);
        }
        else
            ele.removeAttribute("inneropened");
    });
}, _TreeLinear_toggle = function _TreeLinear_toggle(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element) ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element) : __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_close).call(this, element);
}, _TreeLinear_isOpend = function _TreeLinear_isOpend(element) {
    return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).every((ele) => ele.style.display !== "none");
}, _TreeLinear_isClosed = function _TreeLinear_isClosed(element) {
    return __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).every((ele) => ele.style.display === "none");
}, _TreeLinear_toQuery = function _TreeLinear_toQuery(element = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f")) {
    if (element == __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"))
        return "";
    var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outerTree).call(this, element);
    var inner = outer ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, outer) : [];
    var index = inner.indexOf(element);
    return ((outer ? __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toQuery).call(this, outer) + this.separator : "") +
        __classPrivateFieldGet(this, _TreeLinear_callbackQuery, "f").call(this, this.readRow(element), index));
}, _TreeLinear_toElement = function _TreeLinear_toElement(query) {
    query = query.trim();
    if (query == "")
        return __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f");
    var array = query.split(this.separator);
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
        var isClosed = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isClosed).call(this, element);
        element = inner.length ? inner[inner.length - 1] : element;
        yield forEachAsync(data.reverse(), (d) => element.after(this.createRow(d, lvl, isClosed)), timeout, limit);
    });
}, _TreeLinear_appendSync = function _TreeLinear_appendSync(element, ...data) {
    var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element) + 1;
    var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    var isClosed = !__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
    element = inner.length ? inner[inner.length - 1] : element;
    data
        .reverse()
        .forEach((d) => element.after(this.createRow(d, lvl, isClosed)));
}, _TreeLinear_after = function _TreeLinear_after(element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_childs).call(this, element);
        var isClosed = element.style.display == "none";
        element = inner.length ? inner[inner.length - 1] : element;
        yield forEachAsync(data.reverse(), (d) => element.after(this.createRow(d, lvl, isClosed)), timeout, limit);
    });
}, _TreeLinear_afterSync = function _TreeLinear_afterSync(element, ...data) {
    var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
    var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    var isClosed = element.style.display == "none";
    while (inner.length) {
        element = inner[inner.length - 1];
        inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element);
    }
    data
        .reverse()
        .forEach((d) => element.after(this.createRow(d, lvl, isClosed)));
}, _TreeLinear_before = function _TreeLinear_before(element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
        var isClosed = element.style.display == "none";
        yield forEachAsync(data, (d) => element.before(this.createRow(d, lvl, isClosed)), timeout, limit);
    });
}, _TreeLinear_beforeSync = function _TreeLinear_beforeSync(element, ...data) {
    var lvl = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element);
    var isClosed = element.style.display == "none";
    data.forEach((d) => element.before(this.createRow(d, lvl, isClosed)));
}, _TreeLinear_insertSync = function _TreeLinear_insertSync(element, ...tree) {
    var level = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getLevel).call(this, element) + 1;
    var isClosed = !__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
    tree.forEach(({ body, innerTree }) => {
        var ele = this.createRow(body, level, isClosed);
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
        var isClosed = !__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isOpend).call(this, element);
        yield forEachAsync(tree, ({ body, innerTree }) => __awaiter(this, void 0, void 0, function* () {
            var ele = this.createRow(body, level, isClosed);
            var childs = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_childs).call(this, element);
            var mainElement = childs.length ? childs[childs.length - 1] : element;
            mainElement.after(ele);
            Array.isArray(innerTree) &&
                innerTree.length &&
                (yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_insert).call(this, ele, timeout, limit, ...innerTree));
        }), timeout, limit);
    });
}, _TreeLinear_childs = function _TreeLinear_childs(element) {
    var result = [element];
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).forEach((ele) => result.push(...__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_childs).call(this, ele)));
    return result;
}, _TreeLinear_methode = function _TreeLinear_methode(event, element, timeout, limit, ...data) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (event) {
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
}, _TreeLinear_deleteSync = function _TreeLinear_deleteSync(element) {
    __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element).forEach((ele) => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_deleteSync).call(this, ele));
    element.remove();
}, _TreeLinear_delete = function _TreeLinear_delete(element) {
    return __awaiter(this, void 0, void 0, function* () {
        yield forEachAsync(__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_innerTree).call(this, element), (ele) => __awaiter(this, void 0, void 0, function* () { return yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_delete).call(this, ele); }), 4, 1);
        element.remove();
    });
}, _TreeLinear_sortSync = function _TreeLinear_sortSync(sortBy, direction, element = __classPrivateFieldGet(this, _TreeLinear_parentRoot, "f"), deep = true) {
    var tree = this.read(element).innerTree;
    for (let i = 0; i < tree.length; i++) {
        var { body } = tree[i];
        var { row } = body;
        deep && __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_sortSync).call(this, sortBy, direction, row);
        var j = i - 1;
        var prec = tree[j];
        while (prec &&
            (direction == "down"
                ? prec.body[sortBy] < body[sortBy]
                : prec.body[sortBy] > body[sortBy])) {
            j--;
            prec = tree[j];
        }
        var childs = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_childs).call(this, row);
        if (prec)
            prec.body.row.before(...childs);
        else
            element.after(...childs);
    }
}, _TreeLinear_sort = function _TreeLinear_sort(key, direction, element, deep = true, timeout, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        var dl = new Delay(timeout);
        var tree = this.read(element).innerTree;
        function childs(tree) {
            var result = [tree.body.row];
            tree.innerTree.forEach((tree) => result.push(...childs(tree)));
            return result;
        }
        for (let i = 0; i < tree.length; i++) {
            if (!(i % limit))
                yield dl.on();
            var o = tree[i];
            var { body, innerTree } = o;
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
            deep && (yield __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_sort).call(this, key, direction, row, true, timeout, limit));
            tree = this.read(element).innerTree;
        }
    });
};
