const apiKey = "b535a683c0803326fd8ff5ad2d4f8d90";
function getCoordinates(city) {
  const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.coord) {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        getCurrentWeather(latitude, longitude);
      } else {
        console.error("Unable to retrieve coordinates for the city.");
      }
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function getCurrentWeather(latitude, longitude) {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const cityName = data.city.name;
      const temperature = data.list[0].main.temp;
      const humidity = data.list[0].main.humidity;
      const windSpeed = data.list[0].wind.speed;
      const icon = data.list[0].weather[0].icon;

      document.getElementById("city-name").textContent = cityName;
      document.getElementById(
        "temperature"
      ).textContent = `Temperature: ${temperature}°C`;
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

document.getElementById("search-button").addEventListener("click", function () {
  const cityInput = document.getElementById("search-input").value;
  getCoordinates(cityInput);
});
