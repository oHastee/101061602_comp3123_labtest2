import React from "react";
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
} from "@mui/icons-material";

const WeatherDetailsUI = ({
                              currentWeather,
                              background,
                              groupedForecast,
                              open,
                              setOpen,
                              selectedDayForecast,
                              anchorEl,
                              handleDayClick,
                              handleShareOpen,
                              handleShareClose,
                              handlePlatformShare
                          }) => {
    const { main, weather, wind, name } = currentWeather || {};

    // Example: "Tuesday, January 28, 2025"
    const todayFullDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: 4,
                mt: 4,
                px: 4,
                color: "#000",
            }}
        >
            {/* ==============
          MAIN CARD
         ============== */}
            <Card
                sx={{
                    p: 3,
                    width: "320px",
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    color: "#000",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {/* City Name */}
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    {name}
                </Typography>

                {/* Full Date (Tuesday, January 28, 2025) */}
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {todayFullDate}
                </Typography>

                {/* BIG Weather Icon */}
                {weather && weather[0] && (
                    <img
                        src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                        alt={weather[0].description}
                        style={{ width: "100px", height: "100px" }}
                    />
                )}

                {/* Big Temperature */}
                {main?.temp !== undefined && (
                    <Typography variant="h3" sx={{ fontWeight: "bold", my: 1 }}>
                        {Math.round(main.temp)}°C
                    </Typography>
                )}

                {/* Condition */}
                <Typography variant="subtitle1" sx={{ mb: 2, textTransform: "capitalize" }}>
                    {weather?.[0]?.description}
                </Typography>

                {/* "Mini card" for humidity & wind near bottom */}
                <Box
                    sx={{
                        width: "100%",
                        mt: "auto",
                    }}
                >
                    <Card
                        sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.3)",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box textAlign="left">
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    Humidity
                                </Typography>
                                <Typography variant="body2">
                                    {main?.humidity}%
                                </Typography>
                            </Box>

                            <Box textAlign="right">
                                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                    Wind
                                </Typography>
                                <Typography variant="body2">
                                    {wind?.speed} m/s
                                </Typography>
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Card>

            {/* ==============
          5-DAY FORECAST
         ============== */}
            <Box
                sx={{
                    // Try shifting these forecast cards “off to the right” a bit
                    position: "relative",
                    top: 0,
                    left: 0,
                    width: "100%",
                    // You can tweak these margins to replicate the "offset" from your screenshot
                    mt: 0,
                }}
            >
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

                <Grid
                    container
                    spacing={2}
                    sx={{
                        // Adjust these to position the 5-day forecast horizontally
                        justifyContent: "flex-start",
                    }}
                >
                    {Object.entries(groupedForecast)
                        .slice(0, 5)
                        .map(([dateStr, entries]) => {
                            // Convert "YYYY-MM-DD" to something like "Tue, Jan 28"
                            const dateObj = new Date(dateStr);
                            const shortDate = dateObj.toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                            });

                            // We'll use the first entry as a quick preview
                            const firstEntry = entries[0];
                            const iconUrl = `http://openweathermap.org/img/wn/${firstEntry.weather[0].icon}@2x.png`;
                            const description = firstEntry.weather[0].description;
                            const temp = Math.round(firstEntry.main.temp);

                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={dateStr}>
                                    <Card
                                        sx={{
                                            backgroundColor: "rgba(255, 255, 255, 0.4)",
                                            color: "#000",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                            cursor: "pointer",
                                            transition: "transform 0.2s",
                                            "&:hover": {
                                                transform: "translateY(-2px)",
                                            },
                                            textAlign: "center",
                                        }}
                                        onClick={() => handleDayClick(dateStr)}
                                    >
                                        <CardContent>
                                            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                                {shortDate}
                                            </Typography>
                                            {/* Larger icon */}
                                            <Box sx={{ my: 1 }}>
                                                <img
                                                    src={iconUrl}
                                                    alt={description}
                                                    style={{ width: "70px", height: "70px" }}
                                                />
                                            </Box>
                                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                                {temp}°C
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ textTransform: "capitalize", mb: 1 }}
                                            >
                                                {description}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    display: "block",
                                                    textDecoration: "underline",
                                                }}
                                            >
                                                Click for more details
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                </Grid>
            </Box>

            {/* ==============
          3-HOUR FORECAST MODAL
         ============== */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "90%",
                        maxWidth: "600px",
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                        bgcolor: "primary.main",
                        backdropFilter: "blur(10px)",
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        p: 4,
                        overflow: "hidden",
                        background:
                            "linear-gradient(145deg, rgba(25,118,210,0.9) 0%, rgba(33,150,243,0.9) 100%)",
                    }}
                >
                    {/* Title + Share Button */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#fff",
                                fontWeight: "bold",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                            }}
                        >
                            3-Hour Forecast
                        </Typography>
                        <IconButton
                            onClick={handleShareOpen}
                            sx={{
                                color: "#fff",
                                "&:hover": {
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                },
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
                                bgcolor: "rgba(255,255,255,0.9)",
                                backdropFilter: "blur(10px)",
                                borderRadius: "8px",
                            },
                        }}
                    >
                        <MenuItem onClick={() => handlePlatformShare("sms")}>
                            <ListItemIcon sx={{ color: "#000" }}>
                                <Message fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Text Message</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare("whatsapp")}>
                            <ListItemIcon sx={{ color: "#25D366" }}>
                                <WhatsApp fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>WhatsApp</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare("facebook")}>
                            <ListItemIcon sx={{ color: "#1877F2" }}>
                                <Facebook fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Facebook</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare("twitter")}>
                            <ListItemIcon sx={{ color: "#1DA1F2" }}>
                                <Twitter fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Twitter</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare("telegram")}>
                            <ListItemIcon sx={{ color: "#0088CC" }}>
                                <Telegram fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Telegram</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare("copy")}>
                            <ListItemIcon sx={{ color: "#000" }}>
                                <Attachment fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Copy to Clipboard</ListItemText>
                        </MenuItem>
                    </Menu>

                    <Box
                        sx={{
                            overflowY: "auto",
                            flex: 1,
                            pr: 2,
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                                background: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                background: "rgba(0,0,0,0.2)",
                                borderRadius: "4px",
                            },
                        }}
                    >
                        <Grid container spacing={2}>
                            {selectedDayForecast.map((entry) => {
                                const localDate = new Date(entry.dt_txt.replace(" ", "T") + "Z");
                                const time = localDate.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                });

                                return (
                                    <Grid item xs={12} key={entry.dt_txt}>
                                        <Card
                                            sx={{
                                                p: 1,
                                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                                borderRadius: "12px",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "translateY(-2px)",
                                                },
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 2,
                                                }}
                                            >
                                                {/* Time (left) */}
                                                <Box sx={{ flex: 1, textAlign: "left" }}>
                                                    <Typography
                                                        variant="subtitle1"
                                                        sx={{
                                                            fontWeight: "bold",
                                                            color: "#fff",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {time}
                                                    </Typography>
                                                </Box>

                                                {/* Icon (center) */}
                                                <Box sx={{ flex: 1, textAlign: "center" }}>
                                                    <img
                                                        src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                                                        alt={entry.weather[0].description}
                                                        style={{
                                                            width: "60px",
                                                            height: "60px",
                                                        }}
                                                    />
                                                </Box>

                                                {/* Temp & condition (right) */}
                                                <Box sx={{ flex: 1, textAlign: "right" }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            color: "#fff",
                                                            fontWeight: "bold",
                                                            lineHeight: 1.2,
                                                        }}
                                                    >
                                                        {Math.round(entry.main.temp)}°C
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: "#e0e0e0",
                                                            display: "block",
                                                            textTransform: "capitalize",
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

export default WeatherDetailsUI;
