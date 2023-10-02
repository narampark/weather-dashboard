// API key for the openweathermap API
const apiKey = "b535a683c0803326fd8ff5ad2d4f8d90";
// function to get the latitude and longitude of the users city search
function getCoordinates(city) {
  const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  // fetches the geocoding data
  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.coord) {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        // passing the coordinates to the current weather and future forecast functions
        getCurrentWeather(latitude, longitude);
        getFutureForecast(latitude, longitude);
      }
    });
}
// function to get the current weather data
function getCurrentWeather(latitude, longitude) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      // extracts the data from the API
      const cityName = data.name;
      const temperatureCelsius = data.main.temp - 273.15;
      const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const icon = data.weather[0].icon;
      // gets the current date to be displayed
      const currentDate = new Date();
      // dynamically updates the HTML with the current weather data obtained from the API
      document.getElementById(
        "date"
      ).textContent = `Date: ${currentDate.toLocaleString()}`;
      document.getElementById("city-name").textContent = cityName;
      document.getElementById(
        "temperature"
      ).textContent = `Temperature: ${temperatureFahrenheit.toFixed(
        2
      )}°F (${temperatureCelsius.toFixed(2)}°C)`;
      document.getElementById(
        "humidity"
      ).textContent = `Humidity: ${humidity}%`;
      document.getElementById(
        "wind-speed"
      ).textContent = `Wind Speed: ${windSpeed} m/s`;
      document.getElementById(
        "weather-icon"
      ).src = `https://openweathermap.org/img/wn/${icon}.png`;
    });
}
// function to get the future forecast data
function getFutureForecast(latitude, longitude) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      // goes through the loop for the 5 days of forecast needed
      for (let i = 0; i < 5; i++) {
        const forecast = data.list[i * 8];
        const dateElement = document.querySelector(`.date-${i + 1}`);
        const temperatureElement = document.querySelector(
          `.temperature-${i + 1}`
        );
        const humidityElement = document.querySelector(`.humidity-${i + 1}`);
        const windSpeedElement = document.querySelector(`.wind-speed-${i + 1}`);
        const iconElement = document.querySelector(`.w-icon-${i + 1}`);

        const forecastDate = new Date(forecast.dt * 1000);
        const temperatureCelsius = forecast.main.temp - 273.15;
        const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
        // dynamically updates the HTML with the future forecast data obtained from the API
        dateElement.textContent = forecastDate.toDateString();
        temperatureElement.textContent = `Temperature: ${temperatureFahrenheit.toFixed(
          2
        )}°F (${temperatureCelsius.toFixed(2)}°C)`;
        humidityElement.textContent = `Humidity: ${forecast.main.humidity}%`;
        windSpeedElement.textContent = `Wind Speed: ${forecast.wind.speed} m/s`;
        iconElement.src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      }
    });
}
// function to store the search history in the local storage
function saveToSearchHistory(city) {
  let searchHistory = localStorage.getItem("searchHistory") || [];
  // change stored search history into an array
  if (!Array.isArray(searchHistory)) {
    searchHistory = JSON.parse(searchHistory);
  }
  // saves the searched city into the search history
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}
// function to populate the search history into the dropdown bar
function populateSearchHistory() {
  const searchHistory = localStorage.getItem("searchHistory");
  const cityHistoryDropdown = document.getElementById("city-history");

  if (searchHistory) {
    const searchHistoryArray = JSON.parse(searchHistory);
    cityHistoryDropdown.innerHTML = "";
    // adds each city into the dropdown
    searchHistoryArray.forEach((city) => {
      const option = document.createElement("option");
      option.text = city;
      option.value = city;
      cityHistoryDropdown.add(option);
    });
  }
}
// event listener for the search button
document.getElementById("search-button").addEventListener("click", function () {
  const cityInput = document.getElementById("search-input").value;
  getCoordinates(cityInput);
  saveToSearchHistory(cityInput);
  populateSearchHistory();
});
// calling the function to populate the search history dropbar
populateSearchHistory();
// event listener for when the user clicks on a city from the dropbar
document.getElementById("city-history").addEventListener("change", function () {
  const selectedCity = this.value;
  if (selectedCity) {
    document.getElementById("search-input").value = selectedCity;
    getCoordinates(selectedCity);
  }
});
