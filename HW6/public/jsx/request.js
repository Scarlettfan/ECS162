"use strict";

// Create the XHR object.
function createAJAXRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true); // call its open method
  return xhr;
}

//get user info
function getuser() {
    let url_user = "/database";
    let xhr_user = createAJAXRequest("GET", url_user);
  
    if (!xhr_user) {
      alert("AJAX not supported");
      return;
    }
  
    xhr_user.onload = function() {
      let responseStr = xhr_user.responseText; // get the JSON string
      console.log(responseStr);
      let output = JSON.parse(responseStr); // turn it into an object
      console.log(output);
      document.getElementById("myfooter").textContent = output.first + " " + output.last;
    };
  
    xhr_user.onerror = function() {
      alert("Woops, there was an error making the request.");
    };
  
    // Actually send request to server
    xhr_user.send();
  }
  
function shownewcard() {
    document.getElementById("input").value = "";
    showcard();
}
//get user's cards 
function showcard() {
    
    let url_engcard = "/givemeacard";
    let xhr_engcard = createAJAXRequest("GET",url_engcard);

    if (!xhr_engcard) {
        alert("AJAX not supported");
        return;
    }

    xhr_engcard.onload = function() {
        let responseStr = xhr_engcard.responseText;
        let output = JSON.parse(responseStr);
        console.log(output);
        let seen=output.seen;
        let correct=output.correct;
        let random =Math.floor(Math.random() * (+15 - +0)) + +0;
        if (( Math.max(1,5-correct) + Math.max(1,5-seen) + 5*( (seen-correct)/seen) ) < random)
            {
                shownewcard();
            }
        else {
        document.getElementById("trans").textContent=output.chinese;
        document.getElementById("congrats").textContent=output.english;
        }
    }

    xhr_engcard.send();
}

function requestUpdate(answer,value) {
    let url_update = "/updatedb?answer=" + answer + "&corrected=" + value;
    let xhr_update = createAJAXRequest("GET", url_update);

    if (!xhr_update) {
        alert("AJAX not supported");
        return;
    }

    xhr_update.onload = function() {
        console.log("database updated!");
    }

    xhr_update.send();
}