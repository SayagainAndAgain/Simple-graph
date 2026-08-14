var zeroX;
var zeroY;
var points=[];
var maxNumber=500;
var widthGraph=500;

// =====================================================
// Спільні утиліти для обробки помилок
// =====================================================
function showErrorBanner(message){
	var banner=document.getElementById('errorBanner');
	if(!banner){
		var host=document.body||document.documentElement;
		if(!host) return;
		banner=document.createElement('div');
		banner.id='errorBanner';
		banner.className='error-banner';
		banner.title='Натисніть, щоб приховати';
		banner.addEventListener('click',function(){banner.classList.remove('visible');});
		host.appendChild(banner);
	}
	banner.textContent=message;
	banner.classList.add('visible');
}

function reportError(context,error){
	var details=error&&error.message?error.message:String(error);
	console.error('[Simple-graph] '+context+': '+details,error);
	showErrorBanner(context+': '+details);
}

function requireById(id){
	var element=document.getElementById(id);
	if(!element) throw new Error('Не знайдено обов\'язковий елемент #'+id);
	return element;
}

function requireByClass(className,index){
	var element=document.getElementsByClassName(className)[index||0];
	if(!element) throw new Error('Не знайдено обов\'язковий елемент .'+className);
	return element;
}

// Повертає число або null, якщо значення не є коректною координатою.
function parseCoordinate(rawValue){
	if(typeof rawValue!=='string'&&typeof rawValue!=='number') return null;
	var trimmed=String(rawValue).trim();
	if(trimmed==='') return null;
	var value=Number(trimmed);
	if(!isFinite(value)) return null;
	return Math.round(value);
}

// Обгортка для обробників подій: помилка не зникає непомітно.
function guard(context,handler){
	return function(){
		try{
			return handler.apply(this,arguments);
		}
		catch(error){
			reportError(context,error);
		}
	};
}

// =====================================================
// СТАРА ВЕРСІЯ
// =====================================================
function initOldVersion(){
	var body=document.body;
	var canvas=requireById('canvas');
	var ctx=canvas.getContext("2d");
	if(!ctx) throw new Error('Canvas 2D-контекст недоступний у цьому браузері');
	var main=requireByClass('main');
	var graph=requireByClass('graph');
	var content=requireByClass('content');
	var data=requireByClass('data');
	var editPoint=requireById('editPoint');
	var inputX=requireById('inputX');
	var inputY=requireById('inputY');
	var button=requireById('addButton');
	var randomButton=requireById('addRandomButton');
	var hideData=requireByClass('hideData');
	hideData.addEventListener('click',guard('Не вдалося перемкнути панель',toggleHiden));
	window.addEventListener('resize',guard('Не вдалося перемалювати графік',canvasResize));
	inputX.addEventListener('input',guard('Не вдалося оновити позицію точки',editPointMove));
	inputY.addEventListener('input',guard('Не вдалося оновити позицію точки',editPointMove));
	button.addEventListener('click',guard('Не вдалося додати точку',addPoint));
	randomButton.addEventListener('click',guard('Не вдалося додати випадкову точку',addRandomPoint));
	inputX.addEventListener('click',function(){this.select();});
	inputY.addEventListener('click',function(){this.select();});
	inputX.addEventListener('keydown',function(e){
		if(e.keyCode==13){
			inputY.focus();
			inputY.select();
		}
	});
	inputY.addEventListener('keydown',guard('Не вдалося додати точку',function(e){
		if(e.keyCode==13){
			addPoint()
		}
	}));
	function readInputs(){
		var x=parseCoordinate(inputX.value);
		var y=parseCoordinate(inputY.value);
		if(x===null||y===null){
			showErrorBanner('Введіть числові значення X та Y');
			return null;
		}
		if(x<0||y<0){
			showErrorBanner('Координати не можуть бути відʼємними');
			return null;
		}
		return {X:x,Y:y};
	}
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
		var width=requireByClass('canvas').offsetWidth;
		var x=parseCoordinate(inputX.value);
		var y=parseCoordinate(inputY.value);
		if(x===null||y===null) return;
		editPoint.style.left=x*(width/maxNumber)-1+"px";
		editPoint.style.top=-y*(width/maxNumber)-12+"px";
		editPoint.innerHTML='<br>'+x+':'+y;
	}
	function addPoint(){
		var point=readInputs();
		if(!point) return;
		if(point.X>maxNumber||point.Y>maxNumber) {
			maxNumber=Math.max(point.X,point.Y);
			inputX.max=maxNumber;
			inputY.max=maxNumber;
			redrawPoint();
		}
		points.push({X:point.X,Y:point.Y});
		var div=document.createElement('div');
		div.className='point';
		div.title=point.X+' : '+point.Y;
		var width=requireByClass('canvas').offsetWidth;
		var tempLeft=point.X*(width/maxNumber);
		var tempTop=point.Y*(width/maxNumber);
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
		var width=requireByClass('canvas').offsetWidth;
		ctx.clearRect(0, 0, width, width);
		ctx.beginPath();
		ctx.strokeStyle='lightblue';
		ctx.lineWidth=1;
		for (var i = 0; i < tempPoint.length; i++) {
			var div=tempPoint[i];
			var tempTitle=div.title.split(' : ');
			var pointX=parseCoordinate(tempTitle[0]);
			var pointY=parseCoordinate(tempTitle[1]);
			if(pointX===null||pointY===null) continue;
			var tempLeft=pointX*(width/maxNumber);
			var tempTop=pointY*(width/maxNumber);
			div.style='left:'+(+tempLeft-1)+'px; top: '+(-tempTop-12)+'px;';
			if(i>1){
				var div2=tempPoint[i-1];
				var tempTitle2=div2.title.split(' : ');
				var prevX=parseCoordinate(tempTitle2[0]);
				var prevY=parseCoordinate(tempTitle2[1]);
				if(prevX===null||prevY===null) continue;
				var ctxWidth=ctx.canvas.width;
				var x1=prevX*(ctxWidth/maxNumber);
				var y1=ctxWidth-prevY*(ctxWidth/maxNumber);
				var x2=pointX*(ctxWidth/maxNumber);
				var y2=ctxWidth-pointY*(ctxWidth/maxNumber);
			    ctx.moveTo(x1,y1);
			    ctx.lineTo(x2,y2);
			}
		}
		ctx.stroke();
	}
	function arrowsPositions(){
		var width=requireByClass('canvas').offsetWidth;
		var labelY=requireById('labelY');
		labelY.style.top=-width-47+"px";
		var labelX=requireById('labelX');
		labelX.style.left=width-15+"px";
	}
	editPointMove();
	inputX.focus();
	inputX.select();
	arrowsPositions();
	canvasResize();
}

