import { ListBox } from "./listbox.js";
import { createElement } from "./utils.js";
import { ConfigurationToolBar } from "./types.js";

export class ToolBar<T> extends ListBox<HTMLElement> {
  #types: (keyof T)[] = [];
  constructor(title: string, ...types: (keyof T)[]) {
    var root = createElement("ul", "", {});
    super(root, title);
    this.#types = types;
    this.root.setAttribute("role", "toolbar");
  }
  get types() {
    return this.#types;
  }
  findTip<S extends keyof T>(label: S): ConfigurationToolBar<S> | null {
    var element = this.ITEMS.find((content) => content.ariaLabel == label);
    return element
      ? {
          label,
          click: element.onclick,
          element: element as HTMLAnchorElement,
          iconElement: element.querySelector("i")! as HTMLElement,
        }
      : null;
  }
  addTip(label: keyof T, click: (e: MouseEvent) => void) {
    var fdTip = this.findTip(label);

    if (fdTip) throw Error(`The Label ${label.toString()} is defined`);

    var element = createElement("li", `<i></i>`, {
      "aria-label": label,
    });
    this.root.appendChild(element);
    element.onclick = click;
  }
  removeTip(label: keyof T) {
    this.findTip(label)?.element.remove();
  }
  exec(label: keyof T) {
    var find = this.findTip(label);
    if (!find) return;
    find.element.click();
  }
}
