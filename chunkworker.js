//Chunk Generator

//random numbers
const rand = {
  random:function(a){
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  },
  randomset:function(max, min,seed) {//generate rand from seed & range
    max = max || 1;
    min = min || 0;

    seed = (seed * 9301 + 49297) % 233280;
    var rnd = seed / 233280;

    return min + rnd * (max - min);
  },
}

//importScripts('https://threejs.org/build/three.min.js'); waste of time

THREE = {
  MathUtils: {
    euclideanModulo:function(c,a){return(c%a+a)%a}
  }
}//euclidean modulo support

self.onmessage = function(e){//onmessage

  if(e.data[0]==='create'){//create chunk

    var heightMult = e.data[9];

    var cellSize = e.data[1];//cellsize

    var tileSize = e.data[2];//tilesize

    var flatness = e.data[11];
    if(flatness===undefined){//backwards compatibility with old version
      flatness = 16;
      console.warn('Defaulted to 16 for flatness')
    }

    var tileTextureWidth = e.data[3];//tile t w

    var tileTextureHeight = e.data[4];//tile t h

    var seed = e.data[5]; // seed

    var x1 = e.data[6];
    var y1 = e.data[7];
    var z1 = e.data[8];
    var biome = e.data[10];
    var perlin = new Perlin(seed);//for seed

    var localWorld = new VoxelWorld({

      cellSize:64,

      tileSize,

      tileTextureWidth,

      tileTextureHeight

    });
    //local voxelworld

    //first loop, carve out stone/grass?
    function mineHeight(x,z,y){
      var x2a = x+x1;
      var z2a = z+z1;
      y = y || 0;
      var ele = perlin.noise(x2a/64,z2a/64,y);//stripe artifact
      var rough = perlin.noise(x2a/32,z2a/32,y);
      var det = perlin.noise(x2a*16,z2a*16,y);
      return Math.round(((ele + (rough*det)*4)*cellSize)+12);
    }
    function ampedMineHeight(x,z,y){
      return mineHeight(x,z,y)
    }


    var progress = 0;
    var caveSize = .35;
  //  var oreSize = .22;
  //  var oreBias = .01;
    var caveBias = .10;

    var oreChances = [
      {
        type:'redstone',
        oreChance:.87,
        randomness:2.5,
        maxHeight:20,
        uv:11,
      },
      {
        type:'emerald',
        oreChance:.89,
        randomness:2.1,
        maxHeight:12,
        uv:13
      },
      {
        type:'silver',
        oreChance:.86,
        randomness:3,
        maxHeight:32,
        uv:29
      },
      {
        type:'lapis',
        oreChance:.89,
        randomness:3.2,
        maxHeight:25,
        uv:12
      },
      {
        type:'diamond',
        oreChance:.90,
        randomness:2.9,
        maxHeight:12,
        uv:10
      },
      {
        type:'copper',
        oreChance:.84,
        randomness:3.5,
        maxHeight:26,
        uv:28
      },
      {
        type:'coal',
        oreChance:.83,
        randomness:4,
        maxHeight:64,
        uv:44
      }


    ]

    var total = (cellSize*cellSize*64)*2;//dupe
    var levels = {};
    var caveBlks = {};
    var biomeLevel = {};

  const setV2 = function(x,y,z){setV(x,y,z,7)};//leaves fn

  for(var x = 0;x<cellSize;x++){
    for(var z = 0;z<cellSize;z++){
      for(var y = 0;y<64;y++){

        //test
        var type = 1;

        var attenuatedCaveSize = caveSize - ((y/170)-caveBias);
        if(y==0){
          var biomeNoise = perlin.noise((x+x1)/100,(z+z1)/100,0);
          biomeLevel[x+","+z]= biomeNoise;
        }else{
          var biomeNoise = biomeLevel[x+","+z]
        }
          var currentBiome = getCurrentBiome(biomeNoise);

        var density = perlin.noise((x+x1)/12,(z+z1)/12,(y+y1)/12);
        //var oreNoise = perlin.noise((x+x1)/6,(z+z1)/6,(y+y1)/6);
        var hm = mineHeight(x,z);
        levels[x+","+z]=hm;
        if(y<hm){

        if(density>attenuatedCaveSize){

          localWorld.setVoxel(x,y,z,type);
          postMessage(['voxel',x,y,z,type]);
            caveBlks[x+","+y+","+z]=1;

        }else{

          //ORES
          for(var i = 0;i<oreChances.length;i++){
            var maxHeight = oreChances[i].maxHeight;
            if(y<=maxHeight){
            var oreChance = oreChances[i].oreChance;
            var randomness = oreChances[i].randomness;
            var oreType = oreChances[i].uv;
            var oreNoise = perlin.noise((x+x1)/randomness,(z+z1)/randomness,(y+y1)/randomness);
            if(oreNoise > oreChance){
              setV(x,y,z,oreType);
            }
          }
          }

          caveBlks[x+","+y+","+z]=0;
        }
        /*
        if(oreNoise<attenuatedOreCount){
          localWorld.setVoxel(x,y,z,11);
          postMessage(['voxel',x,y,z,11]);
        }
        */
      }else{
          caveBlks[x+","+y+","+z]=0;
          //y > hm
      }

      if(y==0){
        localWorld.setVoxel(x,y,z,16);
        postMessage(['voxel',x,y,z,16])
      }
      if(y==1){
        localWorld.setVoxel(x,y,z,type);
        postMessage(['voxel',x,y,z,type])
      }
    }
  }
}

            for(var z = 0; z< cellSize; z++){

              for(var x = 0; x< cellSize; x++){
                var hm = levels[x+","+z];
                var biomeNoise = biomeLevel[x+","+z];


                var type = getCurrentBiome(biomeNoise)
                if(localWorld.getVoxel(x,hm,z)==0&&caveBlks[x+","+(hm-1)+","+z]==1){
                localWorld.setVoxel(x,hm,z,type);
                postMessage(['voxel',x,hm,z,type]);
                var noisytree = (perlin.noise(((x+x1)*20.1),(z+z1)*20.1,0)*10)-5;
                var above = localWorld.getVoxel(x,hm+1,z);
                var below = localWorld.getVoxel(x,hm-1,z)
                if(noisytree>3){

                  var treeType = getTreeType(noisytree);
                  if(type!=3){
                  setV(x,y,z,5);
                  let tr = 6;
                  for(var i = 0;i<tr;i++){
                    setV(x,hm+i,z,treeType);
                  }
                  tr+=hm;//adj
                  //TOP
                  setV2(x,tr,z);
                  setV2(x,tr+1,z);
                  //FRONT
                  setV2(x-1,tr-2,z);//set leaves
                  setV2(x-1,tr-1,z);
                  setV2(x-1,tr,z);
                  //FRONT
                  setV2(x-2,tr-2,z);
                  setV2(x-2,tr-1,z);
                  //setV(x-2,tr,z); trim?
                  //BACK
                  setV2(x+1,tr-2,z);
                  setV2(x+1,tr-1,z);
                  setV2(x+1,tr,z);
                  //BACK
                  setV2(x+2,tr-2,z);
                  setV2(x+2,tr-1,z);
                 // setV(x+2,tr,z);trim???
                  //LEFT
                  setV2(x,tr-2,z-1);
                  setV2(x,tr-1,z-1);
                  setV2(x,tr,z-1);
                  //LEFT
                  setV2(x,tr-2,z-2);
                  setV2(x,tr-1,z-2);
                  //RIGHT
                  setV2(x,tr-2,z+1);
                  setV2(x,tr-1,z+1);
                  setV2(x,tr,z+1);
                  //RIGHT
                  setV2(x,tr-2,z+2);
                  setV2(x,tr-1,z+2);
                  //setV(x,tr,z+2); trim?
                  //FILL(L+R)
                  setV2(x-1,tr-2,z+1);
                  setV2(x+1,tr-2,z+1);
                  setV2(x-1,tr-1,z+1);
                  setV2(x+1,tr-1,z+1);
                  setV2(x-1,tr,z+1);
                  setV2(x+1,tr,z+1);
                  //FILL (F&B)
                  setV2(x-1,tr-2,z-1);
                  setV2(x+1,tr-2,z-1);
                  setV2(x-1,tr-1,z-1);
                  setV2(x+1,tr-1,z-1);
                  setV2(x-1,tr,z-1);
                  setV2(x+1,tr,z-1);
                  //FILL CORNERS (1)
                  setV2(x-2,tr-2,z+2);
                  setV2(x-2,tr-2,z-2);
                  setV2(x-1,tr-2,z+2);
                  setV2(x-1,tr-2,z-2);
                  setV2(x-2,tr-2,z+1);
                  setV2(x-2,tr-2,z-1);
                  //FILL CORNERS (2)
                  setV2(x+2,tr-2,z+2);//one side
                  setV2(x+2,tr-2,z-2);//other
                  setV2(x+1,tr-2,z+2);//one
                  setV2(x+1,tr-2,z-2);//other
                  setV2(x+2,tr-2,z+1);//one
                  setV2(x+2,tr-2,z-1);//other
                }
              }
            }



              }

            }
            function getTreeType(t){
              if(t > 3 && t < 3.5){
                return 5;
              }
              if(t >= 3.5 && t <3.6){
                return 43;
              }
              if(t >= 3.6 && t < 3.7){
                return 42;
              }
              if(t >= 3.7 && t <3.8){
                return 41;
              }
              if(t >= 3.8){
                return 40;
              }
            }
            function getCurrentBiome(g){
              if(g > .4 && g < .6){
                return 2;//GRass
              }
              if(g >= .6 && g <= .8){
                return 3;//sand
              }
              if(g <= .4){//snow
                return 33;
              }
            }

        /*
        var below = localWorld.getVoxel(x,y-1,z);
        var type = localWorld.getVoxel(x,y,z);
        var hm = levels[x+","+z]
        var changed = false;
        if(y<hm&&type!=2){
          setV(x,y,z,1);
        }
        var above = localWorld.getVoxel(x,y+1,z);
        if(above==2){
          setV(x,y,z,6);
          setV(x,y-1,z,6)
          setV(x,y-2,z,6);
          setV(x,y-3,z,6);
        }
        */





      }




function setV(x,y,z,type){
  localWorld.setVoxel(x,y,z,type);
  postMessage(['voxel',x,y,z,type]);
}

    //geometry
    var {positions,normals,uvs,indices}= localWorld.generateGeometryDataForCell(0,0,0);
    postMessage(['complete',positions,normals,uvs,indices]);//done



}


