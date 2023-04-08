import { Delay } from "./delay";
import { Iterations } from "./iterations";
import { KeyboardShortcut } from "./keyboardshortcuts";
import { callBackQuery, row, subtreePropertys, convertionDataTree, tree, SortedBy, methodesTreeMap, submitTypePress } from "./types";
import { createElement, forEachAsync } from "./utils";

export class TreeLinear<T> extends Iterations<T> {
    // the main element has childs only
    #mainTreeElement = createElement("span", "", {
      "aria-level": -1,
      "aria-disabled": "true",
    });
    // the callback when need to get query
    #callbackquery: callBackQuery<T & row> = (d, i) => `${i}`;
    // separator between querys
    public separator = "/";
    // what the subtree element has
    #subtree_propertys: subtreePropertys<T>[] = [];
    constructor(
      root: HTMLElement,
      title: string,
      propertys: (keyof T)[],
      defaultValues: T
    ) {
      super(root, title, propertys, defaultValues);
      this.root.role = "treelinear";
      this.rowname = "treeitem";
      this.root.prepend(this.#mainTreeElement);
      this.shortcuts.inner = {
        open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
          this.root,
        ]).ondown(() => {
          var selectedElement = this.SELECTD_ELEMENTS;
          selectedElement.forEach((element) => {
            if (this.#isclosed(element)) this.#open(element);
            else {
              var firstElement = this.firstchildof(element);
              if (firstElement) {
                this.setSelect(element, false);
                this.setSelect(firstElement, true);
              }
            }
          });
        }),
        close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
          this.root,
        ]).ondown(() => {
          var selectedElement = this.SELECTD_ELEMENTS;
          selectedElement.forEach((element) => {
            if (this.#isclosed(element)) {
              var outer = this.#outer(element);
              if (outer && outer != this.#mainTreeElement) {
                this.setSelect(element, false);
                this.setSelect(outer, true);
              }
            } else {
              this.#close(element);
            }
          });
        }),
      };
    }
    override get ITEMS() {
      return super.ITEMS;
    }
    getlevel(element: HTMLElement): number {
      return Number(element.ariaLevel);
    }
    #isline(element: HTMLElement) {
      return element.role == "line";
    }
    #inner(element: HTMLElement) {
      var initLvl = this.getlevel(element);
      var { nextElementSibling } = element;
      var result: HTMLElement[] = [];
      while (
        nextElementSibling &&
        initLvl < this.getlevel(nextElementSibling as HTMLElement)
      ) {
        var ele = nextElementSibling as HTMLElement;
        if (!this.#isline(ele) && this.getlevel(ele) == initLvl + 1)
          result.push(ele);
        nextElementSibling = nextElementSibling.nextElementSibling;
      }
      return result;
    }
    #outer(element: HTMLElement) {
      var initLvl = this.getlevel(element);
      var { previousElementSibling } = element;
      while (
        previousElementSibling &&
        initLvl <= this.getlevel(previousElementSibling as HTMLElement)
      )
        previousElementSibling = previousElementSibling.previousElementSibling;
      return previousElementSibling as HTMLElement | null;
    }
    #to_query(element: HTMLElement): string {
      if (element === this.#mainTreeElement) return "";
      var outer = this.#outer(element);
      var data = this.readrow(element);
      if (!outer) return `${this.#callbackquery(data, 0)}`;
      else {
        var index = this.#inner(outer).indexOf(element);
        return `${this.#to_query(outer)}${this.separator}${this.#callbackquery(
          data,
          index
        )}`;
      }
    }
    #to_element(query: string): HTMLElement | null {
      var result = this.#mainTreeElement as HTMLElement | null;
      var spliting = query
        .split(this.separator)
        .map((content) => content.trim())
        .filter((s) => s !== "");
      for (let i = 0; i < spliting.length; i++) {
        if (!result) return null;
        var fd = this.#inner(result).find((element, index) => {
          var data = this.readrow(element);
          return this.#callbackquery(data, index) == spliting[i];
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
    #isopend(element: HTMLElement) {
      if (element == this.#mainTreeElement) return true;
      if (!this.issubtree(element)) return false;
      return element.ariaHidden === "false";
    }
    #isclosed(element: HTMLElement) {
      if (element == this.#mainTreeElement) return false;
      if (!this.issubtree(element)) return true;
      return element.ariaHidden === "true";
    }
    #open(element: HTMLElement) {
      element.ariaHidden = "false";
      var showMoreIcon = this.#getIconElement(element);
      if (showMoreIcon)
        showMoreIcon.innerHTML = `<i class="material-icons">expand_more</i>`;
      this.#inner(element).forEach((ele) => {
        this.setshow(ele, true);
        if (ele.ariaAutoComplete == "true") {
          ele.ariaAutoComplete = "false";
          this.#open(ele);
        }
      });
    }
    #close(element: HTMLElement) {
      element.ariaHidden = "true";
      var showMoreIcon = this.#getIconElement(element);
      if (showMoreIcon)
        showMoreIcon.innerHTML = `<i class="material-icons">chevron_right</i>`;
      this.#inner(element).forEach((ele) => {
        this.setshow(ele, false);
        if (this.#isopend(ele)) {
          ele.ariaAutoComplete = "true";
          this.#close(ele);
        } else ele.ariaAutoComplete = "false";
      });
    }
    #toggle(element: HTMLElement) {
      this.#isclosed(element) ? this.#open(element) : this.#close(element);
    }
    override line(element: HTMLElement | string = "") {
      element = this.convertto(element, "element");
      var ele = createElement("div", "", { role: "line" });
      this.#inner(element);
      this.root.appendChild(ele);
    }
    inner(element: HTMLElement | string) {
      element = this.convertto(element, "element");
      return element ? this.#inner(element) : [];
    }
    outer(element: HTMLElement | string) {
      element = this.convertto(element, "element");
      return element ? this.#outer(element) : null;
    }
    convertto<R extends keyof convertionDataTree>(
      any: HTMLElement | string,
      to: R
    ): convertionDataTree[R] {
      return (
        to == "element"
          ? typeof any == "string"
            ? this.#to_element(any)
            : any
          : typeof any == "string"
          ? any
          : this.#to_query(any)
      ) as convertionDataTree[R];
    }
    childsOf(any: HTMLElement | string) {
      any = this.convertto(any, "element");
      var inner = this.#inner(any);
      var result: HTMLElement[] = [];
      inner.forEach((itemElement) =>
        result.push(itemElement, ...this.childsOf(itemElement))
      );
      return result;
    }
    lastchildof(any: HTMLElement | string) {
      any = this.convertto(any, "element");
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
    firstchildof(any: string | HTMLElement) {
      any = this.convertto(any, "element");
      var inner = this.#inner(any);
      return inner.length ? inner[0] : null;
    }
    issubtree(element: HTMLElement) {
      if (this.#mainTreeElement == element) return true;
      var columns = this.columns(element);
      return this.#subtree_propertys.every(
        ({ property, value }) =>
          columns[this.propertys.indexOf(property)].innerHTML == value
      );
    }
    override createrow(
      input: T,
      lvl: number = 0,
      closed: boolean = false,
      visible: boolean = true
    ): HTMLElement {
      var result = super.createrow(input);
      result.ariaLevel = `${lvl}`;
      result.ariaHidden = `${closed}`;
      this.setshow(result, visible);
      if (this.issubtree(result)) {
        result.ariaExpanded = "true";
        var showMoreIcon = createElement(
          "span",
          `<i class="material-icons">${
            closed ? "chevron_right" : "expand_more"
          }</i>`,
          {
            role: "icon",
          }
        );
        showMoreIcon.onclick = () => this.#toggle(result);
        result.querySelector('[role="level"]')?.prepend(showMoreIcon);
      } else result.ariaExpanded = "false";
      return result;
    }
    read(element: HTMLElement = this.#mainTreeElement): tree<T & row> {
      var body = this.readrow(element);
      return {
        body,
        innerTree: this.#inner(element).map((ele) => this.read(ele)),
      };
    }
    // setters
    setsubtreepropertys(...propertys: subtreePropertys<T>[]) {
      this.#subtree_propertys = propertys;
      this.ITEMS.forEach((element) => {
        var issubtree = this.issubtree(element);
        var iconShowMore = element.querySelector(
          `[role="level"] > [role="icon"]`
        );
        element.ariaExpanded = `${issubtree}`;
        if (issubtree) {
          if (!iconShowMore) {
            var showMoreIcon = createElement(
              "span",
              `<i class="material-icons">chevron_right</i>`,
              {
                role: "icon",
              }
            );
            showMoreIcon.onclick = () => this.#toggle(element);
            element.querySelector('[role="level"]')?.prepend(showMoreIcon);
          }
        } else iconShowMore?.remove();
      });
    }
    setshow(rowElement: HTMLElement, flag: boolean) {
      // set element visible or not
      rowElement.style.display = flag ? "" : "none";
      // set effectivity true if the flag visible or that is gonna be false
      this.setEffective(rowElement, flag);
    }
    override settargetsshortcuts(targets: HTMLElement[] | null = null): void {
      super.settargetsshortcuts(targets);
      this.shortcuts.inner!.open.targets = targets;
      this.shortcuts.inner!.close.targets = targets;
    }
    protected async append(
      element: HTMLElement | string,
      data: T[],
      timeout: number,
      limit: number
    ) {
      // the same steps in the methode `appendSync`
      element = this.convertto(element, "element");
      if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
      var isopend = this.#isopend(element);
      var initLevel = this.getlevel(element) + 1;
      element = this.lastchildof(element) || element;
      data = data.reverse();
      // create delay for make sure the append is not directly append all element
      var dl = new Delay(timeout);
      for (let i = 0; i < data.length; i++) {
        if (!(i % limit)) await dl.on();
        element.after(this.createrow(data[i], initLevel, true, isopend));
      }
    }
    protected async prepend(
      element: HTMLElement | string,
      data: T[],
      timeout: number,
      limit: number
    ) {
      // the same steps of appendSync method just remove step number 5
      element = this.convertto(element, "element");
      if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
      var isopend = this.#isopend(element);
      var initLevel = this.getlevel(element) + 1;
      data = data.reverse();
      var dl = new Delay(timeout);
      for (let i = 0; i < data.length; i++) {
        if (!(i % limit)) dl.on();
        element.after(this.createrow(data[i], initLevel, true, isopend));
      }
    }
    protected async after(
      element: HTMLElement,
      data: T[],
      timeout: number,
      limit: number
    ) {
      this.throwLoading();
      var lvl = this.getlevel(element);
      var inner = this.childsOf(element);
      var isclosed = element.style.display == "none";
      element = inner.at(-1) || element;
      await forEachAsync(
        data.reverse(),
        (d) => element.after(this.createrow(d, lvl, false, isclosed)),
        timeout,
        limit
      );
    }
    protected async before(
      element: HTMLElement,
      data: T[],
      timeout: number,
      limit: number
    ) {
      var lvl = this.getlevel(element);
      var isclosed = element.style.display == "none";
      await forEachAsync(
        data,
        (d) => element.before(this.createrow(d, lvl, true, isclosed)),
        timeout,
        limit
      );
    }
    protected async delete(element: HTMLElement, timeout: number, limit: number) {
      await forEachAsync(
        this.#inner(element),
        async (ele) => await this.delete(ele, timeout, limit),
        timeout,
        limit
      );
      element.remove();
    }
    protected async insert(
      element: HTMLElement,
      tree: tree<T>[],
      timeout: number,
      limit: number
    ) {
      var level = this.getlevel(element) + 1;
      var isopend = this.#isopend(element);
      await forEachAsync(
        tree,
        async ({ body, innerTree }) => {
          var ele = this.createrow(body, level, true, isopend);
          var mainElement = this.lastchildof(element) || element;
          mainElement.after(ele);
          Array.isArray(innerTree) &&
            innerTree.length &&
            (await this.insert(ele, innerTree, timeout, limit));
        },
        timeout,
        limit
      );
    }
    protected appendSync(element: HTMLElement | string, data: T[]) {
      // convert element (element|query) to HTMLElement
      element = this.convertto(element, "element");
      // throw error if the element gona append as not subtree element
      if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
      // isopend true if the element is opend and thes inner items is visible else false
      var isopend = this.#isopend(element);
      // the initial level of element expl: element level => 10 the new items element level => 11
      var initLevel = this.getlevel(element) + 1;
      // test if this element has a last element child reccur or not => if has the element gona change
      element = this.lastchildof(element) || element;
      // reverse data for when append to element the order stay fix
      data = data.reverse();
      // creation of items
      for (let i = 0; i < data.length; i++) {
        // set the row element if as visible and effective or not
        element.after(this.createrow(data[i], initLevel, true, isopend));
      }
    }
    protected prependSync(element: HTMLElement | string, data: T[]) {
      this.throwLoading();
      // the same steps of appendSync method just remove step number 5
      element = this.convertto(element, "element");
      if (!this.issubtree(element)) throw Error("Cannot Be add in this item");
      var isopend = this.#isopend(element);
      var initLevel = this.getlevel(element) + 1;
      data = data.reverse();
      for (let i = 0; i < data.length; i++)
        element.after(this.createrow(data[i], initLevel, true, isopend));
    }
    protected afterSync(element: HTMLElement, data: T[]) {
      this.throwLoading();
      var lvl = this.getlevel(element);
      var inner = this.#inner(element);
      var isclosed = element.style.display == "none";
      while (inner.length) {
        element = inner.at(-1)!;
        inner = this.#inner(element);
      }
      data
        .reverse()
        .forEach((d) => element.after(this.createrow(d, lvl, false, !isclosed)));
    }
    protected beforeSync(element: HTMLElement, data: T[]) {
      var lvl = this.getlevel(element);
      var isclosed = element.style.display == "none";
      data.forEach((d) => element.before(this.createrow(d, lvl, true, isclosed)));
    }
    protected deleteSync(element: HTMLElement) {
      this.#inner(element).forEach((ele) => this.deleteSync(ele));
      element.remove();
    }
    protected insertSync(element: HTMLElement, tree: tree<T>[]) {
      var level = this.getlevel(element) + 1;
      var isopend = this.#isopend(element);
      tree.forEach(({ body, innerTree }) => {
        var ele = this.createrow(body, level, true, isopend);
        var mainElement = this.lastchildof(element) || element;
        mainElement.after(ele);
        Array.isArray(innerTree) &&
          innerTree.length &&
          this.insertSync(ele, innerTree);
      });
    }
    protected sortSync(
      element: HTMLElement = this.#mainTreeElement,
      sortBy: keyof T,
      direction: SortedBy,
      deep: boolean = true
    ) {
      var tree = this.read(element).innerTree;
      for (let i = 0; i < tree.length; i++) {
        var X = tree[i];
        var { row } = X.body;
        deep && this.sortSync(row, sortBy, direction);
        var j = i - 1;
        var prec = tree[j];
        while (
          prec &&
          (direction == "down"
            ? prec.body[sortBy] < X.body[sortBy]
            : prec.body[sortBy] > X.body[sortBy])
        ) {
          prec = tree[j];
          j--;
        }
        var childs = this.childsOf(row);
        if (prec) prec.body.row.before(...childs);
        else element.after(...childs);
        tree = this.read(element).innerTree;
      }
    }
    protected async sort(
      element: HTMLElement,
      key: keyof T,
      direction: SortedBy,
      deep: boolean = true,
      timeout: number,
      limit: number
    ) {
      var dl = new Delay(timeout);
      var tree = this.read(element).innerTree;
      function childs(tree: tree<T & row>) {
        var result = [tree.body.row];
        tree.innerTree.forEach((tree) => result.push(...childs(tree)));
        return result;
      }
      for (let i = 0; i < tree.length; i++) {
        if (!(i % limit)) await dl.on();
        var o = tree[i];
        var { body } = o;
        var { row } = body;
        var j = i - 1;
        var prec = tree[j];
        while (
          prec &&
          (direction == "down"
            ? prec.body[key] < body[key]
            : prec.body[key] > body[key])
        ) {
          j--;
          prec = tree[j];
        }
        var c = childs(o);
        if (prec) prec.body.row.before(...c);
        else element.after(...c);
        deep && (await this.sort(row, key, direction, true, timeout, limit));
        tree = this.read(element).innerTree;
      }
    }
    async methode<R extends keyof methodesTreeMap<T>>(
      methode: R,
      element: HTMLElement | string,
      input: methodesTreeMap<T>[R],
      timeout: number,
      limit: number
    ) {
      this.throwLoading();
      this.isloading = true;
      element = this.convertto(element, "element");
      switch (methode) {
        case "before": {
        }
        case "append": {
        }
        case "prepend": {
        }
        case "after": {
          await this[methode as "after" | "before" | "append"](
            element,
            input as methodesTreeMap<T>["after"],
            timeout,
            limit
          );
          break;
        }
        case "insert": {
          await this.insert(
            element,
            input as methodesTreeMap<T>["insert"],
            timeout,
            limit
          );
          break;
        }
        case "delete": {
          await this.delete(element, timeout, limit);
          break;
        }
        case "sort": {
          var { by, direction, deep } = input as methodesTreeMap<T>["sort"];
          await this.sort(element, by, direction, deep, timeout, limit);
        }
      }
      this.isloading = false;
    }
    methodeSync<R extends keyof methodesTreeMap<T>>(
      methode: R,
      element: HTMLElement | string,
      input: methodesTreeMap<T>[R]
    ) {
      this.throwLoading();
      element = this.convertto(element, "element");
      switch (methode) {
        case "before": {
        }
        case "append": {
        }
        case "prepend": {
        }
        case "after": {
          this[`${methode as "after" | "before" | "append"}Sync`](
            element,
            input as methodesTreeMap<T>["after"]
          );
          break;
        }
        case "insert": {
          this.insertSync(element, input as methodesTreeMap<T>["insert"]);
          break;
        }
        case "delete": {
          this.deleteSync(element);
          break;
        }
        case "sort": {
          var { by, direction, deep } = input as methodesTreeMap<T>["sort"];
          this.sortSync(element, by, direction, deep);
        }
      }
    }
    setcallbackquery(callback: callBackQuery<T>) {
      this.#callbackquery = callback;
    }
    isopend(element: HTMLElement | string) {
      element = this.convertto(element, "element");
      return this.#isopend(element);
    }
    isclosed(element: HTMLElement | string) {
      element = this.convertto(element, "element");
      return this.#isclosed(element);
    }
    open(element: HTMLElement | string = this.#mainTreeElement) {
      element = this.convertto(element, "element");
      if (this.issubtree(element))
        throw Error("Cannot Be open element not subtree element");
      else this.#open(element);
    }
    close(element: HTMLElement | string = this.#mainTreeElement) {
      element = this.convertto(element, "element");
      if (this.issubtree(element))
        throw Error("Cannot Be open element not subtree element");
      else this.#close(element);
    }
    toggle(element: HTMLElement | string = this.#mainTreeElement) {
      element = this.convertto(element, "element");
      if (this.issubtree(element))
        throw Error("Cannot Be open element not subtree element");
      else this.#close(element);
    }
    override submit(
      type: submitTypePress = "call",
      element = this.ELEMENT_DIRECTION
    ) {
      if (!this.SELECTD_ELEMENTS.length || this.issubtree(element!)) return;
      this.onSubmitFunctions.forEach((fn) => fn(type, element!));
    }
    jsontree(element: HTMLElement): tree<T> {
      return {
        body: super.json(element),
        innerTree: this.issubtree(element)
          ? this.#inner(element).map((ele) => this.jsontree(ele))
          : [],
      };
    }
    override async copy() {
      var selectedElement = this.SELECTD_ELEMENTS;
      await navigator.clipboard.writeText(
        JSON.stringify(
          selectedElement.map((ele) => this.jsontree(ele)),
          undefined,
          1
        )
      );
    }
    override async cut(timeout: number = 20, limit: number = 1) {
      var selectedElement = this.SELECTD_ELEMENTS;
      await navigator.clipboard.writeText(
        JSON.stringify(
          selectedElement.map((ele) => this.jsontree(ele)),
          undefined,
          1
        )
      );
      selectedElement.forEach((element) => this.delete(element, timeout, limit));
    }
    override async paste(timeout: number = 20, limit: number = 1) {
      this.throwLoading();
      var data = JSON.parse(await navigator.clipboard.readText());
      if (!Array.isArray(data)) throw Error("paste ignore");
      var selected = this.SELECTD_ELEMENTS.filter((ele) => this.issubtree(ele));
      if (selected.length == data.length) {
        await forEachAsync(
          selected,
          async (element, index) =>
            await this.insert(element, [data[index]], timeout, limit),
          timeout,
          limit
        );
      }
    }
    static override create<T>(title: string, defaultValue: T): TreeLinear<T> {
      var tree = super.create(title, defaultValue);
      return tree as TreeLinear<T>;
    }
  }
  