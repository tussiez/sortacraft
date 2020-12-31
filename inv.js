      var cool = document.getElementById('inventory');
      var inventory = []; //this is  two dimensional array ( inventory[y][x])
      function addSlots(){
        cool.innerHTML+="<br><br><br><br>"
        for(var y = 0;y<4;y++){
          inventory[y] = [];//set
          for(var x = 0;x<9;x++){
            inventory[y][x]=0;//nothing in this slot
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
      

     
function allowDrop(ev) {
  ev.preventDefault();
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
  }else{
    console.log('cant place')
  }
}
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
  
]//WOW !!! THATS A LOTTA DAMAGE
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
  }
  image.setAttribute('title',itemName);
    image.setAttribute('class','item');
  image.setAttribute('draggable','true');
  image.setAttribute('ondragstart','drag(event)');
  
  image.setAttribute('id',itemName+'&'+x+'&'+y);
  
  mainDiv.setAttribute('ondragover','allowDrop(event)');

  mainDiv.appendChild(image);
  //Add to inv
  var ele = document.getElementById('box'+(x+','+y))
 ele.appendChild(mainDiv);//issue
  
}
addToInv(2,'Stone Sword',1,2);//item test
addToInv(3,'Grass Block',2,1);//block test
addToInv(4,'Stone',0,1);
addToInv(5,'Workbench',2,3);