import {PointerLockControls} from 'https://threejs.org/examples/jsm/controls/PointerLockControls.js'
//learned from Threejs voxel geom
import {GLTFExporter} from 'https://threejs.org/examples/jsm/exporters/GLTFExporter.js';
import {CSM} from 'https://threejs.org/examples/jsm/csm/CSM.js';
var material;
var Chunks = {};
var chunkIndex =[];
var ChunksMesh = {};
var ChunkLights = [];

var PlayerChunk;

if(window.Worker){




var breaking = false;
var effectPass;
var loadingEle = document.getElementById('worldgenstat');
var loadingEle2 = document.getElementById('loadingbarinner');
var showFPS = localStorage.getItem("fps");
var canFog = localStorage.getItem("fog");
var clock = new THREE.Clock();
var sunAngle = -1/6*Math.PI*10;
var dayDuration = 1020;//1020 sec
var sunLight;
var bumping = false;
var playerDir;
var done = false;
var holdingBlock;
var holdingBlockTexture = new THREE.TextureLoader().load('textures.png');
holdingBlockTexture.magFilter = THREE.NearestFilter;//pixelated
holdingBlockTexture.minFilter = THREE.NearestFilter;

var HoldingBlockPos = new THREE.Vector2();
var HoldingBlockRelativePosition = new THREE.Vector2(window.innerWidth/2,window.innerHeight/2);
	HoldingBlockPos.x = ( HoldingBlockRelativePosition.x / window.innerWidth ) * 2 - 1;
	HoldingBlockPos.y = - ( HoldingBlockRelativePosition.y / window.innerHeight ) * 2 + 1;

var holdingBlockRenderer;
var worldSize1 = localStorage.getItem('worldsize');
var cameraBounds=  new THREE.Vector3();
var skydom;
var starField;
var keys =[];
var sunSphere;
var testWorldSize = Number(localStorage.getItem('worldsize'))*16;
var lastBreak = new THREE.Vector3();
var intersectWorld;
var pointerBlock;

var frameDone =false;
var lastPos;
var stats = new Stats();

function checkIntersections(){
  //checking for hits
  var player = {
    x:camera.position.x,
    y:camera.position.y-1.5,
    z:camera.position.z,
  };
  //player info
  //check if any voxels there
    let start = new THREE.Vector3(player.x,player.y,player.z);
    let end = new THREE.Vector3(player.x,player.y,player.z);
    let start2 = new THREE.Vector3(player.x,camera.position.y,player.z);
    let end2 = new THREE.Vector3(player.x,camera.position.y,player.z);
    const intersection =intersectWorld.intersectRay(start, end);
    const intersection2 = intersectWorld.intersectRay(start2,end2);

    if (intersection||intersection2) {
      //hit
      if(intersectWorld.getVoxel(end.x,end.y,end.z)!=4){
    return true;
  }else{
    return false;
  }
}else{
return false;
}
//end

}
function intersectLowestPoint(){
  let start = new THREE.Vector3(camera.position.x+0.05,camera.position.y,camera.position.z+0.05);
  let end = new THREE.Vector3(camera.position.x+0.05,camera.position.y-64,camera.position.z+0.05);
  const intersect = intersectWorld.intersectRay(start,end);
  if(intersect){
    //get posy
    let voxelId = 1;//so you end up ontop
    const pos = intersect.position.map((v, ndx) => {
      return v + intersect.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
    });
    camera.position.set(...pos);
    camera.position.y+=1.5
  }
}

stats.showPanel(0);
document.body.appendChild(stats.dom);
var fpsEle = document.getElementById("fpsEle");
var loadingCont = document.getElementById('loadingbarouter');
var loadingCont2= document.getElementById('worldgen');
var totalProgress =0;
var csm1;
var mouseIsDown = false;
var breakingTextureLoader = new THREE.TextureLoader();
var breakingTileset = breakingTextureLoader.load('breaking.png');
breakingTileset.magFilter = THREE.NearestFilter;//pixelate
breakingTileset.minFilter = THREE.NearestFilter;//pixelate
var breakingAnimator;
const cellSize = 64;
const tileSize = 16;//16
var playerObject;
const tileTextureWidth= 128;//256
const tileTextureHeight = 48;//64
const positionNumComponents = 3;
const normalNumComponents = 3;
const uvNumComponents =2;
var chunkPos = 0;
var shadowLamp;

var shadowCamera;
var shadows;
var shadowsNeedUpdate = true;

var camera,scene,renderer,controls,light;
function init(){
  scene = new THREE.Scene();

  const color = 0x808080;  // blk?
  const near = 25;
  const far = 100;
  if(canFog=="true"){
  scene.fog = new THREE.Fog(color, near, far);
  }
  var shouldAlias = eval(localStorage.getItem("antialias"));
  renderer = new THREE.WebGLRenderer({antialias:shouldAlias,alpha:true});
  renderer.shadowMap.enabled=true;
	renderer.shadowMap.autoUpdate=false;//don't update until need
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor(0x000000,0);


  camera= new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,200);
  camera.position.x = testWorldSize/2;
  camera.position.z = testWorldSize/2;
  camera.position.y = 35;
 controls = new PointerLockControls(camera,renderer.domElement);
 shadows = new CSM({
					maxFar: camera.far,
					cascades: 4,
					mode: 'practical',
					parent: scene,
					shadowMapSize: 1024,
					lightDirection: new THREE.Vector3( -1, -1, 1 ).normalize(),
					camera: camera,
          lightIntensity:0.01,
} );



  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  var hemisphereLt = new THREE.AmbientLight(0xffffff,.1);//boost ambient
  scene.add(hemisphereLt);
  renderer.domElement.setAttribute('id','webgl');
  renderer.domElement.addEventListener('mousedown',function(){controls.lock()},false)
  renderer.domElement.addEventListener('mousedown',buttonPress,false);
  renderer.domElement.addEventListener('wheel',scrollBlocks);
  window["scene"]=scene;


  createChunk(0,0,0);



 material = new THREE.MeshLambertMaterial({
  alphaTest:0.1,
  transparent:true,
  map:texture
});//stop creating new worthless materials every time
shadows.setupMaterial(material)
//camera.add(holdingBlock);
sunSphere = new THREEx.DayNight.SunSphere();
sunLight = new THREEx.DayNight.SunLight();
//createShadowLamp();
scene.add(sunSphere.object3d);
scene.add(sunLight.object3d);
//skydom = new THREEx.DayNight.Skydom();
//scene.add(skydom.object3d);

pointerBlock = new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({wireframe:true,color:'white',map:breakingTileset,opacity:1,transparent:true}));
pointerBlock.scale.set(1.001,1.001,1.001);//wireframe sticks out
breakingAnimator = new TextureAnimator(breakingTileset,6,1,6,2);//breaking texture animat
scene.add(pointerBlock);//outline

