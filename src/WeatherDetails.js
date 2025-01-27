import React, { useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Modal,
    Box,
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
} from '@mui/icons-material';

const WeatherDetails = ({ currentWeather, forecast, background }) => {
    const [open, setOpen] = useState(false);
    const [selectedDayForecast, setSelectedDayForecast] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    if (!currentWeather || !forecast.length) return null;

    const { main, weather, wind, name } = currentWeather;

    // Group forecast by day (in UTC)
    const groupedForecast = forecast.reduce((acc, entry) => {
        const dateStr = entry.dt_txt.split(" ")[0]; // e.g. "2025-01-26"
        if (!acc[dateStr]) acc[dateStr] = [];
        acc[dateStr].push(entry);
        return acc;
    }, {});

    // When user clicks a day, we show *all* 3-hour blocks for that day
    const handleDayClick = (day) => {
        const dayEntries = groupedForecast[day] || [];
        // Sort by actual time so it’s in ascending order
        dayEntries.sort((a, b) =>
            new Date(a.dt_txt).getTime() - new Date(b.dt_txt).getTime()
        );
        setSelectedDayForecast(dayEntries);
        setOpen(true);
    };

    // SHARE MENU
    const handleShareOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleShareClose = () => {
        setAnchorEl(null);
    };

    const handlePlatformShare = (platform) => {
        if (!selectedDayForecast.length) return;

        // Build forecast text:
        // Convert dt_txt from UTC => local time for each line
        const dateStr = new Date(selectedDayForecast[0].dt_txt).toDateString();
        const lines = selectedDayForecast.map((entry) => {
            const localDate = new Date(entry.dt_txt.replace(" ", "T") + "Z");
            const timeStr = localDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            });
            return `${timeStr} - ${entry.main.temp}°C - ${entry.weather[0].description}`;
        });

        const message = `Weather forecast for ${dateStr}:\n${lines.join("\n")}\n\nShared via Weather App`;
        const encodedMessage = encodeURIComponent(message);
        const appUrl = encodeURIComponent(window.location.href);

        const platforms = {
            whatsapp: `https://wa.me/?text=${encodedMessage}%0A${appUrl}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${appUrl}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${appUrl}&quote=${encodedMessage}`,
            telegram: `https://t.me/share/url?url=${appUrl}&text=${encodedMessage}`,
            sms: `sms:?body=${encodedMessage}%0A${appUrl}`,
            copy: () => {
                navigator.clipboard.writeText(`${message}\n${decodeURIComponent(appUrl)}`);
                alert("Copied forecast to your clipboard!");
            }
        };

        if (typeof platforms[platform] === "function") {
            platforms[platform]();
        } else {
            window.open(platforms[platform], "_blank");
        }
        handleShareClose();
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
            {/* Left Card: Current Weather */}
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

            {/* Right side: 5-day forecast summary */}
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
                        .map(([dateStr, entries]) => (
                            <Grid item xs={12} sm={6} md={4} key={dateStr}>
                                <Card
                                    sx={{
                                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                                        color: "#000",
                                        cursor: "pointer",
                                        borderRadius: "12px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-2px)"
                                        }
                                    }}
                                    onClick={() => handleDayClick(dateStr)}
                                >
                                    <CardContent>
                                        <Typography variant="subtitle1">{dateStr}</Typography>
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

            {/* 3-Hour Forecast Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: 'primary.main',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '16px',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        p: 4,
                        overflow: 'hidden',
                        background: 'linear-gradient(145deg, rgba(25,118,210,0.9) 0%, rgba(33,150,243,0.9) 100%)'
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 3
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: '#fff',
                                fontWeight: 'bold',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                            }}
                        >
                            3-Hour Forecast
                        </Typography>
                        <IconButton
                            onClick={handleShareOpen}
                            sx={{
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.1)'
                                }
                            }}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Box>

                    {/* Share Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleShareClose}
                        PaperProps={{
                            sx: {
                                bgcolor: 'rgba(255,255,255,0.9)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '8px'
                            }
                        }}
                    >
                        <MenuItem onClick={() => handlePlatformShare('sms')}>
                            <ListItemIcon>
                                <Message fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Text Message</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('whatsapp')}>
                            <ListItemIcon>
                                <WhatsApp fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>WhatsApp</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('facebook')}>
                            <ListItemIcon>
                                <Facebook fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Facebook</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('twitter')}>
                            <ListItemIcon>
                                <Twitter fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Twitter</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('telegram')}>
                            <ListItemIcon>
                                <Telegram fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Telegram</ListItemText>
                        </MenuItem>

                        {/* Copy to Clipboard (paperclip) */}
                        <MenuItem onClick={() => handlePlatformShare('copy')}>
                            <ListItemIcon>
                                <Attachment fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Copy to Clipboard</ListItemText>
                        </MenuItem>
                    </Menu>

                    <Box
                        sx={{
                            overflowY: 'auto',
                            flex: 1,
                            pr: 2,
                            '&::-webkit-scrollbar': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-track': {
                                background: 'rgba(0,0,0,0.1)',
                                borderRadius: '4px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: 'rgba(0,0,0,0.2)',
                                borderRadius: '4px',
                            },
                        }}
                    >
                        <Grid container spacing={2}>
                            {selectedDayForecast.map((entry) => {
                                // Convert the dt_txt to local
                                const localDate = new Date(entry.dt_txt.replace(" ", "T") + "Z");
                                const time = localDate.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <Grid item xs={12} key={entry.dt_txt}>
                                        <Card
                                            sx={{
                                                p: 1,
                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 2
                                                }}
                                            >
                                                <Box sx={{ flex: 1, textAlign: 'left' }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            color: '#fff',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {time}
                                                    </Typography>
                                                </Box>

                                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                                    <img
                                                        src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                                                        alt={entry.weather[0].description}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ flex: 1, textAlign: 'right' }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: '#fff',
                                                            fontWeight: 'bold',
                                                            lineHeight: 1.2
                                                        }}
                                                    >
                                                        {entry.main.temp}°C
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#e0e0e0',
                                                            display: 'block',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {entry.weather[0].description}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default WeatherDetails;
