import { KeyboardShortcut } from "./keyboard-shortcuts.js";
import { ListBox } from "./listbox.js";
import { Row, ConvertionQueryData , tree , CallBackQuery, MethodTreeLinear } from "./types.js";
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
  #callbackQuery: CallBackQuery<T> = (d: T, i: number) => `${i}`;
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
  #getWritable() {
    return this.#writable;
  }
  #setWritable(flag: boolean) {
    this.#writable = Boolean(flag);
  }
  getWritable() {
    return this.#getWritable();
  }
  setWritable(flag: boolean = true) {
    this.#setWritable(flag);
  }
  get DATA() {
    return this.read().innerTree;
  }
  get ITEMS() {
    return super.ITEMS.slice(1);
  }
  getCallbackQuery() {
    return this.#callbackQuery;
  }
  setCallbackQuery(callback: CallBackQuery<T>) {
    this.#callbackQuery = callback;
  }
  createRow(feild: T, level: number) {
    feild = defaultObject(feild, this.defProp);
    const result = createElement("div", "", {
      role: "treeitem",
      "aria-level": level,
    });
    var row = createElement("div", "", { role: "row" });
    result.appendChild(row);
    this.#propertys.forEach((prop) => {
      var col = createElement("span", `${feild[prop]}`, { role: "col" });
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
  innerTree(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    return this.#innerTree(element);
  }
  outerTree(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    return this.#outerTree(element);
  }
  #open(element: HTMLElement) {
    this.#innerTree(element).forEach((ele) => {
      ele.style.display = "";
      if (ele.hasAttribute("inneropened")) {
        ele.removeAttribute("inneropened");
        this.#open(ele);
      }
    });
  }
  #close(element: HTMLElement) {
    this.#innerTree(element).forEach((ele) => {
      ele.style.display = "none";
      if (this.#isOpend(ele)) {
        ele.setAttribute("inneropened", "");
        this.#close(ele);
      } else ele.removeAttribute("inneropened");
    });
  }
  open(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#open(element);
  }
  close(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#close(element);
  }
  #isOpend(element: HTMLElement) {
    return this.#innerTree(element).every(
      (ele) => ele.style.display !== "none"
    );
  }
  isOpend(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#isOpend(element);
  }
  #isClosed(element: HTMLElement) {
    return this.#innerTree(element).every(
      (ele) => ele.style.display === "none"
    );
  }
  isClosed(element: HTMLElement | string) {
    element = this.convertTo(element, "element");
    this.#isClosed(element);
  }
  #toQuery(element: HTMLElement = this.#parentRoot): string {
    var outer = this.#outerTree(element);

    var inner = outer ? this.#innerTree(outer) : [];

    var index = inner.indexOf(element);

    return (
      (outer ? this.#toQuery(outer) + "/" : "") +
      this.#callbackQuery(this.readRow(element), index)
    );
  }
  #toElement(query: string) {
    var array = query.split("/");

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
  async #append(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: T[]
  ) {
    var lvl = this.#getLevel(element) + 1;
    var inner = this.#innerTree(element);
    element = inner.length ? inner[inner.length - 1] : element;

    await forEachAsync(
      data.reverse(),
      (d) => {
        element.after(this.createRow(d, lvl));
      },
      timeout,
      limit
    );
  }
  #appendSync(element: HTMLElement, ...data: T[]) {
    var lvl = this.#getLevel(element) + 1;
    var inner = this.#innerTree(element);
    element = inner.length ? inner[inner.length - 1] : element;

    data.reverse().forEach((d) => element.after(this.createRow(d, lvl)));
  }
  async #after(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: T[]
  ) {
    var lvl = this.#getLevel(element);

    var inner = this.#innerTree(element);

    while (inner.length) {
      element = inner[inner.length - 1];
      inner = this.#innerTree(element);
    }

    await forEachAsync(
      data.reverse(),
      (d) => element.after(this.createRow(d, lvl)),
      timeout,
      limit
    );
  }
  #afterSync(element: HTMLElement, ...data: T[]) {
    var lvl = this.#getLevel(element);

    var inner = this.#innerTree(element);

    while (inner.length) {
      element = inner[inner.length - 1];
      inner = this.#innerTree(element);
    }

    data.reverse().forEach((d) => element.after(this.createRow(d, lvl)));
  }
  async #before(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: T[]
  ) {
    var lvl = this.#getLevel(element);

    await forEachAsync(
      data,
      (d) => element.before(this.createRow(d, lvl)),
      timeout,
      limit
    );
  }
  #beforeSync(element: HTMLElement, ...data: T[]) {
    var lvl = this.#getLevel(element);

    data.forEach((d) => element.before(this.createRow(d, lvl)));
  }
  // -----------------------------------------------------------------------------------
  #insertSync(element: HTMLElement, ...tree: tree<T>[]) {
    var level = this.#getLevel(element) + 1;
    tree.forEach(({ body, innerTree }) => {
      var ele = this.createRow(body, level);

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
    await forEachAsync(
      tree,
      async ({ body, innerTree }) => {
        var ele = this.createRow(body, level);

        var inner = this.#innerTree(element);
        var mainElement = inner.length ? inner[inner.length - 1] : element;

        mainElement.after(ele);

        Array.isArray(innerTree) &&
          innerTree.length &&
          (await this.#insert(ele, timeout, limit, ...innerTree));
      },
      timeout,
      limit
    );
  }
  async #methode<M extends keyof MethodTreeLinear<T>>(
    name: M,
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    switch (name) {
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
  async methode<M extends keyof MethodTreeLinear<T>>(
    method: M,
    direction: HTMLElement | string = this.#parentRoot,
    timeout: number,
    limit: number,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    direction = this.convertTo(direction, "element");
    direction &&
      (await this.#methode(method, direction, timeout, limit, ...data));
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
  methodeSync<M extends keyof MethodTreeLinear<T>>(
    method: M,
    direction: HTMLElement | string = this.#parentRoot,
    ...data: MethodTreeLinear<T>[M][]
  ) {
    direction = this.convertTo(direction, "element");
    direction && this.#methodeSync(method, direction, ...data);
  }
  async delete(direction: HTMLElement | string) {
    var element = this.convertTo(direction, "element");
    element && (await this.#delete(element));
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
    await navigator.clipboard.writeText(
      JSON.stringify(this.json(...this.SELECT_ELEMENTS), undefined, 1)
    );
  }
  async paste() {
    var content = JSON.parse(await navigator.clipboard.readText());
    var array = (Array.isArray(content) ? content : [content]) as tree<T>[];
    var last = this.LAST_ELEMENT_SELECT;
    console.log(last);
    last
      ? this.#insert(last, 200, 2, ...array)
      : this.#insert(this.#parentRoot, 20, 2, ...array);
  }
  async cut() {
    var elements = this.SELECT_ELEMENTS;
    await navigator.clipboard.writeText(
      JSON.stringify(this.json(...elements), undefined, 1)
    );
    await forEachAsync(elements, (ele) => this.#delete(ele), 20, 1);
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
