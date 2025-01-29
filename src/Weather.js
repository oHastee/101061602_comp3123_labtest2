import React from "react";
import useWeather from "./useWeather";
import WeatherUI from "./WeatherUI";

const Weather = () => {
    const weatherLogic = useWeather();
    return <WeatherUI {...weatherLogic} />;

};

export default Weather;