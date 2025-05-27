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
  const navigate = useNavigate();

  const handleLogin = () => {
    adminStore.login({ username, password }, navigate);
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
      }}
    >
      <Paper
        elevation={6}
        sx={{
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
          התחברות מנהל
        </Typography>

        {/* שם משתמש */}
        <TextField
          label="שם משתמש"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          inputProps={{ style: { textAlign: 'right' } }}
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
              color: '#eee',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#00bcd4', boxShadow: '0 0 10px #00bcd4' },
              '&.Mui-focused fieldset': { borderColor: 'black', boxShadow: '0 0 12px #00bcd4' },
            },
            '& .MuiInputLabel-root': {
              transformOrigin: 'top right',
            },
            '& .MuiInputLabel-shrink': {
              transform: 'translate(0, -8px) scale(0.75)',
            },
          }}
        />

        {/* סיסמה */}
        <TextField
          label="סיסמה"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ style: { textAlign: 'right' } }}
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
              color: '#eee',
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: '#00bcd4', boxShadow: '0 0 10px #00bcd4' },
              '&.Mui-focused fieldset': { borderColor: 'black', boxShadow: '0 0 12px #00bcd4' },
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
            '&:hover': {
              backgroundColor: '#00bcd4',
              color: '#fff',
              boxShadow: '0 0 20px #00bcd4',
              borderColor: '#00bcd4',
              background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
            },
          }}
        >
          התחבר
        </Button>

        {/* אופציונלי: קישור לעמוד אחר */}
        <Typography variant="body2" align="center" sx={{ mt: 3, color: '#00bcd4' }}>
          שכחת סיסמא?{' '}
          <Link
            component="button"
            onClick={() => navigate('/')}
            sx={{
              fontWeight: 'bold',
              textDecoration: 'underline',
              background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              '&:hover': {
                textDecoration: 'none',
                WebkitTextFillColor: '#00ffff',
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
