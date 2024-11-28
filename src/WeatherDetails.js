import React, { Component } from "react";

class WeatherDetails extends Component {
    render() {
        const { weatherData } = this.props;

        if (!weatherData) return null;

        const { main, weather, wind, name } = weatherData;

        return (
            <div className="weather-container">
                <h2>{name}</h2>
                <p>Temperature: {main.temp}°C</p>
                <p>Condition: {weather[0].description}</p>
                <p>Humidity: {main.humidity}%</p>
                <p>Wind Speed: {wind.speed} m/s</p>
                <p>Min Temp: {main.temp_min}°C</p>
                <p>Max Temp: {main.temp_max}°C</p>
                <img
                    src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                    alt={weather[0].description}
                />
            </div>
        );
    }
}

export default WeatherDetails;
