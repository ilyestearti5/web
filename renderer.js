import { KeyboardShortcut } from "./lib/index.js";
import { Tree } from "./lib/tree.js"
const tr = Tree.create("list", { name: "", type: "parent" });
document.body.appendChild(tr.root);
tr.setcallbackquery((d) => `${d.x}`);
tr.setsubtreepropertys({ property: 'type', value: "parent" })
tr.sethiddenpropertys("type");
tr.methodeSync("insert", "", [{
  body: {
    name: "abdel kader",
  },
  innerTree: [
    {
      body: { name: "leila", },
      innerTree: [
        { body: { name: "othman", type: "child" }, },
        {
          body: {
            name: "rania",
            type: "child"
          }
        }
      ]
    },
    {
      body: {
        name: "aymen",
        type: "child"
      }
    },
    {
      body: {
        name: "abdel allah",
        type: "child"
      },
    },
    {
      body: {
        name: "ilyes",
        type: "child"
      }
    }
  ]
}])
tr.searcherKey = "name";