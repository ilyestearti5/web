import { KeyboardShortcut } from "./lib/keyboard-shortcuts.js";
import { Table } from "./lib/table.js"
import { range } from "./lib/utils.js";

const table = Table.create("Data Base", { x: "" })

window.table = table;

document.querySelector(".table").appendChild(table.root);

table.methode(20, 1, "append", { data: range(100, 0).map((x) => { return { x } }) }).then(() => {
    var data = table.DATA;
    table.effective(...range(100, 0, 2).map((i) => data[i].row))
});



KeyboardShortcut.create("SORT DATA", "Ctrl+Shift+D", null).ondown(() => {

    table.sort("x", "up", 10, 1);

})