renderer.compile(scene,camera);//COMPILE Material drop lag(??)

  render();
}
function render(){
  frameDone = false;
  requestAnimationFrame(render);
  sunAngle	+= clock.getDelta()/dayDuration * Math.PI*2;
  sunLight.update(sunAngle);
  sunSphere.update(sunAngle);
  //skydom.update(sunAngle);
  //update sky
  var phase = THREEx.DayNight.currentPhase(sunAngle);
  if( phase === 'day'){
    document.body.style.backgroundColor = "rgb(0,120,255)";
  //  scene.background = new THREE.Color("rgb(255,"+ (Math.floor(Math.sin(sunAngle)*200)+55) + "," + (Math.floor(Math.sin(sunAngle)*200)) +")");
} else if( phase === 'twilight' ){
  document.body.style.backgroundColor = "rgb(0," + (120-Math.floor(Math.sin(sunAngle)*240*-1)) + "," + (255-Math.floor(Math.sin(sunAngle)*510*-1)) +")";
  //  uniforms.bottomColor.value.set("rgb(" + (255-Math.floor(Math.sin(sunAngle)*510*-1)) + "," + (55-Math.floor(Math.sin(sunAngle)*110*-1)) + ",0)");
  } else {
    document.body.style.backgroundColor = ("black")
  //  uniforms.topColor.value.set('black')
//    uniforms.bottomColor.value.set('black');
  }
  stats.begin();
  camera.updateMatrixWorld();
  //check status of breaking
  if(breaking===true){
    //check
    var breakVec = new THREE.Vector3();
    let start = new THREE.Vector3();
    let end = new THREE.Vector3();
    start.setFromMatrixPosition(camera.matrixWorld);
    end.set(0,0,1).unproject(camera);//0,0 = center of screen
    var dir = new THREE.Vector3();
    dir.subVectors(end,start).normalize();
    var roundDir = roundVec(dir)
    end.copy(start);
    end.addScaledVector(dir,maxReach);//enable max reach
    let intersection = intersectWorld.intersectRay(start,end);
    if(intersection){
      //hit something, move outline to pos
      let posHit = intersection.position.map((v, ndx) => {
        return v + intersection.normal[ndx] * -0.5//normal in
      });
      breakVec.x = Math.floor(posHit[0]);
      breakVec.y = Math.floor(posHit[1]);
      breakVec.z = Math.floor(posHit[2]);
    }
    if(breakVec.x!=lastBreak.x||breakVec.y!=lastBreak.y||breakVec.z!=lastBreak.z){
      breaking=false;//if not in right pos
    }
    if(mouseIsDown===false){
      breaking=false;//you stopped holding
    }

  }



  if(breaking===true){
    if(pointerBlock.material.wireframe!=false){
      pointerBlock.material.wireframe=false;//disable/enable wireframe
      pointerBlock.material.map = breakingTileset;
      pointerBlock.material.needsUpdate=true;
    }
  breakingAnimator.update(1000*clock.getDelta());
}else{
  if(pointerBlock.material.wireframe!=true){
    pointerBlock.material.wireframe=true;
    pointerBlock.material.map = null;
    pointerBlock.material.needsUpdate=true;
  }
}


  //renderer.render(scene,camera); don't render yet...
  var moved = [];
  if(keys['w']){
    controls.moveForward(.04);
    moved.push('forward');

  }
  if(keys['a']){
    controls.moveRight(-.04);
    moved.push('left');


  }
  if(keys[' ']){
    camera.position.y+=0.05;
    moved.push('up');
  }
  if(keys['s']){
    controls.moveForward(-.04);
    moved.push('backward');

  }
  if(keys['d']){
    controls.moveRight(.04);
    moved.push('right')

  }
  //new positions => here
  cameraBounds.clone(camera.position);
  var cameraTransforms = new THREE.Vector3().clone(camera.position);
  if(checkIntersections()===true){
    bumping=true;
    //camera.position.set(lastPos.x,lastPos.y+.05,lastPos.z);
    goBack(moved);
    setHandPosition();
    clampPos(cameraTransforms);
    renderer.render(scene,camera)
  }else{
    bumping=false;
    if(done===true){
     camera.position.y-=.05;
      clampPos(cameraTransforms);
      if(checkIntersections()===true){
        bumping=true;
        camera.position.y+=.05;


      }
      setHandPosition();
    }
    renderer.render(scene,camera);
  }
  frameDone = true;
	if(shadowsNeedUpdate===true){
		renderer.shadowMap.needsUpdate=true;//update shadows on demand
		shadowsNeedUpdate = false;//need updat?

  shadows.update();
}
  //get chunk player is inside
  if(PlayerChunk!='hold'){//dont change unless not hold or undefined
  PlayerChunk = chunkClamp(camera.position,true);//clamp chunk to player area
}
  loadUnloadChunks();
  blockPointer();//move pointer
  stats.end();
}
function setHandPosition(){
//blank??

}

