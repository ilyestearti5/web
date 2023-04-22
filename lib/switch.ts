import { Table } from './table.js';
import { createElement } from './utils.js';
export class Switch extends Table<{ label: string }> {
  #viewElement = createElement('div', '', { role: 'views' });
  #switchElement = createElement('div', '', { role: 'switch' });
  #querys: Set<HTMLElement> = new Set(null);
  constructor(title: string) {
    const root = createElement('div', '', {});
    super(root, `switch:${title}`, ['label'], { label: '-' });
    this.#switchElement.appendChild(root);
    this.#switchElement.appendChild(this.#viewElement);
    this.configurations.selection = false;
    this.configurations.redirect = false;
    // clear all when shortcut you make shore is d'ont usable before
    this.shortcuts.selection.all.clear('down');
    this.shortcuts.selection.forword.clear('down');
    this.shortcuts.selection.backword.clear('down');
    this.shortcuts.selection.fullforword.clear('down');
    this.shortcuts.selection.fullbackword.clear('down');
    this.onsubmit((type, ele) => {
      var lbl = this.readRow(ele).label;
      if (this.selected == lbl) return;
      this.set(lbl);
    });
  }
  get view() {
    return this.#viewElement;
  }
  get switch() {
    return this.#switchElement;
  }
  get(path: string, element: HTMLElement) {
    if (path == 'no selected item') throw Error("cannot be use label 'no selected item' is usable for confiurations ");
    element.setAttribute('aria-valuenow', path);
    this.#querys.add(element);
    this.appendSync([{ label: path }]);
  }
  delete(path: string) {
    var finded = Array.from(this.#querys).find(element => element.ariaValueNow == path);
    if (finded) {
      this.#querys.delete(finded);
      var finded2 = this.DATA.find(d => d.label == path);
      if (finded2) finded2.row.remove();
    }
  }
  set(path: string) {
    var finded = this.DATA.find(({ label }) => label == path);
    if (finded) {
      this.select(finded.row);
      this.#querys.forEach(ele => {
        if (ele.ariaValueNow == path) {
          this.#viewElement.appendChild(ele);
          ele.ariaLive = 'true';
        } else {
          ele.remove();
          ele.ariaLive = 'false';
        }
      });
    }
  }
  get querys() {
    return Array.from(this.#querys);
  }
  get selectedView() {
    var fd = this.querys.find(ele => ele.ariaLive == 'true');
    return fd ? fd : null;
  }
  get selected() {
    const fd = this.selectedView;
    return fd ? fd.ariaValueNow : 'no selected item';
  }
}
