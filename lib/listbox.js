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
var _a, _ListBox_selection_direction, _ListBox_all, _ListBox_pointer_down_function, _ListBox_click_function, _ListBox_drag_function;
import { KeyboardShortcut } from "./keyboardshortcuts.js";
import { isLooked, scrollToElement } from "./utils.js";
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
        this.onSelectionFunctions = [];
        _ListBox_pointer_down_function.set(this, (e) => {
            var effective = this.EFFECTIVE_ELEMENTS;
            var mainsElements = effective.filter((element) => element.contains(e.target));
            if (!mainsElements.length)
                this.select();
            var mainElement = mainsElements[0];
            for (let i = 1; i < mainsElements.length; i++)
                mainElement = mainsElements[i].contains(mainElement)
                    ? mainElement
                    : mainsElements[i];
            if (e.altKey)
                this.configurations.scrolling &&
                    this.setSelect(mainElement, !this.getSelect(mainElement));
            else
                this.select(mainElement);
        });
        _ListBox_click_function.set(this, (e) => {
            if (e.altKey)
                return;
            var focusElements = this.ITEMS.filter((ele) => ele.contains(e.target));
            if (!focusElements.length)
                return;
            var focusElement = focusElements[0];
            for (let i = 1; i < focusElements.length; i++)
                focusElement = focusElements[i].contains(focusElement)
                    ? focusElement
                    : focusElements[i];
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
        if (__classPrivateFieldGet(ListBox, _a, "f", _ListBox_all).find(({ title: tlt }) => tlt == title))
            throw Error("cannot be used same label in tow difrent listbox.");
        this.root.ariaLabel = title;
        this.click = true;
        this.root.role = "listbox";
        this.shortcuts = {
            selection: {
                forword: KeyboardShortcut.create(`${this.title} - forword selection`, `Shift${KeyboardShortcut.separatorShortcuts}ArrowDown`, [this.root]).ondown(() => this.forwordSelection(1)),
                backword: KeyboardShortcut.create(`${this.title} - backword selection`, `Shift${KeyboardShortcut.separatorShortcuts}ArrowUp`, [this.root]).ondown(() => this.backwordSelection(1)),
                all: KeyboardShortcut.create(`${this.title} - all selection`, `Ctrl${KeyboardShortcut.separatorShortcuts}A`, [this.root]).ondown((comb, kyb) => {
                    kyb && kyb.preventDefault();
                    this.select(...this.EFFECTIVE_ELEMENTS);
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
                ]).ondown(() => this.submit("keypress", this.ELEMENT_DIRECTION)),
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
        this.onSelectionFunctions.forEach((fn) => fn("forword"));
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
        this.onSelectionFunctions.forEach((fn) => fn("backword"));
    }
    forwordSelection(count) {
        if (!count) {
            this.scroll("forword");
            this.onSelectionFunctions.forEach((fn) => fn("forword"));
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
            this.onSelectionFunctions.forEach((fn) => fn("backword"));
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
    onselection(listener) {
        typeof listener == "function" && this.onSelectionFunctions.push(listener);
        return this;
    }
    offselection(listener) {
        var index = this.onSelectionFunctions.indexOf(listener);
        if (index < 0)
            return false;
        this.onSelectionFunctions.splice(index, 1);
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
        this[`${dir}Selection`](count);
    }
    flipshortcut(to) {
        var { selection, move } = this.shortcuts;
        var forword = to == "top-bottom" ? "ArrowDown" : "ArrowRight";
        var backword = to == "top-bottom" ? "ArrowUp" : "ArrowLeft";
        selection.forword.change(`Shift${KeyboardShortcut.separatorShortcuts}${forword}`);
        selection.backword.change(`Shift${KeyboardShortcut.separatorShortcuts}${backword}`);
        move.forword.change(forword);
        move.backword.change(backword);
        this.shortcuts.inner?.open.change(to == "left-right" ? "ArrowDown" : "ArrowRight");
        this.shortcuts.inner?.close.change(to == "left-right" ? "ArrowUp" : "ArrowLeft");
    }
    settargetsshortcuts(targets = null) {
        this.shortcuts.move.forword.targets = targets;
        this.shortcuts.move.backword.targets = targets;
        this.shortcuts.selection.forword.targets = targets;
        this.shortcuts.selection.backword.targets = targets;
        this.shortcuts.selection.all.targets = targets;
        this.shortcuts.status.submit.targets = targets;
        this.shortcuts.status.cancel.targets = targets;
    }
    static get all() {
        return __classPrivateFieldGet(this, _a, "f", _ListBox_all);
    }
}
_a = ListBox, _ListBox_selection_direction = new WeakMap(), _ListBox_pointer_down_function = new WeakMap(), _ListBox_click_function = new WeakMap(), _ListBox_drag_function = new WeakMap();
_ListBox_all = { value: [] };
