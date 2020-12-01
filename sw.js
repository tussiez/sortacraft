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
    cache.addAll(["index.html", "chunkworker.js", "daynight.js", "dirt.png", "gameworker.js", "geometrydataworker.js", "home.js", "inv.js", "newgame.html", "newgame.js", "script.js", "style.css", "textures.png", "tween.js","ico.ico"]);

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
self.addEventListener("fetch", function (event) {

  /*Respond with an immediately invoked function expression (IIFE) (because event.respondWith takes a response, not a function, so compile the function that adds a response)*/

  event.respondWith((function () {

    /*Use Regex to check if the request matches any files we want to try to serve from cache first.*/

    if (event.request.url.match(/(home\.js)|(newgame\.js)|(style\.css)|(tween\.js)|(daynight\.js)|(index\.html)|(dirt\.png)/)) {

      //We want to serve this from cache
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