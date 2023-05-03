import { Iterations } from './iterations.js';
import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { subtreePropertys, callBackQuery, row, convertionDataTree, submitTypePress, tree, methodesTreeMap, orderBy, timer } from './types.js';
import { createElement, forEachAsync } from './utils.js';
export class Tree<T> extends Iterations<T> {
  #treepropertys: subtreePropertys<T>[] = [];
  onOpenFunctions: Function[] = [];
  onCloseFunctions: Function[] = [];
  #callbackQuery: callBackQuery<T & row> = (d, i) => `${i}`;
  #mainTreeElement: HTMLElement;
  public separator = '/';
  constructor(root: HTMLElement, title: string, propertys: (keyof T)[], defaultValues: T) {
    super(root, title, propertys, defaultValues);
    this.root.setAttribute('role', 'tree');
    this.rowname = 'treegrid';
    this.#mainTreeElement = this.createRow(this.defaultValues);
    this.#getContentElement(this.#mainTreeElement).innerHTML = '';
    this.#getItemElement(this.#mainTreeElement).style.display = 'none';
    this.root.prepend(this.#mainTreeElement);
    if (this.shortcuts.find) {
      this.shortcuts.find.forword.clear('down');
      this.shortcuts.find.forword.ondown(({ keys }) => {
        if (!keys) return;
        var { EFFECTIVE_ELEMENTS: effeEle, MIN_ELEMENT_EFFECTIVE: minEff, ELEMENT_DIRECTION: eleDir } = this;
        var findFrom = eleDir || minEff;
        if (!findFrom) return;
        var index = effeEle.indexOf(findFrom);
        var get = effeEle.slice(index + 1).find(ele => {
          var content = `${this.readRow(ele)[this.searcherKey]}`.charAt(0).toUpperCase();
          return keys.includes(content);
        });
        if (get) this.select(get);
      });
      this.shortcuts.find.backword.clear('down');
      this.shortcuts.find.backword.ondown(({ keys }) => {
        if (!keys) return;
        var { EFFECTIVE_ELEMENTS: effeEle, MIN_ELEMENT_EFFECTIVE: minEff, ELEMENT_DIRECTION: eleDir } = this;
        var findFrom = eleDir || minEff;
        effeEle = effeEle.reverse();
        if (!findFrom) return;
        var index = effeEle.indexOf(findFrom);
        var get = effeEle.slice(index + 1).find(ele => {
          var content = `${this.readRow(ele)[this.searcherKey]}`.charAt(0).toUpperCase();
          return keys.includes(content);
        });
        if (get) this.select(get);
      });
    }
    this.shortcuts.inner = {
      open: Sh.create(`${this.title}:open`, 'arrowright', [this.root], 'key').ondown(() => {
        this.SELECTD_ELEMENTS.forEach(ele => {
          if (this.isOpend(ele)) {
            var inner = this.#inner(ele);
            if (inner.length) {
              this.setSelect(inner[0], true);
              this.setSelect(ele, false);
            }
          } else this.open(ele);
        });
      }),
      close: Sh.create(`${this.title}:close`, 'arrowleft', [this.root], 'key').ondown(() => {
        this.SELECTD_ELEMENTS.forEach(ele => {
          if (this.isOpend(ele)) this.close(ele);
          else {
            var outerElement = this.#outer(ele);
            if (outerElement && outerElement != this.#mainTreeElement) {
              this.setSelect(ele, false);
              this.setSelect(outerElement, true);
            }
          }
        });
      }),
    };
    this.shortcuts.status.submit.ondown(() => {
      this.SELECTD_ELEMENTS.forEach(ele => this.isTree(ele) && this.open(ele));
    });
  }
  override get ITEMS() {
    var fn = (element: HTMLElement) => {
      var inner = this.#inner(element);
      var result: HTMLElement[] = [];
      inner.map(ele => {
        result.push(ele, ...fn(ele));
      });
      return result;
    };
    return fn(this.#mainTreeElement);
  }
  #getItemElement(element: HTMLElement) {
    return Array.from(element.children).find(ele => ele.getAttribute('role') == 'treeitem')! as HTMLElement;
  }
  #getContentElement(element: HTMLElement) {
    return Array.from(this.#getItemElement(element).children).find(ele => ele.getAttribute('role') == 'content')! as HTMLElement;
  }
  #getInnerTreeElement(element: HTMLElement): HTMLElement | null {
    return Array.from(element.children).find(ele => ele.getAttribute('role') == 'tree') as HTMLElement | null;
  }
  #getOuterTreeElement(element: HTMLElement) {
    var result = element.closest(`[role="tree"]`);
    return result && this.root.contains(result) ? result : null;
  }
  #inner(element: HTMLElement) {
    var innerTree = this.#getInnerTreeElement(element);
    return innerTree ? (Array.from(innerTree.children) as HTMLElement[]) : [];
  }
  #outer(element: HTMLElement) {
    var result = (element.parentElement as HTMLElement).closest(`[role="${this.rowname}"]`);
    return result && this.root.contains(result) ? (result as HTMLElement) : null;
  }
  #toElement(query: string) {
    var spliting = query
      .split(this.separator)
      .map(s => s.trim())
      .filter(s => s !== '');
    var result = this.#mainTreeElement as HTMLElement | null;
    for (let i = 0; i < spliting.length; i++) {
      if (!result) return null;
      var inner = this.#inner(result);
      var fdElement = inner.find((e, index) => this.#callbackQuery(this.readRow(e), index) == spliting[i]);
      result = fdElement || null;
    }
    return result;
  }
  #toQuery(element: HTMLElement): string {
    if (element == this.#mainTreeElement) return '';
    var string = this.#callbackQuery(this.readRow(element), 0);
    var outer = this.#outer(element);
    while (outer && outer !== this.#mainTreeElement) {
      string = `${this.#callbackQuery(this.readRow(outer), 0)}${this.separator}${string}`;
      outer = this.#outer(element);
    }
    return string;
  }
  convertTo<R extends keyof convertionDataTree>(any: HTMLElement | string, to: R): convertionDataTree[R] {
    return (to == 'element' ? (typeof any == 'string' ? this.#toElement(any) : any) : typeof any == 'string' ? any : this.#toQuery(any)) as convertionDataTree[R];
  }
  override forword(count: number) {
    if (!count) {
      this.configurations.scrolling && this.scroll('forword');
      return;
    }
    var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir, MIN_ELEMENT_EFFECTIVE: minEff } = this;
    var index = effEle.indexOf(eleDir!);
    var ele = effEle[index + 1] || minEff;
    if (ele) this.select(ele);
    else if (minEff && this.configurations.redirect) this.select(minEff);
    else return;
    this.forword(count - 1);
  }
  override backword(count: number) {
    if (!count) {
      this.configurations.scrolling && this.scroll('backword');
      return;
    }
    var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir, MAX_ELEMENT_EFFCTIVE: maxEff } = this;
    var index = effEle.reverse().indexOf(eleDir!);
    var ele = effEle[index + 1] || maxEff;
    if (ele) this.select(ele);
    else if (maxEff && this.configurations.redirect) this.select(maxEff);
    else return;
    this.backword(count - 1);
  }
  override forwordSelection(count: number) {
    var { EFFECTIVE_ELEMENTS: effEle, ELEMENT_DIRECTION: eleDir } = this;
    var index = effEle.indexOf(eleDir!);
    this.select(...effEle.slice(index, index + count));
    this.configurations.scrolling && this.scroll('forword');
  }
  override createRow(input: T): HTMLElement {
    var treeitem = super.createRow(input);
    treeitem.setAttribute('role', 'treeitem');
    var result = createElement('div', '', { role: this.rowname });
    result.appendChild(treeitem);
    if (this.isTree(result)) {
      var subtree = createElement('div', '', { role: 'tree' });
      result.appendChild(subtree);
    }
    return result;
  }
  override readRow(element: HTMLElement): T & row {
    var o = super.readRow(this.#getItemElement(element));
    o.row = element;
    return o;
  }
  override submit(type: submitTypePress, element: HTMLElement) {
    if (this.isTree(element)) return;
    super.submit(type, element);
  }
  isTree(element: HTMLElement) {
    if (this.#mainTreeElement == element) return true;
    var columns = this.items(this.#getItemElement(element));
    return this.#treepropertys.every(({ property, value }) => columns[this.propertys.indexOf(property)].innerHTML == value);
  }
  setTreePropertys(...propertys: subtreePropertys<T>[]) {
    this.#treepropertys = propertys;
    this.ITEMS.forEach(element => {
      if (this.isTree(element)) {
        if (!this.#getInnerTreeElement(element)) {
          var subtree = createElement('div', '', { role: 'tree' });
          element.appendChild(subtree);
        }
      } else {
        this.#getInnerTreeElement(element)?.remove();
      }
    });
  }
  setCallbackQuery(callback: callBackQuery<T>) {
    this.#callbackQuery = callback;
  }
  protected appendSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    if (!this.isTree(element)) return;
    var subtreeElement = this.#getInnerTreeElement(element)!;
    subtreeElement.append(...data.map(input => this.createRow(input)));
  }
  protected prependSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    if (!this.isTree(element)) return;
    var subtreeElement = this.#getInnerTreeElement(element)!;
    subtreeElement.prepend(...data.map(input => this.createRow(input)));
  }
  protected beforeSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    element.before(...data.map(input => this.createRow(input)));
  }
  protected afterSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    element.after(...data.reverse().map(input => this.createRow(input)));
  }
  protected insertSync(element: HTMLElement, data: tree<T>[]) {
    this.throwLoading();
    if (!this.isTree(element)) return;
    var subtreeElement = this.#getInnerTreeElement(element)!;
    data.forEach(({ body, innerTree }) => {
      var row = this.createRow(body);
      subtreeElement.appendChild(row);
      Array.isArray(innerTree) && innerTree.length && this.insertSync(row, innerTree);
    });
  }
  protected sortSync(element: HTMLElement, by: keyof T, orderby: orderBy, deep: boolean = true) {
    var innersElement = this.#inner(element);
    var readyinners = innersElement.sort((a, b) => (this.readRow(a)[by] <= this.readRow(b)[by] ? -1 : 1));
    if (orderby == 'DESC') readyinners.reverse();
    var innerMainElement = this.#getInnerTreeElement(element);
    if (innerMainElement) readyinners.forEach(ele => innerMainElement!.appendChild(ele));
    if (deep) innersElement.filter(ele => this.isTree(ele)).forEach(ele => this.sortSync(ele, by, orderby, true));
  }
  methodeSync<R extends keyof methodesTreeMap<T>>(event: R, any: HTMLElement | string, data: methodesTreeMap<T>[R]) {
    any = this.convertTo(any, 'element');
    switch (event) {
      case 'append': {
      }
      case 'prepend': {
      }
      case 'after': {
      }
      case 'before': {
        this[`${event as 'append' | 'prepend' | 'after' | 'before'}Sync`](any, data as T[]);
        break;
      }
      case 'insert': {
        this.insertSync(any, data as tree<T>[]);
        break;
      }
      case 'sort': {
        var { by, orderby, deep } = data as methodesTreeMap<T>['sort'];
        this.sortSync(any, by, orderby, deep);
      }
    }
  }
  protected async append(element: HTMLElement, data: T[], timeout: timer<T>, limit: number) {
    this.throwLoading();
    if (!this.isTree(element)) return;
    this.isloading = true;
    var subtreeElement = this.#getInnerTreeElement(element)!;
    forEachAsync(
      data,
      input => {
        const ele = this.createRow(input);
        subtreeElement.append(ele);
      },
      timeout,
      limit,
    );
    this.isloading = false;
  }
  protected async prepend(element: HTMLElement, data: T[], timeout: timer<T>, limit: number) {
    this.throwLoading();
    if (!this.isTree(element)) return;
    this.isloading = true;
    var subtreeElement = this.#getInnerTreeElement(element)!;
    forEachAsync(
      data.reverse(),
      input => {
        const ele = this.createRow(input);
        subtreeElement.prepend(ele);
      },
      timeout,
      limit,
    );
    this.isloading = false;
  }
  protected async before(element: HTMLElement, data: T[], timeout: timer<T>, limit: number) {
    this.throwLoading();
    this.isloading = true;
    forEachAsync(
      data,
      input => {
        const ele = this.createRow(input);
        element.before(ele);
      },
      timeout,
      limit,
    );
    this.isloading = false;
  }
  protected async after(element: HTMLElement, data: T[], timeout: timer<T>, limit: number) {
    this.throwLoading();
    this.isloading = true;
    forEachAsync(
      data.reverse(),
      input => {
        const ele = this.createRow(input);
        element.after(ele);
      },
      timeout,
      limit,
    );
    this.isloading = false;
  }
  protected async insert(element: HTMLElement, data: tree<T>[], timeout: number | ((value: tree<T>, index: number) => number), limit: number) {
    this.throwLoading();
    if (!this.isTree(element)) return;
    this.isloading = true;
    var subtreeElement = this.#getInnerTreeElement(element)!;
    forEachAsync(
      data,
      async ({ body, innerTree }) => {
        var row = this.createRow(body);
        subtreeElement.appendChild(row);
        Array.isArray(innerTree) && innerTree.length && (await this.insert(row, innerTree, timeout, limit));
      },
      timeout,
      limit,
    );
    this.isloading = false;
  }
  protected async sort(element: HTMLElement, by: keyof T, orderby: orderBy, deep: boolean = true, timeout: timer<HTMLElement>, limit: number) {
    var innersElement = this.#inner(element);
    var readyinners = innersElement.sort((a, b) => (this.readRow(a)[by] <= this.readRow(b)[by] ? -1 : 1));
    if (orderby == 'DESC') readyinners.reverse();
    var innerMainElement = this.#getInnerTreeElement(element);
    if (innerMainElement) {
      await forEachAsync(
        readyinners,
        ele => {
          innerMainElement!.appendChild(ele);
        },
        timeout,
        limit,
      );
    }
    if (deep)
      await forEachAsync(
        innersElement.filter(ele => this.isTree(ele)),
        async ele => await this.sort(ele, by, orderby, true, timeout, limit),
        timeout,
        limit,
      );
  }
  async methode<R extends keyof methodesTreeMap<T>>(event: R, any: HTMLElement | string, data: methodesTreeMap<T>[R], timeout: timer<T>, limit: number) {
    any = this.convertTo(any, 'element');
    switch (event) {
      case 'append': {
      }
      case 'prepend': {
      }
      case 'after': {
      }
      case 'before': {
        await this[`${event as 'append' | 'prepend' | 'after' | 'before'}`](any, data as T[], timeout, limit);
        break;
      }
      case 'insert': {
        await this.insert(any, data as tree<T>[], timeout as number | ((value: tree<T>, index: number) => number), limit);
        break;
      }
      case 'sort': {
        var { by, orderby, deep } = data as methodesTreeMap<T>['sort'];
        await this.sort(any, by, orderby, deep, timeout as number | ((value: HTMLElement, index: number) => number), limit);
      }
    }
  }
  get DATA() {
    var fn = (element: HTMLElement): tree<T & row> => {
      var body = this.readRow(element);
      return {
        body,
        innerTree: this.isTree(element) ? this.#inner(element).map(ele => fn(ele)) : [],
      };
    };
    return fn(this.#mainTreeElement);
  }
  onopen(listener: Function) {
    typeof listener == 'function' && this.onOpenFunctions.push(listener);
    return this;
  }
  offopen(listener: Function) {
    const index = this.onOpenFunctions.indexOf(listener);
    if (index < 0) return false;
    this.onOpenFunctions.splice(index, 1);
    return true;
  }
  onclose(listener: Function) {
    typeof listener == 'function' && this.onCloseFunctions.push(listener);
    return this;
  }
  offclose(listener: Function) {
    const index = this.onCloseFunctions.indexOf(listener);
    if (index < 0) return false;
    this.onOpenFunctions.splice(index, 1);
    return true;
  }
  isOpend(element: HTMLElement) {
    var ele = this.#getInnerTreeElement(element);
    if (ele) return ele.style.display !== 'none';
    else return false;
  }
  isClosed(element: HTMLElement) {
    var ele = this.#getInnerTreeElement(element);
    if (ele) return ele.style.display === 'none';
    else return true;
  }
  open(element: HTMLElement) {
    var ele = this.#getInnerTreeElement(element);
    if (ele && this.isClosed(element)) {
      ele.style.display = '';
      this.#inner(element).forEach(e => this.setEffective(e, true));
    }
  }
  close(element: HTMLElement) {
    var ele = this.#getInnerTreeElement(element);
    if (ele && this.isOpend(element)) {
      ele.style.display = 'none';
      this.#inner(element).forEach(e => this.setEffective(e, false));
    }
  }
  toggle(element: HTMLElement) {
    var ele = this.#getInnerTreeElement(element);
    if (ele) {
      let { display } = ele.style;
      this.#inner(element).forEach(e => this.setEffective(e, display !== 'none'));
      ele.style.display = display == 'none' ? '' : 'none';
    }
  }
  jsonTree(element: HTMLElement): tree<T> {
    var body = this.json(this.#getContentElement(element));
    return {
      body,
      innerTree: this.isTree(element) ? this.#inner(element).map(ele => this.jsonTree(ele)) : [],
    };
  }
  override async copy() {
    var array = this.SELECTD_ELEMENTS.map(element => {
      return this.jsonTree(element);
    });
    await navigator.clipboard.writeText(JSON.stringify(array, undefined, 1));
  }
  override async cut() {
    var array = this.SELECTD_ELEMENTS.map(element => {
      var json = this.jsonTree(element);
      element.remove();
      return json;
    });
    await navigator.clipboard.writeText(JSON.stringify(array, undefined, 1));
  }
  override async paste(timeout: timer<HTMLElement>, limit: number): Promise<(T & row)[]> {
    const selectedElement = this.SELECTD_ELEMENTS;
    var array = JSON.parse(await navigator.clipboard.readText()) as tree<T>[];
    var div = array.length / selectedElement.length;
    var result: (T & row)[] = [];
    if (div >= 1 && div == parseInt(`${div}`)) await forEachAsync(selectedElement, () => null, timeout, limit);
    else if (selectedElement.length) await forEachAsync(selectedElement, () => null, timeout, limit);
    // result.push(
    //   ...(await this.insert(this.#mainTreeElement, data, timeout, limit))
    // );
    return result;
  }
  static override create<T>(title: string, defaultValue: T) {
    var tree = super.create(title, defaultValue);
    return tree as Tree<T>;
  }
  static override title(title: string) {
    return super.title(title) as Tree<any>;
  }
}
