var cityInputEl = document.querySelector('#cityname');
var weatherContainerEl = document.querySelector('#weather-container');
var forecastContainerEl = document.querySelector('#forecast-container');
var cityFormEl = document.querySelector('#city-form');
var weatherSearchTerm = document.querySelector('#weather-search-term');
var rightNow = moment().format("MMM Do YYYY");
var historyButtonsEl = document.querySelector('#history-buttons');
var count = 0;
var searchHistory = [];


var formSubmitHandler = function (event) { //Get Input
  event.preventDefault();

  var cityname = cityInputEl.value.trim();

  if (cityname) {
    if(localStorage.getItem('count')){
      count = localStorage.getItem('count');
    }

      if(localStorage.getItem(cityname)){

      }else {
        localStorage.setItem(cityname, cityname); // save to seach history
        searchHistory.push(cityname);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        count++;
        localStorage.setItem('count', count);
      }
      findLatLon(cityname);

      weatherContainerEl.textContent = '';
      cityInputEl.value = '';
  } else {
    alert('Please enter a city name');
  }
};

var buttonClickHandler = function (event) { //If user click previous search
  var history = event.target.getAttribute('data-history');

  if (history) {
    findLatLon(history);

    weatherContainerEl.textContent = '';
  }
};

var getCityWeather = function (lat, lon, searchTerm, city) { //Find Lat and Lon
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + "&units=imperial&appid=a9b3f314afeb32ca443fa3fe09d0633e";
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          //console.log(response);
          response.json().then(function (data) {
            console.log(data);
            displayWeather(data, searchTerm);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });
};

var findLatLon = function (city) { //Find City
      //add + to replace space in the city string
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=a9b3f314afeb32ca443fa3fe09d0633e';
  
    fetch(apiUrl)
      .then(function (response) {
        if (response.ok) {
          //console.log(response);
          response.json().then(function (data) {
            //console.log(data);
            getCityWeather(data[0].lat, data[0].lon, data[0].name, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });
};


var displayWeather = function (weather, searchTerm) {
    if (weather.length === 0) {
      alert('No weather found.');
      return;
    }
  
    weatherSearchTerm.textContent = searchTerm + " (" + rightNow + ")";

    var temperature = document.createElement("p");
    var wind = document.createElement("p");
    var humid = document.createElement("p");
    var uvi = document.createElement("p");

    temperature.textContent = "Temp: " + weather.current.temp + "°F";
    wind.textContent = "Wind: " + weather.current.wind_speed + " MPH";
    humid.textContent = "Humid: " + weather.current.humidity + " %";
    uvi.textContent = "UV Index: " + weather.current.uvi;

    if(weather.current.uvi <= 2){
      uvi.setAttribute("style", "color: green;");
    }else if(weather.current.uvi <= 5){
      uvi.setAttribute("style", "color: yellow;");
    }else if(weather.current.uvi <= 7){
      uvi.setAttribute("style", "color: orange;");
    }else if(weather.current.uvi <= 10){
      uvi.setAttribute("style", "color: red;");
    }else{
      uvi.setAttribute("style", "color: violet;");
    }




    weatherContainerEl.appendChild(temperature);
    weatherContainerEl.appendChild(wind);
    weatherContainerEl.appendChild(humid);
    weatherContainerEl.appendChild(uvi);


    $("#weather-forecast").text("5-Day Forecast");

    forecastContainerEl.innerHTML = '<div class="cards"><h3>'+ moment().add(1, 'days').format("MMM Do YYYY") +'</h3><p>Temp: ' + weather.daily[0].temp.day +'°F</p><p>Wind: ' + weather.daily[0].wind_speed +' MPH</p><p>Humid: ' + weather.daily[0].humidity +' %</p></div> <div class="cards"><h3>'+ moment().add(2, 'days').format("MMM Do YYYY") +'</h3><p>Temp: ' + weather.daily[1].temp.day +'°F</p><p>Wind: ' + weather.daily[1].wind_speed +' MPH</p><p>Humid: ' + weather.daily[0].humidity +' %</p></div><div class="cards"><h3>'+ moment().add(3, 'days').format("MMM Do YYYY") +'</h3><p>Temp: ' + weather.daily[2].temp.day +'°F</p><p>Wind: ' + weather.daily[2].wind_speed +' MPH</p><p>Humid: ' + weather.daily[0].humidity +' %</p></div><div class="cards"><h3>'+ moment().add(4, 'days').format("MMM Do YYYY") +'</h3><p>Temp: ' + weather.daily[3].temp.day +'°F</p><p>Wind: ' + weather.daily[0].wind_speed +' MPH</p><p>Humid: ' + weather.daily[3].humidity +' %</p></div><div class="cards"><h3>'+ moment().add(5, 'days').format("MMM Do YYYY") +'</h3><p>Temp: ' + weather.daily[4].temp.day +'°F</p><p>Wind: ' + weather.daily[4].wind_speed +' MPH</p><p>Humid: ' + weather.daily[0].humidity +' %</p></div>';
    
};



if(localStorage.getItem('count')){
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    console.log(searchHistory);
    for(var i = 0; i < localStorage.getItem('count'); i++) {
      $('<button data-history="' + searchHistory[i] + '" class="btn text-uppercase">' + searchHistory[i] + '</button>').appendTo(historyButtonsEl);
    }

}  

cityFormEl.addEventListener('submit', formSubmitHandler);
historyButtonsEl.addEventListener('click', buttonClickHandler);


