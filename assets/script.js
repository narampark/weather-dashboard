const apiKey = "b535a683c0803326fd8ff5ad2d4f8d90";
function getCoordinates(city) {
  const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.coord) {
        const latitude = data.coord.lat;
        const longitude = data.coord.lon;
        // Use latitude and longitude as needed in your application
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      } else {
        console.error("Unable to retrieve coordinates for the city.");
      }
    })

    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.getElementById("search-button").addEventListener("click", function () {
  const cityInput = document.getElementById("search-input").value;
  getCoordinates(cityInput);
});
