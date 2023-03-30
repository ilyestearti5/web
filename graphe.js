import { Graphe } from "./lib/graphe.js"
import { range } from "./lib/utils.js"

import { KeyboardShortcut } from "./lib/keyboard-shortcuts.js"

const cnv = document.querySelector("canvas");

const ctx = cnv.getContext("2d");

cnv.height = 500;

function getSize() {
  cnv.width = innerWidth;
}

window.onresize = getSize;

getSize();

Graphe.origin.x = cnv.width / 2;
Graphe.origin.y = cnv.height / 2;

// creation of 3 points;

var a = Graphe.create(100, 100, undefined);
var b = Graphe.create(50, 50, undefined, a);
var c = Graphe.create(50, 50, undefined, b);

a.relations.push({ graphe: b, color: "red" });

var dir = 1;

var speed = 10;

var nbr = 2;

var hex = [...range(10), ..."ABCDEF".split("")];

setInterval(() => {
  var cmp = Graphe.origin.copy();
  cmp.components.forEach((g) => { g.color = /#[0-9]{4}/ig.test(g.color) ? g.color.replace(/[0-9]\b/ig, `${hex[nbr]}`) : `${g.color}${hex[nbr]}` })
  nbr++;
  if (nbr >= hex.length) nbr = hex.length - 1;

}, 2000);

KeyboardShortcut.create("stop - play", "Ctrl+S|M"
  , null).ondown(({ Keys }, keyboard) => {
    keyboard && keyboard.preventDefault();

    var k = KeyboardShortcut.keyOf(Keys[0]);

    speed = k == "M" ? 10 : 0;

  })

function animation() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  dir = Math.max(...Graphe.origin.components.map(({ relative: [x] }) => x)) >= cnv.width ? -1 : Math.min(...Graphe.origin.components.map(({ relative: [x] }) => x)) <= 0 ? 1 : dir;

  Graphe.origin.x += dir * speed;

  Graphe.draw(ctx);

  // requestAnimationFrame(animation);
}
animation();

