import SortaCanvas from 'https://sortacanvas.sortagames.repl.co/lib.js'

let canvasE;

const handlers = {
  getCanvas,
  init
}

onmessage = function (e) {
  let handler = handlers[e.data.type];
  if (handler != undefined) {
    handler(e.data);
  }
}

function getCanvas(e) {
  canvasE = e.canvas;
  postMessage(['ready']);
}
let doneCount = 0;
let done = false;
let pos = [];
let textures = [];
function init(e) {
  SortaCanvas.init(canvasE, false)
  let img = new SortaCanvas.Image(0, 0, canvasE.height, canvasE.width, '/textures.png', 'texture');
  img.onload = function (tex) {
    //tex == the texture

    for (let x = 0; x < canvasE.width / 16; x++) {
      pos[x] = x * 16;
    }
    for (let p = 0; p < pos.length; p++) {
      Promise.all([
        createImageBitmap(tex, pos[p], 0, 16, 16),
        createImageBitmap(tex, pos[p], 16, 16, 16),
        createImageBitmap(tex, pos[p], 32, 16, 16),
      ]).then(texs => {
        textures.push({
          index: p,
          side: texs[0],
          top: texs[1],
          bottom: texs[2],
        });
        doneCount++;
        postMessage(['progress', (p / (pos.length - 1) * 100)]);
      })
    }

  }
  SortaCanvas.add(img);
  render();
}

function render() {
  requestAnimationFrame(render);
  SortaCanvas.render();
  if (done == false && doneCount == canvasE.width / 16) {
    done = true;
    postMessage(['done', textures]);
  }
}