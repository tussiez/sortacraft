/*
      var cool = document.getElementById('inventory');
      var inventory = [];
      var invObject = [];
      var hotbar = []; //this is  two dimensional array ( inventory[y][x])
      function addSlots(){
        cool.innerHTML+="<br><br><br><br><Br><br>"//this is a filler
        for(var y = 0;y<4;y++){
          inventory[y] = [];//set
          invObject[y] = [];
          for(var x = 0;x<9;x++){
            inventory[y][x]=0;//test
            invObject[y][x] = undefined;//Empty slot
            var boxElement = document.createElement('div');
            boxElement.setAttribute('class','box');
            boxElement.setAttribute('onmouseover','this.style.backgroundColor ="#89e647"');
            boxElement.setAttribute('onmouseout','this.style.backgroundColor="#dcdce3"');
            boxElement.setAttribute('ondragover','allowDrop(event)');
            boxElement.setAttribute('ondrop','drop(event,this)');
            var id = y+','+x;
            boxElement.setAttribute('id','box'+id)
            cool.appendChild(boxElement);
            inventory[y][x]=id;
          }
          if(y==2){
            cool.innerHTML+='<hr>'
          }else{
          cool.innerHTML+='<br>'
          }
        }
      }
      //add slots
      addSlots();
      
function generateHotbar(){
  var hotbarz= document.getElementById('ack');
  for(var x = 0;x<9;x++){
    var box = document.createElement('div');
    box.setAttribute('class','hotbarBox');
    box.setAttribute('id','hotbarBox'+x);
    hotbarz.appendChild(box);
    hotbar[x]=box;
  }
}
generateHotbar();
setInterval(hotbarUpdate,1000);
function allowDrop(ev) {
  var nmSplit = ev.target.id.replace('box','').split(',');
  invObject[nmSplit[0],nmSplit[1]] = undefined;
  if(ev.target.id.replace('box','').split(',')[0]==3){
    //Is a hotbar box that's being moved from, update
    var x = ev.target.id.replace('box','').split(',')[1];
    var ch = hotbar[x].children;
    if(ch[0]!=undefined){
    hotbar[x].removeChild(ch[0])
    }
  }
  ev.preventDefault();
}
function hotbarUpdate(){
  for(var x = 0;x<9;x++){
    var hotbarBox = hotbar[x];
    var hotbarInv =document.getElementById('box'+ inventory[3][x]);;
    if(hotbarInv.children.length>0&&hotbarBox.children.length>0){
    var imgSrc = hotbarInv.children[0].src;
    if(imgSrc!=hotbarBox.children[0].src&&hotbarBox.children[0].src!=undefined&&imgSrc!=undefined){
    
      hotbarBox.removeChild(hotbarBox.children[0]);
    var clone = hotbarInv.children[0].cloneNode();
    clone.draggable = '';
    clone.ondragstart = '';
    clone.style.margin = '8px';
    clone.style.objectFit = 'contain'
    if(clone.dataset.block=='true'){
      clone.style.scale = '2';
      clone.style.margin = '20px'
    }
    clone.style.display ='block';
    clone.style.backgroundColor = 'transparent';
    hotbar[x].appendChild(clone);
    }
    }
    if(hotbarInv.children.length>0&&hotbarBox.children.length==0){
      var clone = hotbarInv.children[0].cloneNode();
    clone.draggable = '';
    clone.ondragstart = '';
    clone.style.margin = '8px';
    clone.style.objectFit = 'contain'
    if(clone.dataset.block=='true'){
      clone.style.scale = '2';
      clone.style.margin = '20px'
    }
    clone.style.display ='block';
    clone.style.backgroundColor = 'transparent';
    hotbar[x].appendChild(clone);
    }
    if(hotbarInv.children.length==0&&hotbarBox.children.length>0){
       hotbarBox.removeChild(hotbarBox.children[0]);
    }
  }
}


function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev,sel) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  sel.style.backgroundColor = "#dcdce3";
  
  if(sel.children.length==0){
  ev.target.appendChild(document.getElementById(data));
  var nmSplit = ev.target.id.replace('box','').split(',');
  invObject[nmSplit[0],nmSplit[1]] = document.getElementById(data);
  if(ev.target.id.replace('box','').split(',')[0]==3){
    //It is hotbar element, clone
    var x = ev.target.id.replace('box','').split(',')[1];
    var clone = document.getElementById(data).cloneNode();
    clone.draggable = '';
    clone.ondragstart = '';
    clone.style.margin = '8px';
    clone.style.objectFit = 'contain'
    if(clone.dataset.block=='true'){
      clone.style.scale = '2';
      clone.style.margin = '20px'
    }
    clone.style.display ='block';
    clone.style.backgroundColor = 'transparent';
    hotbar[x].appendChild(clone);
    
    
  }
  }else{
  //Canot place
  }
}
//BRUH
var endOfItems = 49;//that is last item, 49 = stone
function addToInv(item,itemName,x,y){
  var mainDiv = document.createElement('div');
  if(itemURL[itemNames.indexOf(itemName)]!=undefined){
  var image = document.createElement('img');
  image.setAttribute('src','items/'+itemURL[itemNames.indexOf(itemName)]);
  }else{
    var blockX = ((itemNames.indexOf(itemName)-endOfItems)*16);
    var image = document.createElement('div');
    image.setAttribute('style','height:16px;width:16px;background-image:url("textures.png");background-size:16p 16px;background-position:'+-blockX+'px 0px;transform:scale(1.5)');
    image.setAttribute('data-block','true');
    image.setAttribute('data-uv',-blockX);
  }
  image.setAttribute('title',itemName);
    image.setAttribute('class','item');
  image.setAttribute('draggable','true');
  image.setAttribute('ondragstart','drag(event)');
  
  image.setAttribute('id',itemName+'&'+x+'&'+y);
  
  mainDiv.setAttribute('ondragover','allowDrop(event)');

  mainDiv.appendChild(image);
  //Add to inv
  if(x!=undefined&&y!=undefined){
  var ele = document.getElementById('box'+(y+','+x))
  }else{
    var slot = findEmptySlot();//find an empty slot
    var x= slot.x;
    var y = slot.y;
    var ele = document.getElementById('box'+(y+','+x))
  }
  invObject[y][x] = mainDiv.cloneNode();
  
 ele.appendChild(mainDiv);//issue
  
}


function findEmptySlot(){
  for(var y = 0;y<4;y++){
   for(var x = 0;x<9;x++){
     
     var slot = invObject[y][x];
     if(slot == undefined){
       return {x:x,y:y};
     }
   }
  }
}

function getInv(x,y){//Returns item data @ inventory pos
  let obj = document.getElementById('box'+inventory[y][x]).children[0];
  if(obj != undefined){
    return {
      type:obj.children[0].dataset.block == 'true' ? 'block' : 'item',
      name:obj.children[0].title,//used on :355
      obj:obj.children[0],
    }
  
  }
}
function invContains(item){//Checks if inventory contains the item (name)
  //Excessively using for loops here *should* be fine, since it's not running in a loop, and also because it doesn't loop too many times.
  for(let y = 0;y<4;y++){
    for(let x = 0;x<9;x++){
      //y,x
      let slot = getInv(x,y);
      if(slot != undefined){
        if(slot.name==item){
        //Item name matches inv slot
        return getInv(x,y);//return the item
        }
      }
    }
  }
}
addToInv(1,'Stone Sword');//item test
addToInv(2,'Light Block');
addToInv(3,'Snowy Leaves');
addToInv(4,'Grass Block');
addToInv(5,'Oak Planks');


function equipBlock(name){//Put all the functions together
if(invContains(name)==undefined){//Doesn't already have that item
  //Woops, I forgot I need to do a full inventory check. meh
  addToInv(0,name);//First argument does nothing ATM.
  //add to inventory
}
}
//"Tree":
// gameworker.js fires block break --> newgame.js
// newgame.js passes data to --> inv.js (runs equipBlock(name))woo
*/


