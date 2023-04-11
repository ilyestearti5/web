import { KeyboardShortcut } from "./lib/keyboardshortcuts.js";
import { range } from "./lib/utils.js";
import { TreeLinear } from "./lib/treelinear.js"
const tr = TreeLinear.create("Explorer", {
  name: "None",
  inner: 0
})
document.body.prepend(tr.root);
tr.setcallbackquery((d) => d.name);
tr.sethiddenpropertys("inner");
tr.setsubtreepropertys({ property: "inner", value: 1 });

tr.methode("append", "", [
  {
    name: "Web",
    inner: 1
  }
]).then(async () => {
  await tr.methode("append", "Web", [
    {
      name: "Css",
      inner: 1
    },
    {
      name: "Js",
      inner: 1
    },
    {
      name: "index.html",
    }
  ])
  await tr.methode("append", "Web/Css", [
    {
      name: "main.scss",
    },
    {
      name: "main.css.map",
    },
    {
      name: "main.css"
    }
  ])
  await tr.methode("append", "Web/Js", [
    {
      name: "main.js",
    },
    {
      name: "main.ts"
    }
  ])
})
