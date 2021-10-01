// -------------------- Global Variables --------------------------------------
var forecastData;
var cityName = document.querySelector(".citySelected");
var locationEl = document.querySelector(".location");
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
var searchHistoryContainer = document.querySelector("#searchHistoryContainer")
var searchHistoryEl = document.querySelector(".searchHistory");
var searchHistoryData = [];
var cityDisplayed;

// -------------------- API key -----------------------------------------------
var apiKey = 'ee6bc0db0b2e0a0c46117b224a3ee840';
var fiveDayApi = 'https://api.openweathermap.org/data/2.5/forecast?q=';
var oneCallApi = 'https://api.openweathermap.org/data/2.5/onecall?lat=';

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

// run currentTime function at page reload and rerun every second
currentTime();
setInterval(function(){
    currentTime();
},1000);

// -------------------- Get Weather API -----------------------------------------
function fetchWeather(event) {
    event.preventDefault();
    // Get 5 day/ 3 hour forecast API, then run following functions 
    forecastData = fetch(`${fiveDayApi}${cityName.value}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then((data)=>{
        // Generate current weather
        weatherData(data, cityDisplayed);
        // Generate 4 day forescast
        fiveDayForecast(data);
    })

};

// Generates weather API from the Previous Search buttons
function fetchWeatherForHistory(event) {
    event.preventDefault();
    // Get 5 day/ 3 hour forecast API, then run following functions 
    var cityNameFromHistory = event.target.getAttribute("data-search");
    forecastData = fetch(`${fiveDayApi}${cityNameFromHistory}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then((data) => {
        weatherData(data, cityNameFromHistory);
        fiveDayForecast(data);
    })

};

function weatherData(data, cityDisplayed) {
    
    // If no city name is written in input or search button is pressed, stop the function
    if (cityDisplayed === ""){
        return "no city selected"
    };
    
    // Get current day(one call) forecast API
    var oneCall = fetch(`${oneCallApi}${data.city.coord.lat}&lon=${data.city.coord.lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then((cityData) =>{    
        // Retrieve Icon image from API
        var iconUrl = `https://openweathermap.org/img/w/${cityData.current.weather[0].icon}.png`;
        // Set attribute to attach to <img>
        iconVal.setAttribute("src", iconUrl);
        // Display content in vp
        cityPicked.textContent = cityDisplayed.toUpperCase();
        tempVal.textContent = cityData.current.temp + " °C"
        windVal.textContent = cityData.current.wind_speed + " KM/H" 
        humidVal.textContent = cityData.current.humidity + " %"
        var uvData = cityData.current.uvi
        // Assign correct UVI colour based on data
        getUviColour(uvData);
        uviVal.textContent = uvData
    });
};



// Assign a colour to uvIndex from data 
function getUviColour(uvData) {
    if (0 <= uvData && uvData < 2) {
        uviVal.setAttribute("class","low");
    } else if (2 <= uvData && uvData < 6) {
        uviVal.setAttribute("class","moderate");
    } else if (6 <= uvData && uvData < 7){
        uviVal.setAttribute("class","high");
    } else if (7 <= uvData && uvData < 11){
        uviVal.setAttribute("class","very-high");
    } else {
        uniVal.setAttribute("class","extreme");
    };
}

function fiveDayForecast(data) {
    //reset forecastContainer to empty string to clear out previous searches
    forecastContainer.innerHTML = "";
    for (var i = 0; i <40; i+=8){
        // Create a weather card for each day 
        var weatherCard = document.createElement("div");
        var fiveDayData = document.createElement("ul");
        var date = document.createElement("li");
        var iconData = document.createElement("li");
        var iconImg = document.createElement("img");
        var tempData = document.createElement("li");
        var windData = document.createElement("li");
        var humidData = document.createElement("li");

        // Retrieve weather data and assign to created elements
        var dateTimeInfo = data.list[i].dt_txt;
        dateInfo = dateTimeInfo.split(" ");
        date.textContent = "Date: " + dateInfo[0];
        var iconsUrl = `https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`
        iconImg.setAttribute("src", iconsUrl);
        tempData.textContent = "Temprature: " + data.list[i].main.temp + " °C"
        windData.textContent = "Wind Speed: " + data.list[i].wind.speed + " KM/H" 
        humidData.textContent = "Humidty: " + data.list[i].main.humidity + " %"

        // Append weather cards to the HTML div, display in vp 
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
function initSearchHistory() { 
searchHistoryData = JSON.parse(localStorage.getItem("history")) || [];
renderSearchHistory();
};

function renderSearchHistory() {
    // Ensures no double-ups occur when fetch weather functions are called more than once
    searchHistoryEl.innerHTML = "";

    // Create a button for each localStorage item
    for (var i = 0; i < searchHistoryData.length; i++) {
        var btn = document.createElement("button");
    
        // `data-search` allows access to city name when click handler is invoked
        btn.setAttribute("data-search", searchHistoryData[i]);
        btn.textContent = searchHistoryData[i];
        btn.setAttribute("class", "historyButton");
        searchHistoryEl.append(btn);
    };
};

function handleSearchHistoryClick(event) {
    var btn = event.target;
    // Identifies what search buttons have data-search element
    var search = btn.getAttribute("data-search");
    fetchCoords(search);
};

// -------------------- Event Listeners -----------------------------------------
locationEl.addEventListener("click", function(event){
    // When submit button is clicked:
    cityDisplayed = cityName.value;

    if (cityDisplayed === ""){
        alert("you must choose a city");
    } else {
        // Function only runs when city name is written in input
        fetchWeather(event);
        // Remove display-none classes on hidden sections
        CurrentWeather.removeAttribute("class", "d-none");
        fiveDayContainer.removeAttribute("class","d-none");
        searchHistoryContainer.removeAttribute("class","d-none");
        if(!searchHistoryData.includes(cityName.value) ){
            // Ensures no double ups occur in localStorage
            searchHistoryData.push(cityDisplayed);
        };
        localStorage.setItem("history", JSON.stringify(searchHistoryData));
        renderSearchHistory();
    }
});

searchHistoryEl.addEventListener("click", function(event){
    // Remove display-none classes on hidden sections
    CurrentWeather.removeAttribute("class", "d-none");
    fiveDayContainer.removeAttribute("class","d-none");
    searchHistoryContainer.removeAttribute("class","d-none");
    // Access weather forecast from saved cities in local Storage
    fetchWeatherForHistory(event);
});

// Gets items from localStorage
initSearchHistory();