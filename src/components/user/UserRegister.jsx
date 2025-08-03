import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import schoolStore from '../../store/schoolStore';
import userStore from '../../store/userStore';
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
import '../../css/login.css';

const UserRegister = observer(() => {
  const [user, setUser] = useState({
    name: '',
    school: '',
    classes: '',
    phone: '',
    status: '',
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (schoolStore.schools.length === 0 && !schoolStore.loading) {
      schoolStore.fetchSchools();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = 'שם נדרש';
    if (!user.classes.trim()) newErrors.classes = 'כיתה נדרשת';
    if (!user.phone.trim()) newErrors.phone = 'טלפון דרוש';
    else if (!/^0[2-9]\d{7,8}$/.test(user.phone)) newErrors.phone = 'מספר טלפון לא תקין';
    if (!user.status) newErrors.status = 'יש לבחור מין';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayClick = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setErrors(prev => ({ ...prev, form: 'יש למלא את כל השדות כראוי' }));
      return;
    }

    try {
      const userWithStatus = { ...user };

      // שמירת המשתמש לזיכרון זמני
      localStorage.setItem('pendingUser', JSON.stringify(userWithStatus));

      // כתובת החזרה לאחר התשלום
      const returnUrl = encodeURIComponent(window.location.origin + '/user/register?paid=true');

      // פתיחת חלון תשלום חדש
      const paymentWindow = window.open(
        `https://www.matara.pro/nedarimplus/online/?S=VOgq&ReturnUrl=${returnUrl}`,
        'PaymentWindow',
        'width=600,height=700'
      );

      // בדיקה מתי החלון נסגר
      const timer = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(timer);
          const savedUser = localStorage.getItem('pendingUser');
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            userStore.finishRegistration(parsedUser, navigate);
            localStorage.removeItem('pendingUser');
          }
        }
      }, 1000);

    } catch (error) {
      console.error('Payment initiation error:', error);
      setErrors(prev => ({ ...prev, form: 'אירעה שגיאה בתהליך התשלום. נסה שוב.' }));
    }
  };

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const paid = params.get('paid');
  if (paid === 'true') {
    const savedUser = localStorage.getItem('pendingUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      const today = new Date();
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

      const fullUser = {
        ...parsedUser,
        startDate: today.toISOString(),
        endDate: threeMonthsLater.toISOString(),
        active: true,
      };

      userStore.finishRegistration(fullUser, navigate);
      localStorage.removeItem('pendingUser');
    }
  }
}, [navigate]);


  return (
    <Box className="login-page" component="form" noValidate onSubmit={handlePayClick}>
<Paper  sx={{
                p: 4,
width: '500px',
maxWidth: '60vw',
                maxHeight: '90vh',
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                color: '#333',
                overflowY: 'hidden',
                boxShadow:
                  '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1, 0 0 20px #e91e63',
                zIndex: 2,
                // display: 'flex',
                // flexDirection: 'column',
              }}
  >        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Typography variant="h5" className="login-title" component="div">
            הרשמה
          </Typography>
          <img src="/logo1.png" alt="לוגו" style={{ width: 70, height: 'auto' }} />
        </Box>

        <Grid container spacing={2} justifyContent="center">
          {/* שורה 1: שם מלא + כיתה */}
          <Grid item xs={12} md={6}>
            <TextField
              label="שם מלא"
              name="name"
              variant="outlined"
              fullWidth
              value={user.name}
              onChange={handleChange}
              inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'שם מלא' }}
              error={!!errors.name}
              helperText={errors.name}
              className="login-textfield"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="כיתה"
              name="classes"
              variant="outlined"
              fullWidth
              value={user.classes}
              onChange={handleChange}
              inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'כיתה' }}
              error={!!errors.classes}
              helperText={errors.classes}
              className="login-textfield"
            />
          </Grid>

          {/* שורה 2: טלפון + בית ספר */}
          <Grid item xs={12} md={6}>
            <TextField
              label="טלפון"
              name="phone"
              variant="outlined"
              fullWidth
              value={user.phone}
              onChange={handleChange}
              inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'טלפון' }}
              error={!!errors.phone}
              helperText={errors.phone}
              className="login-textfield"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="בית-ספר (אופציונלי)"
              name="school"
              variant="outlined"
              fullWidth
              value={user.school}
              onChange={handleChange}
              inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'בית-ספר' }}
              SelectProps={{ native: true }}
              disabled={schoolStore.loading}
              className="login-textfield"
            >
              <option value=""> </option>
              {schoolStore.schools.map((school) => (
                <option key={school.id} value={school.nameSchool}>
                  {school.nameSchool} - {school.barcode}
                </option>
              ))}
            </TextField>
          </Grid>

          {/* שורה 3: מין */}
          <Grid item xs={12} md={8}>
            <TextField
              select
              label="מין"
              name="status"
              variant="outlined"
              fullWidth
              value={user.status?? 2}
              onChange={handleChange}
              inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'מין' }}
              error={!!errors.status}
              helperText={errors.status}
              SelectProps={{ native: true }}
              className="login-textfield"
            >
              <option value="" disabled>בחר מין</option>
              <option value={1}>זכר</option>
              <option value={2}>נקבה</option>
            </TextField>
          </Grid>
        </Grid>

        {errors.form && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {errors.form}
          </Typography>
        )}

        <Button fullWidth type="submit" className="login-button">
          לתשלום והרשמה
        </Button>

        <Typography variant="body2" className="login-register">
          יש לך חשבון?{' '}
          <Link component="button" 
          onClick={() => navigate('/user/login')} 
          className="login-register-link"
          >

            התחבר כאן
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
});

