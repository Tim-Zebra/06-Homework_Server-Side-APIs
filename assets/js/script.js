// Creates date dispalyed at top of page
function headerDate () {
    var date = moment().format('dddd MMMM Do YYYY, h:mm a');
    $('#date-and-time').text(date);
}

// Refresh Header Date and Time on 60 second Interval
var refresh = setInterval(function () {
    // Refreshes header date
    headerDate();
    }, 60000);


// Refresh the Time and Date. Get some autolocation?
// API https://openweathermap.org/api/one-call-api
var testing = document.getElementById('testing');
var openWeatherAPIKEY = '6aadb479841729c992f0f24e1ecee7b6';
var rawCityInfo = {};
var currentCityInfo = {};
var futureCityInfo = {};

// Requests longitude and latitude from API using search criteria
var cityLongitutde = 0; 
var cityLatitude = 0;

var aside = $('aside');
var weatherFormEl = $('#weatherForm');
var cityInputEl = $('#cityInput');
var stateInputEl = $('#stateInput');
var countryInputEl = $('#countryInput');
var listHistory = $('#listHistory');

// City is added to a search history array
var searchHistroyArray = [];
// Need to be saved locally
// Cities in search history can be selected.
// Once selected the same info can be viewed again.
// Consider a delete button for search history
// Get Data from user input. Save data from user input into search history
function getUserInput (event) {
    event.preventDefault();

    var search = {};
    // Catches if no city input, then do nothing
    if (cityInputEl.val() !== '') {
        // Stores user search as an object
        search.city = cityInputEl.val();
        search.state = stateInputEl.val();
        search.country = countryInputEl.val();
    
        // Object saved into search history array
        searchHistroyArray.unshift(search);
        saveData ();

        // Search rendered into Li
        var liEl = $("<li>" + search.city + "</li>");
        liEl.attr('data-state', search.state);
        liEl.attr('data-country', search.country);
        listHistory.prepend(liEl);

        console.log(searchHistroyArray);
        renderAPI (search.city, search.state, search.country);
    }

    cityInputEl.val('');
    stateInputEl.val('');
    countryInputEl.val('');


}

weatherFormEl.on('submit', getUserInput);

// Get Data from Search History Li Element
function searchByHistory (event) {
    event.preventDefault();
    var element = event.target;
    if (element.matches("li") === true) {
        var cityName = element.textContent;
        var cityState = element.getAttribute("data-state");
        var cityCountry = element.getAttribute("data-country");

        // Adds search history to list
        var liEl = $("<li>" + cityName + "</li>");
        liEl.attr('data-state', cityState);
        liEl.attr('data-country', cityCountry);
        listHistory.prepend(liEl);

        // Saves history list
        var search = {};
        search.city = cityName;
        search.state = cityState;
        search.country = cityCountry;
    
        // Object saved into search history array
        searchHistroyArray.unshift(search);
        saveData ();

        renderAPI(cityName, cityState, cityCountry);
    }
}

aside.on("click", searchByHistory);
// Render's API info - Forces async functions to sync *Must be labeled an a sync function with an async action such as fetch*
async function renderAPI (cityName, cityState, cityCountry) {
    // Async functions
    await nameConverter (cityName, cityState, cityCountry);
    await getCityInfoAPI();


    // Then these functions that need to sync occur.
    processCurrentWeather();
    processFutureWeather();
    console.log('Raw info: ', rawCityInfo);
}   

async function nameConverter (cityName, cityState, cityCountry) {
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // creates the query string
    var queryString = '';
    queryString += (cityName);
    if (cityState !== '') {
        queryString += (',' + cityState);
    }
    if (cityCountry !== '') {
        queryString += (',' + cityCountry);
    }

    var limit = 1;
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + queryString + '&limit=' + limit + '&appid=' + openWeatherAPIKEY;
    console.log(requestUrl);
    // Fetces lon and lat
    await fetch(requestUrl, {
        credentials: 'same-origin'
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
        //looping over the fetch response. For now the array is only 1 item, but can be scaled in the future.
        // assigns the longitude and latitude for the city
        for (var i = 0; i < data.length; i++) { 
            cityLongitutde = data[i].lon;
            cityLatitude = data[i].lat;
        }        
    });
}

