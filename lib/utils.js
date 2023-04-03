var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Delay } from "./index.js";
export function forEachAsync(array, callback, timeout, limits) {
    return __awaiter(this, void 0, void 0, function* () {
        var dl = new Delay(0);
        for (let i = 0; i < array.length; i++) {
            if (i % limits == 0) {
                dl.timeout =
                    typeof timeout == "function" ? timeout(array[i], i) : timeout;
                yield dl.on();
            }
            yield callback(array[i], i);
        }
    });
}
export function extractElement(element, timeout = 500, limit = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        var { parentElement } = element;
        if (!parentElement)
            return;
        element.remove();
        yield forEachAsync(Array.from(element.children), (ele) => {
            parentElement.appendChild(ele);
        }, timeout, limit);
    });
}
export function createElement(tagname, content, attributes) {
    var result = document.createElement(tagname);
    result.innerHTML = content;
    for (let attr in attributes)
        result.setAttribute(attr, `${attributes[attr]}`);
    return result;
}
export function defaultObject(o, def) {
    var rs = Object.create(null);
    for (let prop in def)
        rs[prop] = o[prop] == undefined ? def[prop] : o[prop];
    return rs;
}
export function range(max, min = 0, steps = 1) {
    var array = [];
    for (let i = min; i < max; i += steps)
        array.push(i);
    return array;
}
export function scrollToElement(element, position = 0) {
    if (!element)
        return false;
    var { parentElement } = element;
    if (!parentElement)
        return;
    var { x: eX, y: eY, height: eH, width: eW } = element.getBoundingClientRect();
    var { x: pX, y: pY, height: pH, width: pW, } = parentElement.getBoundingClientRect();
    parentElement.scroll({
        top: eY -
            pY -
            eH * position -
            (position >= 0 ? 0 : pH) +
            parentElement.scrollTop,
        left: eX -
            pX -
            eW * position -
            (position >= 0 ? 0 : pW) +
            parentElement.scrollLeft,
    });
}
export function extractElementSync(element) {
    var { parentElement } = element;
    if (!parentElement)
        return;
    element.remove();
    Array.from(element.children).forEach((ele) => {
        parentElement.appendChild(ele);
    });
}
export var calc = (exprision) => Function(`return +${exprision}`)();
export var between = (max = 10, min = 0) => Math.trunc(Math.random() * (max - 1 - min)) + min;
export var randomItem = (array) => {
    var index = between(array.length);
    return {
        value: array[index],
        index,
    };
};
export var isLooked = (element) => {
    if (!element)
        return false;
    var { parentElement } = element;
    if (!parentElement)
        return true;
    var { left: eL, right: eR, top: eT, bottom: eB, } = element.getBoundingClientRect();
    var { left: pL, right: pR, top: pT, bottom: pB, } = parentElement.getBoundingClientRect();
    return pT <= eT && eB <= pB && pL <= eL && eR <= pR;
};
export var countOf = (array, callback) => array.filter(callback).length;
