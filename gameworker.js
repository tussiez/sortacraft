//main thread for Threejs
import * as THREE from '/threejs.js'
import { CSM } from 'https://threejs.org/examples/jsm/csm/CSM.js'//
import { EffectComposer } from 'https://threejs.org/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://threejs.org/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://threejs.org/examples/jsm/postprocessing/ShaderPass.js';

import { FXAAShader } from 'https://threejs.org/examples/jsm/shaders/FXAAShader.js'
import SortaPhysics from 'https://sortaphysics.sortagames.repl.co/lib.js'
import CANNON from 'https://sortaphysics.sortagames.repl.co/cannonModule.js'
import PhysicsControls from '/PhysicsControls.js'
const handlers = {
  main,
  mousemove,
  setVoxelTo,
  resize,
  keydown,
  keyup,
  downloadGame,
  mousedown,
  wheel,
  time_update,
  graphicsFaster,
  graphicsFancy,
  changeShadowBias,
  textureAtlas,
  toggleGravity,
  //You put your function names here, they can be executed from the main thread.
  //Data is passed like this to the worker: gameworker.postMessage({type:'FUNCTIONAME'})
}

//Map numbers to range
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}



//hello there
//variables
//variables
let g;
// const G = 9.807;//9.807
// //Let's try 150 pounds.
// //Equivalent to 150 pounds. Because physics calculations are mainly in SI units, it has to be measured in kilograms
// const M = 68.0389;
// let R;
var camera,
  scene,
  fallen = false,
  canJump = true,
  renderer,
  doubleTapDelay = 375,
  globalSeed = Math.floor(Math.random() * 65535),
  controls,
  particleGroup,
  emitter,
  clock,
  fxaaPass,
  lastSpacePress = 0,
  lastWPress = 0,
  chunkWorker,
  textureSet,
  effectComposer,
  renderPass,
  cube,
  blockParticles = [],
  jumpY,
  canRender = false,
  dToGround = 0,
  keys = [],
  Chunks = {},
  ChunksMesh = {},
  CullChunkIndex = [],
  CullChunks = {},
  ChunkLights = {},
  PlayerChunk,
  jumpG = .02,
  voxelBody,
  voxelBodies = {},
  voxelCompound,
  playerSpeed = .3,
  playerCorrectiveSpeed = .23,
  geometryDataWorker = new Worker('geometrydataworker.js'),
  geometryDataWorker2 = new Worker('geometrydataworker.js'),//for chunk update
  chunkIndex = [],
  done = true,
  light,
  shadows,
  material,
  fastmaterial,
  fancymaterial,
  chunkTotal = 16640,//for progress
  loader,
  texture,
  sunAngle = -1 / 6 * Math.PI * 10,
  dayDuration = 720,//720/60 = 10min
  sunSphere,
  sunLight,
  clock = new THREE.Clock(),
  currentVoxel = 1,
  cellSize = 64,
  tileSize = 16,
  graphicsMode = 'fancy',
  tileTextureWidth = 720,
  tileTextureHeight = 48,
  intersectWorld,
  heightMult = 2,
  worldTextureLoader = new THREE.ImageBitmapLoader(),
  worldTextureBitmap,
  positionNumComponents = 3,
  normalNumComponents = 3,
  lazyVoxelWorld,
  playerAccel = 0,
  flying = false,
  currentTime = 0,
  jumping = false,
  bumping = false,
  maxReach = 6,//max player reach
  pointerBlock,
  moved = [],
  amountOfVoxels = 45,
  voxelNames = [
    'Stone',
    'Grass Block',
    'Sand',
    'Water',
    'Oak Log',
    'Soil',
    'Leaves',
    'Light Block',
    'Furnace[Unlit]',
    'Diamond Ore',
    'Redstone Ore',
    'Lapis Lazuli',
    'Emerald Ore',
    'Workbench',
    'Furnace[Lit]',
    'Obsidian',
    'Brick Block',
    'Redstone Block',
    'Prismarine',
    'Bookshelf',
    'End Stone',
    'Yellow Block',
    'Emerald Block',
    'Red Block',
    'Light Blue Block',
    'Black Block',
    'Brown Block',
    'Copper Ore',
    'Silver Ore',
    'Cobblestone',
    'Diorite',
    'Granite',
    'Snowy Grass Block',
    'Ice',
    'Oak Planks',
    'Dark Oak Planks',
    'Spruce Planks',
    'Birch Planks',
    'Acacia Planks',
    'Acacia Log',
    'Birch Log',
    'Spruce Log',
    'Dark Oak Log',
    'Coal Ore',
    'Snowy Leaves',
  ],//voxe names (by idx)
  voxelDrops = [
    'Cobblestone',
    'Soil',
    'Sand',
    'Water',
    'Oak Log',
    'Soil',
    'Leaves',
    'Light Block',
    'Furnace[Unlit]',
    'Diamond',
    'Redstone',
    'Lapis Lazuli',
    'Emerald',
    'Workbench',
    'Furnace[Unlit]',
    'Obsidian',
    'Brick Block',
    'Redstone Block',
    'Prismarine',
    'Bookshelf',
    'End Stone',
    'Yellow Block',
    'Emerald Block',
    'Red Block',
    'Light Blue Block',
    'Black Block',
    'Brown Block',
    'Copper Ingot',
    'Silver Ingot',
    'Cobblestone',
    'Diorite',
    'Granite',
    'Soil',
    'Water',
    'Oak Planks',
    'Dark Oak Planks',
    'Spruce Planks',
    'Birch Planks',
    'Acacia Planks',
    'Acacia Log',
    'Birch Log',
    'Spruce Log',
    'Dark Oak Log',
    'Coal Ore',
    'Snowy Leaves'
  ],//what voxel drops
  lazyVoxelData = {
    current: 0,//kindof like i
    startTime: currentTime,
    needsClear: true,//needs to clear
    done: true,//not done
    finishedPosting: false,
    lazyArray: [],//array of data
    lazyArrayTotal: undefined,
    geometryData: undefined,
    getVoxelData: function (inCurrent) {//return voxel data @ pos
      let current = inCurrent;//scope
      let theObject;
      if (this.lazyArray.length != 0) {
        try {
          theObject = {
            x: this.lazyArray[current].position[0],
            y: this.lazyArray[current].position[1],
            z: this.lazyArray[current].position[2],
            type: this.lazyArray[current].type,
            intersect: {
              x: this.lazyArray[current].intersect[0],
              y: this.lazyArray[current].intersect[1],
              z: this.lazyArray[current].intersect[2],
            }
          }
        } catch (issue) {
          theObject = undefined;
        }
        finally {
          return theObject;
        }
      }
    },
    lazyLoad: function () {
      let voxelInfo = this.getVoxelData(this.current);
      if (voxelInfo != undefined) {
        lazyVoxelWorld.setVoxel(voxelInfo.x, voxelInfo.y, voxelInfo.z, voxelInfo.type);//set
        intersectWorld.setVoxel(voxelInfo.intersect.x + voxelInfo.x, voxelInfo.intersect.y + voxelInfo.y, voxelInfo.intersect.z + voxelInfo.z, voxelInfo.type);//intersect

        //PHYSICS!
       // setPhysVoxel(voxelInfo.intersect.x + voxelInfo.x, voxelInfo.intersect.y + voxelInfo.y, voxelInfo.intersect.z+voxelInfo.z, voxelInfo.type);
       //naw

        geometryDataWorker.postMessage(['voxel', voxelInfo.intersect.x + voxelInfo.x, voxelInfo.intersect.y + voxelInfo.y, voxelInfo.intersect.z + voxelInfo.z, voxelInfo.type])
        geometryDataWorker2.postMessage(['voxel', voxelInfo.intersect.x + voxelInfo.x, voxelInfo.intersect.y + voxelInfo.y, voxelInfo.intersect.z + voxelInfo.z, voxelInfo.type])
        if (this.current < this.lazyArrayTotal) {
          this.current += 1;
        }
        if (this.current == this.lazyArrayTotal && this.lazyArrayTotal > 0 && this.done == false) {
          this.finish();
        }
      }
    },
    finish: function () {
      const posVec = this.getVoxelData(0).intersect, x = posVec.x, y = posVec.y, z = posVec.z;
      geometryDataWorker.postMessage(['geometrydata', posVec.x, posVec.y, posVec.z, 'regular', posVec]);//reg
      //postMessage(['debug', ((currentTime-this.startTime)/1000).toFixed(2),'newline']);
      //timer
    },
    realFinish: function () {
      var posVec = this.getVoxelData(0).intersect;
      this.lazyArray = [];//reset arry
      this.done = true;
      this.current = 0;
      loadChunk(posVec.x, posVec.y, posVec.z, lazyVoxelWorld, this.geometryData);//load in chunk
      Chunks[posVec.x + "," + posVec.y + "," + posVec.z] = lazyVoxelWorld;//chunk lib
      CullChunks[posVec.x + "," + posVec.y + "," + posVec.z] = lazyVoxelWorld;//chunk culling lib
      CullChunkIndex.push(posVec.x + "," + posVec.y + "," + posVec.z);//add for faster reading

      chunkIndex.push(posVec.x + "," + posVec.y + "," + posVec.z);//chunk index
      done = true;//for new chunks
    },
  },//lazy work
  vec = THREE.Vector2,//faster
  getFPS = {
    lastFrame: 0,
    fps: 0,
    framerate: function () {
      getFPS.lastFrame = renderer.info.render.frame;
      setTimeout(read, 1000);
      function read() {
        getFPS.fps = (renderer.info.render.frame - getFPS.lastFrame) / 2;
        self.postMessage(['fps', getFPS.fps]);
        requestAnimationFrame(getFPS.framerate);
      }
    }
  },//fps
  uvNumComponents = 2;
