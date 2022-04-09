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

// Gets city info from API
function getCityInfo (somevariable) {
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    
    return cityInfo;
}

// Processes city info
function processCityInfo (city) {
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
    // Data includes a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

}

// Display city info
function displayCityInfo () {
// City result displays current and future conditions

}

function uvIndex () {
    // UV Index can be further extrapolated to:
    // to be presented with a color that indicates whether the conditions are favorable, moderate, or severe
}
// City is added to a search history array
var searchHistroyArray = [];
// Need to be saved locally
// Cities in search history can be selected.
// Once selected the same info can be viewed again.
// Consider a delete button for search history

// Current weather
function currentWeather () {
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

}

// Future weather
function futureWeater () {
// Be able to further extrapolate on future weather conditions
// Data includes a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
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
        searchHistroyArray = storedEventData;
    }
}

// Initiates base app
function init () {
    // Sets header date
    headerDate();

    // loads data from storage
    loadData();
    
    // Displays list of data from storage


}
init();