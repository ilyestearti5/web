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
var _KeyboardShortcut_instances, _a, _KeyboardShortcut_main_keys, _KeyboardShortcut_all, _KeyboardShortcut_on_down_fn, _KeyboardShortcut_on_up_fn, _KeyboardShortcut_on_press_fn, _KeyboardShortcut_main_fn, _KeyboardShortcut_down, _KeyboardShortcut_up, _KeyboardShortcut_press, _KeyboardShortcut_activate, _KeyboardShortcut_propertys, _KeyboardShortcut_label, _KeyboardShortcut_change, _KeyboardShortcut_isvalide, _KeyboardShortcut_toProp, _KeyboardShortcut_toString, _KeyboardShortcut_create, _KeyboardShortcut_exec, _KeyboardShortcut_execcommand, _KeyboardShortcut_watch;
export class KeyboardShortcut {
    constructor(label, propertys, from = 'key') {
        this.from = from;
        _KeyboardShortcut_instances.add(this);
        _KeyboardShortcut_on_down_fn.set(this, []);
        _KeyboardShortcut_on_up_fn.set(this, []);
        _KeyboardShortcut_on_press_fn.set(this, []);
        _KeyboardShortcut_main_fn.set(this, (event) => {
            var { ctrlKey: ctrl, altKey: alt, shiftKey: shift, type } = event;
            var k = event[this.from].toLowerCase();
            k = __classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_main_keys).includes(k) ? '' : k == ' ' ? 'space' : k;
            k = ['control'].includes(k) ? '' : k;
            var o = {
                ctrl,
                alt,
                shift,
                keys: k == '' ? [] : [k],
            };
            if (!__classPrivateFieldGet(this, _KeyboardShortcut_activate, "f") || !this.isvalide(o))
                return;
            switch (type) {
                case 'keydown': {
                    __classPrivateFieldGet(this, _KeyboardShortcut_on_down_fn, "f").forEach(fn => fn(o, event, 'key'));
                    break;
                }
                case 'keyup': {
                    __classPrivateFieldGet(this, _KeyboardShortcut_on_up_fn, "f").forEach(fn => fn(o, event, 'key'));
                    break;
                }
                case 'press': {
                    __classPrivateFieldGet(this, _KeyboardShortcut_on_press_fn, "f").forEach(fn => fn(o, event, 'key'));
                }
            }
        });
        _KeyboardShortcut_down.set(this, false);
        _KeyboardShortcut_up.set(this, false);
        _KeyboardShortcut_press.set(this, false);
        _KeyboardShortcut_activate.set(this, true);
        _KeyboardShortcut_propertys.set(this, {
            ctrl: false,
            shift: false,
            alt: false,
            keys: [],
        });
        this.targets = null;
        _KeyboardShortcut_label.set(this, '');
        if (Array.from(__classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_all)).some(s => s.label == label))
            throw Error('Cannot be Used to Shortcut Has The Same Label');
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
                document.addEventListener('keydown', __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            else
                document.removeEventListener('keydown', __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            __classPrivateFieldSet(this, _KeyboardShortcut_down, v.down, "f");
        }
        if (v.up != __classPrivateFieldGet(this, _KeyboardShortcut_up, "f")) {
            if (v.up)
                document.addEventListener('keyup', __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            else
                document.removeEventListener('keyup', __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            __classPrivateFieldSet(this, _KeyboardShortcut_up, v.up, "f");
        }
        if (v.press != __classPrivateFieldGet(this, _KeyboardShortcut_press, "f")) {
            if (v.press)
                document.addEventListener('keypress', __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            else
                document.removeEventListener('keypress', __classPrivateFieldGet(this, _KeyboardShortcut_main_fn, "f"));
            __classPrivateFieldSet(this, _KeyboardShortcut_press, v.press, "f");
        }
    }
    get text() {
        return __classPrivateFieldGet(KeyboardShortcut, _a, "m", _KeyboardShortcut_toString).call(KeyboardShortcut, __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f"));
    }
    get status() {
        return this.targets ? 'local' : 'global';
    }
    change(content) {
        __classPrivateFieldGet(this, _KeyboardShortcut_instances, "m", _KeyboardShortcut_change).call(this, content);
        return this;
    }
    isvalide(short) {
        return __classPrivateFieldGet(this, _KeyboardShortcut_instances, "m", _KeyboardShortcut_isvalide).call(this, short);
    }
    ondown(listener) {
        typeof listener == 'function' && __classPrivateFieldGet(this, _KeyboardShortcut_on_down_fn, "f").push(listener);
        return this;
    }
    onup(listener) {
        typeof listener == 'function' && __classPrivateFieldGet(this, _KeyboardShortcut_on_up_fn, "f").push(listener);
        return this;
    }
    onpress(listener) {
        typeof listener == 'function' && __classPrivateFieldGet(this, _KeyboardShortcut_on_press_fn, "f").push(listener);
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
    offpress(listener) {
        var index = __classPrivateFieldGet(this, _KeyboardShortcut_on_press_fn, "f").indexOf(listener);
        if (index < 0)
            return false;
        __classPrivateFieldGet(this, _KeyboardShortcut_on_press_fn, "f").splice(index, 1);
        return true;
    }
    on(event, listener) {
        return this[`on${event}`](listener);
    }
    off(event, listener) {
        return this[`off${event}`](listener);
    }
    clear(when) {
        if (when == 'down')
            __classPrivateFieldSet(this, _KeyboardShortcut_on_down_fn, [], "f");
        else if (when == 'up')
            __classPrivateFieldSet(this, _KeyboardShortcut_on_up_fn, [], "f");
        else if (when == 'press')
            __classPrivateFieldSet(this, _KeyboardShortcut_on_press_fn, [], "f");
        this.when[when] = false;
    }
    changeFrom(value) {
        this.from = value == 'key' ? 'key' : 'code';
        return this;
    }
    getFrom() {
        return this.from;
    }
    static convertto(property, to) {
        return (to == 'object' ? (typeof property === 'string' ? __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_toProp).call(this, property) : property) : typeof property === 'string' ? property : __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_toString).call(this, property));
    }
    static create(label = '', combinition = '', targets = null, from = 'key') {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_create).call(this, label, combinition, targets, from);
    }
    static exec(combinition, ...press) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_exec).call(this, combinition, press);
    }
    static execcommand(label, press = ['down']) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_execcommand).call(this, label, press);
    }
    static watch(...elements) {
        return __classPrivateFieldGet(this, _a, "m", _KeyboardShortcut_watch).call(this, ...elements);
    }
    static label(labelName = '') {
        var fd = Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all)).find(sh => __classPrivateFieldGet(sh, _KeyboardShortcut_label, "f") == labelName);
        return fd ? fd : null;
    }
    static get all() {
        return Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all));
    }
}
_a = KeyboardShortcut, _KeyboardShortcut_on_down_fn = new WeakMap(), _KeyboardShortcut_on_up_fn = new WeakMap(), _KeyboardShortcut_on_press_fn = new WeakMap(), _KeyboardShortcut_main_fn = new WeakMap(), _KeyboardShortcut_down = new WeakMap(), _KeyboardShortcut_up = new WeakMap(), _KeyboardShortcut_press = new WeakMap(), _KeyboardShortcut_activate = new WeakMap(), _KeyboardShortcut_propertys = new WeakMap(), _KeyboardShortcut_label = new WeakMap(), _KeyboardShortcut_instances = new WeakSet(), _KeyboardShortcut_change = function _KeyboardShortcut_change(content) {
    __classPrivateFieldSet(this, _KeyboardShortcut_propertys, KeyboardShortcut.convertto(content, 'object'), "f");
}, _KeyboardShortcut_isvalide = function _KeyboardShortcut_isvalide(short) {
    var shortcut = KeyboardShortcut.convertto(short, 'object');
    if (__classPrivateFieldGet(KeyboardShortcut, _a, "f", _KeyboardShortcut_main_keys).some(k => typeof __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f")[k] == 'boolean' && __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f")[k] != shortcut[k]) || (Array.isArray(__classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f").keys) && __classPrivateFieldGet(this, _KeyboardShortcut_propertys, "f").keys.every(value => (shortcut.keys ? !shortcut.keys.includes(value) : false))) || (Array.isArray(this.targets) && !this.targets.includes(document.activeElement)))
        return false;
    return true;
}, _KeyboardShortcut_toProp = function _KeyboardShortcut_toProp(keystring = '') {
    var o = {
        ctrl: false,
        shift: false,
        alt: false,
        keys: [],
    };
    var array = keystring.split(this.separatorShortcuts);
    __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys).forEach(key => {
        var fd = array.find(k => k.startsWith(key));
        if (fd) {
            o[key] = fd.endsWith('?') ? undefined : true;
        }
    });
    var modifiersKeys = [...__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys), ...__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys).map(s => s + '?')];
    var finded = array.find(k => !modifiersKeys.includes(k));
    o.keys =
        finded == 'all'
            ? undefined
            : finded
                ? finded
                    .split(this.separatorKeys)
                    .map(s => s.trim())
                    .filter(k => k !== '')
                : [];
    return o;
}, _KeyboardShortcut_toString = function _KeyboardShortcut_toString(keyproperty) {
    var string = [];
    __classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_main_keys).forEach(mn_key => {
        if (keyproperty[mn_key] || typeof keyproperty[mn_key] == 'undefined')
            string.push(mn_key + (keyproperty[mn_key] ? '' : '?'));
    });
    if (Array.isArray(keyproperty.keys)) {
        if (keyproperty.keys.length)
            string.push(keyproperty.keys.join(this.separatorKeys));
    }
    else
        string.push('all');
    return string.join(this.separatorShortcuts);
}, _KeyboardShortcut_create = function _KeyboardShortcut_create(label = '', combinition = '', targets = null, from) {
    var result = new this(label, this.convertto(combinition, 'object'), from);
    result.targets = targets;
    return result;
}, _KeyboardShortcut_exec = function _KeyboardShortcut_exec(combinition, press) {
    var shortcut = this.convertto(combinition, 'object');
    var ready = new Set(Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all)).filter(shrt => shrt.isvalide(shortcut)));
    press.forEach(pressType => {
        switch (pressType) {
            case 'down': {
                ready.forEach(s => __classPrivateFieldGet(s, _KeyboardShortcut_on_down_fn, "f").forEach(fn => fn(shortcut, null, 'call')));
                break;
            }
            case 'up': {
                ready.forEach(s => __classPrivateFieldGet(s, _KeyboardShortcut_on_up_fn, "f").forEach(fn => fn(shortcut, null, 'call')));
                break;
            }
            case 'press': {
                ready.forEach(s => __classPrivateFieldGet(s, _KeyboardShortcut_on_press_fn, "f").forEach(fn => fn(shortcut, null, 'call')));
            }
            default: {
            }
        }
    });
    return ready;
}, _KeyboardShortcut_execcommand = function _KeyboardShortcut_execcommand(label, press = ['down']) {
    var s = Array.from(__classPrivateFieldGet(this, _a, "f", _KeyboardShortcut_all)).find(({ label: lab }) => lab == label);
    if (!s)
        return null;
    for (let pressType of press) {
        switch (pressType) {
            case 'down': {
                __classPrivateFieldGet(s, _KeyboardShortcut_on_down_fn, "f").forEach(fn => fn(__classPrivateFieldGet(s, _KeyboardShortcut_propertys, "f"), null, 'call'));
                break;
            }
            case 'up': {
                __classPrivateFieldGet(s, _KeyboardShortcut_on_up_fn, "f").forEach(fn => fn(__classPrivateFieldGet(s, _KeyboardShortcut_propertys, "f"), null, 'call'));
                break;
            }
            case 'press': {
                __classPrivateFieldGet(s, _KeyboardShortcut_on_press_fn, "f").forEach(fn => fn(__classPrivateFieldGet(s, _KeyboardShortcut_propertys, "f"), null, 'call'));
            }
        }
    }
    return s;
}, _KeyboardShortcut_watch = function _KeyboardShortcut_watch(...elements) {
    var short = this.create(`watch:${elements
        .filter(ele => ele.ariaLabel)
        .map(({ ariaLabel }) => `${ariaLabel}`)
        .join(' - ')}`, 'ctrl?+shift?+alt?+all', elements);
    short.when = {
        down: true,
        up: true,
        press: false,
    };
    return short;
};
KeyboardShortcut.separatorShortcuts = '+';
KeyboardShortcut.separatorKeys = '|';
_KeyboardShortcut_main_keys = { value: ['ctrl', 'shift', 'alt'] };
_KeyboardShortcut_all = { value: new Set() };
KeyboardShortcut.create('Reload Page', 'ctrl+r', null, 'key').ondown((cmb, keyboard) => {
    keyboard && keyboard.preventDefault();
    window.location.reload();
});
KeyboardShortcut.create('Close Window', 'ctrl+w', null, 'key').ondown((cmb, keyboard) => {
    keyboard && keyboard.preventDefault();
    window.close();
});
