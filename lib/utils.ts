import { Delay } from "./delay.js";
export function createElement<T extends keyof HTMLElementTagNameMap, U>(
  tagname: T,
  content: string,
  attributes: U
): HTMLElementTagNameMap[T] {
  var result = document.createElement(tagname);
  result.innerHTML = content;
  for (let attr in attributes) result.setAttribute(attr, `${attributes[attr]}`);
  return result;
}
export async function forEachAsync<T>(
  array: T[],
  callback: (value: T, index: number) => void,
  timeout: number | ((value: T, index: number) => number),
  limits: number
) {
  var dl = new Delay(0);

  for (let i = 0; i < array.length; i++) {
    if (i % limits == 0) {
      dl.timeout =
        typeof timeout == "function" ? timeout(array[i], i) : timeout;
      await dl.on();
    }
    await callback(array[i], i);
  }
}
export function defaultObject<T>(o: T, def: T): T {
  var rs: T = Object.create(null);
  for (let prop in def) rs[prop] = o[prop] == undefined ? def[prop] : o[prop];
  return rs;
}
export var between = (max: number = 10, min: number = 0) =>
  Math.ceil(Math.random() * (max - min)) + min;
export function range(max: number, min: number = 0, steps: number = 1) {
  var array: number[] = [];
  for (let i = min; i < max; i += steps) array.push(i);
  return array;
}
export var randomItem = <T>(array: T[]): T => array[between(array.length)];
export function scrollToElement(
  element: HTMLElement | null,
  position: number = 0
) {
  if (!element) return false;
  var { parentElement } = element;
  if (!parentElement) return;

  var { x: eX, y: eY, height: eH, width: eW } = element.getBoundingClientRect();
  var {
    x: pX,
    y: pY,
    height: pH,
    width: pW,
  } = parentElement.getBoundingClientRect();

  parentElement.scroll({
    top:
      eY -
      pY -
      eH * position -
      (position >= 0 ? 0 : pH) +
      parentElement.scrollTop,
    left:
      eX -
      pX -
      eW * position -
      (position >= 0 ? 0 : pW) +
      parentElement.scrollLeft,
  });
}
export var isLooked = (element: HTMLElement | null): boolean => {
  if (!element) return false;

  var { parentElement } = element;
  if (!parentElement) return true;

  var {
    left: eL,
    right: eR,
    top: eT,
    bottom: eB,
  } = element.getBoundingClientRect();
  var {
    left: pL,
    right: pR,
    top: pT,
    bottom: pB,
  } = parentElement.getBoundingClientRect();

  return pT <= eT && eB <= pB && pL <= eL && eR <= pR;
};
export async function extractElement(
  element: HTMLElement,
  timeout: number = 500,
  limit: number = 1
) {
  var { parentElement } = element;
  if (!parentElement) return;
  element.remove();
  await forEachAsync(
    Array.from(element.children),
    (ele) => {
      parentElement!.appendChild(ele);
    },
    timeout,
    limit
  );
}
export function extractElementSync(element: HTMLElement) {
  var { parentElement } = element;
  if (!parentElement) return;
  element.remove();
  Array.from(element.children).forEach((ele) => {
    parentElement!.appendChild(ele);
  });
}
export var calc = (exprision: string): number =>
  Function(`return +${exprision}`)();