try{
	initOldVersion();
}
catch(error){
	reportError('Не вдалося запустити стару версію графіка',error);
}

// =====================================================
// НОВА ВЕРСІЯ - Epic Data Visualizer Pro
// =====================================================
window.initNewVersion = function() {
try{
initNewVersionInternal();
}
catch(error){
reportError('Не вдалося запустити нову версію візуалізатора',error);
}
};

function initNewVersionInternal(){
let newPoints = [];
let historyStack = [];
let maxNumber = 500;
let chartType = 'line';
let lineColor = '#00d4ff';
let lineWidth = 2;
let showGrid = true;
let animateLines = true;

const canvas = requireById('mainCanvas');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Canvas 2D-контекст недоступний у цьому браузері');

const newInputX = requireById('newInputX');
const newInputY = requireById('newInputY');
const newAddButton = requireById('newAddButton');
const newRandomButton = requireById('newRandomButton');
const themeToggle = requireById('themeToggle');
const exportBtn = requireById('exportBtn');
const sidebarToggle = requireById('sidebarToggle');
const panelToggle = requireById('panelToggle');
const sidebar = requireById('sidebar');
const rightPanel = requireById('rightPanel');
const lineColorInput = requireById('lineColor');
const lineWidthInput = requireById('lineWidth');
const showGridInput = requireById('showGrid');
const clearAllBtn = requireById('clearAllBtn');
const undoBtn = requireById('undoBtn');
const pointsCountEl = requireById('pointsCount');
const maxValueEl = requireById('maxValue');
const minXEl = requireById('minX');
const maxXEl = requireById('maxX');
const minYEl = requireById('minY');
const maxYEl = requireById('maxY');
const avgXEl = requireById('avgX');
const avgYEl = requireById('avgY');
const pointsList = requireById('pointsList');
const pointsListCount = requireById('pointsListCount');
const toastContainer = requireById('toastContainer');
const chartTypeBtns = document.querySelectorAll('.chart-type-btn');
if (chartTypeBtns.length === 0) throw new Error('Не знайдено кнопки вибору типу графіка');

function initCanvas() {
const wrapper = document.querySelector('.canvas-wrapper');
if (!wrapper) throw new Error('Не знайдено обов\'язковий елемент .canvas-wrapper');
const size = Math.min(wrapper.offsetWidth, wrapper.offsetHeight);
canvas.width = size * 2;
canvas.height = size * 2;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';
ctx.setTransform(2, 0, 0, 2, 0, 0);
draw();
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
const x = parseCoordinate(newInputX.value);
const y = parseCoordinate(newInputY.value);
if (x === null || y === null) { showToast('Введіть числові значення X та Y', 'error'); return; }
if (x < 0 || y < 0) { showToast('Координати не можуть бути відʼємними', 'error'); return; }
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
btn.addEventListener('click', guard('Не вдалося видалити точку', (e) => {
e.stopPropagation();
const index = parseCoordinate(btn.dataset.index);
if (index === null || index < 0 || index >= newPoints.length) throw new Error('Некоректний індекс точки: ' + btn.dataset.index);
historyStack.push([...newPoints]);
newPoints.splice(index, 1);
updateStats(); updatePointsList(); draw();
showToast('Точку видалено', 'warning');
}));
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
let url = null;
try {
const blob = new Blob([csv], { type: 'text/csv' });
url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url; a.download = 'points.csv';
document.body.appendChild(a);
a.click();
a.remove();
showToast('Дані експортовано!', 'success');
}
catch (error) {
showToast('Не вдалося експортувати дані: ' + error.message, 'error');
throw error;
}
finally {
if (url) setTimeout(() => URL.revokeObjectURL(url), 0);
}
}

function clearAll() {
if (newPoints.length === 0) { showToast('Немає точок для очищення', 'warning'); return; }
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
const themeIcon = themeToggle.querySelector('span:first-child');
if (!themeIcon) throw new Error('Кнопка теми не містить іконки');
themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
showToast('Тема: ' + (newTheme === 'light' ? 'Світла' : 'Темна'), 'success');
}

newAddButton.addEventListener('click', guard('Не вдалося додати точку', addPoint));
newRandomButton.addEventListener('click', guard('Не вдалося додати випадкову точку', addRandomPoint));
exportBtn.addEventListener('click', guard('Не вдалося експортувати дані', exportData));
clearAllBtn.addEventListener('click', guard('Не вдалося очистити точки', clearAll));
undoBtn.addEventListener('click', guard('Не вдалося скасувати дію', undo));
themeToggle.addEventListener('click', guard('Не вдалося змінити тему', toggleTheme));
lineColorInput.addEventListener('input', guard('Не вдалося змінити колір', (e) => { lineColor = e.target.value; draw(); }));
lineWidthInput.addEventListener('input', guard('Не вдалося змінити товщину лінії', (e) => {
const parsed = parseCoordinate(e.target.value);
if (parsed === null || parsed < 1) throw new Error('Некоректна товщина лінії: ' + e.target.value);
lineWidth = parsed;
draw();
}));
showGridInput.addEventListener('change', guard('Не вдалося перемкнути сітку', (e) => { showGrid = e.target.checked; draw(); }));
chartTypeBtns.forEach(btn => {
btn.addEventListener('click', guard('Не вдалося змінити тип графіка', () => {
const type = btn.dataset.type;
if (!type) throw new Error('Кнопка типу графіка без data-type');
chartTypeBtns.forEach(b => b.classList.remove('active'));
btn.classList.add('active');
chartType = type;
draw();
const label = btn.querySelector('span:last-child');
showToast('Тип графіка: ' + (label ? label.textContent : type), 'success');
}));
});
sidebarToggle.addEventListener('click', guard('Не вдалося перемкнути бічну панель', () => { sidebar.classList.toggle('collapsed'); sidebarToggle.textContent = sidebar.classList.contains('collapsed') ? '›' : '‹'; }));
panelToggle.addEventListener('click', guard('Не вдалося перемкнути праву панель', () => { rightPanel.classList.toggle('collapsed'); panelToggle.textContent = rightPanel.classList.contains('collapsed') ? '‹' : '›'; }));
newInputX.addEventListener('keydown', (e) => { if (e.keyCode === 13) { newInputY.focus(); newInputY.select(); } });
newInputY.addEventListener('keydown', guard('Не вдалося додати точку', (e) => { if (e.keyCode === 13) addPoint(); }));
document.addEventListener('keydown', guard('Не вдалося скасувати дію', (e) => { if (e.ctrlKey && e.keyCode === 90) { e.preventDefault(); undo(); } }));
window.addEventListener('resize', guard('Не вдалося перемалювати графік', () => { initCanvas(); }));
initCanvas(); updateStats();
}
