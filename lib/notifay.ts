import { ListBox } from "./listbox.js";
import { submitListener } from "./types.js";
import { createElement } from "./utils.js";

export class Notification<T> extends ListBox<HTMLElement> {
  static #notificationElement: HTMLElement = createElement("div", "", {
    role: "notifications",
  });
  #element: HTMLElement = createElement("div", "", {
    role: "notification",
    tabindex: "1",
  });
  #docElement: HTMLElement = createElement("div", "", {
    role: "doc-notification",
  });
  public titleElement: HTMLElement = createElement("div", "", {
    role: "title-notification",
  });
  constructor(title: string, public buttons: (keyof T)[]) {
    var root: HTMLElement = createElement("div", "", {});
    super(root, `notification : ${title}`);
    this.titleElement.innerHTML = `<span>NOTIFICATION</span> : ${title}`;
    this.#element.append(this.titleElement, this.#docElement, root);
    this.removeTarget(root);
    this.addTarget(this.#element);
    this.setConfigurations({
      movable: true,
      selection: false,
      scrolling: false,
      redirect: true,
    });
    this.shortcuts.move.forword.change("ArrowRight");
    this.shortcuts.move.backword.change("ArrowLeft");
    this.shortcuts.selection.forword.change("Shift+ArrowRight");
    this.shortcuts.selection.backword.change("Shift+ArrowLeft");
    this.setMouse(true);
  }
  get status() {
    return Notification.#notificationElement.contains(this.#element);
  }
  get doc() {
    return this.#docElement.innerText;
  }
  set doc(v: string) {
    this.#docElement.innerHTML = v;
  }
  static start() {
    document.body.appendChild(this.#notificationElement);
  }
  close() {
    this.#element.remove();
  }
  open(): Promise<keyof T> {
    Notification.#notificationElement.appendChild(this.#element);
    this.root.innerHTML = this.buttons
      .map((btn) => `<button>${btn.toString()}</button>`)
      .join("\n");
    this.#element.focus();
    return new Promise((res, rej) => {
      var fn: submitListener = (type, element) => {
        res(element.innerText as keyof T);
        this.close();
        this.offsubmit(fn);
      };
      this.onsubmit(fn);
    });
  }
  static get notifays() {
    return this.all.filter(({ title }) =>
      title.startsWith("`notification : `")
    );
  }
}