worldTextureLoader.setOptions({ imageOrientation: 'flipY' });//flips when using bitmaps
worldTextureBitmap = worldTextureLoader.load('textures.png', function (bmap) {
  worldTextureBitmap = new THREE.CanvasTexture(bmap, undefined, undefined, undefined, THREE.NearestFilter, THREE.NearestFilter);//build texture from xhr req
  //worldTextureBitmap = bmap
  fancymaterial = new THREE.MeshPhongMaterial({
    color: 'gray',
    map: worldTextureBitmap,//texture
    transparent: true,
    alphaTest: 0.1,
    // alphaMap: worldTextureBitmap,
    depthTest: true,
    depthWrite: true,
  });//setup mat
  fancymaterial.shininess = 0;//No shininess

  //fancymaterial.roughness = 100;//Super rough
  fastmaterial = new THREE.MeshBasicMaterial({
    color: 'gray',
    map: worldTextureBitmap,
    transparent: true,
    alphaTest: 0.1,
    //  alphaMap: worldTextureBitmap,
    depthTest: true,
    depthWrite: true,
  });
  //setup fast speedy mat
  material = fancymaterial;//start on fancy material
  shadows.setupMaterial(fancymaterial);
  renderer.compile(scene, camera);//compile

}),
  geometryDataWorker.onmessage = function (e) {
    if (e.data[0] == 'geometrydata') {
      if (e.data[5] == 'regular') {
        lazyVoxelData.geometryData = [e.data[1], e.data[2], e.data[3], e.data[4]];//pos,norm,uv,ind
        lazyVoxelData.realFinish();//real finish
      } else {
        //update geometry based on chunk
        var chunk = ChunksMesh[e.data[6].x + ',' + e.data[6].y + "," + e.data[6].z];
        var geometry = chunk.geometry;
        makePhysGeometry(e.data[1],e.data[2]);
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(e.data[1]), 3));

        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(e.data[2]), 3));

        geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(e.data[3]), 2));

        geometry.setIndex(e.data[4]);//update geometry
        geometry.computeBoundingSphere();

        // PHYSICS STUFF


      }
    }
    renderer.shadowMap.needsUpdate = true;//shadow map update
  }
geometryDataWorker2.onmessage = function (e) {
  if (e.data[0] == 'geometrydata') {
    if (e.data[5] == 'regular') {
      lazyVoxelData.geometryData = [e.data[1], e.data[2], e.data[3], e.data[4]];//pos,norm,uv,ind
      lazyVoxelData.realFinish();//real finish
    }
    if (e.data[5] == 'update_neighbors') {
      //update neighbors afer this
      var chunk = ChunksMesh[e.data[6].x + ',' + e.data[6].y + "," + e.data[6].z];
      var geometry = chunk.geometry;

      //call update on other geometry too (for neighbor issue)
      geometryDataWorker2.postMessage(['geometrydata', e.data[7].x, e.data[7].y, e.data[7].z, 'chunk_update', e.data[7], e.data[7]]);
      //end call
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(e.data[1]), 3));

      geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(e.data[2]), 3));

      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(e.data[3]), 2));

      geometry.setIndex(e.data[4]);//update geometry
      geometry.computeBoundingSphere();



    }

    if (e.data[5] == 'geometrydata') {
      //update geometry based on chunk
      var chunk = ChunksMesh[e.data[6].x + ',' + e.data[6].y + "," + e.data[6].z];
      var geometry = chunk.geometry;
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(e.data[1]), 3));

      geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(e.data[2]), 3));

      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(e.data[3]), 2));

      geometry.setIndex(e.data[4]);//update geometry
      geometry.computeBoundingSphere();

    }
    if (e.data[5] == 'cull_faces') {
      //cull faces
      //remmeber to remove from idx
      var chunk = ChunksMesh[e.data[6].x + "," + e.data[6].y + "," + e.data[6].z];
      //get from cull chunks
      var geo = chunk.geometry;
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(e.data[1]), 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(e.data[2]), 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(e.data[3]), 2));

      geo.setIndex(e.data[4]);
      geo.computeBoundingSphere();//if not chunk no updatre.
      //now you can remove
      CullChunks[e.data[6].x + "," + e.data[6].y + "," + e.data[6].z] = undefined;
      //remove for optimize

    }
  }
  renderer.shadowMap.needsUpdate = true;//chunk updated,needs updated shadows
}
function stringVec(vec) {
  return (vec.x + "," + vec.y + "," + vec.z)
}
function textureAtlas(d) {
  textureSet = d.texture;
}
onmessage = function (e) {

  const fn = handlers[e.data.type];

  if (!fn) {
    console.warn('Thread Error: \n What is ' + e.data.type + '??')
  } else {
    fn(e.data);
  }

};

function changeShadowBias(dat) {
console.log('outdated function')
}
function toggleGravity(d) {
  //It's passed as an object
  let toggleState = d.toggleState;
  if (toggleState !== true || toggleState !== false) {
    console.error(new TypeError("Parameter \"toggleState\" must be of type " + typeof true + ", got type " + typeof toggleState + "."));
  }
  //Undefind AND false evaluate to falsely
  if (!self.gravity) {
    self.gravity = true;
    return self.gravity;
  }
  self.gravity = false;
  return self.gravity;
}
function setVoxelTo(dat) {
  currentVoxel = voxelNames.indexOf(dat.voxel) + 1
}
function time_update(dat) {
  currentTime = dat.time;
}
function downloadGame() {
  postMessage(['chunks', Chunks]);//post chunks
}
function wheel(dat) {
  /*
  if (dat.deltaY > 0) {
    if (currentVoxel < amountOfVoxels) {
      currentVoxel += 1;

    } else {
      currentVoxel = 1;
    }
  } else {
    if (currentVoxel > 1) {
      currentVoxel -= 1;
    } else {
      currentVoxel = amountOfVoxels;
    }
    */

  postMessage(['hand_uv', currentVoxel]);//pass hand uv
  postMessage(['voxel_title', voxelNames[currentVoxel - 1]]);
}
function checkIntersections() {
  //checking for hits
  var player = {
    x: camera.position.x,
    y: camera.position.y - 1.5,
    z: camera.position.z,
  };
  //player info
  //check if any voxels there
  let start = new THREE.Vector3(player.x, player.y, player.z);
  let end = new THREE.Vector3(player.x, player.y, player.z);
  let start2 = new THREE.Vector3(player.x, camera.position.y, player.z);
  let end2 = new THREE.Vector3(player.x, camera.position.y, player.z);
  const intersection = intersectWorld.intersectRay(start, end);
  const intersection2 = intersectWorld.intersectRay(start2, end2);

  if (intersection || intersection2) {
    //hit
    return true;
  } else {
    return false;
  }
  //end
}

