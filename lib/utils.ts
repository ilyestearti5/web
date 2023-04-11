// functions
import { Delay } from "./delay.js";
// async function
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
// sync function
/**
 * create element has tagname and content and some attributes
 * @param tagname the tagname of element
 * @param content the innerHTML of element
 * @param attributes the atributes of element
 */
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
/**
 * if property from `def` is not exist in `o` object sow the value of this property is gone be take from `def` object else from the `o` it self
 */
export function defaultObject<T>(o: T, def: T): T {
  var rs: T = Object.create(null);
  for (let prop in def) rs[prop] = o[prop] == undefined ? def[prop] : o[prop];
  return rs;
}
/**
 * get range from `(`min `/` steps`)` to `(`max `/` steps`)` and return at `Array`
 * @param max maximum number
 * @param min maximum number
 * @param steps steps of how to get numbers
 * @returns { Array }
 */
export function range(
  max: number,
  min: number = 0,
  steps: number = 1
): Array<number> {
  var array: number[] = [];
  for (let i = min; i < max; i += steps) array.push(i);
  return array;
}
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
export function extractElementSync(element: HTMLElement) {
  var { parentElement } = element;
  if (!parentElement) return;
  element.remove();
  Array.from(element.children).forEach((ele) => {
    parentElement!.appendChild(ele);
  });
}
// anonymouse functions
// async function
// sync function
/**
 * return result of exprision
 * @param exprision must be string
 * @returns number
 */
export var calc = (exprision: string): number =>
  Function(`return +${exprision}`)();
/**
 * get random number between `min` and `max`
 * @param max the maximum number can be get `(`not include in range`)`
 * @param min the minimum number can be get `(`include in range`)`
 */
export var between = (max: number = 10, min: number = 0) =>
  Math.trunc(Math.random() * (max - 1 - min)) + min;
/**
 * ge random value from array
 * @param array
 * @returns
 */
export var randomItem = <T>(array: T[]): { value: T; index: number } => {
  var index = between(array.length);
  return {
    value: array[index],
    index,
  };
};
/**
 * chack if element is can visible in the screen
 * @param element who check
 * @returns true if the `element` is exists between range of scrollElement
 */
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
/**
 * @param array
 * @param callback
 * @returns
 */
export var countOf = <T>(
  array: T[],
  callback: (value: T, index: number) => boolean
) => array.filter(callback).length;
