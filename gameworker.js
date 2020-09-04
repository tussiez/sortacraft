//main thread for Threejs
import * as THREE from 'https://threejs.org/build/three.module.js'
import {CSM} from 'https://threejs.org/examples/jsm/csm/CSM.js'//csm
//import {PointerLockControls} from 'modified_pointerlock.js'//modified pointerlock
const handlers = {
  main,
  mousemove,
  resize,
  keydown,
  keyup
}
//variables
var camera,
scene,
renderer,
controls,
cube,
keys=[],
Chunks = {},
ChunksMesh={},
PlayerChunk,
chunkIndex=[],
done = false,
light,
shadows,
material,
loader,
texture,
sunAngle = -1/6*Math.PI*10,
dayDuration = 1020,
sunSphere,
sunLight,
clock = new THREE.Clock(),
currentVoxel = 1,
cellSize = 64,
tileSize = 16,
tileTextureWidth = 128,
tileTextureHeight= 48,
intersectWorld,
heightMult = 2,
worldTextureLoader = new THREE.ImageBitmapLoader(),
worldTextureBitmap,
positionNumComponents = 3,
normalNumComponents = 3,
lazyVoxelWorld,
jumping=false,//WHY DID I HAVE TO DO IT TYPED?
velocityArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399,400,401,402,403,404,405,406,407,408,409,410,411,412,413,414,415,416,417,418,419,420,421,422,423,424,425,426,427,428,429,430,431,432,433,434,435,436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465,466,467,468,469,470,471,472,473,474,475,476,477,478,479,480,481,482,483,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,524,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,563,564,565,566,567,568,569,570,571,572,573,574,575,576,577,578,579,580,581,582,583,584,585,586,587,588,589,590,591,592,593,594,595,596,597,598,599,600,601,602,603,604,605,606,607,608,609,610,611,612,613,614,615,616,617,618,619,620,621,622,623,624,625,626,627,628,629,630,631,632,633,634,635,636,637,638,639,640,641,642,643,644,645,646,647,648,649,650,651,652,653,654,655,656,657,658,659,660,661,662,663,664,665,666,667,668,669,670,671,672,673,674,675,676,677,678,679,680,681,682,683,684,685,686,687,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,709,710,711,712,713,714,715,716,717,718,719,720,721,722,723,724,725,726,727,728,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,748,749,750,751,752,753,754,755,756,757,758,759,760,761,762,763,764,765,766,767,768,769,770,771,772,773,774,775,776,777,778,779,780,781,782,783,784,785,786,787,788,789,790,791,792,793,794,795,796,797,798,799,800,801,802,803,804,805,806,807,808,809,810,811,812,813,814,815,816,817,818,819,820,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,847,848,849,850,851,852,853,854,855,856,857,858,859,860,861,862,863,864,865,866,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,883,884,885,886,887,888,889,890,891,892,893,894,895,896,897,898,899,900,901,902,903,904,905,906,907,908,909,910,911,912,913,914,915,916,917,918,919,920,921,922,923,924,925,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,951,952,953,954,955,956,957,958,959,960,961,962,963,964,965,966,967,968,969,970,971,972,973,974,975,976,977,978,979,980,981,982,983,984,985,986,987,988,989,990,991,992,993,994,995,996,997,998,999,1000,999,998,997,996,995,994,993,992,991,990,989,988,987,986,985,984,983,982,981,980,979,978,977,976,975,974,973,972,971,970,969,968,967,966,965,964,963,962,961,960,959,958,957,956,955,954,953,952,951,950,949,948,947,946,945,944,943,942,941,940,939,938,937,936,935,934,933,932,931,930,929,928,927,926,925,924,923,922,921,920,919,918,917,916,915,914,913,912,911,910,909,908,907,906,905,904,903,902,901,900,899,898,897,896,895,894,893,892,891,890,889,888,887,886,885,884,883,882,881,880,879,878,877,876,875,874,873,872,871,870,869,868,867,866,865,864,863,862,861,860,859,858,857,856,855,854,853,852,851,850,849,848,847,846,845,844,843,842,841,840,839,838,837,836,835,834,833,832,831,830,829,828,827,826,825,824,823,822,821,820,819,818,817,816,815,814,813,812,811,810,809,808,807,806,805,804,803,802,801,800,799,798,797,796,795,794,793,792,791,790,789,788,787,786,785,784,783,782,781,780,779,778,777,776,775,774,773,772,771,770,769,768,767,766,765,764,763,762,761,760,759,758,757,756,755,754,753,752,751,750,749,748,747,746,745,744,743,742,741,740,739,738,737,736,735,734,733,732,731,730,729,728,727,726,725,724,723,722,721,720,719,718,717,716,715,714,713,712,711,710,709,708,707,706,705,704,703,702,701,700,699,698,697,696,695,694,693,692,691,690,689,688,687,686,685,684,683,682,681,680,679,678,677,676,675,674,673,672,671,670,669,668,667,666,665,664,663,662,661,660,659,658,657,656,655,654,653,652,651,650,649,648,647,646,645,644,643,642,641,640,639,638,637,636,635,634,633,632,631,630,629,628,627,626,625,624,623,622,621,620,619,618,617,616,615,614,613,612,611,610,609,608,607,606,605,604,603,602,601,600,599,598,597,596,595,594,593,592,591,590,589,588,587,586,585,584,583,582,581,580,579,578,577,576,575,574,573,572,571,570,569,568,567,566,565,564,563,562,561,560,559,558,557,556,555,554,553,552,551,550,549,548,547,546,545,544,543,542,541,540,539,538,537,536,535,534,533,532,531,530,529,528,527,526,525,524,523,522,521,520,519,518,517,516,515,514,513,512,511,510,509,508,507,506,505,504,503,502,501,500,499,498,497,496,495,494,493,492,491,490,489,488,487,486,485,484,483,482,481,480,479,478,477,476,475,474,473,472,471,470,469,468,467,466,465,464,463,462,461,460,459,458,457,456,455,454,453,452,451,450,449,448,447,446,445,444,443,442,441,440,439,438,437,436,435,434,433,432,431,430,429,428,427,426,425,424,423,422,421,420,419,418,417,416,415,414,413,412,411,410,409,408,407,406,405,404,403,402,401,400,399,398,397,396,395,394,393,392,391,390,389,388,387,386,385,384,383,382,381,380,379,378,377,376,375,374,373,372,371,370,369,368,367,366,365,364,363,362,361,360,359,358,357,356,355,354,353,352,351,350,349,348,347,346,345,344,343,342,341,340,339,338,337,336,335,334,333,332,331,330,329,328,327,326,325,324,323,322,321,320,319,318,317,316,315,314,313,312,311,310,309,308,307,306,305,304,303,302,301,300,299,298,297,296,295,294,293,292,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,254,253,252,251,250,249,248,247,246,245,244,243,242,241,240,239,238,237,236,235,234,233,232,231,230,229,228,227,226,225,224,223,222,221,220,219,218,217,216,215,214,213,212,211,210,209,208,207,206,205,204,203,202,201,200,199,198,197,196,195,194,193,192,191,190,189,188,187,186,185,184,183,182,181,180,179,178,177,176,175,174,173,172,171,170,169,168,167,166,165,164,163,162,161,160,159,158,157,156,155,154,153,152,151,150,149,148,147,146,145,144,143,142,141,140,139,138,137,136,135,134,133,132,131,130,129,128,127,126,125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,102,101,100,99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60,59,58,57,56,55,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0],
lazyVoxelData = {
  current:0,//kindof like i
  needsClear:true,//needs to clear
  done:false,//not done
  finishedPosting: false,
  lazyArray:[],//array of data
  lazyArrayTotal:undefined,
  geometryData:undefined,
  getVoxelData: function(inCurrent){//return voxel data @ pos
    let current =inCurrent;//scope
    let theObject;
    if(this.lazyArray.length!=0){
    try{
    theObject = {
      x:this.lazyArray[current].position[0],
      y:this.lazyArray[current].position[1],
      z:this.lazyArray[current].position[2],
      type:this.lazyArray[current].type,
      intersect:{
        x:this.lazyArray[current].intersect[0],
        y:this.lazyArray[current].intersect[1],
        z:this.lazyArray[current].intersect[2],
      }
    }
  }catch(issue){
    theObject = undefined;
  }
  finally {
    return theObject;
  }
  }
},
  lazyLoad: function(){
    let voxelInfo = this.getVoxelData(this.current);
    if(voxelInfo!=undefined){
    lazyVoxelWorld.setVoxel(voxelInfo.x,voxelInfo.y,voxelInfo.z,voxelInfo.type);//set
    if(this.current<this.lazyArrayTotal){
    this.current+=1;
  }
  if(this.current == this.lazyArrayTotal&&this.lazyArrayTotal>0&&this.done==false){
      this.finish();
  }
  }
},
finish:function(){
  this.done = true;
  this.current = 0;
  var posVec = this.getVoxelData(0).intersect;
  this.lazyArray = [];//reset arry
  loadChunk(posVec.x,posVec.y,posVec.z,lazyVoxelWorld,this.geometryData);//load in chunk
  Chunks[posVec.x+","+posVec.y+","+posVec.z]=lazyVoxelWorld;//chunk lib
  chunkIndex.push(posVec.x+","+posVec.y+","+posVec.z);//chunk index
  done=true;//for new chunks
}
  },//lazy work
  getFPS = {
    lastFrame:0,
    fps:0,
    framerate:function(){
      getFPS.lastFrame = renderer.info.render.frame;
      setTimeout(read,1000);
      function read(){
        getFPS.fps = renderer.info.render.frame - getFPS.lastFrame;
        self.postMessage(['fps',getFPS.fps]);
        requestAnimationFrame(getFPS.framerate);
      }
    }
  },//fps
