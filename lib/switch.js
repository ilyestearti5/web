var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Switch_viewElement, _Switch_switchElement, _Switch_querys;
import { Table } from './table.js';
import { createElement } from './utils.js';
export class Switch extends Table {
    constructor(title) {
        const root = createElement('div', '', {});
        super(root, `switch:${title}`, ['label'], { label: '-' });
        _Switch_viewElement.set(this, createElement('div', '', { role: 'views' }));
        _Switch_switchElement.set(this, createElement('div', '', { role: 'switch' }));
        _Switch_querys.set(this, new Set(null));
        __classPrivateFieldGet(this, _Switch_switchElement, "f").appendChild(root);
        __classPrivateFieldGet(this, _Switch_switchElement, "f").appendChild(__classPrivateFieldGet(this, _Switch_viewElement, "f"));
        this.configurations.selection = false;
        this.configurations.redirect = false;
        this.shortcuts.selection.all.clear('down');
        this.shortcuts.selection.forword.clear('down');
        this.shortcuts.selection.backword.clear('down');
        this.shortcuts.selection.fullforword.clear('down');
        this.shortcuts.selection.fullbackword.clear('down');
        this.onsubmit((type, ele) => {
            var lbl = this.readRow(ele).label;
            if (this.selected == lbl)
                return;
            this.set(lbl);
        });
    }
    get view() {
        return __classPrivateFieldGet(this, _Switch_viewElement, "f");
    }
    get switch() {
        return __classPrivateFieldGet(this, _Switch_switchElement, "f");
    }
    get(path, element) {
        if (path == 'no selected item')
            throw Error("cannot be use label 'no selected item' is usable for confiurations ");
        element.setAttribute('aria-valuenow', path);
        __classPrivateFieldGet(this, _Switch_querys, "f").add(element);
        this.appendSync([{ label: path }]);
    }
    delete(path) {
        var finded = Array.from(__classPrivateFieldGet(this, _Switch_querys, "f")).find(element => element.ariaValueNow == path);
        if (finded) {
            __classPrivateFieldGet(this, _Switch_querys, "f").delete(finded);
            var finded2 = this.DATA.find(d => d.label == path);
            if (finded2)
                finded2.row.remove();
        }
    }
    set(path) {
        var finded = this.DATA.find(({ label }) => label == path);
        if (finded) {
            this.select(finded.row);
            __classPrivateFieldGet(this, _Switch_querys, "f").forEach(ele => {
                if (ele.ariaValueNow == path) {
                    __classPrivateFieldGet(this, _Switch_viewElement, "f").appendChild(ele);
                    ele.ariaLive = 'true';
                }
                else {
                    ele.remove();
                    ele.ariaLive = 'false';
                }
            });
        }
    }
    get querys() {
        return Array.from(__classPrivateFieldGet(this, _Switch_querys, "f"));
    }
    get selectedView() {
        var fd = this.querys.find(ele => ele.ariaLive == 'true');
        return fd ? fd : null;
    }
    get selected() {
        const fd = this.selectedView;
        return fd ? fd.ariaValueNow : 'no selected item';
    }
}
_Switch_viewElement = new WeakMap(), _Switch_switchElement = new WeakMap(), _Switch_querys = new WeakMap();
