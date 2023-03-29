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
var _ListBox_instances, _a, _ListBox_title, _ListBox_selection_direction, _ListBox_dragging, _ListBox_all, _ListBox_shortcutsConfig, _ListBox_configurations, _ListBox_on_submit_fn, _ListBox_on_change_fn, _ListBox_pointer_down_function, _ListBox_click_function, _ListBox_drag_function, _ListBox_setConfigurations, _ListBox_getConfigurations, _ListBox_setClick, _ListBox_getClick, _ListBox_setMouse, _ListBox_getMouse, _ListBox_getEffective, _ListBox_setEffective, _ListBox_getSelect, _ListBox_setSelect, _ListBox_effective, _ListBox_select, _ListBox_forword, _ListBox_backword, _ListBox_forwordSelection, _ListBox_backwordSelection, _ListBox_onsubmit, _ListBox_offsubmit, _ListBox_onchange, _ListBox_offchange, _ListBox_submit, _ListBox_scroll;
import { KeyboardShortcut } from "./keyboard-shortcuts.js";
import { defaultObject, isLooked, scrollToElement } from "./utils.js";
export class ListBox {
    constructor(root, title = `${root.ariaLabel}`) {
        this.root = root;
        _ListBox_instances.add(this);
        _ListBox_title.set(this, "");
        _ListBox_selection_direction.set(this, "forword");
        _ListBox_dragging.set(this, false);
        _ListBox_shortcutsConfig.set(this, {
            selection: {
                forword: KeyboardShortcut.create(`${this.title} - forword selection`, `Shift${KeyboardShortcut.separatorShortcuts}ArrowDown`, [this.root]).ondown(() => {
                    this.forwordSelection(1);
                }),
                backword: KeyboardShortcut.create(`${this.title} - backword selection`, `Shift${KeyboardShortcut.separatorShortcuts}ArrowUp`, [this.root]).ondown(() => {
                    this.backwordSelection(1);
                }),
            },
            move: {
                forword: KeyboardShortcut.create(`${this.title} - forword`, `ArrowDown`, [
                    this.root,
                ]).ondown((combinition, event) => {
                    event && event.preventDefault();
                    this.forword(1);
                }),
                backword: KeyboardShortcut.create(`${this.title} - backword`, `ArrowUp`, [
                    this.root,
                ]).ondown((combinition, event) => {
                    event && event.preventDefault();
                    this.backword(1);
                }),
            },
            status: {
                submit: KeyboardShortcut.create(`${this.title} - submit`, `Enter`, [
                    this.root,
                ]).ondown(() => {
                    __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_submit).call(this, "keypress");
                }),
                cancel: KeyboardShortcut.create(`${this.title} - cancel`, "Escape", [
                    this.root,
                ]).ondown(() => this.select()),
            },
            clipboard: null,
            inner: null,
        });
        this.rowString = "row";
        _ListBox_configurations.set(this, {
            movable: true,
            scrolling: true,
            selection: true,
            redirect: true,
        });
        _ListBox_on_submit_fn.set(this, []);
        _ListBox_on_change_fn.set(this, []);
        _ListBox_pointer_down_function.set(this, (e) => {
            var effective = this.EFFECTIVE_ELEMENTS;
            var mainElement = effective.find((element) => element.contains(e.target));
            if (!mainElement)
                return;
            if (e.altKey)
                this.setSelect(mainElement, !this.getSelect(mainElement));
            else
                this.select(mainElement);
        });
        _ListBox_click_function.set(this, (e) => {
            if (e.altKey && e.target == this.root)
                return;
            __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_submit).call(this, "click");
        });
        _ListBox_drag_function.set(this, (e) => {
            var { x, y, target } = e;
            var element = document.elementFromPoint(x, y);
            if (!element)
                return;
            var row = element.closest(`[role="${this.rowString}"]`);
            if (!row)
                return;
            row.after(target);
        });
        if (__classPrivateFieldGet(ListBox, _a, "f", _ListBox_all).find(({ title: tlt }) => tlt == title))
            throw Error("Cannot Be Used Same Label in Tow Difrent Listbox.");
        this.setClick(true);
        this.root.setAttribute("role", "listbox");
        this.root.ariaLabel = title;
        __classPrivateFieldSet(this, _ListBox_title, title, "f");
    }
    get dragging() {
        return __classPrivateFieldGet(this, _ListBox_dragging, "f");
    }
    set dragging(v) {
        v = Boolean(v);
        __classPrivateFieldSet(this, _ListBox_dragging, v, "f");
        this.root.ondragend = v ? __classPrivateFieldGet(this, _ListBox_drag_function, "f") : null;
        this.ITEMS.forEach((ele) => (ele.draggable = v));
    }
    get shortcuts() {
        return __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f");
    }
    get title() {
        return __classPrivateFieldGet(this, _ListBox_title, "f");
    }
    get selectionDirection() {
        return __classPrivateFieldGet(this, _ListBox_selection_direction, "f");
    }
    get ITEMS() {
        return Array.from(this.root.children);
    }
    get EFFECTIVE_ELEMENTS() {
        return this.ITEMS.filter((ele) => this.getEffective(ele));
    }
    get SELECT_ELEMENTS() {
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
    get click() {
        return this.getClick();
    }
    get mouse() {
        return this.getMouse();
    }
    set click(v) {
        this.setClick(v);
    }
    set mouse(v) {
        this.setMouse(v);
    }
    setConfigurations(config) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setConfigurations).call(this, config);
    }
    getConfigurations() {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getConfigurations).call(this);
    }
    setClick(flag = true) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setClick).call(this, flag);
    }
    getClick() {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getClick).call(this);
    }
    setMouse(flag) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setMouse).call(this, flag);
    }
    getMouse() {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getMouse).call(this);
    }
    addTarget(...elements) {
        var _b, _c, _d, _e, _f, _g;
        (_b = __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f").move.forword.targets) === null || _b === void 0 ? void 0 : _b.push(...elements);
        (_c = __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f").move.backword.targets) === null || _c === void 0 ? void 0 : _c.push(...elements);
        (_d = __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f").selection.forword.targets) === null || _d === void 0 ? void 0 : _d.push(...elements);
        (_e = __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f").selection.backword.targets) === null || _e === void 0 ? void 0 : _e.push(...elements);
        (_f = __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f").status.cancel.targets) === null || _f === void 0 ? void 0 : _f.push(...elements);
        (_g = __classPrivateFieldGet(this, _ListBox_shortcutsConfig, "f").status.submit.targets) === null || _g === void 0 ? void 0 : _g.push(...elements);
    }
    getEffective(element) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getEffective).call(this, element);
    }
    setEffective(element, flag = true) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setEffective).call(this, element, flag);
    }
    getSelect(element) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getSelect).call(this, element);
    }
    setSelect(element, flag = true) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setSelect).call(this, element, flag);
    }
    effective(...elements) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_effective).call(this, ...elements);
    }
    select(...elements) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_select).call(this, ...elements);
    }
    forword(count = 1) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_forword).call(this, count);
    }
    backword(count = 1) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_backword).call(this, count);
    }
    go(dir = "forword", count = 1) {
        this[dir](count);
    }
    forwordSelection(count = 1) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_forwordSelection).call(this, count);
    }
    backwordSelection(count = 1) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_backwordSelection).call(this, count);
    }
    selection(dir = "forword", count = 1) {
        dir == "forword"
            ? this.forwordSelection(count)
            : this.backwordSelection(count);
    }
    onsubmit(listener) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_onsubmit).call(this, listener);
    }
    offsubmit(listener) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_offsubmit).call(this, listener);
    }
    onchange(listener) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_onchange).call(this, listener);
    }
    offchange(listener) {
        return __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_offchange).call(this, listener);
    }
    submit() {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_submit).call(this, "call");
    }
    scroll(dir) {
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_scroll).call(this, dir == "forword");
    }
    static get all() {
        return __classPrivateFieldGet(this, _a, "f", _ListBox_all);
    }
}
_a = ListBox, _ListBox_title = new WeakMap(), _ListBox_selection_direction = new WeakMap(), _ListBox_dragging = new WeakMap(), _ListBox_shortcutsConfig = new WeakMap(), _ListBox_configurations = new WeakMap(), _ListBox_on_submit_fn = new WeakMap(), _ListBox_on_change_fn = new WeakMap(), _ListBox_pointer_down_function = new WeakMap(), _ListBox_click_function = new WeakMap(), _ListBox_drag_function = new WeakMap(), _ListBox_instances = new WeakSet(), _ListBox_setConfigurations = function _ListBox_setConfigurations(config) {
    __classPrivateFieldSet(this, _ListBox_configurations, defaultObject(config, __classPrivateFieldGet(this, _ListBox_configurations, "f")), "f");
}, _ListBox_getConfigurations = function _ListBox_getConfigurations() {
    return __classPrivateFieldGet(this, _ListBox_configurations, "f");
}, _ListBox_setClick = function _ListBox_setClick(flag) {
    this.root.onclick = flag ? __classPrivateFieldGet(this, _ListBox_click_function, "f") : null;
    this.root.onpointerdown = flag ? __classPrivateFieldGet(this, _ListBox_pointer_down_function, "f") : null;
}, _ListBox_getClick = function _ListBox_getClick() {
    return !!this.root.onclick;
}, _ListBox_setMouse = function _ListBox_setMouse(flag) {
    this.root.onmouseover = flag ? __classPrivateFieldGet(this, _ListBox_click_function, "f") : null;
}, _ListBox_getMouse = function _ListBox_getMouse() {
    return Boolean(this.root.onmouseover);
}, _ListBox_getEffective = function _ListBox_getEffective(element) {
    return element.ariaDisabled !== "true";
}, _ListBox_setEffective = function _ListBox_setEffective(element, flag) {
    element.ariaDisabled = `${!flag}`;
    if (!flag)
        element.ariaSelected = "false";
}, _ListBox_getSelect = function _ListBox_getSelect(element) {
    return this.getEffective(element) && element.ariaSelected == "true";
}, _ListBox_setSelect = function _ListBox_setSelect(element, flag) {
    var b = this.getEffective(element);
    if (!b) {
        return false;
    }
    element.ariaSelected = `${flag}`;
    return true;
}, _ListBox_effective = function _ListBox_effective(...elements) {
    this.ITEMS.forEach((ele) => this.setEffective(ele, elements.includes(ele)));
}, _ListBox_select = function _ListBox_select(...elements) {
    this.ITEMS.forEach((ele) => this.setSelect(ele, elements.includes(ele)));
}, _ListBox_forword = function _ListBox_forword(count) {
    if (!__classPrivateFieldGet(this, _ListBox_configurations, "f").movable)
        return;
    var { LAST_ELEMENT_SELECT, MIN_ELEMENT_EFFECTIVE } = this;
    var ele = LAST_ELEMENT_SELECT;
    if (!ele) {
        ele = MIN_ELEMENT_EFFECTIVE;
        count--;
    }
    while (ele && count) {
        this.getEffective(ele) && count--;
        ele = ele.nextElementSibling
            ? ele.nextElementSibling
            : __classPrivateFieldGet(this, _ListBox_configurations, "f").redirect
                ? MIN_ELEMENT_EFFECTIVE
                : null;
    }
    if (ele) {
        this.select(ele);
        if (__classPrivateFieldGet(this, _ListBox_configurations, "f").scrolling && !isLooked(ele))
            scrollToElement(ele, -1);
    }
}, _ListBox_backword = function _ListBox_backword(count) {
    if (!__classPrivateFieldGet(this, _ListBox_configurations, "f").movable)
        return;
    var { FIRST_ELEMENT_SELECT, MAX_ELEMENT_EFFCTIVE } = this;
    var ele = FIRST_ELEMENT_SELECT;
    if (!ele) {
        ele = MAX_ELEMENT_EFFCTIVE;
        count--;
    }
    while (ele && count) {
        this.getEffective(ele) && count--;
        ele = ele.previousElementSibling
            ? ele.previousElementSibling
            : __classPrivateFieldGet(this, _ListBox_configurations, "f").redirect
                ? MAX_ELEMENT_EFFCTIVE
                : null;
    }
    if (ele) {
        this.select(ele);
        if (__classPrivateFieldGet(this, _ListBox_configurations, "f").scrolling && !isLooked(ele))
            scrollToElement(ele, 0);
    }
}, _ListBox_forwordSelection = function _ListBox_forwordSelection(count) {
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
            !__classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getEffective).call(this, nextElementSibling))
            nextElementSibling = nextElementSibling.nextElementSibling;
        nextElementSibling &&
            __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setSelect).call(this, nextElementSibling, true);
    }
    else
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setSelect).call(this, element, false);
    __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_forwordSelection).call(this, count - 1);
}, _ListBox_backwordSelection = function _ListBox_backwordSelection(count) {
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
            !__classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_getEffective).call(this, previousElementSibling))
            previousElementSibling = previousElementSibling.previousElementSibling;
        previousElementSibling &&
            __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setSelect).call(this, previousElementSibling, true);
    }
    else
        __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_setSelect).call(this, element, false);
    __classPrivateFieldGet(this, _ListBox_instances, "m", _ListBox_backwordSelection).call(this, count - 1);
}, _ListBox_onsubmit = function _ListBox_onsubmit(listener) {
    typeof listener == "function" && __classPrivateFieldGet(this, _ListBox_on_submit_fn, "f").push(listener);
    return this;
}, _ListBox_offsubmit = function _ListBox_offsubmit(listener) {
    var index = __classPrivateFieldGet(this, _ListBox_on_submit_fn, "f").indexOf(listener);
    if (index < 0)
        return false;
    __classPrivateFieldGet(this, _ListBox_on_submit_fn, "f").splice(index, 1);
    return true;
}, _ListBox_onchange = function _ListBox_onchange(listener) {
    typeof listener == "function" && __classPrivateFieldGet(this, _ListBox_on_change_fn, "f").push(listener);
    return this;
}, _ListBox_offchange = function _ListBox_offchange(listener) {
    var index = __classPrivateFieldGet(this, _ListBox_on_change_fn, "f").indexOf(listener);
    if (index < 0)
        return false;
    __classPrivateFieldGet(this, _ListBox_on_change_fn, "f").splice(index, 1);
    return true;
}, _ListBox_submit = function _ListBox_submit(type = "click") {
    if (this.SELECT_ELEMENTS.length)
        __classPrivateFieldGet(this, _ListBox_on_submit_fn, "f").forEach((fn) => fn(type));
}, _ListBox_scroll = function _ListBox_scroll(flag) {
    var { ELEMENT_DIRECTION: element } = this;
    if (element && __classPrivateFieldGet(this, _ListBox_configurations, "f").scrolling && !isLooked(element))
        scrollToElement(element, flag ? -1 : 0);
};
_ListBox_all = { value: [] };
