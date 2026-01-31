// API Configuration - Using a working free API key
const API_KEY = '8ac5c4d57ba6a4b3dfcf622700447b1e';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Global function for quick search buttons (called from HTML onclick)
function quickSearch(city) {
    console.log('Quick search clicked:', city);
    document.getElementById('cityInput').value = city;
    searchWeather();
}

// Main search function
function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    console.log('Search triggered for:', city);
    
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    getWeatherData(city);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - initializing weather app');
    
    // Get DOM elements
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    
    // Check if elements exist
    if (!searchBtn) {
        console.error('Search button not found!');
        return;
    }
    
    if (!cityInput) {
        console.error('City input not found!');
        return;
    }
    
    console.log('Elements found successfully');
    
    // Add click event to search button
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Search button clicked');
        searchWeather();
    });
    
    // Add Enter key event
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            console.log('Enter key pressed');
            searchWeather();
        }
    });
    
    // Load default city
    console.log('Loading default city: Delhi');
    getWeatherData('Delhi');
});

// Fetch weather data from API
async function getWeatherData(city) {
    console.log('Fetching weather for:', city);
    
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');
    const weatherCard = document.getElementById('weatherCard');
    
    try {
        // Show loader
        if (loader) loader.classList.add('show');
        if (errorMessage) errorMessage.classList.remove('show');
        if (weatherCard) weatherCard.classList.remove('show');
        
        // Build API URL
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        console.log('Fetching from:', url);
        
        // Fetch data
        const response = await fetch(url);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('API Error:', errorData);
            
            if (response.status === 404) {
                throw new Error('City not found. Please check spelling and try again.');
            } else if (response.status === 401) {
                throw new Error('API authentication failed. Please check API key.');
            } else {
                throw new Error(`Error: ${errorData.message || 'Unable to fetch weather data'}`);
            }
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        
        // Hide loader
        if (loader) loader.classList.remove('show');
        
        // Display data
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error in getWeatherData:', error);
        if (loader) loader.classList.remove('show');
        showError(error.message);
    }
}

// Display weather data
function displayWeatherData(data) {
    console.log('Displaying weather data for:', data.name);
    
    try {
        // Update city info
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('country').textContent = data.sys.country;
        
        // Update temperature
        document.getElementById('temp').textContent = Math.round(data.main.temp);
        document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
        
        // Update weather description and icon
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        const weatherIcon = document.getElementById('weatherIcon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        weatherIcon.alt = data.weather[0].description;
        
        // Update details
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('cloudiness').textContent = `${data.clouds.all}%`;
        
        // Update timestamp
        const now = new Date();
        document.getElementById('lastUpdated').textContent = `Last updated: ${now.toLocaleString()}`;
        
        // Change background based on weather
        updateBackground(data.weather[0].main);
        
        // Show weather card
        document.getElementById('weatherCard').classList.add('show');
        
        console.log('Weather data displayed successfully');
        
    } catch (error) {
        console.error('Error displaying weather data:', error);
        showError('Error displaying weather information');
    }
}

// Update background color based on weather
function updateBackground(condition) {
    const body = document.body;
    
    switch(condition.toLowerCase()) {
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
        case 'fog':
        case 'haze':
            body.style.background = 'linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)';
            break;
        default:
            body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

// Show error message
function showError(message) {
    console.log('Showing error:', message);
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.classList.add('show');
        
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 5000);
    }
}
