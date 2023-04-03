var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
var _Delay_counter, _Delay_is_loading, _KeyboardShortcut_instances, _a, _KeyboardShortcut_main_keys, _KeyboardShortcut_all, _KeyboardShortcut_keyboardKeys, _KeyboardShortcut_on_down_fn, _KeyboardShortcut_on_up_fn, _KeyboardShortcut_on_press_fn, _KeyboardShortcut_main_fn, _KeyboardShortcut_down, _KeyboardShortcut_up, _KeyboardShortcut_press, _KeyboardShortcut_activate, _KeyboardShortcut_propertys, _KeyboardShortcut_label, _KeyboardShortcut_change, _KeyboardShortcut_isValide, _KeyboardShortcut_toProp, _KeyboardShortcut_toString, _KeyboardShortcut_create, _KeyboardShortcut_exec, _KeyboardShortcut_execCommand, _KeyboardShortcut_watch, _KeyboardShortcut_keyOf, _b, _ListBox_selection_direction, _ListBox_all, _ListBox_pointer_down_function, _ListBox_click_function, _ListBox_drag_function, _Iterations_hiddenPropertys, _TreeLinear_instances, _TreeLinear_mainTreeElement, _TreeLinear_callbackquery, _TreeLinear_subtree_propertys, _TreeLinear_inner, _TreeLinear_outer, _TreeLinear_to_query, _TreeLinear_to_element, _TreeLinear_getLevelElement, _TreeLinear_getIconElement, _TreeLinear_isopend, _TreeLinear_isclosed, _TreeLinear_open, _TreeLinear_close, _TreeLinear_toggle, _c, _Graphe_all, _Graphe_points, _Graphe_origin, _Graphe_indexCopyed, _ToolBar_types;
import { forEachAsync, createElement, defaultObject, isLooked, scrollToElement, } from "./utils.js";
export class Delay {
    constructor(timeout) {
        this.timeout = timeout;
        _Delay_counter.set(this, 0);
        _Delay_is_loading.set(this, false);
    }
    get isLoading() {
        return __classPrivateFieldGet(this, _Delay_is_loading, "f");
    }
    on() {
        this.off();
        __classPrivateFieldSet(this, _Delay_is_loading, true, "f");
        return new Promise((rs) => {
            __classPrivateFieldSet(this, _Delay_counter, setTimeout(() => {
                rs();
                this.off();
            }, this.timeout), "f");
        });
    }
    off() {
        if (__classPrivateFieldGet(this, _Delay_is_loading, "f")) {
            clearTimeout(__classPrivateFieldGet(this, _Delay_counter, "f"));
            __classPrivateFieldSet(this, _Delay_is_loading, false, "f");
        }
    }
}
_Delay_counter = new WeakMap(), _Delay_is_loading = new WeakMap();
export class KeyboardShortcut {
    static get keyboardKeys() {
        return __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_keyboardKeys);
    }
    constructor(label, propertys) {
        _KeyboardShortcut_instances.add(this);
        _KeyboardShortcut_on_down_fn.set(this, []);
        _KeyboardShortcut_on_up_fn.set(this, []);
        _KeyboardShortcut_on_press_fn.set(this, []);
        _KeyboardShortcut_main_fn.set(this, (event) => {
            var { ctrlKey: Ctrl, altKey: Alt, shiftKey: Shift, key: k, type, keyCode, } = event;
            k = __classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_main_keys).includes(k)
                ? ""
                : k == " "
                    ? "Space"
                    : k;
            var o = {
                Ctrl,
                Alt,
                Shift,
                Keys: k == "" ? [] : [keyCode],
            };
            if (!__classPrivateFieldGet(this, _KeyboardShortcut_activate, "f") || !this.isValide(o))
                return;
            switch (type) {
                case "keydown": {
                    __classPrivateFieldGet(this, _KeyboardShortcut_on_down_fn, "f").forEach((fn) => fn(o, event, "key"));
                    break;
                }
                case "keyup": {
                    __classPrivateFieldGet(this, _KeyboardShortcut_on_up_fn, "f").forEach((fn) => fn(o, event, "key"));
                    break;
                }
                case "press": {
                    __classPrivateFieldGet(this, _KeyboardShortcut_on_press_fn, "f").forEach((fn) => fn(o, event, "key"));
                }
            }
        });
        _KeyboardShortcut_down.set(this, false);
        _KeyboardShortcut_up.set(this, false);
        _KeyboardShortcut_press.set(this, false);
        _KeyboardShortcut_activate.set(this, true);
        _KeyboardShortcut_propertys.set(this, {
            Ctrl: false,
            Shift: false,
            Alt: false,
            Keys: [],
        });
        this.targets = null;
        _KeyboardShortcut_label.set(this, "");
        if (Array.from(__classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_all)).some((s) => s.label == label))
            throw Error("Cannot be Used to Shortcut Has The Same Label");
        __classPrivateFieldSet(this, _KeyboardShortcut_label, label, "f");
        __classPrivateFieldSet(this, _KeyboardShortcut_propertys, propertys, "f");
        this.when.down = true;
        __classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_all).add(this);
    }
    get activate() {
        return __classPrivateFieldGet(this, _KeyboardShortcut_activate, "f");
    }
    set activate(v) {
        __classPrivateFieldSet(this, _KeyboardShortcut_activate, Boolean(v), "f");
    }
    get label() {
        return __classPrivateFieldGet(this, _KeyboardShortcut_label, "f");
    }
    get propertys() {
        return __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f");
    }
    get when() {
        var a = this;
        return {
            get down() {
                return __classPrivateFieldGet(a, _KeyboardShortcut_down, "f");
            },
            set down(v) {
                a.when = {
                    down: v,
                    up: __classPrivateFieldGet(a, _KeyboardShortcut_up, "f"),
                    press: __classPrivateFieldGet(a, _KeyboardShortcut_press, "f"),
                };
            },
            get up() {
                return __classPrivateFieldGet(a, _KeyboardShortcut_up, "f");
            },
            set up(v) {
                a.when = {
                    down: __classPrivateFieldGet(a, _KeyboardShortcut_down, "f"),
                    up: v,
                    press: __classPrivateFieldGet(a, _KeyboardShortcut_press, "f"),
                };
            },
            get press() {
                return __classPrivateFieldGet(a, _KeyboardShortcut_press, "f");
            },
            set press(v) {
                a.when = {
                    down: __classPrivateFieldGet(a, _KeyboardShortcut_down, "f"),
                    up: __classPrivateFieldGet(a, _KeyboardShortcut_up, "f"),
                    press: v,
                };
            },
        };
    }
    set when(v) {
        v.down = Boolean(v.down);
        v.up = Boolean(v.up);
        if (v.down != __classPrivateFieldGet(this, _KeyboardShortcut_down, "f")) {
            if (v.down)
                document.addEventListener("keydown", __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            else
                document.removeEventListener("keydown", __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            __classPrivateFieldSet(this, _KeyboardShortcut_down, v.down, "f");
        }
        if (v.up != __classPrivateFieldGet(this, _KeyboardShortcut_up, "f")) {
            if (v.up)
                document.addEventListener("keyup", __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            else
                document.removeEventListener("keyup", __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            __classPrivateFieldSet(this, _KeyboardShortcut_up, v.up, "f");
        }
        if (v.press != __classPrivateFieldGet(this, _KeyboardShortcut_press, "f")) {
            if (v.press)
                document.addEventListener("keypress", __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            else
                document.removeEventListener("keypress", __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            __classPrivateFieldSet(this, _KeyboardShortcut_press, v.press, "f");
        }
    }
    get text() {
        return __classPrivateFieldGet(KeyboardShortcut, _a, "m", _KeyboardShortcut_toString).call(KeyboardShortcut, __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f"));
    }
    get status() {
        return this.targets ? "local" : "global";
    }
    change(content) {
        __classPrivateFieldGet(this, _KeyboardShortcut_instances, "m", _KeyboardShortcut_change).call(this, content);
    }
    isValide(short) {
        return __classPrivateFieldGet(this, _KeyboardShortcut_instances, "m", _KeyboardShortcut_isValide).call(this, short);
    }
    ondown(listener) {
        typeof listener == "function" && __classPrivateFieldGet(this, _KeyboardShortcut_on_down_fn, "f").push(listener);
        return this;
    }
    onup(listener) {
        typeof listener == "function" && __classPrivateFieldGet(this, _KeyboardShortcut_on_up_fn, "f").push(listener);
        return this;
    }
    offdown(listener) {
        var index = __classPrivateFieldGet(this, _KeyboardShortcut_on_down_fn, "f").indexOf(listener);
        if (index < 0)
            return false;
        __classPrivateFieldGet(this, _KeyboardShortcut_on_down_fn, "f").splice(index, 1);
        return true;
    }
    offup(listener) {
        var index = __classPrivateFieldGet(this, _KeyboardShortcut_on_up_fn, "f").indexOf(listener);
        if (index < 0)
            return false;
        __classPrivateFieldGet(this, _KeyboardShortcut_on_up_fn, "f").splice(index, 1);
        return true;
    }
    on(event, listener) {
        return event == "down"
            ? this.ondown(listener)
            : event == "up"
                ? this.onup(listener)
                : this;
    }
    off(event, listener) {
        return event == "down"
            ? this.offdown(listener)
            : event == "up"
                ? this.offup(listener)
                : false;
    }
    static convertto(property, to) {
        return (to == "object"
            ? typeof property === "string"
                ? __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_toProp).call(this, property)
                : property
            : typeof property === "string"
                ? property
                : __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_toString).call(this, property));
    }
    static create(label = "", combinition = "", targets = null) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_create).call(this, label, combinition, targets);
    }
    static exec(combinition, ...press) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_exec).call(this, combinition, press);
    }
    static execCommand(label, press = ["down"]) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_execCommand).call(this, label, press);
    }
    static watch(...elements) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_watch).call(this, ...elements);
    }
    static label(labelName = "") {
        var fd = Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all)).find((sh) => __classPrivateFieldGet(sh, _KeyboardShortcut_label, "f") == labelName);
        return fd ? fd : null;
    }
    static keyOf(keycode) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_keyOf).call(this, keycode);
    }
    static get all() {
        return Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all));
    }
}
_a = KeyboardShortcut, _KeyboardShortcut_on_down_fn = new WeakMap(), _KeyboardShortcut_on_up_fn = new WeakMap(), _KeyboardShortcut_on_press_fn = new WeakMap(), _KeyboardShortcut_main_fn = new WeakMap(), _KeyboardShortcut_down = new WeakMap(), _KeyboardShortcut_up = new WeakMap(), _KeyboardShortcut_press = new WeakMap(), _KeyboardShortcut_activate = new WeakMap(), _KeyboardShortcut_propertys = new WeakMap(), _KeyboardShortcut_label = new WeakMap(), _KeyboardShortcut_instances = new WeakSet(), _KeyboardShortcut_change = function _KeyboardShortcut_change(content) {
    __classPrivateFieldSet(this, _KeyboardShortcut_propertys, KeyboardShortcut.convertto(content, "object"), "f");
}, _KeyboardShortcut_isValide = function _KeyboardShortcut_isValide(short) {
    var shortcut = KeyboardShortcut.convertto(short, "object");
    if (__classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_main_keys).some((k) => typeof __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f")[k] == "boolean" &&
        __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f")[k] != shortcut[k]) ||
        (Array.isArray(__classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f").Keys) &&
            __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f").Keys.every((value) => { var _d; return !((_d = shortcut.Keys) === null || _d === void 0 ? void 0 : _d.includes(value)); })) ||
        (Array.isArray(this.targets) &&
            !this.targets.includes(document.activeElement)))
        return false;
    return true;
}, _KeyboardShortcut_toProp = function _KeyboardShortcut_toProp(keystring = "") {
    var o = {
        Ctrl: false,
        Shift: false,
        Alt: false,
        Keys: [],
    };
    var array = keystring.split(this.separatorShortcuts);
    __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys).forEach((key) => {
        var fd = array.find((k) => k.startsWith(key));
        if (fd) {
            o[key] = fd.endsWith("?") ? undefined : true;
        }
    });
    var mainKeys = [...__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys), ...__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys).map((s) => s + "?")];
    var finded = array.find((k) => !mainKeys.includes(k));
    o.Keys =
        finded == "All"
            ? undefined
            : finded
                ? finded
                    .split(this.separatorKeys)
                    .map((s) => s.trim())
                    .filter((k) => k !== "")
                    .map((str) => __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_keyboardKeys)[str])
                : [];
    return o;
}, _KeyboardShortcut_toString = function _KeyboardShortcut_toString(keyproperty) {
    var string = [];
    __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys).forEach((mn_key) => {
        if (keyproperty[mn_key] || typeof keyproperty[mn_key] == "undefined")
            string.push(mn_key + (keyproperty[mn_key] ? "" : "?"));
    });
    if (Array.isArray(keyproperty.Keys)) {
        if (keyproperty.Keys.length)
            string.push(keyproperty.Keys.map((k) => this.keyOf(k)).join(this.separatorKeys));
    }
    else
        string.push("All");
    return string.join(this.separatorShortcuts);
}, _KeyboardShortcut_create = function _KeyboardShortcut_create(label = "", combinition = "", targets = null) {
    var result = new this(label, this.convertto(combinition, "object"));
    result.targets = targets;
    return result;
}, _KeyboardShortcut_exec = function _KeyboardShortcut_exec(combinition, press) {
    var shortcut = this.convertto(combinition, "object");
    var ready = new Set(Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all)).filter((shrt) => shrt.isValide(shortcut)));
    press.forEach((pressType) => {
        switch (pressType) {
            case "down": {
                ready.forEach((s) => __classPrivateFieldGet(s, _KeyboardShortcut_on_down_fn, "f").forEach((fn) => fn(shortcut, null, "call")));
                break;
            }
            case "up": {
                ready.forEach((s) => __classPrivateFieldGet(s, _KeyboardShortcut_on_up_fn, "f").forEach((fn) => fn(shortcut, null, "call")));
                break;
            }
            default: {
            }
        }
    });
    return ready;
}, _KeyboardShortcut_execCommand = function _KeyboardShortcut_execCommand(label, press = ["down"]) {
    var fd = Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all)).find(({ label: lab }) => lab == label);
    if (!fd)
        return null;
    for (let pressType of press) {
        switch (pressType) {
            case "down": {
                __classPrivateFieldGet(fd, _KeyboardShortcut_on_down_fn, "f").forEach((fn) => fn(__classPrivateFieldGet(fd, _KeyboardShortcut_propertys, "f"), null, "call"));
                break;
            }
            case "up": {
                __classPrivateFieldGet(fd, _KeyboardShortcut_on_up_fn, "f").forEach((fn) => fn(__classPrivateFieldGet(fd, _KeyboardShortcut_propertys, "f"), null, "call"));
                break;
            }
            default: {
            }
        }
    }
    return fd;
}, _KeyboardShortcut_watch = function _KeyboardShortcut_watch(...elements) {
    var short = this.create(`watch:${elements.map(({ ariaLabel }) => `${ariaLabel}`).join(" - ")}`, "Ctrl?+Shift?+Alt?+All", elements);
    short.when = {
        down: true,
        up: true,
        press: false,
    };
    return short;
}, _KeyboardShortcut_keyOf = function _KeyboardShortcut_keyOf(v) {
    var fd = Object.keys(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_keyboardKeys)).find((key) => __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_keyboardKeys)[key] == v);
    return fd ? fd : null;
};
KeyboardShortcut.separatorShortcuts = "+";
KeyboardShortcut.separatorKeys = "|";
_KeyboardShortcut_main_keys = { value: ["Ctrl", "Shift", "Alt"] };
_KeyboardShortcut_all = { value: new Set() };
_KeyboardShortcut_keyboardKeys = { value: {
        Backspace: 8,
        Tab: 9,
        Enter: 13,
        ShiftLeft: 16,
        ShiftRight: 16,
        ControlLeft: 17,
        ControlRight: 17,
        AltLeft: 18,
        AltRight: 18,
        Pause: 19,
        CapsLock: 20,
        Escape: 27,
        Space: 32,
        PageUp: 33,
        PageDown: 34,
        End: 35,
        Home: 36,
        ArrowLeft: 37,
        ArrowUp: 38,
        ArrowRight: 39,
        ArrowDown: 40,
        PrintScreen: 44,
        Insert: 45,
        Delete: 46,
        Digit0: 48,
        Digit1: 49,
        Digit2: 50,
        Digit3: 51,
        Digit4: 52,
        Digit5: 53,
        Digit6: 54,
        Digit7: 55,
        Digit8: 56,
        Digit9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        MetaLeft: 91,
        MetaRight: 92,
        ContextMenu: 93,
        Numpad0: 96,
        Numpad1: 97,
        Numpad2: 98,
        Numpad3: 99,
        Numpad4: 100,
        Numpad5: 101,
        Numpad6: 102,
        Numpad7: 103,
        Numpad8: 104,
        Numpad9: 105,
        NumpadMultiply: 106,
        NumpadAdd: 107,
        NumpadSubtract: 109,
        NumpadDecimal: 110,
        NumpadDivide: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NumLock: 144,
        ScrollLock: 145,
        Semicolon: 186,
        Equal: 187,
        Comma: 188,
        Minus: 189,
        Period: 190,
        Slash: 191,
        Backquote: 192,
        BracketLeft: 219,
        Backslash: 220,
        BracketRight: 221,
        Quote: 222,
    } };
