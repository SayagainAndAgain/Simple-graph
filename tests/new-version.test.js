const { loadApp, markupWithout, bodyMarkup, $, ctxOf, click, keydown } = require('./helpers');

const SIZE = 500; // canvas.width (1000) / 2, see initCanvas

function init(markup) {
  loadApp(markup);
  window.initNewVersion();
}

const addPoint = (x, y) => {
  $('newInputX').value = String(x);
  $('newInputY').value = String(y);
  click($('newAddButton'));
};
const toasts = () => Array.from($('toastContainer').children).map((t) => t.textContent);
const listedPoints = () => Array.from($('pointsList').querySelectorAll('.point-coords')).map((el) => el.textContent);
const countCalls = (ctx, name) => ctx.calls.filter((c) => c.name === name).length;

describe('new version (window.initNewVersion)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    init();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('bails out when the canvas is absent', () => {
    init(markupWithout('#mainCanvas'));
    click($('newAddButton'));
    expect($('pointsListCount').textContent).toBe('0');
  });

  it('bails out when an input is absent', () => {
    init(markupWithout('#newInputX'));
    click($('newAddButton'));
    expect($('pointsListCount').textContent).toBe('0');
  });

  it('scales the canvas for the device pixel ratio and paints the grid', () => {
    const canvas = $('mainCanvas');
    const ctx = ctxOf('mainCanvas');

    expect(canvas.width).toBe(SIZE * 2);
    expect(canvas.style.width).toBe(`${SIZE}px`);
    expect(ctx.calls.some((c) => c.name === 'scale' && c.args[0] === 2)).toBe(true);
    // 11 vertical + 11 horizontal grid lines plus the two axes
    expect(countCalls(ctx, 'stroke')).toBe(24);
  });

  it('skips the grid when the grid checkbox is unchecked', () => {
    const ctx = ctxOf('mainCanvas');
    const showGrid = $('showGrid');
    showGrid.checked = false;
    ctx.calls.length = 0;
    showGrid.dispatchEvent(new window.Event('change', { bubbles: true }));

    expect(countCalls(ctx, 'stroke')).toBe(2);
  });

  it('starts with empty statistics', () => {
    expect($('pointsCount').textContent).toBe('0');
    expect($('maxValue').textContent).toBe('500');
    ['minX', 'maxX', 'minY', 'maxY', 'avgX', 'avgY'].forEach((id) => {
      expect($(id).textContent).toBe('0');
    });
    expect($('pointsList').textContent).toBe('Немає точок');
  });

  it('adds a point, updates the stats and resets the inputs', () => {
    addPoint(100, 200);

    expect($('pointsCount').textContent).toBe('1');
    expect($('pointsListCount').textContent).toBe('1');
    expect(listedPoints()).toEqual(['(100, 200)']);
    expect($('minX').textContent).toBe('100');
    expect($('avgY').textContent).toBe('200.0');
    expect($('newInputX').value).toBe('0');
    expect($('newInputY').value).toBe('0');
    expect(toasts()).toContain('Точку додано!');
  });

  it('treats empty or non-numeric inputs as zero', () => {
    $('newInputX').value = '';
    $('newInputY').value = '';
    click($('newAddButton'));

    expect(listedPoints()).toEqual(['(0, 0)']);
  });

  it('computes min, max and average over several points', () => {
    addPoint(10, 20);
    addPoint(30, 50);
    addPoint(20, 80);

    expect($('minX').textContent).toBe('10');
    expect($('maxX').textContent).toBe('30');
    expect($('minY').textContent).toBe('20');
    expect($('maxY').textContent).toBe('80');
    expect($('avgX').textContent).toBe('20.0');
    expect($('avgY').textContent).toBe('50.0');
  });

  it('raises the maximum and warns when a coordinate exceeds it', () => {
    addPoint(900, 10);

    expect($('maxValue').textContent).toBe('900');
    expect(toasts()).toContain('Максимум збільшено до 900');
  });

  it('removes toasts after their timeout', () => {
    addPoint(1, 1);
    expect($('toastContainer').children).toHaveLength(1);

    jest.advanceTimersByTime(3300);
    expect($('toastContainer').children).toHaveLength(0);
  });

  it('deletes a single point from the list', () => {
    addPoint(1, 1);
    addPoint(2, 2);

    click($('pointsList').querySelectorAll('.point-delete')[0]);

    expect(listedPoints()).toEqual(['(2, 2)']);
    expect($('pointsCount').textContent).toBe('1');
    expect(toasts()).toContain('Точку видалено');
  });

  it('clears every point', () => {
    addPoint(1, 1);
    click($('clearAllBtn'));

    expect(listedPoints()).toEqual([]);
    expect($('pointsCount').textContent).toBe('0');
    expect(toasts()).toContain('Всі точки очищено');
  });

  it('does nothing when clearing an empty chart', () => {
    click($('clearAllBtn'));
    expect(toasts()).toEqual([]);
  });

  it('undoes the last action', () => {
    addPoint(1, 1);
    addPoint(2, 2);
    click($('undoBtn'));

    expect(listedPoints()).toEqual(['(1, 1)']);
    expect(toasts()).toContain('Скасовано');
  });

  it('undoes a delete and a clear', () => {
    addPoint(1, 1);
    addPoint(2, 2);
    click($('clearAllBtn'));
    click($('undoBtn'));

    expect(listedPoints()).toEqual(['(1, 1)', '(2, 2)']);
  });

  it('reports an empty undo history', () => {
    click($('undoBtn'));
    expect(toasts()).toContain('Немає що скасовувати');
  });

  it('undoes with Ctrl+Z', () => {
    addPoint(1, 1);
    keydown(document, { ctrlKey: true, keyCode: 90 });

    expect(listedPoints()).toEqual([]);
  });

  it('ignores Ctrl+Z without the control key and plain Z', () => {
    addPoint(1, 1);
    keydown(document, { keyCode: 90 });
    keydown(document, { ctrlKey: true, keyCode: 65 });

    expect(listedPoints()).toEqual(['(1, 1)']);
  });

  it('refuses to export an empty chart', () => {
    click($('exportBtn'));
    expect(toasts()).toContain('Немає даних для експорту');
  });

  it('exports the points as CSV', () => {
    const createObjectURL = jest.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test');
    const revokeObjectURL = jest.spyOn(window.URL, 'revokeObjectURL');
    const anchorClick = jest.spyOn(window.HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    addPoint(1, 2);
    addPoint(3, 4);
    click($('exportBtn'));

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(createObjectURL.mock.calls[0][0].type).toBe('text/csv');
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test');
    expect(toasts()).toContain('Дані експортовано!');

    createObjectURL.mockRestore();
    revokeObjectURL.mockRestore();
    anchorClick.mockRestore();
  });

  it('switches between light and dark themes', () => {
    const themeToggle = $('themeToggle');

    click(themeToggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(themeToggle.querySelector('span:first-child').textContent).toBe('☀️');
    expect(toasts()).toContain('Тема: Світла');

    click(themeToggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(themeToggle.querySelector('span:first-child').textContent).toBe('🌙');
  });

  it('applies the colour and width settings to the next paint', () => {
    const ctx = ctxOf('mainCanvas');
    addPoint(100, 100);

    $('lineColor').value = '#ff0000';
    $('lineColor').dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(ctx.strokeStyle).toBe('#ff0000');

    $('lineWidth').value = '7';
    $('lineWidth').dispatchEvent(new window.Event('input', { bubbles: true }));
    expect(ctx.lineWidth).toBe(7);
  });

  it('draws a line chart with a marker per point by default', () => {
    const ctx = ctxOf('mainCanvas');
    addPoint(100, 200);
    addPoint(300, 400);
    ctx.calls.length = 0;
    window.dispatchEvent(new window.Event('resize'));

    // The grid and axes are painted first, so the data path is at the tail.
    const path = ctx.calls.filter((c) => c.name === 'moveTo' || c.name === 'lineTo').slice(-2);
    expect(path).toEqual([
      { name: 'moveTo', args: [100, SIZE - 200] },
      { name: 'lineTo', args: [300, SIZE - 400] },
    ]);
    expect(countCalls(ctx, 'arc')).toBe(2);
    expect(countCalls(ctx, 'fillRect')).toBe(0);
  });

  it.each([
    ['scatter', { arc: 2, fillRect: 0, createLinearGradient: 0 }],
    ['bar', { arc: 0, fillRect: 2, createLinearGradient: 2 }],
    ['area', { arc: 0, fillRect: 0, createLinearGradient: 1 }],
  ])('draws the %s chart type', (type, expected) => {
    const ctx = ctxOf('mainCanvas');
    addPoint(100, 200);
    addPoint(300, 400);

    const btn = document.querySelector(`.chart-type-btn[data-type="${type}"]`);
    ctx.calls.length = 0;
    click(btn);

    expect(btn.classList.contains('active')).toBe(true);
    expect(document.querySelectorAll('.chart-type-btn.active')).toHaveLength(1);
    expect(countCalls(ctx, 'arc')).toBe(expected.arc);
    expect(countCalls(ctx, 'fillRect')).toBe(expected.fillRect);
    expect(countCalls(ctx, 'createLinearGradient')).toBe(expected.createLinearGradient);
    expect(toasts().some((t) => t.includes(btn.querySelector('span:last-child').textContent))).toBe(true);
  });

  it('leaves an empty chart with axes only', () => {
    const ctx = ctxOf('mainCanvas');
    ctx.calls.length = 0;
    click(document.querySelector('.chart-type-btn[data-type="scatter"]'));

    expect(countCalls(ctx, 'arc')).toBe(0);
  });

  it('adds a random point within the current maximum', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    click($('newRandomButton'));
    Math.random.mockRestore();

    expect(listedPoints()).toEqual(['(250, 250)']);
  });

  it('collapses and expands the sidebar and the right panel', () => {
    const sidebar = $('sidebar');
    const sidebarToggle = $('sidebarToggle');
    const rightPanel = $('rightPanel');
    const panelToggle = $('panelToggle');

    click(sidebarToggle);
    expect(sidebar.classList.contains('collapsed')).toBe(true);
    expect(sidebarToggle.textContent).toBe('›');
    click(sidebarToggle);
    expect(sidebar.classList.contains('collapsed')).toBe(false);
    expect(sidebarToggle.textContent).toBe('‹');

    click(panelToggle);
    expect(rightPanel.classList.contains('collapsed')).toBe(true);
    expect(panelToggle.textContent).toBe('‹');
    click(panelToggle);
    expect(rightPanel.classList.contains('collapsed')).toBe(false);
    expect(panelToggle.textContent).toBe('›');
  });

  it('moves focus with Enter and adds the point from the Y input', () => {
    keydown($('newInputX'), { keyCode: 13 });
    expect(document.activeElement).toBe($('newInputY'));

    $('newInputX').value = '5';
    $('newInputY').value = '6';
    keydown($('newInputY'), { keyCode: 13 });
    expect(listedPoints()).toEqual(['(5, 6)']);
  });

  it('ignores other keys in the inputs', () => {
    keydown($('newInputX'), { keyCode: 65 });
    keydown($('newInputY'), { keyCode: 65 });
    expect(listedPoints()).toEqual([]);
  });

  it('re-initialises the canvas on window resize', () => {
    const ctx = ctxOf('mainCanvas');
    ctx.calls.length = 0;
    window.dispatchEvent(new window.Event('resize'));

    expect(countCalls(ctx, 'scale')).toBe(1);
    expect(countCalls(ctx, 'clearRect')).toBe(1);
  });

  it('does not size the canvas without a wrapper element', () => {
    const markup = bodyMarkup.replace(/canvas-wrapper/g, 'canvas-wrapper-missing');
    expect(() => init(markup)).not.toThrow();
    expect($('mainCanvas').width).toBe(300); // untouched jsdom default
  });
});
