import React, { useState, useEffect } from "react";
import axios from "axios";
import WeatherDetails from "./WeatherDetails";
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {
    Share as ShareIcon,
    WhatsApp,
    Twitter,
    Facebook,
    Telegram,
    Message,
    Attachment
} from "@mui/icons-material";

const Weather = () => {
    const [city, setCity] = useState("Toronto");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [error, setError] = useState("");
    const [background, setBackground] = useState("default.jpg");

    const [anchorEl, setAnchorEl] = useState(null); // for SHARE menu

    const API_KEY = process.env.REACT_APP_API_KEY;

    // (A) Fetch weather by city
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

            // Background
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
                    setBackground("dusty.jpg");
                    break;
                case "squall":
                    setBackground("windy.jpg");
                    break;
                case "tornado":
                    setBackground("tornado.jpg");
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

    // (B) Fetch weather by coords (geolocation)
    const fetchWeatherByCoords = async (lat, lon) => {
        try {
            const currentResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather`,
                {
                    params: {
                        lat,
                        lon,
                        appid: API_KEY,
                        units: "metric",
                    },
                }
            );
            setCurrentWeather(currentResponse.data);

            if (currentResponse.data.name) {
                setCity(currentResponse.data.name);
            }

            const forecastResponse = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast`,
                {
                    params: {
                        lat,
                        lon,
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
                    setBackground("dusty.jpg");
                    break;
                case "squall":
                    setBackground("windy.jpg");
                    break;
                case "tornado":
                    setBackground("tornado.jpg");
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
            console.error("Error fetching by coords:", err);
            setError("Could not fetch location weather. Please try again.");
            setCurrentWeather(null);
            setForecast([]);
            setBackground("default.jpg");
        }
    };

    // (C) On mount, attempt geolocation => fallback to default
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoords(latitude, longitude);
                },
                (err) => {
                    console.log("Geolocation error:", err);
                    // fallback: default city
                    fetchWeather(city);
                }
            );
        } else {
            fetchWeather(city);
        }
        // eslint-disable-next-line
    }, []);

    // (D) Share menu logic (like the 3hr forecast)
    const handleShareButtonClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleShareMenuClose = () => {
        setAnchorEl(null);
    };

    const handlePlatformShare = (platform) => {
        if (!currentWeather) return;

        const message = `Check out the weather in ${currentWeather.name} right now!
Temperature: ${currentWeather.main.temp}°C
Condition: ${currentWeather.weather[0].description}`;

        const encodedMessage = encodeURIComponent(message);
        const appUrl = encodeURIComponent(window.location.href);

        const platforms = {
            whatsapp: `https://wa.me/?text=${encodedMessage}%0A${appUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${appUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encodedMessage}`,
            telegram: `https://t.me/share/url?url=${appUrl}&text=${encodedMessage}`,
            sms: `sms:?body=${encodedMessage}%0A${appUrl}`,
            copy: () => {
                navigator.clipboard.writeText(`${message}\n${decodeURIComponent(appUrl)}`)
                    .then(() => alert("Copied weather info to clipboard!"));
            }
        };

        if (typeof platforms[platform] === "function") {
            platforms[platform]();
        } else {
            window.open(platforms[platform], "_blank");
        }
        handleShareMenuClose();
    };

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

            {/* Search + Buttons */}
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            fetchWeather(city);
                        }
                    }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchWeather(city)}
                    sx={{ mr: 2 }}
                >
                    Get Weather
                </Button>

                {/* Share dropdown menu button */}
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleShareButtonClick}
                    startIcon={<ShareIcon />}
                >
                    Share
                </Button>
            </Box>

            {/* The share menu (dropdown) */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleShareMenuClose}
            >
                <MenuItem onClick={() => handlePlatformShare("sms")}>
                    <ListItemIcon>
                        <Message fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Text Message</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handlePlatformShare("whatsapp")}>
                    <ListItemIcon>
                        <WhatsApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>WhatsApp</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handlePlatformShare("facebook")}>
                    <ListItemIcon>
                        <Facebook fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Facebook</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handlePlatformShare("twitter")}>
                    <ListItemIcon>
                        <Twitter fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Twitter</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handlePlatformShare("telegram")}>
                    <ListItemIcon>
                        <Telegram fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Telegram</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handlePlatformShare("copy")}>
                    <ListItemIcon>
                        <Attachment fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Copy to Clipboard</ListItemText>
                </MenuItem>
            </Menu>

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
