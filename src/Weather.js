import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDetails from "./WeatherDetails";

const Weather = () => {
    const [city, setCity] = useState("Toronto"); // Default city
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");

    const API_KEY = "8305797c3c2797b39dfd854d016e3d2e";

    const fetchWeather = async (cityName) => {
        if (!cityName) return; // Prevent API call if cityName is empty
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather`,
                {
                    params: {
                        q: cityName,
                        appid: API_KEY,
                        units: "metric", // For Celsius
                    },
                }
            );
            setWeatherData(response.data);
            setError("");
        } catch (err) {
            setError("City not found. Please try again.");
            setWeatherData(null);
        }
    };

    // Fetch default weather data on component load
    useEffect(() => {
        fetchWeather(city); // Fetch data for the default city ("Toronto")
    }, []);

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Weather App</h1>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        fetchWeather(city); // Fetch weather when pressing Enter
                    }
                }}
                placeholder="Enter city"
                style={{ padding: "10px", fontSize: "16px" }}
            />
            <button
                onClick={() => fetchWeather(city)} // Fetch weather when clicking the button
                style={{
                    marginLeft: "10px",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
            >
                Get Weather
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <WeatherDetails weatherData={weatherData} />
        </div>
    );
};

export default Weather;
