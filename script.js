// API Configuration
const API_KEY = '8ac5c4d57ba6a4b3dfcf622700447b1e';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Global function for quick search buttons
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
    console.log('Weather App Ready');
    
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    
    if (!searchBtn || !cityInput) {
        console.error('Required elements not found!');
        return;
    }
    
    console.log('Elements initialized successfully');
    
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
    
    // Show home screen on load
    console.log('Home screen ready');
});

// Fetch weather data from API
async function getWeatherData(city) {
    console.log('Fetching weather for:', city);
    
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('errorMessage');
    const weatherCard = document.getElementById('weatherCard');
    const homeScreen = document.getElementById('homeScreen');
    
    try {
        // Show loader, hide everything else
        if (loader) loader.classList.add('show');
        if (errorMessage) errorMessage.classList.remove('show');
        if (weatherCard) weatherCard.classList.remove('show');
        if (homeScreen) homeScreen.classList.remove('show');
        
        // Build API URL
        const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        console.log('Fetching from API...');
        
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
        
        // Display data with animation
        displayWeatherData(data);
        
    } catch (error) {
        console.error('Error in getWeatherData:', error);
        if (loader) loader.classList.remove('show');
        if (homeScreen) homeScreen.classList.add('show');
        showError(error.message);
    }
}

// Display weather data with animations
function displayWeatherData(data) {
    console.log('Displaying weather data for:', data.name);
    
    try {
        // Update city info
        document.getElementById('cityName').textContent = data.name;
        document.getElementById('country').textContent = data.sys.country;
        
        // Update temperature with animation
        const tempValue = Math.round(data.main.temp);
        animateNumber('temp', 0, tempValue, 1000);
        
        // Update feels like
        const feelsLikeTemp = Math.round(data.main.feels_like);
        document.getElementById('feelsLike').textContent = `${feelsLikeTemp}°C`;
        
        // Update weather description and icon
        document.getElementById('weatherDescription').textContent = data.weather[0].description;
        const weatherIcon = document.getElementById('weatherIcon');
        weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        weatherIcon.alt = data.weather[0].description;
        
        // Update humidity with animated progress bar
        const humidityValue = data.main.humidity;
        document.getElementById('humidity').textContent = `${humidityValue}%`;
        setTimeout(() => {
            document.getElementById('humidityBar').style.width = `${humidityValue}%`;
        }, 100);
        
        // Update wind speed
        const windSpeedKmh = Math.round(data.wind.speed * 3.6);
        document.getElementById('windSpeed').textContent = `${windSpeedKmh} km/h`;
        
        // Update pressure
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        
        // Update visibility
        const visibilityKm = (data.visibility / 1000).toFixed(1);
        document.getElementById('visibility').textContent = `${visibilityKm} km`;
        
        // Update cloudiness with animated progress bar
        const cloudinessValue = data.clouds.all;
        document.getElementById('cloudiness').textContent = `${cloudinessValue}%`;
        setTimeout(() => {
            document.getElementById('cloudinessBar').style.width = `${cloudinessValue}%`;
        }, 100);
        
        // Update timestamp
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastUpdated').textContent = timeString;
        
        // Change background based on weather
        updateBackground(data.weather[0].main);
        
        // Show weather card with animation
        document.getElementById('weatherCard').classList.add('show');
        
        console.log('Weather data displayed successfully');
        
    } catch (error) {
        console.error('Error displaying weather data:', error);
        showError('Error displaying weather information');
    }
}

// Animate number counting
function animateNumber(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Update background color based on weather
function updateBackground(condition) {
    const body = document.body;
    
    const gradients = {
        'clear': 'linear-gradient(135deg, #FDB99B 0%, #CF8BF3 100%)',
        'clouds': 'linear-gradient(135deg, #A8BFDB 0%, #7C98B3 100%)',
        'rain': 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)',
        'drizzle': 'linear-gradient(135deg, #4B6CB7 0%, #182848 100%)',
        'thunderstorm': 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
        'snow': 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
        'mist': 'linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)',
        'fog': 'linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)',
        'haze': 'linear-gradient(135deg, #BDC3C7 0%, #2C3E50 100%)',
        'smoke': 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)'
    };
    
    const gradient = gradients[condition.toLowerCase()] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    body.style.background = gradient;
}

// Show error message with animation
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
