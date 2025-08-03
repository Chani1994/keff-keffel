import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import adminStore from '../../store/adminStore';
import '../../css/login.css';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('אנא מלא את כל השדות');
      return;
    }
    try {
      await adminStore.login({ nameAdmin: username, password }, navigate);
    } catch (err) {
      setError('שגיאה בהתחברות');
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
          התחברות מנהל
        </Typography>

        <TextField
          label="שם משתמש"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-textfield"
          inputProps={{ 'aria-label': 'שם משתמש', style: { textAlign: 'right' } }}
        />

        <TextField
          label="סיסמה"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-textfield"
          inputProps={{ 'aria-label': 'סיסמה', style: { textAlign: 'right' } }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          שכחת סיסמא?{' '}
          <Link
            component="button"
            onClick={() => navigate('/')}
            className="login-register-link"
          >
            איפוס סיסמא
          </Link>
        </Typography> */}
      </Paper>
    </Box>
  );
}

export default AdminLogin;