//from threejs example pages
function TextureAnimator(texture, tilesHoriz, tilesVert, numTiles, tileDispDuration)
{
	// note: texture passed by reference, will be updated by the update function.

	this.tilesHorizontal = tilesHoriz;
	this.tilesVertical = tilesVert;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet.
	this.numberOfTiles = numTiles;
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );

	// how long should each image be displayed?
	this.tileDisplayDuration = tileDispDuration;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;

	this.update = function( milliSec )
	{
		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles)
				this.currentTile = 0;
			var currentColumn = this.currentTile % this.tilesHorizontal;
			texture.offset.x = currentColumn / this.tilesHorizontal;
			var currentRow = Math.floor( this.currentTile / this.tilesHorizontal );
			texture.offset.y = currentRow / this.tilesVertical;
		}
	};
}
var lastVoxel = 8;//the last voxel
function scrollBlocks(e){
  console.log('Changing block')
  if(e.deltaY<0){
    //down(left?)
    if(currentVoxel>1){
      currentVoxel-=1;//move down block array
    }else{
      currentVoxel=lastVoxel;//last voxel reset
    }
  }
  if(e.deltaY>0){
    //up(right?)
    if(currentVoxel<8){
      currentVoxel+=1;
    }else{
      currentVoxel=1;//back tof irst voxl
    }
  }
}
function goBack(arr){
  for(var i =0;i<arr.length;i++){
    if(arr[i]==='forward'){
      controls.moveForward(-.04)
    }
    if(arr[i]==='backward'){
      controls.moveForward(.04);
    }
    if(arr[i]==='left'){
      controls.moveRight(.04);//swap
    }
    if(arr[i]==='right'){
      controls.moveRight(-.04);//swap
    }
    if(arr[i]==='up'){

    }
  }
}
function clampPos(cameraTransforms){//prevent falling off or out of world
if(camera.position.y<2){
	camera.position.y=3;
}
}
document.body.addEventListener('keydown',function(e){keys[e.key]=true},false);
document.body.addEventListener('keyup',function(e){keys[e.key]=false},false);

