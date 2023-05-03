import { createElement } from './utils.js';
import { pathOfSwitch } from './types.js';
import { Table } from './table.js';
export class Switch {
  #viewElement: HTMLElement;
  #paths: pathOfSwitch[] = [];
  #links: Table<{ path: string }>;
  private onfunctionschange: Function[] = [];
  constructor(
    public readonly title: string,
    viewElement: HTMLElement = createElement('div', '', {}),
  ) {
    this.#viewElement = viewElement;
    this.#links = Table.create(this.title, { path: ' - ' });
    document.addEventListener('click', ({ target }) => {
      if (!target) return;
      var finded = (target as HTMLElement).closest(`*[path]`) as HTMLElement;
      if (!finded) return;
      var [switch_title, path_content] = finded
        .getAttribute('path')!
        .split(':');
      if (switch_title != this.title) return;
      this.set(path_content);
    });
    this.#links.onsubmit((e, element) => {
      var data = this.#links.readRow(element);
      this.set(data.path);
    });
  }
  get links() {
    return this.#links;
  }
  get viewElement() {
    return this.#viewElement;
  }
  get paths() {
    return new Set(this.#paths.map(({ path }) => path));
  }
  get elements() {
    return new Set(this.#paths.map(({ element }) => element));
  }
  get selected() {
    var selected = Array.from(this.elements).find(e => e.ariaCurrent == 'true');
    return selected ? selected.ariaValueText : null;
  }
  get(path: string, element: HTMLElement) {
    if (this.paths.has(path))
      throw Error('cannot use two path has diffrent element');
    this.#paths.push({ path, element });
    element.ariaCurrent = `false`;
    element.ariaValueText = `${path}`;
    this.#links.methodeSync('append', [{ path }]);
    return this;
  }
  set(path: string) {
    if (this.selected == path) return;
    var finded = this.#paths.find(({ path: p }) => path == p);
    if (!finded) {
      console.warn(
        Error(
          `the path '${path}' is not defined tray defined by 'get' methode`,
        ),
      );
      return this;
    }
    this.#viewElement.innerHTML = '';
    this.#viewElement.appendChild(finded.element);
    this.elements.forEach(ele => (ele.ariaCurrent = 'false'));
    finded.element.ariaCurrent = 'true';
    var data = this.#links.DATA;
    var index = data.map(({ path }) => path).indexOf(path);
    if (index >= 0) this.#links.select(data[index].row);
    this.onfunctionschange.forEach(fn => fn());
    return this;
  }
  onchange(listener: Function) {
    typeof listener == 'function' && this.onfunctionschange.push(listener);
    return this;
  }
  offchange(listener: Function) {
    var index = this.onfunctionschange.indexOf(listener);
    if (index < 0) return false;
    this.onfunctionschange.splice(index, 1);
    return true;
  }
  static fromElement(element: HTMLElement, title: string = `${element.ariaLabel}`) {
    if(element.tagName.toLowerCase() != "switch") return null;
    var switchElement = element;
    var result = new Switch(title);
    var cases = Array.from(switchElement.children) as HTMLElement[];
    cases.forEach(caseElement => {
      var itemElement = createElement('div', '', {});
      itemElement.append(...Array.from(caseElement.children));
      result.get(`${caseElement.getAttribute('path')}`, itemElement);
    });
    switchElement.replaceWith(result.#viewElement);
    return result;
  }
}
