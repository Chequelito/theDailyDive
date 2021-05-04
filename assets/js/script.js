// The Daily Dive

console.log("js linked");

// feature/js-creation  //
//      author: Zach    //
//  Pseudo Code  //

// VARIABLE DECLARATIONS

var newsBaseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
var weatherBaseURL = `api.openweathermap.org/data/2.5/weather?`;
var newsAPIKey = "B1bWnHrsG4FxF0rkw1Fg9cWo0bLCYrtE";
var weatherAPIKey = "24d3e77575ea6a3daa1e23b95dbe112f";

// FUNCTION DECLARATIONS

// link html elements to js variables

// pull user's locations from browser with window.navigator.geolocation

function geolocateUser() {
  if (window.navigator && window.navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      onGeolocateSuccess,
      onGeolocateError
    );
  }
  console.log("geolocate");
  var geolactionObj = {
    lat: 0,
    lon: 0,
  };
  callWeatherAPI(geolactionObj);
  callNewsAPI(geolactionObj);
}

// call API'S
//      Weather
function callWeatherAPI() {
  console.log("weather api call function");
  var weatherURL = `${weatherBaseURL}lat=${lat}&lon=${lon}&appid=${weatherAPIKey}`;
}
//      News
function callNewsAPI() {
  console.log("news api call function");
  var newsURL = `${newsBaseURL}fq=news_desk:"technology"&glocations:${____}&api-key=${newsAPIKey}`;
}

// on page load, display:
//      weather based on location
//      tech news articles
