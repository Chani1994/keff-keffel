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
  // קומפוננטה להתחברות משתמש לפי טלפון
  const [phone, setPhone] = useState(''); // שדה טלפון
  const [error, setError] = useState(''); // שדה להודעות שגיאה
  const navigate = useNavigate(); // ניווט בין דפים

  const handleLogin = () => {
    setError(''); // מאפס הודעת שגיאה קודם כל

    if (!phone) {
      // בדיקה אם השדה ריק
      setError('אנא מלא את כל השדות'); // מציג הודעת שגיאה למשתמש
      return;
    }

    try {
      // מנסה להתחבר עם המספר טלפון
      userStore.loginByPhone(phone, navigate); // פונקציה ב-store שמבצעת התחברות
    } catch (err) {
      // במקרה של שגיאה במהלך ההתחברות
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
