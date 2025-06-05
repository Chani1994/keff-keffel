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
import adminStore from '../../store/adminStore';
import '../../css/home.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('אנא מלא את כל השדות');
      return;
    }
    try {
      await adminStore.login({ nameAdmin: username, password },navigate);
      
    } catch (err) {

    }
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
        backgroundColor: '#000000',
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80vw',
          height: '80vh',
          backgroundImage: 'url("/logo3.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          opacity: 0.05,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 10,
        },
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 350,
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          color: '#333',
          boxShadow: `
            0 0 10px #e91e63,
            0 0 20px #ff9800,
            0 0 30px #ffc107,
            0 0 80px #4dd0e1,
            0 0 20px #e91e63
          `,
          zIndex: 2,
        }}
      >
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
          התחברות מנהל
        </Typography>

        <TextField
          label="שם משתמש"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'שם משתמש' }}
          InputLabelProps={{
            sx: {
              right: 16,
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
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              '& fieldset': { borderColor: '#ddd' },
              '&:hover fieldset': {
                borderColor: '#e91e63',
                boxShadow: '0 0 10px #e91e63',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
                boxShadow: '0 0 12px #e91e63',
              },
            },
          }}
        />

        <TextField
          label="סיסמה"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'סיסמה' }}
          InputLabelProps={{
            sx: {
              right: 16,
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
              backgroundColor: '#f9f9f9',
              borderRadius: '10px',
              '& fieldset': { borderColor: '#ddd' },
              '&:hover fieldset': {
                borderColor: '#e91e63',
                boxShadow: '0 0 10px #e91e63',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
                boxShadow: '0 0 12px #e91e63',
              },
            },
          }}
        />

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button
          fullWidth
          onClick={handleLogin}
          className="user-button"
          sx={{
            mt: 3,
            borderRadius: '50px',
            border: '2px solid #e91e63',
            color: '#e91e63',
            background: 'transparent',
            boxShadow: '0 0 8px #e91e63',
            fontWeight: 600,
            fontSize: '1.1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#e91e63',
              color: '#fff',
              boxShadow: '0 0 20px #e91e63',
              borderColor: '#e91e63',
              background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
            },
          }}
        >
          התחבר
        </Button>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: '#e91e63' }}>
          שכחת סיסמא?{' '}
          <Link
            component="button"
            onClick={() => navigate('/')} // לוודא שהנתיב נכון לאיפוס סיסמה
            sx={{
              fontWeight: 'bold',
              textDecoration: 'underline',
              background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&:hover': {
                textDecoration: 'none',
                WebkitTextFillColor: '#00bcd4',
              },
            }}
          >
            איפוס סיסמא
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
