import { Delay } from './delay.js';
import { Iterations } from './iterations.js';
import { row, methodesTableMap, timer, orderBy } from './types.js';
import { forEachAsync, createElement } from './utils.js';
export class Table<T> extends Iterations<T> {
  constructor(root: HTMLElement, title: string, propertys: (keyof T)[] = [], defaultValue: T) {
    super(root, title, propertys, defaultValue);
    this.root.setAttribute('role', 'table');
    this.rowname = 'row';
  }
  get DATA(): (T & row)[] {
    return this.ITEMS.map(element => this.readRow(element));
  }
  get EFFECTIVE_DATA(): (T & row)[] {
    return this.EFFECTIVE_ELEMENTS.map(element => this.readRow(element));
  }
  get SELECTED_DATA(): (T & row)[] {
    return this.SELECTD_ELEMENTS.map(element => this.readRow(element));
  }
  protected appendSync(data: T[]) {
    return data.map(input => {
      var row = this.createRow(input);
      this.root.appendChild(row);
      return this.readRow(row);
    });
  }
  protected async append(data: T[], timeout: timer<T>, limit: number) {
    var result: (T & row)[] = [];
    await forEachAsync(
      data,
      input => {
        var row = this.createRow(input);
        this.root.appendChild(row);
        result.push(this.readRow(row));
      },
      timeout,
      limit,
    );
    return result;
  }
  protected prependSync(data: T[]) {
    return data.map(input => {
      var row = this.createRow(input);
      this.root.prepend(row);
      return this.readRow(row);
    });
  }
  protected async prepend(data: T[], timeout: timer<T>, limit: number) {
    var result: (T & row)[] = [];
    await forEachAsync(
      data,
      input => {
        var row = this.createRow(input);
        this.root.appendChild(row);
        result.push(this.readRow(row));
      },
      timeout,
      limit,
    );
    return result;
  }
  protected afterSync(element: HTMLElement, data: T[]) {
    var result: (T & row)[] = [];
    data.reverse().forEach(input => {
      const row = this.createRow(input);
      element.after(row);
      result.unshift(this.readRow(row));
    });
    return result;
  }
  protected async after(element: HTMLElement, data: T[], timeout: timer<T>, limit: number) {
    var result: (T & row)[] = [];
    await forEachAsync(
      data.reverse(),
      input => {
        const row = this.createRow(input);
        element.after(row);
        result.unshift(this.readRow(row));
      },
      timeout,
      limit,
    );
    return result;
  }
  protected beforeSync(element: HTMLElement, data: T[]) {
    return data.map(input => {
      const row = this.createRow(input);
      element.before(row);
      return this.readRow(row);
    });
  }
  protected async before(element: HTMLElement, data: T[], timeout: timer<T>, limit: number) {
    var result: (T & row)[] = [];
    await forEachAsync(
      data,
      input => {
        const row = this.createRow(input);
        element.before(row);
        result.push(this.readRow(row));
      },
      timeout,
      limit,
    );
    return result;
  }
  override async copy() {
    if (!this.configurations.clipboard) throw Error('cannot use the clipboard shortcuts');
    var selectedData = this.SELECTD_ELEMENTS.map(element => this.json(element));
    await navigator.clipboard.writeText(JSON.stringify(selectedData, undefined, 1));
  }
  override async cut() {
    if (!this.configurations.clipboard) throw Error('cannot use the clipboard shortcuts');
    var selectedData = this.SELECTD_ELEMENTS.map(element => {
      element.remove();
      return this.json(element);
    });
    await navigator.clipboard.writeText(JSON.stringify(selectedData, undefined, 1));
  }
  override async paste(timeout: number, limit: number): Promise<(T & row)[]> {
    if (!this.configurations.clipboard) throw Error('cannot use the clipboard shortcuts');
    var array = Array.from(JSON.parse(await navigator.clipboard.readText())) as T[];
    var { SELECTD_ELEMENTS: selectedElement, LAST_ELEMENT_SELECT: lastSelectedElement } = this;
    var result: (T & row)[] = [];
    var div = array.length / selectedElement.length;
    if (div >= 1 && div == parseInt(`${div}`)) forEachAsync(selectedElement, (element, index) => result.push(...this.afterSync(element, array.slice(index * div, (index + 1) * div))), timeout, limit);
    else if (selectedElement.length) forEachAsync(selectedElement, element => result.push(...this.afterSync(element, array)), timeout, limit);
    else result.push(...(await this.append(array, timeout, limit)));
    return result;
  }
  protected sortSync(by: keyof T, to: orderBy = 'DESC') {
    var allData = this.DATA;
    for (let i = 0; i < allData.length; i++) {
      var body = allData[i];
      var j = i - 1;
      var prev = body.row.previousElementSibling;
      while (prev && (to == 'DESC' ? this.readRow(prev as HTMLElement)[by] > body[by] : this.readRow(prev as HTMLElement)[by] < body[by])) {
        prev = prev.previousElementSibling;
        allData[j + 1] = allData[j];
        j--;
      }
      !prev ? this.root.prepend(body.row) : prev.after(body.row);
      allData[j + 1] = body;
    }
  }
  protected async sort(by: keyof T, to: orderBy = 'DESC', timeout: number, limit: number) {
    var allData = this.DATA;
    var dl = new Delay(timeout);
    for (let i = 0; i < allData.length; i++) {
      if (!(i % limit)) await dl.on();
      var body = allData[i];
      var j = i - 1;
      var prev = body.row.previousElementSibling;
      while (prev && (to == 'DESC' ? this.readRow(prev as HTMLElement)[by] > body[by] : this.readRow(prev as HTMLElement)[by] < body[by])) {
        prev = prev.previousElementSibling;
        allData[j + 1] = allData[j];
        j--;
      }
      !prev ? this.root.prepend(body.row) : prev.after(body.row);
      allData[j + 1] = body;
    }
  }
  async methode<R extends keyof methodesTableMap<T>>(methode: R, input: methodesTableMap<T>[R], element: HTMLElement = this.ITEMS[0], timeout: number, limit: number) {
    this.throwLoading();
    this.isloading = true;
    var result: (T & row)[] = [];
    switch (methode) {
      case 'after': {
      }
      case 'before': {
        result = await this[methode as 'after' | 'before'](element, input as methodesTableMap<T>['after'], timeout, limit);
        break;
      }
      case 'prepend': {
      }
      case 'append': {
        result = await this[methode as 'prepend' | 'append'](input as methodesTableMap<T>['append'], timeout, limit);
        break;
      }
      case 'sort': {
        var { by, direction } = input as methodesTableMap<T>['sort'];
        await this.sort(by, direction, timeout, limit);
      }
    }
    this.isloading = false;
    return result;
  }
  methodeSync<R extends keyof methodesTableMap<T>>(methode: R, input: methodesTableMap<T>[R], element: HTMLElement = this.ITEMS[0]) {
    this.throwLoading();
    this.isloading = true;
    var result: (T & row)[] = [];
    switch (methode) {
      case 'after': {
      }
      case 'before': {
        result = this[`${methode as 'after' | 'before'}Sync`](element, input as methodesTableMap<T>['after']);
        break;
      }
      case 'prepend': {
      }
      case 'append': {
        result = this[`${methode as 'prepend' | 'append'}Sync`](input as methodesTableMap<T>['append']);
        break;
      }
      case 'sort': {
        var { by, direction } = input as methodesTableMap<T>['sort'];
        this.sortSync(by, direction);
      }
    }
    this.isloading = false;
    return result;
  }
  override line() {
    var ele = createElement('div', '', { role: 'line' });
    this.root.appendChild(ele);
  }
  static override create<R>(title: string, defaultValue: R): Table<R> {
    return super.create(title, defaultValue) as Table<R>;
  }
  static override title(title: string) {
    return (this.all.find(({ title: t }) => title == t) as Table<any>) || null;
  }
}
