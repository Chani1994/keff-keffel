import React from 'react';
import { Box, Typography, IconButton, Link } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Tooltip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // או Email

// כפתור טלפון
const PhoneButton = () => {
  const handleClick = (e) => {
    e.preventDefault();
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = 'tel:0504163893';
    } else {
      alert('אפשרות זו זמינה רק דרך טלפון נייד');
    }
  };

  return (
    <IconButton
      onClick={handleClick}
      title="050-4163893"
      sx={{
        color: '#ffffff',
        transition: 'all 0.3s ease',
        '&:hover': {
          color: '#4caf50',
          transform: 'scale(1.2)',
          boxShadow: '0 0 10px #4caf50, 0 0 20px #4caf50',
        },
      }}
    >
      <PhoneIcon />
    </IconButton>
  );
};

// סגנון אייקונים
const iconButtonStyle = (color, glowColor) => ({
  color: color,
  transition: 'all 0.3s ease',
  '&:hover': {
    color: glowColor,
    transform: 'scale(1.2)',
    boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
  },
});

// קומפוננטת Footer
const Footer = () => {
  return (
    <Box sx={{ position: 'relative' }}>
      {/* פס גרדיאנט צבעוני למעלה */}
      <Box
        sx={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107, #4caf50, #ff5722, #9c27b0)',
        }}
      />

      {/* תוכן הפוטר */}
      <Box
        sx={{
          backgroundColor: '#000000',
          color: '#ffffff',
          py: 2,
          px: 2,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" sx={{ fontSize: '16px', ml: 2 }}>
          כל הזכויות שמורות © {new Date().getFullYear()}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
         <Tooltip title="מעונות עזרא 53 בני ברק" arrow>
  <IconButton
    component="a"
    href="https://maps.google.com/?q=מעונות עזרא 53 בני ברק"
    target="_blank"
    rel="noopener"
    sx={iconButtonStyle('#ffffff', '#00bcd4')}
  >
    <LocationOnIcon />
  </IconButton>
</Tooltip>

          <IconButton
            component={Link}
            href="mailto:masa.kaful@gmail.com"
            title="masa.kaful@gmail.com"
            target="_blank"
            rel="noopener"
            sx={iconButtonStyle('#ffffff', '#e91e63')}
          >
            <EmailIcon />
          </IconButton>

          <PhoneButton />
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
