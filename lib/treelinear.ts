import { Delay } from './delay.js';
import { Iterations } from './iterations.js';
import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { callBackQuery, row, subtreePropertys, convertionDataTree, tree, orderBy, methodesTreeMap, submitTypePress, timer } from './types.js';
import { createElement, forEachAsync } from './utils.js';
export class TreeLinear<T> extends Iterations<T> {
  // the main element has childs only
  #mainTreeElement = createElement('span', '', {
    'aria-level': -1,
    'aria-disabled': 'true',
  });
  // the callback when need to get query
  #callbackQuery: callBackQuery<T & row> = i => `${i}`;
  // separator between querys
  public separator = '/';
  // what the subtree element has
  #treePropertys: subtreePropertys<T>[] = [];
  closeIconElement: HTMLElement = createElement('i', 'open', {});
  openIconElement: HTMLElement = createElement('i', 'close', {});
  constructor(root: HTMLElement, title: string, propertys: (keyof T)[], defaultValues: T) {
    super(root, title, propertys, defaultValues);
    this.root.setAttribute('role', 'treelinear');
    this.rowname = 'treeitem';
    this.root.prepend(this.#mainTreeElement);
    this.shortcuts.inner = {
      open: Sh.create(`${this.title}:open`, 'arrowright', [this.root], 'key').ondown(() => {
        var selectedElement = this.SELECTD_ELEMENTS;
        selectedElement.forEach(element => {
          if (this.#isClosed(element)) this.#open(element);
          else {
            var firstElement = this.firstChildOf(element);
            if (firstElement) {
              this.setSelect(element, false);
              this.setSelect(firstElement, true);
            }
          }
        });
      }),
      close: Sh.create(`${this.title}:close`, 'arrowleft', [this.root], 'key').ondown(() => {
        var selectedElement = this.SELECTD_ELEMENTS;
        selectedElement.forEach(element => {
          if (this.#isClosed(element)) {
            var outer = this.#outer(element);
            if (outer && outer != this.#mainTreeElement) {
              this.setSelect(element, false);
              this.setSelect(outer, true);
            }
          } else this.#close(element);
        });
      }),
    };
  }
  override get ITEMS() {
    return super.ITEMS;
  }
  getLevel(element: HTMLElement): number {
    return Number(element.ariaLevel);
  }
  #isLine(element: HTMLElement) {
    return element.getAttribute('role') == 'line';
  }
  #inner(element: HTMLElement) {
    var initLvl = this.getLevel(element);
    var { nextElementSibling } = element;
    var result: HTMLElement[] = [];
    while (nextElementSibling && initLvl < this.getLevel(nextElementSibling as HTMLElement)) {
      var ele = nextElementSibling as HTMLElement;
      if (!this.#isLine(ele) && this.getLevel(ele) == initLvl + 1) result.push(ele);
      nextElementSibling = nextElementSibling.nextElementSibling;
    }
    return result;
  }
  #outer(element: HTMLElement) {
    var initLvl = this.getLevel(element);
    var { previousElementSibling } = element;
    while (previousElementSibling && initLvl <= this.getLevel(previousElementSibling as HTMLElement)) previousElementSibling = previousElementSibling.previousElementSibling;
    return previousElementSibling as HTMLElement | null;
  }
  #toQuery(element: HTMLElement): string {
    if (element === this.#mainTreeElement) return '';
    var outer = this.#outer(element);
    var data = this.readRow(element);
    if (!outer) return `${this.#callbackQuery(data, 0)}`;
    else {
      var index = this.#inner(outer).indexOf(element);
      return `${this.#toQuery(outer)}${this.separator}${this.#callbackQuery(data, index)}`;
    }
  }
  #toElement(query: string): HTMLElement | null {
    var result = this.#mainTreeElement as HTMLElement | null;
    var spliting = query
      .split(this.separator)
      .map(content => content.trim())
      .filter(s => s !== '');
    for (let i = 0; i < spliting.length; i++) {
      if (!result) return null;
      var fd = this.#inner(result).find((element, index) => {
        var data = this.readRow(element);
        return this.#callbackQuery(data, index) == spliting[i];
      });
      result = fd ? fd : null;
    }
    return result;
  }
  #getLevelElement(element: HTMLElement): HTMLElement {
    return element.querySelector(`[role="level"]`)!;
  }
  #getIconElement(element: HTMLElement): HTMLElement | null {
    return element.querySelector(`[role="level"] > [role="icon"]`);
  }
  #isOpend(element: HTMLElement) {
    if (element == this.#mainTreeElement) return true;
    if (!this.isTree(element)) return false;
    return element.ariaHidden === 'false';
  }
  #isClosed(element: HTMLElement) {
    if (element == this.#mainTreeElement) return false;
    if (!this.isTree(element)) return true;
    return element.ariaHidden === 'true';
  }
  #open(element: HTMLElement) {
    element.ariaHidden = 'false';
    var showMoreIcon = this.#getIconElement(element);
    if (showMoreIcon) {
      showMoreIcon.innerHTML = ``;
      showMoreIcon.appendChild(this.openIconElement.cloneNode(true));
      this.#inner(element).forEach(ele => {
        this.setShow(ele, true);
        if (ele.ariaAutoComplete == 'true') {
          ele.ariaAutoComplete = 'false';
          this.#open(ele);
        }
      });
    }
  }
  #close(element: HTMLElement) {
    element.ariaHidden = 'true';
    var showMoreIcon = this.#getIconElement(element);
    if (showMoreIcon) {
      showMoreIcon.innerHTML = '';
      showMoreIcon.appendChild(this.closeIconElement.cloneNode(true));
      this.#inner(element).forEach(ele => {
        this.setShow(ele, false);
        if (this.#isOpend(ele)) {
          ele.ariaAutoComplete = 'true';
          this.#close(ele);
        } else ele.ariaAutoComplete = 'false';
      });
    }
  }
  #toggle(element: HTMLElement) {
    this.#isClosed(element) ? this.#open(element) : this.#close(element);
  }
  override line(element: HTMLElement | string = '') {
    element = this.convertTo(element, 'element');
    var ele = createElement('div', '', { role: 'line' });
    this.#inner(element);
    this.root.appendChild(ele);
  }
  inner(element: HTMLElement | string) {
    element = this.convertTo(element, 'element');
    return element ? this.#inner(element) : [];
  }
  outer(element: HTMLElement | string) {
    element = this.convertTo(element, 'element');
    return element ? this.#outer(element) : null;
  }
  convertTo<R extends keyof convertionDataTree>(any: HTMLElement | string, to: R): convertionDataTree[R] {
    return (to == 'element' ? (typeof any == 'string' ? this.#toElement(any) : any) : typeof any == 'string' ? any : this.#toQuery(any)) as convertionDataTree[R];
  }
  childsOf(any: HTMLElement | string) {
    any = this.convertTo(any, 'element');
    var inner = this.#inner(any);
    var result: HTMLElement[] = [];
    inner.forEach(itemElement => result.push(itemElement, ...this.childsOf(itemElement)));
    return result;
  }
  lastChildOf(any: HTMLElement | string) {
    any = this.convertTo(any, 'element');
    var inner = this.#inner(any);
    var result = inner.at(-1);
    if (!result) return null;
    inner = this.#inner(result);
    while (inner.length) {
      result = inner.at(-1)!;
      inner = this.#inner(result);
    }
    return result;
  }
  firstChildOf(any: string | HTMLElement) {
    any = this.convertTo(any, 'element');
    var inner = this.#inner(any);
    return inner.length ? inner[0] : null;
  }
  isTree(element: HTMLElement) {
    if (this.#mainTreeElement == element) return true;
    var columns = this.items(element);
    return this.#treePropertys.every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML.trim() === `${value}`.trim());
  }
  override createRow(input: T, lvl: number = 0, closed: boolean = false, visible: boolean = true): HTMLElement {
    var result = super.createRow(input);
    result.ariaLevel = `${lvl}`;
    result.ariaHidden = `${closed}`;
    this.setShow(result, visible);
    if (this.isTree(result)) {
      result.ariaExpanded = 'true';
      var showMoreIcon = createElement('span', ``, {
        role: 'icon',
      });
      showMoreIcon.appendChild((closed ? this.closeIconElement : this.openIconElement).cloneNode(true));
      showMoreIcon.onclick = () => this.#toggle(result);
      result.querySelector('[role="level"]')?.prepend(showMoreIcon);
    } else result.ariaExpanded = 'false';
    return result;
  }
  read(element: HTMLElement = this.#mainTreeElement): tree<T & row> {
    var body = this.readRow(element);
    return {
      body,
      innerTree: this.#inner(element).map(ele => this.read(ele)),
    };
  }
  // setters
  setTreePropertys(...propertys: subtreePropertys<T>[]) {
    this.#treePropertys = propertys;
    this.ITEMS.forEach(element => {
      var isTree = this.isTree(element);
      var iconShowMore = element.querySelector(`[role="level"] > [role="icon"]`);
      element.ariaExpanded = `${isTree}`;
      if (isTree) {
        if (!iconShowMore) {
          var showMoreIcon = createElement('span', '', {
            role: 'icon',
          });
          showMoreIcon.appendChild(this.closeIconElement);
          showMoreIcon.onclick = () => this.#toggle(element);
          element.querySelector('[role="level"]')?.prepend(showMoreIcon);
        }
      } else iconShowMore?.remove();
    });
  }
  override setTargetShortcut(targets: HTMLElement[] | null = null): void {
    super.setTargetShortcut(targets);
    this.shortcuts.inner!.open.targets = targets;
    this.shortcuts.inner!.close.targets = targets;
  }
  protected async append(element: HTMLElement | string, data: T[], timeout: number, limit: number) {
    // the same steps in the methode `appendSync`
    element = this.convertTo(element, 'element');
    if (!this.isTree(element)) throw Error('Cannot Be add in this item');
    var isOpend = this.#isOpend(element);
    var initLevel = this.getLevel(element) + 1;
    element = this.lastChildOf(element) || element;
    data = data.reverse();
    // create delay for make sure the append is not directly append all element
    var dl = new Delay(timeout as number);
    for (let i = 0; i < data.length; i++) {
      if (!(i % limit)) await dl.on();
      element.after(this.createRow(data[i], initLevel, true, isOpend));
    }
  }
  protected async prepend(element: HTMLElement | string, data: T[], timeout: number, limit: number) {
    // the same steps of appendSync method just remove step number 5
    element = this.convertTo(element, 'element');
    if (!this.isTree(element)) throw Error('Cannot Be add in this item');
    var isOpend = this.#isOpend(element);
    var initLevel = this.getLevel(element) + 1;
    data = data.reverse();
    var dl = new Delay(timeout as number);
    for (let i = 0; i < data.length; i++) {
      if (!(i % limit)) dl.on();
      element.after(this.createRow(data[i], initLevel, true, isOpend));
    }
  }
  protected async after(element: HTMLElement, data: T[], timeout: number, limit: number) {
    this.throwLoading();
    var lvl = this.getLevel(element);
    var inner = this.childsOf(element);
    var isClosed = element.style.display == 'none';
    element = inner.at(-1) || element;
    await forEachAsync(data.reverse(), d => element.after(this.createRow(d, lvl, false, isClosed)), timeout, limit);
  }
  protected async before(element: HTMLElement, data: T[], timeout: number, limit: number) {
    var lvl = this.getLevel(element);
    var isClosed = element.style.display == 'none';
    await forEachAsync(data, d => element.before(this.createRow(d, lvl, true, isClosed)), timeout, limit);
  }
  protected async delete(element: HTMLElement, timeout: number, limit: number) {
    await forEachAsync(this.#inner(element), async ele => await this.delete(ele, timeout, limit), timeout, limit);
    element.remove();
  }
  protected async insert(element: HTMLElement, tree: tree<T>[], timeout: timer<tree<T>>, limit: number): Promise<(T & row)[]> {
    var result: (T & row)[] = [];
    var level = this.getLevel(element) + 1;
    var isOpend = this.#isOpend(element);
    await forEachAsync(
      tree,
      async ({ body, innerTree }) => {
        var ele = this.createRow(body, level, true, isOpend);
        result.push(this.readRow(ele));
        var mainElement = this.lastChildOf(element) || element;
        mainElement.after(ele);
        Array.isArray(innerTree) && innerTree.length && result.push(...(await this.insert(ele, innerTree, timeout, limit)));
      },
      timeout,
      limit,
    );
    return result;
  }
  protected appendSync(element: HTMLElement | string, data: T[]) {
    // convert element (element|query) to HTMLElement
    element = this.convertTo(element, 'element');
    // throw error if the element gona append as not subtree element
    if (!this.isTree(element)) throw Error('Cannot Be add in this item');
    // isOpend true if the element is opend and thes inner items is visible else false
    var isOpend = this.#isOpend(element);
    // the initial level of element expl: element level => 10 the new items element level => 11
    var initLevel = this.getLevel(element) + 1;
    // test if this element has a last element child reccur or not => if has the element gona change
    element = this.lastChildOf(element) || element;
    // reverse data for when append to element the order stay fix
    data = data.reverse();
    // creation of items
    for (let i = 0; i < data.length; i++) {
      // set the row element if as visible and effective or not
      element.after(this.createRow(data[i], initLevel, true, isOpend));
    }
  }
  protected prependSync(element: HTMLElement | string, data: T[]) {
    // the same steps of appendSync method just remove step number 5
    element = this.convertTo(element, 'element');
    if (!this.isTree(element)) throw Error('Cannot Be add in this item');
    var isOpend = this.#isOpend(element);
    var initLevel = this.getLevel(element) + 1;
    data = data.reverse();
    for (let i = 0; i < data.length; i++) element.after(this.createRow(data[i], initLevel, true, isOpend));
  }
  protected afterSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    var lvl = this.getLevel(element);
    var inner = this.#inner(element);
    var isClosed = element.style.display == 'none';
    while (inner.length) {
      element = inner.at(-1)!;
      inner = this.#inner(element);
    }
    data.reverse().forEach(d => element.after(this.createRow(d, lvl, false, !isClosed)));
  }
  protected beforeSync(element: HTMLElement, data: T[]) {
    var lvl = this.getLevel(element);
    var isClosed = element.style.display == 'none';
    data.forEach(d => element.before(this.createRow(d, lvl, true, isClosed)));
  }
  protected deleteSync(element: HTMLElement) {
    this.#inner(element).forEach(ele => this.deleteSync(ele));
    element.remove();
  }
  protected insertSync(element: HTMLElement, tree: tree<T>[]) {
    var level = this.getLevel(element) + 1;
    var isOpend = this.#isOpend(element);
    tree.forEach(({ body, innerTree }) => {
      var ele = this.createRow(body, level, true, isOpend);
      var mainElement = this.lastChildOf(element) || element;
      mainElement.after(ele);
      Array.isArray(innerTree) && innerTree.length && this.insertSync(ele, innerTree);
    });
  }
  protected sortSync(element: HTMLElement = this.#mainTreeElement, sortBy: keyof T, orderby: orderBy, deep: boolean = true) {
    var Tr = this.read(element).innerTree;
    function childs(tree: tree<T & row>): (T & row)[] {
      var result: (T & row)[] = [tree.body];
      tree.innerTree.forEach(tr => result.push(tr.body, ...childs(tr)));
      return result;
    }
    var sort = (tree: tree<T & row>[] = Tr) => {
      var sortedData = tree.sort((a, b) => (a.body[sortBy] < b.body[sortBy] ? 1 : -1));
      if (orderby == 'DESC') sortedData = sortedData.reverse();
      sortedData.forEach(tree => {
        var ch = childs(tree).map(({ row }) => row);
        element.after(...ch);
      });
      console.log('-'.repeat(30));
      if (deep) {
        tree
          .filter(({ body: { row } }) => this.isTree(row))
          .forEach(({ innerTree }) => {
            Array.isArray(innerTree) && innerTree.length && sort(innerTree);
          });
      }
    };
    sort();
  }
  protected async sort(element: HTMLElement, sortBy: keyof T, orderby: orderBy, deep: boolean = true, timeout: number, limit: number) {
    var Tr = this.read(element).innerTree;
    function childs(tree: tree<T & row>): (T & row)[] {
      var result: (T & row)[] = [tree.body];
      tree.innerTree.forEach(tr => result.push(tr.body, ...childs(tr)));
      return result;
    }
    var sort = async (tree: tree<T & row>[] = Tr) => {
      var sortedData = tree.sort((a, b) => (a.body[sortBy] < b.body[sortBy] ? 1 : -1));
      if (orderby == 'DESC') sortedData = sortedData.reverse();
      await forEachAsync(
        sortedData,
        async tree => {
          var ch = childs(tree).map(({ row }) => row);
          await forEachAsync(
            ch.reverse(),
            ele => {
              element.after(ele);
            },
            timeout,
            limit,
          );
        },
        timeout,
        limit,
      );
      if (deep) {
        await forEachAsync(
          tree.filter(({ body: { row } }) => this.isTree(row)),
          ({ innerTree }) => {
            Array.isArray(innerTree) && innerTree.length && sort(innerTree);
          },
          timeout,
          limit,
        );
      }
    };
    await sort();
  }
  async methode<R extends keyof methodesTreeMap<T>>(methode: R, element: HTMLElement | string, input: methodesTreeMap<T>[R], timeout: number, limit: number) {
    this.throwLoading();
    this.isloading = true;
    element = this.convertTo(element, 'element');
    switch (methode) {
      case 'before': {
      }
      case 'append': {
      }
      case 'prepend': {
      }
      case 'after': {
        await this[methode as 'after' | 'before' | 'append'](element, input as methodesTreeMap<T>['after'], timeout, limit);
        break;
      }
      case 'insert': {
        await this.insert(element, input as methodesTreeMap<T>['insert'], timeout as timer<tree<T>>, limit);
        break;
      }
      case 'delete': {
        await this.delete(element, timeout, limit);
        break;
      }
      case 'sort': {
        var { by, orderby, deep } = input as methodesTreeMap<T>['sort'];
        await this.sort(element, by, orderby, deep, timeout, limit);
      }
    }
    this.isloading = false;
  }
  methodeSync<R extends keyof methodesTreeMap<T>>(methode: R, element: HTMLElement | string, input: methodesTreeMap<T>[R]) {
    this.throwLoading();
    element = this.convertTo(element, 'element');
    switch (methode) {
      case 'before': {
      }
      case 'append': {
      }
      case 'prepend': {
      }
      case 'after': {
        this[`${methode as 'after' | 'before' | 'append'}Sync`](element, input as methodesTreeMap<T>['after']);
        break;
      }
      case 'insert': {
        this.insertSync(element, input as methodesTreeMap<T>['insert']);
        break;
      }
      case 'delete': {
        this.deleteSync(element);
        break;
      }
      case 'sort': {
        var { by, orderby, deep } = input as methodesTreeMap<T>['sort'];
        this.sortSync(element, by, orderby, deep);
      }
    }
  }
  setCallbackQuery(callback: callBackQuery<T>) {
    this.#callbackQuery = callback;
  }
  isOpend(element: HTMLElement | string) {
    element = this.convertTo(element, 'element');
    return this.#isOpend(element);
  }
  isClosed(element: HTMLElement | string) {
    element = this.convertTo(element, 'element');
    return this.#isClosed(element);
  }
  open(element: HTMLElement | string = this.#mainTreeElement) {
    element = this.convertTo(element, 'element');
    if (this.isTree(element)) throw Error('Cannot Be open element not subtree element');
    else this.#open(element);
  }
  close(element: HTMLElement | string = this.#mainTreeElement) {
    element = this.convertTo(element, 'element');
    if (this.isTree(element)) throw Error('Cannot Be open element not subtree element');
    else this.#close(element);
  }
  toggle(element: HTMLElement | string = this.#mainTreeElement) {
    element = this.convertTo(element, 'element');
    if (this.isTree(element)) throw Error('Cannot Be open element not subtree element');
    else this.#close(element);
  }
  override submit(type: submitTypePress = 'call', element = this.ELEMENT_DIRECTION) {
    if (!this.SELECTD_ELEMENTS.length || this.isTree(element!)) return;
    this.onSubmitFunctions.forEach(fn => fn(type, element!));
  }
  jsonTree(element: HTMLElement): tree<T> {
    return {
      body: super.json(element),
      innerTree: this.isTree(element) ? this.#inner(element).map(ele => this.jsonTree(ele)) : [],
    };
  }
  override async copy() {
    var selectedElement = this.SELECTD_ELEMENTS;
    await navigator.clipboard.writeText(
      JSON.stringify(
        selectedElement.map(ele => this.jsonTree(ele)),
        undefined,
        1,
      ),
    );
  }
  override async cut(timeout: number = 20, limit: number = 1) {
    var selectedElement = this.SELECTD_ELEMENTS;
    await navigator.clipboard.writeText(
      JSON.stringify(
        selectedElement.map(ele => this.jsonTree(ele)),
        undefined,
        1,
      ),
    );
    selectedElement.forEach(element => this.delete(element, timeout, limit));
  }
  override async paste(timeout: number = 5, limit: number = 1): Promise<(T & row)[]> {
    this.throwLoading();
    this.isloading = true;
    var result: (T & row)[] = [];
    var data = JSON.parse(await navigator.clipboard.readText()) as tree<T>[];
    if (!Array.isArray(data)) throw Error('paste ignore');
    var selected = this.SELECTD_ELEMENTS.filter(ele => this.isTree(ele));
    var div = selected.length / data.length;
    if (div >= 1 && div == parseInt(`${div}`)) await forEachAsync(selected, async (element, index) => result.push(...(await this.insert(element, data.slice(index * div, (index + 1) * div), timeout as number, limit))), timeout, limit);
    else if (selected.length) await forEachAsync(selected, async element => result.push(...(await this.insert(element, data, timeout as number, limit))), timeout, limit);
    else result.push(...(await this.insert(this.#mainTreeElement, data, timeout as number, limit)));
    this.isloading = false;
    return result;
  }
  static override create<T>(title: string, defaultValue: T): TreeLinear<T> {
    var tree = super.create(title, defaultValue);
    return tree as TreeLinear<T>;
  }
}
