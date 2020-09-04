const voxelWorld = new VoxelWorld({
  cellSize:64,
  tileSize:16,
  tileTextureWidth:128,
  tileTextureHeight:48
})
onmessage = function(e){
  if(e.data[0]=='voxel'){
    voxelWorld.setVoxel(e.data[1],e.data[2],e.data[3],e.data[4]);//set voxel
  }
  if(e.data[0]=='geometrydata'){
    //get geometry data @ pos
    const {positions,normals,uvs,indices} = voxelWorld.generateGeometryDataForCell(e.data[1],e.data[2],e.data[3]);//heavy loading
    //this will cover chunk bounds
    postMessage(['geometrydata',positions,normals,uvs,indices]);
  }
}





class VoxelWorld{constructor(e){this.cellSize=e.cellSize,this.tileSize=e.tileSize,this.tileTextureWidth=e.tileTextureWidth,this.tileTextureHeight=e.tileTextureHeight;const{cellSize:o}=this;this.cellSliceSize=o*o,this.cells={}}computeCellId(e,o,t){const{cellSize:s}=this;return`${Math.floor(e/s)},${Math.floor(o/s)},${Math.floor(t/s)}`}computeVoxelOffset(e,o,t){const{cellSize:s,cellSliceSize:l}=this,i=0|THREE.MathUtils.euclideanModulo(e,s);return(0|THREE.MathUtils.euclideanModulo(o,s))*l+(0|THREE.MathUtils.euclideanModulo(t,s))*s+i}getCellForVoxel(e,o,t){return this.cells[this.computeCellId(e,o,t)]}setVoxel(e,o,t,s){let l=this.getCellForVoxel(e,o,t);l||(l=this.addCellForVoxel(e,o,t)),l[this.computeVoxelOffset(e,o,t)]=s}addCellForVoxel(e,o,t){const s=this.computeCellId(e,o,t);let l=this.cells[s];if(!l){const{cellSize:e}=this;l=new Uint8Array(e*e*e),this.cells[s]=l}return l}getVoxel(e,o,t){const s=this.getCellForVoxel(e,o,t);return s?s[this.computeVoxelOffset(e,o,t)]:0}generateGeometryDataForCell(e,o,t,s,l,i){const{cellSize:r,tileSize:u,tileTextureWidth:c,tileTextureHeight:h}=this,n=[],p=[],v=[],a=[],x=e*r,d=o*r,f=t*r;for(let e=0;e<r;++e){const o=d+e;for(let t=0;t<r;++t){const s=f+t;for(let l=0;l<r;++l){const i=x+l,r=this.getVoxel(i,o,s);if(r){const x=r-1;for(const{dir:d,corners:f,uvRow:z}of VoxelWorld.faces){const M=this.getVoxel(i+d[0],o+d[1],s+d[2]);if(!M||7===M&&5===r||4===M&&4!=r){const o=n.length/3;for(const{pos:o,uv:s}of f)n.push(o[0]+l,o[1]+e,o[2]+t),p.push(...d),v.push((x+s[0])*u/c,1-(z+1-s[1])*u/h);a.push(o,o+1,o+2,o+2,o+1,o+3)}}}}}}return{positions:n,normals:p,uvs:v,indices:a}}intersectRay(e,o){let t=o.x-e.x,s=o.y-e.y,l=o.z-e.z;const i=t*t+s*s+l*l,r=Math.sqrt(i);t/=r,s/=r,l/=r;let u=0,c=Math.floor(e.x),h=Math.floor(e.y),n=Math.floor(e.z);const p=t>0?1:-1,v=s>0?1:-1,a=l>0?1:-1,x=Math.abs(1/t),d=Math.abs(1/s),f=Math.abs(1/l),z=p>0?c+1-e.x:e.x-c,M=v>0?h+1-e.y:e.y-h,V=a>0?n+1-e.z:e.z-n;let S=x<1/0?x*z:1/0,g=d<1/0?d*M:1/0,R=f<1/0?f*V:1/0,m=-1;for(;u<=r;){const o=this.getVoxel(c,h,n);if(o)return{position:[e.x+u*t,e.y+u*s,e.z+u*l],normal:[0===m?-p:0,1===m?-v:0,2===m?-a:0],voxel:o};S<g?S<R?(c+=p,u=S,S+=x,m=0):(n+=a,u=R,R+=f,m=2):g<R?(h+=v,u=g,g+=d,m=1):(n+=a,u=R,R+=f,m=2)}return null}}VoxelWorld.faces=[{uvRow:0,dir:[-1,0,0],corners:[{pos:[0,1,0],uv:[0,1]},{pos:[0,0,0],uv:[0,0]},{pos:[0,1,1],uv:[1,1]},{pos:[0,0,1],uv:[1,0]}]},{uvRow:0,dir:[1,0,0],corners:[{pos:[1,1,1],uv:[0,1]},{pos:[1,0,1],uv:[0,0]},{pos:[1,1,0],uv:[1,1]},{pos:[1,0,0],uv:[1,0]}]},{uvRow:1,dir:[0,-1,0],corners:[{pos:[1,0,1],uv:[1,0]},{pos:[0,0,1],uv:[0,0]},{pos:[1,0,0],uv:[1,1]},{pos:[0,0,0],uv:[0,1]}]},{uvRow:2,dir:[0,1,0],corners:[{pos:[0,1,1],uv:[1,1]},{pos:[1,1,1],uv:[0,1]},{pos:[0,1,0],uv:[1,0]},{pos:[1,1,0],uv:[0,0]}]},{uvRow:0,dir:[0,0,-1],corners:[{pos:[1,0,0],uv:[0,0]},{pos:[0,0,0],uv:[1,0]},{pos:[1,1,0],uv:[0,1]},{pos:[0,1,0],uv:[1,1]}]},{uvRow:0,dir:[0,0,1],corners:[{pos:[0,0,1],uv:[0,0]},{pos:[1,0,1],uv:[1,0]},{pos:[0,1,1],uv:[0,1]},{pos:[1,1,1],uv:[1,1]}]}];
