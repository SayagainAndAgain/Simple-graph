var zeroX;
var zeroY;
var points=[];
var maxNumber=500;
var widthGraph=500;
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
		// if(inputX.value>500){inputX.value=500;}
		// if(inputY.value>500){inputY.value=500;}
		var width=ctx.canvas.width;
		editPoint.style.left=parseInt(inputX.value)*(width/maxNumber)+"px";
		editPoint.style.top=-parseInt(inputY.value)*(width/maxNumber)+20+"px";
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
		var width=ctx.canvas.width;
		var tempLeft=inputX.value*(width/maxNumber);
		var tempTop=inputY.value*(width/maxNumber);
		div.style='left:'+(+tempLeft)+'px; top: '+(-tempTop+20)+'px;';
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
			ctx.lineWidth=3;
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
		var width=ctx.canvas.width;
		ctx.clearRect(0, 0, width, width);
		ctx.beginPath();
		ctx.strokeStyle='lightblue';
		ctx.lineWidth=3;
		for (var i = 0; i < tempPoint.length; i++) {
			var div=tempPoint[i];
			var tempTitle=div.title.split(' : ');
			var tempLeft=parseInt(tempTitle[0])*(width/maxNumber);
			var tempTop=parseInt(tempTitle[1])*(width/maxNumber);
			div.style='left:'+(+tempLeft)+'px; top: '+(-tempTop+20)+'px;';
			if(i>1){
				var div2=tempPoint[i-1];
				var tempTitle2=div2.title.split(' : ');
				var tempLeft2=parseInt(tempTitle2[0])*(width/maxNumber);
				var tempTop2=parseInt(tempTitle2[1])*(width/maxNumber);
				var width=ctx.canvas.width;
				var x1=tempLeft2;
				var y1=width-tempTop2;
				var x2=tempLeft;
				var y2=width-tempTop;
			    ctx.moveTo(x1,y1);
			    ctx.lineTo(x2,y2);
			}
		}
		ctx.stroke();
	}
	editPointMove();
	inputX.focus();
	inputX.select();
})();