uvNumComponents = 2;
worldTextureLoader.setOptions({imageOrientation:'flipY'})
worldTextureBitmap = worldTextureLoader.load('textures.png',function(bmap){
worldTextureBitmap = new THREE.CanvasTexture(bmap,undefined,undefined,undefined,THREE.NearestFilter,THREE.NearestFilter);//build texture from xhr req
//worldTextureBitmap = bmap;
  material = new THREE.MeshLambertMaterial({
    color:'gray',
    transparent:true,
    alphaTest:0.1,
    map:worldTextureBitmap,//texture
  });//setup mat
  shadows.setupMaterial(material)

}),
onmessage = function(e) {

  const fn = handlers[e.data.type];

  if (!fn) {
    console.warn('Thread Error: \n What is '+e.data.type+'??')
  }else{
  fn(e.data);
}

};

function keydown(e){keys[e.key]=true};
function keyup(e){keys[e.key]=false};//key updates.. hah.."KEY" updates? eh? getit? no?nvm

function main(dat){
  camera = new THREE.PerspectiveCamera(70,dat.width/dat.height,0.1,500);
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({canvas:dat.canvas});
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //renderer.shadowMap.autoUpdate=false;
  renderer.shadowMap.needsUpdate=true;
  renderer.setSize(dat.width,dat.height,false);//req.false
  controls = new PointerLockControls(camera);
  camera.position.z = 3;
  camera.position.y = 16;
  var ambient = new THREE.AmbientLight(0xffffff,0.4);
  scene.add(ambient);//ambient light
  shadows = new CSM({
    maxFar:camera.far,
    cascades:4,
    mode:'practical',
    shadowMapSize:1024,
    lightDirection:new THREE.Vector3(-1,-1,1).normalize(),
    parent:scene,
    camera:camera,
    lightIntensity:0.01,
  });
  sunSphere = new THREEx.DayNight.SunSphere();
  scene.add(sunSphere.object3d);
  sunLight = new THREEx.DayNight.SunLight();
  scene.add(sunLight.object3d);
  createChunk(0,0,0);
  renderer.compile(scene,camera);//compile material shaders
  render();
  getFPS.framerate();//start fps counter
}
function render(){

  requestAnimationFrame(render);
  renderer.render(scene,camera);

  updateDaytime()//update sun

  playerMovement();

  camera.updateMatrixWorld();//req.for shadows

  shadows.update();//update csm

  if(PlayerChunk!='hold'){//dont change unless not hold or undefined
    PlayerChunk = chunkClamp(camera.position,true);//clamp chunk to player area
  }

  manageVoxelLoading();//manage voxel world (if creating)

  lazyLoadChunks();//init lazy loadin g

}