window.addEventListener('resize',function(){
  renderer.setSize(window.innerWidth,window.innerHeight)
  camera.aspect = window.innerWidth/window.innerHeight;
  document.getElementById('crosshairX').style.left ='calc(50% - 10px)';
  document.getElementById('crosshairX').style.top ='calc(50% - 3px)';
  document.getElementById('crosshairY').style.left ='calc(50% - 3px)';
  document.getElementById('crosshairY').style.top ='calc(50% - 10px)';
camera.updateProjectionMatrix();
})



//TODO: pls clone to loaderworker.js
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
										addFace();//rough method
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


var heightMult = 2;

var loader = undefined;
var texture = undefined;
loader = new THREE.TextureLoader();//create loader
texture = loader.load('textures.png', render);//load texture
texture.magFilter = THREE.NearestFilter;//pixelate
texture.minFilter = THREE.NearestFilter;//pixelate
var loadChunkRowX = 0;
var loadChunkRowZ = 0;

intersectWorld = new VoxelWorld({
  cellSize,
  tileSize:16,
  tileTextureWidth:128,
  tileTextureHeight:48,
});


var worldSize=Number(localStorage.getItem('worldsize'))*16;
console.log(worldSize+'world size')
function loadWorld(){
  loadChunkRowX+=16;
  if(loadChunkRowX % (worldSize) === 0){//reached row x limit
    loadChunkRowZ +=16;//add to z
    loadChunkRowX =0;//reset
    if(Math.random()>0.6){
      currentBiome='caves';
    }else{
      currentBiome='plains'
    }
  }
  if(loadChunkRowZ<worldSize){
      //load another chunk
  createChunk(loadChunkRowX,0,loadChunkRowZ);//use vars
  }else{
    loadingEle.textContent ='Click anywhere.'
    document.body.addEventListener('mousedown',clickDown,false);
    function clickDown(event){
      event.preventDefault();
      loadingCont.style.display='none';
      loadingCont2.style.display='none';
      controls.lock();
      document.body.removeEventListener('mousedown',clickDown,false);
      intersectLowestPoint();
      //hit ground
    }
    //loadingCont.style.display='none';
    //loadingCont2.style.display='none';

    done=true;//start falling


  }
}
var currentBiome = 'plains';
function createChunk(x,y,z,progress){
var chunkWorker = new Worker('chunkworker.js');
//heightMult+= .01;
if(Math.random()>0.6){
  currentBiome='caves';
}else{
  currentBiome='plains'
}

var localVoxelWorld = new VoxelWorld({
cellSize,
tileSize,
tileTextureWidth,
tileTextureHeight
});//local voxel world(cannot share classes)
var startTime = performance.now();//start timer
chunkWorker.postMessage(['create',16,tileSize,tileTextureWidth,tileTextureHeight,localStorage.getItem('seed'),x,y,z,heightMult,currentBiome]);

chunkWorker.onmessage = function(e){
  if(e.data[0]==='title'){
    if(progress===undefined){
    loadingEle.textContent = e.data[1];
  }
  }
  if(e.data[0]==='prog'){
    if(progress===undefined){
    loadingEle2.style.width =e.data[1]+'%';
  }
  }
  if(e.data[0]==='voxel'){
    localVoxelWorld.setVoxel(e.data[1],e.data[2],e.data[3],e.data[4]);
    //set in localvoxelworld

    //set in intersection worker
    intersectWorld.setVoxel(e.data[1]+x,e.data[2]+y,e.data[3]+z,e.data[4]);
  }
  if(e.data[0]==='complete'){
    loadChunk(x,y,z,localVoxelWorld);//load in chunk e.data[1] = geo
    Chunks[x+","+y+','+z] = localVoxelWorld;//get from pos
		console.log('Chunk Load Time: \n'+(performance.now()-startTime).toFixed(1));//log time
    chunkIndex.push(x+","+y+","+z);
    if(progress===undefined){
    if(document.getElementById('webgl')===null){
      document.body.appendChild(renderer.domElement);

    }
    document.body.style.backgroundImage = "none";


    //btw will EAT mem
    //next
    loadWorld();//update
  }
  if(PlayerChunk === 'hold'){PlayerChunk =undefined}//reset
  intersectLowestPoint();//corect player position
    chunkWorker.terminate();//close worker, there's only so many CPU threads available

  }
}
}

