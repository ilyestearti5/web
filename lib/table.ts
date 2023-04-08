import { Delay } from "./delay";
import { Iterations } from "./iterations";
import { row, methodesTableMap } from "./types";
import { forEachAsync, createElement } from "./utils";

export class Table<T> extends Iterations<T> {
    constructor(
      root: HTMLElement,
      title: string,
      propertys: (keyof T)[] = [],
      defaultValue: T
    ) {
      super(root, title, propertys, defaultValue);
      this.root.role = "table";
      this.rowname = "row";
    }
    get DATA(): (T & row)[] {
      return this.ITEMS.map((element) => this.readrow(element));
    }
    get EFFECTIVE_DATA(): (T & row)[] {
      return this.EFFECTIVE_ELEMENTS.map((element) => this.readrow(element));
    }
    get SELECTED_DATA(): (T & row)[] {
      return this.SELECTD_ELEMENTS.map((element) => this.readrow(element));
    }
    protected appendSync(data: T[]) {
      return data.map((input) => {
        var row = this.createrow(input);
        this.root.appendChild(row);
        return this.readrow(row);
      });
    }
    protected async append(
      data: T[],
      timeout: number | ((value: T, index: number) => number),
      limit: number
    ) {
      var result: (T & row)[] = [];
      await forEachAsync(
        data,
        (input) => {
          var row = this.createrow(input);
          this.root.appendChild(row);
          result.push(this.readrow(row));
        },
        timeout,
        limit
      );
      return result;
    }
    protected prependSync(data: T[]) {
      return data.map((input) => {
        var row = this.createrow(input);
        this.root.prepend(row);
        return this.readrow(row);
      });
    }
    protected async prepend(
      data: T[],
      timeout: number | ((value: T, index: number) => number),
      limit: number
    ) {
      var result: (T & row)[] = [];
      await forEachAsync(
        data,
        (input) => {
          var row = this.createrow(input);
          this.root.appendChild(row);
          result.push(this.readrow(row));
        },
        timeout,
        limit
      );
      return result;
    }
    protected afterSync(element: HTMLElement, data: T[]) {
      var result: (T & row)[] = [];
      data.reverse().forEach((input) => {
        const row = this.createrow(input);
        element.after(row);
        result.unshift(this.readrow(row));
      });
      return result;
    }
    protected async after(
      element: HTMLElement,
      data: T[],
      timeout: number | ((value: T, index: number) => number),
      limit: number
    ) {
      var result: (T & row)[] = [];
      await forEachAsync(
        data.reverse(),
        (input) => {
          const row = this.createrow(input);
          element.after(row);
          result.unshift(this.readrow(row));
        },
        timeout,
        limit
      );
      return result;
    }
    protected beforeSync(element: HTMLElement, data: T[]) {
      return data.map((input) => {
        const row = this.createrow(input);
        element.before(row);
        return this.readrow(row);
      });
    }
    protected async before(
      element: HTMLElement,
      data: T[],
      timeout: number | ((value: T, index: number) => number),
      limit: number
    ) {
      var result: (T & row)[] = [];
      await forEachAsync(
        data,
        (input) => {
          const row = this.createrow(input);
          element.before(row);
          result.push(this.readrow(row));
        },
        timeout,
        limit
      );
      return result;
    }
    override async copy() {
      if (!this.configurations.clipboard) return;
      var selectedData = this.SELECTD_ELEMENTS.map((element) =>
        this.json(element)
      );
      await navigator.clipboard.writeText(
        JSON.stringify(selectedData, undefined, 1)
      );
    }
    override async cut() {
      if (!this.configurations.clipboard) return;
      var selectedData = this.SELECTD_ELEMENTS.map((element) => {
        element.remove();
        this.json(element);
      });
      await navigator.clipboard.writeText(JSON.stringify(selectedData));
    }
    override async paste() {
      var array = Array.from(
        JSON.parse(await navigator.clipboard.readText())
      ) as T[];
      var {
        SELECTD_ELEMENTS: selectedElement,
        LAST_ELEMENT_SELECT: lastSelectedElement,
      } = this;
      var modulo = array.length % selectedElement.length;
      if (modulo)
        selectedElement.forEach((element, index) => {
          this.after(
            element,
            array.slice(index * modulo, (index + 1) * modulo),
            100,
            1
          );
        });
      else if (selectedElement.length)
        selectedElement.forEach((element) => {
          this.after(element, array, 100, 1);
        });
      else this.append(array, 100, 1);
    }
    protected sortSync(by: keyof T, to = "down") {
      var allData = this.DATA;
      for (let i = 0; i < allData.length; i++) {
        var body = allData[i];
        var j = i - 1;
        var prev = body.row.previousElementSibling;
        while (
          prev &&
          (to == "down"
            ? this.readrow(prev as HTMLElement)[by] > body[by]
            : this.readrow(prev as HTMLElement)[by] < body[by])
        ) {
          prev = prev.previousElementSibling;
          allData[j + 1] = allData[j];
          j--;
        }
        !prev ? this.root.prepend(body.row) : prev.after(body.row);
        allData[j + 1] = body;
      }
    }
    protected async sort(
      by: keyof T,
      to = "down",
      timeout: number,
      limit: number
    ) {
      var allData = this.DATA;
      var dl = new Delay(timeout);
      for (let i = 0; i < allData.length; i++) {
        if (!(i % limit)) await dl.on();
        var body = allData[i];
        var j = i - 1;
        var prev = body.row.previousElementSibling;
        while (
          prev &&
          (to == "down"
            ? this.readrow(prev as HTMLElement)[by] > body[by]
            : this.readrow(prev as HTMLElement)[by] < body[by])
        ) {
          prev = prev.previousElementSibling;
          allData[j + 1] = allData[j];
          j--;
        }
        !prev ? this.root.prepend(body.row) : prev.after(body.row);
        allData[j + 1] = body;
      }
    }
    async methode<R extends keyof methodesTableMap<T>>(
      methode: R,
      input: methodesTableMap<T>[R],
      element: HTMLElement,
      timeout: number,
      limit: number
    ) {
      this.throwLoading();
      this.isloading = true;
      var result: (T & row)[] = [];
      switch (methode) {
        case "after": {
        }
        case "before": {
          result = await this[methode as "after" | "before"](
            element,
            input as methodesTableMap<T>["after"],
            timeout,
            limit
          );
          break;
        }
        case "prepend": {
        }
        case "append": {
          result = await this[methode as "prepend" | "append"](
            input as methodesTableMap<T>["append"],
            timeout,
            limit
          );
          break;
        }
        case "sort": {
          var { by, direction } = input as methodesTableMap<T>["sort"];
          await this.sort(by, direction, timeout, limit);
        }
      }
      this.isloading = false;
      return result;
    }
    methodeSync<R extends keyof methodesTableMap<T>>(
      methode: R,
      input: methodesTableMap<T>[R],
      element: HTMLElement
    ) {
      this.throwLoading();
      this.isloading = true;
      var result: (T & row)[] = [];
      switch (methode) {
        case "after": {
        }
        case "before": {
          result = this[`${methode as "after" | "before"}Sync`](
            element,
            input as methodesTableMap<T>["after"]
          );
          break;
        }
        case "prepend": {
        }
        case "append": {
          result = this[`${methode as "prepend" | "append"}Sync`](
            input as methodesTableMap<T>["append"]
          );
          break;
        }
        case "sort": {
          var { by, direction } = input as methodesTableMap<T>["sort"];
          this.sortSync(by, direction);
        }
      }
      this.isloading = false;
      return result;
    }
    override line() {
      var ele = createElement("div", "", { role: "line" });
      this.root.appendChild(ele);
    }
    static override create<R>(title: string, defaultValue: R): Table<R> {
      return super.create(title, defaultValue) as Table<R>;
    }
  }
  