// OpenWeatherMap API Configuration
const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Free API key for demo purposes
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
    getWeatherData('Delhi');
});

// Search button click event
searchBtn.addEventListener('click', () => {
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
        cityInput.value = city;
        getWeatherData(city);
    });
});

// Main function to fetch weather data
async function getWeatherData(city) {
    try {
        // Show loader and hide error/weather card
        showLoader();
        hideError();
        hideWeatherCard();

        // Fetch data from API
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}`);
        
        // Check if response is ok
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API key error. Please check the configuration.');
            } else {
                throw new Error('Unable to fetch weather data. Please try again later.');
            }
        }

        const data = await response.json();
        
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
    // City and Country
    cityName.textContent = data.name;
    country.textContent = data.sys.country;

    // Temperature (Convert from Kelvin to Celsius)
    const temperature = Math.round(data.main.temp - 273.15);
    temp.textContent = temperature;

    // Feels Like Temperature
    const feelsLikeTemp = Math.round(data.main.feels_like - 273.15);
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

// Additional utility: Get user's location and show weather (optional enhancement)
function getUserLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoordinates(lat, lon);
            },
            (error) => {
                console.log('Location access denied:', error);
                // Fallback to default city
                getWeatherData('Delhi');
            }
        );
    } else {
        console.log('Geolocation not supported');
        getWeatherData('Delhi');
    }
}

// Fetch weather by coordinates
async function getWeatherByCoordinates(lat, lon) {
    try {
        showLoader();
        hideError();
        hideWeatherCard();

        const response = await fetch(`${API_URL}?l