var playerHand;
function keydown(e) {
  //e.key = e.key.toLowerCase();
  keys[e.key] = true;
  if (e.key == 'w') {
    //   lastWPress = currentTime;
  }
};
function keyup(e) {
  // e.key = e.key.toLowerCase();
  keys[e.key] = false;
  if (e.key == ' ') {
    if (currentTime - lastSpacePress < doubleTapDelay && flying == true) {
      //Is flying, and double tapped space again (stop flying)
      flying = false;
    }
    else if (currentTime - lastSpacePress < doubleTapDelay) {//<pre-determined amount of time since last space press
      //TODO:Add option to change timing later
      flying = true;
    }

    lastSpacePress = currentTime;

  }
  if (e.key == 'w') {
    if (currentTime - lastWPress < doubleTapDelay && playerCorrectiveSpeed == .23) {
      playerCorrectiveSpeed = .15;
      playerSpeed = .35;
      //Sprinting
      camera.fov = 90;
      camera.updateProjectionMatrix();


    } else if (playerCorrectiveSpeed == .15) {
      playerSpeed = .3;
      camera.fov = 70;
      camera.updateProjectionMatrix();
      playerCorrectiveSpeed = .23;
    }
    lastWPress = currentTime;
  }
};//key updates.. hah.."KEY" updates? eh? getit? no?nvm

function main(dat) {
  camera = new THREE.PerspectiveCamera(70, dat.width / dat.height, 0.1, 500);
  scene = new THREE.Scene();
  SortaPhysics.init(CANNON);
  scene.fog = new THREE.FogExp2('rgb(255,255,255)', 0.01);
  renderer = new THREE.WebGLRenderer({ canvas: dat.canvas });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(dat.width, dat.height, false);//req.false
  //controls = new PhysicsControls(camera);
  clock = new THREE.Clock();
  camera.position.set(1, 128, 1);//1 for inner chunk
  var ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);//ambient light
  shadows = new CSM({
    maxFar: camera.far,
    cascades: 4,
    mode: 'practical',
    shadowMapSize: 128,//low res shadows
    lightDirection: new THREE.Vector3(-1, -1, 1).normalize(),
    parent: scene,
    camera: camera,
    fade: true,
    lightIntensity: 2,
    lightNear: 30,
    lightFar: 750,
  });
  shadows.updateLightIntensity = function (brightness) {
    for (let i = 0; i < shadows.lights.length; i++) {
      var lt = shadows.lights[i];
      lt.intensity = brightness;
    }
  }
  pointerBlock = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ wireframe: true, color: "white" }));
  pointerBlock.scale.set(1.01, 1.01, 1.01);//to fix outlines not showing
  setupPhysicsControls();


  sunSphere = new THREEx.DayNight.SunSphere();

  scene.add(sunSphere.object3d);
  sunLight = new THREEx.DayNight.SunLight();
  // sunLight.object3d.renderOrder = 2;

  //  scene.add(sunLight.object3d);


  //  initParticles();//particle
  effectComposer = new EffectComposer(renderer);//effect composer
  renderPass = new RenderPass(scene, camera);

  fxaaPass = new ShaderPass(FXAAShader);

  let pixRatio = renderer.getPixelRatio();

  fxaaPass.material.uniforms['resolution'].value.x = 1 / (dat.width * pixRatio);

  fxaaPass.material.uniforms['resolution'].value.y = 1 / (dat.height * pixRatio);
  effectComposer.addPass(renderPass);//render pass

  effectComposer.addPass(fxaaPass);

  graphicsFaster();
  render();
  getFPS.framerate();//start fps counter

  /* DEBUG */
  postMessage(['done']);
  //canRender = true;
}

function setupPhysicsControls() {
  let body = SortaPhysics.makeSphere(1, 1);
  body.position.set(0, 128, 0);
  let obj = new THREE.Object3D();//Filler object, change this later
  SortaPhysics.addObject(obj);
  /*
  let plane = SortaPhysics.makePlane(0).rotate('x', -Math.PI / 2);
  SortaPhysics.addObject(new THREE.Object3D());
  plane.position.set(0, 32, 0);
  */
  controls = new PhysicsControls(camera, body);//Attach body to camera, for controls

  // Create voxel body
  voxelBody = new CANNON.Box(new CANNON.Vec3(.5,.5,.5));
  voxelCompound = new CANNON.Body({mass:0})
  SortaPhysics.world.add(voxelCompound);
  SortaPhysics.bodies.push(voxelCompound);
  SortaPhysics.objects.push(new THREE.Object3D());
  canRender = true;

}

function setPhysVoxel(x,y,z,type){
  // This function makes/removes physics bodies for voxels IG.
  if(type != 0){
  voxelCompound.addShape(voxelBody, new CANNON.Vec3(x,y,z))
  //voxelBodies[x+','+y+','+z] = body;
  } else {
    // remove voxel
  }
}
function createParticles(x, y, z, name) {
  let pos = new THREE.Vector3(x, y, z)
  let particles = new THREE.Geometry();
  let texId = textureSet[voxelNames.indexOf(name)].top;
  let tex = new THREE.CanvasTexture(texId);
  let particleMaterial = new THREE.PointsMaterial({
    size: .1,
    map: tex
  });
  for (let p = 0; p < 10; p++) {
    let particle = new THREE.Vector3(Math.random(), Math.random(), Math.random());
    // particle.add(pos);//correct position
    particle.velocity = Math.random() * 0.1;
    particles.vertices.push(particle);
  }
  let particleSystem = new THREE.Points(
    particles,
    particleMaterial,
  )
  particleSystem.position.set(x, y, z);
  particleSystem.sortParticles = true;
  blockParticles.push(particleSystem);
  scene.add(particleSystem);
  setTimeout(function () {
    blockParticles.splice(blockParticles.indexOf(particleSystem), 1);
    scene.remove(particleSystem);
  }, 5000);//Delete after 10 seconds
  return particleSystem;
}
function graphicsFancy() {//switch to fancy mode
  graphicsMode = 'fancy';
  material = fancymaterial;
  //switch all chunks ig to fancy (may lag)
  var l = chunkIndex.length;//more optimized than reading length?
  for (var i = 0; i < l; i++) {
    ChunksMesh[chunkIndex[i]].material = material;//switch(lag?)
  }
  renderer.shadowMap.enabled = true;
}
function graphicsFaster() {//switch to faster graphics
  graphicsMode = 'fast';

  material = fastmaterial;
  var l = chunkIndex.length;
  for (var i = 0; i < l; i++) {
    ChunksMesh[chunkIndex[i]].material = material;//switch
  }
  renderer.shadowMap.enabled = false;

}
function render(time) {
  requestAnimationFrame(render);
  if (Math.floor(currentTime) % 10 == 0) {
    renderer.shadowMap.needsUpdate = true;
  }
  if(canRender == true){
  SortaPhysics.update(time);
  }
  controls.update(keys, time);

  updateDaytime()//update sun

  //playerMovement();

  dropParticles();


  blockPointer();//block outline

  camera.updateMatrixWorld();//req.for shadows

  shadows.update();//update

  if (PlayerChunk != 'hold') {//dont change unless not hold or undefined
    PlayerChunk = chunkClamp(camera.position, true);//clamp chunk to player area
  }


  manageVoxelLoading();//manage voxel world (if creating)

  lazyLoadChunks();//init lazy loadin g

  checkCullChunks();//check chunks that can be culled and cull them

  //hideOldChunks();
  effectComposer.render();


}
function dropParticles() {
  for (let i in blockParticles) {
    let group = blockParticles[i];
    for (let p in group.geometry.vertices) {
      let particle = group.geometry.vertices[p];
      if (particle.velocity < .2) {
        particle.velocity += Math.random() * 0.05;
      }
      //let colli = checkCollisions(particle);
      //if(true==true){
      particle.y -= particle.velocity;
      //}
    }
    group.geometry.verticesNeedUpdate = true;
  }
}


