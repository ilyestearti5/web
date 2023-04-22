import { Delay } from './delay.js';
import { timer, creationDirection } from './types.js';
export async function forEachAsync<T>(array: T[], callback: (value: T, index: number) => void, timeout: timer<T>, limits: number) {
  var dl = new Delay(0);
  for (let i = 0; i < array.length; i++) {
    if (i % limits == 0) {
      dl.timeout = typeof timeout == 'function' ? timeout(array[i], i) : timeout;
      await dl.on();
    }
    await callback(array[i], i);
  }
}
export async function extractElement(element: HTMLElement, timeout: number = 500, limit: number = 1) {
  var { parentElement } = element;
  if (!parentElement) return;
  element.remove();
  await forEachAsync(
    Array.from(element.children),
    ele => {
      parentElement!.appendChild(ele);
    },
    timeout,
    limit,
  );
}
export function createElement<T extends keyof HTMLElementTagNameMap, U>(tagname: T, content: string, attributes: U): HTMLElementTagNameMap[T] {
  var result = document.createElement(tagname);
  result.innerHTML = content;
  for (let attr in attributes) result.setAttribute(attr, `${attributes[attr]}`);
  return result;
}
export function defaultObject<T>(o: T, def: T): T {
  var rs: T = Object.create(null);
  for (let prop in def) rs[prop] = o[prop] == undefined ? def[prop] : o[prop];
  return rs;
}
export function range(max: number, min: number = 0, steps: number = 1): Array<number> {
  var array: number[] = [];
  for (let i = min; i < max; i += steps) array.push(i);
  return array;
}
export function scrollToElement(element: HTMLElement | null, position: number = 0) {
  if (!element) return false;
  var { parentElement } = element;
  if (!parentElement) return;
  var { x: eX, y: eY, height: eH, width: eW } = element.getBoundingClientRect();
  var { x: pX, y: pY, height: pH, width: pW } = parentElement.getBoundingClientRect();
  parentElement.scroll({
    top: eY - pY - eH * position - (position >= 0 ? 0 : pH) + parentElement.scrollTop,
    left: eX - pX - eW * position - (position >= 0 ? 0 : pW) + parentElement.scrollLeft,
  });
}
export function extractElementSync(element: HTMLElement) {
  var { parentElement } = element;
  if (!parentElement) return;
  element.remove();
  Array.from(element.children).forEach(ele =>
    parentElement!.appendChild(ele)
  );
}
export var calc = (exprision: string): number => Function(`return +${exprision}`)();
export var between = (max: number = 10, min: number = 0) => Math.trunc(Math.random() * (max - 1 - min)) + min;
export var randomItem = <T>(array: T[]): { value: T; index: number } => {
  var index = between(array.length);
  return {
    value: array[index],
    index,
  };
};
export var isLooked = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  var { parentElement } = element;
  if (!parentElement) return true;
  var { left: eL, right: eR, top: eT, bottom: eB } = element.getBoundingClientRect();
  var { left: pL, right: pR, top: pT, bottom: pB } = parentElement.getBoundingClientRect();
  return pT <= eT && eB <= pB && pL <= eL && eR <= pR;
};
export var countOf = <T>(array: T[], callback: (value: T, index: number) => boolean) => array.filter(callback).length;
export async function createDirection(content: creationDirection) {
  var inp = content.input;
  var result = inp instanceof HTMLElement ? inp : createElement(...inp);
  typeof content.fn == 'function' && await content.fn(result);
  Array.isArray(content.inner) &&
    content.inner.forEach(async content => {
      var ele = await createDirection(content);
      result.appendChild(ele);
    });
  return result;
}
export function readDirection(element: HTMLElement, ignoreTags: (keyof HTMLElementTagNameMap)[]): creationDirection {
  var tagname = element.tagName.toLowerCase() as keyof HTMLElementTagNameMap;
  var attributes: object = Object.create(null);
  var attrs = element.attributes;
  var childs = Array.from(element.children)
  var content = childs.length ? "" : element.innerText;
  for (let i = 0; i < attrs.length; i++) {
    var a = attrs.item(i)!.localName;
    Object.defineProperty(attributes, a, {
      value: element[a as keyof HTMLElement],
      enumerable: true,
      configurable: true,
      writable: false
    })
  }
  return {
    input: [tagname, content, attributes],
    inner: childs.filter(({ tagName }) => !ignoreTags.includes(tagName.toLowerCase() as keyof HTMLElementTagNameMap)).map((ele) => readDirection(ele as HTMLElement, ignoreTags)),
    async fn(e) { }
  }
}