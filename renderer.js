import { _ } from './lib/utils.js';
var scrolltion = _('.scrolltion', 'one');
var content = _('.scrolltion .content', 'one');
var scrolling = _('.scrolltion .scrolling', 'one');
var scrollBar = _('.scrolltion .scroll-bar', 'one');
var scroller = _('.scrolltion .scroller', 'one');

content.onscroll = function () {
  scroller.style.height = `${
    (content.offsetHeight / content.scrollHeight) * 100
  }%`;
  scroller.style.top = `${(content.scrollTop / content.scrollHeight) * 100}%`;
  scrolling.style.maxHeight = `${content.offsetHeight}px`;
  scrolling.style.height = `${content.scrollHeight}px`;
};
