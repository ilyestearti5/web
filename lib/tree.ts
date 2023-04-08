import { Iterations } from "./iterations";
import { KeyboardShortcut } from "./keyboardshortcuts";
import {
  subtreePropertys,
  callBackQuery,
  row,
  convertionDataTree,
  submitTypePress,
  tree,
  methodesTreeMap,
} from "./types";
import { createElement } from "./utils";

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
    this.#getitemelement(this.#mainTreeElement).style.display = "none";
    this.root.prepend(this.#mainTreeElement);
    if (this.shortcuts.find) {
      this.shortcuts.find.forword.clear("down");
      this.shortcuts.find.forword.ondown(({ Keys }) => {
        if (!Keys) return;
        var ky = KeyboardShortcut.keyOf(Keys[0]);
        var {
          EFFECTIVE_ELEMENTS: effeEle,
          MIN_ELEMENT_EFFECTIVE: minEff,
          ELEMENT_DIRECTION: eleDir,
        } = this;
        var findFrom = eleDir || minEff;
        if (!findFrom) return;
        var index = effeEle.indexOf(findFrom);
        var get = effeEle
          .slice(index + 1)
          .find(
            (ele) =>
              `${this.readrow(ele)[this.searcherKey]}`[0].toUpperCase() == ky
          );
        if (get) this.select(get);
      });
      this.shortcuts.find.backword.clear("down");
      this.shortcuts.find.backword.ondown(({ Keys }) => {
        if (!Keys) return;
        var ky = KeyboardShortcut.keyOf(Keys[0]);
        var {
          EFFECTIVE_ELEMENTS: effeEle,
          MIN_ELEMENT_EFFECTIVE: minEff,
          ELEMENT_DIRECTION: eleDir,
        } = this;
        var findFrom = eleDir || minEff;
        effeEle = effeEle.reverse();
        if (!findFrom) return;
        var index = effeEle.indexOf(findFrom);
        var get = effeEle
          .slice(index + 1)
          .find(
            (ele) =>
              `${this.readrow(ele)[this.searcherKey]}`[0].toUpperCase() === ky
          );
        if (get) this.select(get);
      });
    }
    this.shortcuts.inner = {
      open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
        this.root,
      ]).ondown(() => {
        this.SELECTD_ELEMENTS.forEach((ele) => {
          if (this.isopend(ele)) {
            var inner = this.#inner(ele);
            if (inner.length) {
              this.setSelect(inner[0], true);
              this.setSelect(ele, false);
            }
          } else this.open(ele);
        });
      }),
      close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
        this.root,
      ]).ondown(() => {
        this.SELECTD_ELEMENTS.forEach((ele) => {
          if (this.isopend(ele)) this.close(ele);
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
    this.shortcuts.status.submit.ondown((cmb, event) => {
      this.SELECTD_ELEMENTS.forEach(
        (ele) => this.issubtree(ele) && this.open(ele)
      );
    });
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
    if (!count) {
      this.configurations.scrolling && this.scroll("forword");
      return;
    }
    var {
      EFFECTIVE_ELEMENTS: effEle,
      ELEMENT_DIRECTION: eleDir,
      MIN_ELEMENT_EFFECTIVE: minEff,
    } = this;
    var index = effEle.indexOf(eleDir!);
    var ele = effEle[index + 1] || minEff;
    if (ele) this.select(ele);
    else if (minEff && this.configurations.redirect) this.select(minEff);
    else return;
    this.forword(count - 1);
  }
  override backword(count: number) {
    if (!count) {
      this.configurations.scrolling && this.scroll("backword");
      return;
    }
    var {
      EFFECTIVE_ELEMENTS: effEle,
      ELEMENT_DIRECTION: eleDir,
      MAX_ELEMENT_EFFCTIVE: maxEff,
    } = this;
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
    this.configurations.scrolling && this.scroll("forword");
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
  override submit(type: submitTypePress, element: HTMLElement) {
    if (this.issubtree(element)) return;
    super.submit(type, element);
  }
  issubtree(element: HTMLElement) {
    if (this.#mainTreeElement == element) return true;
    var columns = this.columns(this.#getitemelement(element));
    return this.#subtreepropertys.every(
      ({ property, value }) =>
        columns[this.propertys.indexOf(property)].innerHTML == value
    );
  }
  setsubtreepropertys(...propertys: subtreePropertys<T>[]) {
    this.#subtreepropertys = propertys;
    this.ITEMS.forEach((element) => {
      if (this.issubtree(element)) {
        if (!this.#getinnertreeelement(element)) {
          var subtree = createElement("div", "", { role: "tree" });
          element.appendChild(subtree);
        }
      } else {
        this.#getinnertreeelement(element)?.remove();
      }
    });
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
      var row = this.createrow(body);
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
  isopend(element: HTMLElement) {
    var ele = this.#getinnertreeelement(element);
    if (ele) return ele.style.display !== "none";
    else return false;
  }
  isclosed(element: HTMLElement) {
    var ele = this.#getinnertreeelement(element);
    if (ele) return ele.style.display === "none";
    else return true;
  }
  open(element: HTMLElement) {
    var ele = this.#getinnertreeelement(element);
    if (ele) {
      ele.style.display = "";
      this.#inner(element).forEach((e) => this.setEffective(e, true));
    }
  }
  close(element: HTMLElement) {
    var ele = this.#getinnertreeelement(element);
    if (ele) {
      ele.style.display = "none";
      this.#inner(element).forEach((e) => this.setEffective(e, false));
    }
  }
  toggle(element: HTMLElement) {
    var ele = this.#getinnertreeelement(element);
    if (ele) {
      let { display } = ele.style;
      this.#inner(element).forEach((e) =>
        this.setEffective(e, display !== "none")
      );
      ele.style.display = display == "none" ? "" : "none";
    }
  }
}