//heightmap read??

//code is minifed to improve performance
//voxelworld code
class VoxelWorld{constructor(e){this.cellSize=e.cellSize,this.tileSize=e.tileSize,this.tileTextureWidth=e.tileTextureWidth,this.tileTextureHeight=e.tileTextureHeight;const{cellSize:o}=this;this.cellSliceSize=o*o,this.cells={}}computeCellId(e,o,t){const{cellSize:s}=this;return`${Math.floor(e/s)},${Math.floor(o/s)},${Math.floor(t/s)}`}computeVoxelOffset(e,o,t){const{cellSize:s,cellSliceSize:l}=this,i=0|THREE.MathUtils.euclideanModulo(e,s);return(0|THREE.MathUtils.euclideanModulo(o,s))*l+(0|THREE.MathUtils.euclideanModulo(t,s))*s+i}getCellForVoxel(e,o,t){return this.cells[this.computeCellId(e,o,t)]}setVoxel(e,o,t,s){let l=this.getCellForVoxel(e,o,t);l||(l=this.addCellForVoxel(e,o,t)),l[this.computeVoxelOffset(e,o,t)]=s}addCellForVoxel(e,o,t){const s=this.computeCellId(e,o,t);let l=this.cells[s];if(!l){const{cellSize:e}=this;l=new Uint8Array(e*e*e),this.cells[s]=l}return l}getVoxel(e,o,t){const s=this.getCellForVoxel(e,o,t);return s?s[this.computeVoxelOffset(e,o,t)]:0}generateGeometryDataForCell(e,o,t,s,l,i){const{cellSize:r,tileSize:u,tileTextureWidth:c,tileTextureHeight:h}=this,n=[],p=[],v=[],a=[],x=e*r,d=o*r,f=t*r;for(let e=0;e<r;++e){const o=d+e;for(let t=0;t<r;++t){const s=f+t;for(let l=0;l<r;++l){const i=x+l,r=this.getVoxel(i,o,s);if(r){const x=r-1;for(const{dir:d,corners:f,uvRow:z}of VoxelWorld.faces){const M=this.getVoxel(i+d[0],o+d[1],s+d[2]);if(!M||7===M&&5===r||4===M&&4!=r){const o=n.length/3;for(const{pos:o,uv:s}of f)n.push(o[0]+l,o[1]+e,o[2]+t),p.push(...d),v.push((x+s[0])*u/c,1-(z+1-s[1])*u/h);a.push(o,o+1,o+2,o+2,o+1,o+3)}}}}}}return{positions:n,normals:p,uvs:v,indices:a}}intersectRay(e,o){let t=o.x-e.x,s=o.y-e.y,l=o.z-e.z;const i=t*t+s*s+l*l,r=Math.sqrt(i);t/=r,s/=r,l/=r;let u=0,c=Math.floor(e.x),h=Math.floor(e.y),n=Math.floor(e.z);const p=t>0?1:-1,v=s>0?1:-1,a=l>0?1:-1,x=Math.abs(1/t),d=Math.abs(1/s),f=Math.abs(1/l),z=p>0?c+1-e.x:e.x-c,M=v>0?h+1-e.y:e.y-h,V=a>0?n+1-e.z:e.z-n;let S=x<1/0?x*z:1/0,g=d<1/0?d*M:1/0,R=f<1/0?f*V:1/0,m=-1;for(;u<=r;){const o=this.getVoxel(c,h,n);if(o)return{position:[e.x+u*t,e.y+u*s,e.z+u*l],normal:[0===m?-p:0,1===m?-v:0,2===m?-a:0],voxel:o};S<g?S<R?(c+=p,u=S,S+=x,m=0):(n+=a,u=R,R+=f,m=2):g<R?(h+=v,u=g,g+=d,m=1):(n+=a,u=R,R+=f,m=2)}return null}}VoxelWorld.faces=[{uvRow:0,dir:[-1,0,0],corners:[{pos:[0,1,0],uv:[0,1]},{pos:[0,0,0],uv:[0,0]},{pos:[0,1,1],uv:[1,1]},{pos:[0,0,1],uv:[1,0]}]},{uvRow:0,dir:[1,0,0],corners:[{pos:[1,1,1],uv:[0,1]},{pos:[1,0,1],uv:[0,0]},{pos:[1,1,0],uv:[1,1]},{pos:[1,0,0],uv:[1,0]}]},{uvRow:1,dir:[0,-1,0],corners:[{pos:[1,0,1],uv:[1,0]},{pos:[0,0,1],uv:[0,0]},{pos:[1,0,0],uv:[1,1]},{pos:[0,0,0],uv:[0,1]}]},{uvRow:2,dir:[0,1,0],corners:[{pos:[0,1,1],uv:[1,1]},{pos:[1,1,1],uv:[0,1]},{pos:[0,1,0],uv:[1,0]},{pos:[1,1,0],uv:[0,0]}]},{uvRow:0,dir:[0,0,-1],corners:[{pos:[1,0,0],uv:[0,0]},{pos:[0,0,0],uv:[1,0]},{pos:[1,1,0],uv:[0,1]},{pos:[0,1,0],uv:[1,1]}]},{uvRow:0,dir:[0,0,1],corners:[{pos:[0,0,1],uv:[0,0]},{pos:[1,0,1],uv:[1,0]},{pos:[0,1,1],uv:[0,1]},{pos:[1,1,1],uv:[1,1]}]}];

