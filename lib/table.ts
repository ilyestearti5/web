import { ListBox } from "./listbox.js";
import { createElement, defaultObject, forEachAsync } from "./utils.js";
import { MethodeTable, Row, SortedBy } from "./types.js";
import { Delay } from "./delay.js";
import { KeyboardShortcut } from "./keyboard-shortcuts.js";

export class Table<S extends HTMLElement, T> extends ListBox<S> {
  #propertys: (keyof T)[] = [];
  #writable: boolean = true;
  #hiddenPropertys: (keyof T)[] = [];
  #writingShortcut: KeyboardShortcut = KeyboardShortcut.create(
    `${this.title} - write`,
    `Ctrl${KeyboardShortcut.separatorShortcuts}Enter`,
    null
  ).ondown(() => {
    if (!this.root.contains(document.activeElement)) return;
    (document.activeElement as HTMLElement)?.blur();
  });
  constructor(
    root: S,
    title: string,
    propertys: (keyof T)[],
    public defProp: T
  ) {
    super(root, title);
    this.#propertys = propertys;
    this.root.setAttribute("role", "table");
    this.root.tabIndex = -1;
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
  get DATA(): (T & Row)[] {
    return this.ITEMS.map((data) => this.readRow(data));
  }
  get DATA_SELECT(): (T & Row)[] {
    return this.SELECT_ELEMENTS.map((element) => this.readRow(element));
  }
  get DATA_EFFECTIVE(): (T & Row)[] {
    return this.EFFECTIVE_ELEMENTS.map((element) => this.readRow(element));
  }
  #getWritable() {
    return this.#writable;
  }
  #setWritable(flag: boolean) {
    this.#writable = Boolean(flag);
  }
  #createRow(config: T) {
    config = defaultObject(config, this.defProp);
    const result = createElement("div", "", {
      role: "row",
      draggable: this.dragging,
    });

    this.#propertys.forEach((prop) => {
      var span = createElement("span", `${config[prop]}`, {
        role: "col",
      });
      span.style.display = this.#hiddenPropertys.includes(prop) ? "none" : "";
      span.ondblclick = () => {
        if (!this.#writable) return;
        span.contentEditable = "true";
        span.focus();
      };
      span.onblur = () => {
        if (!this.#writable) return;
        span.contentEditable = "false";
      };
      result.appendChild(span);
    });

    return result;
  }
  #appendSync(...info: T[]) {
    info.forEach((data) => {
      var row = this.#createRow(data);
      this.root.appendChild(row);
    });
  }
  async #append(timeout: number, limit: number, ...info: T[]) {
    await forEachAsync(
      info,
      (data) => {
        var row = this.#createRow(data);
        this.root.appendChild(row);
      },
      timeout,
      limit
    );
  }
  #prependSync(...info: T[]) {
    info.reverse().forEach((data) => {
      var row = this.#createRow(data);
      this.root.prepend(row);
    });
  }
  async #prepend(timeout: number, limit: number, ...info: T[]) {
    await forEachAsync(
      info.reverse(),
      (data) => {
        var row = this.#createRow(data);
        this.root.prepend(row);
      },
      timeout,
      limit
    );
  }
  #insertSync(element: HTMLElement, ...info: T[]) {
    info.reverse().forEach((data) => {
      var row = this.#createRow(data);
      element.after(row);
    });
  }
  async #insert(
    element: HTMLElement,
    timeout: number,
    limit: number,
    ...info: T[]
  ) {
    forEachAsync(
      info.reverse(),
      (data) => {
        var row = this.#createRow(data);
        element.after(row);
      },
      timeout,
      limit
    );
  }
  #methodeSync<R extends keyof MethodeTable<T>>(
    event: R,
    config: MethodeTable<T>[R]
  ) {
    var { data } = config;
    switch (event) {
      case "insert": {
        var { element } = config as MethodeTable<T>["insert"];
        this.#insertSync(element, ...data);
      }
      case "append": {
        this.#appendSync(...data);
        break;
      }
      case "prepend": {
        this.#prependSync(...data);
        break;
      }
    }
  }
  async #methode<R extends keyof MethodeTable<T>>(
    timeout: number,
    limit: number,
    event: R,
    config: MethodeTable<T>[R]
  ) {
    var { data } = config;
    switch (event) {
      case "insert":
      case "append": {
        await this.#append(timeout, limit, ...data);
        break;
      }
      case "prepend": {
        await this.#prepend(timeout, limit, ...data);
        break;
      }
      case "insert": {
        var { element } = config as MethodeTable<T>["insert"];
        await this.#insert(element, timeout, limit, ...data);
      }
    }
  }
  #deleteSync(callback: (data: T & Row, index: number) => boolean) {
    return this.DATA.filter(callback).map((data) => {
      data.row.remove();
      return data;
    });
  }
  async #delete(
    timeout: number,
    limit: number,
    callback: (data: T & Row, index: number) => boolean
  ) {
    var array: (T & Row)[] = [];
    await forEachAsync(
      this.ITEMS,
      (element, index) => {
        var data = this.readRow(element);
        if (callback(data, index)) {
          data.row.remove();
          array.push(data);
        }
      },
      timeout,
      limit
    );
    return array;
  }
  #filterSync(callback: (data: T & Row, index: number) => boolean) {
    return this.DATA.filter((data, index) => {
      var a = callback(data, index);
      data.row.style.display = a ? "" : "none";
      this.setEffective(data.row, a);
      return a;
    });
  }
  async #filter(
    timeout: number,
    limit: number,
    callback: (data: T & Row, index: number) => boolean
  ) {
    var array: (T & Row)[] = [];
    await forEachAsync(
      this.ITEMS,
      (element, index) => {
        var data = this.readRow(element);
        var a = callback(data, index);
        data.row.style.display = a ? "" : "none";
        this.setEffective(data.row, a);
        a && array.push(data);
      },
      timeout,
      limit
    );
    return array;
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
  addTarget(...elements: HTMLElement[]) {
    this.shortcuts.move.forword.targets?.push(...elements);
    this.shortcuts.move.backword.targets?.push(...elements);
    this.shortcuts.selection.forword.targets?.push(...elements);
    this.shortcuts.selection.backword.targets?.push(...elements);
    this.shortcuts.clipboard?.copy.targets?.push(...elements);
    this.shortcuts.clipboard?.paste.targets?.push(...elements);
    this.shortcuts.clipboard?.cut.targets?.push(...elements);
  }
  readRow(element: HTMLElement) {
    var o: T & Row = Object.create(null);

    o.row = element;

    var columns = Array.from(element.children).filter(
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
  methodeSync<R extends keyof MethodeTable<T>>(
    event: R,
    config: MethodeTable<T>[R]
  ) {
    this.#methodeSync(event, config);
  }
  async methode<R extends keyof MethodeTable<T>>(
    timeout: number,
    limit: number,
    event: R,
    config: MethodeTable<T>[R]
  ) {
    await this.#methode(timeout, limit, event, config);
  }
  sortSync(by: keyof T, type: SortedBy = "down") {
    var data = this.DATA;
    var length = data.length;
    for (let i = 0; i < length; i++) {
      var info = data[i];
      var prec = info.row as HTMLElement;
      while (
        prec &&
        (type == "down"
          ? info[by] <= this.readRow(prec)[by]
          : info[by] >= this.readRow(prec)[by])
      )
        prec = prec.previousElementSibling as HTMLElement;
      prec ? prec.after(info.row) : this.root.prepend(info.row);
    }
  }
  async sort(
    by: keyof T,
    type: SortedBy = "down",
    timeout: number = 200,
    limit: number = 1
  ) {
    var time = new Delay(timeout);
    var data = this.DATA;
    var length = data.length;
    for (let i = 0; i < length; i++) {
      if (i % limit == 0) await time.on();
      var info = data[i];
      var prec = info.row as HTMLElement;
      while (
        prec &&
        (type == "down"
          ? info[by] <= this.readRow(prec)[by]
          : info[by] >= this.readRow(prec)[by])
      )
        prec = prec.previousElementSibling as HTMLElement;
      prec ? prec.after(info.row) : this.root.prepend(info.row);
    }
  }
  deleteSync(callback: (data: T & Row, index: number) => boolean) {
    return this.#deleteSync(callback);
  }
  async delete(
    timeout: number,
    limit: number,
    callback: (data: T & Row, index: number) => boolean
  ) {
    return await this.#delete(timeout, limit, callback);
  }
  filterSync(callback: (data: T & Row, index: number) => boolean) {
    return this.#filterSync(callback);
  }
  async filter(
    timeout: number,
    limit: number,
    callback: (data: T & Row, index: number) => boolean
  ) {
    return this.#filter(timeout, limit, callback);
  }
  columns(propertys: (keyof T)[]) {
    var indexes = propertys.map((prop) => this.#propertys.indexOf(prop));
    return this.ITEMS.map((ele) => {
      var columns = Array.from(ele.children).filter(
        (e) => e.getAttribute("role") == "col"
      ) as HTMLElement[];
      return indexes.map((i) => columns[i]);
    });
  }
  json(...data: (T & Row)[]) {
    return data.map((info) => {
      var result: T = Object.create(null);
      this.#propertys.forEach((prop) => (result[prop] = info[prop]));
      return result;
    });
  }
  async copy() {
    await navigator.clipboard.writeText(
      JSON.stringify(this.json(...this.DATA_SELECT))
    );
  }
  async paste() {
    const { SELECT_ELEMENTS } = this;
    var content = JSON.parse(await navigator.clipboard.readText());
    var array = (Array.isArray(content) ? content : [content]) as T[];
    var last = this.LAST_ELEMENT_SELECT;
    const length = SELECT_ELEMENTS.length;
    if (length == array.length)
      SELECT_ELEMENTS.forEach((ele, i) => this.#insert(ele, 20, 2, array[i]));
    else if (SELECT_ELEMENTS.length)
      SELECT_ELEMENTS.forEach((ele) => this.#insert(ele, 20, 2, ...array));
    else this.#append(20, 2, ...array);
  }
  async cut() {
    var data = this.DATA_SELECT;
    await navigator.clipboard.writeText(JSON.stringify(this.json(...data)));
    await forEachAsync(data, ({ row }) => row.remove(), 20, 1);
  }
  static create<R>(title: string, def: R): Table<HTMLDivElement, R> {
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
