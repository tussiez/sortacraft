import SortaCanvas from 'https://sortacanvas.sortagames.repl.co/lib.js'
let Inventory = {
  init: function (tex) {
    this.canvas = document.getElementById('canvas');
    SortaCanvas.init(this.canvas, false);
    SortaCanvas.setBackground('rgba(128,128,128,1)');
    this.slots = [];
    this.slotPos = [];
    this.textures = tex;
    this.lastPos = { x: 0, y: 0 };
    this.isDragging = false;
    this.fromSlot = undefined;
    this.dropSlot = undefined;
    this.draggingItem = undefined;
    this.populateArray();
    this.calculatePositions();
    this.createBoxes();
    this.createHover();
    this.setupListeners();
   // this.addItem('Stone Sword', 0, 0);
    this.render();
  },
  createHover: function(){
    this.hoverText = new SortaCanvas.Text(0,0,'','14px Minecraft','black');
    this.hoverText.pick = false;
    this.hoverText.drawLast = true;
    SortaCanvas.add(this.hoverText);
  },
  moveHover: function(name,x,y) {
    this.hoverText.x = x;
    this.hoverText.y = y;
    this.hoverText.text = name;
  },
  setupListeners: function () {
    SortaCanvas.addEventListener('mousemovehit', function (d) {
      if (d.object.inv == true) {
        d.object.color = 'green';
      }
      if (d.object.item != undefined && d.object.item != true) {
        Inventory.canvas.style.cursor = 'pointer';
        Inventory.moveHover(d.object.item.name,d.pos.x,d.pos.y);
      } else {
        Inventory.moveHover('',0,0);
        Inventory.canvas.style.cursor = 'default'
      }
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 4; y++) {
          if (Inventory.slots[x][y] != d.object) {
            Inventory.slots[x][y].color = 'white';//Make others white (prevent more than one becoming green)
          }
        }
      }
      Inventory.mouseMove(d);//pass to drag function
    });
    SortaCanvas.addEventListener('mousemove', function (d) {
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 4; y++) {
          Inventory.slots[x][y].color = 'white';
        }
      }
      Inventory.mouseMove(d);//pass to drag function
    });
    SortaCanvas.addEventListener('mousedownhit', function (d) {
      if (d.object.item != undefined && d.object.inv == true) {
        Inventory.isDragging = true;
        for (let x = 0; x < 9; x++) {
          for (let y = 0; y < 4; y++) {
            if (Inventory.slots[x][y] == d.object) {
              Inventory.fromSlot = { x: x, y: y }
            }
          }
        }
        Inventory.draggingItem = d.object.item;
        Inventory.lastPos = d.pos;
      }
    });
    SortaCanvas.addEventListener('mouseup', this.mouseUp);
    SortaCanvas.addEventListener('mouseuphit', this.mouseUp);
  },
  mouseMove: function (d) {
    if (d.object == undefined) {
      Inventory.canvas.style.cursor = 'default';
    }
    if (Inventory.isDragging == true) {
      let found = false;
      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 4; y++) {
          if (SortaCanvas.collision(Inventory.draggingItem, Inventory.slots[x][y])) {
            Inventory.dropSlot = { x: x, y: y }
            found = true;
          }
        }
      }
      if (found == false) {
        Inventory.dropSlot = undefined;
      }
      let x = d.pos.x - Inventory.lastPos.x;
      let y = d.pos.y - Inventory.lastPos.y;
      Inventory.draggingItem.x += x;
      Inventory.draggingItem.y += y;
      Inventory.lastPos = d.pos;
      Inventory.moveHover(Inventory.draggingItem.name,d.pos.x,d.pos.y);
    }else{
      //Inventory.moveHover('',0,0)
    }
  },
  mouseUp: function (d) {
    if (Inventory.dropSlot != undefined && Inventory.isDragging == true && Inventory.slots[Inventory.dropSlot.x][Inventory.dropSlot.y].item == undefined) {
      Inventory.slots[Inventory.dropSlot.x][Inventory.dropSlot.y].item = Inventory.draggingItem;
      Inventory.slots[Inventory.fromSlot.x][Inventory.fromSlot.y].item = undefined;
      let toSlot = Inventory.slots[Inventory.dropSlot.x][Inventory.dropSlot.y];
      Inventory.draggingItem.x = toSlot.x + 2.5;
      Inventory.draggingItem.y = toSlot.y + 2.5;
    } else {
      if (Inventory.isDragging == true) {
        let fromSlot = Inventory.slots[Inventory.fromSlot.x][Inventory.fromSlot.y];
        Inventory.draggingItem.x = fromSlot.x + 2.5;
        Inventory.draggingItem.y = fromSlot.y + 2.5;
      }
    }
    Inventory.isDragging = false;
    Inventory.draggingItem = undefined;
  },
  findEmpty: function () {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 9; x++) {
        let slot = this.slots[x][y].item;
        if (slot == undefined) {
          return { x: x, y: y };
        }
      }
    }
  },
  addItem: function (name, x, y) {
    let emptySlot = this.findEmpty();
    if(emptySlot!=undefined){
    let slot = x != undefined && y != undefined ? this.slots[x][y] : this.slots[emptySlot.x][emptySlot.y];
    if (slot != undefined) {
      if (slot.item == undefined) {
        //Slot is empty
        let pos = x != undefined && y != undefined ? this.slotPos[x][y] : this.slotPos[emptySlot.x][emptySlot.y]
        let itemURL = 'items/' + this.itemURL[this.itemNames.indexOf(name)];
        
        if (itemURL != 'items/undefined') {
          let obj = new SortaCanvas.Image(pos.x + 2.5, pos.y + 2.5, 25, 25, itemURL, '');
          obj.name = name;
          obj.item = true;
          slot.item = obj;
          SortaCanvas.add(slot.item);
        } else{
          if(this.itemURL[this.itemNames.indexOf(name)] == undefined){
            if(this.itemNames.indexOf(name) != undefined){
              //Is block
              let no = this.itemNames.indexOf(name)-49;
              let obj = new SortaCanvas.Image(pos.x + 2.5,pos.y + 2.5,25,25,'','');
              obj.img = this.textures[no].side;
              obj.name = name;
              obj.item = true;
              slot.item = obj;
              SortaCanvas.add(slot.item)
            }
          }
        }
      }
    }
    }
  },
  populateArray: function () {
    for (let x = 0; x < 9; x++) {
      this.slots[x] = [];
      for (let y = 0; y < 4; y++) {
        this.slots[x][y] = '';
      }
    }
  },
  calculatePositions: function () {
    for (let x = 0; x < 9; x++) {
      this.slotPos[x] = [];
      for (let y = 0; y < 4; y++) {
        if (y < 3) {
          this.slotPos[x][y] = { x: (x * 35) + 16, y: (y * 35) + 115 };
        } else {
          this.slotPos[x][y] = { x: (x * 35) + 16, y: (y * 35) + 125 };
        }
      }
    }
  },
  createBoxes: function () {
    for (let x = 0; x < 9; x++) {
      for (let y = 0; y < 4; y++) {
        let pos = this.slotPos[x][y];
        let box = new SortaCanvas.Rectangle(pos.x, pos.y, 34, 34, 'white', '');
        box.inv = true;
        this.slots[x][y] = box;
        if (y == 3) {
          box.isHotbar = true;
        }
        SortaCanvas.add(box);
      }
    }
  },

  render: function () {
    requestAnimationFrame(Inventory.render);
    SortaCanvas.render();
  },
  itemURL: [
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
  ],
  itemNames: [
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
  ],


}
export default Inventory;