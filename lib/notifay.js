var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Notification_notificationElement, _Notification_element, _Notification_docElement;
import { ListBox } from "./listbox.js";
import { createElement } from "./utils.js";
export class Notification extends ListBox {
    constructor(title, buttons) {
        var root = createElement("div", "", {});
        super(root, `notification : ${title}`);
        this.buttons = buttons;
        _Notification_element.set(this, createElement("div", "", {
            role: "notification",
            tabindex: "1",
        }));
        _Notification_docElement.set(this, createElement("div", "", {
            role: "doc-notification",
        }));
        this.titleElement = createElement("div", "", {
            role: "title-notification",
        });
        this.titleElement.innerHTML = `<span>NOTIFICATION</span> : ${title}`;
        __classPrivateFieldGet(this, _Notification_element, "f").append(this.titleElement, __classPrivateFieldGet(this, _Notification_docElement, "f"), root);
        this.removeTarget(root);
        this.addTarget(__classPrivateFieldGet(this, _Notification_element, "f"));
        this.setConfigurations({
            movable: true,
            selection: false,
            scrolling: false,
            redirect: true,
        });
        this.shortcuts.move.forword.change("ArrowRight");
        this.shortcuts.move.backword.change("ArrowLeft");
        this.shortcuts.selection.forword.change("Shift+ArrowRight");
        this.shortcuts.selection.backword.change("Shift+ArrowLeft");
        this.setMouse(true);
    }
    get status() {
        return __classPrivateFieldGet(Notification, _a, "f", _Notification_notificationElement).contains(__classPrivateFieldGet(this, _Notification_element, "f"));
    }
    get doc() {
        return __classPrivateFieldGet(this, _Notification_docElement, "f").innerText;
    }
    set doc(v) {
        __classPrivateFieldGet(this, _Notification_docElement, "f").innerHTML = v;
    }
    static start() {
        document.body.appendChild(__classPrivateFieldGet(this, _a, "f", _Notification_notificationElement));
    }
    close() {
        __classPrivateFieldGet(this, _Notification_element, "f").remove();
    }
    open() {
        __classPrivateFieldGet(Notification, _a, "f", _Notification_notificationElement).appendChild(__classPrivateFieldGet(this, _Notification_element, "f"));
        this.root.innerHTML = this.buttons
            .map((btn) => `<button>${btn.toString()}</button>`)
            .join("\n");
        __classPrivateFieldGet(this, _Notification_element, "f").focus();
        return new Promise((res, rej) => {
            var fn = (type, element) => {
                res(element.innerText);
                this.close();
                this.offsubmit(fn);
            };
            this.onsubmit(fn);
        });
    }
    static get notifays() {
        return this.all.filter(({ title }) => title.startsWith("`notification : `"));
    }
}
_a = Notification, _Notification_element = new WeakMap(), _Notification_docElement = new WeakMap();
_Notification_notificationElement = { value: createElement("div", "", {
        role: "notifications",
    }) };
