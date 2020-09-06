THREE = {
  MathUtils: {
    euclideanModulo:function(c,a){return(c%a+a)%a}
  }
}//euclidean modulo support

class VoxelWorld{constructor(e){this.cellSize=e.cellSize,this.tileSize=e.tileSize,this.tileTextureWidth=e.tileTextureWidth,this.tileTextureHeight=e.tileTextureHeight;const{cellSize:t}=this;this.cellSliceSize=t*t,this.cells={},this.faceIndex=[{}],this.calculateFaces=e.calculateFaces,this.currentFace=0}computeCellId(e,t,o){const{cellSize:s}=this;return`${Math.floor(e/s)},${Math.floor(t/s)},${Math.floor(o/s)}`}computeVoxelOffset(e,t,o){const{cellSize:s,cellSliceSize:l}=this,i=0|THREE.MathUtils.euclideanModulo(e,s);return(0|THREE.MathUtils.euclideanModulo(t,s))*l+(0|THREE.MathUtils.euclideanModulo(o,s))*s+i}getCellForVoxel(e,t,o){return this.cells[this.computeCellId(e,t,o)]}setVoxel(e,t,o,s){let l=this.getCellForVoxel(e,t,o);l||(l=this.addCellForVoxel(e,t,o)),l[this.computeVoxelOffset(e,t,o)]=s}addCellForVoxel(e,t,o){const s=this.computeCellId(e,t,o);let l=this.cells[s];if(!l){const{cellSize:e}=this;l=new Uint8Array(e*e*e),this.faceIndex.push({}),this.cells[s]=l}return l}getVoxel(e,t,o){const s=this.getCellForVoxel(e,t,o);return s?s[this.computeVoxelOffset(e,t,o)]:0}getTransparentVoxel(e,t,o){const s=this.getVoxel(e,t,o);return 4===s||7===s}getFaceIndexFromCell(e,t,o){return this.cells.indexOf(this.getCellForVoxel(e,t,o))}computeFaceIndexPosition(e,t,o){return e+","+t+","+o}generateGeometryDataForCell(e,t,o,s,l,i){const{cellSize:r,tileSize:c,tileTextureWidth:u,tileTextureHeight:n}=this,h=[],a=[],p=[],x=[],d=e*r,v=t*r,f=o*r,F=1==this.calculateFaces?this.getFaceIndexFromCell(e,t,o):void 0;this.currentFace=0;for(let e=0;e<r;++e){const t=v+e;for(let o=0;o<r;++o){const s=f+o;for(let l=0;l<r;++l){const i=d+l,r=this.getVoxel(i,t,s);if(r){const d=r-1;for(const{dir:v,corners:f,uvRow:g}of VoxelWorld.faces){const z=this.getVoxel(i+v[0],t+v[1],s+v[2]);function V(){const r=h.length/3;for(const{pos:t,uv:s}of f)h.push(t[0]+l,t[1]+e,t[2]+o),a.push(...v),p.push((d+s[0])*c/u,1-(g+1-s[1])*c/n);if(x.push(r,r+1,r+2,r+2,r+1,r+3),1==this.calculateFaces){var V=this.computeFaceIndexPosition(i,t,s);1==F[V].isArray()?F[V].push({dir:v,index:this.currentFace}):F[V]=[{dir:v,index:this.currentFace}],this.currentFace+=1}}!0===this.getTransparentVoxel(i,t,s)?z!=r&&V():z&&!0!==this.getTransparentVoxel(i+v[0],t+v[1],s+v[2])||V()}}}}}return{positions:h,normals:a,uvs:p,indices:x,faceIndexGroup:F}}intersectRay(e,t){let o=t.x-e.x,s=t.y-e.y,l=t.z-e.z;const i=o*o+s*s+l*l,r=Math.sqrt(i);o/=r,s/=r,l/=r;let c=0,u=Math.floor(e.x),n=Math.floor(e.y),h=Math.floor(e.z);const a=o>0?1:-1,p=s>0?1:-1,x=l>0?1:-1,d=Math.abs(1/o),v=Math.abs(1/s),f=Math.abs(1/l),F=a>0?u+1-e.x:e.x-u,V=p>0?n+1-e.y:e.y-n,g=x>0?h+1-e.z:e.z-h;let z=d<1/0?d*F:1/0,M=v<1/0?v*V:1/0,S=f<1/0?f*g:1/0,m=-1;for(;c<=r;){const t=this.getVoxel(u,n,h);if(t)return{position:[e.x+c*o,e.y+c*s,e.z+c*l],normal:[0===m?-a:0,1===m?-p:0,2===m?-x:0],voxel:t};z<M?z<S?(u+=a,c=z,z+=d,m=0):(h+=x,c=S,S+=f,m=2):M<S?(n+=p,c=M,M+=v,m=1):(h+=x,c=S,S+=f,m=2)}return null}}VoxelWorld.faces=[{uvRow:0,dir:[-1,0,0],corners:[{pos:[0,1,0],uv:[0,1]},{pos:[0,0,0],uv:[0,0]},{pos:[0,1,1],uv:[1,1]},{pos:[0,0,1],uv:[1,0]}]},{uvRow:0,dir:[1,0,0],corners:[{pos:[1,1,1],uv:[0,1]},{pos:[1,0,1],uv:[0,0]},{pos:[1,1,0],uv:[1,1]},{pos:[1,0,0],uv:[1,0]}]},{uvRow:1,dir:[0,-1,0],corners:[{pos:[1,0,1],uv:[1,0]},{pos:[0,0,1],uv:[0,0]},{pos:[1,0,0],uv:[1,1]},{pos:[0,0,0],uv:[0,1]}]},{uvRow:2,dir:[0,1,0],corners:[{pos:[0,1,1],uv:[1,1]},{pos:[1,1,1],uv:[0,1]},{pos:[0,1,0],uv:[1,0]},{pos:[1,1,0],uv:[0,0]}]},{uvRow:0,dir:[0,0,-1],corners:[{pos:[1,0,0],uv:[0,0]},{pos:[0,0,0],uv:[1,0]},{pos:[1,1,0],uv:[0,1]},{pos:[0,1,0],uv:[1,1]}]},{uvRow:0,dir:[0,0,1],corners:[{pos:[0,0,1],uv:[0,0]},{pos:[1,0,1],uv:[1,0]},{pos:[0,1,1],uv:[0,1]},{pos:[1,1,1],uv:[1,1]}]}];
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
