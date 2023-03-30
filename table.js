import { Table } from "./lib/table.js"
import { range } from "./lib/utils.js";

const table = Table.create("Data Base", { x: "" })

document.querySelector(".table").appendChild(table.root);

table.append(20, 1, ...range(100, 0).map((x) => { return { x } })).then(() => {
    var data = table.DATA;
    table.effective(...range(100, 0, 2).map((i) => data[i].row))
});
