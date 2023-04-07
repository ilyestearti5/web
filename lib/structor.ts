import { Table, row } from "./index.js";
import { createElement, defaultObject } from "./utils.js";
type creationFunction<T> = (property: keyof T) => HTMLElement;
export class Structror<T> extends Table<T> {
  #creationFunction:
    | ((create: creationFunction<T>) => HTMLElement[])
    | undefined = undefined;
  constructor(
    root: HTMLElement,
    title: string,
    propertys: (keyof T)[],
    defaultValues: T
  ) {
    super(root, title, propertys, defaultValues);
    this.rowname = "row";
  }
  override createrow(input: T): HTMLElement {
    input = defaultObject(input,this.defaultValues);
    const element = createElement("div", "", { role: this.rowname });
    if (this.#creationFunction) {
      element.append(
        ...this.#creationFunction((property: keyof T) => {
          const span = createElement("span", `${input[property]}`, {
            "aria-labelledby": property.toString(),
          });
          return span;
        })
      );
    }
    return element;
  }
  override readrow(element: HTMLElement): T & row {
    var o: T & row = Object.create(null);
    o.row = element;
    this.propertys.forEach((prop) => {
      var readyelement = element.querySelector(
        `[aria-labelledby="${prop.toString()}"]`
      )!;
      Object.defineProperty(o, prop, {
        set(v: string | number) {
          readyelement.innerHTML = `${v}`;
        },
        get(): string | number {
          var content = readyelement.innerHTML;
          return isNaN(+content) ? content : +content;
        },
        configurable: true,
        enumerable: false,
      });
    });
    return o;
  }
  setcreationfunction(
    creation: ((create: creationFunction<T>) => HTMLElement[]) | undefined
  ) {
    this.#creationFunction = creation;
  }
  static override create<R>(title: string, defaultValue: R): Structror<R> {
    return super.create(title, defaultValue) as Structror<R>;
  }
}