var currentVoxel = 1;//stone
window["change"]= function(vo){
  currentVoxel = vo;
}
function inRange(val,min,max){
  return val >=min&&val<=max;//in range of max/min
}
function convInt(x,y,z){
  return new THREE.Vector3(Number(x),Number(y),Number(z));
}
var renderDist = 16;

function AABBCollision(point,box){
  return (point.x >= box.minX && point.x <= box.maxX) &&
         (point.z >= box.minZ && point.z <= box.maxZ);
}

var renderDist = 32;//chunks*16
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
      scene.remove(chunk);//wipe from render , but don't kill geometry (for faster loading later)
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



function buttonPress(e){
  mouseIsDown =true;
  if(e.button===2){//rt
    modifyChunk(e,currentVoxel);
    //place
    breaking=false;
  }
  if(e.button===0){//lft
    //break
    modifyChunk(e,0);//modify
  }
}
document.body.addEventListener('mouseup',function(){mouseIsDown=false});

const neighborOffsets = [
  [ 0,  0,  0], // self
  [-1,  0,  0], // left
  [ 1,  0,  0], // right
  [ 0, -1,  0], // down
  [ 0,  1,  0], // up
  [ 0,  0, -1], // back
  [ 0,  0,  1], // front
];

const cellIdToMesh = {};

function roundVec(v){
  var roundedX = Number((v.x).toFixed(1));
  var roundedY = Number((v.y).toFixed(1));
  var roundedZ = Number((v.z).toFixed(1));
  var vec = new THREE.Vector3(roundedX,roundedY,roundedZ);
  return vec;
}

function compareVec(v,v2){
  if(v.x===v2.x&&v.y===v2.y&&v.z===v2.z){
    return true;
  }else{
    return false;
  }
}
function floorVec(v){
return new THREE.Vector3((Math.floor(v.x)),(Math.floor(v.y)),(Math.floor(v.z)));
}
function addVec(v,v2){
  return new THREE.Vector3(v.x+v2.x,v.y+v2.y,v.z+v2.z);
}
/*
function hitDetection(targets, callback) {
var projector = new THREE.Projector();
var raycaster = new THREE.Raycaster();
var mouse = {};
// it is always the center of the screen
mouse.x = 0;
mouse.y = 0;
var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
var cameraDirection = controls.getDirection(vector).clone();
projector.unprojectVector(cameraDirection,camera );
var ray = new THREE.Raycaster(controls.getObject().position, cameraDirection.sub(controls.getObject().position).normalize());
var intersects = ray.intersectObjects(targets);
// if there is one (or more) intersections
if (intersects.length > 0) {
var hitObject = intersects[0].object;
console.log("hit object: ", hitObject);
callback(hitObject);
}
}
*/
var maxReach = 6;//max reach, no placing blocks super far away

