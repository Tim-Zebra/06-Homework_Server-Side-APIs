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
var searchHistroyArray = [];

// Requests longitude and latitude from API using search criteria
var cityLongitutde = 0; 
var cityLatitude = 0;

var aside = $('aside');
var weatherFormEl = $('#weatherForm');
var cityInputEl = $('#cityInput');
var stateInputEl = $('#stateInput');
var countryInputEl = $('#countryInput');
var listHistory = $('#listHistory');
var currentWeatherEl = $('#weatherCurrent');
var futureWeatherEl = $('#weatherFuture');
var currentCityName = '';

// Get Data from user input. Save data from user input into search history
function getUserInput (event) {
    event.preventDefault();

    var search = {};
    // Catches if no city input, then do nothing
    if (cityInputEl.val() !== '') {
        // Stores user search as an object
        search.city = cityInputEl.val().toLowerCase();
        search.state = stateInputEl.val().toUpperCase();
        search.country = countryInputEl.val().toUpperCase();

        // Capitalizes first letter of city
        var arr = search.city.split('');
        arr[0] = arr[0].toUpperCase();
        search.city = arr.join('');

        // Sets global city name;
        currentCityName = search.city;

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

        // Sets global variable of current city
        currentCityName = element.textContent;

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
        saveData();

        renderAPI(cityName, cityState, cityCountry);
    }
    // Clears search history list
    if (element.matches('button') === true) {
        searchHistroyArray = [];
        listHistory.empty();
        saveData();
    }
}

