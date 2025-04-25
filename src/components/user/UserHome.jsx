

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

function UserHome() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // כאן תוסיפי את הלוגיקה שלך להתחברות
    console.log('Username:', username, 'Password:', password);
    navigate('/dashboard'); // לדוגמה
  };

  return (
    <Box
      sx={{
        direction: 'rtl',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f3e5f5',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" gutterBottom align="center">
          התחברות למשתמש
        </Typography>

        <TextField
          label="שם משתמש"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="סיסמה"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          התחבר
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }} align="center">
          אין לך חשבון?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/user/register')}
          >
            משתמש חדש - הרשם כאן
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default UserHome;

