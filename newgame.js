window.onbeforeunload = function () {
  return "This is so someone doesn't accidentally exit out of the game";
};
let gameWorker = new Worker('gameworker.js', { type: "module" });//enable modules
//setup dom
import TextureAtlas from '/textureatlas.js';
import Inventory from '/inventory.js'
TextureAtlas.init();
TextureAtlas.done = function () {
  Inventory.init(TextureAtlas.textures);
  window["Inventory"] = Inventory;
  gameWorker.postMessage({type:'textureAtlas',texture:TextureAtlas.textures})
}
import TWEEN from '/tween.js'
let canMove = true;
let fromTween = { op: 1, reset: false };
let canvas;
let canLock = true;
let toTween = { op: 0, reset: false };//invisible
let tween;
let tweenRunning = false;
//Cinematic mode
let cineMode = false;
window["downloadWorld"] = function () {
  gameWorker.postMessage({ type: 'downloadGame' });
}
window["setVoxel"] = function (v) {
  gameWorker.postMessage({ type: 'setVoxelTo', voxel: v })
}
function updateTime() {
  requestAnimationFrame(updateTime);
  gameWorker.postMessage({ type: 'time_update', time: performance.now() });//forgot why I needed thislol
}
window["gravity"] = function (toggleState) {
  gameWorker.postMessage({ type: 'toggleGravity', "state": toggleState });

  //go to togglegrav in gamewoker
}

function prepCanvas() {
  canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  canvas.setAttribute('class', 'gameCanvas')
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  document.body.appendChild(canvas);
  const offscreen = canvas.transferControlToOffscreen();
  gameWorker.postMessage({ type: 'main', canvas: offscreen, width: window.innerWidth, height: window.innerHeight }, [offscreen]);//send canvas and init
  updateTime();
}