//Items
var itemURL= [
'bow.gif',
'cookedchicken.gif',
'copperboomerang.gif',
'copperingot.png',
'copperpickaxe.png',
'copperspear.gif',
'coppersword.gif',
'deeptrident.png',
'diamondaxe.png',
'diamondboomerang.gif',
'diamondspear.gif',
'diamondsword.gif',
'emerald.gif',
'explodedfurnace.gif',
'goldaxe.png',
'goldboomerang.gif',
'goldingot.png',
'goldspear.gif',
'goldsword.gif',
'infectionsword.gif',
'iraniumingot.png',
'ironaaxe.png',
'ironboomerang.gif',
'ironingot.png',
'ironpickaxe.png',
'ironshovel.png',
'ironsword.png',
'quiver.gif',
'rawchicken.gif',
'shield.gif',
'silverboomerang.gif',
'silverhoe.gif',
'silverpickaxe.gif',
'silvershield.gif',
'silverspear.gif',
'silversword.gif',
'steelboomerang.gif',
'steelsword.gif',
'stoneaxe.png',
'stoneboomerang.gif',
'stonepickaxe.png',
'stonespear.gif',
'stonesword.gif',
'Trident.gif',
'woodenaxe.png',
'woodenboomerang.gif',
'woodenspear.gif',
'woodensword.gif'
];
var itemNames = [
  'Bow',
  'Cooked Chicken',
  'Copper Boomerang',
  'Copper Ingot',
  'Copper Pickaxe',
  'Copper Spear',
  'Copper Sword',
  'Deep Trident',
  'Diamond Axe',
  'Diamond Boomerang',
  'Diamond Spear',
  'Diamond Sword',
  'Emerald',
  'Exploded Furnace',
  'Golden Axe',
  'Golden Boomerang',
  'Gold Ingot',
  'Golden Spear',
  'Gold Sword',
  'Infection Sword',
  'Iranium Ingot',
  'Iron Axe',
  'Iron Boomerang',
  'Iron Ingot',
  'Iron Pickaxe',
  'Iron Shovel',
  'Iron Sword',
  'Quiver',
  'Raw Chicken',
  'Shield',
  'Silver Boomerang',
  'Silver Hoe',
  'Silver Pickaxe',
  'Silver Shield',
  'Silver Spear',
  'Silver Sword',
  'Steel Boomerang',
  'Steel Sword',
  'Stone Axe',
  'Stone Boomerang',
  'Stone Pickaxe',
  'Stone Spear',
  'Stone Sword',
  'Trident',
  'Wooden Axe',
  'Wooden Boomerang',
  'Wooden Pickaxe',
  'Wooden Spear',
  'Wooden Sword',
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
];