export default UserRegister;


// import React, { useState } from 'react';
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper,
//   Link,
//   Grid,
// } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import userStore from '../../store/userStore';
// import '../../css/login.css';

// const UserRegister = () => {
//   const [user, setUser] = useState({
//     name: '',
//     school: '',
//     classes: '',
//     phone: '',
//   });
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setUser({ ...user, [name]: value });
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!user.name.trim()) newErrors.name = 'שם נדרש';
//     if (!user.school.trim()) newErrors.school = 'בית ספר נדרש';
//     if (!user.classes.trim()) newErrors.classes = 'לימודים נדרשת';
//     if (!user.phone.trim()) newErrors.phone = 'טלפון דרוש';
//     else if (!/^0[2-9]\d{7,8}$/.test(user.phone)) newErrors.phone = 'מספר טלפון לא תקין';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       setErrors(prev => ({ ...prev, form: 'יש למלא את כל השדות כראוי' }));
//       return;
//     }
//     userStore.register(user, navigate);
//   };

//   return (
//   <Box className="login-page" component="form" noValidate onSubmit={handleSubmit}>
//   <Paper className="login-box login-box-wide">
//     <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
//       <img src="/logo1.png" alt="לוגו" style={{ width: 120 }} />
//     </Box>

//     <Typography variant="h5" gutterBottom className="login-title">
//       הרשמה
//     </Typography>

//     <Grid container spacing={2} justifyContent="center">
//       <Grid item xs={12}>
//         <TextField
//           label="שם מלא"
//           name="name"
//           variant="outlined"
//           fullWidth
//           className="login-textfield"
//           value={user.name}
//           onChange={handleChange}
//           inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'שם מלא' }}
//           error={!!errors.name}
//           helperText={errors.name}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           label="בית-ספר"
//           name="school"
//           variant="outlined"
//           fullWidth
//           className="login-textfield"
//           value={user.school}
//           onChange={handleChange}
//           inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'בית-ספר' }}
//           error={!!errors.school}
//           helperText={errors.school}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           label="כיתה"
//           name="classes"
//           variant="outlined"
//           fullWidth
//           className="login-textfield"
//           value={user.classes}
//           onChange={handleChange}
//           inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'כיתה' }}
//           error={!!errors.classes}
//           helperText={errors.classes}
//         />
//       </Grid>

//       <Grid item xs={12}>
//         <TextField
//           label="טלפון"
//           name="phone"
//           variant="outlined"
//           fullWidth
//           className="login-textfield"
//           value={user.phone}
//           onChange={handleChange}
//           inputProps={{ style: { textAlign: 'right' }, 'aria-label': 'טלפון' }}
//           error={!!errors.phone}
//           helperText={errors.phone}
//         />
//       </Grid>
//     </Grid>

//     {errors.form && (
//       <Typography color="error" align="center" sx={{ mt: 2 }}>
//         {errors.form}
//       </Typography>
//     )}

//     <Button fullWidth type="submit" className="login-button">
//       הרשמה
//     </Button>

//     <Typography variant="body2" className="login-register">
//       יש לך חשבון?{' '}
//       <Link
//         component="button"
//         onClick={() => navigate('/user/login')}
//         className="login-register-link"
//       >
//         התחבר כאן
//       </Link>
//     </Typography>
//   </Paper>
// </Box>

//   );
// };

// export default UserRegister;