gameWorker.onmessage = function (e) {
  if (e.data[0] == 'fps') {
    document.getElementById('fpsEle').innerText = 'FPS: ' + e.data[1];
  }
  if (e.data[0] == 'debug') {
    if (e.data[2] == 'log') {
      document.getElementById('debug').style.display = 'block';
      document.getElementById('debug').innerHTML += '<br>' + e.data[1];
    }
    if (e.data[2] == 'close') {
      document.getElementById('debug').style.display = 'none';
    }

  }
  if (e.data[0] == 'chunks') {
    download('my_world.dat', JSON.stringify(e.data[1]))
  }
  if (e.data[0] == 'progress') {
    document.getElementById('loader').style.width = (e.data[1] + 3) + '%';
    document.getElementById('loader_outer').style.display = 'block';
    document.getElementById('blockCount').innerHTML = (Math.floor(e.data[1] + 3) + '%');

  }
  if (e.data[0] == 'done') {
    document.getElementById('overlay').style.display = 'none';
    //  document.getElementById('loader_outer').style.display='none';
    let outr = document.getElementById('loader_outer');
    outr.style.left = '-5%';
    outr.style.top = '0%';
    outr.style.display = 'none';
    document.getElementById('loader_title').style.display = 'none'
    canvas.style.display = 'block';
  }
  if (e.data[0] == 'break_animation') {
    let fromRotation = { z: 0, y: 0 };
    let toRotation = { z: -60, y: -60 };
    let breaktween = new TWEEN.Tween(fromRotation).to(toRotation, 125).onUpdate(function () {
      document.getElementById('handItem').style.transform = 'rotateY(' + fromRotation.y + 'deg) rotateZ(50deg) rotateX(' + fromRotation.z + 'deg)';
    }).start();
    let fromRotation2 = { z: 0, y: -60 };
    let toRotation2 = { z: -60, y: 0 };
    let breakundo = new TWEEN.Tween(toRotation2).to(fromRotation2, 125).onUpdate(function () {
      document.getElementById('handItem').style.transform = 'rotateY(' + fromRotation2.y + 'deg) rotateZ(50deg) rotateX(' + toRotation2.z + 'deg)';
    }).delay(125).start();
  }
  if (e.data[0] == 'hand_uv') {
    //    document.getElementById('handItem').style.backgroundImage ='url(textures.png)';
    //    document.getElementById('handItem').style.backgroundPosition  = -((e.data[1]-1)*16)+"px "+48+"px";//set "uv"
    //calculate uv by removing 1 (for 0 min) and multiply by 16 for px position (0 = y pos)
  }
  if (e.data[0] == 'equip_block') {
    //Pass to inventory
    Inventory.addItem(e.data[1]);
  }
}
function showVoxelTitle(voxelNM) {
  let cele = document.getElementsByClassName('voxelNameOuter');
  for (let i = 0; i < cele.length; i++) {

    document.body.removeChild(cele[i]);//clear out
  }
  let ele = document.createElement('div');
  let eleInner = document.createElement('div');
  eleInner.setAttribute('class', 'voxelName');
  ele.setAttribute('class', 'voxelNameOuter');
  ele.style.display = 'block';
  ele.appendChild(eleInner);
  eleInner.innerText = voxelNM//block name
  document.body.appendChild(ele);
  let fromTween = { op: 1 };
  let toTween = { op: 0 }
  let tween = new TWEEN.Tween(fromTween).to(toTween, 1000).onUpdate(function () {
    ele.style.opacity = fromTween.op;
  }).delay(1000).onComplete(function () {
    try {
      document.body.removeChild(ele)
    } catch (err) { }
  }).start();
}
let graphicsMode = 'fancy';
window["switchGraphicsType"] = function (e) {

  if (graphicsMode == 'fancy') {
    graphicsMode = 'faster'
    e.innerHTML = 'Graphics: Faster';
    gameWorker.postMessage({ type: 'graphicsFaster' });
  }
  else if (graphicsMode == 'faster') {
    graphicsMode = 'fancy';
    e.innerHTML = 'Graphics: Fancy'
    gameWorker.postMessage({ type: 'graphicsFancy' });
  }
}
function tweenLoop() {
  requestAnimationFrame(tweenLoop);
  TWEEN.update();
}
tweenLoop();
function download(filename, text) {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
//event handlers
let touchPosition = { x: 0, y: 0 };
let lastTouchPos = { x: 0, y: 0 }
let touchMove = false;
window.addEventListener('resize', function (e) {
  gameWorker.postMessage({ type: 'resize', width: window.innerWidth, height: window.innerHeight })
  updateCrosshair();
});
document.body.addEventListener('keydown', function (e) {
  if (canLock == true && canMove == true) {
    gameWorker.postMessage({ type: 'keydown', key: e.key });
  }
});
document.body.addEventListener('keyup', function (e) {
  if (e.key == '1' || e.key == '2' || e.key == '3' || e.key == '4' || e.key == '5' || e.key == '6' || e.key == '7' || e.key == '9') {


  }
  if (e.key == '`') {

    if (document.getElementById('gameoptions').style.display == 'none') {
      canMove = false;
      document.getElementById('gameoptions').style.display = 'block';
      canLock = false;
      document.exitPointerLock();
    } else {
      canMove = true;
      canLock = true;
      document.getElementById('gameoptions').style.display = 'none';
      document.body.requestPointerLock();
    }
  }
  if (e.key == 'e') {
    let ele = document.getElementById('canvas');
    if (ele.style.display == 'none') {
      ele.style.display = 'block';
      canMove = false;
      canLock = false;
      document.exitPointerLock();
    } else {
      ele.style.display = 'none';
      canMove = true;
      canLock = true;
      document.body.requestPointerLock();
    }
  }
  if (e.key === "j") {
    //Cinematic mode
    /*
    if(!cineMode){
      document.getElementById("crosshairX").style.transition = "all 1s ease";
      document.getElementById("crosshairY").style.transition = "all 1s ease";
      document.getElementById("handItem").style.display = "none";
      document.getElementById("ack").style.display = "none";
      document.getElementById("loader_outer").style.display = "none";
      document.getElementById("loader_bg").style.display = "none";
      document.getElementById("crosshairX").style.opacity = "0";
      document.getElementById("crosshairY").style.opacity = "0";
      document.getElementById("gameVersionText").style.display = "none";
      document.getElementById("fpsEle").style.display = "none";
      cineMode = true;
    }
    else{
      document.getElementById("crosshairX").style.transition = "";
      document.getElementById("crosshairY").style.transition = "";
      document.getElementById("handItem").style.display = "";
      document.getElementById("ack").style.display = "";
      document.getElementById("loader_outer").style.display = "";
      document.getElementById("loader_bg").style.display = "";
      document.getElementById("crosshairX").style.opacity = "0.7";
      document.getElementById("crosshairY").style.opacity = "0.7";
      document.getElementById("gameVersionText").style.display = "";
      document.getElementById("fpsEle").style.display = "";
      cineMode = false;
    }
    */
  }

  gameWorker.postMessage({ type: 'keyup', key: e.key });

});

//key updates
document.body.addEventListener('mousedown', function (e) {
  if (e.button == 0 && canLock == true && event.target == canvas) {

    document.body.requestPointerLock();//lock pointer
  }
  if (canLock == true) {
    gameWorker.postMessage({ type: 'mousedown', buttonPressed: e.button });
  }
}, false);
document.body.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); }, false);//prevent contextmenu when placing/brekin
//mouse press
document.body.addEventListener('mousemove', function (e) {
  if (canLock == true) {
    gameWorker.postMessage({ type: 'mousemove', moveX: e.movementX, moveY: e.movementY });
  }
});
//move mouse
document.body.addEventListener('wheel', function (e) {
  if (canLock == true) {
    gameWorker.postMessage({ type: 'wheel', deltaY: e.deltaY });
  }
});
//mouse scroll

