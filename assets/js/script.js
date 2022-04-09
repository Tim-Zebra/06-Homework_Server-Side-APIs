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

var listHistory = document.getElementById('listHistory');
var openWeatherAPIKEY = '6aadb479841729c992f0f24e1ecee7b6';

// Requests longitude and latitude from API using search criteria
var cityLongitutde = 0; 
var cityLatitude = 0;

nameConverter ('Austin', 'TX', 'US');
function nameConverter (cityName, cityState, cityCountry) {
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    var limit = 1;
    var requestUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + ',' + cityState + ',' + cityCountry + '&limit=' + limit + '&appid=' + openWeatherAPIKEY;
    console.log('this happened convert');
    // Fetces lon and lat
    fetch(requestUrl)
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
        getCityInfoAPI();
    });
}

// Requests city info from API using longitutde and latitude
function getCityInfoAPI () {
    // city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

    var requestUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + cityLatitude + '&lon=' + cityLongitutde + '&appid=' + openWeatherAPIKEY;

    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        //looping over the fetch response and inserting the URL of your repos into a list
        console.log(data);  
        var listItem = document.createElement('li');
        
          //Set the text of the list element to the JSON response's .html_url property
          listItem.textContent = data.timezone;
            console.log(data.timezone);
          //Append the li element to the id associated with the ul element.
          listHistory.appendChild(listItem);
      });
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