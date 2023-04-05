import {
  Iterations,
  callBackQuery,
  convertionDataTree,
  methodesTreeMap,
  row,
  subtreePropertys,
  tree,
} from "./index.js";
import { createElement } from "./utils.js";
export class Tree<T> extends Iterations<T> {
  #subtreepropertys: subtreePropertys<T>[] = [];
  #callbackquery: callBackQuery<T & row> = (d, i) => `${i}`;
  #mainTreeElement: HTMLElement;
  public separator = "/";
  constructor(
    root: HTMLElement,
    title: string,
    propertys: (keyof T)[],
    defaultValues: T
  ) {
    super(root, title, propertys, defaultValues);
    this.root.role = "tree";
    this.rowname = "treegrid";
    this.#mainTreeElement = this.createrow(this.defaultValues);
    this.#getcontentelement(this.#mainTreeElement).innerHTML = "";
    this.root.prepend(this.#mainTreeElement);
  }
  override get ITEMS() {
    var fn = (element: HTMLElement) => {
      var inner = this.#inner(element);
      var result: HTMLElement[] = [];
      inner.map((ele) => {
        result.push(ele, ...fn(ele));
      });
      return result;
    };
    return fn(this.#mainTreeElement);
  }
  #getitemelement(element: HTMLElement) {
    return Array.from(element.children).find(
      (ele) => ele.role == "treeitem"
    )! as HTMLElement;
  }
  #getcontentelement(element: HTMLElement) {
    return Array.from(this.#getitemelement(element).children).find(
      (ele) => ele.role == "content"
    )! as HTMLElement;
  }
  #getinnertreeelement(element: HTMLElement) {
    return Array.from(element.children).find(
      (ele) => ele.role == "tree"
    ) as HTMLElement | null;
  }
  #getoutertreeelement(element: HTMLElement) {
    var result = element.closest(`[role="tree"]`);
    return result && this.root.contains(result) ? result : null;
  }
  #inner(element: HTMLElement) {
    var innerTree = this.#getinnertreeelement(element);
    return innerTree ? (Array.from(innerTree.children) as HTMLElement[]) : [];
  }
  #outer(element: HTMLElement) {
    var result = (element.parentElement as HTMLElement).closest(
      `[role="${this.rowname}"]`
    );
    return result && this.root.contains(result)
      ? (result as HTMLElement)
      : null;
  }
  #toelement(query: string) {
    var spliting = query
      .split(this.separator)
      .map((s) => s.trim())
      .filter((s) => s !== "");
    var result = this.#mainTreeElement as HTMLElement | null;
    for (let i = 0; i < spliting.length; i++) {
      if (!result) return null;
      var inner = this.#inner(result);
      var fdElement = inner.find(
        (e, index) => this.#callbackquery(this.readrow(e), index) == spliting[i]
      );
      result = fdElement || null;
    }
    return result;
  }
  #toquery(element: HTMLElement): string {
    if (element == this.#mainTreeElement) return "";
    var string = this.#callbackquery(this.readrow(element), 0);
    var outer = this.#outer(element);
    while (outer && outer !== this.#mainTreeElement) {
      string = `${this.#callbackquery(this.readrow(outer), 0)}${
        this.separator
      }${string}`;
      outer = this.#outer(element);
    }
    return string;
  }
  convertto<R extends keyof convertionDataTree>(
    any: HTMLElement | string,
    to: R
  ): convertionDataTree[R] {
    return (
      to == "element"
        ? typeof any == "string"
          ? this.#toelement(any)
          : any
        : typeof any == "string"
        ? any
        : this.#toquery(any)
    ) as convertionDataTree[R];
  }
  override forword(count: number) {
    const element = this.ELEMENT_DIRECTION;
    console.log(element);
  }
  override createrow(input: T): HTMLElement {
    var treeitem = super.createrow(input);
    treeitem.role = "treeitem";
    var result = createElement("div", "", { role: this.rowname });
    result.appendChild(treeitem);
    if (this.issubtree(result)) {
      var subtree = createElement("div", "", { role: "tree" });
      result.appendChild(subtree);
    }
    return result;
  }
  override readrow(element: HTMLElement): T & row {
    var o = super.readrow(this.#getitemelement(element));
    o.row = element;
    return o;
  }
  issubtree(element: HTMLElement) {
    if (this.#mainTreeElement == element) return true;
    var columns = this.columns(this.#getitemelement(element));
    return this.#subtreepropertys.every(
      ({ property, value }) =>
        columns[this.propertys.indexOf(property)].innerHTML == value
    );
  }
  setcallbackquery(callback: callBackQuery<T>) {
    this.#callbackquery = callback;
  }
  protected appendSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    if (!this.issubtree(element)) return;
    var subtreeElement = this.#getinnertreeelement(element)!;
    subtreeElement.append(...data.map((input) => this.createrow(input)));
  }
  protected prependSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    if (!this.issubtree(element)) return;
    var subtreeElement = this.#getinnertreeelement(element)!;
    subtreeElement.prepend(...data.map((input) => this.createrow(input)));
  }
  protected beforeSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    element.before(...data.map((input) => this.createrow(input)));
  }
  protected afterSync(element: HTMLElement, data: T[]) {
    this.throwLoading();
    element.after(...data.reverse().map((input) => this.createrow(input)));
  }
  protected insertSync(element: HTMLElement, data: tree<T>[]) {
    this.throwLoading();
    if (!this.issubtree(element)) return;
    var subtreeElement = this.#getinnertreeelement(element)!;
    data.forEach(({ body, innerTree }) => {
      const row = this.createrow(body);
      subtreeElement.appendChild(row);
      Array.isArray(innerTree) &&
        innerTree.length &&
        this.insertSync(row, innerTree);
    });
  }
  methodeSync<R extends keyof methodesTreeMap<T>>(
    event: R,
    any: HTMLElement | string,
    data: methodesTreeMap<T>[R]
  ) {
    any = this.convertto(any, "element");
    switch (event) {
      case "append": {
      }
      case "prepend": {
      }
      case "after": {
      }
      case "before": {
        this[`${event as "append" | "prepend" | "after" | "before"}Sync`](
          any,
          data as T[]
        );
        break;
      }
      case "insert": {
        this.insertSync(any, data as tree<T>[]);
        break;
      }
    }
  }
  static override create<R>(title: string, defaultValue: R): Tree<R> {
    return super.create(title, defaultValue) as Tree<R>;
  }
}
