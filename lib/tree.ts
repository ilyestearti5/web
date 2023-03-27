import { ListBox } from "./listbox";
import { Row } from "./types";
import { createElement, defaultObject } from "./utils";

export class Tree<T, U extends HTMLElement> extends ListBox<U> {
  #propertys: (keyof T)[] = [];

  #writable: boolean = false;

  constructor(root: U, title: string, propertys: (keyof T)[], public def: T) {
    super(root, title);
    this.#propertys = propertys;
    this.root.setAttribute("role", "tree");
  }

  get ITEMS(): HTMLElement[] {
    return Array.from(this.root.querySelectorAll("[role=row]"));
  }
  createItem(info: T): HTMLElement {
    info = defaultObject(info, this.def);

    var result = createElement("div", "", { role: "tree-item" });

    var row = createElement("div", "", { role: "row" });

    this.#propertys.forEach((prop) => {
      var span = createElement("span", `${info[prop]}`, { role: "col" });

      span.ondblclick = () => {
        if (!this.#writable) return;
        span.contentEditable = "true";
        span.focus();
      };

      span.onblur = () => {
        if (!this.#writable) return;
        span.contentEditable = "false";
      };

      row.appendChild(span);
    });

    var innerTree = createElement("div", "", { role: "tree" });

    result.appendChild(row);
    result.appendChild(innerTree);

    return result;
  }
  #getBody(element: HTMLElement): (T & Row) | null {
    var fd = this.#bodyElement(element);
    if (!fd) return null;
    var o: T & Row = Object.create(null);

    o.row = fd;

    var columns = Array.from(fd.children).filter((ele) => ele.role == "col");

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
  #bodyElement(element: HTMLElement): HTMLElement | null {
    var elements = Array.from(element.children) as HTMLElement[];
    var fd = elements.find((ele) => ele.role == "row");
    return fd ? fd : null;
  }
  #innerTreeElement(element: HTMLElement): HTMLElement | null {
    var elements = Array.from(element.children) as HTMLElement[];
    var fd = elements.find((ele) => ele.role == "tree");
    return fd ? fd : null;
  }
  #inner(element: HTMLElement): (T & Row)[] {
    var innerTree = this.#innerTreeElement(element);
    if (!innerTree) return [];
    var inner = Array.from(innerTree.children) as HTMLElement[];
    return inner.map((ele) => this.#getBody(ele)!);
  }
  #to_query(element: HTMLElement): string {
    var string = "";
    return string;
  }
}
