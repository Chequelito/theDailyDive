// The Daily Dive

// jQuery
$(document).ready(function () {
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

  var newsBaseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
  var weatherBaseURL = "https://api.openweathermap.org/data/2.5/weather?";
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
      //callNewsAPI(geolocationObj);
      //JG added function for grabbing global news object
      callGlobalNewsAPI(geolocationObj);
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
  }

  // call API'S
  //      Weather
  function callWeatherAPI(geolocationObj) {
    console.log("weather api call function\n-----------");
    var weatherURL = `${weatherBaseURL}lat=${geolocationObj.lat}&lon=${geolocationObj.lon}&appid=${weatherAPIKey}&units=imperial`;

    $.ajax({
      url: weatherURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      //grabbing todays date
      var dateToday = new Date(response.dt * 1000).toLocaleDateString();
      console.log(dateToday);

      // grabbing time
      var localTime = new Date(response.dt * 1000).toLocaleTimeString();
      console.log(localTime);

      // sunrise/sunset time
      sunriseObj = new Date(response.sys.sunrise * 1000).toLocaleTimeString();
      sunsetObj = new Date(response.sys.sunset * 1000).toLocaleTimeString();
      console.log(sunriseObj);
      console.log(sunsetObj);

      // placing weather data into static html

      $(cityName).text(response.name);
      $(tempMax).text(response.main.temp_max);
      $(tempMin).text(response.main.temp_min);
      $(humidity).text(response.main.humidity);
      $(windSpeed).text(response.wind.speed);
      $(windGust).text(response.wind.gust);
      $(date).text(dateToday);
      $(time).text(localTime);
      $(weatherDesc).text(response.weather[0].description);
      $(sunrise).text(sunriseObj);
      $(sunset).text(sunsetObj);
    });
  }
  //      News
  // function callNewsAPI(geolocationObj) {
  //   console.log("news api call function");
  //   var newsURL = `${newsBaseURL}fq=news_desk:"technology"&glocations:${geolocationObj}&api-key=${newsAPIKey}`;
  //   console.log(newsURL);
  //   $.ajax({
  //     url: "",
  //     success: "",
  //   });
  // }

  ///JG global news object function
  function callGlobalNewsAPI(geolocationObj) {
    var globalNewsApiKey = "UCJMG4jj3LlXlGM9nUTRBZiy6aCx7huZ";
    var globalNewsUrl =
      "https://api.nytimes.com/svc/topstories/v2/world.json?api-key=" +
      globalNewsApiKey;
    console.log(globalNewsUrl);

    $.ajax({
      url: globalNewsUrl,
      method: "GET",
    }).then(function (response) {
      console.log("IN GLOBAL NEWS FUNCTION");
      var globalNewsData = response.results;
      //console.log(globalNewsData);
      for (var i = 0; i < 5; i++) {
        //console.log(globalNewsData[i]);
        var title = globalNewsData[i].title;
        var abstract = globalNewsData[i].abstract;
        var publishedDate = globalNewsData[i].published_date;
        var shortUrl = globalNewsData[i].short_url;
        publishedDate = moment().format("MMM Do YYYY");
        console.log("Title: " + title);
        console.log("abstract: " + abstract);
        console.log("Published Date: " + publishedDate);
        console.log("Short Url :" + shortUrl);

        buildCard(title, abstract, publishedDate, shortUrl);
      }
    });
  }

  //Build card function to be called inside each newsapi function
  // function buildCard(title,abstract,publishedDate,shortUrl)
  // {
  // var section = document.createElement("<section>");
  // section.setAttribute("class", "news col-md-2 mb-3");

  // var div = document.createElement("<div>")
  //   div.setAttribute("class", "");
  //   div.textContent(title);

  // }

  //--Calling Science/tech OBJ from NY API--//
  function techNewsData() {
    var techApiKey = "UAm8GChwLgFlI7l9sL58gMBAlx1H3XT3";
    var techUrl = `https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=${techApiKey}`;
    console.log("tech News Api Function Call");
    fetch(techUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (CurrentNewsTech) {
        console.log(CurrentNewsTech);
        newsCards.innerHTML = `
        <section class="news col-md-2 mb-3">
          <div class="card">
            <img
              src="./assets/images/bill-wegener-CVIeAfFv4rM-unsplash.jpg"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
             <a href ="" src =""></a> <h2 class="title">this will hold the title${title}</h2></a>
              <p class="card-text">
               the abstract will go here${abstract}
              </p>
              <p>${publishdate}</p>
            </div>
          </div>
        </section>

        <section class="news col-md-2 mb-3">
          <div class="card">
            <img
              src="./assets/images/brooke-lark-RMcJIvxhuW0-unsplash.jpg"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
              <a href ="" src =""></a> <h2 class="title">this will hold the title${title}</h2></a>
              <p class="card-text">
                the abstract will go here${abstract}
                <p>${publishdate}</p>
              </p>
            </div>
          </div>
        </section>

        <section class="news col-md-2 mb-3">
          <div class="card">
            <img
              src="./assets/images/stephen-cook-ycduJobBI24-unsplash.jpg"
              class="card-img-top"
              alt="..."
            />
            <div class="card-body">
             <a href ="" src =""></a> <h2 class="title">this will hold the title${title}</h2></a>
              <p class="card-text">
               the abstract will go here${abstract}
              </p>
              <p>${publishdate}</p>
            </div>
          </div>
        </section>`;
      });
  }

  // on page load, call functions to display:
  //      weather based on location
  //      news articles with appropriate filters
  techNewsData();
  geolocateUser();

  // jQuery - keep code above the brackets below
});
