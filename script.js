// OpenWeatherMap API Configuration
// IMPORTANT: Get your own free API key from https://openweathermap.org/api
const API_KEY = 'f56f24967aaf51182d1d4f79f0e37186'; // Updated working API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loader = document.getElementById('loader');
const weatherCard = document.getElementById('weatherCard');

// Weather Display Elements
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const weatherDescription = document.getElementById('weatherDescription');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const feelsLike = document.getElementById('feelsLike');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const cloudiness = document.getElementById('cloudiness');
const lastUpdated = document.getElementById('lastUpdated');

// Quick City Buttons
const cityButtons = document.querySelectorAll('.city-btn');

// Initialize app with default city
window.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    getWeatherData('Delhi');
});

// Search button click event
searchBtn.addEventListener('click', () => {
    console.log('Search button clicked');
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        showError('Please enter a city name');
    }
});

// Enter key press event
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        console.log('Enter key pressed');
        const city = cityInput.value.trim();
        if (city) {
            getWeatherData(city);
        } else {
            showError('Please enter a city name');
        }
    }
});

// Quick city buttons
cityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const city = button.getAttribute('data-city');
        console.log('Quick city clicked:', city);
        cityInput.value = city;
        getWeatherData(city);
    });
});

// Main function to fetch weather data
async function getWeatherData(city) {
    console.log('Fetching weather for:', city);
    
    try {
        // Show loader and hide error/weather card
        showLoader();
        hideError();
        hideWeatherCard();

        // Construct API URL
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        console.log('API URL:', url);

        // Fetch data from API
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        // Check if response is ok
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key error. Please get a new key from openweathermap.org');
            } else if (response.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            } else {
                throw new Error(`Error ${response.status}: Unable to fetch weather data.`);
            }
        }

        const data = await response.json();
        console.log('Weather data received:', data);
        
        // Hide loader and display weather
        hideLoader();
        displayWeatherData(data);

    } catch (error) {
        hideLoader();
        showError(error.message);
        console.error('Error fetching weather data:', error);
    }
}

// Display weather data on UI
function displayWeatherData(data) {
    console.log('Displaying weather data');
    
    // City and Country
    cityName.textContent = data.name;
    country.textContent = data.sys.country;

    // Temperature (Already in Celsius because we used units=metric)
    const temperature = Math.round(data.main.temp);
    temp.textContent = temperature;

    // Feels Like Temperature
    const feelsLikeTemp = Math.round(data.main.feels_like);
    feelsLike.textContent = `${feelsLikeTemp}°C`;

    // Weather Description and Icon
    weatherDescription.textContent = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Humidity
    humidity.textContent = `${data.main.humidity}%`;

    // Wind Speed (convert m/s to km/h)
    const windSpeedKmh = Math.round(data.wind.speed * 3.6);
    windSpeed.textContent = `${windSpeedKmh} km/h`;

    // Pressure
    pressure.textContent = `${data.main.pressure} hPa`;

    // Visibility (convert meters to kilometers)
    const visibilityKm = (data.visibility / 1000).toFixed(1);
    visibility.textContent = `${visibilityKm} km`;

    // Cloudiness
    cloudiness.textContent = `${data.clouds.all}%`;

    // Last Updated Time
    const currentTime = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    lastUpdated.textContent = `Last updated: ${currentTime}`;

    // Change background based on weather condition
    updateBackgroundByWeather(data.weather[0].main);

    // Show weather card
    showWeatherCard();
}

// Update background gradient based on weather condition
function updateBackgroundByWeather(weatherCondition) {
    const body = document.body;
    
    switch(weatherCondition.toLowerCase()) {
        case 'clear':
            body.style.background = 'linear-gradient(135deg, #FDB99B 0%, #CF8BF3 100%)';
            break;
        case 'clouds':
            body.style.background = 'linear-gradient(135deg, #A8BFDB 0%, #7C98B3 100%)';
            break;
        case 'rain':
        case 'drizzle':
            body.style.background = 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)';
            break;
        case 'thunderstorm':
            body.style.background = 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
            break;
        case 'snow':
            body.style.background = 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)';
            break;
        case 'mist':
        case 'smoke':
        case 'haze':
        case 'fog':
            body.style.background = 'linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)';
            break;
        default:
            body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// Show loader
function showLoader() {
    loader.classList.add('show');
}

// Hide loader
function hideLoader() {
    loader.classList.remove('show');
}

// Show weather card
function showWeatherCard() {
    weatherCard.classList.add('show');
}

// Hide weather card
function hideWeatherCard() {
    weatherCard.classList.remove('show');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}
