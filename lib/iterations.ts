import { KeyboardShortcut } from "./keyboardshortcuts.js";
import { ListBox } from "./listbox.js";
import { row } from "./types";
import { createElement, defaultObject, isLooked } from "./utils";

export class Iterations<T> extends ListBox {
  public isloading: boolean = false;
  #hiddenPropertys: (keyof T)[] = [];
  public searcherKey: keyof T;
  protected histroy: [] = [];
  constructor(
    root: HTMLElement,
    title: string,
    public propertys: (keyof T)[] = [],
    public defaultValues: T
  ) {
    super(root, title);
    this.root.tabIndex = 1;
    this.searcherKey = this.propertys[0];
    this.shortcuts.clipboard = {
      copy: KeyboardShortcut.create(
        `${this.title} copy`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}C`,
        [this.root]
      ).ondown(async () => {
        this.configurations.clipboard && (await this.copy());
      }),
      paste: KeyboardShortcut.create(
        `${this.title} paste`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}V`,
        [this.root]
      ).ondown(async () => {
        this.configurations.clipboard && (await this.paste());
      }),
      cut: KeyboardShortcut.create(
        `${this.title} cut`,
        `Ctrl${KeyboardShortcut.separatorShortcuts}X`,
        [this.root]
      ).ondown(async () => {
        this.configurations.clipboard && (await this.cut());
      }),
    };
    this.shortcuts.find = {
      forword: KeyboardShortcut.create(
        `${this.title} find - forword -`,
        `All`,
        [this.root]
      ).ondown(({ Keys }) => {
        if (!Keys) return;
        var ky = KeyboardShortcut.keyOf(Keys[0]);
        var selecteddirection =
          this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
        if (!selecteddirection) return;
        var next = selecteddirection.nextElementSibling;
        while (next) {
          if (
            this.getEffective(next as HTMLElement) &&
            `${
              this.readrow(next as HTMLElement)[this.searcherKey]
            }`[0].toUpperCase() === ky
          )
            break;
          next = next.nextElementSibling;
        }
        next && this.select(next as HTMLElement);
        next &&
          this.configurations.scrolling &&
          !isLooked(next as HTMLElement) &&
          this.scroll("forword");
      }),
      backword: KeyboardShortcut.create(
        `${this.title} find - backword - `,
        `Shift${KeyboardShortcut.separatorShortcuts}All`,
        [this.root]
      ).ondown(({ Keys }) => {
        if (!Keys) return;
        var ky = KeyboardShortcut.keyOf(Keys[0]);
        var selecteddirection =
          this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
        if (!selecteddirection) return;
        var prev = selecteddirection.previousElementSibling;
        while (prev) {
          if (
            this.getEffective(prev as HTMLElement) &&
            `${
              this.readrow(prev as HTMLElement)[this.searcherKey]
            }`[0].toUpperCase() === ky
          )
            break;
          prev = prev.previousElementSibling;
        }
        prev && this.select(prev as HTMLElement);
        prev &&
          this.configurations.scrolling &&
          !isLooked(prev as HTMLElement) &&
          this.scroll("backword");
      }),
    };
  }
  columns(element: HTMLElement) {
    return Array.from(
      element.querySelectorAll(`[role="content"] > [role="column"]`)
    ) as HTMLElement[];
  }
  column(element: HTMLElement, column: keyof T) {
    var cols = this.columns(element);
    var index = this.propertys.indexOf(column);
    return cols[index];
  }
  createrow(input: T): HTMLElement {
    input = defaultObject(input, this.defaultValues);
    var result = createElement("div", "", { role: this.rowname });
    var levelElement = createElement("div", "", { role: "level" });
    result.appendChild(levelElement);
    var contentElement = createElement("div", "", { role: "content" });
    this.propertys.forEach((prop, index) => {
      var columnElement = createElement("div", `${input[prop]}`, {
        role: "column",
      });
      columnElement.style.display = this.#hiddenPropertys.includes(prop)
        ? "none"
        : "";
      contentElement.appendChild(columnElement);
    });
    result.appendChild(contentElement);
    return result;
  }
  readrow(element: HTMLElement): T & row {
    var result: T & row = Object.create(null);
    result.row = element;
    var cols = this.columns(element);
    this.propertys.forEach((prop, index) => {
      Object.defineProperty(result, prop, {
        get() {
          var string = cols[index].innerHTML;
          return isNaN(+string) ? string : +string;
        },
        set(v) {
          cols[index].innerHTML = v;
        },
        enumerable: false,
        configurable: true,
      });
    });
    return result;
  }
  sethiddenpropertys(...props: (keyof T)[]) {
    this.#hiddenPropertys = props;
    this.ITEMS.forEach((element) => {
      var cols = this.columns(element);
      var indexs = this.#hiddenPropertys.map((prop) =>
        this.propertys.indexOf(prop)
      );
      cols.forEach(
        (col, index) =>
          (col.style.display = indexs.includes(index) ? "none" : "")
      );
    });
  }
  override get ITEMS() {
    return super.ITEMS.filter((ele) => ele.role == this.rowname);
  }
  line() {}
  async copy() {}
  async cut() {}
  async paste() {}
  json(element: HTMLElement): T {
    var o: T = Object.create(null);
    var columns = this.columns(element);
    this.propertys.forEach((prop, index) => {
      var innerHTML = columns[index].innerHTML;
      o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML) as T[keyof T];
    });
    return o;
  }
  static create<R>(title: string, defaultValue: R) {
    var root = createElement("div", "", { role: "iterations" });
    var iterable = new this(
      root,
      title,
      Object.keys(defaultValue as object) as (keyof R)[],
      defaultValue
    );
    return iterable;
  }
  throwLoading() {
    if (this.isloading)
      throw Error("cannot be update the content is stay loading...");
  }
  override settargetsshortcuts(targets: HTMLElement[] | null = null): void {
    super.settargetsshortcuts(targets);
    this.shortcuts.find!.forword.targets = targets;
    this.shortcuts.find!.backword.targets = targets;
    this.shortcuts.clipboard!.copy.targets = targets;
    this.shortcuts.clipboard!.cut.targets = targets;
    this.shortcuts.clipboard!.paste.targets = targets;
  }
}