function updateDaytime(){
  sunAngle	+= clock.getDelta()/dayDuration * Math.PI*2;
  sunLight.update(sunAngle);
  sunSphere.update(sunAngle);
  var phase = THREEx.DayNight.currentPhase(sunAngle);
  //bg color
  if( phase === 'day'){
    scene.background = new THREE.Color('rgb(0,120,255)');
  } else if( phase === 'twilight' ){
    scene.background = new THREE.Color("rgb(0," + (120-Math.floor(Math.sin(sunAngle)*240*-1)) + "," + (255-Math.floor(Math.sin(sunAngle)*510*-1)) +")");
  } else {
    scene.background = new THREE.Color('black');
  }
}

function playerMovement(){//move plyr
  if(keys['w']){
    controls.moveForward(.1);
  }
  if(keys['a']){
    controls.moveRight(-.1);
  }
  if(keys['s']){
    controls.moveForward(-.1);
  }
  if(keys['d']){
    controls.moveRight(.1);
  }
  //Temp
  if(keys[' ']&&jumping==false){
    camera.position.y+=.1;
  }
  if(keys['Shift']){
    camera.position.y-=.1;
  }
}
function resize(dat){
  if(renderer){
    renderer.setSize(dat.width,dat.height,false);//false for offscreen
    camera.aspect = dat.width/dat.height;
    camera.updateProjectionMatrix();//update size
  }
}

