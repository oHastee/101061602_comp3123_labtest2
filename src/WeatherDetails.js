import React, { useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Modal,
    Box,
} from "@mui/material";

const WeatherDetails = ({ currentWeather, forecast, background }) => {
    const [open, setOpen] = useState(false);
    const [selectedDayForecast, setSelectedDayForecast] = useState([]);

    if (!currentWeather || !forecast.length) return null;

    const { main, weather, wind, name } = currentWeather;

    // Group forecast by day
    const groupedForecast = forecast.reduce((acc, entry) => {
        const date = entry.dt_txt.split(" ")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(entry);
        return acc;
    }, {});

    const handleDayClick = (day) => {
        setSelectedDayForecast(groupedForecast[day]);
        setOpen(true);
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            sx={{
                gap: 4,
                mt: 4,
                color: "#fff",
                textAlign: "center",
            }}
        >
            {/* Left Card */}
            <Card
                sx={{
                    p: 3,
                    maxWidth: "300px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    color: "#000",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
            >
                <Typography variant="h5">{name}</Typography>
                <Typography>{new Date().toISOString().split("T")[0]}</Typography>
                <img
                    src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                    alt={weather[0].description}
                    style={{ width: "60px", height: "60px" }}
                />
                <Typography>Temperature: {main.temp}°C</Typography>
                <Typography>Condition: {weather[0].description}</Typography>
                <Typography>Humidity: {main.humidity}%</Typography>
                <Typography>Wind Speed: {wind.speed} m/s</Typography>
            </Card>

            {/* Right Forecast Cards */}
            <Box sx={{ width: "500px" }}>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        color: background === "dark" ? "#fff" : "#000",
                        textAlign: "center",
                        textShadow:
                            background === "dark" ? "2px 2px 4px rgba(0,0,0,0.7)" : "none",
                    }}
                >
                    5-Day Forecast
                </Typography>
                <Grid container spacing={2}>
                    {Object.entries(groupedForecast)
                        .slice(0, 5)
                        .map(([date, entries]) => (
                            <Grid item xs={12} sm={6} md={4} key={date}>
                                <Card
                                    sx={{
                                        backgroundColor: "rgba(255, 255, 255, 0.4)", // Brighter with 40% opacity
                                        color: "#000",
                                        cursor: "pointer",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                    onClick={() => handleDayClick(date)}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1">{date}</Typography>
                                        <Typography>
                                            Temp: {entries[0].main.temp}°C
                                        </Typography>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${entries[0].weather[0].icon}@2x.png`}
                                            alt={entries[0].weather[0].description}
                                            style={{ width: "50px", height: "50px" }}
                                        />
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                display: "block",
                                                mt: 1,
                                                textDecoration: "underline",
                                            }}
                                        >
                                            Click for more details
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                </Grid>
            </Box>

            {/* Modal for 3-Hour Forecast */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        p: 4,
                        backgroundColor: "#fff",
                        maxWidth: "600px",
                        mx: "auto",
                        mt: "10%",
                        borderRadius: "12px",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        3-Hour Forecast
                    </Typography>
                    {selectedDayForecast.map((entry, index) => (
                        <Typography key={index}>
                            {entry.dt_txt.split(" ")[1]} - {entry.main.temp}°C -{" "}
                            {entry.weather[0].description}
                            <img
                                src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                                alt={entry.weather[0].description}
                                style={{ width: "40px", height: "40px" }}
                            />
                        </Typography>
                    ))}
                </Box>
            </Modal>
        </Box>
    );
};

export default WeatherDetails;
