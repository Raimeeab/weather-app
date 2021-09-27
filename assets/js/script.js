// -------------------- Global Variables --------------------------------------
var forecastData;
var cityName = document.querySelector(".citySelected");
var locationEl = document.querySelector(".location");
var locationEl2 = document.querySelector(".location2");
var iconVal = document.querySelector("#icon");
var tempVal = document.querySelector("#temp");
var windVal = document.querySelector("#windsp");
var humidVal = document.querySelector("#humid");
var uviVal = document.querySelector("#uvi");
var cityPicked = document.querySelector("#cityPicked");
var mainSearch = document.querySelector("#main-search");
var CurrentWeather = document.querySelector("#currentWeather")
var fiveDayContainer = document.querySelector("#fiveDayContainer");
var forecastContainer = document.querySelector(".forecastContainer");
var cityDisplayed;
var searchHistory = document.querySelector(".searchHistory");

// -------------------- API key -----------------------------------------------
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

// -------------------- Get Weather API -----------------------------------------
function fetchWeather(event) {
    event.preventDefault();
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
        iconVal.setAttribute("src", iconUrl);
        cityDisplayed = cityName.value
        cityPicked.textContent = cityDisplayed.toUpperCase();
        tempVal.textContent= cityData.current.temp + " °C"
        windVal.textContent= cityData.current.wind_speed + " KM/H" 
        humidVal.textContent= cityData.current.humidity + " %"
        uviVal.textContent= cityData.current.uvi
    })
}

function fiveDayForecast(data) {
    console.log(data);
    //reset forecastContainer to empty string to clear out previous searches
    forecastContainer.innerHTML = "";
    for (var i = 8; i <=40; i+=8){
        // create a weather card for each day 
        var weatherCard = document.createElement("div");
        var fiveDayData = document.createElement("ul");
        var date = document.createElement("li");
        var iconData = document.createElement("li");
        var iconImg = document.createElement("img");
        var tempData = document.createElement("li");
        var windData = document.createElement("li");
        var humidData = document.createElement("li");

        // retrieve weather data and assign to created elements
        var dateTimeInfo = data.list[i].dt_txt;
        console.log(typeof data.list[i].dt_txt);
        dateInfo = dateTimeInfo.split();
        console.log(dateInfo);

        date.textContent = "Date: " + dateInfo[0];
        var iconsUrl = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`
        iconImg.setAttribute("src", iconsUrl);
        tempData.textContent = "Temprature: " + data.list[i].main.temp + " °C"
        windData.textContent = "Wind Speed: " + data.list[i].wind.speed + " KM/H" 
        humidData.textContent = "Humidty: " + data.list[i].main.humidity + " %"

        // append weather cards to the HTML div 
        forecastContainer.append(weatherCard);
        iconData.appendChild(iconImg);
        weatherCard.append(fiveDayData);
        fiveDayData.appendChild(date);
        fiveDayData.appendChild(iconData);
        fiveDayData.appendChild(tempData);
        fiveDayData.appendChild(windData);
        fiveDayData.appendChild(humidData);
    }
};
// -------------------- Local Storage ------------------------------------------
function searchHistory() {
    // create elements to store user search history
    for( var i = 0; i<10; i++){
        
    }


};

// -------------------- Event Listener -----------------------------------------
locationEl.addEventListener("click", function(event){
    cityDisplayed = cityName.value;
    if (cityDisplayed === ""){
        alert("you must choose a city");
    } else {
        fetchWeather(event);
        CurrentWeather.removeAttribute("class", "d-none");
        fiveDayContainer.removeAttribute("class","d-none");

    }
});