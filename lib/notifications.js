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
var _a, _Notifications_inputs, _Notifications_title, _Notifications_buttons, _Notifications_titleElement, _Notifications_contentElement, _Notifications_notifictionElement, _Notifications_tools, _Notifications_all;
import { ListBox as List } from './listbox.js';
import { ToolBar as Tool } from './toolbar.js';
import { createElement as crt } from './utils.js';
export class Notifications {
    constructor(title, ...inputs) {
        _Notifications_inputs.set(this, []);
        _Notifications_title.set(this, '');
        _Notifications_buttons.set(this, void 0);
        _Notifications_titleElement.set(this, crt('div', '', { role: 'title-notification' }));
        _Notifications_contentElement.set(this, crt('div', '', { role: 'content-notification' }));
        _Notifications_notifictionElement.set(this, crt('div', '', {
            role: 'notification',
            tabindex: -1,
        }));
        _Notifications_tools.set(this, new Tool(`notification ${this.title} toolbar`));
        this.title = title;
        __classPrivateFieldSet(this, _Notifications_buttons, new List(crt('div', '', {}), `notification - ${this.title}`), "f");
        __classPrivateFieldSet(this, _Notifications_inputs, inputs, "f");
        __classPrivateFieldGet(this, _Notifications_notifictionElement, "f").append(__classPrivateFieldGet(this, _Notifications_titleElement, "f"), __classPrivateFieldGet(this, _Notifications_contentElement, "f"), __classPrivateFieldGet(this, _Notifications_buttons, "f").root);
        __classPrivateFieldGet(this, _Notifications_buttons, "f").configurations.selection = false;
        __classPrivateFieldGet(this, _Notifications_buttons, "f").configurations.clipboard = false;
        __classPrivateFieldGet(this, _Notifications_buttons, "f").configurations.scrolling = false;
        __classPrivateFieldGet(this, _Notifications_buttons, "f").setTargetShortcut([__classPrivateFieldGet(this, _Notifications_notifictionElement, "f")]);
        __classPrivateFieldGet(this, _Notifications_buttons, "f").flipShortcut('left-right');
        __classPrivateFieldGet(this, _Notifications_buttons, "f").mouse = true;
        __classPrivateFieldGet(Notifications, _a, "f", _Notifications_all).add(this);
    }
    get toolbar() {
        return __classPrivateFieldGet(this, _Notifications_tools, "f");
    }
    get inputs() {
        return __classPrivateFieldGet(this, _Notifications_inputs, "f");
    }
    get title() {
        return __classPrivateFieldGet(this, _Notifications_title, "f");
    }
    set title(v) {
        __classPrivateFieldSet(this, _Notifications_title, v, "f");
        __classPrivateFieldGet(this, _Notifications_titleElement, "f").innerHTML = `${v}`;
    }
    set content(v) {
        __classPrivateFieldGet(this, _Notifications_contentElement, "f").innerHTML = v;
    }
    get content() {
        return __classPrivateFieldGet(this, _Notifications_contentElement, "f").innerHTML;
    }
    static start(element = document.body) {
        element.appendChild(this.mainNotificationElement);
    }
    close() {
        __classPrivateFieldGet(this, _Notifications_notifictionElement, "f").remove();
        __classPrivateFieldGet(this, _Notifications_buttons, "f").root.innerHTML = '';
    }
    open(init = __classPrivateFieldGet(this, _Notifications_inputs, "f").at(-1)) {
        __classPrivateFieldGet(this, _Notifications_buttons, "f").root.innerHTML = __classPrivateFieldGet(this, _Notifications_inputs, "f").map(input => `<span aria-selected="${init === input}">${input.toString()}</span>`).join('\n');
        return new Promise(resolve => {
            var fn = (type, element) => {
                resolve(element.innerHTML);
                __classPrivateFieldGet(this, _Notifications_buttons, "f").offsubmit(fn);
            };
            Notifications.mainNotificationElement.appendChild(__classPrivateFieldGet(this, _Notifications_notifictionElement, "f"));
            __classPrivateFieldGet(this, _Notifications_buttons, "f").onsubmit(fn);
            __classPrivateFieldGet(this, _Notifications_notifictionElement, "f").focus();
        });
    }
    delete() {
        __classPrivateFieldGet(Notifications, _a, "f", _Notifications_all).delete(this);
    }
    static get all() {
        return Array.from(__classPrivateFieldGet(this, _a, "f", _Notifications_all));
    }
}
_a = Notifications, _Notifications_inputs = new WeakMap(), _Notifications_title = new WeakMap(), _Notifications_buttons = new WeakMap(), _Notifications_titleElement = new WeakMap(), _Notifications_contentElement = new WeakMap(), _Notifications_notifictionElement = new WeakMap(), _Notifications_tools = new WeakMap();
Notifications.mainNotificationElement = crt('div', '', {
    role: 'notifications',
});
_Notifications_all = { value: new Set() };
