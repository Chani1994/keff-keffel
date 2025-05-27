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
    minHeight: '100vh',
    width: '100vw',
    background: 'radial-gradient(circle at center, #121212, #000000)',
    overflow: 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
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
          הרשמה
        </Typography>
<form onSubmit={handleSubmit}>
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2, // רווח בין השדות
      justifyContent: 'space-between',
    }}
  >
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
          '& .MuiOutlinedInput-input': {
    color: '#000000',  // הצבע של הטקסט בתוך השדה - שחור
  },
        }}
        sx={{
          direction: 'rtl',
          flex: '1 1 45%', // תופס בערך חצי רוחב עם גמישות
          minWidth: '150px', // מינימום רוחב לשדה
          '& .MuiOutlinedInput-root': {
            color: '#eee',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            '& fieldset': { borderColor: 'transparent' },
            '&:hover fieldset': {
              borderColor: '#00bcd4',
              boxShadow: '0 0 10px #00bcd4',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'black',
              boxShadow: '0 0 12px #00bcd4',
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
      border: '2px solid #00bcd4',
      color: '#00bcd4',
      background: 'transparent',
      boxShadow: '0 0 8px #00bcd4',
      fontWeight: 600,
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      '&:hover': {
        backgroundColor: '#00bcd4',
        color: '#fff',
        boxShadow: '0 0 20px #00bcd4',
        borderColor: '#00bcd4',
        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      },
    }}
  >
    הרשמה
  </Button>
</form>

        <Typography variant="body2" align="center" sx={{ mt: 3, color: '#00bcd4' }}>
          יש לך חשבון?{' '}
          <Link
            component="button"
            onClick={() => navigate('/user/login')}
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
            התחבר כאן
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserRegister;
