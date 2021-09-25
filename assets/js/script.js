// -------------------- Global Variables ----------------------------
var forecastData;
var cityName = document.querySelector(".citySelected")
var locationEl = document.querySelector(".location");
var iconVal = document.querySelector("#icon")
var tempVal = document.querySelector("#temp");
var windVal = document.querySelector("#windsp");
var humidVal = document.querySelector("#humid");
var uviVal = document.querySelector("#uvi");
var cityPicked = document.querySelector("#cityPicked");
var mainSearch = document.querySelector(".main-search")

// -------------------- API key ----------------------------
var apiKey = 'ee6bc0db0b2e0a0c46117b224a3ee840'

// -------------------- Display current date in vp ----------------------------
var currentDate = document.querySelector("#display-date");
var date = moment().format("dddd, MMMM Do, YYYY")
currentDate.textContent = date;

// -------------------- Display current time in vp ----------------------------
var currentMoment = document.querySelector("#display-time");

function currentTime() {
    var time = moment().format("hh:mm:ss");
    currentMoment.textContent = time
};

currentTime();
setInterval(function(){
    currentTime();
},1000);

// -------------------- Get Weather API ----------------------------
function fetchWeather(data) {
    data.preventDefault();

    forecastData = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName.value}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then((data)=>{
        console.log(data);
        weatherData(data);
        fiveDayForecast(data);
    })

};

function weatherData(data) {
    var oneCall = fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.city.coord.lat}&lon=${data.city.coord.lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then((cityData) =>{    
       var iconUrl = `https://openweathermap.org/img/w/${cityData.current.weather[0].icon}.png`;
        cityPicked.textContent = cityName.value;
        iconVal.setAttribute("src", iconUrl);
        tempVal.textContent= cityData.current.temp + " °C"
        windVal.textContent= cityData.current.wind_speed + " KM/H" 
        humidVal.textContent= cityData.current.humidity + " %"
        uviVal.textContent= cityData.current.uvi
    })
}

function fiveDayForecast(data) {
    console.log(data);
    for (var i = 6; i <=30; i+=6){
        // creating a card
        var weatherCard = document.createElement("div");
        var fiveDayData = document.createElement("ul");
        var iconData = document.createElement("li")
        var tempData = document.createElement("li");
        var windData = document.createElement("li");
        var humidData = document.createElement("li");
        var uviData = document.createElement("li");

        // add content to the card from the data 
        tempData.textContent = "Temprature: " + data.list[i].main.temp + " °C"
        windData.textContent = "Wind Speed: " + data.list[i].wind.speed+ " KM/H" 
        humidData.textContent = "Humidty: " + data.list[i].main.humidity + " %"
        uviData.textContent = "UV Index: " + data.list[i].main.uvi

        // append card to the div 
        var forecastContainer = document.querySelector(".forecastContainer");
        forecastContainer.append(weatherCard);
        weatherCard.append(fiveDayData);
        fiveDayData.appendChild(iconData);
        fiveDayData.appendChild(tempData);
        fiveDayData.appendChild(windData);
        fiveDayData.appendChild(humidData);
        fiveDayData.appendChild(uviData);
    }
};



locationEl.addEventListener("click", fetchWeather);