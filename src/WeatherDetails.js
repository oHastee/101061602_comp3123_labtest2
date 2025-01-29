import React from "react";
import useWeatherDetails from "./useWeatherDetails";
import WeatherDetailsUI from "./WeatherDetailsUI";

const WeatherDetails = ({ currentWeather, forecast, background }) => {
    // Hook holds all logic: grouping, sorting, modal state, sharing, etc.
    const weatherLogic = useWeatherDetails(currentWeather, forecast);

    // If no data loaded yet, show nothing (or a spinner)
    if (!currentWeather || !forecast?.length) return null;

    // Pass logic + data into the UI component
    return (
        <WeatherDetailsUI
            currentWeather={currentWeather}
            background={background}
            {...weatherLogic} // Spread the hook's return values as props
        />
    );
};

export default WeatherDetails;
