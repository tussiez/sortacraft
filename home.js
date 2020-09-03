function loadStorage(){
readAlias("anti");
readFPS();
readFog();
readSeed();
readWorldSize();
}
loadStorage();
function readWorldSize(){
  var placeholder = document.getElementById('worldsizeplaceholder');
  var rangeEle = document.getElementById('worldsize');
  var itm = localStorage.getItem('worldsize');
  if(itm===null){
    //no exist
    localStorage.setItem('worldsize',2)
    console.log('set to 2x2');
    rangeEle.value = '2';
    placeholder.innerText = '2x2';
  }else{
    var val = localStorage.getItem('worldsize');
    rangeEle.value = val;
    placeholder.innerText =val+'x'+val;
  }
}
function setWorldSize(){
  localStorage.setItem('worldsize',document.getElementById('worldsize').value);
}
function updateWorldSize(){
  var ele = document.getElementById('worldsizeplaceholder');
  var val = document.getElementById('worldsize').value;
  ele.innerText = val+'x'+val;
}
function checkSeed(){
  if(localStorage.getItem('seed')===null||localStorage.getItem('seed')===''||localStorage.getItem("changeseed")==="true"){
    var str = Math.floor(Math.random()*65536);//limit
    alert('World Seed: \n'+str)

    localStorage.setItem('seed',str);
    window.location.href='game.html';
  }else{
    if(Number(localStorage.getItem('seed'))>65536){
      localStorage.setItem('seed',Math.floor(Math.random()*65536));
    }
      window.location.href = 'game.html'
  }
}
function saveSeed(){
  var ele = document.getElementById('seed').value;
  localStorage.setItem('changeseed',false)
  localStorage.setItem('seed',ele);//set seed
}
function open(ele){
  var e = document.getElementById(ele);
  if(e.style.display==='none'){
      e.style.display='block';
    }else{
      e.style.display='none';
    }
}
function changeSeed(){
  var ele = document.getElementById('seed2');
  var itm = localStorage.getItem("changeseed");
  console.log("changeseed "+itm)
  if(itm==="true"){
    console.log("changeseed set off");
    localStorage.setItem("changeseed",false);
    ele.innerHTML = "Randomize Seed: Off";
  }
  if(itm==="false"){
    console.log("changeseed set on");
    localStorage.setItem("changeseed",true);
    ele.innerHTML = "Randomize Seed: On";
  }
}
function readSeed(){
  var ele = document.getElementById("seed2");
  if(localStorage.getItem("changeseed")===null){
    localStorage.setItem("changeseed",true);
    console.log("set on, seed change");
    ele.innerHTML = "Randomize Seed: On";
  }else{
    var itm = localStorage.getItem("changeseed");
    if(itm==="true"){
      console.log("change seed on");
      ele.innerHTML = "Randomize Seed: On";
    }
    if(itm==="false"){
      console.log("change seed off");
      ele.innerHTML = "Randomize Seed: Off";
    }
  }
}
var form = document.getElementById('form');
form.oncomplete=function(ev){ev.preventDefault();}
function readFog(){
  var ele = document.getElementById("fog")
  if(localStorage.getItem("fog")===null){
    localStorage.setItem("fog",true);
    console.log("set to on, fog");
    ele.innerHTML = "Fog: On";
  }else{
    var itm = localStorage.getItem("fog");
    if(itm==="true"){
      console.log("fog on");
      ele.innerHTML = "Fog: On";
    }
    if(itm==="false"){
      console.log("fog off");
      ele.innerHTML = 'Fog: Off';
    }
  }
}
function checkFog(){
  var ele = document.getElementById("fog");
  var itm = localStorage.getItem("fog");
  if(itm==="true"){
    localStorage.setItem("fog",false);
    ele.innerHTML = "Fog: Off";
    console.log("fog off");
  }
  if(itm==="false"){
    localStorage.setItem("fog",true);
    console.log('fog on');
    ele.innerHTML = "Fog: On";
  }
}
function readFPS(){
  var ele= document.getElementById("fps");
  if(localStorage.getItem("fps")===null){
    localStorage.setItem("fps",false);
    console.log("Set to off, fps");
    ele.innerHTML = "Show FPS: Off";
  }else{
    var itm = localStorage.getItem("fps");
    if(itm==="true"){
      ele.innerHTML ="Show FPS: On";
      console.log("fps true")
    }if(itm==="false"){
      ele.innerHTML = "Show FPS: Off";
      console.log("fps false")
    }
  }
}
function checkFPS(id){
  var ele = document.getElementById(id);
  var itm = localStorage.getItem("fps");
  if(itm==="true"){
    localStorage.setItem("fps",false);
    ele.innerHTML = 'Show FPS: Off';
    console.log('disable fps')
  }
  if(itm==="false"){
    localStorage.setItem("fps",true);
    ele.innerHTML = 'Show FPS: On';
    console.log("enable fps");
  }

}
function checkAlias(id){
  var ele = document.getElementById(id);
    //not null, exists
    var itm = localStorage.getItem('antialias');
    if(itm==="true"){
      localStorage.setItem("antialias",false);
      ele.innerHTML = "Smooth Image: Off";
      console.log("Disabled smoothimage")
    }
    if(itm==="false"){
      localStorage.setItem("antialias",true);
      ele.innerHTML = "Smooth Image: On";
      console.log("Enabled smoothimage")
    }
}
function readAlias(){
  var ele = document.getElementById("anti");
if(localStorage.getItem("antialias")===null){
  localStorage.setItem("antialias",false);
  ele.innerHTML = 'Smooth Image: Off';
  console.log("Set to off, smoothimage")
}else{
  if(localStorage.getItem("antialias")==="true"){
    ele.innerHTML = 'Smooth Image: On';
  console.log("read to on, smoothimage")
  }else{
    ele.innerHTML = 'Smooth Image: Off';
    console.log("read to off, smoothima")
  }
}
}