export class ListBox {
    constructor(root, title = `${root.ariaLabel}`) {
        this.root = root;
        _ListBox_selection_direction.set(this, "forword");
        this.rowname = "";
        this.configurations = {
            movable: true,
            scrolling: true,
            selection: true,
            redirect: true,
            clipboard: true,
        };
        this.onSubmitFunctions = [];
        _ListBox_pointer_down_function.set(this, (e) => {
            var effective = this.EFFECTIVE_ELEMENTS;
            var mainElement = effective.find((element) => element.contains(e.target));
            if (!mainElement) {
                this.select();
                return;
            }
            if (e.altKey)
                this.configurations.scrolling &&
                    this.setSelect(mainElement, !this.getSelect(mainElement));
            else
                this.select(mainElement);
        });
        _ListBox_click_function.set(this, (e) => {
            if (e.altKey)
                return;
            var focusElement = this.ITEMS.find((ele) => ele.contains(e.target));
            focusElement && this.submit("click", focusElement);
        });
        _ListBox_drag_function.set(this, (e) => {
            var { x, y, target } = e;
            var element = document.elementFromPoint(x, y);
            if (!element)
                return;
            var row = element.closest(`[role="${this.rowname}"]`);
            if (!row)
                return;
            row.after(target);
        });
        if (__classPrivateFieldGet(ListBox, _b, "f", _ListBox_all).find(({ title: tlt }) => tlt == title))
            throw Error("cannot be used same label in tow difrent listbox.");
        this.root.ariaLabel = title;
        this.click = true;
        this.root.setAttribute("role", "listbox");
        this.shortcuts = {
            selection: {
                forword: KeyboardShortcut.create(`${this.title} - forword selection`, `Shift${KeyboardShortcut.separatorShortcuts}ArrowDown`, [this.root]).ondown(() => {
                    this.forwordSelection(1);
                }),
                backword: KeyboardShortcut.create(`${this.title} - backword selection`, `Shift${KeyboardShortcut.separatorShortcuts}ArrowUp`, [this.root]).ondown(() => {
                    this.backwordSelection(1);
                }),
            },
            find: null,
            move: {
                forword: KeyboardShortcut.create(`${this.title} - forword`, `ArrowDown`, [this.root]).ondown((combinition, event) => {
                    event && event.preventDefault();
                    this.forword(1);
                }),
                backword: KeyboardShortcut.create(`${this.title} - backword`, `ArrowUp`, [this.root]).ondown((combinition, event) => {
                    event && event.preventDefault();
                    this.backword(1);
                }),
            },
            status: {
                submit: KeyboardShortcut.create(`${this.title} - submit`, `Enter`, [
                    this.root,
                ]).ondown(() => {
                    this.submit("keypress");
                }),
                cancel: KeyboardShortcut.create(`${this.title} - cancel`, "Escape", [
                    this.root,
                ]).ondown(() => this.select()),
            },
            clipboard: null,
            inner: null,
        };
    }
    get drag() {
        return Boolean(this.root.ondragend);
    }
    get click() {
        return this.root.onclick === __classPrivateFieldGet(this, _ListBox_click_function, "f");
    }
    get mouse() {
        return this.root.onmouseover == __classPrivateFieldGet(this, _ListBox_pointer_down_function, "f");
    }
    get title() {
        return `${this.root.ariaLabel}`;
    }
    get selectiondirection() {
        return __classPrivateFieldGet(this, _ListBox_selection_direction, "f");
    }
    get ITEMS() {
        return Array.from(this.root.children);
    }
    get EFFECTIVE_ELEMENTS() {
        return this.ITEMS.filter((ele) => this.getEffective(ele));
    }
    get SELECTD_ELEMENTS() {
        return this.ITEMS.filter((ele) => this.getSelect(ele));
    }
    get FIRST_ELEMENT_SELECT() {
        var ele = this.ITEMS.find((ele) => this.getSelect(ele));
        return ele ? ele : null;
    }
    get LAST_ELEMENT_SELECT() {
        var ele = this.ITEMS.reverse().find((ele) => this.getSelect(ele));
        return ele ? ele : null;
    }
    get MIN_ELEMENT_EFFECTIVE() {
        var ele = this.ITEMS.find((ele) => this.getEffective(ele));
        return ele ? ele : null;
    }
    get MAX_ELEMENT_EFFCTIVE() {
        var ele = this.ITEMS.reverse().find((ele) => this.getEffective(ele));
        return ele ? ele : null;
    }
    get ELEMENT_DIRECTION() {
        return __classPrivateFieldGet(this, _ListBox_selection_direction, "f") == "forword"
            ? this.LAST_ELEMENT_SELECT
            : this.FIRST_ELEMENT_SELECT;
    }
    set drag(v) {
        v = Boolean(v);
        this.root.ondragend = v ? __classPrivateFieldGet(this, _ListBox_drag_function, "f") : null;
        this.ITEMS.forEach((ele) => (ele.draggable = v));
    }
    set click(flag) {
        this.root.onclick = flag ? __classPrivateFieldGet(this, _ListBox_click_function, "f") : null;
        this.root.onpointerdown = flag ? __classPrivateFieldGet(this, _ListBox_pointer_down_function, "f") : null;
    }
    set mouse(flag) {
        this.root.onmouseover = flag ? __classPrivateFieldGet(this, _ListBox_pointer_down_function, "f") : null;
        this.root.onmouseleave = flag ? () => this.select() : null;
    }
    getEffective(element) {
        return element.ariaDisabled !== "true";
    }
    setEffective(element, flag) {
        element.ariaDisabled = `${!flag}`;
        if (!flag)
            element.ariaSelected = "false";
    }
    getSelect(element) {
        return this.getEffective(element) && element.ariaSelected == "true";
    }
    setSelect(element, flag) {
        var b = this.getEffective(element);
        if (!b) {
            return false;
        }
        element.ariaSelected = `${flag}`;
        return true;
    }
    effective(...elements) {
        this.ITEMS.forEach((ele) => this.setEffective(ele, elements.includes(ele)));
    }
    select(...elements) {
        this.ITEMS.forEach((ele) => this.setSelect(ele, elements.includes(ele)));
    }
    forword(count) {
        if (!this.configurations.movable)
            return;
        var { LAST_ELEMENT_SELECT, MIN_ELEMENT_EFFECTIVE } = this;
        var ele = LAST_ELEMENT_SELECT;
        if (!ele) {
            ele = MIN_ELEMENT_EFFECTIVE;
            count--;
        }
        while (ele && count) {
            ele = ele.nextElementSibling
                ? ele.nextElementSibling
                : this.configurations.redirect
                    ? MIN_ELEMENT_EFFECTIVE
                    : null;
            ele && this.getEffective(ele) && count--;
        }
        if (ele) {
            this.select(ele);
            if (this.configurations.scrolling && !isLooked(ele))
                scrollToElement(ele, -1);
        }
    }
    backword(count) {
        if (!this.configurations.movable)
            return;
        var { FIRST_ELEMENT_SELECT, MAX_ELEMENT_EFFCTIVE } = this;
        var ele = FIRST_ELEMENT_SELECT;
        if (!ele) {
            ele = MAX_ELEMENT_EFFCTIVE;
            count--;
        }
        while (ele && count) {
            ele = ele.previousElementSibling
                ? ele.previousElementSibling
                : this.configurations.redirect
                    ? MAX_ELEMENT_EFFCTIVE
                    : null;
            ele && this.getEffective(ele) && count--;
        }
        if (ele) {
            this.select(ele);
            if (this.configurations.scrolling && !isLooked(ele))
                scrollToElement(ele, 0);
        }
    }
    forwordSelection(count) {
        if (!count) {
            this.scroll("forword");
            return;
        }
        var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
        if (first == last)
            __classPrivateFieldSet(this, _ListBox_selection_direction, "forword", "f");
        var element = __classPrivateFieldGet(this, _ListBox_selection_direction, "f") == "forword" ? last : first;
        if (!element)
            return;
        if (__classPrivateFieldGet(this, _ListBox_selection_direction, "f") == "forword") {
            var nextElementSibling = element.nextElementSibling;
            while (nextElementSibling &&
                !this.getEffective(nextElementSibling))
                nextElementSibling = nextElementSibling.nextElementSibling;
            nextElementSibling &&
                this.setSelect(nextElementSibling, true);
        }
        else
            this.setSelect(element, false);
        this.forwordSelection(count - 1);
    }
    backwordSelection(count) {
        if (!count) {
            this.scroll("backword");
            return;
        }
        var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
        if (first == last)
            __classPrivateFieldSet(this, _ListBox_selection_direction, "backword", "f");
        var element = __classPrivateFieldGet(this, _ListBox_selection_direction, "f") == "forword" ? last : first;
        if (!element)
            return;
        if (__classPrivateFieldGet(this, _ListBox_selection_direction, "f") == "backword") {
            var previousElementSibling = element.previousElementSibling;
            while (previousElementSibling &&
                !this.getEffective(previousElementSibling))
                previousElementSibling = previousElementSibling.previousElementSibling;
            previousElementSibling &&
                this.setSelect(previousElementSibling, true);
        }
        else
            this.setSelect(element, false);
        this.backwordSelection(count - 1);
    }
    onsubmit(listener) {
        typeof listener == "function" && this.onSubmitFunctions.push(listener);
        return this;
    }
    offsubmit(listener) {
        var index = this.onSubmitFunctions.indexOf(listener);
        if (index < 0)
            return false;
        this.onSubmitFunctions.splice(index, 1);
        return true;
    }
    submit(type = "call", element = this.ELEMENT_DIRECTION) {
        if (!this.SELECTD_ELEMENTS.length || this.rowname === "treeitem")
            return;
        this.onSubmitFunctions.forEach((fn) => fn(type, element));
    }
    scroll(flag = "forword") {
        var { ELEMENT_DIRECTION: element } = this;
        if (element && this.configurations.scrolling && !isLooked(element))
            scrollToElement(element, flag == "forword" ? -1 : 0);
    }
    go(dir = "forword", count = 1) {
        this[dir](count);
    }
    selection(dir = "forword", count = 1) {
        dir == "forword"
            ? this.forwordSelection(count)
            : this.backwordSelection(count);
    }
    static get all() {
        return __classPrivateFieldGet(this, _b, "f", _ListBox_all);
    }
}
_b = ListBox, _ListBox_selection_direction = new WeakMap(), _ListBox_pointer_down_function = new WeakMap(), _ListBox_click_function = new WeakMap(), _ListBox_drag_function = new WeakMap();
_ListBox_all = { value: [] };
export class Iterations extends ListBox {
    constructor(root, title, propertys = [], defaultValues) {
        super(root, title);
        this.propertys = propertys;
        this.defaultValues = defaultValues;
        this.isloading = false;
        _Iterations_hiddenPropertys.set(this, []);
        this.histroy = [];
        this.root.tabIndex = 1;
        this.searcherKey = this.propertys[0];
        this.shortcuts.clipboard = {
            copy: KeyboardShortcut.create(`${this.title} copy`, `Ctrl${KeyboardShortcut.separatorShortcuts}C`, [this.root]).ondown(() => __awaiter(this, void 0, void 0, function* () {
                this.configurations.clipboard && (yield this.copy());
            })),
            paste: KeyboardShortcut.create(`${this.title} paste`, `Ctrl${KeyboardShortcut.separatorShortcuts}V`, [this.root]).ondown(() => __awaiter(this, void 0, void 0, function* () {
                this.configurations.clipboard && (yield this.paste());
            })),
            cut: KeyboardShortcut.create(`${this.title} cut`, `Ctrl${KeyboardShortcut.separatorShortcuts}X`, [this.root]).ondown(() => __awaiter(this, void 0, void 0, function* () {
                this.configurations.clipboard && (yield this.cut());
            })),
        };
        this.shortcuts.find = {
            forword: KeyboardShortcut.create(`${this.title} find - forword -`, `All`, [this.root]).ondown(({ Keys }) => {
                if (!Keys)
                    return;
                var ky = KeyboardShortcut.keyOf(Keys[0]);
                var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
                if (!selecteddirection)
                    return;
                var next = selecteddirection.nextElementSibling;
                while (next) {
                    if (this.getEffective(next) &&
                        `${this.readrow(next)[this.searcherKey]}`[0].toUpperCase() === ky)
                        break;
                    next = next.nextElementSibling;
                }
                next && this.select(next);
            }),
            backword: KeyboardShortcut.create(`${this.title} find - backword - `, `Shift${KeyboardShortcut.separatorShortcuts}All`, [this.root]).ondown(({ Keys }) => {
                if (!Keys)
                    return;
                var ky = KeyboardShortcut.keyOf(Keys[0]);
                var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
                if (!selecteddirection)
                    return;
                var prev = selecteddirection.previousElementSibling;
                while (prev) {
                    if (this.getEffective(prev) &&
                        `${this.readrow(prev)[this.searcherKey]}`[0].toUpperCase() === ky)
                        break;
                    prev = prev.previousElementSibling;
                }
                prev && this.select(prev);
            }),
        };
    }
    columns(element) {
        return Array.from(element.querySelectorAll(`[role="content"] > [role="column"]`));
    }
    column(element, column) {
        const cols = this.columns(element);
        var index = this.propertys.indexOf(column);
        return cols[index];
    }
    createrow(input) {
        input = defaultObject(input, this.defaultValues);
        const result = createElement("div", "", { role: this.rowname });
        const levelElement = createElement("div", "", { role: "level" });
        result.appendChild(levelElement);
        var contentElement = createElement("div", "", { role: "content" });
        this.propertys.forEach((prop, index) => {
            var columnElement = createElement("div", `${input[prop]}`, {
                role: "column",
            });
            columnElement.style.display = __classPrivateFieldGet(this, _Iterations_hiddenPropertys, "f").includes(prop)
                ? "none"
                : "";
            contentElement.appendChild(columnElement);
        });
        result.appendChild(contentElement);
        return result;
    }
    readrow(element) {
        const result = Object.create(null);
        result.row = element;
        const cols = this.columns(element);
        this.propertys.forEach((prop, index) => {
            Object.defineProperty(result, prop, {
                get() {
                    var string = cols[index].innerHTML;
                    return isNaN(+string) ? string : +string;
                },
                set(v) {
                    cols[index].innerHTML = v;
                },
                enumerable: false,
                configurable: true,
            });
        });
        return result;
    }
    setHiddenPropertys(...props) {
        __classPrivateFieldSet(this, _Iterations_hiddenPropertys, props, "f");
        this.ITEMS.forEach((element) => {
            var cols = this.columns(element);
            const indexs = __classPrivateFieldGet(this, _Iterations_hiddenPropertys, "f").map((prop) => this.propertys.indexOf(prop));
            cols.forEach((col, index) => (col.style.display = indexs.includes(index) ? "none" : ""));
        });
    }
    copy() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    cut() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    paste() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    json(element) {
        var o = Object.create(null);
        var columns = this.columns(element);
        this.propertys.forEach((prop, index) => {
            var innerHTML = columns[index].innerHTML;
            o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML);
        });
        return o;
    }
    static create(title, defaultValue) {
        const root = createElement("div", "", { role: "iterations" });
        const iterable = new this(root, title, Object.keys(defaultValue), defaultValue);
        return iterable;
    }
    throwLoading() {
        if (this.isloading)
            throw Error("cannot be update the content is stay loading...");
    }
}
_Iterations_hiddenPropertys = new WeakMap();
export class Table extends Iterations {
    constructor(root, title, propertys = [], defaultValue) {
        super(root, title, propertys, defaultValue);
        this.root.setAttribute("role", "table");
        this.rowname = "row";
    }
    get DATA() {
        return this.ITEMS.map((element) => this.readrow(element));
    }
    get EFFECTIVE_DATA() {
        return this.EFFECTIVE_ELEMENTS.map((element) => this.readrow(element));
    }
    get SELECTED_DATA() {
        return this.SELECTD_ELEMENTS.map((element) => this.readrow(element));
    }
    appendSync(data) {
        data.forEach((input) => this.root.appendChild(this.createrow(input)));
    }
    append(data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forEachAsync(data, (input) => this.root.appendChild(this.createrow(input)), timeout, limit);
        });
    }
    prependSync(data) {
        data.forEach((input) => this.root.prepend(this.createrow(input)));
    }
    prepend(data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forEachAsync(data, (input) => this.root.prepend(this.createrow(input)), timeout, limit);
        });
    }
    afterSync(element, data) {
        data.reverse().forEach((input) => element.after(this.createrow(input)));
    }
    after(element, data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forEachAsync(data.reverse(), (input) => element.after(this.createrow(input)), timeout, limit);
        });
    }
    beforeSync(element, data) {
        data.forEach((input) => element.before(this.createrow(input)));
    }
    before(element, data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forEachAsync(data, (input) => element.before(this.createrow(input)), timeout, limit);
        });
    }
    copy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.configurations.clipboard)
                return;
            const selectedData = this.SELECTD_ELEMENTS.map((element) => this.json(element));
            yield navigator.clipboard.writeText(JSON.stringify(selectedData, undefined, 1));
        });
    }
    cut() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.configurations.clipboard)
                return;
            const selectedData = this.SELECTD_ELEMENTS.map((element) => {
                element.remove();
                this.json(element);
            });
            yield navigator.clipboard.writeText(JSON.stringify(selectedData));
        });
    }
    paste() {
        return __awaiter(this, void 0, void 0, function* () {
            var array = Array.from(JSON.parse(yield navigator.clipboard.readText()));
            const { SELECTD_ELEMENTS: selectedElement, LAST_ELEMENT_SELECT: lastSelectedElement, } = this;
            var modulo = array.length % selectedElement.length;
            if (modulo)
                selectedElement.forEach((element, index) => {
                    this.after(element, array.slice(index * modulo, (index + 1) * modulo), 100, 1);
                });
            else if (selectedElement.length)
                selectedElement.forEach((element) => {
                    this.after(element, array, 100, 1);
                });
            else
                this.append(array, 100, 1);
        });
    }
    sortSync(by, to = "down") {
        var allData = this.DATA;
        for (let i = 0; i < allData.length; i++) {
            var body = allData[i];
            var j = i - 1;
            var prev = body.row.previousElementSibling;
            while (prev &&
                (to == "down"
                    ? this.readrow(prev)[by] > body[by]
                    : this.readrow(prev)[by] < body[by])) {
                prev = prev.previousElementSibling;
                allData[j + 1] = allData[j];
                j--;
            }
            !prev ? this.root.prepend(body.row) : prev.after(body.row);
            allData[j + 1] = body;
        }
    }
    sort(by, to = "down", timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var allData = this.DATA;
            var dl = new Delay(timeout);
            for (let i = 0; i < allData.length; i++) {
                if (!(i % limit))
                    yield dl.on();
                var body = allData[i];
                var j = i - 1;
                var prev = body.row.previousElementSibling;
                while (prev &&
                    (to == "down"
                        ? this.readrow(prev)[by] > body[by]
                        : this.readrow(prev)[by] < body[by])) {
                    prev = prev.previousElementSibling;
                    allData[j + 1] = allData[j];
                    j--;
                }
                !prev ? this.root.prepend(body.row) : prev.after(body.row);
                allData[j + 1] = body;
            }
        });
    }
    methode(methode, input, element, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwLoading();
            this.isloading = true;
            switch (methode) {
                case "after": {
                }
                case "before": {
                    yield this[methode](element, input, timeout, limit);
                    break;
                }
                case "prepend": {
                }
                case "append": {
                    yield this[methode](input, timeout, limit);
                    break;
                }
                case "sort": {
                    var { by, direction } = input;
                    yield this.sort(by, direction, timeout, limit);
                }
            }
            this.isloading = false;
        });
    }
    methodeSync(methode, input, element) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwLoading();
            this.isloading = true;
            switch (methode) {
                case "after": {
                }
                case "before": {
                    this[`${methode}Sync`](element, input);
                    break;
                }
                case "prepend": {
                }
                case "append": {
                    this[`${methode}Sync`](input);
                    break;
                }
                case "sort": {
                    var { by, direction } = input;
                    this.sortSync(by, direction);
                }
            }
            this.isloading = false;
        });
    }
}
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
        this.root.setAttribute("role", "treelinear");
        this.rowname = "treeitem";
        this.root.prepend(__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"));
        this.shortcuts.inner = {
            open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
                this.root,
            ]).ondown(() => {
                const selectedElement = this.SELECTD_ELEMENTS;
                selectedElement.forEach((element) => {
                    if (__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isclosed).call(this, element))
                        __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_open).call(this, element);
                    else {
                        const firstElement = this.firstchildof(element);
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
                const selectedElement = this.SELECTD_ELEMENTS;
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
        return super.ITEMS.slice(1);
    }
    getlevel(element) {
        return Number(element.ariaLevel);
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
        const inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        var result = [];
        inner.forEach((itemElement) => result.push(itemElement, ...this.childsOf(itemElement)));
        return result;
    }
    lastchildof(any) {
        any = this.convertto(any, "element");
        var inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        var result = inner[inner.length - 1];
        if (!result)
            return null;
        inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, result);
        while (inner.length) {
            result = inner[inner.length - 1];
            inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, result);
        }
        return result;
    }
    firstchildof(any) {
        any = this.convertto(any, "element");
        const inner = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, any);
        return inner.length ? inner[0] : null;
    }
    issubtree(element) {
        if (__classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f") == element)
            return true;
        const columns = this.columns(element);
        return __classPrivateFieldGet(this, _TreeLinear_subtree_propertys, "f").every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML == value);
    }
    createrow(input, lvl = 0, closed = false, visible = true) {
        var _d;
        const result = super.createrow(input);
        result.ariaLevel = `${lvl}`;
        this.setshow(result, visible);
        if (this.issubtree(result)) {
            result.ariaExpanded = "true";
            const showMoreIcon = createElement("span", `<i class="material-icons">${closed ? "chevron_right" : "expand_more"}</i>`, {
                role: "icon",
                "aria-expanded": !closed,
            });
            showMoreIcon.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, result);
            (_d = result.querySelector('[role="level"]')) === null || _d === void 0 ? void 0 : _d.prepend(showMoreIcon);
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
            var _d;
            const issubtree = this.issubtree(element);
            var iconShowMore = element.querySelector(`[role="level"] > [role="icon"]`);
            element.ariaExpanded = `${issubtree}`;
            if (issubtree) {
                if (!iconShowMore) {
                    const showMoreIcon = createElement("span", `<i class="material-icons">chevron_right</i>`, {
                        role: "icon",
                    });
                    showMoreIcon.onclick = () => __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_toggle).call(this, element);
                    (_d = element.querySelector('[role="level"]')) === null || _d === void 0 ? void 0 : _d.prepend(showMoreIcon);
                }
            }
            else
                iconShowMore === null || iconShowMore === void 0 ? void 0 : iconShowMore.remove();
        });
    }
    setshow(rowElement, flag) {
        rowElement.style.display = flag ? "" : "none";
        this.setEffective(rowElement, flag);
    }
    append(element, data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            element = this.convertto(element, "element");
            if (!this.issubtree(element))
                throw Error("Cannot Be add in this item");
            const isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
            const initLevel = this.getlevel(element) + 1;
            element = this.lastchildof(element) || element;
            data = data.reverse();
            var dl = new Delay(timeout);
            for (let i = 0; i < data.length; i++) {
                if (!(i % limit))
                    yield dl.on();
                element.after(this.createrow(data[i], initLevel, true, isopend));
            }
        });
    }
    prepend(element, data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            element = this.convertto(element, "element");
            if (!this.issubtree(element))
                throw Error("Cannot Be add in this item");
            const isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
            const initLevel = this.getlevel(element) + 1;
            data = data.reverse();
            var dl = new Delay(timeout);
            for (let i = 0; i < data.length; i++) {
                if (!(i % limit))
                    dl.on();
                element.after(this.createrow(data[i], initLevel, true, isopend));
            }
        });
    }
    after(element, data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwLoading();
            var lvl = this.getlevel(element);
            var inner = this.childsOf(element);
            var isclosed = element.style.display == "none";
            element = inner.length ? inner[inner.length - 1] : element;
            yield forEachAsync(data.reverse(), (d) => element.after(this.createrow(d, lvl, false, isclosed)), timeout, limit);
        });
    }
    before(element, data, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var lvl = this.getlevel(element);
            var isclosed = element.style.display == "none";
            yield forEachAsync(data, (d) => element.before(this.createrow(d, lvl, true, isclosed)), timeout, limit);
        });
    }
    delete(element, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forEachAsync(__classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_inner).call(this, element), (ele) => __awaiter(this, void 0, void 0, function* () { return yield this.delete(ele, timeout, limit); }), timeout, limit);
            element.remove();
        });
    }
    insert(element, tree, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var level = this.getlevel(element) + 1;
            var isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
            yield forEachAsync(tree, ({ body, innerTree }) => __awaiter(this, void 0, void 0, function* () {
                var ele = this.createrow(body, level, true, isopend);
                var mainElement = this.lastchildof(element) || element;
                mainElement.after(ele);
                Array.isArray(innerTree) &&
                    innerTree.length &&
                    (yield this.insert(ele, innerTree, timeout, limit));
            }), timeout, limit);
        });
    }
    appendSync(element, data) {
        element = this.convertto(element, "element");
        if (!this.issubtree(element))
            throw Error("Cannot Be add in this item");
        const isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        const initLevel = this.getlevel(element) + 1;
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
        const isopend = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_isopend).call(this, element);
        const initLevel = this.getlevel(element) + 1;
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
            element = inner[inner.length - 1];
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
            var { body } = tree[i];
            var { row } = body;
            deep && this.sortSync(row, sortBy, direction);
            var j = i - 1;
            var prec = tree[j];
            while (prec &&
                (direction == "down"
                    ? prec.body[sortBy] < body[sortBy]
                    : prec.body[sortBy] > body[sortBy])) {
                j--;
                prec = tree[j];
            }
            var childs = this.childsOf(row);
            if (prec)
                prec.body.row.before(...childs);
            else
                element.after(...childs);
        }
    }
    sort(element, key, direction, deep = true, timeout, limit) {
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
                deep && (yield this.sort(row, key, direction, true, timeout, limit));
                tree = this.read(element).innerTree;
            }
        });
    }
    methode(methode, element, input, timeout, limit) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    yield this[methode](element, input, timeout, limit);
                    break;
                }
                case "insert": {
                    yield this.insert(element, input, timeout, limit);
                    break;
                }
                case "delete": {
                    yield this.delete(element, timeout, limit);
                    break;
                }
                case "sort": {
                    var { by, direction, deep } = input;
                    yield this.sort(element, by, direction, deep, timeout, limit);
                }
            }
            this.isloading = false;
        });
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
    copy() {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedElement = this.SELECTD_ELEMENTS;
            yield navigator.clipboard.writeText(JSON.stringify(selectedElement.map((ele) => this.jsontree(ele)), undefined, 1));
        });
    }
    cut(timeout = 20, limit = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedElement = this.SELECTD_ELEMENTS;
            yield navigator.clipboard.writeText(JSON.stringify(selectedElement.map((ele) => this.jsontree(ele)), undefined, 1));
            selectedElement.forEach((element) => this.delete(element, timeout, limit));
        });
    }
    paste(timeout = 20, limit = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwLoading();
            var data = JSON.parse(yield navigator.clipboard.readText());
            if (!Array.isArray(data))
                throw Error("paste ignore");
            const selected = this.SELECTD_ELEMENTS.filter((ele) => this.issubtree(ele));
            if (selected.length == data.length) {
                yield forEachAsync(selected, (element, index) => __awaiter(this, void 0, void 0, function* () { return yield this.insert(element, data[index], timeout, limit); }), timeout, limit);
            }
        });
    }
    static create(title, defaultValue) {
        const tree = super.create(title, defaultValue);
        return tree;
    }
}
_TreeLinear_mainTreeElement = new WeakMap(), _TreeLinear_callbackquery = new WeakMap(), _TreeLinear_subtree_propertys = new WeakMap(), _TreeLinear_instances = new WeakSet(), _TreeLinear_inner = function _TreeLinear_inner(element) {
    var initLvl = this.getlevel(element);
    var { nextElementSibling } = element;
    var result = [];
    while (nextElementSibling &&
        initLvl < this.getlevel(nextElementSibling)) {
        this.getlevel(nextElementSibling) == initLvl + 1 &&
            result.push(nextElementSibling);
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
    var outer = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_outer).call(this, element);
    const data = this.readrow(element);
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
            const data = this.readrow(element);
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
    var showMoreIcon = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getIconElement).call(this, element);
    return !showMoreIcon || showMoreIcon.ariaExpanded === "true";
}, _TreeLinear_isclosed = function _TreeLinear_isclosed(element) {
    if (element == __classPrivateFieldGet(this, _TreeLinear_mainTreeElement, "f"))
        return false;
    if (!this.issubtree(element))
        return true;
    var showMoreIcon = __classPrivateFieldGet(this, _TreeLinear_instances, "m", _TreeLinear_getIconElement).call(this, element);
    return !showMoreIcon || showMoreIcon.ariaExpanded === "false";
}, _TreeLinear_open = function _TreeLinear_open(element) {
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
export class Graphe {
    constructor(label, x, y, r, width, height, form, color, origin = Graphe.origin) {
        this.label = label;
        this.x = x;
        this.y = y;
        this.r = r;
        this.width = width;
        this.height = height;
        this.form = form;
        this.color = color;
        _Graphe_points.set(this, new Set());
        this.relations = [];
        _Graphe_origin.set(this, null);
        _Graphe_indexCopyed.set(this, 0);
        if (Graphe.all.find(({ label: lbl }) => lbl === label))
            throw Error("cannot be used the same label in diffrente Graphe");
        this.origin = origin;
        __classPrivateFieldGet(Graphe, _c, "f", _Graphe_all).add(this);
    }
    get origin() {
        return __classPrivateFieldGet(this, _Graphe_origin, "f");
    }
    get origins() {
        return !__classPrivateFieldGet(this, _Graphe_origin, "f") ? [] : [...__classPrivateFieldGet(this, _Graphe_origin, "f").origins, __classPrivateFieldGet(this, _Graphe_origin, "f")];
    }
    set origin(v) {
        __classPrivateFieldGet(this, _Graphe_origin, "f") && __classPrivateFieldGet(__classPrivateFieldGet(this, _Graphe_origin, "f"), _Graphe_points, "f").delete(this);
        __classPrivateFieldSet(this, _Graphe_origin, v, "f");
        __classPrivateFieldGet(this, _Graphe_origin, "f") && __classPrivateFieldGet(__classPrivateFieldGet(this, _Graphe_origin, "f"), _Graphe_points, "f").add(this);
    }
    get relative() {
        var { origin, x, y, r } = this;
        while (origin) {
            x += origin.x;
            y += origin.y;
            r += origin.r;
            origin = origin.origin;
        }
        var diff = (x ** 2 + y ** 2) ** (1 / 2);
        var R = Math.atan(x / y);
        x = diff * Math.cos(R + r);
        y = diff * Math.sin(R + r);
        return [x, y, r];
    }
    get points() {
        return Array.from(__classPrivateFieldGet(this, _Graphe_points, "f"));
    }
    draw(context, showOrigins = false) {
        context.save();
        const { origins } = this;
        [...origins, this].forEach((graphe) => {
            var { x, y, r } = graphe;
            context.translate(x, y);
            context.rotate(r);
            if (showOrigins || graphe == this) {
                context.beginPath();
                if (graphe.form == "circle")
                    context.ellipse(0, 0, graphe.width / 2, graphe.height / 2, 0, 0, Math.PI * 2);
                else
                    context.rect(-graphe.width / 2, -graphe.height / 2, graphe.width, graphe.height);
                context.strokeStyle = graphe.color;
                context.stroke();
                context.closePath();
                context.beginPath();
                graphe.relations.forEach(({ color, graphe: grp }) => {
                    var { diffX, diffY } = Graphe.info(grp, graphe);
                    context.lineTo(0, 0);
                    context.lineTo(diffX, diffY);
                    context.setLineDash([5, 5]);
                    context.strokeStyle = color;
                    context.stroke();
                });
                context.closePath();
                context.setLineDash([]);
            }
        });
        context.restore();
    }
    static info(g1, g2 = this.origin) {
        const [x1, y1] = g1.relative;
        const [x2, y2] = g2.relative;
        const diffX = x1 - x2;
        const diffY = y1 - y2;
        return {
            diffX,
            diffY,
            diff: (diffX ** 2 + diffY ** 2) ** (1 / 2),
            rotation: Math.atan(diffY / diffX),
        };
    }
    static create(x, y, label = `point - ${__classPrivateFieldGet(this, _c, "f", _Graphe_all).size}`, origin = this.origin) {
        return new this(label, x, y, 0, 10, 10, "circle", label.includes("origin") ? "#F33" : "white", origin);
    }
    copy() {
        var _d;
        var { x, y, r, width, height, form, color, origin } = this;
        __classPrivateFieldSet(this, _Graphe_indexCopyed, (_d = __classPrivateFieldGet(this, _Graphe_indexCopyed, "f"), _d++, _d), "f");
        var result = new Graphe(`${this.label} - version(${__classPrivateFieldGet(this, _Graphe_indexCopyed, "f")})`, x, y, r, width, height, form, color, origin);
        var points = new Set();
        this.points.forEach((point) => {
            var graphe = point.copy();
            graphe.origin = result;
            points.add(graphe);
        });
        __classPrivateFieldSet(result, _Graphe_points, points, "f");
        return result;
    }
    static get noOrigin() {
        return Array.from(__classPrivateFieldGet(this, _c, "f", _Graphe_all)).filter((graphe) => !__classPrivateFieldGet(graphe, _Graphe_points, "f").size);
    }
    static draw(context) {
        this.noOrigin.forEach((graphe) => graphe.draw(context, true));
    }
    get from() {
        return Graphe.from(this);
    }
    get components() {
        return Graphe.components(this);
    }
    static label(label) {
        var fd = this.all.find(({ label: lbl }) => lbl == label);
        return fd || null;
    }
    static clear() {
        __classPrivateFieldSet(this, _c, new Set([this.origin]), "f", _Graphe_all);
    }
    static from(graphe) {
        return Graphe.label(graphe.label.replace(/ - version\([1-9]+\)/gi, ""));
    }
    static components(graphe) {
        var result = [graphe];
        graphe.points.forEach((g) => result.push(...this.components(g)));
        return result;
    }
    static get all() {
        return Array.from(__classPrivateFieldGet(this, _c, "f", _Graphe_all));
    }
}
_c = Graphe, _Graphe_points = new WeakMap(), _Graphe_origin = new WeakMap(), _Graphe_indexCopyed = new WeakMap();
_Graphe_all = { value: new Set() };
Graphe.origin = Graphe.create(0, 0, "origin", null);
export class ToolBar extends ListBox {
    constructor(title, ...types) {
        var root = createElement("ul", "", {});
        super(root, title);
        _ToolBar_types.set(this, []);
        __classPrivateFieldSet(this, _ToolBar_types, types, "f");
        this.root.setAttribute("role", "toolbar");
    }
    get types() {
        return __classPrivateFieldGet(this, _ToolBar_types, "f");
    }
    findTip(label) {
        var element = this.ITEMS.find((content) => content.ariaLabel == label);
        return element
            ? {
                label,
                click: element.onclick,
                element: element,
                iconElement: element.querySelector("i"),
            }
            : null;
    }
    addTip(label, iconName, click) {
        var fdTip = this.findTip(label);
        if (fdTip)
            throw Error(`The Label ${label.toString()} is defined`);
        var element = createElement("li", `<i class="material-icons material-icons-outlined icon">${iconName}</i>`, {
            "aria-label": label,
        });
        this.root.appendChild(element);
        element.onclick = click;
    }
    removeTip(label) {
        var _d;
        (_d = this.findTip(label)) === null || _d === void 0 ? void 0 : _d.element.remove();
    }
    exec(label) {
        var find = this.findTip(label);
        if (!find)
            return;
        find.element.click();
    }
}
_ToolBar_types = new WeakMap();