function hideOldChunks() {
  var camPos = realRoundVec(camera.position)
  var camPosBox = {
    min: {
      x: camPos.x - renderDist,
      y: 0,
      z: camPos.z - renderDist,
    },
    max: {
      x: camPos.x + renderDist,
      y: Infinity,
      z: camPos.z + renderDist,
    }
  };//no need to recalculate
  for (var i = 0; i < chunkIndex.length; i++) {
    var chunk = ChunksMesh[chunkIndex[i]];
    var pos = vecFromString(chunkIndex[i]);//get position
    if (!AABBCollision(pos, camPosBox) && scene.children.includes(chunk)) {
      chunkIndex.splice(i, 1);//remove from list
      scene.remove(chunk);
    }

  }
}
function moveHand() {

}
function stringifyVec2(x, y, z) {
  return x + "," + y + "," + z;
}
function checkCullChunks() {
  for (var i = 0; i < CullChunkIndex.length; i++) {
    var chunk = CullChunks[CullChunkIndex[i]];
    var pos = vecFromString(CullChunkIndex[i]);
    pos = numberizeVec(pos);//fix
    var fourNeighbors = [
      Chunks[stringifyVec2(pos.x + 16, pos.y, pos.z)],
      Chunks[stringifyVec2(pos.x - 16, pos.y, pos.z)],
      Chunks[stringifyVec2(pos.x, pos.y, pos.z + 16)],
      Chunks[stringifyVec2(pos.x, pos.y, pos.z - 16)]
    ];

    //get neighbors for chunks
    var allThere = true;

    for (var lp = 0; lp < 4; lp++) {
      if (fourNeighbors[lp] == undefined) { allThere = false };
    }//check if all chunks there yet to clear out

    if (allThere == true) {
      //because all chunks there , you can regenerated geometry data

      //custom method: cull_faces [with extra var for idx] (when complete, strip this chunk from culling list)
      geometryDataWorker2.postMessage(['geometrydata', pos.x, pos.y, pos.z, 'cull_faces', pos, pos, i]);//why is there so many times?so ineff
      CullChunkIndex.splice(i, 1);//Clear so its doesnt repeat
    }
  }
}
function vecFromString(str) {
  let spl = str.split(',');
  return new THREE.Vector3(spl[0], spl[1], spl[2]);
}
function updateDaytime() {
  sunAngle += clock.getDelta() / dayDuration * Math.PI * 2;
  sunLight.update(sunAngle);
  sunSphere.object3d.lookAt(camera.position);
  sunSphere.object3d.position.set(0, 0, 0);
  sunSphere.update(sunAngle);
  let newPos = sunSphere.object3d.position.add(camera.position);
  sunSphere.object3d.position.set(newPos.x, newPos.y, newPos.z)
  let v = new THREE.Vector3(0, -1, Math.cos(sunAngle)).normalize();

  let intensity = Math.sin(sunAngle);
  let density = -Math.sin(sunAngle);
  var phase = THREEx.DayNight.currentPhase(sunAngle);
  if (density < 0) {
    density = 0.01
  }
  if (density > .1) {
    density = .1;
  }
  //scene.fog.density = density;

  //let colorRange = density.map(0.01, .1, 255, 0);
  //scene.fog.color.setRGB(colorRange, colorRange, colorRange);
  //scene.fog.color.setHex(0xffffff)
  //0 in RGB = black, 255 = white

  if (intensity < 0) {
    intensity = .2;
  }
  if (intensity > 1) {
    intensity = 1;
  }
  shadows.updateLightIntensity(intensity * 4);
  //update shadow brightness

  //bg color
  if (phase === 'day') {
    scene.background = new THREE.Color('#548AB8');
  } else if (phase === 'twilight') {
    //Change the "120" and the "240"? Idk
    scene.background = new THREE.Color("rgb(0," + (120 - Math.floor(Math.sin(sunAngle) * 240 * -1)) + "," + (255 - Math.floor(Math.sin(sunAngle) * 510 * -1)) + ")");
  } else {
    scene.background = new THREE.Color('black');
  }
}

function playerMovement() {//move plyr
  getDistanceToGround();//fall speed
  PlayerChunk = chunkClamp(camera.position, true);

  moved[0] = 0;
  moved[1] = 0;
  moved[2] = 0;
  moved[3] = 0;
  moved[4] = 0;
  moved[5] = 0;
  var preMovement = new THREE.Vector3().copy(camera.position);
  if (keys['w'] || keys['a'] || keys['s'] || keys['d']) {
    if (playerAccel < playerSpeed) {
      playerAccel += 0.005
    }
  } else if (!keys['w'] && !keys['a'] && !keys['s'] && !keys['d']) {
    playerAccel = .1;
  }
  if (keys['Shift']) {
    if (flying == true) {
      //Go down,if flying
      camera.position.y -= .1;
      if (checkIntersections() == true) {//Undo
        camera.position.y += .1;
      }
    }
  }
  if (keys['w']) {
    controls.moveForward(playerAccel / 2);
    moved[0] = 1;
    if (checkIntersections() == true) {

      controls.moveForward(-playerAccel / 2)//pre check so you cant see inside
    } else {
      /*
      if (playerAccel > .1) {
        controls.moveForward(-Math.abs(playerAccel - .1));
      }
      */
    }

  }
  if (keys['a']) {
    controls.moveRight(-.3);
    moved[1] = 1;
    if (checkIntersections() == true) {
      controls.moveRight(.3)//pre check so you cant see inside
    } else {
      controls.moveRight(.23);
    }
  }

  if (keys['s']) {
    controls.moveForward(-.3);
    moved[3] = 1;
    if (checkIntersections() == true) {
      controls.moveForward(.3)//pre check so you cant see inside
    } else {
      controls.moveForward(.23);
    }
  }
  if (keys['d']) {
    controls.moveRight(.3);
    moved[4] = 1;
    if (checkIntersections() == true) {
      controls.moveRight(-.3)//pre check so you cant see inside
    } else {
      controls.moveRight(-.23);
    }

  }
  if (jumping == true) {
    if (jumpG >= 0.02) {//Start jumping quickly, then go slower
      jumpG -= .02;
      camera.position.y += jumpG;
      if (checkIntersections() == true) {
        //Evil player jumped into ceiling :(
        camera.position.y -= jumpG;//Undo jump
        jumping = false;//no jumpign for you
      }
    } else {
      jumping = false;
    }

  }
  if (keys[' ']) {
    if (flying == false) {
      if (canJump == true) {

        //Set jump speed
        jumpG = .29;//Minecraft lets you jump only 1 block
        jumping = true;
        canJump = false;
        keys[' '] = false;
        //jumping=true;
        moved[2] = 1;//preset

        jumpY = camera.position.y;
      }
    } else {
      camera.position.y += .1;
      if (checkIntersections() == true) {
        camera.position.y -= .1;
      }
    }
  } else {

  }

  let canFall = false;
  if (PlayerChunk != undefined && camera.position.y < 64 || PlayerChunk === undefined && camera.position.y > 64) {
    canFall = true;
  }
  let rendered = false;
  if (checkIntersections() === true) {

    bumping = true;
    goBack(moved);

    moveHand();
    if (canRender == true) {
      if (rendered == false) {
        // renderer.render(scene, camera)
        effectComposer.render();
        rendered = true;
      }
    }
  } else {
    bumping = false;
    if (canFall == true) {
      if (jumping == false) {
        if (flying == false) {//Not flying
          if (!g) {
            g = 0;
          }
          if (g < .6) {
            g += 0.01;
          }
          else {
            /*Used for debugging purposes. */
          }

          camera.position.y -= g;
        }

        /*
        #1. Subtract position by gravity
        #2. do checkIntersections().
        #3. If checkIntersections() is TRUE, you are IN the ground.
        #4. If you are IN the ground, add back gravity so you aren't.
        */
        if (checkIntersections() === true) {
          camera.position.y += g;//In a block, go back up!
          let gBuffer = g;
          canJump = true;//Test
          g = 0;
          moved[5] = 1;
          if (checkIntersections() === true) {//In a block again!

            bumping = true;
            camera.position.y -= gBuffer;//Undo our terrible mistake
            //right here
            canJump = true;//can jump
          } else {
            //Do nothing, all is cool and good [Insert meme here]

          }
        }
      }
    }
    moveHand();
    if (canRender == true) {
      // renderer.render(scene, camera);
      if (rendered == false) {
        effectComposer.render()
      }
    }
  }

  if (PlayerChunk != undefined && fallen == false) {
    fallen = true;
    dropPlayerToGround();
  }
}
function goBack(arr) {
  if (arr[0]) {
    controls.moveForward(-.07)
  }
  if (arr[1]) {
    controls.moveRight(.07);
  }
  if (arr[3]) {
    controls.moveForward(.07);
  }
  if (arr[4]) {
    controls.moveRight(-.07);
  }
  if (arr[5]) {
    //  camera.position.y+=.1;
  }

}
function dropPlayerToGround() {
  let start = new THREE.Vector3(camera.position.x + 0.05, camera.position.y, camera.position.z + 0.05);
  let end = new THREE.Vector3(camera.position.x + 0.05, camera.position.y - 64, camera.position.z + 0.05);
  const intersect = intersectWorld.intersectRay(start, end);
  if (intersect) {
    //get posy
    let voxelId = 1;//so you end up ontop
    const pos = intersect.position.map((v, ndx) => {
      return v + intersect.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
    });
    camera.position.set(...pos);
    camera.position.y += 1.5
  }
}
function checkCollisions(pos) {
  //let pos2 = new THREE.Vector3(pos.x,pos.y,pos.z);
  const intersect = intersectWorld.intersectRay(pos, pos);
  if (intersect) {
    return true;
  } else {
    return false;
  }
}
function getDistanceToGround() {
  if (PlayerChunk != undefined || PlayerChunk != 'hold') {

    if (jumpY != undefined) {
      var y = jumpY;
    } else {
      var y = camera.position.y;
    }
    let start = new THREE.Vector3(camera.position.x + 0.05, y, camera.position.z + 0.05);
    let end = new THREE.Vector3(camera.position.x + 0.05, y - 64, camera.position.z + 0.05);
    const intersect = intersectWorld.intersectRay(start, end);
    if (intersect) {
      //get posy
      let voxelId = 1;//so you end up ontop
      const pos = intersect.position.map((v, ndx) => {
        return v + intersect.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
      });
      //Dist to ground
      dToGround = camera.position.y - pos[1];
      //dist/base v?

    }
  }
}
function resize(dat) {
  if (renderer) {
    renderer.setSize(dat.width, dat.height, false);//false for offscreen
    camera.aspect = dat.width / dat.height;
    camera.updateProjectionMatrix();//update size
  }
}
//custom methods
function mousemove(dat) {
  if (dat.type2 == 'touch') {
    if (dat.moveX.isNaN() || dat.moveY.isNaN()) {
      dat.moveX = 0;
      dat.moveY = 0;
    }
    var mVec = new THREE.Vector2(dat.moveX, dat.moveY);
  } else {
    var mVec = new THREE.Vector2(dat.moveX, dat.moveY);
  }
  controls.mousemove(mVec);//pas info
}
function inRange(val, min, max) {
  return val >= min && val <= max;//in range of max/min
}
function convInt(x, y, z) {
  return new THREE.Vector3(Number(x), Number(y), Number(z));
}

