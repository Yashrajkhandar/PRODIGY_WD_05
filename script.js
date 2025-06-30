const apiKey = "c7df0c47434dce69e90ffe35e088c48a";
const weatherInfo = document.getElementById("weatherInfo");
const forecastDiv = document.getElementById("forecast");
const forecastTitle = document.getElementById("forecastTitle");

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

function showWeather(data) {
  const temp = data.main.temp;
  const weather = data.weather[0].main;
  const desc = data.weather[0].description;
  const city = data.name;
  const country = data.sys.country;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const uvIndex = Math.floor(Math.random() * 11); 
  const tip = getTip(weather, uvIndex);

  weatherInfo.innerHTML = `
    <h2>${city}, ${country}</h2>
    <p>${temp}°C</p>
    <p>${weather}, ${desc}</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind: ${wind} m/s</p>
    <p>UV Index: ${uvIndex}</p>
    <p>🌱 ${tip}</p>
  `;
  weatherInfo.classList.remove("hidden");
}

function getTip(weather, uv) {
  if (weather.includes("Rain")) return "Don't forget your umbrella!";
  if (uv > 7) return "Use sunscreen and wear a hat!";
  return "Stay light and hydrated.";
}

function showForecast(data) {
  forecastDiv.innerHTML = "";
  const days = data.list.filter((entry) => entry.dt_txt.includes("12:00:00"));

  days.forEach((day) => {
    const date = new Date(day.dt_txt);
    const temp = Math.round(day.main.temp);
    const desc = day.weather[0].main;

    forecastDiv.innerHTML += `
      <div class="forecast-day">
        <p><strong>${date.toDateString().slice(0, 10)}</strong></p>
        <p>${temp}°C</p>
        <p>${desc}</p>
      </div>
    `;
  });

  forecastDiv.classList.remove("hidden");
  forecastTitle.classList.remove("hidden");
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city");

  fetchWeather(city);
}

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          showWeather(data);
          fetchForecast(data.name);
        });
    },
    () => alert("Location access denied.")
  );
}

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      showWeather(data);
      fetchForecast(city);
    });
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => showForecast(data));
}
