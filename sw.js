/* UPDATES WHILE YOU WERE GONE: 
*/


/*This is the service worker file. It will be registered as a service worker. Service workers and Web workers both work on seperate threads than the main thread, which is used to handle all other JavaScript files otherwise.*/
/*In a service worker, it uses the global scope of "self". This is like the window object in main frames. Note that you can't access local storage or session storage, or the window object. You could rewrite self as "this" as well.*/


/*control current page when it's activated (A.K.A, whenever it is run). Service workers run when there is a request of any kind, and stop when they aren't needed. So, when a user requests a webpage, it will activate. That is why it's like a proxy for the website.*/

self.addEventListener("activate", function (event) {
  /*Claim the client (page)*/
  return self.clients.claim();

});

/*Listens for when the service worker is installed (when it doesn't exist and the browser registers it) */


self.addEventListener("install", function (event) {

  /*This opens a cache and adds the cached files */
  caches.open("cache").then(function (cache) {

    /*Adds the necessary files to cache*/
    
    return cache.addAll(["https://threejs.org/examples/jsm/csm/Shader.js","https://threejs.org/examples/jsm/csm/Frustum.js","threejs.js","swHandler.js","items/stonesword.gif","https://minecraftfont.tussiez.repl.co/Minecraft.ttf","https://threejs.org/examples/jsm/csm/CSM.js","items/silversword.gif","https://threejs.org/build/three.module.js","items/hotbar.png","/","index.html", "chunkworker.js", "daynight.js", "dirt.png", "gameworker.js", "geometrydataworker.js", "inv.js", "newgame.html", "newgame.js", "script.js", "style.css", "textures.png", "tween.js","sortacraft.ico"]);

  });

});

/*Listen for when someone requests a resource (like a webpage) */
/*
Not going to change:
newgame.html
style.css
tween.js
daynight.js
index.html
dirt.png
*/
/*Checks the version.*/
function checkVer(current){
  fetch("https://sortacraft-1.tussiez.repl.co/VERSION.txt").then(function(res){
    return res.text();
  }).then(function(txt){
    if(Number(txt)){
      let ver = Number(txt);
      if(ver>0){
        //It's actually a number 
        console.log('Latest version: '+ver);
        if(ver>current){
          //Outdated version detected!
          console.log('Outdated game version detected, old: '+ current);
          //TODO:Load this
        }else{
          console.error('Cached game appears to be in a future state.');
          //Time machine used
        }
      }else{
        //guess it's not a number, maybe it's an HTML error page from Repl.it when it's down
        console.warn('strange response')
      }
      
    }
  }).catch(function(err){
    //Probably offline
    console.warn('Unable to establish a connection, offline or website down');
    //TODO:Notify
  });
}
self.addEventListener("fetch", function (event) {

  /*Respond with an immediately invoked function expression (IIFE) (because event.respondWith takes a response, not a function, so compile the function that adds a response)*/
  event.respondWith((function () {

    /*Use Regex to check if the request matches any files we want to try to serve from cache first.*/
    if (event.request.url.match(/(home\.js)(style\.css)|(tween\.js)|(daynight\.js)|(index\.html)|(dirt\.png)|(newgame\.js)|/)) {
      //CACHE!
      return caches.match(event.request).then(function (r) {

        if (r) {

          return r;

        }
        else {

          return fetch(event.request).then(function (fetchR) {

            return fetchR;

          });

        }

      });

    }
    else {
      /*Otherwise, try fetching the script first, then return it. If the user is offline, then try to serve it from cache. If not, tell them that something went wrong (since the cache doesn't exist or is bad and they aren't online) */
      return fetch(event.request).then(function (res) {
        return res;

      }).catch(function () {

        return caches.match(event.request).then(function (cacheRes) 
        {
          if (cacheRes) {

            return cacheRes;

          }

          else {
            /*Return the response telling them that something went wrong. */
            return new Response("<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <title>Error fetching cache</title>  <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1'> <meta name='description' content='Error'></head> <body><h1>Error fetching cache. Try going online. If that doesn't work, try clearing the site's data.</h1></body> </html>", { status: 520, statusText: "Error fetching cache", headers: new Headers({ "Content-Type": "text/html" }) });
            //Interesting
          }

        });

      });

    }
  })());
});