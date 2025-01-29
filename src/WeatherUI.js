import React from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
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
import WeatherDetails from "./WeatherDetails";

const WeatherUI = ({
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
                   }) => {
    const handleKeyPress = (e) => {
        if (e.key === "Enter") fetchWeather(city);
    };

    return (
        <Box sx={{
            textAlign: "center",
            padding: "20px",
            minHeight: "100vh",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
            <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
                Weather App
            </Typography>

            <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
                <TextField
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyPress}
                    variant="outlined"
                    placeholder="Enter City"
                    sx={{ mr: 2, backgroundColor: "#fff", borderRadius: "8px", width: "350px" }}
                />

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => fetchWeather(city)}
                    sx={{ mr: 2 }}
                >
                    Get Weather
                </Button>

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<ShareIcon />}
                >
                    Share
                </Button>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                {[
                    { platform: "sms", icon: <Message />, text: "Text Message", color: "#000" },
                    { platform: "whatsapp", icon: <WhatsApp />, text: "WhatsApp", color: "#25D366" },
                    { platform: "facebook", icon: <Facebook />, text: "Facebook", color: "#1877F2" },
                    { platform: "twitter", icon: <Twitter />, text: "Twitter", color: "#1DA1F2" },
                    { platform: "telegram", icon: <Telegram />, text: "Telegram", color: "#0088CC" },
                    { platform: "copy", icon: <Attachment />, text: "Copy to Clipboard", color: "#000" },
                ].map(({ platform, icon, text, color }) => (
                    <MenuItem key={platform} onClick={() => handleShare(platform)}>
                        <ListItemIcon sx={{ color }}>{icon}</ListItemIcon>
                        <ListItemText>{text}</ListItemText>
                    </MenuItem>
                ))}
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

export default WeatherUI;
