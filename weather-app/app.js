// Weather Dashboard App using OpenWeatherMap API
// Free API Key: Get one at https://openweathermap.org/api

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

class WeatherApp {
    constructor() {
        this.currentWeather = null;
        this.forecastData = null;
        this.selectedCity = null;
        this.initEventListeners();
    }

    initEventListeners() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        const locationBtn = document.getElementById('locationBtn');

        searchBtn.addEventListener('click', () => this.searchWeather());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
        searchInput.addEventListener('input', (e) => this.getSearchSuggestions(e.target.value));
        locationBtn.addEventListener('click', () => this.useCurrentLocation());
    }

    async searchWeather() {
        const input = document.getElementById('searchInput').value.trim();
        if (!input) {
            this.showError('Please enter a city name or coordinates');
            return;
        }

        // Check if input is coordinates (lat,lon)
        const coordMatch = input.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
        
        if (coordMatch) {
            const [, lat, lon] = coordMatch;
            await this.fetchWeatherByCoordinates(lat, lon);
        } else {
            await this.fetchWeatherByCity(input);
        }
    }

    async fetchWeatherByCity(cityName) {
        try {
            this.showLoading(true);
            this.clearError();

            // Get coordinates from city name
            const geoResponse = await fetch(
                `${GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
            );
            const geoData = await geoResponse.json();

            if (!geoData.length) {
                this.showError(`City "${cityName}" not found`);
                this.showLoading(false);
                return;
            }

            const { lat, lon, name, country } = geoData[0];
            this.selectedCity = `${name}, ${country}`;
            await this.fetchWeatherByCoordinates(lat, lon);
        } catch (error) {
            this.showError('Error fetching city data. Please check your API key.');
            console.error('Error:', error);
            this.showLoading(false);
        }
    }

    async fetchWeatherByCoordinates(lat, lon) {
        try {
            this.showLoading(true);
            this.clearError();

            // Fetch current weather and forecast
            const weatherResponse = await fetch(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const forecastResponse = await fetch(
                `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );

            if (!weatherResponse.ok || !forecastResponse.ok) {
                throw new Error('Failed to fetch weather data');
            }

            this.currentWeather = await weatherResponse.json();
            this.forecastData = await forecastResponse.json();

            this.renderWeather();
            this.showLoading(false);
        } catch (error) {
            this.showError('Error fetching weather data. Please try again.');
            console.error('Error:', error);
            this.showLoading(false);
        }
    }

    async useCurrentLocation() {
        try {
            this.showLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    await this.fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    this.showError('Unable to get your location. Please enable location access.');
                    this.showLoading(false);
                    console.error('Geolocation error:', error);
                }
            );
        } catch (error) {
            this.showError('Geolocation is not supported by your browser');
            this.showLoading(false);
        }
    }

    async getSearchSuggestions(query) {
        if (!query || query.length < 2) {
            document.getElementById('searchSuggestions').classList.remove('show');
            return;
        }

        try {
            const response = await fetch(
                `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
            );
            const cities = await response.json();

            const suggestionsDiv = document.getElementById('searchSuggestions');
            suggestionsDiv.innerHTML = '';

            cities.forEach(city => {
                const suggestion = document.createElement('div');
                suggestion.className = 'suggestion-item';
                suggestion.textContent = `${city.name}, ${city.country}`;
                suggestion.addEventListener('click', () => {
                    document.getElementById('searchInput').value = `${city.name}, ${city.country}`;
                    this.selectedCity = `${city.name}, ${city.country}`;
                    this.fetchWeatherByCoordinates(city.lat, city.lon);
                    suggestionsDiv.classList.remove('show');
                });
                suggestionsDiv.appendChild(suggestion);
            });

            if (cities.length > 0) {
                suggestionsDiv.classList.add('show');
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    renderWeather() {
        if (!this.currentWeather) return;

        const weather = this.currentWeather;
        const forecast = this.forecastData;

        // Update current weather
        document.getElementById('cityName').textContent = 
            `${weather.name}, ${weather.sys.country}`;
        document.getElementById('dateTime').textContent = 
            new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

        const temp = Math.round(weather.main.temp);
        document.getElementById('temperature').textContent = temp;
        document.getElementById('weatherDesc').textContent = 
            weather.weather[0].main;
        document.getElementById('feelsLike').textContent = 
            `Feels like ${Math.round(weather.main.feels_like)}°C`;

        // Weather icon
        const iconCode = weather.weather[0].icon;
        document.getElementById('weatherIcon').src = 
            `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        // Details
        document.getElementById('humidity').textContent = `${weather.main.humidity}%`;
        document.getElementById('windSpeed').textContent = 
            `${(weather.wind.speed * 3.6).toFixed(1)} km/h`;
        document.getElementById('pressure').textContent = 
            `${weather.main.pressure} hPa`;
        document.getElementById('visibility').textContent = 
            `${(weather.visibility / 1000).toFixed(1)} km`;
        document.getElementById('uvIndex').textContent = 
            `${weather.clouds.all}%`;
        document.getElementById('windDirection').textContent = 
            `${this.getWindDirection(weather.wind.deg)}`;

        // Sun/Moon times
        document.getElementById('sunrise').textContent = 
            new Date(weather.sys.sunrise * 1000).toLocaleTimeString('en-US', 
            { hour: '2-digit', minute: '2-digit' });
        document.getElementById('sunset').textContent = 
            new Date(weather.sys.sunset * 1000).toLocaleTimeString('en-US', 
            { hour: '2-digit', minute: '2-digit' });

        // 5-day forecast
        this.renderForecast(forecast);

        // Hourly forecast
        this.renderHourlyForecast(forecast);

        // Show content
        document.getElementById('weatherContent').classList.add('show');
        document.getElementById('emptyState').classList.remove('show');
    }

    renderForecast(forecast) {
        const forecastGrid = document.getElementById('forecastGrid');
        forecastGrid.innerHTML = '';

        // Get forecast for next 5 days (one entry per day at noon)
        const dailyForecasts = {};
        forecast.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const day = date.toLocaleDateString('en-US');
            
            if (!dailyForecasts[day] && Object.keys(dailyForecasts).length < 5) {
                dailyForecasts[day] = item;
            }
        });

        Object.entries(dailyForecasts).forEach(([date, data]) => {
            const card = document.createElement('div');
            card.className = 'forecast-card';

            const forecastDate = new Date(data.dt * 1000);
            const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });
            const dateNum = forecastDate.getDate();

            card.innerHTML = `
                <div class="forecast-date">${dayName} ${dateNum}</div>
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" 
                     class="forecast-icon" alt="Weather icon">
                <div class="forecast-temp">${Math.round(data.main.temp)}°C</div>
                <div class="forecast-desc">${data.weather[0].main}</div>
            `;

            forecastGrid.appendChild(card);
        });
    }

    renderHourlyForecast(forecast) {
        const hourlyDiv = document.getElementById('hourlyForecast');
        hourlyDiv.innerHTML = '';

        // Get next 24 hours
        forecast.list.slice(0, 8).forEach(item => {
            const date = new Date(item.dt * 1000);
            const hour = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="hourly-time">${hour}</div>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" 
                     class="hourly-icon" alt="Weather icon">
                <div class="hourly-temp">${Math.round(item.main.temp)}°C</div>
            `;

            hourlyDiv.appendChild(card);
        });
    }

    getWindDirection(degrees) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                           'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(degrees / 22.5) % 16;
        return `${directions[index]} (${degrees}°)`;
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.add('show');
        } else {
            loading.classList.remove('show');
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }

    clearError() {
        const errorDiv = document.getElementById('errorMessage');
        errorDiv.classList.remove('show');
        errorDiv.textContent = '';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new WeatherApp();

    // Check if API key is set
    if (API_KEY === 'YOUR_API_KEY_HERE') {
        app.showError('⚠️ API Key not configured! Get one at https://openweathermap.org/api');
    }
});
