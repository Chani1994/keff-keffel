import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userStore from '../../store/userStore';
import '../../css/home.css'; // ייבוא הסגנונות של דף הבית



function UserHome() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    userStore.login({ username, phone }, navigate);
  };

  return (
    <Box
  className="homepage"
  sx={{
    direction: 'rtl',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'radial-gradient(circle at center, #121212, #000000)',
    overflow: 'hidden',
    position: 'relative', // חשוב להוסיף כדי לאפשר ::before בתוך Box
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '300px',
      height: '300px',
      backgroundImage: 'url("/logo1.png")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      opacity: 0.05,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 1,
    },
  }}
>
  <Paper
    elevation={6}
    sx={{
      position: 'relative', // כדי להיות מעל הרקע
      zIndex: 2,
      p: 4,
      width: 350,
      backgroundColor: 'rgba(18,18,18,0.8)',
      borderRadius: '20px',
      boxShadow: '0 0 25px #00bcd4',
      color: '#eee',
    }}
  >
         {/* לוגו */}
<Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <img src="/logo1.png" alt="לוגו כיף כפל" style={{ width: 120, height: 'auto' }} />
  </Box>

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',

            background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          התחברות 
        </Typography>

 <TextField
  label="שם"
  variant="outlined"
  fullWidth
  margin="normal"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  inputProps={{
    style: {
      textAlign: 'right', // יישור טקסט בתוך השדה
    },
  }}
  InputLabelProps={{
    sx: {
      right: 16, // יישור התווית לימין
      left: 'auto',
      transformOrigin: 'top right',
      background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
    },
  }}
  sx={{
    direction: 'rtl',
    '& .MuiOutlinedInput-root': {
      color: '#eee',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '10px',
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: '#00bcd4',
        boxShadow: '0 0 10px #00bcd4',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        boxShadow: '0 0 12px #00bcd4',
      },
    },
    '& .MuiInputLabel-root': {
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0, -8px) scale(0.75)',
    },
  }}
/>


<TextField
  label="טלפון"
  variant="outlined"
  fullWidth
  margin="normal"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  inputProps={{
    style: {
      textAlign: 'right', // יישור טקסט בתוך השדה
    },
  }}
  InputLabelProps={{
    sx: {
      right: 16, // יישור התווית לימין
      left: 'auto',
      transformOrigin: 'top right',
      background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 'bold',
    },
  }}
  sx={{
    direction: 'rtl',
    '& .MuiOutlinedInput-root': {
      color: '#eee',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '10px',
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: '#00bcd4',
        boxShadow: '0 0 10px #00bcd4',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
        boxShadow: '0 0 12px #00bcd4',
      },
    },
    '& .MuiInputLabel-root': {
      transformOrigin: 'top right',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(0, -8px) scale(0.75)',
    },
  }}
/>




    <Button
  fullWidth
  onClick={handleLogin}
  className="user-button"
  sx={{
    mt: 3,
    borderRadius: '50px',
    border: '2px solid #00bcd4',
    color: '#00bcd4',
    background: 'transparent',
    boxShadow: '0 0 8px #00bcd4',
    fontWeight: 600,
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    outline: 'none', // ביטול פס כחול
    '&:hover': {
      backgroundColor: '#00bcd4',
      color: '#fff',
      boxShadow: '0 0 20px #00bcd4',
      borderColor: '#00bcd4',
      background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',

    },
    '&:focus': {
      outline: 'none',
    },
  }}
>
  התחבר
</Button>


<Typography
  variant="body2"
  align="center"
  sx={{ mt: 3, color: '#00bcd4' }}
>
  אין לך חשבון?{' '}
  <Link
    component="button"
    onClick={() => navigate('/user/register')}
    sx={{
      outline: 'none',
  border: 'none',
  boxShadow: 'none',
  '&:focus': {
    outline: 'none',
    border: 'none',
    boxShadow: 'none',
  },
  '&:active': {
    outline: 'none',
    border: 'none',
    boxShadow: 'none',
  },
      fontWeight: 'bold',
      textDecoration: 'underline',
      background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        textDecoration: 'none', // <--- זה מונע את הקו התחתון במעבר
        background: 'none',
        WebkitBackgroundClip: 'initial',
        WebkitTextFillColor: '#00ffff', // טורקיז מלא
        color: '#00bcd4', // תוקן גם פה – הסרת סימן # מיותר
      },
    }}
  >
    הרשם כאן
  </Link>
</Typography>

      </Paper>
    </Box>
  );
}

export default UserHome;
