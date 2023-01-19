const APIkey = "d696f01bdf9b60c2f86dcdcbeb4320f0";
const searchBtn = $("#search-button");
const cityEl = document.querySelector("#searchcity");
var latitude = "";
var longitude = "";

searchBtn.on("click", function () {
    let city = cityEl.value.trim();
    let queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + APIkey;

    fetch(queryURL)
    .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        latitude = data[0].lat
        longitude = data[0].lon
        console.log(data[0].name);
        console.log(data[0].lat);
        console.log(data[0].lon);
        let weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude +"&lon=" + longitude + "&appid=" + APIkey + "&units=imperial";
        
        fetch(weatherURL)
        .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            console.log(data.main.temp);
            console.log(data.main.feels_like);
            console.log(data.main.temp_min);
            console.log(data.main.temp_max);
            console.log(data.main.humidity);
            console.log(data.wind.speed);
          });
      });

    

  
});