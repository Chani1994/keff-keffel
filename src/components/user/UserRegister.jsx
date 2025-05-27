import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userStore from '../../store/userStore';
import '../../css/home.css';

const UserRegister = () => {
  const [user, setUser] = useState({
    name: '',
    school: '',
    classes: '',
    phone: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = 'שם נדרש';
    if (!user.school.trim()) newErrors.school = 'בית ספר נדרש';
    if (!user.classes.trim()) newErrors.classes = 'כיתה נדרשת';
    if (!user.phone.trim()) newErrors.phone = 'טלפון נדרש';
    else if (!/^0[2-9]\d{7,8}$/.test(user.phone)) newErrors.phone = 'מספר טלפון לא תקין';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setErrors(prev => ({ ...prev, form: 'יש למלא את כל השדות הנדרשים כראוי' }));
      return;
    }
    userStore.register(user, navigate);
  };

  return (
    <Box
  sx={{
    direction: 'rtl',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000000',
    overflow: 'hidden',
    position: 'relative',
  }}
>
  {/* רקע לוגו חצי שקוף */}
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vw',
      height: '80vh',
      backgroundImage: 'url("/logo3.png")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      opacity: 0.05,
      pointerEvents: 'none',
      zIndex: 1,
    }}
  />
  
  {/* טופס */}
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

        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          הרשמה
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['name', 'school', 'classes', 'phone'].map((field) => (
              <TextField
                key={field}
                label={
                  field === 'name'
                    ? 'שם מלא'
                    : field === 'school'
                    ? 'בית ספר'
                    : field === 'classes'
                    ? 'כיתה'
                    : 'טלפון'
                }
                variant="outlined"
                name={field}
                value={user[field]}
                onChange={handleChange}
                error={!!errors[field]}
                helperText={errors[field]}
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
            ))}
          </Box>

          <Button
            type="submit"
            fullWidth
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
            הרשמה
          </Button>
        </form>

        {errors.form && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {errors.form}
          </Typography>
        )}

        <Typography variant="body2" align="center" sx={{ mt: 3, color: '#e91e63' }}>
          יש לך חשבון?{' '}
          <Link
            component="button"
            onClick={() => navigate('/user/login')}
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
            התחבר כאן
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserRegister;
