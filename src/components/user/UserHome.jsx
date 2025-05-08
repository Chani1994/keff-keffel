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

function UserHome() {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    userStore.login({ username, phone }, navigate);
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
          label="שם"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <TextField
          label="טלפון"
          variant="outlined"
          fullWidth
          margin="normal"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
            הרשם כאן
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default UserHome;
