/*This handles the service worker (registering it) */


function checkVersion(ver){//This is a version test function just for fun
//This could easily be rewritten as a fetch() meaning less lines of code and easier to read (less messy). - Baconman321
//Hmm
if(navigator.onLine==true){
  var req = new XMLHttpRequest();//new req
  req.open("GET","https://sortacraft-1.tussiez.repl.co/VERSION.txt",true);//set url
  req.send();//send request
  req.onreadystatechange = function(){
    if(this.readyState==4&&this.status==200){
      var latestVer = Number(this.responseText);
      if(latestVer > 0){
      console.log(latestVer)
      }else{
        //repl is down, it returned an HTML page or a blank response
        console.warn('repl.it returned an invalid response.');
        //inform user of the issue
        handleErr('You may not be playing the latest version of the game, as repl.it\'s servers are down. Please try again later.');
      }
    }else{
      if(this.readyState==4){
      console.error('Something strange happened when retrieving game version');
      handleErr('Something very strange happened when trying to get the game version. You may ignore this message.');
      }
    }
  }
}else{
  console.log('The user is not connected to the Internet. Not checking for game version match.');
  //inform user
  handleErr('You are playing offline, and may not be playing the latest version of the game. You may ignore this message.')
}
  function handleErr(text){//This is WAY to complicated
  var div = document.createElement('div');
  var innerDiv =document.createElement('div');
  div.appendChild(innerDiv);
  div.setAttribute('style','position:absolute;width:50%;height:80px;left:25%;top:50px;background-color:lightgray;z-index:9999;opacity:.7;color:black;font-family:Arial;font-weight:lighter;');
  innerDiv.setAttribute('style','margin-left:50px;margin-top:10px;');
  var p = document.createElement('p');
  p.innerHTML = text;
  innerDiv.appendChild(p);
  var aClose = document.createElement('a');
  var rStr = String(Math.random()*10);
  div.setAttribute('id',rStr);//random id
  aClose.setAttribute('href',"#");
  aClose.setAttribute('onclick',"document.getElementById('"+rStr+"').style.display='none'");
  aClose.innerHTML = 'Close'
  aClose.setAttribute('style','float:right');
  p.appendChild(aClose);
  document.body.appendChild(div);
  }

}
checkVersion('test');

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
