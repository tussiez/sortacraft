THREE = {
  MathUtils: {
    euclideanModulo:function(c,a){return(c%a+a)%a}
  }
}//euclidean modulo support

class VoxelWorld {
  constructor(options) {
    this.cellSize = options.cellSize;
    this.tileSize = options.tileSize;
    this.tileTextureWidth = options.tileTextureWidth;
    this.tileTextureHeight = options.tileTextureHeight;
    const {cellSize} = this;
    this.cellSliceSize = cellSize * cellSize;
    this.cells ={};
    this.faceIndex = {};//per cell face idx
    this.calculateFaces = options.calculateFaces;
    this.currentFace = 0;
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
      this.faceIndex[x+","+y+","+z] = [];
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
  getFaceIndexFromCell(x,y,z){//face index group from cell
    return faceIndex[x+","+y+","+z]
  }
  computeFaceIndexPosition(vx,vy,vz){
    return vx+","+vy+","+vz
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
   const faceIndexGroup = this.calculateFaces == true ? this.getFaceIndexFromCell(startX,startY,startZ) : undefined;//or not
   this.currentFace = 0;//reset
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
                if(this.calculateFaces==true){
                  //add face to indx
                //  faceIndexGroup[this.computeFaceIndexPosition(voxelX,voxelY,voxelZ,dir[0],dir[1],dir[2])] = 1;//set a face @ pos and dir
                var faceIndexPosition = this.computeFaceIndexPosition(voxelX,voxelY,voxelZ);
                if(faceIndexGroup[faceIndexPosition].isArray() == true){
                  faceIndexGroup[faceIndexPosition].push({dir:dir,index:this.currentFace});
                }else {
                  faceIndexGroup[faceIndexPosition] = [{dir:dir,index:this.currentFace}];
                }
                this.currentFace+=1;//inside fn for face addition to idx
                }
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

const voxelWorld = new VoxelWorld({
  cellSize:64,
  tileSize:16,
  tileTextureWidth:128,
  tileTextureHeight:48,
  calculateFaces:true
});//prep voxelwordl
onmessage = function(e){
  if(e.data[0]=='voxel'){
    voxelWorld.setVoxel(e.data[1],e.data[2],e.data[3],e.data[4]);//set voxel
  }
  if(e.data[0]=='geometrydata'){
    //get geometry data @ pos
    const {positions,normals,uvs,indices,faceIndexGroup} = voxelWorld.generateGeometryDataForCell(e.data[1]/64,e.data[2]/64,e.data[3]/64);//heavy loading
    //this will cover chunk bounds
    //calculate faceindxgroup

    postMessage(['geometrydata',positions,normals,uvs,indices,e.data[4],e.data[5]]);//e.data[2] if pos
  }
}
