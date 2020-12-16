

/*This is the service worker file. It will be registered as a service worker. Service workers and Web workers both work on seperate threads than the main thread, which is used to handle all other JavaScript files otherwise.*/
/*In a service worker, it uses the global scope of "self". This is like the window object in main frames. Note that you can't access local storage or session storage, or the window object. You could rewrite self as "this" as well.*/

/*Files to cache. Add or delete files that should be cached here: */
let cacheList = ["https://threejs.org/examples/jsm/csm/Shader.js", "https://threejs.org/examples/jsm/csm/Frustum.js", "threejs.js", "swHandler.js", "items/stonesword.gif", "https://minecraftfont.tussiez.repl.co/Minecraft.ttf", "https://threejs.org/examples/jsm/csm/CSM.js", "items/silversword.gif", "https://threejs.org/build/three.module.js", "items/hotbar.png", "/", "index.html", "chunkworker.js", "daynight.js", "dirt.png",  "gameworker.js","geometrydataworker.js", "inv.js", "newgame.html", "newgame.js", "script.js", "style.css", "textures.png", "tween.js", "sortacraft.ico", "VERSION.txt","manifest.json","icons/logo-large.png","icons/logo-small.png"];
/*control current page when it's activated (A.K.A, whenever it is run). Service workers run when there is a request of any kind, and stop when they aren't needed. So, when a user requests a webpage, it will activate. That is why it's like a proxy for the website.*/

self.addEventListener("activate", function (event) {
  /*Claim the client (page)*/
  console.log("Service Worker Activated.");
  return self.clients.claim();
  /*Checks the version. If it's not up to date, then update it if possible */

});

/*Listens for when the service worker is installed (when it doesn't exist and the browser registers it) */


self.addEventListener("install", function (event) {

  /*This opens a cache and adds the cached files */
  caches.open("cache").then(function (cache) {

    /*Adds the necessary files to cache*/
    return cache.addAll(cacheList);

  });
  self.skipWaiting();
  console.log("Service worker installed.");

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
function checkVer() {
  let checkCache = function () {
    return new Promise(function (res, rej) {
      caches.open("cache").then(function (cache) {
        /*Open "cache", then get VERSION.txt from cache archive */
        cache.match("VERSION.txt").then(function (r) {
          /*If the response is invalid (will be falsely if it doesn't exist or some other error appears), then reject the promise and return (to prevent next line of code from executing) */
          if(!r){
            rej("Failed to check version");
            return;
          }
          /*If the above code doesn't run, then read the readableStream as text and return it. */
          return r.text();
        }).then(function (txt) {
          /*If the text is valid, return it */
          if (txt) {
            res(txt);
            return txt;
          }
          /*If it's invalid, the above code won't execute, causing this to reject and return. */
          rej("Invalid response, recieved: " + txt);
          return;
        });
      });
    });
  }
  /*Fetch the cached version of VERSION.txt, then compare it to the website's file. If there is a difference, update the cache. */
  checkCache().then(function (cacheVer) {
    let current = cacheVer;
    fetch("https://sortacraft-1.tussiez.repl.co/VERSION.txt").then(function (res) {
      return res.text();
    }).then(function (txt) {
      if (Number(txt)) {
        current = Number(current);
        let ver = Number(txt);
        if (ver > 0) {
          //It's actually a number 
          console.log('Latest version: ' + ver+'.\n Current: '+current+'.');

          if (ver > current) {
            //Outdated version detected!
            console.log('Outdated game version detected, old: ' + current+'.');
            caches.open("cache").then(function (cache) {

              /*Updates the cache*/
              return cache.addAll(cacheList);

            });
          } else if(ver == current){
            console.log("Game is up to date.");
          } else {
            //console.warn is less intrusive than console.error
            console.warn('Cached game appears to be in a future state. Cached version: ' + current);
            //Time machine used
          }
        } else {
          //hmm
          console.warn('strange response')
        }

      }
    }).catch(function (err) {
      //Probably offline
      console.warn('Unable to establish a connection, offline or website down');
      console.warn("Failed to check version.");

    });
  }).catch(function(err){
    console.warn(err);
  });
}
self.addEventListener("fetch", function (event) {

  /*Respond with an immediately invoked function expression (IIFE) (because event.respondWith takes a response, not a function, so compile the function that adds a response)*/
  event.respondWith((function () {

    /*Use Regex to check if the request matches any files we want to try to serve from cache first.*/
    if (event.request.url.match(/(home\.js)|(tween\.js)|(daynight\.js)|(dirt\.png)/)) {
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

        return caches.match(event.request).then(function (cacheRes) {
          if (cacheRes) {

            return cacheRes;

          }

          else {
            /*Return the response telling them that something went wrong. (One of the main reasons this would happen is if something isn't cached and they are offline) */
            return new Response("<!DOCTYPE html> <html lang='en'> <head> <meta charset='UTF-8'> <title>Error fetching cache</title>  <meta charset='UTF-8'> <meta name='viewport' content='width=device-width, initial-scale=1'> <meta name='description' content='Error'></head> <body><h1>Error fetching cache.</h1><p>Try connecting to the internet. If that doesn't work, try clearing the site's data.</p></body> </html>", { status: 520, statusText: "Error fetching cache", headers: new Headers({ "Content-Type": "text/html" }) });
            //Interesting
          }

        });

      });

    }
  })());
  setTimeout(()=>{
    if(event.request.url.match(/(index\.html)|(\/$)|(newgame\.html)/)){
      checkVer();
      console.log("checking version...");
    }
  },1000);
});