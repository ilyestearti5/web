
import { TreeLinear } from "./lib/tree-linear.js"

var tr = TreeLinear.create("Explorer", { name: "No Provied", type: "folder" });

document.body.appendChild(tr.root);

tr.hiddenPropertys = ["type"];

tr.setCallbackQuery((d) => `${d.name}`);

tr.methodeSync("append", undefined, { name: "My Frame Work" });

tr.methodeSync("append", "My Frame Work", { name: "lib" }, { name: "css" }, { name: "web" })
tr.methodeSync("append", "My Frame Work", { name: "lib" }, { name: "css" }, { name: "web" });
tr.methodeSync("append", "My Frame Work/lib", { name: "delay.ts", type: "file" }, { name: "delay.js", type: "file" })

// tr.insertSync("My Frame Work/web",
//     { body: { name: "index.html", type: "file" } },
//     {
//         body: { name: "css" },
//         innerTree: [{ body: { name: "main.css", type: "file" } }, { body: { name: "main.scss", type: "file" } }]
//     }
// )