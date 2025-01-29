import { useState, useEffect } from "react";
import axios from "axios";

const useWeather = () => {
    const [city, setCity] = useState("Toronto");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState("");
    const [background, setBackground] = useState("default.jpg");
    const [anchorEl, setAnchorEl] = useState(null);

    const API_KEY = process.env.REACT_APP_API_KEY;

    const setWeatherBackground = (condition) => {
        const weatherBackgrounds = {
            thunderstorm: "thunderstorm.jpg",
            drizzle: "drizzle.jpg",
            rain: "rainy.jpg",
            snow: "snowy.jpg",
            mist: "foggy.jpg",
            haze: "foggy.jpg",
            fog: "foggy.jpg",
            smoke: "dusty.jpg",
            dust: "dusty.jpg",
            ash: "dusty.jpg",
            sand: "dusty.jpg",
            squall: "windy.jpg",
            tornado: "tornado.jpg",
            clear: "sunny.jpg",
            clouds: "cloudy.jpg",
            default: "default.jpg"
        };

        setBackground(weatherBackgrounds[condition] || weatherBackgrounds.default);
    };

    const fetchWeather = async (cityName) => {
        if (!cityName) return;
        try {
            const [currentRes, forecastRes] = await Promise.all([
                axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                    params: { q: cityName, appid: API_KEY, units: "metric" }
                }),
                axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                    params: { q: cityName, appid: API_KEY, units: "metric" }
                })
            ]);

            setCurrentWeather(currentRes.data);
            setForecast(forecastRes.data.list);
            setWeatherBackground(currentRes.data.weather[0].main.toLowerCase());
            setError("");
        } catch (err) {
            setError("City not found. Please try again.");
            resetWeatherState();
        }
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const [currentRes, forecastRes] = await Promise.all([
                axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
                    params: { lat, lon, appid: API_KEY, units: "metric" }
                }),
                axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
                    params: { lat, lon, appid: API_KEY, units: "metric" }
                })
            ]);

            setCurrentWeather(currentRes.data);
            setCity(currentRes.data.name || city);
            setForecast(forecastRes.data.list);
            setWeatherBackground(currentRes.data.weather[0].main.toLowerCase());
            setError("");
        } catch (err) {
            console.error("Error fetching by coords:", err);
            setError("Could not fetch location weather. Please try again.");
            resetWeatherState();
        }
    };

    const resetWeatherState = () => {
        setCurrentWeather(null);
        setForecast([]);
        setBackground("default.jpg");
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                () => fetchWeather(city)
            );
        } else {
            fetchWeather(city);
        }
    }, []); // eslint-disable-line

    const handleShare = (platform) => {
        if (!currentWeather) return;

        const message = `Check out the weather in ${currentWeather.name} right now!
Temperature: ${currentWeather.main.temp}°C
Condition: ${currentWeather.weather[0].description}`;

        const shareConfig = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}%0A${encodeURIComponent(window.location.href)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`,
            sms: `sms:?body=${encodeURIComponent(message)}%0A${encodeURIComponent(window.location.href)}`,
            copy: () => navigator.clipboard.writeText(`${message}\n${window.location.href}`)
        };

        typeof shareConfig[platform] === "function"
            ? shareConfig[platform]()
            : window.open(shareConfig[platform], "_blank");
    };

    return {
        city,
        setCity,
        currentWeather,
        forecast,
        error,
        background,
        anchorEl,
        setAnchorEl,
        fetchWeather,
        handleShare
    };
};

export default useWeather;