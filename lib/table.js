import { Delay } from "./delay";
import { Iterations } from "./iterations";
import { forEachAsync, createElement } from "./utils";
export class Table extends Iterations {
    constructor(root, title, propertys = [], defaultValue) {
        super(root, title, propertys, defaultValue);
        this.root.role = "table";
        this.rowname = "row";
    }
    get DATA() {
        return this.ITEMS.map((element) => this.readrow(element));
    }
    get EFFECTIVE_DATA() {
        return this.EFFECTIVE_ELEMENTS.map((element) => this.readrow(element));
    }
    get SELECTED_DATA() {
        return this.SELECTD_ELEMENTS.map((element) => this.readrow(element));
    }
    appendSync(data) {
        return data.map((input) => {
            var row = this.createrow(input);
            this.root.appendChild(row);
            return this.readrow(row);
        });
    }
    async append(data, timeout, limit) {
        var result = [];
        await forEachAsync(data, (input) => {
            var row = this.createrow(input);
            this.root.appendChild(row);
            result.push(this.readrow(row));
        }, timeout, limit);
        return result;
    }
    prependSync(data) {
        return data.map((input) => {
            var row = this.createrow(input);
            this.root.prepend(row);
            return this.readrow(row);
        });
    }
    async prepend(data, timeout, limit) {
        var result = [];
        await forEachAsync(data, (input) => {
            var row = this.createrow(input);
            this.root.appendChild(row);
            result.push(this.readrow(row));
        }, timeout, limit);
        return result;
    }
    afterSync(element, data) {
        var result = [];
        data.reverse().forEach((input) => {
            const row = this.createrow(input);
            element.after(row);
            result.unshift(this.readrow(row));
        });
        return result;
    }
    async after(element, data, timeout, limit) {
        var result = [];
        await forEachAsync(data.reverse(), (input) => {
            const row = this.createrow(input);
            element.after(row);
            result.unshift(this.readrow(row));
        }, timeout, limit);
        return result;
    }
    beforeSync(element, data) {
        return data.map((input) => {
            const row = this.createrow(input);
            element.before(row);
            return this.readrow(row);
        });
    }
    async before(element, data, timeout, limit) {
        var result = [];
        await forEachAsync(data, (input) => {
            const row = this.createrow(input);
            element.before(row);
            result.push(this.readrow(row));
        }, timeout, limit);
        return result;
    }
    async copy() {
        if (!this.configurations.clipboard)
            return;
        var selectedData = this.SELECTD_ELEMENTS.map((element) => this.json(element));
        await navigator.clipboard.writeText(JSON.stringify(selectedData, undefined, 1));
    }
    async cut() {
        if (!this.configurations.clipboard)
            return;
        var selectedData = this.SELECTD_ELEMENTS.map((element) => {
            element.remove();
            this.json(element);
        });
        await navigator.clipboard.writeText(JSON.stringify(selectedData));
    }
    async paste() {
        var array = Array.from(JSON.parse(await navigator.clipboard.readText()));
        var { SELECTD_ELEMENTS: selectedElement, LAST_ELEMENT_SELECT: lastSelectedElement, } = this;
        var modulo = array.length % selectedElement.length;
        if (modulo)
            selectedElement.forEach((element, index) => {
                this.after(element, array.slice(index * modulo, (index + 1) * modulo), 100, 1);
            });
        else if (selectedElement.length)
            selectedElement.forEach((element) => {
                this.after(element, array, 100, 1);
            });
        else
            this.append(array, 100, 1);
    }
    sortSync(by, to = "down") {
        var allData = this.DATA;
        for (let i = 0; i < allData.length; i++) {
            var body = allData[i];
            var j = i - 1;
            var prev = body.row.previousElementSibling;
            while (prev &&
                (to == "down"
                    ? this.readrow(prev)[by] > body[by]
                    : this.readrow(prev)[by] < body[by])) {
                prev = prev.previousElementSibling;
                allData[j + 1] = allData[j];
                j--;
            }
            !prev ? this.root.prepend(body.row) : prev.after(body.row);
            allData[j + 1] = body;
        }
    }
    async sort(by, to = "down", timeout, limit) {
        var allData = this.DATA;
        var dl = new Delay(timeout);
        for (let i = 0; i < allData.length; i++) {
            if (!(i % limit))
                await dl.on();
            var body = allData[i];
            var j = i - 1;
            var prev = body.row.previousElementSibling;
            while (prev &&
                (to == "down"
                    ? this.readrow(prev)[by] > body[by]
                    : this.readrow(prev)[by] < body[by])) {
                prev = prev.previousElementSibling;
                allData[j + 1] = allData[j];
                j--;
            }
            !prev ? this.root.prepend(body.row) : prev.after(body.row);
            allData[j + 1] = body;
        }
    }
    async methode(methode, input, element, timeout, limit) {
        this.throwLoading();
        this.isloading = true;
        var result = [];
        switch (methode) {
            case "after": {
            }
            case "before": {
                result = await this[methode](element, input, timeout, limit);
                break;
            }
            case "prepend": {
            }
            case "append": {
                result = await this[methode](input, timeout, limit);
                break;
            }
            case "sort": {
                var { by, direction } = input;
                await this.sort(by, direction, timeout, limit);
            }
        }
        this.isloading = false;
        return result;
    }
    methodeSync(methode, input, element) {
        this.throwLoading();
        this.isloading = true;
        var result = [];
        switch (methode) {
            case "after": {
            }
            case "before": {
                result = this[`${methode}Sync`](element, input);
                break;
            }
            case "prepend": {
            }
            case "append": {
                result = this[`${methode}Sync`](input);
                break;
            }
            case "sort": {
                var { by, direction } = input;
                this.sortSync(by, direction);
            }
        }
        this.isloading = false;
        return result;
    }
    line() {
        var ele = createElement("div", "", { role: "line" });
        this.root.appendChild(ele);
    }
    static create(title, defaultValue) {
        return super.create(title, defaultValue);
    }
}
