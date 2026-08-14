var zeroX;
var zeroY;
var points=[];
var maxNumber=500;
var widthGraph=500;
(function(){
	var U=window.GraphUtils;
	var body=document.body;
	var canvas=document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var main=document.getElementsByClassName('main')[0];
	var graph=document.getElementsByClassName('graph')[0];
	var content=document.getElementsByClassName('content')[0];
	var data=document.getElementsByClassName('data')[0];
	var editPoint=document.getElementById('editPoint');
	var inputX=document.getElementById('inputX');
	var inputY=document.getElementById('inputY');
	var button=document.getElementById('addButton');
	var randomButton=document.getElementById('addRandomButton');
	var hideData=document.getElementsByClassName('hideData')[0];
	U.bindToggle(hideData,data,'hiden','+','-');
	window.addEventListener('resize',canvasResize);
	inputX.addEventListener('input',editPointMove);
	inputY.addEventListener('input',editPointMove);
	button.addEventListener('click',addPoint);
	randomButton.addEventListener('click',addRandomPoint);
	U.selectOnClick(inputX);
	U.selectOnClick(inputY);
	U.bindCoordinateInputs(inputX,inputY,addPoint);
	function canvasResize(){
		if( window.innerHeight<window.innerWidth ){
			content.style.width=window.innerHeight-60+"px";
			canvas.height=window.innerHeight-60;
			canvas.width=window.innerHeight-60;
		}
		else{
			content.style.width=window.innerWidth-60+"px";
			canvas.height=window.innerWidth-60;
			canvas.width=window.innerWidth-60;
		}
		redrawPoint();
		editPointMove();
		arrowsPositions();
	}
	function canvasWidth(){
		return U.elementWidth('.canvas');
	}
	function editPointMove(){
		var width=canvasWidth();
		editPoint.style=U.markerStyle(inputX.value,inputY.value,width,maxNumber);
		editPoint.style.zIndex=1500;
		editPoint.innerHTML='<br>'+inputX.value+':'+inputY.value;
	}
	function growMaxNumber(){
		var biggest=Math.max(parseInt(inputX.value),parseInt(inputY.value));
		if(biggest>maxNumber){
			maxNumber=biggest;
			inputX.max=maxNumber;
			inputY.max=maxNumber;
			redrawPoint();
		}
	}
	function addPoint(){
		growMaxNumber();
		points.push({X:inputX.value,Y:inputY.value});
		var div=document.createElement('div');
		div.className='point';
		div.title=inputX.value+' : '+inputY.value;
		div.style=U.markerStyle(inputX.value,inputY.value,canvasWidth(),maxNumber);
		graph.appendChild(div);
		editPointMove();
		inputX.focus();
		inputX.select();
		drawLine();
	}
	function addRandomPoint(){
		inputX.value=U.randomCoordinate(maxNumber);
		inputY.value=U.randomCoordinate(maxNumber);
		editPointMove();
		addPoint();
	}
	function coordsOf(div){
		var title=div.title.split(' : ');
		return {X:parseInt(title[0]),Y:parseInt(title[1])};
	}
	function connect(from,to,size){
		U.segment(ctx,
			U.projectX(from.X,size,maxNumber),U.projectY(from.Y,size,maxNumber),
			U.projectX(to.X,size,maxNumber),U.projectY(to.Y,size,maxNumber));
	}
	function drawLine(){
		if(points.length>1){
			ctx.beginPath();
			U.setStroke(ctx,'lightblue',1);
			connect(points[points.length-2],points[points.length-1],ctx.canvas.width);
			ctx.stroke();
		}
	}
	function redrawPoint(){
		var tempPoint=document.getElementsByClassName('point');
		var width=canvasWidth();
		ctx.clearRect(0, 0, width, width);
		ctx.beginPath();
		U.setStroke(ctx,'lightblue',1);
		for (var i = 0; i < tempPoint.length; i++) {
			var div=tempPoint[i];
			var coords=coordsOf(div);
			div.style=U.markerStyle(coords.X,coords.Y,width,maxNumber);
			if(i>1){
				connect(coordsOf(tempPoint[i-1]),coords,ctx.canvas.width);
			}
		}
		ctx.stroke();
	}
	function arrowsPositions(){
		var width=canvasWidth();
		var labelY=document.getElementById('labelY');
		labelY.style.top=-width-47+"px";
		// var arrowY=document.getElementById('arrowY');
		// arrowY.style.top=-width-66+"px";
		var labelX=document.getElementById('labelX');
		labelX.style.left=width-15+"px";
	}
	editPointMove();
	inputX.focus();
	inputX.select();
	arrowsPositions();
	canvasResize();
})();
// =====================================================
// НОВА ВЕРСІЯ - Epic Data Visualizer Pro
// =====================================================
window.initNewVersion = function() {
(function(){
const U = window.GraphUtils;
let newPoints = [];
let historyStack = [];
let maxNumber = 500;
let chartType = 'line';
let lineColor = '#00d4ff';
let lineWidth = 2;
let showGrid = true;
let animateLines = true;

const canvas = document.getElementById('mainCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
if (!ctx) return;

const newInputX = document.getElementById('newInputX');
const newInputY = document.getElementById('newInputY');
const newAddButton = document.getElementById('newAddButton');
const newRandomButton = document.getElementById('newRandomButton');
const themeToggle = document.getElementById('themeToggle');
const exportBtn = document.getElementById('exportBtn');
const sidebarToggle = document.getElementById('sidebarToggle');
const panelToggle = document.getElementById('panelToggle');
const sidebar = document.getElementById('sidebar');
const rightPanel = document.getElementById('rightPanel');
const lineColorInput = document.getElementById('lineColor');
const lineWidthInput = document.getElementById('lineWidth');
const showGridInput = document.getElementById('showGrid');
const clearAllBtn = document.getElementById('clearAllBtn');
const undoBtn = document.getElementById('undoBtn');
const pointsCountEl = document.getElementById('pointsCount');
const maxValueEl = document.getElementById('maxValue');
const minXEl = document.getElementById('minX');
const maxXEl = document.getElementById('maxX');
const minYEl = document.getElementById('minY');
const maxYEl = document.getElementById('maxY');
const avgXEl = document.getElementById('avgX');
const avgYEl = document.getElementById('avgY');
const pointsList = document.getElementById('pointsList');
const pointsListCount = document.getElementById('pointsListCount');
const toastContainer = document.getElementById('toastContainer');
const chartTypeBtns = document.querySelectorAll('.chart-type-btn');

if (!newInputX || !newInputY) return;

function initCanvas() {
const wrapper = document.querySelector('.canvas-wrapper');
if (wrapper) {
const size = Math.min(wrapper.offsetWidth, wrapper.offsetHeight);
canvas.width = size * 2;
canvas.height = size * 2;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';
ctx.scale(2, 2);
draw();
}
}

function project(point, size) {
return { x: U.projectX(point.X, size, maxNumber), y: U.projectY(point.Y, size, maxNumber) };
}

function drawGrid(size) {
U.setStroke(ctx, 'rgba(255, 255, 255, 0.1)', 0.5);
for (let i = 0; i <= 10; i++) {
const pos = (i / 10) * size;
U.strokeSegment(ctx, pos, 0, pos, size);
U.strokeSegment(ctx, 0, pos, size, pos);
}
}

function drawAxes(size) {
U.setStroke(ctx, 'rgba(255, 255, 255, 0.3)', 1);
U.strokeSegment(ctx, 0, size, size, size);
U.strokeSegment(ctx, 0, 0, 0, size);
}

function draw() {
const size = canvas.width / 2;
ctx.clearRect(0, 0, size, size);
if (showGrid) drawGrid(size);
drawAxes(size);
if (newPoints.length === 0) return;
U.setStroke(ctx, lineColor, lineWidth);
ctx.fillStyle = lineColor;
if (chartType === 'scatter') {
newPoints.forEach(point => {
const { x, y } = project(point, size);
U.fillCircle(ctx, x, y, 5);
});
} else if (chartType === 'bar') {
const barWidth = size / Math.max(newPoints.length, 1);
newPoints.forEach((point, i) => {
const x = i * barWidth;
const height = (point.Y / maxNumber) * size;
ctx.fillStyle = U.verticalGradient(ctx, lineColor, size, size - height, ['80', '']);
ctx.fillRect(x + 2, size - height, barWidth - 4, height);
});
} else if (chartType === 'area') {
ctx.beginPath(); ctx.moveTo(0, size);
newPoints.forEach(point => {
const { x, y } = project(point, size);
ctx.lineTo(x, y);
});
ctx.lineTo(size, size); ctx.closePath();
ctx.fillStyle = U.verticalGradient(ctx, lineColor, 0, size, ['60', '10']);
ctx.fill();
ctx.strokeStyle = lineColor; ctx.stroke();
} else {
ctx.beginPath();
newPoints.forEach((point, i) => {
const { x, y } = project(point, size);
if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
});
ctx.stroke();
newPoints.forEach(point => {
const { x, y } = project(point, size);
U.fillCircle(ctx, x, y, 4);
});
}
}

function addPoint() {
const x = parseInt(newInputX.value) || 0;
const y = parseInt(newInputY.value) || 0;
if (x > maxNumber || y > maxNumber) {
maxNumber = Math.max(x, y, maxNumber);
showToast('Максимум збільшено до ' + maxNumber, 'warning');
}
saveHistory();
newPoints.push({ X: x, Y: y });
refresh();
showToast('Точку додано!', 'success');
newInputX.value = 0; newInputY.value = 0; newInputX.focus();
}

function addRandomPoint() {
newInputX.value = U.randomCoordinate(maxNumber);
newInputY.value = U.randomCoordinate(maxNumber);
addPoint();
}

function saveHistory() {
historyStack.push([...newPoints]);
}

function refresh() {
updateStats(); updatePointsList(); draw();
}

function updateStats() {
if (newPoints.length === 0) {
minXEl.textContent = '0'; maxXEl.textContent = '0';
minYEl.textContent = '0'; maxYEl.textContent = '0';
avgXEl.textContent = '0'; avgYEl.textContent = '0';
pointsCountEl.textContent = '0'; maxValueEl.textContent = maxNumber;
return;
}
const xs = newPoints.map(p => p.X);
const ys = newPoints.map(p => p.Y);
minXEl.textContent = Math.min(...xs); maxXEl.textContent = Math.max(...xs);
minYEl.textContent = Math.min(...ys); maxYEl.textContent = Math.max(...ys);
avgXEl.textContent = U.average(xs).toFixed(1);
avgYEl.textContent = U.average(ys).toFixed(1);
pointsCountEl.textContent = newPoints.length; maxValueEl.textContent = maxNumber;
}

function updatePointsList() {
pointsListCount.textContent = newPoints.length;
if (newPoints.length === 0) { pointsList.innerHTML = '<div class="empty-message">Немає точок</div>'; return; }
pointsList.innerHTML = '';
newPoints.forEach((point, index) => {
const item = document.createElement('div');
item.className = 'point-item';
item.innerHTML = '<span class="point-coords">(' + point.X + ', ' + point.Y + ')</span><button class="point-delete" data-index="' + index + '">x</button>';
pointsList.appendChild(item);
});
pointsList.querySelectorAll('.point-delete').forEach(btn => {
btn.addEventListener('click', (e) => {
e.stopPropagation();
const index = parseInt(btn.dataset.index);
saveHistory();
newPoints.splice(index, 1);
refresh();
showToast('Точку видалено', 'warning');
});
});
}

function showToast(message, type) {
type = type || 'success';
const toast = document.createElement('div');
toast.className = 'toast ' + type;
toast.innerHTML = '<span>' + message + '</span>';
toastContainer.appendChild(toast);
setTimeout(() => { toast.style.animation = 'slideIn 0.3s ease reverse forwards'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function exportData() {
if (newPoints.length === 0) { showToast('Немає даних для експорту', 'error'); return; }
const csv = newPoints.map(p => p.X + ',' + p.Y).join('\n');
const blob = new Blob([csv], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'points.csv'; a.click();
URL.revokeObjectURL(url);
showToast('Дані експортовано!', 'success');
}

function clearAll() {
if (newPoints.length === 0) return;
saveHistory();
newPoints = [];
refresh();
showToast('Всі точки очищено', 'warning');
}

function undo() {
if (historyStack.length === 0) { showToast('Немає що скасовувати', 'error'); return; }
newPoints = historyStack.pop();
refresh();
showToast('Скасовано', 'success');
}

function toggleTheme() {
const currentTheme = document.documentElement.getAttribute('data-theme');
const newTheme = currentTheme === 'light' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', newTheme);
themeToggle.querySelector('span:first-child').textContent = newTheme === 'light' ? '☀️' : '🌙';
showToast('Тема: ' + (newTheme === 'light' ? 'Світла' : 'Темна'), 'success');
}

newAddButton.addEventListener('click', addPoint);
newRandomButton.addEventListener('click', addRandomPoint);
exportBtn.addEventListener('click', exportData);
clearAllBtn.addEventListener('click', clearAll);
undoBtn.addEventListener('click', undo);
themeToggle.addEventListener('click', toggleTheme);
lineColorInput.addEventListener('input', (e) => { lineColor = e.target.value; draw(); });
lineWidthInput.addEventListener('input', (e) => { lineWidth = parseInt(e.target.value); draw(); });
showGridInput.addEventListener('change', (e) => { showGrid = e.target.checked; draw(); });
chartTypeBtns.forEach(btn => {
btn.addEventListener('click', () => {
chartTypeBtns.forEach(b => b.classList.remove('active'));
btn.classList.add('active');
chartType = btn.dataset.type;
draw();
showToast('Тип графіка: ' + btn.querySelector('span:last-child').textContent, 'success');
});
});
U.bindToggle(sidebarToggle, sidebar, 'collapsed', '›', '‹');
U.bindToggle(panelToggle, rightPanel, 'collapsed', '‹', '›');
U.bindCoordinateInputs(newInputX, newInputY, addPoint);
document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.keyCode === 90) { e.preventDefault(); undo(); } });
window.addEventListener('resize', () => { initCanvas(); });
initCanvas(); updateStats();
})();
};
