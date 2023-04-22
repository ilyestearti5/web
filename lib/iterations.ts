import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { ListBox } from './listbox.js';
import { ToolBar } from './toolbar';
import { row } from './types.js';
import { createElement, defaultObject, forEachAsync, isLooked } from './utils.js';
export class Iterations<T> extends ListBox {
  public isloading: boolean = false;
  #hiddenPropertys: (keyof T)[] = [];
  public searcherKey: keyof T;
  protected histroy: [] = [];
  protected creationFunction: (contentElement: HTMLElement, input: T) => void = (ele, input: T) => {
    this.propertys.forEach(prop => {
      var columnElement = createElement('div', `${input[prop]}`, {
        'aria-labelby': prop,
      });
      columnElement.style.display = this.#hiddenPropertys.includes(prop) ? 'none' : '';
      ele.appendChild(columnElement);
    });
  };
  constructor(root: HTMLElement, title: string, public propertys: (keyof T)[] = [], public defaultValues: T) {
    super(root, title);
    this.root.tabIndex = 1;
    this.searcherKey = this.propertys[0];
    this.shortcuts.clipboard = {
      copy: Sh.create(`${this.title} copy`, `ctrl${Sh.separatorShortcuts}c`, [this.root], 'key').ondown(async () => this.configurations.clipboard && (await this.copy())),
      paste: Sh.create(`${this.title} paste`, `ctrl${Sh.separatorShortcuts}v`, [this.root], 'key').ondown(async () => this.configurations.clipboard && (await this.paste(2, 5))),
      cut: Sh.create(`${this.title} cut`, `ctrl${Sh.separatorShortcuts}x`, [this.root], 'key').ondown(async () => this.configurations.clipboard && (await this.cut())),
    };
    this.shortcuts.find = {
      forword: Sh.create(`${this.title}:find forword`, 'all', [this.root], 'key').ondown(({ keys }) => {
        if (!keys) return;
        var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
        if (!selecteddirection) return;
        var next = selecteddirection.nextElementSibling;
        while (next) {
          var content = `${this.readRow(next as HTMLElement)[this.searcherKey]}`.charAt(0).toUpperCase();
          if (this.getEffective(next as HTMLElement) && keys.includes(content)) break;
          next = next.nextElementSibling;
        }
        next && this.select(next as HTMLElement);
        if (next) {
          this.select();
          if (this.configurations.scrolling && !isLooked(next as HTMLElement)) this.scroll('forword');
        }
      }),
      backword: Sh.create(`${this.title}:find backword`, `shift${Sh.separatorShortcuts}all`, [this.root]).ondown(({ keys }) => {
        if (!keys) return;
        var selecteddirection = this.ELEMENT_DIRECTION || this.MIN_ELEMENT_EFFECTIVE;
        if (!selecteddirection) return;
        var prev = selecteddirection.previousElementSibling;
        while (prev) {
          var content = `${this.readRow(prev as HTMLElement)[this.searcherKey]}`.charAt(0).toUpperCase();
          if (this.getEffective(prev as HTMLElement) && keys.includes(content)) break;
          prev = prev.previousElementSibling;
        }
        prev && this.select(prev as HTMLElement);
        if (prev) {
          this.select();
          if (this.configurations.scrolling && !isLooked(prev as HTMLElement)) this.scroll('backword');
        }
      }),
    };
  }
  items(element: HTMLElement) {
    var contentElement = element.querySelector(`[role="content"]`);
    return !contentElement ? [] : (this.propertys.map(prop => contentElement!.querySelector(`[aria-labelby="${prop.toString()}"]`)!) as HTMLElement[]);
  }
  item(element: HTMLElement, column: keyof T) {
    var cols = this.items(element);
    var index = this.propertys.indexOf(column);
    return cols[index];
  }
  createRow(input: T): HTMLElement {
    // default value value
    input = defaultObject(input, this.defaultValues);
    // the row element
    var result = createElement('div', '', { role: this.rowname });
    // the level element
    var levelElement = createElement('div', '', { role: 'level' });
    // add the level element in the row
    result.appendChild(levelElement);
    // create content of row element such as (attributes || propertys)
    var contentElement = createElement('div', '', { role: 'content' });
    // methode of creation function
    this.creationFunction(contentElement, input);
    // add the content of row in the row element
    result.appendChild(contentElement);
    return result;
  }
  /**
   * read content of a element
   * @param element how needed to read
   * @returns object has keys is `propertys`
   * @example
    {
      name: "Akrem",
      age: 20
    }
   */
  readRow(element: HTMLElement): T & row {
    var result: T & row = Object.create(null);
    result.row = element;
    if (!element) return result;
    var cols = this.items(element);
    this.propertys.forEach((prop, index) => {
      Object.defineProperty(result, prop, {
        get() {
          var string = cols[index].innerHTML;
          return isNaN(+string) ? ((string = string.trim()) === 'true' || string === 'false' ? (string == 'true' ? true : false) : string) : +string;
        },
        set(v) {
          cols[index].innerHTML = `${v}`;
        },
        enumerable: false,
        configurable: true,
      });
    });
    return result;
  }
  /**
   * change som propertys to invisible propertys
   * link (password,id) and sow on....
   * @param props
   */
  setHiddenPropertys(...props: (keyof T)[]) {
    this.#hiddenPropertys = props;
    this.ITEMS.forEach(element => {
      var cols = this.items(element);
      var indexs = this.#hiddenPropertys.map(prop => this.propertys.indexOf(prop));
      cols.forEach((col, index) => (col.style.display = indexs.includes(index) ? 'none' : ''));
    });
  }
  /**
   * get all rows elements
   */
  override get ITEMS() {
    return super.ITEMS.filter(ele => ele.getAttribute('role') == this.rowname);
  }
  /**
   * create new line
   */
  line() {}
  /**
   * copy data
   @example
    [
      {
        name: "Akrem",
        age: 20
      },
      {
        name: "Anes",
        age: 15
      },
    ]
    // this value is gonna be exists in the clipboard
    // if you go to a input element you gonna be show this values 
   */
  async copy() {}
  async cut() {}
  async paste(timeout: number, limit: number): Promise<(T & row)[]> {
    return [];
  }
  /**
   * get object of ower element
   */
  json(element: HTMLElement): T {
    var o: T = Object.create(null);
    var items = this.items(element);
    this.propertys.forEach((prop, index) => {
      var innerHTML = items[index].innerHTML;
      o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML) as T[keyof T];
    });
    return o;
  }
  /**
   * create new instanceof the Iterartions
   * @param title represent the title of the iterations of your object
   * @param defaultValue
   * @returns
   */
  static create<R>(title: string, defaultValue: R): Iterations<R> {
    var root = createElement('div', '', { role: 'iterations' });
    var iterable = new this(root, title, Object.keys(defaultValue as object) as (keyof R)[], defaultValue);
    return iterable;
  }
  throwLoading() {
    if (this.isloading) throw Error('cannot be update the content is stay loading...');
  }
  override setTargetShortcut(targets: HTMLElement[] | null = null): void {
    super.setTargetShortcut(targets);
    this.shortcuts.find!.forword.targets = targets;
    this.shortcuts.find!.backword.targets = targets;
    this.shortcuts.clipboard!.copy.targets = targets;
    this.shortcuts.clipboard!.cut.targets = targets;
    this.shortcuts.clipboard!.paste.targets = targets;
  }
  filterSync(callback: (input: T & row) => boolean) {
    this.throwLoading();
    return this.ITEMS.filter(element => {
      var b = callback(this.readRow(element));
      this.setShow(element, b);
      return b;
    });
  }
  async filter(callback: (input: T & row) => boolean, timeout: number, limit: number) {
    this.throwLoading();
    this.isloading = true;
    var result: (T & row)[] = [];
    await forEachAsync(
      this.ITEMS.map(ele => this.readRow(ele)),
      input => {
        var b = callback(input);
        if (b) result.push(input);
        this.setShow(input.row, b);
      },
      timeout,
      limit,
    );
    this.isloading = false;
    return result;
  }
}