function blockPointer(){
  //highlight blocks to place/break
  let start = new THREE.Vector3();
  let end = new THREE.Vector3();
  start.setFromMatrixPosition(camera.matrixWorld);
  end.set(0,0,1).unproject(camera);//0,0 = center of screen
  var dir = new THREE.Vector3();
  dir.subVectors(end,start).normalize();
  var roundDir = roundVec(dir)
  end.copy(start);
  end.addScaledVector(dir,maxReach);//enable max reach
  let intersection = intersectWorld.intersectRay(start,end);
  if(intersection){
    //hit something, move outline to pos
    let voxid = currentVoxel;
    let posHit = intersection.position.map((v, ndx) => {
      return v + intersection.normal[ndx] * -0.5
    });
    //clamp (no in betweens)
    posHit[0] = (Math.floor(posHit[0])+.5)
    posHit[1] = (Math.floor(posHit[1])+.5)
    posHit[2] = (Math.floor(posHit[2])+.5)
    pointerBlock.position.set(posHit[0],posHit[1],posHit[2]);//set wireframe @ pos
  }
}

var breakingTime = 1;//creative
function modifyChunk(event,voxel1){//modify a chunk
event.preventDefault();


var x = 0;//center
var y = 0;
const start = new THREE.Vector3();
const end = new THREE.Vector3();
start.setFromMatrixPosition(camera.matrixWorld);
end.set(x, y, 1).unproject(camera);
// compute a direction from start to end
var dir = new THREE.Vector3();
dir.subVectors(end, start).normalize();

end.copy(start);
//fix end to max reach
end.addScaledVector(dir, maxReach);
var chunk;
var correctedPos;
  const intersection = intersectWorld.intersectRay(start,end);//from large intersectworld
  if (intersection) {
    const voxelId = voxel1;

    // the intersection point is on the face. That means
    // the math imprecision could put us on either side of the face.
    // so go half a normal into the voxel if removing (currentVoxel = 0)
    // our out of the voxel if adding (currentVoxel  > 0)
    const pos = intersection.position.map((v, ndx) => {
      return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
    });
    var posVec = new THREE.Vector3(pos[0],pos[1],pos[2]);
    chunk = chunkClamp(posVec,false);
    correctedPos = chunkClamp(posVec,true);
    if(voxel1!=0){
    if(chunk){//no update unless chunk exists
      var roundCam = floorVec(camera.position);
      var roundPosVec = floorVec(posVec);//rounded
      if(compareVec(roundCam,roundPosVec)===false){//cannot place block in self
        if(voxel1===8){
          //torch, set light
          var light = new THREE.PointLight(0xffe53b,1,16);
					light.renderOrder=1;
          light.position.set(pos[0]+.5,pos[1]+.5,pos[2]+.5);//center light
          var lightfr = floorVec(new THREE.Vector3(pos[0],pos[1],pos[2]));
          ChunkLights[lightfr.x+","+lightfr.y+","+lightfr.z]=light;//for removal later
          scene.add(light);
        }
    chunk.setVoxel(pos[0]-correctedPos.x,pos[1]-correctedPos.y,pos[2]-correctedPos.z, voxel1);//set voxel in world @ chunk clamped
    intersectWorld.setVoxel(pos[0],pos[1],pos[2],voxel1);//set for intersects
    updateCellGeometry(...pos); //update chunk geometry @pos
  }
  }
}else{
  //is air, start timer
  if(breaking===false){
  breaking=true;
  var lastX,lastY,lastZ;
  function getLastPos(){
  let start = new THREE.Vector3();
  let end = new THREE.Vector3();
  start.setFromMatrixPosition(camera.matrixWorld);
  end.set(0,0,1).unproject(camera);//0,0 = center of screen
  var dir = new THREE.Vector3();
  dir.subVectors(end,start).normalize();
  var roundDir = roundVec(dir)
  end.copy(start);
  end.addScaledVector(dir,maxReach);//enable max reach
  let intersection = intersectWorld.intersectRay(start,end);
  if(intersection){
    //hit something, move outline to pos
    let posHit = intersection.position.map((v, ndx) => {
      return v + intersection.normal[ndx] * -0.5//normal in
    });
    lastBreak.x = Math.floor(posHit[0]);
    lastBreak.y = Math.floor(posHit[1]);
    lastBreak.z = Math.floor(posHit[2]);
  }
  }
  getLastPos();
  var lastX = lastBreak.x,lastY = lastBreak.y,lastZ=lastBreak.z;
  setTimeout(function(){
    breakingAnimator.currentTile = 0;//reset tile
    //check intersection again, make sure correct blocks
    let start = new THREE.Vector3();
    let end = new THREE.Vector3();
    start.setFromMatrixPosition(camera.matrixWorld);
    end.set(0,0,1).unproject(camera);//0,0 = center of screen
    var dir = new THREE.Vector3();
    dir.subVectors(end,start).normalize();
    var roundDir = roundVec(dir)
    end.copy(start);
    end.addScaledVector(dir,maxReach);//enable max reach
    let intersection = intersectWorld.intersectRay(start,end);
    if(intersection){
      //hit something, move outline to pos
      let posHit = intersection.position.map((v, ndx) => {
        return v + intersection.normal[ndx] * -0.5//normal in
      });
      posHit[0]=Math.floor(posHit[0]);
      posHit[1]=Math.floor(posHit[1]);
      posHit[2]=Math.floor(posHit[2]);
      if(posHit[0]===lastX&&posHit[1]===lastY&&posHit[2]===lastZ&&posHit[1]>0){//break if same and hit (also no break at 0,0)
        console.log('Same,breaking')
        var posVec = new THREE.Vector3(pos[0],pos[1],pos[2]);
        var chunk = chunkClamp(posVec,false);
        var correctedPos = chunkClamp(posVec,true);

        if(chunk){//no update unless chunk exists
          var cloneVec = floorVec(posVec);
          var possibleLight = String(cloneVec.x+","+cloneVec.y+","+cloneVec.z);
          if(ChunkLights[possibleLight]!=undefined){
            scene.remove(ChunkLights[possibleLight]);//remove light
          }
        chunk.setVoxel(pos[0]-correctedPos.x,pos[1]-correctedPos.y,pos[2]-correctedPos.z,0);//set voxel in world @ chunk clamped
        intersectWorld.setVoxel(pos[0],pos[1],pos[2],0);//set for intersects
        updateCellGeometry(...pos); //update chunk geometry @pos

        breaking=false;
      }else{
        breaking=false;
      }

  }else{
    breaking=false;
  }
}else{
  breaking=false;
}
  },breakingTime);//break time
}
}
  }




function updateCellGeometry(x, y, z) {
//  const cellId = chunk.computeCellId(0,0,0);
//  let mesh = cellIdToMesh[cellId];
let mesh = ChunksMesh[correctedPos.x+','+correctedPos.y+','+correctedPos.z];
  const geometry = mesh.geometry;

  const {positions, normals, uvs, indices} = chunk.generateGeometryDataForCell(0,0,0);//always centered, remember multiple voxworlds

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));

  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

  geometry.setIndex(indices);

  geometry.computeBoundingSphere();

//  renderShadowMap();//update shadows ingame
shadowsNeedUpdate=true;//update shadows
  }




}


function loadChunk(x,y,z,world1){
//load in chunk
//set pos,norm,uv,ind
let {positions,normals,uvs,indices} = world1.generateGeometryDataForCell(0,0,0)
var geometry = new THREE.BufferGeometry();//new buffgeo

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
shadowsNeedUpdate=true;//new chunk, need new shadow
//time ~5-7 ms
}




  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

init();



//worker check
}else{
  alert('Poor computer can\'t support Sortacraft \n\n Try on Chrome.')
}
