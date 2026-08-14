const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LAYOUT_SIZE = 500;

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
const bodyMarkup = bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, '');
const bodyClass = (html.match(/<body[^>]*class="([^"]*)"/i) || [, ''])[1];

/** The real index.html body markup with the given elements removed. */
function markupWithout(...selectors) {
  const holder = document.createElement('div');
  holder.innerHTML = bodyMarkup;
  selectors.forEach((selector) => holder.querySelectorAll(selector).forEach((el) => el.remove()));
  return holder.innerHTML;
}

/**
 * Renders the real index.html markup into the jsdom document and loads a fresh
 * copy of script.js against it.
 */
function loadApp(markup = bodyMarkup) {
  document.body.className = bodyClass;
  document.body.innerHTML = markup;
  document.documentElement.removeAttribute('data-theme');
  jest.resetModules();
  jest.isolateModules(() => {
    require(path.join(ROOT, 'script.js'));
  });
}

const $ = (id) => document.getElementById(id);
const ctxOf = (id) => $(id).getContext('2d');
const setValue = (input, value) => {
  input.value = String(value);
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
};
const click = (el) => el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
const keydown = (el, init) => el.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, ...init }));

module.exports = { loadApp, markupWithout, bodyMarkup, LAYOUT_SIZE, $, ctxOf, setValue, click, keydown };
