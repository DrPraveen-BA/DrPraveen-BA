const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');

// Exercise the real app handlers with a minimal DOM/canvas harness.
const source = readFileSync(require('node:path').join(__dirname, '../app.js'), 'utf8');
function editor() {
  const elements = new Map();
  const calls = [];
  const pendingImages = [];
  const context = new Proxy({}, { get: (_, method) => (...args) => calls.push([method, ...args]) });
  function element() {
    return {
      style: {}, classList: { add() {}, remove() {}, toggle() {} }, dataset: {},
      width: 1280, height: 720, listeners: {},
      addEventListener(type, callback) { this.listeners[type] = callback; },
      getContext() { return context; },
      getBoundingClientRect() { return { left: 0, top: 0, width: this.width, height: this.height }; },
      setPointerCapture() {},
      toDataURL() { return `data:image/png;size=${this.width}x${this.height}`; },
      click() { this.onclick?.(); }
    };
  }
  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, element());
      return elements.get(selector);
    },
    querySelectorAll() { return []; },
    addEventListener() {},
    createElement(tag) {
      const node = element();
      if (tag === 'a') elements.set('download', node);
      return node;
    }
  };
  class Image {
    set src(value) { this._src = value; pendingImages.push(this); }
    get src() { return this._src; }
  }
  const sandbox = vm.createContext({ document, Image, setTimeout() {}, navigator: {}, location: {} });
  vm.runInContext(source, sandbox);
  const run = code => vm.runInContext(code, sandbox);
  function flushImages() {
    while (pendingImages.length) {
      const image = pendingImages.shift();
      const match = /size=(\d+)x(\d+)/.exec(image.src);
      if (match) { image.width = +match[1]; image.height = +match[2]; }
      image.onload();
    }
  }
  function gesture(type, x, y, dx, dy) {
    run(`selectTool('${type}')`);
    const canvas = document.querySelector('#editorCanvas');
    const event = (clientX, clientY) => ({ clientX, clientY, pointerId: 1 });
    canvas.listeners.pointerdown(event(x, y));
    canvas.listeners.pointermove(event(x + dx, y + dy));
    canvas.listeners.pointerup(event(x + dx, y + dy));
  }
  run("setCanvas({src:'original',width:640,height:480})");
  return { document, calls, run, flushImages, gesture };
}

test('crop undo restores image, annotations, geometry, wrapper and export size', () => {
  const e = editor();
  e.gesture('arrow', 50, 60, 100, 80);
  e.gesture('crop', 10, 20, 200, 100);
  const before = e.run('JSON.stringify(annotations)');
  e.document.querySelector('#applyCrop').click();
  e.flushImages();
  const canvas = e.document.querySelector('#editorCanvas');
  assert.equal(canvas.width, 200);
  assert.equal(canvas.height, 100);
  e.document.querySelector('#undoBtn').click();
  e.flushImages();
  assert.equal(canvas.width, 640);
  assert.equal(canvas.height, 480);
  assert.equal(e.document.querySelector('#canvasWrap').style.width, '640px');
  assert.equal(e.run('image.src'), 'original');
  assert.equal(e.run('JSON.stringify(annotations)'), before);
  const lastImageDraw = e.calls.filter(call => call[0] === 'drawImage').at(-1);
  assert.deepEqual(lastImageDraw.slice(2), [0, 0, 640, 480]);
  e.document.querySelector('#downloadBtn').click();
  assert.equal(e.document.querySelector('download').href, 'data:image/png;size=640x480');
  e.document.querySelector('#undoBtn').click();
  e.flushImages();
  assert.equal(e.run('annotations.length'), 1);
  assert.equal(canvas.width, 640);
  assert.equal(canvas.height, 480);
});

for (const [name, dx, dy, accepted] of [
  ['vertical down', 0, 100, true],
  ['vertical up', 0, -100, true],
  ['mostly vertical', 2, 100, true],
  ['horizontal', 100, 0, true],
  ['diagonal', -40, -60, true],
  ['click', 0, 0, false],
  ['tiny drag', 2, 2, false],
  ['threshold', 3, 0, false]
]) {
  test(`arrow completion: ${name}`, () => {
    const e = editor();
    e.gesture('arrow', 100, 150, dx, dy);
    assert.equal(e.run('annotations.length'), accepted ? 1 : 0);
    assert.equal(e.run('history.length'), accepted ? 2 : 1);
    assert.equal(e.run('drawing'), null);
    if (accepted) {
      assert.equal(e.run('annotations[0].w'), dx);
      assert.equal(e.run('annotations[0].h'), dy);
      e.document.querySelector('#undoBtn').click();
      e.flushImages();
      assert.equal(e.run('annotations.length'), 0);
    }
  });
}
