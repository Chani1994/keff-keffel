import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import userStore from '../../store/userStore';
import '../../css/login.css';

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
    if (!user.classes.trim()) newErrors.classes = 'לימודים נדרשת';
    if (!user.phone.trim()) newErrors.phone = 'טלפון דרוש';
    else if (!/^0[2-9]\d{7,8}$/.test(user.phone)) newErrors.phone = 'מספר טלפון לא תקין';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setErrors(prev => ({ ...prev, form: 'יש למלא את כל השדות כראוי' }));
      return;
    }
    userStore.register(user, navigate);
  };

  return (
   <Box className="login-page" component="form" noValidate>

<Paper className="login-box login-box-wide" >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <img src="/logo1.png" alt="לוגו" style={{ width: 120 }} />
        </Box>

              <Typography variant="h5" gutterBottom className="login-title">
      
          הרשמה
        </Typography>

<form
  onSubmit={handleSubmit}
 
>
<Grid container spacing={2} justifyContent="center">
<Grid item xs={12}>
              <TextField
  label="שם מלא"
  name="name"
  variant="outlined"
  fullWidth
    className="login-textfield"  // 👈 חשוב!

  value={user.name}
  onChange={handleChange}
  inputProps={{
    style: { textAlign: 'right' },
    'aria-label': 'שם מלא',
  }}
  InputLabelProps={{
  
  }}
  error={!!errors.name}
  helperText={errors.name}
  
/>

            </Grid>
<Grid item xs={12}>
              <TextField
  label="בית-ספר"
  name="school"
  variant="outlined"
  fullWidth
    className="login-textfield"  // 👈 חשוב!

  value={user.school}
  onChange={handleChange}
  inputProps={{
    style: { textAlign: 'right' },
    'aria-label': 'בית-ספר',
  }}
  InputLabelProps={{
   
  }}
  error={!!errors.school}
  helperText={errors.school}
  
/>

            </Grid>
<Grid item xs={12}>
             <TextField
  label=" כיתה"
  name="classes"
  variant="outlined"
  fullWidth
    className="login-textfield"  // 👈 חשוב!

  value={user.classes}
  onChange={handleChange}
  inputProps={{
    style: { textAlign: 'right' },
    'aria-label': 'כיתה',
  }}
  InputLabelProps={{
   
  }}
  error={!!errors.classes}
  helperText={errors.classes}
  
/>

            </Grid>
<Grid item xs={12}>
             <TextField
  label="טלפון"
  name="phone"
  variant="outlined"
  fullWidth
    className="login-textfield"  // 👈 חשוב!

  value={user.phone}
  onChange={handleChange}
  inputProps={{
    style: { textAlign: 'right' },
    'aria-label': 'טלפון ',
  }}
  InputLabelProps={{
    
  }}
  error={!!errors.phone}
  helperText={errors.phone}
  
/>

            </Grid>
          </Grid>
 {errors.form && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {errors.form}
          </Typography>
        )}
           <Button fullWidth onClick={handleSubmit} className="login-button">
         
       
            הרשמה
          </Button>
        </form>

       

                <Typography variant="body2" className="login-register">
        
          יש לך חשבון?{' '}
          <Link
            component="button"
            onClick={() => navigate('/user/login')}
            className="login-register-link"

          >
            התחבר כאן
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default UserRegister;