function mousemove(dat){
  controls.mousemove({x:dat.moveX,y:dat.moveY});//pas info
}
function inRange(val,min,max){
  return val >=min&&val<=max;//in range of max/min
}
function convInt(x,y,z){
  return new THREE.Vector3(Number(x),Number(y),Number(z));
}

function AABBCollision(point,box){
  return (point.x >= box.minX && point.x <= box.maxX) &&
         (point.z >= box.minZ && point.z <= box.maxZ);
}

var renderDist = 32;//chunks*16

function roundVec(v){
  var roundedX = Number((v.x).toFixed(1));
  var roundedY = Number((v.y).toFixed(1));
  var roundedZ = Number((v.z).toFixed(1));
  var vec = new THREE.Vector3(roundedX,roundedY,roundedZ);
  return vec;
}
function lazyLoadChunks(){
  var clampMin = newChunkClamp({x:camera.position.x - renderDist,z:camera.position.z - renderDist});
  var clampMax = newChunkClamp({x:camera.position.x + renderDist,z:camera.position.z + renderDist});
  for(var x = clampMin.x;x<clampMax.x;x+=16){
    for(var z =clampMin.z;z<clampMax.z;z+=16){
      var clampPos = {x:x,z:z}
      var chunk = Chunks[clampPos.x+",0,"+clampPos.z];
      if(chunk==undefined&&lazyVoxelData.done==true){
        lazyVoxelData.done = false;
        console.log('In req. of chunk');
        createChunk(x,0,z);
      }
    }
  }
}
function loadUnloadChunks(){
  //check if chunks in range
  var chunkNearPlayer = 0;
  var roundCameraPos = roundVec(new THREE.Vector3().clone(camera.position));
  for(var i = 0;i<chunkIndex.length;i++){
    var chunk = ChunksMesh[chunkIndex[i]];
    var strpos = chunkIndex[i].split(',');
    var pos = convInt(strpos[0],strpos[1],strpos[2]);//convert to int
    var maxPos = new THREE.Vector3(pos.x+16,pos.y,pos.z+16);
    var boxPoint  = {
      minX:pos.x,
      maxX:maxPos.x,
      minZ:pos.z,
      maxZ:maxPos.z
    }
    var playerRender ={
      minX:camera.position.x-renderDist,
      maxX:camera.position.x+renderDist,
      minZ:camera.position.z-renderDist,
      maxZ:camera.position.z+renderDist,
    }

    if(AABBCollision(pos,playerRender)===false){
      //not in range of camera, remove
      scene.remove(chunk);//wipe from render
    //  chunk.geometry.dispose();//clear from rem
    //  chunk.material.dispose();//clear from mem
      //chunk = undefined;//remove
      //chunkIndex.slice(i,1);//remove
      //Chunks[pos.x+","+pos.y+","+pos.z]=undefined;//remove
    //  ChunksMesh[pos.x+","+pos.y+","+pos.z]=undefined
    }else{
      chunkNearPlayer+=1;
      if(scene.getObjectByName(chunkIndex[i])===undefined){
        //add this chunk back
        scene.add(chunk);
      }

    }
  }

    if(done===true&&PlayerChunk===undefined){//undefined === need new chunk
    //no chunks near player, create new on
    PlayerChunk='hold';//wait till chunk done
		var signCameraVec1 = signVec(camera.position,true);//get sign
		if(signCameraVec1==true){//positive all
    var clampedPos = newChunkClamp(floorVec(camera.position));
    createChunk(clampedPos.x,0,clampedPos.z,false);//load in a new chunk here
    console.log('New Chunk');
  }else{
		var clampedPos = newChunkClamp(floorVec(camera.position));
		var signCameraVec =signVec(camera.position);//show sign
		if(signCameraVec.x < 0){
			clampedPos.x-=16;//reduce
		}
		if(signCameraVec.z < 0){
			clampedPos.z-=16;
		}
		createChunk(clampedPos.x,0,clampedPos.z);
		console.log('NegNew chunk')
	}
}

}
function signVec(vec,checkSign){//return sign
	if(checkSign===undefined){
	return new THREE.Vector3(Math.sign(vec.x),Math.sign(vec.y),Math.sign(vec.z));
}else{
	var signVec = new THREE.Vector3(Math.sign(vec.x),Math.sign(vec.y),Math.sign(vec.z));
	return signVec.x > 0 && signVec.y > 0 && signVec.z > 0;//check
}
}
function floorVec(v){
return new THREE.Vector3((Math.floor(v.x)),(Math.floor(v.y)),(Math.floor(v.z)));
}
function newChunkClamp(vec){//clamp position for new chunk
  var x = vec.x;
  var z = vec.z;
  var remainedX  = x % 16;
  var remainedZ = z % 16;
  var clampX = x-remainedX;
  var clampZ = z-remainedZ;
  return {x:clampX,z:clampZ}
}

