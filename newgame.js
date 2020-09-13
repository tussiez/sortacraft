var gameWorker = new Worker('gameworker.js',{type:"module"});//enable modules
//setup dom
window["downloadWorld"] = function(){
  gameWorker.postMessage({type:'downloadGame'});
}
function prepCanvas(){
  let canvas = document.createElement('canvas');
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  document.body.appendChild(canvas);
  const offscreen = canvas.transferControlToOffscreen();
  gameWorker.postMessage({type:'main',canvas:offscreen,width:window.innerWidth,height:window.innerHeight},[offscreen]);//send canvas and init
}
gameWorker.onmessage = function(e){
  if(e.data[0]=='fps'){
    document.getElementById('fpsEle').innerText = 'FPS: '+e.data[1];
  }
  if(e.data[0]=='chunks'){
    download('my_world.dat',JSON.stringify(e.data[1]))
  }
}
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
  gameWorker.postMessage({type:'wheel',event:fixEventPost(e)});
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
