import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDetails from "./WeatherDetails";
import { Box, TextField, Button, Typography } from "@mui/material";

const Weather = () => {
    const [city, setCity] = useState("Toronto");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState("");
    const [background, setBackground] = useState("default.jpg");

    const API_KEY = process.env.REACT_APP_API_KEY;

    const fetchWeather = async (cityName) => {
        if (!cityName) return;
        try {
            const currentResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather`,
                {
                    params: {
                        q: cityName,
                        appid: API_KEY,
                        units: "metric",
                    },
                }
            );
            setCurrentWeather(currentResponse.data);

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast`,
                {
                    params: {
                        q: cityName,
                        appid: API_KEY,
                        units: "metric",
                    },
                }
            );
            setForecast(forecastResponse.data.list);

            const condition = currentResponse.data.weather[0].main.toLowerCase();
            switch (condition) {
                case "thunderstorm":
                    setBackground("thunderstorm.jpg");
                    break;
                case "drizzle":
                    setBackground("drizzle.jpg");
                    break;
                case "rain":
                    setBackground("rainy.jpg");
                    break;
                case "snow":
                    setBackground("snowy.jpg");
                    break;
                case "mist":
                case "haze":
                case "fog":
                    setBackground("foggy.jpg");
                    break;
                case "smoke":
                case "dust":
                case "ash":
                case "sand":
                    setBackground("dusty.jpg"); // need
                    break;
                case "squall":
                    setBackground("windy.jpg"); // need
                    break;
                case "tornado":
                    setBackground("tornado.jpg"); // need
                    break;
                case "clear":
                    setBackground("sunny.jpg");
                    break;
                case "clouds":
                    setBackground("cloudy.jpg");
                    break;
                default:
                    setBackground("default.jpg");
            }
            setError("");
        } catch (err) {
            setError("City not found. Please try again.");
            setCurrentWeather(null);
            setForecast([]);
            setBackground("default.jpg");
        }
    };

    useEffect(() => {
        fetchWeather(city);
    }, []);

    return (
        <Box
            sx={{
                textAlign: "center",
                padding: "20px",
                minHeight: "100vh",
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
                Weather App
            </Typography>
            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                <TextField
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    variant="outlined"
                    placeholder="Enter City"
                    sx={{
                        mr: 2,
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        width: "350px",
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchWeather(city)}
                >
                    Get Weather
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <WeatherDetails
                currentWeather={currentWeather}
                forecast={forecast}
                background={background}
            />
        </Box>
    );
};



export default Weather;