function chunkClamp(vec,pos2){
  //clamp to chunk
  //example: min pos of chunk = x,y,z(0)
  //max pos of chunk = x,y,z+16(all)
  //if input = x,y,z+8 return chunk from above

  var x = vec.x;
  var y=vec.y;
  var z = vec.z;
  for(var i =0;i<chunkIndex.length;i++){
    var chunkName = chunkIndex[i];
    var chunk = Chunks[String(chunkName)];
    var pos = chunkName.split(',');//get x,y,z in arr
    var posMin = {x:Number(pos[0]),y:Number(pos[1]),z:Number(pos[2])};
    var posMax = {
      x:posMin.x+16,
      y:posMin.y+64,
      z:posMin.z+16,
    };
    if(inRange(x,posMin.x,posMax.x)&&inRange(y,posMin.y,posMax.y)&&inRange(z,posMin.z,posMax.z)){
      //inside range, return this chunk
      if(pos2===false){
      return chunk;//chunk
    }else{
      return posMin;//pos
    }
    }else{
      //not this chunk...
    }


  }
}



//DayNight(minify)
var THREEx=THREEx||{};THREEx.DayNight={},THREEx.DayNight.baseURL="/",THREEx.DayNight.currentPhase=function(t){return Math.sin(t)>Math.sin(0)?"day":Math.sin(t)>Math.sin(-Math.PI/6)?"twilight":"night"},THREEx.DayNight.SunLight=function(){var t=new THREE.DirectionalLight(16777215,1);this.object3d=t,this.update=function(i){t.position.x=0,t.position.y=9e4*Math.sin(i),t.position.z=9e4*Math.cos(i);var a=THREEx.DayNight.currentPhase(i);"day"===a?t.color.set("rgb(255,"+(Math.floor(200*Math.sin(i))+55)+","+Math.floor(200*Math.sin(i))+")"):"twilight"===a?(t.intensity=1,t.color.set("rgb("+(255-Math.floor(510*Math.sin(i)*-1))+","+(55-Math.floor(110*Math.sin(i)*-1))+",0)")):t.intensity=0}},THREEx.DayNight.SunSphere=function(){var t=new THREE.SphereGeometry(20,30,30),i=new THREE.MeshBasicMaterial({color:16711680}),a=new THREE.Mesh(t,i);this.object3d=a,this.update=function(t){a.position.x=0,a.position.y=400*Math.sin(t),a.position.z=400*Math.cos(t);var i=THREEx.DayNight.currentPhase(t);"day"===i?a.material.color.set("rgb(255,"+(Math.floor(200*Math.sin(t))+55)+","+(Math.floor(200*Math.sin(t))+5)+")"):"twilight"===i&&a.material.color.set("rgb(255,55,5)")}};
//PointerLockControls(minify)
var PointerLockControls=function(t){var o=this;this.minPolarAngle=0,this.maxPolarAngle=Math.PI;var n,r=new THREE.Euler(0,0,0,"YXZ"),e=Math.PI/2,i=new THREE.Vector3;this.mousemove=function(n){var i=n.x,a=n.y;r.setFromQuaternion(t.quaternion),r.y-=.002*i,r.x-=.002*a,r.x=Math.max(e-o.maxPolarAngle,Math.min(e-o.minPolarAngle,r.x)),t.quaternion.setFromEuler(r)},this.getDirection=(n=new THREE.Vector3(0,0,-1),function(o){return o.copy(n).applyQuaternion(t.quaternion)}),this.moveForward=function(o){i.setFromMatrixColumn(t.matrix,0),i.crossVectors(t.up,i),t.position.addScaledVector(i,o)},this.moveRight=function(o){i.setFromMatrixColumn(t.matrix,0),t.position.addScaledVector(i,o)}};
//VoxelWorld code (minify)
class VoxelWorld {
  constructor(options) {
    this.cellSize = options.cellSize;
    this.tileSize = options.tileSize;
    this.tileTextureWidth = options.tileTextureWidth;
    this.tileTextureHeight = options.tileTextureHeight;
    const {cellSize} = this;
    this.cellSliceSize = cellSize * cellSize;
    this.cells ={};
  }
  computeCellId(x,y,z){
    const {cellSize }= this;
    const cellX = Math.floor(x/cellSize);
    const cellY = Math.floor(y/cellSize);
    const cellZ = Math.floor(z/cellSize);
    return `${cellX},${cellY},${cellZ}`;
  }
  computeVoxelOffset(x, y, z) {
    const {cellSize, cellSliceSize} = this;
    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
    return voxelY * cellSliceSize +
           voxelZ * cellSize +
           voxelX;
  }
  getCellForVoxel(x, y, z) {
    return this.cells[this.computeCellId(x,y,z)]
  }
  setVoxel(x, y, z, v) {
    let cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      cell = this.addCellForVoxel(x,y,z);
    }
    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }
  addCellForVoxel(x,y,z){
    const cellId = this.computeCellId(x,y,z);
    let cell =this.cells[cellId];
    if(!cell){
      const {cellSize} = this;
      cell = new Uint8Array(cellSize*cellSize*cellSize);
      this.cells[cellId]=cell;
    }
    return cell;
  }
  getVoxel(x, y, z) {
    const cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      return 0;
    }
    const voxelOffset = this.computeVoxelOffset(x, y, z);
    return cell[voxelOffset];
  }
	getTransparentVoxel(x,y,z){
		const voxel = this.getVoxel(x,y,z);
		if(voxel===4||voxel===7){
			return true;
		}else{
			return false;
		}
	}
  generateGeometryDataForCell(cellX, cellY, cellZ,rx,ry,rz) {
    const {cellSize, tileSize, tileTextureWidth, tileTextureHeight} = this;
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;

    for (let y = 0; y < cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z < cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x < cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
          var realX = rx+voxelX;
          var realZ = rz+voxelZ;
          if (voxel) {
            // voxel 0 is sky (empty) so for UVs we start at 0
            const uvVoxel = voxel - 1;
            // There is a voxel here but do we need faces for it?
            for (const {dir, corners, uvRow} of VoxelWorld.faces) {
              const neighbor = this.getVoxel(
                  voxelX + dir[0],
                  voxelY + dir[1],
                  voxelZ + dir[2]);
                  //||neighbor===4&&voxel!=4||neighbor===7&&voxel!=7
									//transparent voxel handling
									if(this.getTransparentVoxel(voxelX,voxelY,voxelZ)===true){//this is a transparent voxel
										if(neighbor!=voxel){
											//neighbor is not self (transparent) so add
											addFace();
										}
									}else{
										if(!neighbor||this.getTransparentVoxel(voxelX+dir[0],voxelY+dir[1],voxelZ+dir[2])===true){//no neighbor OR neighbor is transparent
											addFace();//face add
										}
									}
							function addFace(){
								const ndx = positions.length / 3;
                for (const {pos, uv} of corners) {
                  positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                  normals.push(...dir);
                  uvs.push(
                        (uvVoxel +   uv[0]) * tileSize / tileTextureWidth,
                    1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);
                }
                indices.push(
                  ndx, ndx + 1, ndx + 2,
                  ndx + 2, ndx + 1, ndx + 3,
                );
							}
            }
          }
        }
      }
    }

    return {
      positions,
      normals,
      uvs,
      indices,
    };
  }
   intersectRay(start, end) { //this not by me, it strange physics :3
    let dx = end.x - start.x;
    let dy = end.y - start.y;
    let dz = end.z - start.z;
    const lenSq = dx * dx + dy * dy + dz * dz;
    const len = Math.sqrt(lenSq);

    dx /= len;
    dy /= len;
    dz /= len;

    let t = 0.0;
    let ix = Math.floor(start.x);
    let iy = Math.floor(start.y);
    let iz = Math.floor(start.z);

    const stepX = (dx > 0) ? 1 : -1;
    const stepY = (dy > 0) ? 1 : -1;
    const stepZ = (dz > 0) ? 1 : -1;

    const txDelta = Math.abs(1 / dx);
    const tyDelta = Math.abs(1 / dy);
    const tzDelta = Math.abs(1 / dz);

    const xDist = (stepX > 0) ? (ix + 1 - start.x) : (start.x - ix);
    const yDist = (stepY > 0) ? (iy + 1 - start.y) : (start.y - iy);
    const zDist = (stepZ > 0) ? (iz + 1 - start.z) : (start.z - iz);

    // location of nearest voxel boundary, in units of t
    let txMax = (txDelta < Infinity) ? txDelta * xDist : Infinity;
    let tyMax = (tyDelta < Infinity) ? tyDelta * yDist : Infinity;
    let tzMax = (tzDelta < Infinity) ? tzDelta * zDist : Infinity;

    let steppedIndex = -1;

    // main loop along raycast vector
    while (t <= len) {
      const voxel = this.getVoxel(ix, iy, iz);
      if (voxel) {
        return {
          position: [
            start.x + t * dx,
            start.y + t * dy,
            start.z + t * dz,
          ],
          normal: [
            steppedIndex === 0 ? -stepX : 0,
            steppedIndex === 1 ? -stepY : 0,
            steppedIndex === 2 ? -stepZ : 0,
          ],
          voxel,
        };
      }

      // advance t to next nearest voxel boundary
      if (txMax < tyMax) {
        if (txMax < tzMax) {
          ix += stepX;
          t = txMax;
          txMax += txDelta;
          steppedIndex = 0;
        } else {
          iz += stepZ;
          t = tzMax;
          tzMax += tzDelta;
          steppedIndex = 2;
        }
      } else {
        if (tyMax < tzMax) {
          iy += stepY;
          t = tyMax;
          tyMax += tyDelta;
          steppedIndex = 1;
        } else {
          iz += stepZ;
          t = tzMax;
          tzMax += tzDelta;
          steppedIndex = 2;
        }
      }
    }
    return null;
  }
}


