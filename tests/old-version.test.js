const { loadApp, $, ctxOf, setValue, click, keydown } = require('./helpers');

const points = () => document.getElementsByClassName('point');
// The editPoint div also carries the "point" class, so real data points are
// every .point element except it.
const dataPoints = () => Array.from(points()).filter((el) => el.id !== 'editPoint');
const callNames = (ctx) => ctx.calls.map((c) => c.name);
const countCalls = (ctx, name) => callNames(ctx).filter((n) => n === name).length;

describe('old version (script.js top-level IIFE)', () => {
  beforeEach(() => {
    loadApp();
  });

  it('sizes the canvas from the smaller window dimension on load', () => {
    const canvas = $('canvas');
    expect(canvas.width).toBe(window.innerHeight - 60);
    expect(canvas.height).toBe(window.innerHeight - 60);
    expect(document.getElementsByClassName('content')[0].style.width).toBe(`${window.innerHeight - 60}px`);
  });

  it('uses the window width when the window is taller than it is wide', () => {
    window.innerWidth = 400;
    window.innerHeight = 900;
    window.dispatchEvent(new window.Event('resize'));

    const canvas = $('canvas');
    expect(canvas.width).toBe(340);
    expect(canvas.height).toBe(340);

    window.innerWidth = 1200;
    window.innerHeight = 800;
  });

  it('positions the axis labels relative to the canvas size', () => {
    expect($('labelY').style.top).toBe('-547px');
    expect($('labelX').style.left).toBe('485px');
  });

  it('toggles the data panel and the button label', () => {
    const data = document.getElementsByClassName('data')[0];
    const hideData = document.getElementsByClassName('hideData')[0];

    click(hideData);
    expect(data.classList.contains('hiden')).toBe(true);
    expect(hideData.innerHTML).toBe('+');

    click(hideData);
    expect(data.classList.contains('hiden')).toBe(false);
    expect(hideData.innerHTML).toBe('-');
  });

  it('moves the preview point while the inputs change', () => {
    setValue($('inputX'), 100);
    setValue($('inputY'), 250);

    const editPoint = $('editPoint');
    expect(editPoint.style.left).toBe('99px');
    expect(editPoint.style.top).toBe('-262px');
    expect(editPoint.innerHTML).toBe('<br>100:250');
  });

  it('adds a point element carrying its coordinates in the title', () => {
    setValue($('inputX'), 10);
    setValue($('inputY'), 20);
    click($('addButton'));

    expect(dataPoints()).toHaveLength(1);
    const point = dataPoints()[0];
    expect(point.title).toBe('10 : 20');
    expect(point.style.left).toBe('9px');
    expect(point.style.top).toBe('-32px');
  });

  it('draws a line segment only once a second point exists', () => {
    const ctx = ctxOf('canvas');

    setValue($('inputX'), 10);
    setValue($('inputY'), 20);
    click($('addButton'));
    expect(countCalls(ctx, 'lineTo')).toBe(0);

    setValue($('inputX'), 30);
    setValue($('inputY'), 40);
    click($('addButton'));

    const lineTo = ctx.calls.filter((c) => c.name === 'lineTo');
    expect(lineTo).toHaveLength(1);
    const scale = ctx.canvas.width / 500;
    expect(lineTo[0].args).toEqual([30 * scale, ctx.canvas.width - 40 * scale]);
  });

  it('grows the maximum and relaxes the input limits when X exceeds it', () => {
    setValue($('inputX'), 900);
    setValue($('inputY'), 5);
    click($('addButton'));

    expect($('inputX').max).toBe('900');
    expect($('inputY').max).toBe('900');
  });

  it('grows the maximum when Y exceeds it', () => {
    setValue($('inputX'), 5);
    setValue($('inputY'), 700);
    click($('addButton'));

    expect($('inputX').max).toBe('700');
    expect($('inputY').max).toBe('700');
  });

  it('repositions existing points and repaints the lines on resize', () => {
    [[10, 20], [30, 40], [50, 60]].forEach(([x, y]) => {
      setValue($('inputX'), x);
      setValue($('inputY'), y);
      click($('addButton'));
    });

    const ctx = ctxOf('canvas');
    ctx.calls.length = 0;
    window.dispatchEvent(new window.Event('resize'));

    expect(countCalls(ctx, 'clearRect')).toBe(1);
    expect(countCalls(ctx, 'lineTo')).toBeGreaterThan(0);
    expect(dataPoints().map((el) => el.style.left)).toEqual(['9px', '29px', '49px']);
  });

  it('adds a random point inside the current bounds', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);
    click($('addRandomButton'));
    Math.random.mockRestore();

    expect(dataPoints()).toHaveLength(1);
    expect(dataPoints()[0].title).toBe('250 : 250');
    expect($('inputX').value).toBe('250');
    expect($('inputY').value).toBe('250');
  });

  it('moves focus from X to Y on Enter and adds the point on Enter in Y', () => {
    setValue($('inputX'), 7);
    setValue($('inputY'), 8);

    keydown($('inputX'), { keyCode: 13 });
    expect(document.activeElement).toBe($('inputY'));

    keydown($('inputY'), { keyCode: 13 });
    expect(dataPoints()).toHaveLength(1);
    expect(dataPoints()[0].title).toBe('7 : 8');
    expect(document.activeElement).toBe($('inputX'));
  });

  it('ignores other keys in the inputs', () => {
    keydown($('inputX'), { keyCode: 65 });
    keydown($('inputY'), { keyCode: 65 });
    expect(dataPoints()).toHaveLength(0);
  });

  it.each(['inputX', 'inputY'])('selects the whole value when %s is clicked', (id) => {
    const input = $(id);
    setValue(input, 123);
    const select = jest.spyOn(input, 'select');
    click(input);
    expect(select).toHaveBeenCalled();
  });
});
