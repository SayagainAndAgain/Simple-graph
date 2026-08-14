// Shared helpers used by both the original and the "Epic Data Visualizer Pro" version.
window.GraphUtils = (function () {
	function projectX(value, size, maxNumber) {
		return (parseFloat(value) / maxNumber) * size;
	}

	function projectY(value, size, maxNumber) {
		return size - projectX(value, size, maxNumber);
	}

	// Absolute offset style for the DOM markers of the original version:
	// they are positioned relative to the bottom-left corner of the canvas.
	function markerStyle(x, y, size, maxNumber) {
		var left = projectX(x, size, maxNumber) - 1;
		var top = -projectX(y, size, maxNumber) - 12;
		return 'left:' + left + 'px; top: ' + top + 'px;';
	}

	function setStroke(ctx, color, width) {
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
	}

	function segment(ctx, x1, y1, x2, y2) {
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
	}

	function strokeSegment(ctx, x1, y1, x2, y2) {
		ctx.beginPath();
		segment(ctx, x1, y1, x2, y2);
		ctx.stroke();
	}

	function fillCircle(ctx, x, y, radius) {
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	function verticalGradient(ctx, color, from, to, stops) {
		var gradient = ctx.createLinearGradient(0, from, 0, to);
		gradient.addColorStop(0, color + stops[0]);
		gradient.addColorStop(1, color + stops[1]);
		return gradient;
	}

	function elementWidth(selector) {
		var el = document.querySelector(selector);
		return el ? el.offsetWidth : 0;
	}

	function selectOnClick(input) {
		input.addEventListener('click', function () { this.select(); });
	}

	function onEnter(el, handler) {
		el.addEventListener('keydown', function (e) {
			if (e.keyCode === 13) handler(e);
		});
	}

	// Wires an input pair so Enter moves from the first field to the second
	// and Enter on the second one submits.
	function bindCoordinateInputs(inputX, inputY, submit) {
		onEnter(inputX, function () { inputY.focus(); inputY.select(); });
		onEnter(inputY, submit);
	}

	// Toggles a class on `target` and keeps the trigger's label in sync.
	function bindToggle(trigger, target, className, onLabel, offLabel) {
		trigger.addEventListener('click', function () {
			target.classList.toggle(className);
			trigger.textContent = target.classList.contains(className) ? onLabel : offLabel;
		});
	}

	function randomCoordinate(maxNumber) {
		return Math.round(Math.random() * maxNumber);
	}

	function average(values) {
		if (!values.length) return 0;
		return values.reduce(function (a, b) { return a + b; }, 0) / values.length;
	}

	return {
		projectX: projectX,
		projectY: projectY,
		markerStyle: markerStyle,
		setStroke: setStroke,
		segment: segment,
		strokeSegment: strokeSegment,
		fillCircle: fillCircle,
		verticalGradient: verticalGradient,
		elementWidth: elementWidth,
		selectOnClick: selectOnClick,
		onEnter: onEnter,
		bindCoordinateInputs: bindCoordinateInputs,
		bindToggle: bindToggle,
		randomCoordinate: randomCoordinate,
		average: average
	};
})();
