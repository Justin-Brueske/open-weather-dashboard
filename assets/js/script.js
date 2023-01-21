const APIkey = "d696f01bdf9b60c2f86dcdcbeb4320f0";
const searchBtn = $("#search-button");
const cityEl = document.querySelector("#searchcity");
const searchedCityEl = $("#searched-cities");
const forecastEl = $("#five-day-forecast");
var searchedCities = [];
var latitude = "";
var longitude = "";

function getWeather() {
    let city = cityEl.value;
    let queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey;
    cityEl.value = "";

    fetch(queryURL)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // console.log(data);
        latitude = data[0].lat
        longitude = data[0].lon
        console.log(data[0].name);
        searchedCities.unshift(data[0].name);
        console.log(searchedCities);
        localStorage.setItem("cityHistory", JSON.stringify(searchedCities));
        renderCities();
        // console.log(data[0].lat);
        // console.log(data[0].lon);
        let weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude +"&lon=" + longitude + "&appid=" + APIkey + "&units=imperial";
        
        fetch(weatherURL)
        .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            // console.log(data);
            // console.log(data.main.temp);
            // console.log(data.main.feels_like);
            // console.log(data.main.temp_min);
            // console.log(data.main.temp_max);
            let currentWeather = '<h3 class="text-3xl">' + data.name + '</h3> <ul class="list-none"> <li>Temperature: ' + data.main.temp + '&#8457;</li> <li>Feels like: ' + data.main.feels_like + '&#8457;</li> <li>Humidity: ' +  data.main.humidity + '%</li> </ul>';
            $("#current-weather").html(currentWeather);
          });

          let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latitude +"&lon=" + longitude + "&appid=" + APIkey + "&units=imperial";
          fetch(forecastURL)
          .then(function (response) {
              return response.json();
            })
            .then(function (data) {
            //   console.log(data);
              forecastEl.html("");
              let i = 0;
              let k = 0;
              do {               
                // console.log(data.list[i].dt_txt);
                // console.log(data.list[i].dt);
                // console.log(data.list[i].main.temp_max);
                // console.log(data.list[i].main.temp_min);
                // console.log(data.list[i].weather[0].description);
                // console.log(i);
                let forecastDay = (new Date(data.list[i].dt*1000).toDateString());
                let forecast = '<div><span class="text-2xl">' + forecastDay + '</span> <ul class="list-none"> <li>High: ' + data.list[i].main.temp_max + '&#8457;</li> <li>Low: ' + data.list[i].main.temp_min + '&#8457;</li> <li>Weather: ' + data.list[i].weather[0].description + '</li> </ul><div>';
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
        console.log(searchedCities[index]);
        var li = document.createElement('li');
        li.textContent = historyCity;
        searchedCityEl.append(li);        
    } 
}


function init() {
    const cityHistory = JSON.parse(localStorage.getItem("cityHistory"));
    if (cityHistory !== null) {
        searchedCities = cityHistory;      
    }
    renderCities();
}


init()