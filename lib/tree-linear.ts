import { Delay } from "./delay.js";
import { KeyboardShortcut } from "./keyboard-shortcuts.js";
import { ListBox } from "./listbox.js";
import {
  Row,
  ConvertionQueryData,
  tree,
  CallBackQuery,
  MethodTreeLinear,
  HistoryEventTreeLinear,
  SortedBy,
} from "./types.js";
import { createElement, defaultObject, forEachAsync } from "./utils.js";

export class TreeLinear<U extends HTMLElement, T> extends ListBox<U> {
  #parentRoot: HTMLElement = createElement("span", "", { "aria-level": -1 });
  #propertys: (keyof T)[] = [];
  #writable: boolean = true;
  #hiddenPropertys: (keyof T)[] = [];
  // events
  #on_change_function: Function[] = [];
  #writingShortcut: KeyboardShortcut = KeyboardShortcut.create(
    `${this.title} - write`,
    `Ctrl${KeyboardShortcut.separatorShortcuts}Enter`,
    null
  ).ondown(() => {
    if (!this.root.contains(document.activeElement)) return;
    (document.activeElement as HTMLElement)?.blur();
  });
  #history: HistoryEventTreeLinear<T>[] = [];
  #callbackQuery: CallBackQuery<T> = (d: T, i: number) => `${i}`;
  public separator: string = "/";
  constructor(
    root: U,
    title: string,
    propertys: (keyof T)[],
    public defProp: T
  ) {
    super(root, title);
    this.#propertys = propertys;
    this.root.setAttribute("role", "table");
    this.root.tabIndex = -1;
    this.setEffective(this.#parentRoot, false);
    this.shortcuts.clipboard = {
      copy: KeyboardShortcut.create(
        `${this.title} - copy`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}C`,
        [this.root]
      ).ondown(async () => {
        await this.copy();
      }),
      paste: KeyboardShortcut.create(
        `${this.title} - paste`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}V`,
        [this.root]
      ).ondown(async () => {
        await this.paste();
      }),
      cut: KeyboardShortcut.create(
        `${this.title} - cut`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}X`,
        [this.root]
      ).ondown(async () => {
        await this.cut();
      }),
    };
    this.shortcuts.inner = {
      open: KeyboardShortcut.create(`${this.title} - open`, "ArrowRight", [
        this.root,
      ]).ondown(() => {
        this.SELECT_ELEMENTS.forEach((ele) => {
          if (this.#isOpend(ele)) {
            var effective = this.#innerTree(ele).filter((ele) =>
              this.getEffective(ele)
            );
            if (effective.length) {
              this.setSelect(effective[0], true);
              this.setSelect(ele, false);
            }
          } else this.#open(ele);
        });
      }),
      close: KeyboardShortcut.create(`${this.title} - close`, "ArrowLeft", [
        this.root,
      ]).ondown(() => {
        this.SELECT_ELEMENTS.forEach((ele) => {
          if (this.#isClosed(ele)) {
            var outer = this.#outerTree(ele);
            outer && this.setSelect(outer, true) && this.setSelect(ele, false);
          } else this.#close(ele);
        });
      }),
    };
    this.root.prepend(this.#parentRoot);
    this.rowString = "treeitem";
  }
  get propertys(): (keyof T)[] {
    return this.#propertys;
  }
  get hiddenPropertys() {
    return this.#hiddenPropertys;
  }
  set hiddenPropertys(v) {
    this.#hiddenPropertys = v;
    this.columns(this.#propertys).forEach((eles) =>
      eles.forEach((ele) => (ele.style.display = ""))
    );
    this.columns(this.#hiddenPropertys).forEach((eles) =>
      eles.forEach((ele) => (ele.style.display = "none"))
    );
  }
  get history() {
    return this.#history;
  }
  get DATA() {
    return this.read().innerTree;
  }
  get ITEMS() {
    return super.ITEMS.slice(1);
  }
  #getWritable() {
    return this.#writable;
  }
  #setWritable(flag: boolean) {
    this.#writable = Boolean(flag);
  }
  #getLevel(element: HTMLElement): number {
    return +`${element.ariaLevel}`;
  }
  #outerTree(element: HTMLElement) {
    var level = this.#getLevel(element);
    var { previousElementSibling } = element;
    while (
      previousElementSibling &&
      this.#getLevel(previousElementSibling as HTMLElement) >= level
    )
      previousElementSibling = previousElementSibling.previousElementSibling;

    return previousElementSibling == this.#parentRoot
      ? null
      : (previousElementSibling as HTMLElement | null);
  }
  #innerTree(element: HTMLElement): HTMLElement[] {
    var level = this.#getLevel(element);
    var nextElementSibling = element.nextElementSibling;
    var lvl: number;

    var result: HTMLElement[] = [];

    while (
      nextElementSibling &&
      (lvl = this.#getLevel(nextElementSibling as HTMLElement)) > level
    ) {
      level + 1 === lvl && result.push(nextElementSibling as HTMLElement);
      nextElementSibling = nextElementSibling.nextElementSibling;
    }

    return result;
  }
  #open(element: HTMLElement) {
    this.#innerTree(element).forEach((ele) => {
      ele.style.display = "";
      this.setEffective(ele, true);
      if (ele.hasAttribute("inneropened")) {
        ele.removeAttribute("inneropened");
        this.#open(ele);
      }
    });
  }
  #close(element: HTMLElement) {
    this.#innerTree(element).forEach((ele) => {
      ele.style.display = "none";
      this.setEffective(ele, false);
      if (this.#isOpend(ele)) {
        ele.setAttribute("inneropened", "");
        this.#close(ele);
      } else ele.removeAttribute("inneropened");
    });
  }
  #toggle(element: HTMLElement) {
    this.#isClosed(element) ? this.#open(element) : this.#close(element);
  }
  #isOpend(element: HTMLElement) {
    return this.#innerTree(element).every(
      (ele) => ele.style.display !== "none"
    );
  }
  #isClosed(element: HTMLElement) {
    return this.#innerTree(element).every(
      (ele) => ele.style.display === "none"
    );
  }
  #toQuery(element: HTMLElement = this.#parentRoot): string {
    if (element == this.#parentRoot) return "";
    var outer = this.#outerTree(element);

    var inner = outer ? this.#innerTree(outer) : [];

    var index = inner.indexOf(element);

    return (
      (outer ? this.#toQuery(outer) + this.separator : "") +
      this.#callbackQuery(this.readRow(element), index)
    );
  }
  #toElement(query: string) {
    query = query.trim();
    if (query == "") return this.#parentRoot;
    var array = query.split(this.separator);

    var element = this.#parentRoot;

    for (let i = 0; i < array.length; i++) {
      var inner = this.#innerTree(element);

      var finded = inner.find(
        (ele, index) =>
          this.#callbackQuery(this.readRow(ele), index) === array[i]
      );

      if (!finded) return null;

      element = finded;
    }

    return element;
  }
  async #append(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: T[]
  ) {
    var lvl = this.#getLevel(element) + 1;
    var inner = this.#innerTree(element);
    var isClosed = this.#isClosed(element);
    element = inner.length ? inner[inner.length - 1] : element;

    await forEachAsync(
      data.reverse(),
      (d) => element.after(this.createRow(d, lvl, isClosed)),
      timeout,
      limit
    );
  }
  #appendSync(element: HTMLElement, ...data: T[]) {
    var lvl = this.#getLevel(element) + 1;
    var inner = this.#innerTree(element);
    var isClosed = !this.#isOpend(element);
    element = inner.length ? inner[inner.length - 1] : element;

    data
      .reverse()
      .forEach((d) => element.after(this.createRow(d, lvl, isClosed)));
  }
  async #after(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: T[]
  ) {
    var lvl = this.#getLevel(element);

    var inner = this.#childs(element);

    var isClosed = element.style.display == "none";

    element = inner.length ? inner[inner.length - 1] : element;

    await forEachAsync(
      data.reverse(),
      (d) => element.after(this.createRow(d, lvl, isClosed)),
      timeout,
      limit
    );
  }
  #afterSync(element: HTMLElement, ...data: T[]) {
    var lvl = this.#getLevel(element);

    var inner = this.#innerTree(element);

    var isClosed = element.style.display == "none";

    while (inner.length) {
      element = inner[inner.length - 1];
      inner = this.#innerTree(element);
    }

    data
      .reverse()
      .forEach((d) => element.after(this.createRow(d, lvl, isClosed)));
  }
  async #before(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: T[]
  ) {
    var lvl = this.#getLevel(element);
    var isClosed = element.style.display == "none";
    await forEachAsync(
      data,
      (d) => element.before(this.createRow(d, lvl, isClosed)),
      timeout,
      limit
    );
  }
  #beforeSync(element: HTMLElement, ...data: T[]) {
    var lvl = this.#getLevel(element);
    var isClosed = element.style.display == "none";
    data.forEach((d) => element.before(this.createRow(d, lvl, isClosed)));
  }
  #insertSync(element: HTMLElement, ...tree: tree<T>[]) {
    var level = this.#getLevel(element) + 1;
    var isClosed = !this.#isOpend(element);
    tree.forEach(({ body, innerTree }) => {
      var ele = this.createRow(body, level, isClosed);

      var inner = this.#innerTree(element);
      var mainElement = inner.length ? inner[inner.length - 1] : element;

      mainElement.after(ele);

      Array.isArray(innerTree) &&
        innerTree.length &&
        this.#insertSync(ele, ...innerTree);
    });
  }
  async #insert(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...tree: tree<T>[]
  ) {
    var level = this.#getLevel(element) + 1;
    var isClosed = !this.#isOpend(element);

    await forEachAsync(
      tree,
      async ({ body, innerTree }) => {
        var ele = this.createRow(body, level, isClosed);

        var childs = this.#childs(element);
        var mainElement = childs.length ? childs[childs.length - 1] : element;

        mainElement.after(ele);

        Array.isArray(innerTree) &&
          innerTree.length &&
          (await this.#insert(ele, timeout, limit, ...innerTree));
      },
      timeout,
      limit
    );
  }
  #childs(element: HTMLElement) {
    var result: HTMLElement[] = [element];

    this.#innerTree(element).forEach((ele) =>
      result.push(...this.#childs(ele))
    );

    return result;
  }
  async #methode<M extends keyof MethodTreeLinear<T>>(
    event: M,
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    switch (event) {
      case "append": {
        await this.#append(
          element,
          timeout,
          limit,
          ...(data as MethodTreeLinear<T>["append"][])
        );
        break;
      }
      case "after": {
        await this.#after(
          element,
          timeout,
          limit,
          ...(data as MethodTreeLinear<T>["after"][])
        );
        break;
      }
      case "before": {
        await this.#before(
          element,
          timeout,
          limit,
          ...(data as MethodTreeLinear<T>["before"][])
        );
        break;
      }
      case "insert": {
        await this.#insert(
          element,
          timeout,
          limit,
          ...(data as MethodTreeLinear<T>["insert"][])
        );
        break;
      }
    }

    this.#on_change_function.forEach((fn) => fn());
  }
  #methodeSync<M extends keyof MethodTreeLinear<T>>(
    name: M,
    element: HTMLElement,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    switch (name) {
      case "append": {
        this.#appendSync(element, ...(data as MethodTreeLinear<T>["append"][]));
        break;
      }
      case "after": {
        this.#afterSync(element, ...(data as MethodTreeLinear<T>["after"][]));
        break;
      }
      case "before": {
        this.#beforeSync(element, ...(data as MethodTreeLinear<T>["before"][]));
        break;
      }
      case "insert": {
        this.#insertSync(element, ...(data as MethodTreeLinear<T>["insert"][]));
        break;
      }
    }

    this.#on_change_function.forEach((fn) => fn());
  }
  #deleteSync(element: HTMLElement) {
    this.#innerTree(element).forEach((ele) => this.#deleteSync(ele));
    element.remove();
  }
  async #delete(element: HTMLElement) {
    await forEachAsync(
      this.#innerTree(element),
      async (ele) => await this.#delete(ele),
      4,
      1
    );
    element.remove();
  }
  #sortSync(
    sortBy: keyof T,
    direction: SortedBy,
    element: HTMLElement = this.#parentRoot,
    deep: boolean = true
  ) {
    var tree = this.read(element).innerTree;

    for (let i = 0; i < tree.length; i++) {
      var { body } = tree[i];
      var { row } = body;

      deep && this.#sortSync(sortBy, direction, row);

      var j = i - 1;

      var prec = tree[j];

      while (
        prec &&
        (direction == "down"
          ? prec.body[sortBy] < body[sortBy]
          : prec.body[sortBy] > body[sortBy])
      ) {
        j--;
        prec = tree[j];
      }

      var childs = this.#childs(row);

      if (prec) prec.body.row.before(...childs);
      else element.after(...childs);
    }
  }
  async #sort(
    key: keyof T,
    direction: SortedBy,
    element: HTMLElement,
    deep: boolean = true,
    timeout: number,
    limit: number
  ) {
    var dl = new Delay(timeout);

    var tree = this.read(element).innerTree;

    function childs(tree: tree<T & Row>) {
      var result = [tree.body.row];
      tree.innerTree.forEach((tree) => result.push(...childs(tree)));
      return result;
    }

    for (let i = 0; i < tree.length; i++) {
      if (!(i % limit)) await dl.on();
      var o = tree[i];
      var { body, innerTree } = o;
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

      deep && (await this.#sort(key, direction, row, true, timeout, limit));

      tree = this.read(element).innerTree;
    }
  }
  // ready methods
  // ---------------------------------------------------------------------
  //                                                                      |
  //                                                                      |
  //                                                                      |
  //                                                                      |
  //                                                                      |
  //                                                                      |
  // ---------------------------------------------------------------------
  getWritable() {
    return this.#getWritable();
  }
  setWritable(flag: boolean = true) {
    this.#setWritable(flag);
  }
  getCallbackQuery() {
    return this.#callbackQuery;
  }
  setCallbackQuery(callback: CallBackQuery<T>) {
    this.#callbackQuery = callback;
  }
  createRow(feild: T, level: number, closed: boolean = false) {
    feild = defaultObject(feild, this.defProp);
    const result = createElement("div", "", {
      role: "treeitem",
      "aria-level": level,
      draggable: this.dragging,
    });

    result.style.display = closed ? "none" : "";

    const span = createElement("span", "", { role: "open-close" });
    result.appendChild(span);
    span.onclick = () => this.#toggle(result);

    var row = createElement("div", "", { role: "row" });
    result.appendChild(row);
    this.#propertys.forEach((prop) => {
      var col = createElement("span", `${feild[prop]}`, { role: "col" });
      col.ondblclick = () => this.#writable && (col.contentEditable = "true");
      col.onblur = () => (col.contentEditable = "false");
      col.style.display = this.hiddenPropertys.includes(prop) ? "none" : "";
      row.appendChild(col);
    });
    return result;
  }
  readRow(element: HTMLElement): T & Row {
    var o: T & Row = Object.create(null);

    o.row = element;

    if (o.row == this.#parentRoot) return o;

    var row = (Array.from(element.children) as HTMLElement[]).find(
      (ele) => ele.getAttribute("role") == "row"
    );

    if (!row) return o;

    var columns = (Array.from(row.children) as HTMLElement[]).filter(
      (ele) => ele.getAttribute("role") == "col"
    );

    this.#propertys.forEach((prop, index) => {
      var ele = columns[index];
      Object.defineProperty(o, prop, {
        get(): string | number {
          return ele.textContent
            ? isNaN(+ele.textContent)
              ? ele.textContent
              : +ele.textContent
            : "";
        },
        set(value: number | string) {
          ele.innerHTML = `${value}`;
        },
        enumerable: true,
        configurable: false,
      });
    });

    return o;
  }
  read(element: HTMLElement = this.#parentRoot): tree<T & Row> {
    var body = this.readRow(element);
    return {
      body,
      innerTree: this.#innerTree(element).map((ele) => this.read(ele)),
    };
  }
  innerTree(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    return this.#innerTree(element);
  }
  outerTree(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    return this.#outerTree(element);
  }
  open(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#open(element);
  }
  close(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#close(element);
  }
  toggle(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#toggle(element);
  }
  isOpend(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#isOpend(element);
  }
  isClosed(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#isClosed(element);
  }
  convertTo<R extends keyof ConvertionQueryData>(
    element: HTMLElement | string,
    to: R
  ): ConvertionQueryData[R] {
    return (
      to == "element"
        ? typeof element == "string"
          ? this.#toElement(element)
          : element
        : typeof element == "string"
        ? element
        : this.#toQuery(element)
    ) as ConvertionQueryData[R];
  }
  async methode<M extends keyof MethodTreeLinear<T>>(
    method: M,
    direction: HTMLElement | string = this.#parentRoot,
    timeout: number,
    limit: number,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    var element = direction;
    direction = this.convertTo(direction, "element");
    if (direction) {
      await this.#methode(method, direction, timeout, limit, ...data);
      this.history.push({
        event: method,
        content: [
          {
            data: this.json(direction),
            query:
              typeof element == "string" ? element : this.#toQuery(element),
          },
        ],
      });
    }
  }
  methodeSync<M extends keyof MethodTreeLinear<T>>(
    method: M,
    direction: HTMLElement | string = this.#parentRoot,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    var element = direction;
    direction = this.convertTo(direction, "element");

    if (direction) {
      this.#methodeSync(method, direction, ...data);
      this.history.push({
        event: method,
        content: [
          {
            data: this.json(direction),
            query:
              typeof element == "string" ? element : this.#toQuery(element),
          },
        ],
      });
    }
  }
  deleteSync(...directions: (HTMLElement | string)[]) {
    var content: HistoryEventTreeLinear<T>["content"] = [];
    directions.forEach((direction) => {
      var element = this.convertTo(direction, "element");
      if (element) {
        content.push({
          data: this.json(element),
          query: this.#toQuery(element),
        });
        this.#deleteSync(element);
      }
    });
    this.#history.push({ content, event: "delete" });
  }
  async delete(...directions: (HTMLElement | string)[]) {
    var content: HistoryEventTreeLinear<T>["content"] = [];
    for (let i = 0; i < directions.length; i++) {
      var element = this.convertTo(directions[i], "element");
      if (element) {
        content.push({
          data: this.json(element),
          query: this.#toQuery(element),
        });
        await this.#delete(element);
      }
    }
    this.#history.push({ content, event: "delete" });
  }
  sortSync(
    sortBy: keyof T,
    direction: SortedBy,
    element: HTMLElement,
    deep: boolean
  ) {
    this.#sortSync(sortBy, direction, element, deep);
  }
  async sort(
    key: keyof T,
    direction: SortedBy,
    element: HTMLElement | string,
    deep: boolean = true,
    timeout: number,
    limit: number
  ) {
    element = this.convertTo(element, "element");
    element &&
      (await this.#sort(key, direction, element, deep, timeout, limit));
  }
  json(...elements: HTMLElement[]) {
    var fn = (treeContent: tree<T & Row>): tree<T> => {
      var body: T = Object.create(null);
      this.#propertys.forEach((prop) => (body[prop] = treeContent.body[prop]));
      return {
        body,
        innerTree: treeContent.innerTree.map((content) => fn(content)),
      };
    };
    return elements.map((element) => fn(this.read(element)));
  }
  async copy() {
    var selectionElement = this.SELECT_ELEMENTS;
    var json = this.json(...selectionElement);
    await navigator.clipboard.writeText(JSON.stringify(json, undefined, 1));
    var content: HistoryEventTreeLinear<T>["content"] = json.map(
      (info, index) => {
        return {
          data: [info],
          query: this.#toQuery(selectionElement[index]),
        };
      }
    );
    this.#history.push({
      content,
      event: "copy",
    });
  }
  async paste() {
    var json = JSON.parse(await navigator.clipboard.readText());
    var array = (Array.isArray(json) ? json : [json]) as tree<T>[];
    var { SELECT_ELEMENTS } = this;
    var content: HistoryEventTreeLinear<T>["content"] = [];
    if (SELECT_ELEMENTS.length == array.length) {
      content = SELECT_ELEMENTS.map((ele, index) => {
        this.#insert(ele, 130, 2, array[index]);
        return {
          data: [array[index]],
          query: this.#toQuery(ele),
        };
      });
    } else if (SELECT_ELEMENTS.length) {
      content = SELECT_ELEMENTS.map((ele) => {
        this.#insert(ele, 130, 2, ...array);
        return {
          data: array,
          query: this.#toQuery(ele),
        };
      });
    } else {
      this.#insert(this.#parentRoot, 130, 2, ...array);
      content = [{ data: array, query: "" }];
    }
    if (content.length) this.#history.push({ content, event: "paste" });
  }
  async cut() {
    var elements = this.SELECT_ELEMENTS;
    var json = this.json(...elements);
    await navigator.clipboard.writeText(JSON.stringify(json, undefined, 1));
    await forEachAsync(elements, (ele) => this.#delete(ele), 130, 2);

    var content: HistoryEventTreeLinear<T>["content"] = json.map((data, i) => {
      return {
        data: [data],
        query: this.#toQuery(elements[i]),
      };
    });

    this.#history.push({ content, event: "cut" });
  }
  columns(propertys: (keyof T)[]) {
    var indexes = propertys.map((prop) => this.#propertys.indexOf(prop));

    return this.ITEMS.map((ele) => {
      var finded = Array.from(ele.children).find(
        (e) => e.getAttribute("role") == "row"
      );
      if (!finded) return [];
      ele = finded as HTMLElement;
      var columns = Array.from(ele.children).filter(
        (e) => e.getAttribute("role") == "col"
      ) as HTMLElement[];
      return indexes.map((i) => columns[i]);
    });
  }
  static create<R>(title: string, def: R): TreeLinear<HTMLDivElement, R> {
    var root = createElement("div", "", {});
    const tb = new this(
      root,
      title,
      Object.keys(def as object) as (keyof R)[],
      def
    );
    return tb;
  }
}
