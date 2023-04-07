import { KeyboardShortcut, Table, ToolBar } from "./lib/index.js"
import { between, range } from "./lib/utils.js";
var isOpend = (ele) => ele.style.display !== "none";
var toggle = (ele) => (ele.style.display = isOpend(ele) ? "none" : "");
KeyboardShortcut.keyboardKeys
// add keyboards shortcuts to app
KeyboardShortcut.create("close window", "Ctrl+W", null).ondown((cmb, keyboard) => {
  keyboard && keyboard.preventDefault();
  window.close();
})
KeyboardShortcut.create("toggle tabs clients", "Ctrl+B", null).ondown((cmb, keyboard) => {
  keyboard && keyboard.preventDefault();
  toggle(tabsClientsElement);
})
KeyboardShortcut.create("toggle search products", "Ctrl+Space", [document.getElementById("products-input-search")]).ondown((cmb, keyboard) => {
  keyboard && keyboard.preventDefault();
  toggle(tableFindedProductsElement);
})
KeyboardShortcut.create("close search products", "Escape", [document.getElementById("products-input-search")]).ondown((cmb, keyboard) => {
  keyboard && keyboard.preventDefault();
  isOpend(tableFindedProductsElement) && toggle(tableFindedProductsElement);
})
// main components in app
const tableClientProductsElement = document.querySelector(".products-get-client");
const tabsClientsElement = document.querySelector(".clients-tabs");
const windowControlsElement = document.querySelector(`.window-controls`);
const tableFindedProductsElement = document.querySelector(".table-of-finded-products");
// all tables
var tableProducts = Table.create("table client products", {
  name: "no provied",
  id: " - ",
  count: 1,
  price: 0.00,
  "total price": 0.00
});
var tableFindProducts = Table.create("table client ready products", {
  name: "no provied",
  id: " - ",
  price: 0.00,
});
document.getElementById("products-input-search").oninput = async function () {
  const value = this.value;
  isOpend(tableFindedProductsElement) || toggle(tableFindedProductsElement);
  var products = (await fetch("./products.json").then(j => j.json()));
  tableFindProducts.root.innerHTML = "";
  tableFindProducts.methodeSync("append", products.filter((prod) => `${prod.id}`.toLowerCase().startsWith(value.toLowerCase())));
  tableFindProducts.forword(1);
}
tableFindProducts.onsubmit(() => {
  var result = [];
  result.push(...tableProducts.methodeSync("append", tableFindProducts.SELECTED_DATA.filter((d, index) => {
    const allData = tableProducts.DATA;
    var fineded = allData.find((prod) => prod.id == d.id);
    if (fineded) {
      fineded["total price"] = ++fineded.count * fineded.price;
      result.push(fineded);
      return false;
    } else
      return true;
  }).map(({ name, id, price }) => {
    return { name, id, price, "total price": price };
  }), null));
  tableProducts.select(...result.map(({ row }) => row));
  toggle(tableFindedProductsElement);
  calcTotalPrice()
  document.getElementById("products-input-search").value = "";
  tableFindProducts.root.innerHTML = "";
})
tableFindProducts.settargetsshortcuts([document.getElementById("products-input-search")]);
// all toolbars
var toolbar = new ToolBar("window controls", "minimize", "(un)maximize", "close");
// functions of toolbars
toolbar.addTip("minimize", "minimize", () => {
  console.log("minimize")
})
toolbar.addTip("(un)maximize", "sqaure", () => {
})
toolbar.addTip("close", "close", () => {
  KeyboardShortcut.execcommand("close window", ["down"]);
})
// elements structor
windowControlsElement.appendChild(toolbar.root);
tableClientProductsElement.querySelector(".title-table-products").appendChild(createTitle(tableProducts));
tableClientProductsElement.querySelector(".table-of-products").appendChild(tableProducts.root);
tableFindedProductsElement.appendChild(createTitle(tableFindProducts));
tableFindedProductsElement.appendChild(tableFindProducts.root);
// functions
function createTitle(table = new Table()) {
  var o = {};
  table.propertys.forEach((prop) => {
    o[prop] = prop;
  })
  return table.createrow(o);
}
KeyboardShortcut.keyboardKeys
KeyboardShortcut.create("add count products",
  `Ctrl+${range(10, 1).join(KeyboardShortcut.separatorKeys)}`
  , [tableProducts.root, document.getElementById("products-input-search")]).ondown(({ Keys },) => {
    var k = KeyboardShortcut.keyOf(Keys[0]);
    tableProducts.SELECTED_DATA.forEach((prod) => {
      prod["total price"] = +prod.price * (prod.count += +k);
    })
    calcTotalPrice()
  })
KeyboardShortcut.create("delete count products",
  `Ctrl+Shift+${range(10, 1).join(KeyboardShortcut.separatorKeys)}`
  , [tableProducts.root, document.getElementById("products-input-search")]).ondown(({ Keys },) => {
    var k = KeyboardShortcut.keyOf(Keys[0]);
    tableProducts.SELECTED_DATA.forEach((prod) => {
      prod.count -= +k
      if (+prod.count > 0) prod["total price"] = +prod.price * (+prod.count)
      else prod.row.remove();
    })
    calcTotalPrice();
  });
KeyboardShortcut.create("delete count products by 1",
  `Delete`
  , [tableProducts.root, document.getElementById("products-input-search")]).ondown(async () => {
    var data = tableProducts.SELECTED_DATA;
    data.forEach((prod) => {
      prod.count -= 1;
      if (+prod.count > 0) prod["total price"] = +prod.price * (+prod.count)
      else prod.row.remove();
    })
    calcTotalPrice();
  });
KeyboardShortcut.create("delete count products dirctly",
  `Ctrl+Delete`
  , [tableProducts.root, document.getElementById("products-input-search")]).ondown(() => {
    var data = tableProducts.SELECTED_DATA;
    const length = data.length;
    var isit = true;
    if (length) {
      isit = confirm(`you want to remove ${length} products`);
    }
    if (isit) {
      data.forEach(({ row }) => row.remove());
      calcTotalPrice();
    }
  });
function calcTotalPrice() {
  var s = 0;
  tableProducts.DATA.forEach((data) => {
    s += data["total price"];
  });
  document.getElementById("total-price-space").innerHTML = (+s).toFixed(2);
}
KeyboardShortcut.execcommand("toggle search products", ["down"]);