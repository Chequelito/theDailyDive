// The Daily Dive

// jQuery
$(document).ready(function () {
  console.log("js linked");

  // feature/js-creation  //
  //      author: Zach    //
  //  Pseudo Code  //

  var cityName;
  var tempMax;
  var tempMin;
  var humidity;
  var windSpeed;
  var windGust;
  var date;
  var time;
  var weatherDesc;
  var sunrise;
  var sunset;
  var currentTemp;

  var newsBaseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  var weatherBaseURL = `api.openweathermap.org/data/2.5/weather?`;
  var newsAPIKey = "B1bWnHrsG4FxF0rkw1Fg9cWo0bLCYrtE";
  var weatherAPIKey = "24d3e77575ea6a3daa1e23b95dbe112f";

  // FUNCTION DECLARATIONS

  // link html elements to js variables

  // pull user's locations from browser with window.navigator.geolocation

  function geolocateUser() {
    // if the location is successfully retrieved
    function onGeolocateSuccess(coordinates) {
      const { latitude, longitude } = coordinates.coords;
      console.log("user's coordinates: ", latitude, longitude);

      // pass this obj to API's
      var geolocationObj = {
        lat: coordinates.coords.latitude,
        lon: coordinates.coords.longitude,
      };
      console.log(geolocationObj);

      // call API's with geolocation
      callWeatherAPI(geolocationObj);
      callNewsAPI(geolocationObj);
    }

    // if there is an error
    function onGeolocateError(error) {
      console.warn(error.code, error.message);

      if (error.code === 1) {
        // they said no
      } else if (error.code === 2) {
        // position unavailable
      } else if (error.code === 3) {
        // timeout
      }
    }

    // if browser supports geolocation, get current position
    if (window.navigator && window.navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        onGeolocateSuccess,
        onGeolocateError
      );
    }
    console.log("geolocate function");
  }

  // call API'S
  //      Weather
  function callWeatherAPI(geolocationObj) {
    console.log("weather api call function");
    var weatherURL = `${weatherBaseURL}lat=${geolocationObj.lat}&lon=${geolocationObj.lon}&appid=${weatherAPIKey}`;
    console.log(weatherURL);
    $.ajax({
      url: weatherURL,
      method: "GET",
    }).then(function (response) {
      console.log("Ajax Reponse \n-------------");
      console.log(response);
    });
  }
  //      News
  function callNewsAPI(geolocationObj) {
    console.log("news api call function");
    var newsURL = `${newsBaseURL}fq=news_desk:"technology"&glocations:${geolocationObj}&api-key=${newsAPIKey}`;
    console.log(newsURL);
    $.ajax({
      url: "",
      success: "",
    });
  }

  // on page load, call functions to display:
  //      weather based on location
  //      news articles with appropriate filters
  geolocateUser();

  // jQuery - keep code above the brackets below
});