function AABBCollision(point, box) {
  return (point.x >= box.min.x && point.x <= box.max.x) &&
    (point.z >= box.min.z && point.z <= box.max.z) &&
    (point.y >= box.min.x && point.y <= box.max.y);
}
function compareVec(vec, vec2) {
  return vec.x == vec2.x && vec.y == vec2.y && vec.z == vec2.z;
}
function signVec(vec, checkSign) {//return sign
  if (checkSign === undefined) {
    return new THREE.Vector3(Math.sign(vec.x), Math.sign(vec.y), Math.sign(vec.z));
  } else {
    var signVec = new THREE.Vector3(Math.sign(vec.x), Math.sign(vec.y), Math.sign(vec.z));
    return signVec.x > 0 && signVec.y > 0 && signVec.z > 0;//check
  }
}
function floorVec(v) {
  return new THREE.Vector3((Math.floor(v.x)), (Math.floor(v.y)), (Math.floor(v.z)));
}
function negativeChunkClamp(vec) {

  var remainedX = vec.x % 16;
  var remainedY = vec.y % 64;
  var remainedZ = vec.z % 16;

  var clampX = vec.x - remainedX;
  var clampY = vec.y - remainedY;
  var clampZ = vec.z - remainedZ;
  /*
  if(vec.x < 0){
    remainedX = vec.x % -16;
  clampX = vec.x+remainedX;

  }
  if(vec.z < 0){
    remainedZ = vec.z % -16;
  clampZ = vec.z+remainedZ;
  }
  */

  return new THREE.Vector3(clampX, clampY, clampZ)
}
function newChunkClamp(vec) {//clamp position for new chunk
  var x = vec.x;
  var z = vec.z;
  var y = vec.y || 0;
  var remainedX = x % 16;
  var remainedZ = z % 16;
  var remainedY = y % 64;//chunks are 16x 64 x16
  if (vec.x < 0) {

    //remainedX = Math.abs(remainedX);

  }
  if (vec.z < 0) {
    //remainedZ = Math.abs(remainedZ);
  }
  var clampX = x - remainedX;
  var clampZ = z - remainedZ;
  var clampY = y - remainedY;
  return { x: clampX, y: clampY, z: clampZ }
}
function roundVec(v) {
  var roundedX = Number((v.x).toFixed(1));
  var roundedY = Number((v.y).toFixed(1));
  var roundedZ = Number((v.z).toFixed(1));
  var vec = new THREE.Vector3(roundedX, roundedY, roundedZ);
  return vec;
}
function stringifyVec(v) {//stringify a vector3
  return v.x + "," + v.y + "," + v.z
}
function vecFromArray(array) {
  return new THREE.Vector3(array[0], array[1], array[2]);//vec from array
}
function mousedown(eventData) {
  var buttonPressed = eventData.buttonPressed;
  if (buttonPressed == 2) {
    modifyChunk2(currentVoxel);

  }
  if (buttonPressed == 0) {
    modifyChunk2(0);//break
    postMessage(['break_animation'])
  }
}

