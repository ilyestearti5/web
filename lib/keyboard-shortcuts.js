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
var _KeyboardShortcut_instances, _a, _KeyboardShortcut_main_keys, _KeyboardShortcut_all, _KeyboardShortcut_keyboardKeys, _KeyboardShortcut_on_down_fn, _KeyboardShortcut_on_up_fn, _KeyboardShortcut_on_press_fn, _KeyboardShortcut_main_fn, _KeyboardShortcut_down, _KeyboardShortcut_up, _KeyboardShortcut_press, _KeyboardShortcut_activate, _KeyboardShortcut_propertys, _KeyboardShortcut_label, _KeyboardShortcut_change, _KeyboardShortcut_isValide, _KeyboardShortcut_toProp, _KeyboardShortcut_toString, _KeyboardShortcut_create, _KeyboardShortcut_exec, _KeyboardShortcut_execCommand, _KeyboardShortcut_watch, _KeyboardShortcut_keyOf;
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
    static convertTo(property, to) {
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
    __classPrivateFieldSet(this, _KeyboardShortcut_propertys, KeyboardShortcut.convertTo(content, "object"), "f");
}, _KeyboardShortcut_isValide = function _KeyboardShortcut_isValide(short) {
    var shortcut = KeyboardShortcut.convertTo(short, "object");
    if (__classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_main_keys).some((k) => typeof __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f")[k] == "boolean" &&
        __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f")[k] != shortcut[k]) ||
        (Array.isArray(__classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f").Keys) &&
            __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f").Keys.every((value) => { var _b; return !((_b = shortcut.Keys) === null || _b === void 0 ? void 0 : _b.includes(value)); })) ||
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
    var result = new this(label, this.convertTo(combinition, "object"));
    result.targets = targets;
    return result;
}, _KeyboardShortcut_exec = function _KeyboardShortcut_exec(combinition, press) {
    var shortcut = this.convertTo(combinition, "object");
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