aside.on("click", searchByHistory);
// Render's API info - Forces async functions to sync *Must be labeled an a sync function with an async action such as fetch*
async function renderAPI (cityName, cityState, cityCountry) {
    // Async functions
    await nameConverter (cityName, cityState, cityCountry);
    await getCityInfoAPI();

    // Then these functions that need to sync occur.
    processCityWeather();
    displayCityInfo();
    // Unhides weather boxes
    currentWeatherEl.removeClass('hidden');
    futureWeatherEl.removeClass('hidden');
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

// Displays city info for current and future
function displayCityInfo () {
    displayCurrentCityInfo();
    displayFutureCityInfo();
}

// Display current city info
function displayCurrentCityInfo () {
    // Emptys all child elements
    currentWeatherEl.empty();
    // Creates a header
    currentWeatherEl.append('<h2 class="col-12" id="currentWeatherHeader">Current Weather</h2>');
    // Obtains currentCity object values
    var cityName = currentCityName;
    var cityDate = currentCityInfo.date;
    var icon = currentCityInfo.icon;
    var temp = currentCityInfo.temp;
    var humidity = currentCityInfo.humidity;
    var wind = currentCityInfo.wind;
    var uvIndex = currentCityInfo.uv;

    // adds ordinal to date
    var month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(cityDate);
    var day = new Intl.DateTimeFormat('en-US', {day: 'numeric'}).format(cityDate);

    var lastNumber = day[day.length-1]
    if (lastNumber === 1) {
        day += 'st';
    }
    else if (lastNumber === 2) {
        day += 'nd';
    }
    else if (lastNumber === 4) {
        day += 'rd';
    }
    else {
        day += 'th';
    }

    cityDate = month + ' ' + day;

    // Creates elements based off values
    var cityMainEl = $('<div id="currentCityMain" class="row"></div>');
    var cityNameEl = $('<div class=""><h1 id="currentCityHeader">' + cityName + '</h1></div>');
    var cityDateEl = $('<div class=""><h2>' + cityDate + '</h2></div>');
    var iconEl = $('<div class=""><img src=' + icon + '></div>');
    // These elements need headers
    var citySubEl = $('<div id="currentCitySub" class="row"></div>');
    var tempEl = $('<div class=""><h4>' + 'Temperature: ' + '</h4>' + '<p>' + temp + '</p></div>');
    var humidityEl = $('<div class=""><h4>' + 'Humidity: ' + '</h4>' + '<p>' + humidity + '</p></div>');
    var windEl = $('<div class=""><h4>' + 'Wind Speed: ' + '</h4>' + '<p>' + wind + '</p></div>');

    // This element also needs additional paramenters
    var uvClass = '';
    var uvText = '';
    if (uvIndex <= 2) {
        uvClass = 'uv-low'
        uvText = ' Low';
    } else if (uvIndex <= 7) {
        uvClass = 'uv-mod';
        uvText = ' Moderate';
    }
    else {
        uvClass = 'uv-high';
        uvText = ' High';
    }
    var uvIndexEl = $('<div class=""><h4>' + 'UV Index: ' + '</h4>' + '<p>' + uvIndex + '<span class="' + uvClass + '">' + uvText + '</span></p></div>');

    // Appends elements
    var elementArr = [cityNameEl, iconEl, cityDateEl];
    for (var i = 0; i < elementArr.length; i++) {
        cityMainEl.append(elementArr[i]);
    }

    elementArr = [tempEl, humidityEl, windEl, uvIndexEl];
    for (var i = 0; i < elementArr.length; i++) {
        citySubEl.append(elementArr[i]);
    }

    currentWeatherEl.append(cityMainEl);
    currentWeatherEl.append(citySubEl);
}

// Display future city info
function displayFutureCityInfo () {
    // Emptys all child elements
    futureWeatherEl.empty();

    // Creates a header
    futureWeatherEl.append('<h2 id="futureWeatherHeader" class="col-12">5-Day Forecast</h2>');
    // Obtains FutureCityInfo object values
    for (var k = 1; k < Object.keys(futureCityInfo).length+1; k++)
    {
        var day = 'day' + k;
        var cityName = currentCityName;
        var cityDate = futureCityInfo[day].date;
        var icon = futureCityInfo[day].icon;
        var tempHigh = futureCityInfo[day].tempHigh;
        var tempLow = futureCityInfo[day].tempLow;
        var humidity = futureCityInfo[day].humidity;
        var wind = futureCityInfo[day].wind;
    
        // adds ordinal to date
        var month = new Intl.DateTimeFormat('en-US', {month: 'long'}).format(cityDate);
        var day = new Intl.DateTimeFormat('en-US', {day: 'numeric'}).format(cityDate);
    
        var lastNumber = day[day.length-1]
        if (lastNumber === 1) {
            day += 'st';
        }
        else if (lastNumber === 2) {
            day += 'nd';
        }
        else if (lastNumber === 4) {
            day += 'rd';
        }
        else {
            day += 'th';
        }
    
        cityDate = month + ' ' + day;
    
        // Creates elements based off values
        var cityMainEl = $('<div class="futureCityMain"></div>');
        var cityNameEl = $('<div><h2>' + cityName + '</h2></div>');
        var cityDateEl = $('<div><h3>' + cityDate + '</h3></div>');
        var iconEl = $('<div><img src=' + icon + '></div>');
        // These elements need headers
        var citySubEl = $('<div class="futureCitySub"></div>');
        var tempEl = $('<div><h4>' + 'Temperature: ' + '</h4>' + '<p>High: ' + tempHigh + '</p><p>Low: ' + tempLow + '</p></div>');
        var humidityEl = $('<div><h5>' + 'Humidity: ' + '</h5>' + '<p>' + humidity + '</p></div>');
        var windEl = $('<div><h5>' + 'Wind Speed: ' + '</h5>' + '<p>' + wind + '</p></div>');
    
        // Appends elements
        var elementArr = [cityNameEl, cityDateEl, iconEl];
        for (var i = 0; i < elementArr.length; i++) {
            cityMainEl.append(elementArr[i]);
        }
    
        elementArr = [tempEl, humidityEl, windEl];
        for (var i = 0; i < elementArr.length; i++) {
            citySubEl.append(elementArr[i]);
        }
    
        var futureCityEl = $('<div class="futureCityCard"></div>');
        futureCityEl.append(cityMainEl);
        futureCityEl.append(citySubEl);
    
        futureWeatherEl.append(futureCityEl);
        }
}

// Processes city weather
function processCityWeather () {
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
    currentCityInfo.temp = ((temp - 273.15) * (9 / 5) + 32).toFixed(0) + '\u00B0 F';

    // Humidity
    var humidity = rawCityInfo.current.humidity;
    currentCityInfo.humidity = humidity + '%';

    // Wind Speed in mph
    var wind = rawCityInfo.current.wind_speed;
    currentCityInfo.wind = (wind * (4600 / 1609.44)).toFixed(0) + ' mph';

    // UV Index
    var uv = rawCityInfo.current.uvi;
    currentCityInfo.uv = uv;
    console.log('currrent city info: ',currentCityInfo);
}

// Future weather
function processFutureWeather () {
// Start loop at 1 because 0 is current day's forecast.
    for (var k = 1; k < 6; k++) {
        // Creates day objects
        var day = 'day' + k;
        futureCityInfo[day] = {};

        // Converts unix date
        var date = new Date(rawCityInfo.daily[k].dt * 1000);
        futureCityInfo[day].date = date;

        // Icon image representing current weather. Uses API icon code
        var iconCode = rawCityInfo.daily[k].weather[0].icon;
        futureCityInfo[day].icon = 'http://openweathermap.org/img/w/' + iconCode + '.png';
        
        // Converts Kelvin to Fahrenheit and converts to nearest whole integer
        var tempHigh = rawCityInfo.daily[k].temp.max;
        futureCityInfo[day].tempHigh = ((tempHigh - 273.15) * (9 / 5) + 32).toFixed(0) + '\u00B0 F';
        console.log(tempHigh);
        var tempLow = rawCityInfo.daily[k].temp.min;
        futureCityInfo[day].tempLow = ((tempLow - 273.15) * (9 / 5) + 32).toFixed(0) + '\u00B0 F';

        // Humidity
        var humidity = rawCityInfo.daily[k].humidity;
        futureCityInfo[day].humidity = humidity + '%';
    
        // Wind Speed in mph
        var wind = rawCityInfo.daily[k].wind_speed;
        futureCityInfo[day].wind = (wind * (4600 / 1609.44)).toFixed(0) + ' mph';
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