var renderDist = 16;//chunks*16
function roundToFixed(vec, amt) {
  return new THREE.Vector3(vec.x.toFixed(amt), vec.y.toFixed(amt), vec.z.toFixed(amt));
}
function numberizeVec(vec) {
  return new THREE.Vector3(Number(vec.x), Number(vec.y), Number(vec.z));
}
function realRoundVec(vec) {
  return new THREE.Vector3(Math.round(vec.x), Math.round(vec.y), Math.round(vec.z))
}
function isColliding(voxel) {
  var camPos = new THREE.Vector3().copy(camera.position);
  camPos = roundToFixed(camPos, 1);
  camPos = numberizeVec(camPos);
  camPos.y -= 1;
  voxel = roundToFixed(voxel, 1);//round again
  voxel = numberizeVec(voxel);//fix

  if (voxel.x >= camPos.x - .5 && voxel.x <= camPos.x + .5 && voxel.z >= camPos.z - .5 && voxel.z <= camPos.z + .5 && voxel.y >= camPos.y - 1.5 && voxel.y <= camPos.y) {
    return true;
  }
  /*
  for(var y = -5;y<5;y++){
  
    var vec = new THREE.Vector3().copy(camPos);
    vec.y+= y/10;
    vec.y = vec.y.toFixed(1)
    vec.y = Number(vec.y);
  
    if(compareVec(voxel,vec)==true){
      return true;
    }
  }
  */
}
function calculateEdgeDir(vec, addr) {
  var addr2 = new THREE.Vector3().copy(addr)
  if (vec.x === 0 || vec.x == 1) {
    addr2.x -= 16;
  }
  if (vec.x === 16 || vec.x == 15) {
    addr2.x += 16;
  }
  if (vec.z === 0 || vec.z == 1) {
    addr2.z -= 16;
  }
  if (vec.z === 16 || vec.z === 15) {
    addr2.z += 16;
  }
  return addr2;
}
function truncateVec(vec) {
  return new THREE.Vector3(Math.trunc(vec.x), Math.trunc(vec.y), Math.trunc(vec.z));
}
function modifyChunk2(voxel1) {
  const start = new THREE.Vector3();
  const end = new THREE.Vector3();
  start.setFromMatrixPosition(camera.matrixWorld);
  end.set(0, 0, 1).unproject(camera);

  //dir computation
  var dir = new THREE.Vector3();
  dir.subVectors(end, start).normalize();//reduce

  //set a maximum reach of six blocks (defined. in maxReach var)

  end.copy(start);
  end.addScaledVector(dir, maxReach);//set

  var selectedChunk;//prepare some variables
  var chunkPosition;

  //get the intersection from intersectworld octree

  const intersection = intersectWorld.intersectRay(start, end);//find a hit

  if (intersection) {//got a voxel

    const voxelId = voxel1;//set for comparison between break/place

    const pos = intersection.position.map(function (v, ndx) {//map position to normal
      //the comparison is to correct mathematical imprecision.
      //if you aree trying to break the block, go half a normal INTO the voxel.
      //if you are trying to place, you need to go half a normal OUT of the voxel, adding the direction from normal
      return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
    });

    var intersectionVector = vecFromArray(pos);//vec from array
    if (voxel1 == 0) {

      postMessage(['equip_block', voxelDrops[intersectWorld.getVoxel(pos[0], pos[1], pos[2]) - 1]]);
      //Equip Block
    }

    chunkPosition = newChunkClamp(intersectionVector);//get the position of the chunk (vertical support)

    selectedChunk = Chunks[stringifyVec(chunkPosition)];//stringify the vector to get chunk picked
    if (intersectWorld.getCustomBlockType(intersectWorld.getVoxel(pos[0], pos[1] - 1, pos[2]), false) == true && voxel1 == 3) {
      intersectionVector.y -= 1;
      pos[1] -= 1;//reduce
      voxel1 = 4;
    }

    if (intersectionVector.y > 1) {
      if (voxel1 == 0 || isColliding(intersectionVector) == undefined) {
        if (selectedChunk) {



          //the chunk exists
          if (pos[1] < 64) {
            var correctedPos = chunkClamp(intersectionVector, true);

            var relativeBlockPosition = roundVec(new THREE.Vector3(pos[0] - correctedPos.x, pos[1] - correctedPos.y, pos[2] - correctedPos.z));//realtive
            relativeBlockPosition = truncateVec(relativeBlockPosition)//truncate
            //  var correctedPos = chunkPosition
            selectedChunk.setVoxel(pos[0] - correctedPos.x, pos[1] - correctedPos.y, pos[2] - correctedPos.z, voxel1);//set voxel @ chunk


            //Drop Particles
            let blockX = (Math.floor(pos[0]))
            let blockY = (Math.floor(pos[1]))
            let blockZ = (Math.floor(pos[2]));
            let voxAtPos = intersectWorld.getVoxel(...pos);
            let blockName = voxelId > 0 ? voxelNames[voxelId - 1] : voxelNames[voxAtPos - 1];
            createParticles(blockX, blockY, blockZ, blockName);
            //End drop particles

            intersectWorld.setVoxel(intersectionVector.x, intersectionVector.y, intersectionVector.z, voxel1);//for intesection later at world relative

            // PHYSICS!
            //setPhysVoxel(blockX,blockY,blockZ,voxel1);
            //haha no
            //its commented out



            geometryDataWorker.postMessage(['voxel', intersectionVector.x, intersectionVector.y, intersectionVector.z, voxel1]);//set for geometry data update

            geometryDataWorker2.postMessage(['voxel', pos[0], pos[1], pos[2], voxel1]);//for chunkupdATE

            if (voxel1 === 8) {
              //torch, set light
              var light = new THREE.PointLight(0xffe53b, 2, 16);

              light.position.set(pos[0], pos[1] + .5, pos[2]);//center light
              var lightfr = floorVec(new THREE.Vector3(pos[0], pos[1], pos[2]));
              ChunkLights[lightfr.x + "," + lightfr.y + "," + lightfr.z] = light;//for removal later
              scene.add(light);
            }
            if (voxel1 == 0) {
              var lt = floorVec(new THREE.Vector3(pos[0], pos[1], pos[2]));
              var lightObj = ChunkLights[lt.x + "," + lt.y + "," + lt.z];
              if (lightObj != undefined) {
                scene.remove(lightObj);
                lightObj = undefined;
              }
            }

            if (relativeBlockPosition.x == 0 || relativeBlockPosition.x == 16 || relativeBlockPosition.x == 1 || relativeBlockPosition.x == 15 || relativeBlockPosition.z == 1 || relativeBlockPosition.z == 15 || relativeBlockPosition.z == 0 || relativeBlockPosition.z == 16) {
              //on edge of chunk, must call of geometry data so you can't see through chunks
              var edgeChunkPos = calculateEdgeDir(relativeBlockPosition, correctedPos);

              geometryDataWorker.postMessage(['geometrydata', edgeChunkPos.x, edgeChunkPos.y, edgeChunkPos.z, 'chunk_update', edgeChunkPos, edgeChunkPos]);
              geometryDataWorker.postMessage(['geometrydata', correctedPos.x, correctedPos.y, correctedPos.z, 'chunk_update', correctedPos, correctedPos]);
              //neighbor first,prevent flickering

            } else {
              geometryDataWorker.postMessage(['geometrydata', correctedPos.x, correctedPos.y, correctedPos.z, 'chunk_update', correctedPos, correctedPos]);
            }

          }
        }
        if (pos[1] > 64 && selectedChunk == undefined) {
          //vertical chunk non-existen
          selectedChunk = createEmptyChunk(chunkPosition);//create new vertical chunk @ pos

          var correctedPos = chunkPosition;
          selectedChunk.setVoxel(pos[0] - correctedPos.x, pos[1] - correctedPos.y, pos[2] - correctedPos.z, voxel1);
          intersectWorld.setVoxel(intersectionVector.x, intersectionVector.y, intersectionVector.z, voxel1);
          geometryDataWorker.postMessage(['voxel', intersectionVector.x, intersectionVector.y, intersectionVector.z, voxel1]);
          geometryDataWorker2.postMessage(['voxel', intersectionVector.x, intersectionVector.y, intersectionVector.z, voxel1]);
          geometryDataWorker.postMessage(['geometrydata', correctedPos.x, correctedPos.y, correctedPos.z, 'chunk_update', correctedPos, correctedPos])
        }
      }
    }
  }
}
function modifyChunk(voxel1) {//modify a chunk


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
  const intersection = intersectWorld.intersectRay(start, end);//from large intersectworld
  if (intersection) {
    const voxelId = voxel1;

    // the intersection point is on the face. That means
    // the math imprecision could put us on either side of the face.
    // so go half a normal into the voxel if removing (currentVoxel = 0)
    // our out of the voxel if adding (currentVoxel  > 0)
    const pos = intersection.position.map((v, ndx) => {
      return v + intersection.normal[ndx] * (voxelId > 0 ? 0.5 : -0.5);
    });
    var posVec = new THREE.Vector3(pos[0], pos[1], pos[2]);
    chunk = chunkClamp(posVec, false);
    correctedPos = chunkClamp(posVec, true);//no update unless chunk exists
    var roundCam = floorVec(camera.position);
    var roundPosVec = floorVec(posVec);//rounded
    if (compareVec(roundCam, roundPosVec) === false) {//cannot place block in self
      if (chunk) {
        chunk.setVoxel(pos[0] - correctedPos.x, pos[1] - correctedPos.y, pos[2] - correctedPos.z, voxel1);//set voxel in world @ chunk clamped
        intersectWorld.setVoxel(pos[0], pos[1], pos[2], voxel1);//set for intersects
        geometryDataWorker.postMessage(['voxel', pos[0], pos[1], pos[2], voxel1]);//pass to intersectworker (nolag)
        geometryDataWorker.postMessage(['geometrydata', correctedPos.x, correctedPos.y, correctedPos.z, 'chunk_update', correctedPos, { x: pos[0], y: pos[1], z: pos[2] }]);
      } else {


      }

    }
  }
}

function lazyLoadChunks() {
  var clampMin = newChunkClamp({ x: camera.position.x - renderDist, z: camera.position.z - renderDist });
  var clampMax = newChunkClamp({ x: camera.position.x + renderDist, z: camera.position.z + renderDist });
  for (var x = clampMin.x; x < clampMax.x; x += 16) {
    for (var z = clampMin.z; z < clampMax.z; z += 16) {
      var chunk = Chunks[x + ",0," + z];
      var mesh = ChunksMesh[x + ",0," + z];
      if (chunkIndex.indexOf(x + ",0," + z) == -1 && chunk != undefined) {
        //    chunkIndex.push(x+",0,"+z);//stop infinitely doing thes same thing
        //  var {positions,normals,uvs,indices} = intersectWorld.generateGeometryDataForCell(x,0,z);
        //  loadChunk(x,0,z,chunk,[positions,normals,uvs,indices]);
        //Chunk exists
        if (mesh != undefined && !scene.children.includes(mesh)) {
          scene.add(mesh);
        }

      }
      if (chunk == undefined && lazyVoxelData.done == true) {
        lazyVoxelData.done = false;
        createChunk(x, 0, z);

      }
    }
  }
}