//end event handlers
function fixEventPost(e) {
  return JSON.parse(JSON.stringify(e));//fix bug
}
function updateCrosshair() {
  document.getElementById('crosshairX').style.left = 'calc(50% - 10px)';
  document.getElementById('crosshairX').style.top = 'calc(50% - 3px)';
  document.getElementById('crosshairY').style.left = 'calc(50% - 3px)';
  document.getElementById('crosshairY').style.top = 'calc(50% - 10px)';//update crosshair
}
prepCanvas();
//Displays the version at the bottom of the screen (it tries to get the local (the one that the user is running on) version, then if that fails, gets the actual version).
function displayVer() {
  let h6 = document.createElement("h6");
  h6.setAttribute("style", "color:white;font-family:sans-serif;position:fixed;bottom:10px;left:5px;z-index:1000;");
  h6.setAttribute("id", "gameVersionText");
  caches.open("cache").then(function (cache) {
    return cache.match("VERSION.txt").then(function (res) {
      if (!res) {
        throw new Error("Invalid cache response.");
      }
      return res.text();
    }).then(function (txt) {
      h6.textContent = "Current version: " + txt;
      document.body.appendChild(h6);
      return;
    });
  }).catch(function () {
    fetch("VERSION.txt").then(function (res) {
      if (!res) {
        throw new Error("Fetch failed.");
      }
      return res.text();
    }).then(function (txt) {
      if (!txt) {
        throw new Error("Response.text() returned an invalid response.");
      }
      h6.textContent = "Current version: " + txt;
      document.body.appendChild(h6);
      return;
    }).catch(function (err) {
      /*Hmmmm, something must have gone horribly wrong here if an error is generated to the point where this code runs...*/
      h6.textContent = "Unknown";
      document.body.appendChild(h6);
      console.warn("Failed getting version. This shouldn't happen. If you are offline, try connecting to the internet. If that doesn't work, then please try clearing the site data. Error generated: " + err);
      return;
    });
  });
}
displayVer();