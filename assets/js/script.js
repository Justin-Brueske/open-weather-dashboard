const APIkey = "d696f01bdf9b60c2f86dcdcbeb4320f0";
const searchBtn = $("#search-button");
const cityEl = document.querySelector("#searchcity");
const searchedCityEl = $("#searched-cities");
const forecastEl = $("#five-day-forecast");
const clearBtn = $("#clearLocal")
var searchedCities = [];
var latitude = "";
var longitude = "";

function getWeather() {
    let city = cityEl.value;
    let queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey;
    cityEl.value = "";

    fetch(queryURL)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        latitude = data[0].lat
        longitude = data[0].lon
        let history = $.inArray(data[0].name, searchedCities)
        if (history === -1) {
            searchedCities.unshift(data[0].name);
            localStorage.setItem("cityHistory", JSON.stringify(searchedCities));
            renderCities();
        }


        let weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude +"&lon=" + longitude + "&appid=" + APIkey + "&units=imperial";
        
        fetch(weatherURL)
        .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            let currentWeather = '<h3 class="text-3xl">' + data.name + '</h3> <ul class="list-none"> <li>Temperature: ' + data.main.temp + '&#8457;</li> <li>Feels like: ' + data.main.feels_like + '&#8457;</li> <li>Max Temp: ' + data.main.temp_max + '&#8457;</li> <li>Min Temp: ' + data.main.temp_min + '&#8457;</li><li>Humidity: ' +  data.main.humidity + '%</li> <li>Weather: ' + data.weather[0].description + '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" alt="Weather icon"> </ul>';
            $("#current-weather").html(currentWeather);
          });

          let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude +"&lon=" + longitude + "&appid=" + APIkey + "&units=imperial";
          fetch(forecastURL)
          .then(function (response) {
              return response.json();
            })
            .then(function (data) { 
              forecastEl.html("");
              let i = 0;
              let k = 0;
              do {               
                let forecastDay = (new Date(data.list[i].dt*1000).toDateString());
                let forecast = '<div><span class="text-2xl">' + forecastDay + '</span> <ul class="list-none"> <li>Temperature: ' + data.list[i].main.temp + '&#8457;</li> <li>Humidity: ' +  data.list[i].main.humidity + '%</li> <li>Wind: ' + data.list[i].wind.speed + 'mph</li> <li>Weather: ' + data.list[i].weather[0].description + '<img src="https://openweathermap.org/img/w/' + data.list[i].weather[0].icon + '.png" alt="Weather icon"></li> </ul><div>';
                forecastEl.append(forecast);
                k++;
                i = i + 8;          
              } while (i < 40);
            });
      });
};

searchBtn.on("click", getWeather);

function renderCities() {
    searchedCityEl.html("");
    for (let index = 0; index < searchedCities.length; index++) {
        const historyCity = searchedCities[index];
        var button = '<li><button type="button">' + historyCity + '</button></li>'; 
        searchedCityEl.append(button);        
    } 
}


function init() {
    const cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (cityHistory !== null) {
        searchedCities = cityHistory;      
    }
    renderCities();
}

$('#searched-cities').on("click", (event) => {
    cityEl.value = (event.target.textContent);
    getWeather();
});

clearBtn.on('click', (event) => {
    localStorage.clear();
    searchedCities = []
    renderCities();
});

init()