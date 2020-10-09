var gameWorker = new Worker('gameworker.js',{type:"module"});//enable modules
//setup dom

import TWEEN from '/sortacraft/tween.js'
var fromTween = {op:1,reset:false};
var canvas;
var toTween = {op:0,reset:false};//invisible
var tween;
var tweenRunning = false;
window["downloadWorld"] = function(){
  gameWorker.postMessage({type:'downloadGame'});
}
function updateTime(){
  requestAnimationFrame(updateTime);
  gameWorker.postMessage({type:'time_update',time:performance.now()})
}
function prepCanvas(){
  canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  document.body.appendChild(canvas);
  const offscreen = canvas.transferControlToOffscreen();
  gameWorker.postMessage({type:'main',canvas:offscreen,width:window.innerWidth,height:window.innerHeight},[offscreen]);//send canvas and init
  updateTime();
}

gameWorker.onmessage = function(e){
  if(e.data[0]=='fps'){
    document.getElementById('fpsEle').innerText = 'FPS: '+e.data[1];
  }
  if(e.data[0]=='debug'){
    document.getElementById('debug').innerText = e.data[1];
  }
  if(e.data[0]=='chunks'){
    download('my_world.dat',JSON.stringify(e.data[1]))
  }
  if(e.data[0]=='progress'){
    document.getElementById('loader').style.width = (e.data[1]+1)+'%';
  }
  if(e.data[0]=='done'){
    document.getElementById('overlay').style.display='none';
  //  document.getElementById('loader_outer').style.display='none';
  var outr = document.getElementById('loader_outer');
  outr.style.left = '-5%';
  outr.style.top = '0%';
  document.getElementById('loader_title').style.display= 'none'
    canvas.style.display='block';
  }
  if(e.data[0]=='break_animation'){
    var fromRotation = {z:0,y:0};
    var toRotation = {z:-60,y:-60};
    var breaktween = new TWEEN.Tween(fromRotation).to(toRotation,125).onUpdate(function(){
      document.getElementById('handItem').style.transform = 'rotateY('+fromRotation.y+'deg) rotateZ(50deg) rotateX('+fromRotation.z+'deg)';
    }).start();
    var fromRotation2 = {z:0,y:-60};
    var toRotation2 = {z:-60,y:0};
    var breakundo = new TWEEN.Tween(toRotation2).to(fromRotation2,125).onUpdate(function(){
        document.getElementById('handItem').style.transform = 'rotateY('+fromRotation2.y+'deg) rotateZ(50deg) rotateX('+toRotation2.z+'deg)';
    }).delay(125).start();
  }
  if(e.data[0]=='hand_uv'){
//    document.getElementById('handItem').style.backgroundImage ='url(textures.png)';
//    document.getElementById('handItem').style.backgroundPosition  = -((e.data[1]-1)*16)+"px "+48+"px";//set "uv"
    //calculate uv by removing 1 (for 0 min) and multiply by 16 for px position (0 = y pos)
  }
  if(e.data[0]=='voxel_title'){
    /*
    document.getElementById('voxelNameOuter').style.display='block';
    fromTween.op = 1;//reset
    document.getElementById('voxelName').innerText = e.data[1];
    if(tweenRunning==true){
      tween.stop();
      tweenRunning = false;
      fromTween.op = 1;
      document.getElementById('voxelNameOuter').style.opacity = 1;
    }
       tween = new TWEEN.Tween(fromTween).to(toTween,1000).onUpdate(function(){
        document.getElementById('voxelNameOuter').style.opacity =fromTween.op;
        tweenRunning=true;
      }).delay(1000).start();//start tween
*/
var cele = document.getElementsByClassName('voxelNameOuter');
for(var i = 0;i<cele.length;i++){

  document.body.removeChild(cele[i]);//clear out
}
var ele = document.createElement('div');
var eleInner = document.createElement('div');
eleInner.setAttribute('class','voxelName');
ele.setAttribute('class','voxelNameOuter');
ele.style.display='block';
ele.appendChild(eleInner);
eleInner.innerText = e.data[1];//block name
document.body.appendChild(ele);
var fromTween = {op:1};
var toTween = {op:0}
var tween = new TWEEN.Tween(fromTween).to(toTween,1000).onUpdate(function(){
  ele.style.opacity = fromTween.op;
}).delay(1000).onComplete(function(){
  try{
    document.body.removeChild(ele)
  }catch(err){}
}).start();
/*
setTimeout(function(){
  document.body.removeChild(ele);
},1000)
*/
  }
}

function tweenLoop(){
  requestAnimationFrame(tweenLoop);
  TWEEN.update();
}
tweenLoop();
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
//event handlers
var touchPosition = {x:0,y:0};
var lastTouchPos = {x:0,y:0}
var touchMove = false;
window.addEventListener('resize',function(e){
  gameWorker.postMessage({type:'resize',width:window.innerWidth,height:window.innerHeight})
  updateCrosshair();
});
document.body.addEventListener('keydown',function(e){
  gameWorker.postMessage({type:'keydown',key:e.key});
});
document.body.addEventListener('keyup',function(e){
  gameWorker.postMessage({type:'keyup',key:e.key});
});
document.body.addEventListener('touchstart',function(e){
  var y = e.changedTouches[0].pageY || 0,x = e.changedTouches[0].pageX || 0;
  touchPosition.x =x;
  touchPosition.y = y;
  lastTouchPos = touchPosition;//reset
  touchMove = true;
});
document.body.addEventListener('touchend',function(e){
  touchMove = false;
});
document.body.addEventListener('touchmove',function(e){
  var y = e.changedTouches[0].pageY || 0,x = e.changedTouches[0].pageX || 0;
  var posX =x - lastTouchPos.x;
  var posY =y - lastTouchPos.y;
  gameWorker.postMessage({type:'mousemove',type2:'touch',moveX:posX,moveY:posY});//simulate a mouse move
  lastTouchPos.x = e.clientX;
  lastTouchPos.y = e.clientY;
});
//key updates
document.body.addEventListener('mousedown',function(e){
  if(e.button==0){
  document.body.requestPointerLock();//lock pointer
  }
  gameWorker.postMessage({type:'mousedown',buttonPressed:e.button});
},false);
document.body.addEventListener('contextmenu',function(e){e.preventDefault();e.stopPropagation();},false);//prevent contextmenu when placing/brekin
//mouse press
document.body.addEventListener('mousemove',function(e){
  gameWorker.postMessage({type:'mousemove',moveX:e.movementX,moveY:e.movementY});
});
//move mouse
document.body.addEventListener('wheel',function(e){
  gameWorker.postMessage({type:'wheel',deltaY:e.deltaY});
});
//mouse scroll

//end event handlers
function fixEventPost(e){
  return JSON.parse(JSON.stringify(e));//fix bug
}
function updateCrosshair(){
  document.getElementById('crosshairX').style.left ='calc(50% - 10px)';
  document.getElementById('crosshairX').style.top ='calc(50% - 3px)';
  document.getElementById('crosshairY').style.left ='calc(50% - 3px)';
  document.getElementById('crosshairY').style.top ='calc(50% - 10px)';//update crosshair
}
prepCanvas();
