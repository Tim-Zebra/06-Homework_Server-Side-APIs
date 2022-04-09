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

// Be able to search for a city
// City is added to a search history
var searchHistroy = {};
// Need to be saved locally
// Cities in search history can be selected.
// Once selected the same info can be viewed again.
// Consider a delete button for search history
// City result displays current and future conditions

// Be able further extrapolate on current weather conditions from city to display:
// city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index

// UV Index can be further extrapolated to:
// to be presented with a color that indicates whether the conditions are favorable, moderate, or severe

// Be able to further extrapolate on future weather conditions
// Data includes a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// Initiates base app
function init () {
    // Sets header date
    headerDate();

    // loads data from storage

}
init();