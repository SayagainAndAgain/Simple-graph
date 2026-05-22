var zeroX;
var zeroY;
var points=[];
var maxNumber=500;
var widthGraph=500;
(function(){
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
	hideData.addEventListener('click',toggleHiden);
	window.addEventListener('resize',canvasResize);
	inputX.addEventListener('input',editPointMove);
	inputY.addEventListener('input',editPointMove);
	button.addEventListener('click',addPoint);
	randomButton.addEventListener('click',addRandomPoint);
	inputX.addEventListener('click',function(){this.select();});
	inputY.addEventListener('click',function(){this.select();});
	inputX.addEventListener('keydown',function(e){
		if(e.keyCode==13){
			inputY.focus();
			inputY.select();
		}
	});
	inputY.addEventListener('keydown',function(e){
		if(e.keyCode==13){
			addPoint()
		}
	});
	function toggleHiden(){
		data.classList.toggle('hiden');
		if(hideData.innerHTML=='-'){
			hideData.innerHTML='+';
		}
		else{
			hideData.innerHTML='-';
		}
	}
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
	function editPointMove(){
		var width=document.getElementsByClassName('canvas')[0].offsetWidth;
		editPoint.style.left=parseInt(inputX.value)*(width/maxNumber)-1+"px";
		editPoint.style.top=-parseInt(inputY.value)*(width/maxNumber)-12+"px";
		editPoint.innerHTML='<br>'+inputX.value+':'+inputY.value;
	}
	function addPoint(){
		if(parseInt(inputX.value)>maxNumber) {
			maxNumber=inputX.value;
			inputX.max=maxNumber;
			inputY.max=maxNumber;
			redrawPoint();
		}
		if(parseInt(inputY.value)>maxNumber) {
			maxNumber=inputY.value;
			inputX.max=maxNumber;
			inputY.max=maxNumber;
			redrawPoint();
		}
		points.push({X:inputX.value,Y:inputY.value});
		var div=document.createElement('div');
		div.className='point';
		div.title=inputX.value+' : '+inputY.value;
		var width=document.getElementsByClassName('canvas')[0].offsetWidth;
		var tempLeft=inputX.value*(width/maxNumber);
		var tempTop=inputY.value*(width/maxNumber);
		div.style='left:'+(+tempLeft-1)+'px; top: '+(-tempTop-12)+'px;';
		graph.appendChild(div);
		editPointMove();
		inputX.focus();
		inputX.select();
		drawLine();
	}
	function addRandomPoint(){
		var randomeX=Math.round(Math.random()*maxNumber);
		var randomeY=Math.round(Math.random()*maxNumber);
		inputX.value=randomeX;
		inputY.value=randomeY;
		editPointMove();
		addPoint();
	}
	function drawLine(){
		if(points.length>1){
			var width=ctx.canvas.width;
			ctx.beginPath();
			ctx.strokeStyle='lightblue';
			ctx.lineWidth=1;
			var width=ctx.canvas.width;
			var x1=points[points.length-2].X*(width/maxNumber);
			var y1=width-points[points.length-2].Y*(width/maxNumber);
			var x2=points[points.length-1].X*(width/maxNumber);
			var y2=width-points[points.length-1].Y*(width/maxNumber);
		    ctx.moveTo(x1,y1);
		    ctx.lineTo(x2,y2);
		    ctx.stroke();
		}
	}
	function redrawPoint(){
		var tempPoint=document.getElementsByClassName('point');
		var width=document.getElementsByClassName('canvas')[0].offsetWidth;
		ctx.clearRect(0, 0, width, width);
		ctx.beginPath();
		ctx.strokeStyle='lightblue';
		ctx.lineWidth=1;
		for (var i = 0; i < tempPoint.length; i++) {
			var div=tempPoint[i];
			var tempTitle=div.title.split(' : ');
			var tempLeft=parseInt(tempTitle[0])*(width/maxNumber);
			var tempTop=parseInt(tempTitle[1])*(width/maxNumber);
			div.style='left:'+(+tempLeft-1)+'px; top: '+(-tempTop-12)+'px;';
			if(i>1){
				var div2=tempPoint[i-1];
				var tempTitle2=div2.title.split(' : ');
				var ctxWidth=ctx.canvas.width;
				var tempLeft2=parseInt(tempTitle2[0])*(ctxWidth/maxNumber);
				var tempTop2=parseInt(tempTitle2[1])*(ctxWidth/maxNumber);
				var x1=tempLeft2;
				var y1=ctxWidth-tempTop2;
				var x2=parseInt(tempTitle[0])*(ctxWidth/maxNumber);;
				var y2=ctxWidth-parseInt(tempTitle[1])*(ctxWidth/maxNumber);
			    ctx.moveTo(x1,y1);
			    ctx.lineTo(x2,y2);
			}
		}
		ctx.stroke();
	}
	function arrowsPositions(){
		var width=document.getElementsByClassName('canvas')[0].offsetWidth;
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

function draw() {
const size = canvas.width / 2;
ctx.clearRect(0, 0, size, size);
if (showGrid) {
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
ctx.lineWidth = 0.5;
for (let i = 0; i <= 10; i++) {
const pos = (i / 10) * size;
ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, size); ctx.stroke();
ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(size, pos); ctx.stroke();
}
}
ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
ctx.lineWidth = 1;
ctx.beginPath(); ctx.moveTo(0, size); ctx.lineTo(size, size); ctx.stroke();
ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, size); ctx.stroke();
if (newPoints.length === 0) return;
ctx.strokeStyle = lineColor;
ctx.lineWidth = lineWidth;
ctx.fillStyle = lineColor;
if (chartType === 'scatter') {
newPoints.forEach(point => {
const x = (point.X / maxNumber) * size;
const y = size - (point.Y / maxNumber) * size;
ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
});
} else if (chartType === 'bar') {
const barWidth = size / Math.max(newPoints.length, 1);
newPoints.forEach((point, i) => {
const x = i * barWidth;
const height = (point.Y / maxNumber) * size;
const gradient = ctx.createLinearGradient(x, size, x, size - height);
gradient.addColorStop(0, lineColor + '80');
gradient.addColorStop(1, lineColor);
ctx.fillStyle = gradient;
ctx.fillRect(x + 2, size - height, barWidth - 4, height);
});
} else if (chartType === 'area') {
ctx.beginPath(); ctx.moveTo(0, size);
newPoints.forEach((point, i) => {
const x = (point.X / maxNumber) * size;
const y = size - (point.Y / maxNumber) * size;
ctx.lineTo(x, y);
});
ctx.lineTo(size, size); ctx.closePath();
const gradient = ctx.createLinearGradient(0, 0, 0, size);
gradient.addColorStop(0, lineColor + '60');
gradient.addColorStop(1, lineColor + '10');
ctx.fillStyle = gradient; ctx.fill();
ctx.strokeStyle = lineColor; ctx.stroke();
} else {
ctx.beginPath();
newPoints.forEach((point, i) => {
const x = (point.X / maxNumber) * size;
const y = size - (point.Y / maxNumber) * size;
if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
});
ctx.stroke();
newPoints.forEach(point => {
const x = (point.X / maxNumber) * size;
const y = size - (point.Y / maxNumber) * size;
ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
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
historyStack.push([...newPoints]);
newPoints.push({ X: x, Y: y });
updateStats(); updatePointsList(); draw();
showToast('Точку додано!', 'success');
newInputX.value = 0; newInputY.value = 0; newInputX.focus();
}

function addRandomPoint() {
newInputX.value = Math.round(Math.random() * maxNumber);
newInputY.value = Math.round(Math.random() * maxNumber);
addPoint();
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
avgXEl.textContent = (xs.reduce((a, b) => a + b, 0) / xs.length).toFixed(1);
avgYEl.textContent = (ys.reduce((a, b) => a + b, 0) / ys.length).toFixed(1);
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
historyStack.push([...newPoints]);
newPoints.splice(index, 1);
updateStats(); updatePointsList(); draw();
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
historyStack.push([...newPoints]);
newPoints = [];
updateStats(); updatePointsList(); draw();
showToast('Всі точки очищено', 'warning');
}

function undo() {
if (historyStack.length === 0) { showToast('Немає що скасовувати', 'error'); return; }
newPoints = historyStack.pop();
updateStats(); updatePointsList(); draw();
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
sidebarToggle.addEventListener('click', () => { sidebar.classList.toggle('collapsed'); sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹'; });
panelToggle.addEventListener('click', () => { rightPanel.classList.toggle('collapsed'); panelToggle.textContent = rightPanel.classList.contains('collapsed') ? '‹' : '›'; });
newInputX.addEventListener('keydown', (e) => { if (e.keyCode === 13) { newInputY.focus(); newInputY.select(); } });
newInputY.addEventListener('keydown', (e) => { if (e.keyCode === 13) addPoint(); });
document.addEventListener('keydown', (e) => { if (e.ctrlKey && e.keyCode === 90) { e.preventDefault(); undo(); } });
window.addEventListener('resize', () => { initCanvas(); });
initCanvas(); updateStats();
})();
};
