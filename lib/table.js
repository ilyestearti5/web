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
var _Table_instances, _Table_propertys, _Table_writable, _Table_hiddenPropertys, _Table_writingShortcut, _Table_getWritable, _Table_setWritable, _Table_createRow, _Table_appendSync, _Table_append, _Table_prependSync, _Table_prepend, _Table_insertSync, _Table_insert, _Table_methodeSync, _Table_methode, _Table_deleteSync, _Table_delete, _Table_filterSync, _Table_filter;
import { ListBox } from "./listbox.js";
import { createElement, defaultObject, forEachAsync } from "./utils.js";
import { Delay } from "./delay.js";
import { KeyboardShortcut } from "./keyboard-shortcuts.js";
export class Table extends ListBox {
    constructor(root, title, propertys, defProp) {
        super(root, title);
        this.defProp = defProp;
        _Table_instances.add(this);
        _Table_propertys.set(this, []);
        _Table_writable.set(this, true);
        _Table_hiddenPropertys.set(this, []);
        _Table_writingShortcut.set(this, KeyboardShortcut.create(`${this.title} - write`, `Ctrl${KeyboardShortcut.separatorShortcuts}Enter`, null).ondown(() => {
            var _a;
            if (!this.root.contains(document.activeElement))
                return;
            (_a = document.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
        }));
        __classPrivateFieldSet(this, _Table_propertys, propertys, "f");
        this.root.setAttribute("role", "table");
        this.root.tabIndex = -1;
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
    }
    get propertys() {
        return __classPrivateFieldGet(this, _Table_propertys, "f");
    }
    get hiddenPropertys() {
        return __classPrivateFieldGet(this, _Table_hiddenPropertys, "f");
    }
    set hiddenPropertys(v) {
        __classPrivateFieldSet(this, _Table_hiddenPropertys, v, "f");
        this.columns(__classPrivateFieldGet(this, _Table_propertys, "f")).forEach((eles) => eles.forEach((ele) => (ele.style.display = "")));
        this.columns(__classPrivateFieldGet(this, _Table_hiddenPropertys, "f")).forEach((eles) => eles.forEach((ele) => (ele.style.display = "none")));
    }
    get DATA() {
        return this.ITEMS.map((data) => this.readRow(data));
    }
    get DATA_SELECT() {
        return this.SELECT_ELEMENTS.map((element) => this.readRow(element));
    }
    get DATA_EFFECTIVE() {
        return this.EFFECTIVE_ELEMENTS.map((element) => this.readRow(element));
    }
    getWritable() {
        return __classPrivateFieldGet(this, _Table_instances, "m", _Table_getWritable).call(this);
    }
    setWritable(flag = true) {
        __classPrivateFieldGet(this, _Table_instances, "m", _Table_setWritable).call(this, flag);
    }
    addTarget(...elements) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        (_a = this.shortcuts.move.forword.targets) === null || _a === void 0 ? void 0 : _a.push(...elements);
        (_b = this.shortcuts.move.backword.targets) === null || _b === void 0 ? void 0 : _b.push(...elements);
        (_c = this.shortcuts.selection.forword.targets) === null || _c === void 0 ? void 0 : _c.push(...elements);
        (_d = this.shortcuts.selection.backword.targets) === null || _d === void 0 ? void 0 : _d.push(...elements);
        (_f = (_e = this.shortcuts.clipboard) === null || _e === void 0 ? void 0 : _e.copy.targets) === null || _f === void 0 ? void 0 : _f.push(...elements);
        (_h = (_g = this.shortcuts.clipboard) === null || _g === void 0 ? void 0 : _g.paste.targets) === null || _h === void 0 ? void 0 : _h.push(...elements);
        (_k = (_j = this.shortcuts.clipboard) === null || _j === void 0 ? void 0 : _j.cut.targets) === null || _k === void 0 ? void 0 : _k.push(...elements);
    }
    readRow(element) {
        var o = Object.create(null);
        o.row = element;
        var columns = Array.from(element.children).filter((ele) => ele.getAttribute("role") == "col");
        __classPrivateFieldGet(this, _Table_propertys, "f").forEach((prop, index) => {
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
    methodeSync(event, config) {
        __classPrivateFieldGet(this, _Table_instances, "m", _Table_methodeSync).call(this, event, config);
    }
    methode(timeout, limit, event, config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _Table_instances, "m", _Table_methode).call(this, timeout, limit, event, config);
        });
    }
    sortSync(by, type = "down") {
        var data = this.DATA;
        var length = data.length;
        for (let i = 0; i < length; i++) {
            var info = data[i];
            var prec = info.row;
            while (prec &&
                (type == "down"
                    ? info[by] <= this.readRow(prec)[by]
                    : info[by] >= this.readRow(prec)[by]))
                prec = prec.previousElementSibling;
            prec ? prec.after(info.row) : this.root.prepend(info.row);
        }
    }
    sort(by, type = "down", timeout = 200, limit = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            var time = new Delay(timeout);
            var data = this.DATA;
            var length = data.length;
            for (let i = 0; i < length; i++) {
                if (i % limit == 0)
                    yield time.on();
                var info = data[i];
                var prec = info.row;
                while (prec &&
                    (type == "down"
                        ? info[by] <= this.readRow(prec)[by]
                        : info[by] >= this.readRow(prec)[by]))
                    prec = prec.previousElementSibling;
                prec ? prec.after(info.row) : this.root.prepend(info.row);
            }
        });
    }
    deleteSync(callback) {
        return __classPrivateFieldGet(this, _Table_instances, "m", _Table_deleteSync).call(this, callback);
    }
    delete(timeout, limit, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _Table_instances, "m", _Table_delete).call(this, timeout, limit, callback);
        });
    }
    filterSync(callback) {
        return __classPrivateFieldGet(this, _Table_instances, "m", _Table_filterSync).call(this, callback);
    }
    filter(timeout, limit, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return __classPrivateFieldGet(this, _Table_instances, "m", _Table_filter).call(this, timeout, limit, callback);
        });
    }
    columns(propertys) {
        var indexes = propertys.map((prop) => __classPrivateFieldGet(this, _Table_propertys, "f").indexOf(prop));
        return this.ITEMS.map((ele) => {
            var columns = Array.from(ele.children).filter((e) => e.getAttribute("role") == "col");
            return indexes.map((i) => columns[i]);
        });
    }
    json(...data) {
        return data.map((info) => {
            var result = Object.create(null);
            __classPrivateFieldGet(this, _Table_propertys, "f").forEach((prop) => (result[prop] = info[prop]));
            return result;
        });
    }
    copy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield navigator.clipboard.writeText(JSON.stringify(this.json(...this.DATA_SELECT)));
        });
    }
    paste() {
        return __awaiter(this, void 0, void 0, function* () {
            const { SELECT_ELEMENTS } = this;
            var content = JSON.parse(yield navigator.clipboard.readText());
            var array = (Array.isArray(content) ? content : [content]);
            var last = this.LAST_ELEMENT_SELECT;
            const length = SELECT_ELEMENTS.length;
            if (length == array.length)
                SELECT_ELEMENTS.forEach((ele, i) => __classPrivateFieldGet(this, _Table_instances, "m", _Table_insert).call(this, ele, 20, 2, array[i]));
            else if (SELECT_ELEMENTS.length)
                SELECT_ELEMENTS.forEach((ele) => __classPrivateFieldGet(this, _Table_instances, "m", _Table_insert).call(this, ele, 20, 2, ...array));
            else
                __classPrivateFieldGet(this, _Table_instances, "m", _Table_append).call(this, 20, 2, ...array);
        });
    }
    cut() {
        return __awaiter(this, void 0, void 0, function* () {
            var data = this.DATA_SELECT;
            yield navigator.clipboard.writeText(JSON.stringify(this.json(...data)));
            yield forEachAsync(data, ({ row }) => row.remove(), 20, 1);
        });
    }
    static create(title, def) {
        var root = createElement("div", "", {});
        const tb = new this(root, title, Object.keys(def), def);
        return tb;
    }
}
_Table_propertys = new WeakMap(), _Table_writable = new WeakMap(), _Table_hiddenPropertys = new WeakMap(), _Table_writingShortcut = new WeakMap(), _Table_instances = new WeakSet(), _Table_getWritable = function _Table_getWritable() {
    return __classPrivateFieldGet(this, _Table_writable, "f");
}, _Table_setWritable = function _Table_setWritable(flag) {
    __classPrivateFieldSet(this, _Table_writable, Boolean(flag), "f");
}, _Table_createRow = function _Table_createRow(config) {
    config = defaultObject(config, this.defProp);
    const result = createElement("div", "", {
        role: "row",
        draggable: this.dragging,
    });
    __classPrivateFieldGet(this, _Table_propertys, "f").forEach((prop) => {
        var span = createElement("span", `${config[prop]}`, {
            role: "col",
        });
        span.style.display = __classPrivateFieldGet(this, _Table_hiddenPropertys, "f").includes(prop) ? "none" : "";
        span.ondblclick = () => {
            if (!__classPrivateFieldGet(this, _Table_writable, "f"))
                return;
            span.contentEditable = "true";
            span.focus();
        };
        span.onblur = () => {
            if (!__classPrivateFieldGet(this, _Table_writable, "f"))
                return;
            span.contentEditable = "false";
        };
        result.appendChild(span);
    });
    return result;
}, _Table_appendSync = function _Table_appendSync(...info) {
    info.forEach((data) => {
        var row = __classPrivateFieldGet(this, _Table_instances, "m", _Table_createRow).call(this, data);
        this.root.appendChild(row);
    });
}, _Table_append = function _Table_append(timeout, limit, ...info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield forEachAsync(info, (data) => {
            var row = __classPrivateFieldGet(this, _Table_instances, "m", _Table_createRow).call(this, data);
            this.root.appendChild(row);
        }, timeout, limit);
    });
}, _Table_prependSync = function _Table_prependSync(...info) {
    info.reverse().forEach((data) => {
        var row = __classPrivateFieldGet(this, _Table_instances, "m", _Table_createRow).call(this, data);
        this.root.prepend(row);
    });
}, _Table_prepend = function _Table_prepend(timeout, limit, ...info) {
    return __awaiter(this, void 0, void 0, function* () {
        yield forEachAsync(info.reverse(), (data) => {
            var row = __classPrivateFieldGet(this, _Table_instances, "m", _Table_createRow).call(this, data);
            this.root.prepend(row);
        }, timeout, limit);
    });
}, _Table_insertSync = function _Table_insertSync(element, ...info) {
    info.reverse().forEach((data) => {
        var row = __classPrivateFieldGet(this, _Table_instances, "m", _Table_createRow).call(this, data);
        element.after(row);
    });
}, _Table_insert = function _Table_insert(element, timeout, limit, ...info) {
    return __awaiter(this, void 0, void 0, function* () {
        forEachAsync(info.reverse(), (data) => {
            var row = __classPrivateFieldGet(this, _Table_instances, "m", _Table_createRow).call(this, data);
            element.after(row);
        }, timeout, limit);
    });
}, _Table_methodeSync = function _Table_methodeSync(event, config) {
    var { data } = config;
    switch (event) {
        case "insert": {
            var { element } = config;
            __classPrivateFieldGet(this, _Table_instances, "m", _Table_insertSync).call(this, element, ...data);
        }
        case "append": {
            __classPrivateFieldGet(this, _Table_instances, "m", _Table_appendSync).call(this, ...data);
            break;
        }
        case "prepend": {
            __classPrivateFieldGet(this, _Table_instances, "m", _Table_prependSync).call(this, ...data);
            break;
        }
    }
}, _Table_methode = function _Table_methode(timeout, limit, event, config) {
    return __awaiter(this, void 0, void 0, function* () {
        var { data } = config;
        switch (event) {
            case "insert":
            case "append": {
                yield __classPrivateFieldGet(this, _Table_instances, "m", _Table_append).call(this, timeout, limit, ...data);
                break;
            }
            case "prepend": {
                yield __classPrivateFieldGet(this, _Table_instances, "m", _Table_prepend).call(this, timeout, limit, ...data);
                break;
            }
            case "insert": {
                var { element } = config;
                yield __classPrivateFieldGet(this, _Table_instances, "m", _Table_insert).call(this, element, timeout, limit, ...data);
            }
        }
    });
}, _Table_deleteSync = function _Table_deleteSync(callback) {
    return this.DATA.filter(callback).map((data) => {
        data.row.remove();
        return data;
    });
}, _Table_delete = function _Table_delete(timeout, limit, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        var array = [];
        yield forEachAsync(this.ITEMS, (element, index) => {
            var data = this.readRow(element);
            if (callback(data, index)) {
                data.row.remove();
                array.push(data);
            }
        }, timeout, limit);
        return array;
    });
}, _Table_filterSync = function _Table_filterSync(callback) {
    return this.DATA.filter((data, index) => {
        var a = callback(data, index);
        data.row.style.display = a ? "" : "none";
        this.setEffective(data.row, a);
        return a;
    });
}, _Table_filter = function _Table_filter(timeout, limit, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        var array = [];
        yield forEachAsync(this.ITEMS, (element, index) => {
            var data = this.readRow(element);
            var a = callback(data, index);
            data.row.style.display = a ? "" : "none";
            this.setEffective(data.row, a);
            a && array.push(data);
        }, timeout, limit);
        return array;
    });
};
