"strict mode";
//display time
function time() {
    let hours = new Date().getHours();
    let Time = new Array();
    
    for (i = 0; i < 6; i++){
         let suffix = "AM";
         let hours = new Date().getHours() + i;
         if (hours > 24) {
             hours -= 24;
         }
         console.log(hours);
        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        } 
        if (i == 0 ){
        Time[i] = hours + suffix;
        }
        else {
        Time[i] = hours +":00 "+ suffix;
        }
    }
//current time
    let time = document.getElementById("time");
    time.textContent= Time[0];
//for slide up
    let Time1 = document.getElementById("ForecastTime1");
    Time1.textContent = Time[1];
    let Time2 = document.getElementById("ForecastTime2");
    Time2.textContent = Time[2];
    let Time3 = document.getElementById("ForecastTime3");
    Time3.textContent = Time[3];
    let Time4 = document.getElementById("ForecastTime4");
    Time4.textContent = Time[4];
    let Time5 = document.getElementById("ForecastTime5");
    Time5.textContent = Time[5];
    
    console.log(Time);

}
time();


//get lat and lon difference
function GetDiff(lat, lon) {
    let LatDiff = Math.abs(lat - 38.5454);
    let LongDiff = Math.abs(lon - (-121.7446));
    let diag =  LatDiff*LatDiff + LongDiff*LongDiff;
    return diag;
}

// Do a CORS request to get Davis weather hourly forecast

// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}
function inputs() {
//let DefaultCity = document.getElementById("city").placeholder;
  let city = document.getElementById("city").value;

      makeCorsRequest(city);
 
}
// Make the actual CORS request.
function makeCorsRequest(NewCity) {
  console.log(NewCity);
  let url = "http://api.openweathermap.org/data/2.5/forecast/hourly?q="+NewCity+",US&units=imperial&APPID=f781297bcbf7c14276dbc0fffd22cc55";
  let xhr = createCORSRequest('GET', url);

    
// checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

// Load some functions into response handlers.
  xhr.onload = function() {
      let responseStr = xhr.responseText;  // get the JSON string 
      let object = JSON.parse(responseStr);  // turn it into an object
//get latitude/log
      let Lat = object.city.coord.lat;
      let Long = object.city.coord.lon;
      console.log(GetDiff(Lat,Long));
    if (GetDiff(Lat,Long) > 5) {
        alert('Forecast Not Found.');
        return;
    }else {
//display object 
      console.log(object);
//*display icon code
      let iconcode = object.list[0].weather[0].icon;
      console.log(iconcode);
      let iconurl = "./assets/" + iconcode + ".svg";
      let currentImg = document.getElementById("icon");
      currentImg.setAttribute('src', iconurl);
//display Forecast icon
    let ForecastImg = new Array();
    let IconCodeArray = new Array();
    let URLarray = new Array();
    ForecastImg[1] = document.getElementById("ForecastImage1");
    ForecastImg[2] = document.getElementById("ForecastImage2");
    ForecastImg[3] = document.getElementById("ForecastImage3");
    ForecastImg[4] = document.getElementById("ForecastImage4");
    ForecastImg[5] = document.getElementById("ForecastImage5");
    for (i = 1; i < 6; i++){
        IconCodeArray[i] = object.list[i].weather[0].icon;
        URLarray[i] = "./assets/" + IconCodeArray[i] + ".svg";
        ForecastImg[i].setAttribute('src', URLarray[i]);
    } 
    console.log(IconCodeArray);
//display temperature
      let temp = object.list[0].main.temp;
      let temperature = document.getElementById("temperature");
      temperature.textContent = Math.round(parseInt(temp,0)) + "°" ;

      let ForecastTemp = new Array();
      let TempArray = new Array();
      console.log(temperature.textContent);
        ForecastTemp[1] = document.getElementById("ForecastTemp1");
        ForecastTemp[2] = document.getElementById("ForecastTemp2");
        ForecastTemp[3] = document.getElementById("ForecastTemp3");
        ForecastTemp[4] = document.getElementById("ForecastTemp4");
        ForecastTemp[5] = document.getElementById("ForecastTemp5");
    for(i = 1;i < 6; i++) {
        TempArray[i]= object.list[i].main.temp;
        
        ForecastTemp[i].textContent = Math.round(TempArray[i]) + "°" ;
        }
  
    } 

  }


  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

// Actually send request to server
  xhr.send();
}

// run this code to make request when this script file gets executed 
makeCorsRequest(document.getElementById("city").placeholder);

