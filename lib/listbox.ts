import { KeyboardShortcut } from "./keyboardshortcuts.js";
import {
  direction,
  shortcutConfigurationsList,
  configListBox,
  submitListener,
  submitTypePress,
} from "./types.js";
import { isLooked, scrollToElement } from "./utils.js";

export class ListBox {
  // title of listbox is unique
  // direction of listbox (forword|backword)
  #selection_direction: direction = "forword";
  // array represnt all listbox declared before
  static #all: ListBox[] = [];
  // shortcut of on listbox
  public shortcuts: shortcutConfigurationsList;
  // the name of row iterable
  public rowname: string = "";
  public configurations: configListBox = {
    movable: true,
    scrolling: true,
    selection: true,
    redirect: true,
    clipboard: true,
  };
  // on submit functions
  protected onSubmitFunctions: submitListener[] = [];
  protected onSelectionFunctions: Function[] = [];
  // on change content functions
  /**
   *
   * @param e MouseEvent for when click down in element change this element to selected element
   * @returns {void}
   */
  #pointer_down_function = (e: MouseEvent): void => {
    var effective = this.EFFECTIVE_ELEMENTS;
    var mainsElements = effective.filter((element) =>
      element.contains(e.target as HTMLElement)
    );
    if (!mainsElements.length) this.select();
    var mainElement = mainsElements[0];
    for (let i = 1; i < mainsElements.length; i++)
      mainElement = mainsElements[i].contains(mainElement)
        ? mainElement
        : mainsElements[i];
    if (e.altKey)
      this.configurations.scrolling &&
        this.setSelect(mainElement, !this.getSelect(mainElement));
    else this.select(mainElement);
  };
  /**
   *
   * @param e MouseEvent for when click in element change this element to selected element
   * @returns {void}
   */
  #click_function = (e: MouseEvent): void => {
    if (e.altKey) return;
    var focusElements = this.ITEMS.filter((ele) =>
      ele.contains(e.target as HTMLElement)
    );
    if (!focusElements.length) return;
    var focusElement = focusElements[0];
    for (let i = 1; i < focusElements.length; i++)
      focusElement = focusElements[i].contains(focusElement)
        ? focusElement
        : focusElements[i];
    focusElement && this.submit("click", focusElement);
  };
  /**
   *
   * @param e DragEvent for when drag element to other place
   * @returns
   */
  #drag_function = (e: DragEvent): void => {
    var { x, y, target } = e;
    var element = document.elementFromPoint(x, y);
    if (!element) return;
    var row = element.closest(`[role="${this.rowname}"]`) as HTMLElement | null;
    if (!row) return;
    row.after(target as HTMLElement);
  };
  //
  constructor(public root: HTMLElement, title: string = `${root.ariaLabel}`) {
    if (ListBox.#all.find(({ title: tlt }) => tlt == title))
      throw Error("cannot be used same label in tow difrent listbox.");
    this.root.ariaLabel = title;
    this.click = true;
    this.root.role = "listbox";
    this.shortcuts = {
      selection: {
        forword: KeyboardShortcut.create(
          `${this.title} - forword selection`,
          `Shift${KeyboardShortcut.separatorShortcuts}ArrowDown`,
          [this.root]
        ).ondown(() => this.forwordSelection(1)),
        backword: KeyboardShortcut.create(
          `${this.title} - backword selection`,
          `Shift${KeyboardShortcut.separatorShortcuts}ArrowUp`,
          [this.root]
        ).ondown(() => this.backwordSelection(1)),
        all: KeyboardShortcut.create(
          `${this.title} - all selection`,
          `Ctrl${KeyboardShortcut.separatorShortcuts}A`,
          [this.root]
        ).ondown((comb, kyb) => {
          kyb && kyb.preventDefault();
          this.select(...this.EFFECTIVE_ELEMENTS);
        }),
      },
      find: null,
      move: {
        forword: KeyboardShortcut.create(
          `${this.title} - forword`,
          `ArrowDown`,
          [this.root]
        ).ondown((combinition, event) => {
          event && event.preventDefault();
          this.forword(1);
        }),
        backword: KeyboardShortcut.create(
          `${this.title} - backword`,
          `ArrowUp`,
          [this.root]
        ).ondown((combinition, event) => {
          event && event.preventDefault();
          this.backword(1);
        }),
      },
      status: {
        submit: KeyboardShortcut.create(`${this.title} - submit`, `Enter`, [
          this.root,
        ]).ondown(() => this.submit("keypress", this.ELEMENT_DIRECTION!)),
        cancel: KeyboardShortcut.create(`${this.title} - cancel`, "Escape", [
          this.root,
        ]).ondown(() => this.select()),
      },
      // has value in table & tree constructor
      clipboard: null,
      // has value in tree constructor
      inner: null,
    };
  }
  // getters
  get drag() {
    return Boolean(this.root.ondragend);
  }
  get click() {
    return this.root.onclick === this.#click_function;
  }
  get mouse() {
    return this.root.onmouseover == this.#pointer_down_function;
  }
  get title() {
    return `${this.root.ariaLabel}`;
  }
  get selectiondirection() {
    return this.#selection_direction;
  }
  get ITEMS() {
    return Array.from(this.root.children) as HTMLElement[];
  }
  get EFFECTIVE_ELEMENTS() {
    return this.ITEMS.filter((ele) => this.getEffective(ele));
  }
  get SELECTD_ELEMENTS(): HTMLElement[] {
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
    return this.#selection_direction == "forword"
      ? this.LAST_ELEMENT_SELECT
      : this.FIRST_ELEMENT_SELECT;
  }
  // setters
  set drag(v: boolean) {
    v = Boolean(v);
    this.root.ondragend = v ? this.#drag_function : null;
    this.ITEMS.forEach((ele) => (ele.draggable = v));
  }
  set click(flag) {
    this.root.onclick = flag ? this.#click_function : null;
    this.root.onpointerdown = flag ? this.#pointer_down_function : null;
  }
  set mouse(flag) {
    this.root.onmouseover = flag ? this.#pointer_down_function : null;
    this.root.onmouseleave = flag ? () => this.select() : null;
  }
  // methods
  /**
   * true if element is effective and can be focus
   * @param element
   * @returns
   */
  getEffective(element: HTMLElement) {
    return element.ariaDisabled !== "true";
  }
  /**
   * change no effective element to effective element and also (reverse)
   * @param element
   * @returns
   */
  setEffective(element: HTMLElement, flag: boolean) {
    element.ariaDisabled = `${!flag}`;
    if (!flag) element.ariaSelected = "false";
  }
  getSelect(element: HTMLElement) {
    return this.getEffective(element) && element.ariaSelected == "true";
  }
  setSelect(element: HTMLElement, flag: boolean): boolean {
    var b = this.getEffective(element);
    if (!b) {
      return false;
    }
    element.ariaSelected = `${flag}`;
    return true;
  }
  effective(...elements: HTMLElement[]) {
    this.ITEMS.forEach((ele) => this.setEffective(ele, elements.includes(ele)));
  }
  select(...elements: HTMLElement[]) {
    this.ITEMS.forEach((ele) => this.setSelect(ele, elements.includes(ele)));
  }
  forword(count: number) {
    if (!this.configurations.movable) return;
    var { LAST_ELEMENT_SELECT, MIN_ELEMENT_EFFECTIVE } = this;
    var ele = LAST_ELEMENT_SELECT;
    if (!ele) {
      ele = MIN_ELEMENT_EFFECTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.nextElementSibling
        ? (ele.nextElementSibling as HTMLElement)
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
  backword(count: number) {
    if (!this.configurations.movable) return;
    var { FIRST_ELEMENT_SELECT, MAX_ELEMENT_EFFCTIVE } = this;
    var ele = FIRST_ELEMENT_SELECT;
    if (!ele) {
      ele = MAX_ELEMENT_EFFCTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.previousElementSibling
        ? (ele.previousElementSibling as HTMLElement)
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
  forwordSelection(count: number) {
    if (!count) {
      this.scroll("forword");
      this.onSelectionFunctions.forEach((fn) => fn("forword"));
      return;
    }
    var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
    if (first == last) this.#selection_direction = "forword";
    var element = this.#selection_direction == "forword" ? last : first;
    if (!element) return;
    if (this.#selection_direction == "forword") {
      var nextElementSibling = element.nextElementSibling;
      while (
        nextElementSibling &&
        !this.getEffective(nextElementSibling as HTMLElement)
      )
        nextElementSibling = nextElementSibling.nextElementSibling;
      nextElementSibling &&
        this.setSelect(nextElementSibling as HTMLElement, true);
    } else this.setSelect(element, false);
    this.forwordSelection(count - 1);
  }
  backwordSelection(count: number) {
    if (!count) {
      this.scroll("backword");
      this.onSelectionFunctions.forEach((fn) => fn("backword"));
      return;
    }
    var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
    if (first == last) this.#selection_direction = "backword";
    var element = this.#selection_direction == "forword" ? last : first;
    if (!element) return;
    if (this.#selection_direction == "backword") {
      var previousElementSibling = element.previousElementSibling;
      while (
        previousElementSibling &&
        !this.getEffective(previousElementSibling as HTMLElement)
      )
        previousElementSibling = previousElementSibling.previousElementSibling;
      previousElementSibling &&
        this.setSelect(previousElementSibling as HTMLElement, true);
    } else this.setSelect(element, false);
    this.backwordSelection(count - 1);
  }
  onsubmit(listener: submitListener) {
    typeof listener == "function" && this.onSubmitFunctions.push(listener);
    return this;
  }
  offsubmit(listener: submitListener) {
    var index = this.onSubmitFunctions.indexOf(listener);
    if (index < 0) return false;
    this.onSubmitFunctions.splice(index, 1);
    return true;
  }
  onselection(listener: submitListener) {
    typeof listener == "function" && this.onSelectionFunctions.push(listener);
    return this;
  }
  offselection(listener: submitListener) {
    var index = this.onSelectionFunctions.indexOf(listener);
    if (index < 0) return false;
    this.onSelectionFunctions.splice(index, 1);
    return true;
  }
  submit(type: submitTypePress = "call", element = this.ELEMENT_DIRECTION) {
    if (!this.SELECTD_ELEMENTS.length || this.rowname === "treeitem") return;
    this.onSubmitFunctions.forEach((fn) => fn(type, element!));
  }
  scroll(flag: direction = "forword") {
    var { ELEMENT_DIRECTION: element } = this;
    if (element && this.configurations.scrolling && !isLooked(element))
      scrollToElement(element, flag == "forword" ? -1 : 0);
  }
  go(dir: direction = "forword", count: number = 1) {
    this[dir](count);
  }
  selection(dir: direction = "forword", count: number = 1) {
    this[`${dir}Selection`](count);
  }
  flipshortcut(to: "top-bottom" | "left-right") {
    var { selection, move } = this.shortcuts;
    var forword = to == "top-bottom" ? "ArrowDown" : "ArrowRight";
    var backword = to == "top-bottom" ? "ArrowUp" : "ArrowLeft";
    selection.forword.change(
      `Shift${KeyboardShortcut.separatorShortcuts}${forword}`
    );
    selection.backword.change(
      `Shift${KeyboardShortcut.separatorShortcuts}${backword}`
    );
    move.forword.change(forword);
    move.backword.change(backword);
    this.shortcuts.inner?.open.change(
      to == "left-right" ? "ArrowDown" : "ArrowRight"
    );
    this.shortcuts.inner?.close.change(
      to == "left-right" ? "ArrowUp" : "ArrowLeft"
    );
  }
  settargetsshortcuts(targets: HTMLElement[] | null = null) {
    this.shortcuts.move.forword.targets = targets;
    this.shortcuts.move.backword.targets = targets;
    this.shortcuts.selection.forword.targets = targets;
    this.shortcuts.selection.backword.targets = targets;
    this.shortcuts.selection.all.targets = targets;
    this.shortcuts.status.submit.targets = targets;
    this.shortcuts.status.cancel.targets = targets;
  }
  static get all() {
    return this.#all;
  }
}
