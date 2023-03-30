import { TreeLinear } from "./lib/tree-linear.js"

var tr = TreeLinear.create("Explorer", { name: "New Directory", type: "folder" });

tr.hiddenPropertys = ["type"];

document.querySelector(".tree").appendChild(tr.root);

tr.setCallbackQuery((d) => `${d.name}`);

function getCssSass(name) {
  return [
    {
      body: {
        name: name + ".css",
        type: "file"
      },
    },
    {
      body: {
        name: name + ".map.css",
        type: "file"
      }
    },
    {
      body: {
        name: name + ".scss",
        type: "file"
      }
    }
  ]
}

function getJsTs(name) {
  return [
    {
      body: {
        name: name + ".js",
        type: "file",
      }
    },
    {
      body: {
        name: name + ".ts",
        type: "folder"
      }
    }
  ]
}

tr.methode("insert", undefined, 20, 1, {
  body: {
    name: "web"
  },
  innerTree:
    [
      {
        body: {
          name: "css",
        },
        innerTree: [
          ...getCssSass("custom"), ...getCssSass("main")
        ]
      },
      {
        body: {
          name: "lib"
        },
        innerTree: [
          ...getJsTs("delay"),
          ...getJsTs("graphe"),
          ...getJsTs("keyboard-shortcut"),
          ...getJsTs("listbox"),
          ...getJsTs("table"),
          ...getJsTs("toolbar"),
          ...getJsTs("tree-linear"),
          ...getJsTs("tree"),
          {
            body: { name: "tsconfig.json", type: "file" },
          },
          ...getJsTs("types"),
          ...getJsTs("utils"),
        ]
      },
      {
        body: {
          name: "index.html",
          type: "file"
        }
      },
      {
        body: {
          name: "script.js",
          type: "file"
        },
      }
    ]
}).then(() => {
})