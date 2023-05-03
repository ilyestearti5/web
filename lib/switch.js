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
var _Switch_viewElement, _Switch_paths, _Switch_links;
import { createElement } from './utils.js';
import { Table } from './table.js';
export class Switch {
    constructor(title, viewElement = createElement('div', '', {})) {
        this.title = title;
        _Switch_viewElement.set(this, void 0);
        _Switch_paths.set(this, []);
        _Switch_links.set(this, void 0);
        this.onfunctionschange = [];
        __classPrivateFieldSet(this, _Switch_viewElement, viewElement, "f");
        __classPrivateFieldSet(this, _Switch_links, Table.create(this.title, { path: ' - ' }), "f");
        document.addEventListener('click', ({ target }) => {
            if (!target)
                return;
            var finded = target.closest(`*[path]`);
            if (!finded)
                return;
            var [switch_title, path_content] = finded
                .getAttribute('path')
                .split(':');
            if (switch_title != this.title)
                return;
            this.set(path_content);
        });
        __classPrivateFieldGet(this, _Switch_links, "f").onsubmit((e, element) => {
            var data = __classPrivateFieldGet(this, _Switch_links, "f").readRow(element);
            this.set(data.path);
        });
    }
    get links() {
        return __classPrivateFieldGet(this, _Switch_links, "f");
    }
    get viewElement() {
        return __classPrivateFieldGet(this, _Switch_viewElement, "f");
    }
    get paths() {
        return new Set(__classPrivateFieldGet(this, _Switch_paths, "f").map(({ path }) => path));
    }
    get elements() {
        return new Set(__classPrivateFieldGet(this, _Switch_paths, "f").map(({ element }) => element));
    }
    get selected() {
        var selected = Array.from(this.elements).find(e => e.ariaCurrent == 'true');
        return selected ? selected.ariaValueText : null;
    }
    get(path, element) {
        if (this.paths.has(path))
            throw Error('cannot use two path has diffrent element');
        __classPrivateFieldGet(this, _Switch_paths, "f").push({ path, element });
        element.ariaCurrent = `false`;
        element.ariaValueText = `${path}`;
        __classPrivateFieldGet(this, _Switch_links, "f").methodeSync('append', [{ path }]);
        return this;
    }
    set(path) {
        if (this.selected == path)
            return;
        var finded = __classPrivateFieldGet(this, _Switch_paths, "f").find(({ path: p }) => path == p);
        if (!finded) {
            console.warn(Error(`the path '${path}' is not defined tray defined by 'get' methode`));
            return this;
        }
        __classPrivateFieldGet(this, _Switch_viewElement, "f").innerHTML = '';
        __classPrivateFieldGet(this, _Switch_viewElement, "f").appendChild(finded.element);
        this.elements.forEach(ele => (ele.ariaCurrent = 'false'));
        finded.element.ariaCurrent = 'true';
        var data = __classPrivateFieldGet(this, _Switch_links, "f").DATA;
        var index = data.map(({ path }) => path).indexOf(path);
        if (index >= 0)
            __classPrivateFieldGet(this, _Switch_links, "f").select(data[index].row);
        this.onfunctionschange.forEach(fn => fn());
        return this;
    }
    onchange(listener) {
        typeof listener == 'function' && this.onfunctionschange.push(listener);
        return this;
    }
    offchange(listener) {
        var index = this.onfunctionschange.indexOf(listener);
        if (index < 0)
            return false;
        this.onfunctionschange.splice(index, 1);
        return true;
    }
    static fromElement(element, title = `${element.ariaLabel}`) {
        if (element.tagName.toLowerCase() != "switch")
            return null;
        var switchElement = element;
        var result = new Switch(title);
        var cases = Array.from(switchElement.children);
        cases.forEach(caseElement => {
            var itemElement = createElement('div', '', {});
            itemElement.append(...Array.from(caseElement.children));
            result.get(`${caseElement.getAttribute('path')}`, itemElement);
        });
        switchElement.replaceWith(__classPrivateFieldGet(result, _Switch_viewElement, "f"));
        return result;
    }
}
_Switch_viewElement = new WeakMap(), _Switch_paths = new WeakMap(), _Switch_links = new WeakMap();
