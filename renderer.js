import { Tree } from "./lib/tree.js"
const tr = Tree.create("list", { name: "" });
document.body.appendChild(tr.root);
tr.setcallbackquery((d) => `${d.x}`);
tr.methodeSync("insert", "", [{
  body: {
    name: "abdel kader",
  },
  innerTree: [
    {
      body: {
        name: "leila",
      },
      innerTree: [
        {
          body: {
            name: "othman"
          },
        },
        {
          body: {
            name: "rania"
          }
        }
      ]
    },
    {
      body: {
        name: "aymen",
      }
    },
    {
      body: {
        name: "abdel allah",
      },
    },
    {
      body: {
        name: "ilyes",
      }
    }
  ]
}])