// The Daily Dive

// jQuery
$(document).ready(function () {
  //TODO create button listeners for global, local, technology news calls

  // News article with appropriate filters

  // VARIABLE DECLARATIONS
  var shareLocation = $("#share-location-btn");
  var quoteBtn = $("#zenQuoteBtn");
  var devotionalBtn = $("#devotionalBtn");
  var globalNewsBtn = $("#globalNewsBtn");
  var technologyNewsBtn = $("#technologyNewsBtn");
  var localNewsBtn = $("localNewsBtn");

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
    var cityName = $("#cityName");
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
        card.attr("class", "card card-body weather m-3");
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
  function callIpAPI() {
    //call ipify geolocation api key and url
    var geoApiKey = "at_0YiSfhoxK70ap9ecG6pYXXKIcktmj";
    var geoApiUrl = "https://geo.ipify.org/api/v1?apiKey=" + geoApiKey;

    $.ajax({
      url: geoApiUrl,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      console.log("IP :" + response.ip);

      var geolocationObj = {
        city: response.location.city,
        region: response.location.region,
        country: response.location.country,
        lat: response.location.lat,
        lon: response.location.lng,
      };

      callLocalNewsAPI(
        geolocationObj.city,
        geolocationObj.region,
        geolocationObj.country
      );

      // call local news and pass the name of user's city, region, and country
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
        //var newsClass = "local";
        //buildContainer(newsClass, title, abstract, publishedDate, shortUrl);
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
        //var newsClass = "global";
        //buildContainer(newsClass, title, abstract, publishedDate, shortUrl);
        buildCard(title, abstract, publishedDate, shortUrl);
      }
    });
  }

  //--Calling Science/tech OBJ from NY API--//
  function technologyNewsData() {
    var techApiKey = "UAm8GChwLgFlI7l9sL58gMBAlx1H3XT3";
    var techUrl = `https://api.nytimes.com/svc/topstories/v2/technology.json?api-key=${techApiKey}`;
    console.log("tech News Api Function Call");
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
          console.log("Title: " + title);
          console.log("abstract: " + abstract);
          console.log("published date: " + publishedDate);
          console.log("short url: " + shortUrl);
          //var newsClass = "tech";
          //buildContainer(newsClass, title, abstract, publishedDate, shortUrl);
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
    section.setAttribute("class", " row news"); //col-md-2 mb-3
    section.setAttribute("class", "col-sm-2");
    section.setAttribute("width", "150px");
    newsCards.appendChild(section);

    //***Inner Card Container to Hold News Data***//
    var divCard = document.createElement("div");
    divCard.setAttribute("class", "card");
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
    console.log(newsCards);
  }

  //            AUTHOR: Zach              //
  // -- Devotional or Inspirational Quote -- //
  function devotionalCallAPI() {
    var devotionalURL = `https://www.abibliadigital.com.br/api/verses/bbe/random`;
    var devotionalParent = $("#devotional-parent");
    var devotionalID = $("#devotional-id");
    $.ajax({
      url: devotionalURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      devotionalParent.removeClass("hidden");

      devotionalID.text('"' + response.text + '"');
    });
  }

  function quotesCallAPI() {
    var quoteURL = "https://api.quotable.io/random";
    var quoteParent = $("#quote-parent");
    var quoteID = $("#quote-id");
    var quoteAuthor = $("#quote-author");

    $.ajax({
      url: quoteURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);

      quoteParent.removeClass("hidden");

      quoteID.text('"' + response.content + '"');
      quoteAuthor.text("~ " + response.author);
    });

    // fetch(quoteURL)
    //   .then(function (response) {
    //     return response.json();
    //   })
    //   .then(function (data) {
    //     console.log(data);
    //   });
  }

  // jQuery UI Widget -Zach
  accordionContainer.accordion();

  // EVENT HANDLERS
  quoteBtn.on("click", quotesCallAPI);
  devotionalBtn.on("click", devotionalCallAPI);
  shareLocation.on("click", geolocateUser);

  //added news card event handlers --JG
  globalNewsBtn.on("click", callGlobalNewsAPI);
  technologyNewsBtn.on("click", technologyNewsData);
  localNewsBtn.on("click", callIpAPI);

  // jQuery - keep code above the brackets below
});
