var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ListBox_all;
import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { isLooked as like, scrollToElement as ste } from './utils.js';
export class ListBox {
    constructor(root, title = `${root.ariaLabel}`) {
        this.root = root;
        this.selection_direction = 'forword';
        this.effective_hist_elements = [];
        this.rowname = '';
        this.configurations = {
            movable: true,
            scrolling: true,
            selection: true,
            redirect: true,
            clipboard: true,
        };
        this.onfunctionsubmit = [];
        this.onfunctionsselection = [];
        this.pointer_down_function = (e) => {
            var effective = this.EFFECTIVE_ELEMENTS;
            var mainsElements = effective.filter(element => element.contains(e.target));
            if (!mainsElements.length)
                this.select();
            var mainElement = mainsElements[0];
            for (let i = 1; i < mainsElements.length; i++)
                mainElement = mainsElements[i].contains(mainElement) ? mainElement : mainsElements[i];
            if (e.altKey)
                this.configurations.selection && this.setSelect(mainElement, !this.getSelect(mainElement));
            else {
                const element = this.ELEMENT_DIRECTION;
                if (e.shiftKey && element && this.configurations.selection) {
                    const items = this.ITEMS;
                    var start = items.indexOf(mainElement);
                    var end = items.indexOf(element);
                    if (end <= start) {
                        [start, end] = [end, start];
                        this.selection_direction = 'backword';
                    }
                    else
                        this.selection_direction = 'forword';
                    this.select(...items.slice(start, end + 1));
                }
                else {
                    this.select(mainElement);
                }
            }
        };
        this.click_function = (e) => {
            if (e.altKey || e.shiftKey)
                return;
            var focusElements = this.ITEMS.filter(ele => ele.contains(e.target));
            if (!focusElements.length)
                return;
            var focusElement = focusElements[0];
            for (let i = 1; i < focusElements.length; i++)
                focusElement = focusElements[i].contains(focusElement) ? focusElement : focusElements[i];
            focusElement && this.submit('click', focusElement);
        };
        this.drag_function = (e) => {
            var { x, y, target } = e;
            var element = document.elementFromPoint(x, y);
            if (!element)
                return;
            var row = element.closest(`[role="${this.rowname}"]`);
            if (!row)
                return;
            row.after(target);
        };
        if (__classPrivateFieldGet(ListBox, _a, "f", _ListBox_all).find(({ title: tlt }) => tlt == title))
            throw Error('cannot be used same label in tow difrent listbox.');
        this.root.ariaLabel = title;
        this.click = true;
        this.root.setAttribute('role', 'listbox');
        this.shortcuts = {
            selection: {
                forword: Sh.create(`${this.title}:forword selection`, `shift${Sh.separatorShortcuts}arrowdown`, [this.root], 'key').ondown(() => this.forwordSelection(1)),
                backword: Sh.create(`${this.title}:backword selection`, `shift${Sh.separatorShortcuts}arrowup`, [this.root], 'key').ondown(() => this.backwordSelection(1)),
                all: Sh.create(`${this.title}:all selection`, `ctrl${Sh.separatorShortcuts}a`, [this.root], 'key').ondown((comb, kyb) => {
                    kyb && kyb.preventDefault();
                    this.select(...this.EFFECTIVE_ELEMENTS);
                }),
                fullforword: Sh.create(`${this.title}:selection full forword`, `shift${Sh.separatorShortcuts}pagedown`, [this.root], 'key').ondown(() => { }),
                fullbackword: Sh.create(`${this.title}:selection full backword`, `shift${Sh.separatorShortcuts}pageup`, [this.root], 'key').ondown(() => { }),
            },
            find: null,
            move: {
                forword: Sh.create(`${this.title}:forword`, `arrowdown`, [this.root], 'key').ondown((combinition, event) => {
                    event && event.preventDefault();
                    this.forword(1);
                }),
                backword: Sh.create(`${this.title}:backword`, `arrowup`, [this.root], 'key').ondown((combinition, event) => {
                    event && event.preventDefault();
                    this.backword(1);
                }),
                fullforword: Sh.create(`${this.title}:full forword`, `pagedown`, [this.root], 'key').ondown(() => {
                    const max = this.MAX_ELEMENT_EFFCTIVE;
                    max ? this.select(max) : this.select();
                    this.configurations.scrolling && !like(max) && this.scroll('forword');
                }),
                fullbackword: Sh.create(`${this.title}:full backword`, `pageup`, [this.root], 'key').ondown(() => {
                    const min = this.MIN_ELEMENT_EFFECTIVE;
                    min ? this.select(min) : this.select();
                    this.configurations.scrolling && !like(min) && this.scroll('backword');
                }),
            },
            status: {
                submit: Sh.create(`${this.title}:submit`, `enter`, [this.root], 'key').ondown(() => this.submit('keypress', this.ELEMENT_DIRECTION)),
                cancel: Sh.create(`${this.title}:cancel`, 'escape', [this.root], 'key').ondown(() => {
                    this.select();
                    this.root;
                }),
            },
            clipboard: null,
            inner: null,
        };
    }
    get drag() {
        return Boolean(this.root.ondragend);
    }
    get click() {
        return this.root.onclick === this.click_function;
    }
    get mouse() {
        return this.root.onmouseover == this.pointer_down_function;
    }
    get title() {
        return `${this.root.ariaLabel}`;
    }
    get selectiondirection() {
        return this.selection_direction;
    }
    get ITEMS() {
        return Array.from(this.root.children);
    }
    get EFFECTIVE_ELEMENTS() {
        return this.ITEMS.filter(ele => this.getEffective(ele));
    }
    get SELECTD_ELEMENTS() {
        return this.ITEMS.filter(ele => this.getSelect(ele));
    }
    get FIRST_ELEMENT_SELECT() {
        var ele = this.ITEMS.find(ele => this.getSelect(ele));
        return ele ? ele : null;
    }
    get LAST_ELEMENT_SELECT() {
        var ele = this.ITEMS.reverse().find(ele => this.getSelect(ele));
        return ele ? ele : null;
    }
    get MIN_ELEMENT_EFFECTIVE() {
        var ele = this.ITEMS.find(ele => this.getEffective(ele));
        return ele ? ele : null;
    }
    get MAX_ELEMENT_EFFCTIVE() {
        var ele = this.ITEMS.reverse().find(ele => this.getEffective(ele));
        return ele ? ele : null;
    }
    get ELEMENT_DIRECTION() {
        return this.selection_direction == 'forword' ? this.LAST_ELEMENT_SELECT : this.FIRST_ELEMENT_SELECT;
    }
    set drag(v) {
        v = Boolean(v);
        this.root.ondragend = v ? this.drag_function : null;
        this.ITEMS.forEach(ele => (ele.draggable = v));
    }
    set click(flag) {
        this.root.onclick = flag ? this.click_function : null;
        this.root.onpointerdown = flag ? this.pointer_down_function : null;
    }
    set mouse(flag) {
        this.root.onmouseover = flag ? this.pointer_down_function : null;
        this.root.onmouseleave = flag ? () => this.select() : null;
    }
    getEffective(element) {
        return element.ariaDisabled !== 'true';
    }
    setEffective(element, flag) {
        element.ariaDisabled = `${!flag}`;
        if (!flag)
            element.ariaSelected = 'false';
    }
    getSelect(element) {
        return this.getEffective(element) && element.ariaSelected == 'true';
    }
    setSelect(element, flag) {
        var b = this.getEffective(element);
        if (!b)
            return false;
        element.ariaSelected = `${flag}`;
        return true;
    }
    setShow(element, flag) {
        element.style.display = flag ? '' : 'none';
        if (!flag) {
            if (this.getEffective(element))
                this.effective_hist_elements.push(element);
            this.setEffective(element, false);
        }
        else {
            var index = this.effective_hist_elements.indexOf(element);
            if (index >= 0) {
                this.effective_hist_elements.splice(index, 1);
                this.setEffective(element, true);
            }
        }
    }
    getShow(element) {
        return element.style.display == '' || this.getEffective(element);
    }
    effective(...elements) {
        this.ITEMS.forEach(ele => this.setEffective(ele, elements.includes(ele)));
    }
    select(...elements) {
        this.ITEMS.forEach(ele => this.setSelect(ele, elements.includes(ele)));
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
            ele = ele.nextElementSibling ? ele.nextElementSibling : this.configurations.redirect ? MIN_ELEMENT_EFFECTIVE : null;
            ele && this.getEffective(ele) && count--;
        }
        if (ele) {
            this.select(ele);
            if (this.configurations.scrolling && !like(ele))
                ste(ele, -1);
        }
        this.onfunctionsselection.forEach(fn => fn('forword'));
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
            ele = ele.previousElementSibling ? ele.previousElementSibling : this.configurations.redirect ? MAX_ELEMENT_EFFCTIVE : null;
            ele && this.getEffective(ele) && count--;
        }
        if (ele) {
            this.select(ele);
            if (this.configurations.scrolling && !like(ele))
                ste(ele, 0);
        }
        this.onfunctionsselection.forEach(fn => fn('backword'));
    }
    forwordSelection(count) {
        if (!count) {
            this.scroll('forword');
            this.onfunctionsselection.forEach(fn => fn('forword'));
            return;
        }
        var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
        if (first == last)
            this.selection_direction = 'forword';
        var element = this.selection_direction == 'forword' ? last : first;
        if (!element)
            return;
        if (this.selection_direction == 'forword') {
            var nextElementSibling = element.nextElementSibling;
            while (nextElementSibling && !this.getEffective(nextElementSibling))
                nextElementSibling = nextElementSibling.nextElementSibling;
            nextElementSibling && this.setSelect(nextElementSibling, true);
        }
        else
            this.setSelect(element, false);
        this.forwordSelection(count - 1);
    }
    backwordSelection(count) {
        if (!count) {
            this.scroll('backword');
            this.onfunctionsselection.forEach(fn => fn('backword'));
            return;
        }
        var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
        if (first == last)
            this.selection_direction = 'backword';
        var element = this.selection_direction == 'forword' ? last : first;
        if (!element)
            return;
        if (this.selection_direction == 'backword') {
            var previousElementSibling = element.previousElementSibling;
            while (previousElementSibling && !this.getEffective(previousElementSibling))
                previousElementSibling = previousElementSibling.previousElementSibling;
            previousElementSibling && this.setSelect(previousElementSibling, true);
        }
        else
            this.setSelect(element, false);
        this.backwordSelection(count - 1);
    }
    onsubmit(listener) {
        typeof listener == 'function' && this.onfunctionsubmit.push(listener);
        return this;
    }
    offsubmit(listener) {
        var index = this.onfunctionsubmit.indexOf(listener);
        if (index < 0)
            return false;
        this.onfunctionsubmit.splice(index, 1);
        return true;
    }
    onselection(listener) {
        typeof listener == 'function' && this.onfunctionsselection.push(listener);
        return this;
    }
    offselection(listener) {
        var index = this.onfunctionsselection.indexOf(listener);
        if (index < 0)
            return false;
        this.onfunctionsselection.splice(index, 1);
        return true;
    }
    submit(type = 'call', element = this.ELEMENT_DIRECTION) {
        if (!this.SELECTD_ELEMENTS.length || this.rowname === 'treeitem')
            return;
        this.onfunctionsubmit.forEach(fn => fn(type, element));
    }
    scroll(flag = 'forword') {
        var { ELEMENT_DIRECTION: element } = this;
        if (element && this.configurations.scrolling && !like(element))
            ste(element, flag == 'forword' ? -1 : 0);
    }
    go(dir = 'forword', count = 1) {
        this[dir](count);
    }
    selection(dir = 'forword', count = 1) {
        this[`${dir}Selection`](count);
    }
    flipShortcut(to) {
        var { selection, move } = this.shortcuts;
        var forword = to == 'top-bottom' ? 'arrowdown' : 'arrowright';
        var backword = to == 'top-bottom' ? 'arrowup' : 'arrowleft';
        selection.forword.change(`shift${Sh.separatorShortcuts}${forword}`);
        selection.backword.change(`shift${Sh.separatorShortcuts}${backword}`);
        move.forword.change(forword);
        move.backword.change(backword);
        this.shortcuts.inner?.open.change(to == 'left-right' ? 'arrowdown' : 'arrowright');
        this.shortcuts.inner?.close.change(to == 'left-right' ? 'arrowup' : 'arrowleft');
    }
    setTargetShortcut(targets = null) {
        this.shortcuts.move.forword.targets = targets;
        this.shortcuts.move.backword.targets = targets;
        this.shortcuts.selection.forword.targets = targets;
        this.shortcuts.selection.backword.targets = targets;
        this.shortcuts.selection.all.targets = targets;
        this.shortcuts.status.submit.targets = targets;
        this.shortcuts.status.cancel.targets = targets;
    }
    static get all() {
        return [...__classPrivateFieldGet(this, _a, "f", _ListBox_all)];
    }
    static title(title) {
        var list = __classPrivateFieldGet(this, _a, "f", _ListBox_all).find(({ title: t }) => t == title);
        return list || null;
    }
}
_a = ListBox;
_ListBox_all = { value: [] };
