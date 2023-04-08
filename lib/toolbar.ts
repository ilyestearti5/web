import { ListBox } from "./listbox";
import { configurationToolBar } from "./types";
import { createElement } from "./utils";

export class ToolBar<T> extends ListBox {
    #types: (keyof T)[] = [];
    /**
     * suport google font icons from https://fonts.google.com/icons
     */
    constructor(title: string, ...types: (keyof T)[]) {
      var root = createElement("ul", "", {});
      super(root, title);
      this.#types = types;
      this.root.role = "toolbar";
      this.configurations.scrolling = true;
      this.configurations.selection = true;
    }
    get types() {
      return this.#types;
    }
    findTip<S extends keyof T>(label: S): configurationToolBar<S> | null {
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
    addTip(
      label: keyof T,
      iconName: string,
      click: (e: MouseEvent) => void,
      outlined: boolean = false
    ) {
      var fdTip = this.findTip(label);
      if (fdTip) throw Error(`The Label ${label.toString()} is defined`);
      var c = outlined ? "material-symbols-outlined" : "material-icons";
      var element = createElement("li", `<i class="${c}">${iconName}</i>`, {
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