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
import '../../css/login.css';

function UserLogin() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    setError('');
    if ( !phone) {
      setError('אנא מלא את כל השדות');
      return;
    }

    try {
       userStore.loginByPhone(phone, navigate);
    } catch (err) {
      setError('שגיאה בהתחברות. ודא שהפרטים נכונים.');
    }
  };

  return (
<Box className="login-page" component="form" noValidate>
<Paper className="login-box login-box-narrow"  sx={{
                p: 4,
                width: 1000,
                maxHeight: '70vh',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                color: '#333',
                overflowY: 'hidden',
                boxShadow:
                  '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1, 0 0 20px #e91e63',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
  >
        <img src="/logo1.png" alt="לוגו כיף כפל" className="login-logo" />

        <Typography variant="h5" gutterBottom className="login-title">
          התחברות משתמש
        </Typography>

        {/* <TextField
          label="שם משתמש"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-textfield"
        /> */}

        <TextField
          label="טלפון"
          variant="outlined"
          fullWidth
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="login-textfield"
        />

        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Button fullWidth onClick={handleLogin} className="login-button">
          התחבר
        </Button>

        {/* <Typography variant="body2" className="login-register">
          אין לך חשבון?{' '}
          <Link 
            component="button"
            onClick={() => navigate('/user/register')}
            className="login-register-link"
          >
            הרשם כאן
          </Link>
        </Typography> */}
      </Paper>
    </Box>
  );
}

export default UserLogin;