//perlin noise (less stripe artifact?)
function Perlin(t){var r=function(t){null==t&&(t=Math),this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.p=[];for(var r=0;r<256;r++)this.p[r]=Math.floor(256*t.random());this.perm=[];for(r=0;r<512;r++)this.perm[r]=this.p[255&r];this.simplex=[[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]]};r.prototype.dot=function(t,r,i){return t[0]*r+t[1]*i},r.prototype.noise=function(t,r){var i,h,s=(t+r)*(.5*(Math.sqrt(3)-1)),e=Math.floor(t+s),o=Math.floor(r+s),n=(3-Math.sqrt(3))/6,p=(e+o)*n,a=t-(e-p),m=r-(o-p);a>m?(i=1,h=0):(i=0,h=1);var d=a-i+n,f=m-h+n,u=a-1+2*n,l=m-1+2*n,c=255&e,g=255&o,v=this.perm[c+this.perm[g]]%12,M=this.perm[c+i+this.perm[g+h]]%12,x=this.perm[c+1+this.perm[g+1]]%12,y=.5-a*a-m*m,w=.5-d*d-f*f,A=.5-u*u-l*l;return 70*((y<0?0:(y*=y)*y*this.dot(this.grad3[v],a,m))+(w<0?0:(w*=w)*w*this.dot(this.grad3[M],d,f))+(A<0?0:(A*=A)*A*this.dot(this.grad3[x],u,l)))},r.prototype.noise3d=function(t,r,i){var h,s,e,o,n,p,a=(t+r+i)*(1/3),m=Math.floor(t+a),d=Math.floor(r+a),f=Math.floor(i+a),u=1/6,l=(m+d+f)*u,c=t-(m-l),g=r-(d-l),v=i-(f-l);c>=g?g>=v?(h=1,s=0,e=0,o=1,n=1,p=0):c>=v?(h=1,s=0,e=0,o=1,n=0,p=1):(h=0,s=0,e=1,o=1,n=0,p=1):g<v?(h=0,s=0,e=1,o=0,n=1,p=1):c<v?(h=0,s=1,e=0,o=0,n=1,p=1):(h=0,s=1,e=0,o=1,n=1,p=0);var M=c-h+u,x=g-s+u,y=v-e+u,w=c-o+2*u,A=g-n+2*u,q=v-p+2*u,C=c-1+.5,D=g-1+.5,P=v-1+.5,S=255&m,b=255&d,j=255&f,k=this.perm[S+this.perm[b+this.perm[j]]]%12,z=this.perm[S+h+this.perm[b+s+this.perm[j+e]]]%12,B=this.perm[S+o+this.perm[b+n+this.perm[j+p]]]%12,E=this.perm[S+1+this.perm[b+1+this.perm[j+1]]]%12,F=.6-c*c-g*g-v*v,G=.6-M*M-x*x-y*y,H=.6-w*w-A*A-q*q,I=.6-C*C-D*D-P*P;return 32*((F<0?0:(F*=F)*F*this.dot(this.grad3[k],c,g,v))+(G<0?0:(G*=G)*G*this.dot(this.grad3[z],M,x,y))+(H<0?0:(H*=H)*H*this.dot(this.grad3[B],w,A,q))+(I<0?0:(I*=I)*I*this.dot(this.grad3[E],C,D,P)))};var i=function(t){null==t&&(t=Math),this.grad3=[[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]],this.p=[];for(var r=0;r<256;r++)this.p[r]=Math.floor(256*t.random());this.perm=[];for(r=0;r<512;r++)this.perm[r]=this.p[255&r]};i.prototype.dot=function(t,r,i,h){return t[0]*r+t[1]*i+t[2]*h},i.prototype.mix=function(t,r,i){return(1-i)*t+i*r},i.prototype.fade=function(t){return t*t*t*(t*(6*t-15)+10)},i.prototype.noise=function(t,r,i){var h=Math.floor(t),s=Math.floor(r),e=Math.floor(i);t-=h,r-=s,i-=e,h&=255,s&=255,e&=255;var o=this.perm[h+this.perm[s+this.perm[e]]]%12,n=this.perm[h+this.perm[s+this.perm[e+1]]]%12,p=this.perm[h+this.perm[s+1+this.perm[e]]]%12,a=this.perm[h+this.perm[s+1+this.perm[e+1]]]%12,m=this.perm[h+1+this.perm[s+this.perm[e]]]%12,d=this.perm[h+1+this.perm[s+this.perm[e+1]]]%12,f=this.perm[h+1+this.perm[s+1+this.perm[e]]]%12,u=this.perm[h+1+this.perm[s+1+this.perm[e+1]]]%12,l=this.dot(this.grad3[o],t,r,i),c=this.dot(this.grad3[m],t-1,r,i),g=this.dot(this.grad3[p],t,r-1,i),v=this.dot(this.grad3[f],t-1,r-1,i),M=this.dot(this.grad3[n],t,r,i-1),x=this.dot(this.grad3[d],t-1,r,i-1),y=this.dot(this.grad3[a],t,r-1,i-1),w=this.dot(this.grad3[u],t-1,r-1,i-1),A=this.fade(t),q=this.fade(r),C=this.fade(i),D=this.mix(l,c,A),P=this.mix(M,x,A),S=this.mix(g,v,A),b=this.mix(y,w,A),j=this.mix(D,S,q),k=this.mix(P,b,q);return this.mix(j,k,C)};var h={};h.random=new function(){return function(t){var r=0,i=0,h=0,s=1;0==t.length&&(t=[+new Date]);var e=function(){var t=4022871197,r=function(r){r=r.toString();for(var i=0;i<r.length;i++){var h=.02519603282416938*(t+=r.charCodeAt(i));h-=t=h>>>0,t=(h*=t)>>>0,t+=4294967296*(h-=t)}return 2.3283064365386963e-10*(t>>>0)};return r.version="Mash 0.9",r}();r=e(" "),i=e(" "),h=e(" ");for(var o=0;o<t.length;o++)(r-=e(t[o]))<0&&(r+=1),(i-=e(t[o]))<0&&(i+=1),(h-=e(t[o]))<0&&(h+=1);e=null;var n=function(){var t=2091639*r+2.3283064365386963e-10*s;return r=i,i=h,h=t-(s=0|t)};return n.uint32=function(){return 4294967296*n()},n.fract53=function(){return n()+1.1102230246251565e-16*(2097152*n()|0)},n.version="Alea 0.9",n.args=t,n}(Array.prototype.slice.call(arguments))}(t);var s=new i(h);this.noise=function(t,r,i){return.5*s.noise(t,r,i)+.5}}
