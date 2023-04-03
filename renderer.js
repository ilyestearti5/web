import { TreeLinear } from "./lib/index.js"
const tree = TreeLinear.create("Explorer", { name: "No Provied", type: "folder" });
document.body.appendChild(tree.root);
tree.setsubtreepropertys({ property: "type", value: "folder" });
tree.setHiddenPropertys("type");
tree.methodeSync("append", "", [{ name: "New Folder" }]);
tree.setcallbackquery(({ name }) => `${name}`);
tree.methodeSync("insert", "New Folder", [{ body: { name: "Lib" }, innerTree: [{ body: { name: "index.js", type: "file" } }] }]);