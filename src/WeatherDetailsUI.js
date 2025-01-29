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
} from '@mui/icons-material';

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
    const { main, weather, wind, name } = currentWeather;

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
            {/* =========================
          LEFT CARD: TODAY’S WEATHER
         ========================= */}
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
                {/* Show today's local date */}
                <Typography>{new Date().toLocaleDateString("en-CA")}</Typography>
                {weather && (
                    <img
                        src={`http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`}
                        alt={weather[0].description}
                        style={{ width: "60px", height: "60px" }}
                    />
                )}
                <Typography>Temperature: {main?.temp}°C</Typography>
                <Typography>Condition: {weather?.[0]?.description}</Typography>
                <Typography>Humidity: {main?.humidity}%</Typography>
                <Typography>Wind Speed: {wind?.speed} m/s</Typography>
            </Card>

            {/* =========================
          5-DAY FORECAST
         ========================= */}
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
                        // Just take the first 5 future dates
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
                                        {/* Show the temp & icon from the first entry (or a chosen entry) */}
                                        <Typography>Temp: {entries[0].main.temp}°C</Typography>
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

            {/* =========================
          3-HOUR FORECAST MODAL
         ========================= */}
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
                        background:
                            'linear-gradient(145deg, rgba(25,118,210,0.9) 0%, rgba(33,150,243,0.9) 100%)'
                    }}
                >
                    {/* Modal Title & Share Button */}
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
                            <ListItemIcon sx={{ color: '#000' }}>
                                <Message fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Text Message</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('whatsapp')}>
                            <ListItemIcon sx={{ color: '#25D366' }}> {/* WhatsApp Green */}
                                <WhatsApp fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>WhatsApp</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('facebook')}>
                            <ListItemIcon sx={{ color: '#1877F2' }}> {/* Facebook Blue */}
                                <Facebook fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Facebook</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('twitter')}>
                            <ListItemIcon sx={{ color: '#1DA1F2' }}> {/* Twitter Blue */}
                                <Twitter fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Twitter</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('telegram')}>
                            <ListItemIcon sx={{ color: '#0088CC' }}> {/* Telegram Blue */}
                                <Telegram fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Telegram</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={() => handlePlatformShare('copy')}>
                            <ListItemIcon sx={{ color: '#000' }}>
                                <Attachment fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Copy to Clipboard</ListItemText>
                        </MenuItem>
                    </Menu>

                    {/* 3-Hour Forecast List */}
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

export default WeatherDetailsUI;
