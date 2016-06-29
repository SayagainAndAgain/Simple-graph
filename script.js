var zeroX;
var zeroY;
var points=[];
(function(){
	var canvas=document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	var main=document.getElementsByClassName('main')[0];
	var graph=document.getElementsByClassName('graph')[0];
	var editPoint=document.getElementById('editPoint');
	var inputX=document.getElementById('inputX');
	var inputY=document.getElementById('inputY');
	var button=document.getElementById('addButton');
	var randomButton=document.getElementById('addRandomButton');
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
	
	function editPointMove(){
		if(inputX.value>500){inputX.value=500;}
		if(inputY.value>500){inputY.value=500;}
		editPoint.style.left=inputX.value+"px";
		editPoint.style.top=-inputY.value+20+"px";
		editPoint.innerHTML='<br>'+inputX.value+':'+inputY.value;
	}
	function addPoint(){
		points.push({X:inputX.value,Y:inputY.value});
		var div=document.createElement('div');
		div.className='point';
		div.title=inputX.value+' : '+inputY.value;
		div.style='left:'+(+inputX.value)+'px; top: '+(-inputY.value+20)+'px;';
		graph.appendChild(div);
		editPointMove();
		inputX.focus();
		inputX.select();
		drawLine();
	}
	function addRandomPoint(){
		var randomeX=Math.round(Math.random()*500);
		var randomeY=Math.round(Math.random()*500);
		inputX.value=randomeX;
		inputY.value=randomeY;
		editPointMove();
		addPoint();
	}
	function drawLine(){
		if(points.length>1){
			ctx.beginPath();
			ctx.strokeStyle='lightblue';
			ctx.lineWidth=3;
			var width=ctx.canvas.width;
			var x1=points[points.length-2].X;
			var y1=width-points[points.length-2].Y;
			var x2=points[points.length-1].X;
			var y2=width-points[points.length-1].Y;
		    ctx.moveTo(x1,y1);
		    ctx.lineTo(x2,y2);
		    ctx.stroke();
		}
	}

	editPointMove();
	inputX.focus();
	inputX.select();
})();