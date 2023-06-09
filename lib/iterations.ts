import { KeyboardShortcut as Sh } from './keyboardshortcuts.js';
import { ListBox } from './listbox.js';
import { row, creationFunction, dataReading } from './types.js';
import { createElement as crt, defaultObject as defO, forEachAsync as each, isLooked as like } from './utils.js';
export class Iterations<T> extends ListBox {
  public isloading: boolean = false;
  private hiddenPropertys: (keyof T)[] = [];
  public searcherKey: keyof T;
  protected histroy: [] = [];
  protected readSetFn: dataReading<T>['set'] = (c, p, v): void => {
    c.innerHTML = v;
  };
  protected readGetFn: dataReading<T>['get'] = (c, p): number | string | boolean => {
    var string = c.innerText;
    return isNaN(+string) ? ((string = string.trim()) === 'true' || string === 'false' ? (string == 'true' ? true : false) : string) : +string;
  };
  protected creationFunction: creationFunction<T> = (input, c) => {
    return this.propertys.map(prop => {
      var columnElement = c(prop);
      columnElement.style.display = this.hiddenPropertys.includes(prop) ? 'none' : '';
      return columnElement;
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
          if (this.configurations.scrolling && !like(next as HTMLElement)) this.scroll('forword');
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
          if (this.configurations.scrolling && !like(prev as HTMLElement)) this.scroll('backword');
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
    input = defO(input, this.defaultValues);
    var result = crt('div', '', { role: this.rowname });
    if (this.drag) result.draggable = true;
    var levelElement = crt('div', '', {
      role: 'level',
      style: 'position: relative; height: 100%',
    });
    result.appendChild(levelElement);
    var contentElement = crt('div', '', { role: 'content' });
    var array = this.creationFunction(
      input,
      type => {
        var ele = crt('span', `${typeof input[type] == 'function' ? (input[type] as (input: T) => string)(input) : input[type]}`, { 'aria-labelby': type.toString() });
        if (this.hiddenPropertys.includes(type)) ele.style.display = 'none';
        return ele;
      },
      result,
      contentElement,
    );
    contentElement.append(...array);
    result.appendChild(contentElement);
    var rd = this.readRow(result);
    this.propertys.forEach(s => (rd[s] = rd[s]));
    return result;
  }
  readRow(element: HTMLElement): T & row {
    var result: T & row = Object.create(null);
    result.row = element;
    if (!element) return result;
    var cols = this.items(element);
    var array: Function[] = [];
    for (let Prop in this.defaultValues) typeof this.defaultValues[Prop] == 'function' && array.push(this.defaultValues[Prop] as Function);
    var fn1 = this.readGetFn;
    var fn2 = this.readSetFn;
    this.propertys.forEach((prop, index) => {
      Object.defineProperty(result, prop, {
        get() {
          return fn1(cols[index], prop);
        },
        set(v) {
          fn2(cols[index], prop, `${v}`);
          array.forEach(fn => fn(result));
        },
        enumerable: false,
        configurable: true,
      });
    });
    return result;
  }
  setHiddenPropertys(...props: (keyof T)[]) {
    this.hiddenPropertys = props;
    this.ITEMS.forEach(element => {
      var cols = this.items(element);
      var indexs = this.hiddenPropertys.map(prop => this.propertys.indexOf(prop));
      cols.forEach((col, index) => (col.style.display = indexs.includes(index) ? 'none' : ''));
    });
    return this;
  }
  override get ITEMS() {
    return super.ITEMS.filter(ele => ele.getAttribute('role') == this.rowname);
  }
  addLine(element = this.ITEMS.at(-1), num: number = 1) {
    var array: HTMLDivElement[] = [];
    if (element) {
      for (let i = 0; i < num; i++) {
        var line = crt('div', '', { role: 'line' });
        array.push(line);
        element.after(line);
        element = line;
      }
    }
    return array;
  }
  removeLine(element = this.ITEMS.at(-1) || null) {
    if (element) {
      while (element) {
        var next = element.nextElementSibling;
        element.remove();
        element = (next ? (next.getAttribute('role') == 'line' ? next : null) : null) as HTMLElement | null;
      }
    }
  }
  async copy() {}
  async cut() {}
  async paste(timeout: number, limit: number): Promise<(T & row)[]> {
    return [];
  }
  json(element: HTMLElement): T {
    var o: T = Object.create(null);
    var items = this.items(element);
    this.propertys.forEach((prop, index) => {
      var innerHTML = items[index].innerHTML;
      o[prop] = (isNaN(+innerHTML) ? innerHTML : +innerHTML) as T[keyof T];
    });
    return o;
  }
  static create<R>(title: string, defaultValue: R): Iterations<R> {
    var root = crt('div', '', { role: 'iterations' });
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
    await each(
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
  setCreationFunction(fn: creationFunction<T>) {
    this.creationFunction = fn;
    // this.ITEMS.forEach(rowElement => {});
    return this;
  }
  setGetReadingFunction(fn: dataReading<T>['get']) {
    this.readGetFn = fn;
  }
  setSetReadingFunction(fn: dataReading<T>['set']) {
    this.readSetFn = fn;
  }
}
