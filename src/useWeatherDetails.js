import { useState } from "react";

const useWeatherDetails = (currentWeather, forecast) => {
    const [open, setOpen] = useState(false);
    const [selectedDayForecast, setSelectedDayForecast] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    /**
     * 1) Convert each forecast entry’s dt_txt from UTC to local date (YYYY-MM-DD).
     * 2) Filter out today’s local date, because we’re showing that on the left card.
     * 3) Group the remaining days by date.
     */
    const groupForecastByLocalDate = (forecastList) => {
        const todayLocal = new Date().toLocaleDateString("en-CA"); // e.g. '2025-01-29'
        const grouped = {};

        forecastList.forEach((entry) => {
            // "dt_txt" might be "2025-01-29 15:00:00" UTC
            // Append 'Z' so JS interprets it as UTC, then convert to local date.
            const dateObj = new Date(entry.dt_txt.replace(" ", "T") + "Z");
            const localDateStr = dateObj.toLocaleDateString("en-CA");

            // Exclude today’s local date (since today’s weather is shown on the left card)
            if (localDateStr !== todayLocal) {
                if (!grouped[localDateStr]) {
                    grouped[localDateStr] = [];
                }
                grouped[localDateStr].push(entry);
            }
        });

        return grouped;
    };

    /**
     * For each day’s group of 3-hour entries, pick a "representative" entry.
     * Typically we look for 2:00 PM local if it exists; if not, the middle of the array.
     */
    const pickRepresentativeEntry = (dayEntries) => {
        // Sort by ascending time
        const sorted = dayEntries.slice().sort((a, b) => {
            const aTime = new Date(a.dt_txt.replace(" ", "T") + "Z").getTime();
            const bTime = new Date(b.dt_txt.replace(" ", "T") + "Z").getTime();
            return aTime - bTime;
        });

        // Try to find one whose local hour is 14 (2 PM)
        const twoPmEntry = sorted.find((entry) => {
            const hour = new Date(entry.dt_txt.replace(" ", "T") + "Z").getHours();
            return hour === 14;
        });

        return twoPmEntry || sorted[Math.floor(sorted.length / 2)];
    };

    /**
     * Group all entries by local date (excluding today).
     */
    const groupedForecast = groupForecastByLocalDate(forecast);

    /**
     * Identify the next 5 unique dates after today.
     */
    const sortedDates = Object.keys(groupedForecast).sort(
        (a, b) => new Date(a) - new Date(b)
    );
    const nextFiveDates = sortedDates.slice(0, 5); // pick the next 5 days

    /**
     * Build an array of "representative" forecast entries for those 5 days.
     * (Not strictly required by the UI, but we return it in case needed.)
     */
    const fiveDayForecast = nextFiveDates.map((date) => {
        const dayEntries = groupedForecast[date];
        return pickRepresentativeEntry(dayEntries);
    });

    /**
     * Handle showing the full 3-hour forecast for a selected day.
     */
    const handleDayClick = (date) => {
        const dayEntries = groupedForecast[date] || [];
        dayEntries.sort(
            (a, b) =>
                new Date(a.dt_txt.replace(" ", "T") + "Z").getTime() -
                new Date(b.dt_txt.replace(" ", "T") + "Z").getTime()
        );
        setSelectedDayForecast(dayEntries);
        setOpen(true);
    };

    /**
     * Sharing logic for the 3-hour breakdown
     */
    const handleShareOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleShareClose = () => {
        setAnchorEl(null);
    };

    const handlePlatformShare = (platform) => {
        if (!selectedDayForecast.length) return;

        // Example: "Wed Jan 29 2025"
        const dateStr = new Date(
            selectedDayForecast[0].dt_txt.replace(" ", "T") + "Z"
        ).toDateString();

        const lines = selectedDayForecast.map((entry) => {
            const localDate = new Date(entry.dt_txt.replace(" ", "T") + "Z");
            const timeStr = localDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            return `${timeStr} - ${entry.main.temp}°C - ${entry.weather[0].description}`;
        });

        const message = `Weather forecast for ${dateStr}:\n${lines.join(
            "\n"
        )}\n\nShared via Weather App`;
        const encodedMessage = encodeURIComponent(message);
        const appUrl = encodeURIComponent(window.location.href);

        const platforms = {
            whatsapp: `https://wa.me/?text=${encodedMessage}%0A${appUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${appUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encodedMessage}`,
            telegram: `https://t.me/share/url?url=${appUrl}&text=${encodedMessage}`,
            sms: `sms:?body=${encodedMessage}%0A${appUrl}`,
            copy: () => {
                navigator.clipboard.writeText(
                    `${message}\n${decodeURIComponent(appUrl)}`
                );
                alert("Copied forecast to your clipboard!");
            },
        };

        if (typeof platforms[platform] === "function") {
            platforms[platform]();
        } else {
            window.open(platforms[platform], "_blank");
        }
        handleShareClose();
    };

    /**
     * Expose hook state & functions
     */
    return {
        // Modal open state
        open,
        setOpen,
        anchorEl,

        // For the left card (today’s weather is passed in directly)
        currentWeather,

        // For the next 5 days, if you need to use it
        fiveDayForecast,

        // All forecast entries keyed by date (excluding today)
        groupedForecast,

        // The array of 3-hour entries for whichever day was clicked
        selectedDayForecast,

        // Handlers
        handleDayClick,
        handleShareOpen,
        handleShareClose,
        handlePlatformShare,
    };
};

export default useWeatherDetails;
