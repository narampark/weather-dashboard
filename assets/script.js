const apiKey = "b535a683c0803326fd8ff5ad2d4f8d90";
function getCoordinates(city) {
  const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.coord) {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        getCurrentWeather(latitude, longitude);
        getFutureForecast(latitude, longitude);
      }
    });
}

function getCurrentWeather(latitude, longitude) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const cityName = data.name;
      const temperatureCelsius = data.main.temp - 273.15;
      const temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const icon = data.weather[0].icon;

      const currentDate = new Date();
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

function getFutureForecast(latitude, longitude) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
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

function saveToSearchHistory(city) {
  let searchHistory = localStorage.getItem("searchHistory") || [];
  if (!Array.isArray(searchHistory)) {
    searchHistory = JSON.parse(searchHistory);
  }
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}

function populateSearchHistory() {
  const searchHistory = localStorage.getItem("searchHistory");
  const cityHistoryDropdown = document.getElementById("city-history");

  if (searchHistory) {
    const searchHistoryArray = JSON.parse(searchHistory);
    cityHistoryDropdown.innerHTML = "";
    searchHistoryArray.forEach((city) => {
      const option = document.createElement("option");
      option.text = city;
      option.value = city;
      cityHistoryDropdown.add(option);
    });
  }
}

document.getElementById("search-button").addEventListener("click", function () {
  const cityInput = document.getElementById("search-input").value;
  getCoordinates(cityInput);
  saveToSearchHistory(cityInput);
  populateSearchHistory();
});

populateSearchHistory();

document.getElementById("city-history").addEventListener("change", function () {
  const selectedCity = this.value;
  if (selectedCity) {
    document.getElementById("search-input").value = selectedCity;
    getCoordinates(selectedCity);
  }
});