//faces
VoxelWorld.faces = [
  { // left
    uvRow: 0,
    dir: [ -1,  0,  0, ],
    corners: [
      { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
      { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
      { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
      { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
    ],
  },
  { // right
    uvRow: 0,
    dir: [  1,  0,  0, ],
    corners: [
      { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
      { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
      { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
      { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
    ],
  },
  { // bottom
    uvRow: 1,
    dir: [  0, -1,  0, ],
    corners: [
      { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
      { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
      { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
      { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
    ],
  },
  { // top
    uvRow: 2,
    dir: [  0,  1,  0, ],
    corners: [
      { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
      { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
      { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
      { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
    ],
  },
  { // back
    uvRow: 0,
    dir: [  0,  0, -1, ],
    corners: [
      { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
      { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
      { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
      { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
    ],
  },
  { // front
    uvRow: 0,
    dir: [  0,  0,  1, ],
    corners: [
      { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
      { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
      { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
      { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
    ],
  },
];

function manageVoxelLoading(){
  if(lazyVoxelData.needsClear==true){
    //clear for new voxelworld
    lazyVoxelData.finishedPosting = false;//not finished
    lazyVoxelData.needsClear=false;//no clear again
    lazyVoxelData.current = 0;//set back to 0
    lazyVoxelData.geometryData = undefined;//geodata
    lazyVoxelData.lazyArrayTotal = 0;//reset
    lazyVoxelWorld = new VoxelWorld({
      cellSize,
      tileSize,
      tileTextureWidth,
      tileTextureHeight
    });//voxel world
  }
  if(lazyVoxelData.done==false){
    //not finished yet
    //evaulate data
    if(lazyVoxelData.lazyArrayTotal===NaN){
      lazyVoxelData.lazyArrayTotal = 0;
    }
    for(var i = 0;i<240;i++){//load speed
      if(lazyVoxelData.current<lazyVoxelData.lazyArrayTotal){
      lazyVoxelData.lazyLoad();
    }
    }

    console.log(Math.floor((lazyVoxelData.current*100)/lazyVoxelData.lazyArrayTotal)+'% Done');

  }
}


intersectWorld = new VoxelWorld({
  cellSize,
  tileSize,
  tileTextureWidth,
  tileTextureHeight
})

function createChunk(x,y,z){
  if(material){
var chunkWorker = new Worker('chunkworker.js');
var currentBiome = 'caves';
/*
var localVoxelWorld = new VoxelWorld({
cellSize,
tileSize,
tileTextureWidth,
tileTextureHeight
});//local voxel world(cannot share classes)
*/
lazyVoxelData.needsClear = true;//need a clear
chunkWorker.postMessage(['create',16,tileSize,tileTextureWidth,tileTextureHeight,12345,x,y,z,heightMult,currentBiome,2]);
done=false;
var startCount = 0;
chunkWorker.onmessage = function(e){
  if(e.data[0]==='voxel'){
    lazyVoxelData.lazyArray.push({type:e.data[4],intersect:[x,y,z],position:[e.data[1],e.data[2],e.data[3]]});
    startCount+=1;
//    localVoxelWorld.setVoxel(e.data[1],e.data[2],e.data[3],e.data[4]);
    //set in localvoxelworld
  //  intersectWorld.setVoxel(e.data[1]+x,e.data[2]+y,e.data[3]+z,e.data[4]);
  }
  if(e.data[0]==='complete'){
    lazyVoxelData.finishedPosting = true;
    lazyVoxelData.geometryData = [e.data[1],e.data[2],e.data[3],e.data[4]];
    lazyVoxelData.lazyArrayTotal = startCount;//set max
  //  loadChunk(x,y,z,localVoxelWorld);//load in chunk e.data[1] = geo
  //  Chunks[x+","+y+','+z] = localVoxelWorld;//get from pos
  //  chunkIndex.push(x+","+y+","+z);
  //  done=true;
 if(PlayerChunk === 'hold'){PlayerChunk =undefined}//reset
    chunkWorker.terminate();//close worker, there's only so many CPU threads available
  }
}
}else{
  setTimeout(function(){createChunk(x,y,z)},250);
  console.warn('Thread Warning:\n'+'Texture not loaded. Waiting 250ms..')
}
}

function loadChunk(x,y,z,world1,dat){
//load in chunk
//set pos,norm,uv,ind
var positions = dat[0];
var normals = dat[1];
var uvs = dat[2];
var indices =dat[3]
var geometry = new THREE.BufferGeometry();//new buffgeos

geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));

geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

geometry.setIndex(indices);

var mesh = new THREE.Mesh(geometry, material);
ChunksMesh[x+","+y+","+z] = mesh;//save chunk @ pos
//shadows
mesh.castShadow =true;
mesh.receiveShadow=true;

mesh.position.set(x,y,z);//set pos
scene.add(mesh)//ad to scene
renderer.shadowMap.needsUpdate=true;//new chunk, need new shadow
}
