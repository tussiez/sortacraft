/*This handles the service worker (registering it) */


/*Wait for the window to load */ 
window.addEventListener("load",function() {

  /*If it supports service worker */
  if("serviceWorker" in navigator){
  navigator.serviceWorker.register("sw.js").then(function(r) {
    /*Success! */

  }).catch(function(err) {

    /*Something went wrong! */

    console.log("Service Worker registration failed: ", err);
  });
}
else{
  let div = document.createElement("div");
  div.setAttribute('style',"position:fixed;height:50px;background-color:brown;text-align:center;top:0;left:0;width:100%;");
  
  div.innerHTML = "<p style='color:white;'>Sorry, your browser doesn't support service workers, meaning this can't work offline!</p>";
  if(location.href.includes('http')){
    //http redirect
    let loc = location.href.replace(/^http:\/\//,"https://");
    div.innerHTML = '<p style="color:white;">Redirecting you to <a href="' + loc + '">The secure version of this site</a> (HTTPS)... If you are not being redirected, you can click the link above.</p>';
    document.body.appendChild(div);
    setTimeout(function(){
    location.href = loc;
    },2000);
  }
}

});
