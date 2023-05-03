import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { direction, shortcutConfigurationsList, configListBox, submitListener, submitTypePress } from './types.js';
import { isLooked as like, scrollToElement as ste } from './utils.js';
export class ListBox {
  // title of listbox is unique
  // direction of listbox (forword|backword)
  private selection_direction: direction = 'forword';
  // this is for get the not effective elements when update to unvisible elements
  private effective_hist_elements: HTMLElement[] = [];
  // array represnt all listbox declared before
  static #all: ListBox[] = [];
  // shortcut of on listbox
  public shortcuts: shortcutConfigurationsList;
  // the name of row iterable
  public rowname: string = '';
  // configurations of the list box such as movable, scrolling, selection, redirect, clipboard
  public configurations: configListBox = {
    movable: true,
    scrolling: true,
    selection: true,
    redirect: true,
    clipboard: true,
  };
  // on submit functions
  protected onfunctionsubmit: submitListener[] = [];
  // on selection functions
  protected onfunctionsselection: Function[] = [];
  // when select one item this function will be call
  private pointer_down_function = (e: MouseEvent): void => {
    var effective = this.EFFECTIVE_ELEMENTS;
    var mainsElements = effective.filter(element => element.contains(e.target as HTMLElement));
    if (!mainsElements.length) this.select();
    var mainElement = mainsElements[0];
    for (let i = 1; i < mainsElements.length; i++) mainElement = mainsElements[i].contains(mainElement) ? mainElement : mainsElements[i];
    if (e.altKey) this.configurations.selection && this.setSelect(mainElement, !this.getSelect(mainElement));
    else {
      const element = this.ELEMENT_DIRECTION;
      if (e.shiftKey && element && this.configurations.selection) {
        const items = this.ITEMS;
        var start = items.indexOf(mainElement);
        var end = items.indexOf(element);
        if (end <= start) {
          [start, end] = [end, start];
          this.selection_direction = 'backword';
        } else this.selection_direction = 'forword';
        this.select(...items.slice(start, end + 1));
      } else {
        this.select(mainElement);
      }
    }
  };
  // when submit in a item this function is will be call
  private click_function = (e: MouseEvent): void => {
    if (e.altKey || e.shiftKey) return;
    var focusElements = this.ITEMS.filter(ele => ele.contains(e.target as HTMLElement));
    if (!focusElements.length) return;
    var focusElement = focusElements[0];
    for (let i = 1; i < focusElements.length; i++) focusElement = focusElements[i].contains(focusElement) ? focusElement : focusElements[i];
    focusElement && this.submit('click', focusElement);
  };
  // when drag a element this function is gone be call
  private drag_function = (e: DragEvent): void => {
    var { x, y, target } = e;
    var element = document.elementFromPoint(x, y);
    if (!element) return;
    var row = element.closest(`[role="${this.rowname}"]`) as HTMLElement | null;
    if (!row) return;
    row.after(target as HTMLElement);
  };
  constructor(public root: HTMLElement, title: string = `${root.ariaLabel}`) {
    if (ListBox.#all.find(({ title: tlt }) => tlt == title)) throw Error('cannot be used same label in tow difrent listbox.');
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
        fullforword: Sh.create(`${this.title}:selection full forword`, `shift${Sh.separatorShortcuts}pagedown`, [this.root], 'key').ondown(() => {}),
        fullbackword: Sh.create(`${this.title}:selection full backword`, `shift${Sh.separatorShortcuts}pageup`, [this.root], 'key').ondown(() => {}),
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
        submit: Sh.create(`${this.title}:submit`, `enter`, [this.root], 'key').ondown(() => this.submit('keypress', this.ELEMENT_DIRECTION!)),
        cancel: Sh.create(`${this.title}:cancel`, 'escape', [this.root], 'key').ondown(() => {
          this.select();
          this.root;
        }),
      },
      // has value in table & tree constructor
      clipboard: null,
      // has value in tree constructor
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
    return Array.from(this.root.children) as HTMLElement[];
  }
  get EFFECTIVE_ELEMENTS() {
    return this.ITEMS.filter(ele => this.getEffective(ele));
  }
  get SELECTD_ELEMENTS(): HTMLElement[] {
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
  set drag(v: boolean) {
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
  /**
   * true if element is effective and can be selected and false otherways
   * @param element
   * @returns
   */
  getEffective(element: HTMLElement) {
    return element.ariaDisabled !== 'true';
  }
  /**
   * change no effective element to effective element and also (reverse)
   * @param flag if is't true the element is gonna be effective
   * @param element the element for test
   */
  setEffective(element: HTMLElement, flag: boolean) {
    element.ariaDisabled = `${!flag}`;
    if (!flag) element.ariaSelected = 'false';
  }
  /**
   * get element if is selected or no
   * true if is selected
   * @param element the element needed to test for
   */
  getSelect(element: HTMLElement) {
    return this.getEffective(element) && element.ariaSelected == 'true';
  }
  /**
   * make a element as selected element
   * @param flag if is't true then element is gonna be selected
   */
  setSelect(element: HTMLElement, flag: boolean): boolean {
    var b = this.getEffective(element);
    if (!b) return false;
    element.ariaSelected = `${flag}`;
    return true;
  }
  /**
   * control for make a element is (un)visible
   * @param element the element needed to test for
   * @param flag the flag represent the changes if is't true then element is visible otherways is false
   */
  setShow(element: HTMLElement, flag: boolean) {
    element.style.display = flag ? '' : 'none';
    if (!flag) {
      if (this.getEffective(element)) this.effective_hist_elements.push(element);
      this.setEffective(element, false);
    } else {
      var index = this.effective_hist_elements.indexOf(element);
      if (index >= 0) {
        this.effective_hist_elements.splice(index, 1);
        this.setEffective(element, true);
      }
    }
  }
  /**
   * get element if is't unvisble or visible
   * @param element the element needed to test for
   * @returns
   */
  getShow(element: HTMLElement): boolean {
    return element.style.display == '' || this.getEffective(element);
  }
  /**
   * make manys elements as effecetives element and cann be focused
   * @param elements the elements gonna be effecetive
   */
  effective(...elements: HTMLElement[]) {
    this.ITEMS.forEach(ele => this.setEffective(ele, elements.includes(ele)));
  }
  /**
   * make manys elements as selectives element and cann be focused
   * @param elements the elements gonna be selectives
   */
  select(...elements: HTMLElement[]) {
    this.ITEMS.forEach(ele => this.setSelect(ele, elements.includes(ele)));
  }
  /**
   * goto the forword direction that means is down or right in the app direction
   * @param count is represent the number of steps for forwording
   * @returns
   */
  forword(count: number) {
    if (!this.configurations.movable) return;
    var { LAST_ELEMENT_SELECT, MIN_ELEMENT_EFFECTIVE } = this;
    var ele = LAST_ELEMENT_SELECT;
    if (!ele) {
      ele = MIN_ELEMENT_EFFECTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.nextElementSibling ? (ele.nextElementSibling as HTMLElement) : this.configurations.redirect ? MIN_ELEMENT_EFFECTIVE : null;
      ele && this.getEffective(ele) && count--;
    }
    if (ele) {
      this.select(ele);
      if (this.configurations.scrolling && !like(ele)) ste(ele, -1);
    }
    this.onfunctionsselection.forEach(fn => fn('forword'));
  }
  /**
   * like forword but for go back
   */
  backword(count: number) {
    if (!this.configurations.movable) return;
    var { FIRST_ELEMENT_SELECT, MAX_ELEMENT_EFFCTIVE } = this;
    var ele = FIRST_ELEMENT_SELECT;
    if (!ele) {
      ele = MAX_ELEMENT_EFFCTIVE;
      count--;
    }
    while (ele && count) {
      ele = ele.previousElementSibling ? (ele.previousElementSibling as HTMLElement) : this.configurations.redirect ? MAX_ELEMENT_EFFCTIVE : null;
      ele && this.getEffective(ele) && count--;
    }
    if (ele) {
      this.select(ele);
      if (this.configurations.scrolling && !like(ele)) ste(ele, 0);
    }
    this.onfunctionsselection.forEach(fn => fn('backword'));
  }
  forwordSelection(count: number) {
    if (!count) {
      this.scroll('forword');
      this.onfunctionsselection.forEach(fn => fn('forword'));
      return;
    }
    var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
    if (first == last) this.selection_direction = 'forword';
    var element = this.selection_direction == 'forword' ? last : first;
    if (!element) return;
    if (this.selection_direction == 'forword') {
      var nextElementSibling = element.nextElementSibling;
      while (nextElementSibling && !this.getEffective(nextElementSibling as HTMLElement)) nextElementSibling = nextElementSibling.nextElementSibling;
      nextElementSibling && this.setSelect(nextElementSibling as HTMLElement, true);
    } else this.setSelect(element, false);
    this.forwordSelection(count - 1);
  }
  backwordSelection(count: number) {
    if (!count) {
      this.scroll('backword');
      this.onfunctionsselection.forEach(fn => fn('backword'));
      return;
    }
    var { FIRST_ELEMENT_SELECT: first, LAST_ELEMENT_SELECT: last } = this;
    if (first == last) this.selection_direction = 'backword';
    var element = this.selection_direction == 'forword' ? last : first;
    if (!element) return;
    if (this.selection_direction == 'backword') {
      var previousElementSibling = element.previousElementSibling;
      while (previousElementSibling && !this.getEffective(previousElementSibling as HTMLElement)) previousElementSibling = previousElementSibling.previousElementSibling;
      previousElementSibling && this.setSelect(previousElementSibling as HTMLElement, true);
    } else this.setSelect(element, false);
    this.backwordSelection(count - 1);
  }
  onsubmit(listener: submitListener) {
    typeof listener == 'function' && this.onfunctionsubmit.push(listener);
    return this;
  }
  offsubmit(listener: submitListener) {
    var index = this.onfunctionsubmit.indexOf(listener);
    if (index < 0) return false;
    this.onfunctionsubmit.splice(index, 1);
    return true;
  }
  onselection(listener: submitListener) {
    typeof listener == 'function' && this.onfunctionsselection.push(listener);
    return this;
  }
  offselection(listener: submitListener) {
    var index = this.onfunctionsselection.indexOf(listener);
    if (index < 0) return false;
    this.onfunctionsselection.splice(index, 1);
    return true;
  }
  submit(type: submitTypePress = 'call', element = this.ELEMENT_DIRECTION) {
    if (!this.SELECTD_ELEMENTS.length || this.rowname === 'treeitem') return;
    this.onfunctionsubmit.forEach(fn => fn(type, element!));
  }
  scroll(flag: direction = 'forword') {
    var { ELEMENT_DIRECTION: element } = this;
    if (element && this.configurations.scrolling && !like(element)) ste(element, flag == 'forword' ? -1 : 0);
  }
  go(dir: direction = 'forword', count: number = 1) {
    this[dir](count);
  }
  selection(dir: direction = 'forword', count: number = 1) {
    this[`${dir}Selection`](count);
  }
  flipShortcut(to: 'top-bottom' | 'left-right') {
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
  setTargetShortcut(targets: HTMLElement[] | null = null) {
    this.shortcuts.move.forword.targets = targets;
    this.shortcuts.move.backword.targets = targets;
    this.shortcuts.selection.forword.targets = targets;
    this.shortcuts.selection.backword.targets = targets;
    this.shortcuts.selection.all.targets = targets;
    this.shortcuts.status.submit.targets = targets;
    this.shortcuts.status.cancel.targets = targets;
  }
  public static get all() {
    return [...this.#all];
  }
  static title(title: string) {
    var list = this.#all.find(({ title: t }) => t == title);
    return list || null;
  }
}