// Requests city info from API using longitutde and latitude and stores it into the current city object
async function getCityInfoAPI () {
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLatitude + '&lon=' + cityLongitutde + '&appid=' + openWeatherAPIKEY;
    await fetch(requestUrl, {
        credentials: 'same-origin'
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        rawCityInfo = data;
    });
}

// Display city info
function displayCityInfo () {
// City result displays current and future conditions

}
function uvIndex () {
    // UV Index can be further extrapolated to:
    // to be presented with a color that indicates whether the conditions are favorable, moderate, or severe
}



// Processes city info
function processCityInfo () {
    processCurrentWeather();
    processFutureWeather();
}

// Current weather
function processCurrentWeather () {
    // Converts unix date
    var date = new Date(rawCityInfo.current.dt * 1000);
    currentCityInfo.date = date;

    // Icon image representing current weather. Uses API icon code
    var iconCode = rawCityInfo.current.weather[0].icon;
    currentCityInfo.icon = 'http://openweathermap.org/img/w/' + iconCode + '.png';
    
    // Converts Kelvin to Fahrenheit and converts to nearest whole integer
    var temp = rawCityInfo.current.temp;
    currentCityInfo.temp = ((temp - 273.15) * (9 / 5) + 32).toFixed(0) + ' F';

    // Humidity
    var humidity = rawCityInfo.current.humidity;
    currentCityInfo.humidity = humidity + '%';

    // Wind Speed in mph
    var wind = rawCityInfo.current.wind_speed;
    currentCityInfo.wind = (wind * (3600 / 1609.34)).toFixed(0);;

    // UV Index
    var uv = rawCityInfo.current.uvi;
    currentCityInfo.uv = uv;
    console.log('currrent city info: ',currentCityInfo);
}

// Future weather
function processFutureWeather () {
// Start loop at 1 because 0 is current forecast.
    for (var k = 1; k < 6; k++) {
        // Creates day objects
        var day = 'day' + k;
        futureCityInfo[day] = {};

        // Converts unix date
        var date = new Date(rawCityInfo.daily[k].dt * 1000);
        futureCityInfo[day].date = date;

        // Icon image representing current weather. Uses API icon code
        var iconCode = rawCityInfo.current.weather[0].icon;
        futureCityInfo[day].icon = 'http://openweathermap.org/img/w/' + iconCode + '.png';
        
        // Converts Kelvin to Fahrenheit and converts to nearest whole integer
        var temp = rawCityInfo.current.temp;
        futureCityInfo[day].temp = ((temp - 273.15) * (9 / 5) + 32).toFixed(0) + ' F';
    
        // Humidity
        var humidity = rawCityInfo.current.humidity;
        futureCityInfo[day].humidity = humidity + '%';
    
        // Wind Speed in mph
        var wind = rawCityInfo.current.wind_speed;
        futureCityInfo[day].wind = (wind * (3600 / 1609.34)).toFixed(0);;
    }

console.log('future city info: ', futureCityInfo);
}

// Save data locally from input
function saveData () {
    // Stores new data into the object
    localStorage.setItem("citySearches", JSON.stringify(searchHistroyArray));
}

// loads local data if present
function loadData () {
    // Stores new data into the object
    var storedCityData = JSON.parse(localStorage.getItem("citySearches"));
    if (storedCityData !== null) {
        searchHistroyArray = storedCityData;
    }
}

// Displays search history
function displaySearchHistory () {
    for (var k = 0; k < searchHistroyArray.length; k++) {
        var liEl = $("<li>" + searchHistroyArray[k].city + "</li>");
        liEl.attr('data-state', searchHistroyArray[k].state);
        liEl.attr('data-country', searchHistroyArray[k].country);
        listHistory.append(liEl);
    }
}

// Initiates base app
function init () {
    // Sets header date
    headerDate();

    // loads data from storage
    loadData();

    // Displays list of data from storage
    displaySearchHistory();
}
init();