function chunkClamp(vec, pos2) {
  //clamp to chunk
  //example: min pos of chunk = x,y,z(0)
  //max pos of chunk = x,y,z+16(all)
  //if input = x,y,z+8 return chunk from above

  var x = vec.x;
  var y = vec.y;
  var z = vec.z;
  for (var i = 0; i < chunkIndex.length; i++) {
    var chunkName = chunkIndex[i];
    var chunk = Chunks[String(chunkName)];
    var pos = chunkName.split(',');//get x,y,z in arr
    var posMin = { x: Number(pos[0]), y: Number(pos[1]), z: Number(pos[2]) };
    var posMax = {
      x: posMin.x + 16,
      y: posMin.y + 64,
      z: posMin.z + 16,
    };
    if (inRange(x, posMin.x, posMax.x) && inRange(y, posMin.y, posMax.y) && inRange(z, posMin.z, posMax.z)) {
      //inside range, return this chunk
      if (pos2 === false) {
        return chunk;//chunk
      } else {
        return posMin;//pos
      }
    } else {
      //not this chunk...
    }


  }
}
function blockPointer() {
  //highlight blocks to place/break
  let start = new THREE.Vector3();
  let end = new THREE.Vector3();
  start.setFromMatrixPosition(camera.matrixWorld);
  end.set(0, 0, 1).unproject(camera);//0,0 = center of screen
  var dir = new THREE.Vector3();
  dir.subVectors(end, start).normalize();
  var roundDir = roundVec(dir)
  end.copy(start);
  end.addScaledVector(dir, maxReach);//enable max reach
  let intersection = intersectWorld.intersectRay(start, end);
  if (intersection) {
    //hit something, move outline to pos
    let voxid = currentVoxel;
    let posHit = intersection.position.map((v, ndx) => {
      return v + intersection.normal[ndx] * -0.5
    });
    var vox = intersectWorld.getVoxel(posHit[0], posHit[1], posHit[2]);
    //clamp (no in betweens)
    posHit[0] = (Math.floor(posHit[0]) + .5)
    posHit[1] = (Math.floor(posHit[1]) + .5)
    posHit[2] = (Math.floor(posHit[2]) + .5);
    if (intersectWorld.getCustomBlockType(vox, true) == false) {

      pointerBlock.scale.set(1.01, 1.01, 1.01);

      pointerBlock.position.set(posHit[0], posHit[1], posHit[2]);//set wireframe @ pos
    } else {

      pointerBlock.scale.set(1.01, .51, 1.01);//set half size outline


      pointerBlock.position.set(posHit[0], posHit[1] - .25, posHit[2]);//set wireframe @ pos

    }

  }
}

//3D Particles!!




