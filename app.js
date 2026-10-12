const cityName = document.querySelector("#cityName");
const cityInput =document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const tem = document.querySelector("#tem");
const description =document.querySelector("#description");
const countryName = document.querySelector("#countryName");
const feelsLikePara = document.querySelector("#feelsLike");
const humidityy =document.querySelector("#humidity");
const status = document.querySelector("#status");
const windSpeedPara = document.querySelector("#windSpeed");

console.log(status);
searchBtn.addEventListener("click" ,async () => {
    
    const city = cityInput.value.trim();
    
    if(cityInput.value.trim()===""){
        alert("Please enter a city name!");
        return;
    }
    status.innerText = "Loading weather...";
    searchBtn.disabled = true;
    try {
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const response = await fetch(geoURL);
        if (!response.ok) {
        throw new Error("Failed to fetch city data");
    }
    const data = await response.json();
    console.log(data);

    if (!data.results || data.results.length === 0) {
        alert("City not found. Please try another city.");
        status.innerText = "";
        return;
    }

    const latitude = data.results[0].latitude;
    const longitude = data.results[0].longitude;
    const country = data.results[0].country;
    console.log("Country:", country);
    
    const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;

    const weatherResponse = await fetch(weatherURL);
    if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
    }
    const weatherData = await weatherResponse.json();

    console.log("Weather data:", weatherData);
        
    const temperature = weatherData.current.temperature_2m;
    const humidity = weatherData.current.relative_humidity_2m;
    const feelsLike = weatherData.current.apparent_temperature;
    const windSpeed = weatherData.current.wind_speed_10m;

    feelsLikePara.innerText = `Feels like: ${feelsLike}°C`;
    humidityy.innerText= `Humiditiy: ${humidity}%`;
    windSpeedPara.innerText= `Wind speed: ${windSpeed}km/h`;
    console.log("Humidity:",humidity);
    console.log("Feels like:", feelsLike);
    console.log("Wind speed is:",windSpeed);



    console.log("Temperature:", temperature);
    tem.innerText = `Temperature: ${temperature}°C`;    
        
    const weatherCode = weatherData.current.weather_code;

    const weatherConditions = {
        0: "Clear sky ☀️",
        1: "Mainly clear 🌤️",
        2: "Partly cloudy ⛅",
        3: "Overcast ☁️",
        45: "Fog 🌫️",
        48: "Fog 🌫️",
        51: "Light drizzle 🌦️",
        61: "Rain 🌧️",
        71: "Snow ❄️",
        95: "Thunderstorm ⛈️"
    };

    description.innerText = weatherConditions[weatherCode] || "Weather condition unavailable";
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    console.log(cityInput.value);
    // cityName.innerText=cityInput.value;
    cityName.innerText = city;
    countryName.innerText = country;
    status.innerText = "";

    } catch (error) {
        console.log("Error:", error);
        status.innerText = "";
        alert("Unable to fetch weather. Please try again.");
    } 
    finally {
        searchBtn.disabled = false;
    }
}); 
cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});