// jsdom does not implement layout or canvas rendering. These stubs give the
// production code deterministic sizes and a recording 2d context so drawing
// behaviour can be asserted.

const LAYOUT_SIZE = 500;

function defineLayout(prop) {
  Object.defineProperty(window.HTMLElement.prototype, prop, {
    configurable: true,
    get() {
      return LAYOUT_SIZE;
    },
  });
}

defineLayout('offsetWidth');
defineLayout('offsetHeight');

function createContext(canvas) {
  const calls = [];
  const record = (name) => (...args) => {
    calls.push({ name, args });
  };
  const gradient = { addColorStop: record('addColorStop') };
  const ctx = {
    canvas,
    calls,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    beginPath: record('beginPath'),
    closePath: record('closePath'),
    moveTo: record('moveTo'),
    lineTo: record('lineTo'),
    stroke: record('stroke'),
    fill: record('fill'),
    arc: record('arc'),
    fillRect: record('fillRect'),
    clearRect: record('clearRect'),
    scale: record('scale'),
    save: record('save'),
    restore: record('restore'),
    createLinearGradient: (...args) => {
      calls.push({ name: 'createLinearGradient', args });
      return gradient;
    },
  };
  return ctx;
}

window.HTMLCanvasElement.prototype.getContext = function getContext() {
  if (!this.__ctx) {
    this.__ctx = createContext(this);
  }
  return this.__ctx;
};

window.URL.createObjectURL = () => 'blob:mock';
window.URL.revokeObjectURL = () => {};

// Both versions size the viewport from window dimensions.
Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1200 });
Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 800 });

module.exports = { LAYOUT_SIZE };
