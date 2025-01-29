import React from "react";
import useWeatherDetails from "./useWeatherDetails";
import WeatherDetailsUI from "./WeatherDetailsUI";

const WeatherDetails = ({ currentWeather, forecast, background }) => {
    const weatherLogic = useWeatherDetails(currentWeather, forecast);

    if (!currentWeather || !forecast?.length) return null;

    return (
        <WeatherDetailsUI
            currentWeather={currentWeather}
            background={background}
            {...weatherLogic}
        />
    );
};

export default WeatherDetails;