//DayNight(minify)
var THREEx = THREEx || {}; THREEx.DayNight = {}, THREEx.DayNight.baseURL = "/", THREEx.DayNight.currentPhase = function (t) { return Math.sin(t) > Math.sin(0) ? "day" : Math.sin(t) > Math.sin(-Math.PI / 6) ? "twilight" : "night" }, THREEx.DayNight.SunLight = function () { var t = new THREE.DirectionalLight(16777215, 2); this.object3d = t, this.update = function (i) { t.position.x = 0, t.position.y = 9e4 * Math.sin(i), t.position.z = 9e4 * Math.cos(i); var a = THREEx.DayNight.currentPhase(i); "day" === a ? t.color.set("rgb(255," + (Math.floor(200 * Math.sin(i)) + 55) + "," + Math.floor(200 * Math.sin(i)) + ")") : "twilight" === a ? (t.intensity = 2, t.color.set("rgb(" + (255 - Math.floor(510 * Math.sin(i) * -1)) + "," + (55 - Math.floor(110 * Math.sin(i) * -1)) + ",0)")) : t.intensity = 0 } }, THREEx.DayNight.SunSphere = function () { var t = new THREE.PlaneGeometry(30, 30, 30), i = new THREE.MeshBasicMaterial({ color: 16711680, side: THREE.DoubleSide }), a = new THREE.Mesh(t, i); this.object3d = a, this.update = function (t) { a.position.x = 0, a.position.y = 400 * Math.sin(t), a.position.z = 400 * Math.cos(t); var i = THREEx.DayNight.currentPhase(t); "day" === i ? a.material.color.set("rgb(255," + (Math.floor(200 * Math.sin(t)) + 55) + "," + (Math.floor(200 * Math.sin(t)) + 5) + ")") : "twilight" === i && a.material.color.set("rgb(255,55,5)") } };
//PointerLockControls(minify)
var PointerLockControls = function (t) { var o = this; this.minPolarAngle = 0, this.maxPolarAngle = Math.PI; var n, r = new THREE.Euler(0, 0, 0, "YXZ"), e = Math.PI / 2, i = new THREE.Vector3; this.mousemove = function (n) { var i = n.x, a = n.y; r.setFromQuaternion(t.quaternion), r.y -= .002 * i, r.x -= .002 * a, r.x = Math.max(e - o.maxPolarAngle, Math.min(e - o.minPolarAngle, r.x)), t.quaternion.setFromEuler(r) }, this.getDirection = (n = new THREE.Vector3(0, 0, -1), function (o) { return o.copy(n).applyQuaternion(t.quaternion) }), this.moveForward = function (o) { i.setFromMatrixColumn(t.matrix, 0), i.crossVectors(t.up, i), t.position.addScaledVector(i, o) }, this.moveRight = function (o) { i.setFromMatrixColumn(t.matrix, 0), t.position.addScaledVector(i, o) } };
//VoxelWorld code (minify)
class VoxelWorld {
  constructor(options) {
    this.cellSize = options.cellSize;
    this.tileSize = options.tileSize;
    this.tileTextureWidth = options.tileTextureWidth;
    this.tileTextureHeight = options.tileTextureHeight;
    const { cellSize } = this;
    this.cellSliceSize = cellSize * cellSize;
    this.cells = {};
    this.faceIndex = {};//per cell face idx
    this.calculateFaces = options.calculateFaces;
    this.currentFace = 0;
  }
  computeCellId(x, y, z) {
    const { cellSize } = this;
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    const cellZ = Math.floor(z / cellSize);
    return `${cellX},${cellY},${cellZ}`;
  }
  computeVoxelOffset(x, y, z) {
    const { cellSize, cellSliceSize } = this;
    const voxelX = THREE.MathUtils.euclideanModulo(x, cellSize) | 0;
    const voxelY = THREE.MathUtils.euclideanModulo(y, cellSize) | 0;
    const voxelZ = THREE.MathUtils.euclideanModulo(z, cellSize) | 0;
    return voxelY * cellSliceSize +
      voxelZ * cellSize +
      voxelX;
  }
  getCellForVoxel(x, y, z) {
    return this.cells[this.computeCellId(x, y, z)]
  }
  setVoxel(x, y, z, v) {
    let cell = this.getCellForVoxel(x, y, z);
    if (!cell) {
      cell = this.addCellForVoxel(x, y, z);
    }
    const voxelOffset = this.computeVoxelOffset(x, y, z);
    cell[voxelOffset] = v;
  }
  addCellForVoxel(x, y, z) {
    const cellId = this.computeCellId(x, y, z);
    let cell = this.cells[cellId];
    if (!cell) {
      const { cellSize } = this;
      cell = new Uint8Array(cellSize * cellSize * cellSize);
      this.faceIndex[x + "," + y + "," + z] = [];
      this.cells[cellId] = cell;
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
  getCustomBlockType(voxel, typ) {
    if (typ == undefined || typ == true) {
      if (voxel != 3) {
        return typ == undefined ? VoxelWorld.faces : false;
      } else {
        return typ == undefined ? VoxelWorld.faces_half : true;
      }
    } else {
      if (voxel != 3) {
        return false;
      } else {
        return true;
      }
    }
  }

  generateGeometryDataForCell(cellX, cellY, cellZ, rx, ry, rz) {
    const { cellSize, tileSize, tileTextureWidth, tileTextureHeight } = this;
    const positions = [];
    const normals = [];
    const uvs = [];
    const indices = [];
    const startX = cellX * cellSize;
    const startY = cellY * cellSize;
    const startZ = cellZ * cellSize;
    const faceIndexGroup = this.calculateFaces == true ? this.getFaceIndexFromCell(startX, startY, startZ) : undefined;//or not
    this.currentFace = 0;//reset
    for (let y = 0; y < cellSize; ++y) {
      const voxelY = startY + y;
      for (let z = 0; z < cellSize; ++z) {
        const voxelZ = startZ + z;
        for (let x = 0; x < cellSize; ++x) {
          const voxelX = startX + x;
          const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
          var realX = rx + voxelX;
          var realZ = rz + voxelZ;
          if (voxel) {
            // voxel 0 is sky (empty) so for UVs we start at 0
            const uvVoxel = voxel - 1;
            // There is a voxel here but do we need faces for it?
            for (const { dir, corners, uvRow } of VoxelWorld.faces) {
              const neighbor = this.getVoxel(
                voxelX + dir[0],
                voxelY + dir[1],
                voxelZ + dir[2]);
              //||neighbor===4&&voxel!=4||neighbor===7&&voxel!=7
              //transparent voxel handling

              if (!neighbor) {//no neighbor OR neighbor is transparent
                addFace();//face add
              }
            }

            function addFace() {
              const ndx = positions.length / 3;
              for (const { pos, uv } of corners) {
                positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                normals.push(...dir);
                uvs.push(
                  (uvVoxel + uv[0]) * tileSize / tileTextureWidth,
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
    return {
      positions,
      normals,
      uvs,
      indices,
      faceIndexGroup,
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
    dir: [-1, 0, 0,],
    corners: [
      { pos: [0, 1, 0], uv: [0, 1], },
      { pos: [0, 0, 0], uv: [0, 0], },
      { pos: [0, 1, 1], uv: [1, 1], },
      { pos: [0, 0, 1], uv: [1, 0], },
    ],
  },
  { // right
    uvRow: 0,
    dir: [1, 0, 0,],
    corners: [
      { pos: [1, 1, 1], uv: [0, 1], },
      { pos: [1, 0, 1], uv: [0, 0], },
      { pos: [1, 1, 0], uv: [1, 1], },
      { pos: [1, 0, 0], uv: [1, 0], },
    ],
  },
  { // bottom
    uvRow: 1,
    dir: [0, -1, 0,],
    corners: [
      { pos: [1, 0, 1], uv: [1, 0], },
      { pos: [0, 0, 1], uv: [0, 0], },
      { pos: [1, 0, 0], uv: [1, 1], },
      { pos: [0, 0, 0], uv: [0, 1], },
    ],
  },
  { // top
    uvRow: 2,
    dir: [0, 1, 0,],
    corners: [
      { pos: [0, 1, 1], uv: [1, 1], },
      { pos: [1, 1, 1], uv: [0, 1], },
      { pos: [0, 1, 0], uv: [1, 0], },
      { pos: [1, 1, 0], uv: [0, 0], },
    ],
  },
  { // back
    uvRow: 0,
    dir: [0, 0, -1,],
    corners: [
      { pos: [1, 0, 0], uv: [0, 0], },
      { pos: [0, 0, 0], uv: [1, 0], },
      { pos: [1, 1, 0], uv: [0, 1], },
      { pos: [0, 1, 0], uv: [1, 1], },
    ],
  },
  { // front
    uvRow: 0,
    dir: [0, 0, 1,],
    corners: [
      { pos: [0, 0, 1], uv: [0, 0], },
      { pos: [1, 0, 1], uv: [1, 0], },
      { pos: [0, 1, 1], uv: [0, 1], },
      { pos: [1, 1, 1], uv: [1, 1], },
    ],
  },
];

function manageVoxelLoading() {
  if (lazyVoxelData.needsClear == true) {
    //clear for new voxelworld
    lazyVoxelData.finishedPosting = false;//not finished
    lazyVoxelData.needsClear = false;//no clear again
    lazyVoxelData.startTime = currentTime//time counter reset
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
  if (lazyVoxelData.done == false) {
    //not finished yet
    //evaulate data
    if (lazyVoxelData.lazyArrayTotal === NaN) {
      lazyVoxelData.lazyArrayTotal = 0;
    }
    function lazyLoad() {
      for (var e = 0; e < 30; e++) {
        if (lazyVoxelData.current < lazyVoxelData.lazyArrayTotal) {

          lazyVoxelData.lazyLoad();
        }

      }

    }
    lazyLoad();


  } else {
    setTimeout(function () {
      if (lazyVoxelData.done === true) {
        postMessage(['done']);
        //canRender = true;
        graphicsFancy();
      }
    }, 1000)
  }
}


intersectWorld = new VoxelWorld({
  cellSize,
  tileSize,
  tileTextureWidth,
  tileTextureHeight
})

function createChunk(x, y, z) {
  if (material) {
    if (chunkWorker == undefined) {
      chunkWorker = new Worker('chunkworker.js');
    }
    var currentBiome = 'caves';
    lazyVoxelData.needsClear = true;//need a clear
    chunkWorker.postMessage(['create', 16, tileSize, tileTextureWidth, tileTextureHeight, globalSeed, x, y, z, heightMult, currentBiome, 2]);
    done = false;
    var startCount = 0;
    chunkWorker.onmessage = function (e) {
      if (e.data[0] === 'voxel') {
        lazyVoxelData.lazyArray.push({ type: e.data[4], intersect: [x, y, z], position: [e.data[1], e.data[2], e.data[3]] });
        startCount += 1;
      }

      if (e.data[0] == 'progress') {
        if (e.data[1] % 750 == 0) {
          postMessage(['progress', ((e.data[1] * 100) / chunkTotal) + 1, e.data[1], chunkTotal])
        } else {
          //  postMessage(['progress', ((e.data[1] * 100) / chunkTotal) + 1])
        }
      }

      if (e.data[0] === 'complete') {
        lazyVoxelData.finishedPosting = true;
        lazyVoxelData.lazyArrayTotal = startCount;//set max
        if (PlayerChunk === 'hold') { PlayerChunk = undefined }//reset
        //    chunkWorker.terminate();//close worker, there's only so many CPU threads available
      }
    }
  } else {
    setTimeout(function () { createChunk(x, y, z) }, 250);
    console.log("Info \nSince I'm too lazy to add async functions, this code will simply keep running repeatedly until the texture finishes loading.\n Probably will replace this later :)")
  }
}
function createEmptyChunk(position) {
  var geometry = new THREE.BufferGeometry();
  var mesh = new THREE.Mesh(geometry, material);//need emtpty area for geometry data to fill in
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  renderer.compile(scene, camera);
  mesh.position.set(position.x, position.y, position.z);
  ChunksMesh[position.x + "," + position.y + "," + position.z] = mesh;
  Chunks[position.x + "," + position.y + "," + position.z] = new VoxelWorld({
    cellSize,
    tileSize,
    tileTextureWidth,
    tileTextureHeight
  });
  chunkIndex.push(position.x + "," + position.y + "," + position.z);//REQUIRE

  scene.add(mesh);
  renderer.shadowMap.needsUpdate = true;//do i relaly need thid
  return Chunks[position.x + "," + position.y + "," + position.z];
}
function loadChunk(x, y, z, world1, dat) {
  //load in chunk
  //set pos,norm,uv,ind
  var positions = dat[0];
  var normals = dat[1];
  var uvs = dat[2];
  var indices = dat[3]
  var geometry = new THREE.BufferGeometry();//new buffgeos

  geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

  geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));

  geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));

  geometry.setIndex(indices);

  var mesh = new THREE.Mesh(geometry, material);
  ChunksMesh[x + "," + y + "," + z] = mesh;//save chunk @ pos
  //shadows
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  mesh.position.set(x, y, z);//set pos
  scene.add(mesh)//ad to scene
  renderer.shadowMap.needsUpdate = true;//new chunk, need new shadow
  renderer.compile(scene, camera);
}