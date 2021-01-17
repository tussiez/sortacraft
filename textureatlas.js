let TextureAtlas = {
  init: function(){
    this.worker = new Worker('textureatlas_worker.js',{type:'module'});
    this.texture = new Image();
    this.texture.src = 'textures.png';
    this.texture.onload = function(){
    TextureAtlas.canvas = document.createElement('canvas');
    TextureAtlas.canvas.height = TextureAtlas.texture.height;
    TextureAtlas.canvas.width = TextureAtlas.texture.width;
    TextureAtlas.offscreen = TextureAtlas.canvas.transferControlToOffscreen();
    TextureAtlas.worker.postMessage({type:'getCanvas',canvas:TextureAtlas.offscreen},[TextureAtlas.offscreen]);
    }
    this.worker.onmessage = function(e){
      if(e.data[0]=='ready'){
        TextureAtlas.worker.postMessage({type:'init'})
      }
      if(e.data[0]=='progress'){
        document.getElementById('atlas').style.width = e.data[1]+'%'
      }
      if(e.data[0]=='done'){
        TextureAtlas.textures = e.data[1];
        TextureAtlas.done();
        TextureAtlas.worker.terminate();
        document.getElementById('atlas_bg').style.display = 'none';
      }
    }

  }
}
export default TextureAtlas;