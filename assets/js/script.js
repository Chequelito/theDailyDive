// The Daily Dive

// jQuery
$(document).ready(function () {
  //TODO create button listeners for global, local, technology news calls

  // News article with appropriate filters

  // VARIABLE DECLARATIONS
  var shareLocation = $("#share-location-btn");
  var quoteBtn = $("#zenQuoteBtn");
  var devotionalBtn = $("#devotionalBtn");
  var localNewsBtn = $("#localNewsBtn");
  var globalNewsBtn = $("#globalNewsBtn");
  var technologyNewsBtn = $("#technologyNewsBtn");
  var quoteBtn = $("#zenQuoteBtn");
  var devotionalBtn = $("#devotionalBtn");
  var cityName = "";
  var longitude = "";
  var latitude = "";

  // ask for user's locations from browser with window.navigator.geolocation
  function geolocateUser() {
    // if the location is successfully retrieved
    function onGeolocateSuccess(coordinates) {
      shareLocation.addClass("hidden");
      // pass this obj to weather api
      var geolocationObj = {
        lat: coordinates.coords.latitude,
        lon: coordinates.coords.longitude,
      };
      longitude = coordinates.coords.longitude;
      latitude = coordinates.coords.latitude;
      // call weather api with geolocationObj
      callWeatherAPI(geolocationObj);
      callForecastAPI(geolocationObj);
    }

    // if there is an error trying to grab geolocation
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

  //            AUTHOR: Zach              //
  // -- Weather based on user location -- //
  function callWeatherAPI(geolocationObj) {
    var weatherBaseURL = "https://api.openweathermap.org/data/2.5/weather?";
    var weatherAPIKey = "24d3e77575ea6a3daa1e23b95dbe112f";
    var weatherURL = `${weatherBaseURL}lat=${geolocationObj.lat}&lon=${geolocationObj.lon}&appid=${weatherAPIKey}&units=imperial`;
    // link html elements to js variables
    cityName = $("#cityName");
    var tempCurrent = $("#currentTemp");
    var tempMax = $("#tempMax");
    var tempMin = $("#tempMin");
    var humidity = $("#");
    var windSpeed = $("#windSpeed");
    var windGust = $("#windGust");
    var date = $("#date");
    var time = $("#time");
    var sunrise = $("#sunrise");
    var sunset = $("#sunset");

    $.ajax({
      url: weatherURL,
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      //   updates time and date every 1000 milliseconds
      function updateTime() {
        setInterval(function () {
          var now = new Date();
          var localTime = now.toLocaleTimeString();
          var dateToday = now.toLocaleDateString();

          $(date).text(dateToday);
          $(time).text(localTime);
        }, 1000);
      }
      updateTime();

      // sunrise/sunset time formatted in HH:MM:SS
      sunriseObj = new Date(response.sys.sunrise * 1000).toLocaleTimeString();
      sunsetObj = new Date(response.sys.sunset * 1000).toLocaleTimeString();

      // update static html text with weather data
      $(cityName).text(response.name);
      $(tempCurrent).text(
        "Currently: " +
          response.main.temp +
          "°F " +
          "with " +
          response.weather[0].description
      );
      $(tempMax).text("High: " + response.main.temp_max + "°F");
      $(tempMin).text("Low: " + response.main.temp_min + "°F");
      $(humidity).text("Humidity: " + " " + response.main.humidity + "%");
      $(windSpeed).text("Wind Speed: " + response.wind.speed + "MPH");
      if (response.wind.gust) {
        $(windGust).text("Wind Gusts: " + response.wind.gust + " MPH");
      }
      $(sunrise).text("Sunrise Time: " + sunriseObj);
      $(sunset).text("Sunset Time: " + sunsetObj);
    });
  }

  //             AUTHOR: Zach               //
  //            -- Forecast --              //
  function callForecastAPI(obj) {
    var forecastAPIKey = "24d3e77575ea6a3daa1e23b95dbe112f";
    var forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${obj.lat}&lon=${obj.lon}&exclude=current,minutely,alerts&appid=${forecastAPIKey}&units=imperial`;
    var forecastContainer = $("#forecast-container");
    $.ajax({
      url: forecastURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      // remove hidden class from container
      forecastContainer.removeClass("hidden");

      // Forecast code below
      var scrollParent = $("#scroll-parent");
      var forecastArr = [];
      for (var i = 0; i < 5; i++) {
        var forecast = response.daily[i + 1];
        forecastArr.push(forecast);

        var cardDate = new Date(forecastArr[i].dt * 1000).toLocaleDateString();

        var card = $("<div>");
        card.attr("class", "card card-body weather m-3 p-3 news");
        scrollParent.append(card);

        var cardTitle = $(
          "<h2>" + "<strong>" + cardDate + "</strong>" + "</h2>"
        );
        cardTitle.attr("class", "title");

        var cardTemp = $(
          "<p>" + "Temperature: " + forecastArr[i].temp.day + "°F" + "</p>"
        );
        cardTemp.attr("class", "card-text");

        var cardWind = $(
          "<p>" + "Wind Speed: " + forecastArr[i].wind_speed + " MPH" + "</p>"
        );
        cardWind.attr("class", "card-text");

        var cardHumid = $(
          "<p>" + "Humidity: " + forecastArr[i].humidity + "%" + "</p>"
        );
        cardHumid.attr("class", "card-text");
        card.append(cardTitle, cardTemp, cardWind, cardHumid);
      }
    });
  }

  // JG retrieves user's external IP (city, region, and country) for local news
  function callIpAPI(longitude, latitude) {
    //call ipify geolocation api key and url
    console.log("IN CALLIPAPI FUNCTION");
    var geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude${latitude}&longitude=${longitude}&localityLanguage=en`;
    $.ajax({
      url: geoApiUrl,
      method: "GET",
    }).then(function (response) {
      var city = response.city;
      var region = response.localityInfo.administrative[1].name;
      var country = response.countryCode;

      // call local news and pass the name of user's city, region, and country
      callLocalNewsAPI(city, region, country);
    });
  }

  //    -- Local News -- AUTHOR: Zach   EDITED: JG //
  function callLocalNewsAPI(city, region, country) {
    // removes white spaces from variables
    city = city.replace(/ /g, "");
    region = region.replace(/ /g, "");
    country = country.replace(/ /g, "");
    var localNewsBaseURL =
      "https://api.nytimes.com/svc/search/v2/articlesearch.json?";
    var localNewsAPIKey = "B1bWnHrsG4FxF0rkw1Fg9cWo0bLCYrtE";
    var localNewsURL = `${localNewsBaseURL}fq=glocations.contains:${city},${region},${country}&api-key=${localNewsAPIKey}`;
    $.ajax({
      url: localNewsURL,
      Method: "GET",
    }).then(function (response) {
      console.log("IN CALL LOCAL NEWS FUNCTION");
      var localNewsData = response.response.docs;
      var newsCards = document.getElementById("contentBlock");
      newsCards.innerHTML = "";

      for (var i = 0; i < 5; i++) {
        var title = localNewsData[i].headline.main;
        var abstract = localNewsData[i].abstract;
        var publishedDate = localNewsData[i].pub_date;
        var shortUrl = localNewsData[i].web_url;
        publishedDate = moment().format("MMM Do YYYY");

        buildCard(title, abstract, publishedDate, shortUrl);
      }
    });
  }

  ///JG global news object function
  //TODO Once event listener buttons are added, they can call the news functions
  function callGlobalNewsAPI() {
    var globalNewsApiKey = "UCJMG4jj3LlXlGM9nUTRBZiy6aCx7huZ";
    var globalNewsUrl =
      "https://api.nytimes.com/svc/topstories/v2/world.json?api-key=" +
      globalNewsApiKey;

    $.ajax({
      url: globalNewsUrl,
      method: "GET",
    }).then(function (response) {
      console.log("IN GLOBAL NEWS FUNCTION");
      var globalNewsData = response.results;
      var newsCards = document.getElementById("contentBlock");
      newsCards.innerHTML = "";
      for (var i = 0; i < 5; i++) {
        var title = globalNewsData[i].title;
        var abstract = globalNewsData[i].abstract;
        var publishedDate = globalNewsData[i].published_date;
        var shortUrl = globalNewsData[i].short_url;
        publishedDate = moment().format("MMM Do YYYY");

        buildCard(title, abstract, publishedDate, shortUrl);
      }
    });
  }

  //--Calling Science/tech OBJ from NY API--//
  function technologyNewsData() {
    var techApiKey = "UAm8GChwLgFlI7l9sL58gMBAlx1H3XT3";
    var techUrl = `https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=${techApiKey}`;
    console.log("IN TECH NEWS FUNCTION CALL");
    fetch(techUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (currentNewsTechObj) {
        var results = currentNewsTechObj.results;

        var newsCards = document.getElementById("contentBlock");
        newsCards.innerHTML = "";

        for (let i = 0; i < 5; i++) {
          var title = results[i].title;
          var abstract = results[i].abstract;
          var publishedDate = results[i].published_date;
          publishedDate = moment().format("MMM Do YYYY");
          var shortUrl = results[i].short_url;

          buildCard(title, abstract, publishedDate, shortUrl);
        }
      });
  }

  //*****Dynamic Card Generation Function******Author:Sam//
  function buildCard(title, abstract, publishedDate, shortUrl) {
    //**Main Section Container Variable for all News Cards***//
    var newsCards = document.getElementById("contentBlock");
    // newsCards.setAttribute("display", "flex");
    //***Section Container For Individual Card***//
    var section = document.createElement("section");
    section.setAttribute("class", " row");
    // section.setAttribute("class", "col-sm-2");

    // section.setAttribute("width", "150px");
    newsCards.appendChild(section);

    //***Inner Card Container to Hold News Data***//
    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card custom-card news");
    section.appendChild(divCard);

    //**Card Body Variable***//
    var divBody = document.createElement("div");
    divBody.setAttribute("class", "card-body");
    divCard.appendChild(divBody);

    //**Title for Card Content***//
    var cardTitle = document.createElement("h2");
    cardTitle.setAttribute("class", "title");
    var titleLink = document.createElement("a");
    titleLink.setAttribute("href", shortUrl);
    titleLink.setAttribute("target", "_blank");
    titleLink.textContent = title;
    cardTitle.appendChild(titleLink);

    divBody.appendChild(cardTitle);

    //***Abstract Info for card***//
    var abstractPara = document.createElement("p");
    abstractPara.setAttribute("class", "card-text");
    abstractPara.textContent = abstract;
    divBody.appendChild(abstractPara);

    //***Publish Date Paragraph Information***//
    var publishDatePara = document.createElement("p");
    publishDatePara.setAttribute("class", "card-text");
    var dateText = document.createTextNode(publishedDate);
    publishDatePara.appendChild(dateText);

    divBody.appendChild(publishDatePara);
    //console.log(newsCards);
  }

  //            AUTHOR: Zach              //
  // -- Devotional or Inspirational Quote -- //
  function devotionalCallAPI() {
    var devotionalURL = `https://www.abibliadigital.com.br/api/verses/bbe/random`;

    var newsCards = document.getElementById("contentBlock");
    newsCards.innerHTML = "";

    $.ajax({
      url: devotionalURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      var devotionalID = response.text;

      var divCard = document.createElement("div");
      divCard.setAttribute("id", "devotionalID");
      divCard.textContent = '"' + devotionalID + '"';
      newsCards.appendChild(divCard);
    });
  }

  function quotesCallAPI() {
    var quoteURL = "https://api.quotable.io/random";
    var newsCards = document.getElementById("contentBlock");
    newsCards.innerHTML = "";
    $.ajax({
      url: quoteURL,
      method: "GET",
    }).then(function (response) {
      var quoteContent = response.content;
      var quoteAuthor = response.author;

      var divCard = document.createElement("div");
      divCard.setAttribute("id", "quoteID");
      divCard.textContent = '"' + quoteContent + '"' + " ~ " + quoteAuthor;
      newsCards.appendChild(divCard);
    });
  }

  // EVENT HANDLERS
  //added news card event handlers --JG
  shareLocation.on("click", geolocateUser);
  localNewsBtn.on("click", function () {
    callIpAPI(longitude, latitude);
  });
  globalNewsBtn.on("click", callGlobalNewsAPI);
  technologyNewsBtn.on("click", technologyNewsData);
  quoteBtn.on("click", quotesCallAPI);
  devotionalBtn.on("click", devotionalCallAPI);

  // jQuery - keep code above the brackets below
});
