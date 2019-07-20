"use strict";

// Create the XHR object.
function createAJAXRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true); // call its open method
  return xhr;
}

// Make the actual CORS request.
function makeAJAXRequest() {
      let input = document.getElementById("userInputs");
      console.log(input.value);
      let url = "translate?english=" + input.value;
      console.log(url);
      let xhr = createAJAXRequest("GET", url);

  // checking if browser does AJAX
      if (!xhr) {
        alert("AJAX not supported");
        return;
      }

      // Load some functions into response handlers.
      xhr.onload = function() {
        let responseStr = xhr.responseText; // get the JSON string
        let output = JSON.parse(responseStr); // turn it into an object
        console.log(output);
        document.getElementById("chinese").textContent = output;
      };

      xhr.onerror = function() {
        alert("Woops, there was an error making the request.");
      };

      // Actually send request to server
      xhr.send();
}

function makeSaverequest() {

  let input = document.getElementById("userInputs");
  let output = document.getElementById("chinese");
  console.log(output.textContent);
  let url_save = "store?english="+ input.value +"&chinese=" + output.textContent;
  let xhr_save = createAJAXRequest("GET", url_save);
 

// checking if browser does AJAX
  if (!xhr_save) {
    alert("AJAX not supported");
    return;
  }
  xhr_save.onerror = function() {
    alert("Woops, there was an error making the request.");
  };

  // Actually send request to server
  xhr_save.send();
}


