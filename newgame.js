var gameWorker = new Worker('gameworker.js',{type:"module"});//enable modules
//setup dom
window["gameWorker"]=gameWorker;
import TWEEN from '/tween.js'
var canMove = true;
var fromTween = {op:1,reset:false};
var canvas;
var canLock = true;
var toTween = {op:0,reset:false};//invisible
var tween;
var tweenRunning = false;
window["downloadWorld"] = function(){
  gameWorker.postMessage({type:'downloadGame'});
}
function updateTime(){
  requestAnimationFrame(updateTime);
  gameWorker.postMessage({type:'time_update',time:performance.now()});//forgot why I needed thislol
}
window["gravity"]=function(toggleState){
  gameWorker.postMessage({type:'toggleGravity',"state":toggleState});

  //go to togglegrav in gamewoker
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
    if(e.data[2]=='log'){
      document.getElementById('debug').style.display='block';
    document.getElementById('debug').innerHTML+= '<br>'+e.data[1];
    }
    if(e.data[2]=='close'){
      document.getElementById('debug').style.display='none';
    }
  
  }
  if(e.data[0]=='chunks'){
    download('my_world.dat',JSON.stringify(e.data[1]))
  }
  if(e.data[0]=='progress'){
    document.getElementById('loader').style.width = (e.data[1]+1)+'%';
    document.getElementById('loader_outer').style.display='block';
    if(e.data[2]){
    document.getElementById('blockCount').innerHTML =(e.data[2]);
    }//reduce lag
  }
  if(e.data[0]=='done'){
    document.getElementById('overlay').style.display='none';
  //  document.getElementById('loader_outer').style.display='none';
  var outr = document.getElementById('loader_outer');
  outr.style.left = '-5%';
  outr.style.top = '0%';
  outr.style.display = 'none';
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
var graphicsMode = 'fancy';
window["switchGraphicsType"]=function(e){

  if(graphicsMode == 'fancy'){
   graphicsMode ='faster'
e.innerHTML = 'Graphics: Faster';
    gameWorker.postMessage({type:'graphicsFaster'});
  }
  else if(graphicsMode =='faster'){
    graphicsMode = 'fancy';
    e.innerHTML = 'Graphics: Fancy'
    gameWorker.postMessage({type:'graphicsFancy'});
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
  if(canLock==true&&canMove==true){
  gameWorker.postMessage({type:'keydown',key:e.key});
  }
});
document.body.addEventListener('keyup',function(e){
  if(e.key=='`'){

    if(document.getElementById('gameoptions').style.display=='none'){
      canMove = false;
    document.getElementById('gameoptions').style.display= 'block';
    document.exitPointerLock();
    }else{
      canMove = true;
      document.getElementById('gameoptions').style.display = 'none';
      document.body.requestPointerLock();
    }
  }
    if(e.key=='e'){
    //open inv
    var iv = document.getElementById('inventory')
    if(iv.style.display==='none'){
      iv.style.display='block';
      canLock = false;
      canMove = false;
      document.exitPointerLock();
  
    }else{
      iv.style.display='none';
      canLock = true;
      canMove = true;
  document.body.requestPointerLock();
    }

  }

  gameWorker.postMessage({type:'keyup',key:e.key});
  
});

//key updates
document.body.addEventListener('mousedown',function(e){
  if(e.button==0&&canLock==true&&event.target == canvas){

  document.body.requestPointerLock();//lock pointer
  }
  if(canLock==true){
  gameWorker.postMessage({type:'mousedown',buttonPressed:e.button});
  }
},false);
document.body.addEventListener('contextmenu',function(e){e.preventDefault();e.stopPropagation();},false);//prevent contextmenu when placing/brekin
//mouse press
document.body.addEventListener('mousemove',function(e){
  if(canLock==true){
  gameWorker.postMessage({type:'mousemove',moveX:e.movementX,moveY:e.movementY});
  }
});
//move mouse
document.body.addEventListener('wheel',function(e){
  if(canLock==true){
  gameWorker.postMessage({type:'wheel',deltaY:e.deltaY});
  }
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
//Displays the version at the bottom of the screen (it tries to get the local (the one that the user is running on) version, then if that fails, gets the actual version).
function displayVer(){
  let h6 = document.createElement("h6");
  h6.setAttribute("style","color:white;font-family:sans-serif;position:fixed;bottom:10px;left:5px;z-index:1000;");
  caches.open("cache").then(function(cache){
    return cache.match("VERSION.txt").then(function(res){
      if(!res){
        throw new Error("Invalid cache response.");
      }
      return res.text();
    }).then(function(txt){
      h6.textContent = "Current version: " + txt;
      document.body.appendChild(h6);
      return;
    });
  }).catch(function(){
    fetch("VERSION.txt").then(function(res){
      if(!res){
        throw new Error("Fetch failed.");
      }
      return res.text();
    }).then(function(txt){
      if(!txt){
        throw new Error("Response.text() returned an invalid response.");
      }
      h6.textContent = "Current version: " + txt;
      document.body.appendChild(h6);
      return;
    }).catch(function(err){
      /*Hmmmm, something must have gone horribly wrong here if an error is generated to the point where this code runs...*/
      h6.textContent = "Unknown";
      document.body.appendChild(h6);
      console.warn("Failed getting version. This shouldn't happen. If you are offline, try connecting to the internet. If that doesn't work, then please try clearing the site data. Error generated: " + err);
      return;
    });
  });
}
displayVer();