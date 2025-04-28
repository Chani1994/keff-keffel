import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminHome = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');  // שדה טלפון חדש
  const [error, setError] = useState('');  // מצב עבור הודעות שגיאה
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log('Sending request to server...');
    console.log('Name:', name);
    console.log('Phone:', phone);

    try {
      const response = await fetch('http://localhost:5245/api/AdminControllers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('לא ניתן לטעון את רשימת המנהלים');
      }

      const admins = await response.json();
      console.log('Admins fetched:', admins);

      if (admins.length === 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'אין מנהלים במערכת',
          text: 'לא נמצאו מנהלים רשומים. פנה למנהל המערכת.',
          confirmButtonText: 'אישור'
        });
        return;
      }

      const adminExact = admins.find(
        (a) => a.nameAdmin === name && a.phoneAdmin === phone
      );

      if (adminExact) {
        // 💥 הוספה כאן: שמירת מנהל מחובר
        localStorage.setItem('adminId', adminExact.id);  // תוקן לשמירה על ID של המנהל הספציפי
        localStorage.setItem('adminName', adminExact.nameAdmin);

        await Swal.fire({
          icon: 'success',
          title: 'ברוך הבא!',
          text: `שלום ${adminExact.nameAdmin}, התחברת בהצלחה.`,
          confirmButtonText: 'המשך'
        });

        navigate('/admin');
        return;
      }

      // בודקים אם יש התאמה רק בשם או רק בנייד
      const adminPartial = admins.find(
        (a) => a.nameAdmin === name || a.phoneAdmin === phone
      );

      if (adminPartial) {
        await Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'שם משתמש או טלפון שגויים',
          confirmButtonText: 'נסה שוב'
        });
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'מנהל לא רשום',
          text: 'שם המשתמש והטלפון אינם רשומים במערכת',
          confirmButtonText: 'אישור'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'שגיאת מערכת',
        text: error.message || 'אירעה שגיאה לא צפויה',
        confirmButtonText: 'אישור'
      });
    }
  };

  return (
    <div>
      <h1>Admin Home</h1>
      <form>
        <label>שם:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="הכנס שם"
        /><br />

        <label>טלפון:</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"  // מאפשר למשתמש להקליד טלפון בצורה נכונה
          placeholder="הכנס טלפון"
        /><br />

        <button type="button" onClick={handleLogin}>הכנס</button>
      </form>

      {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}  {/* הצגת שגיאה אם יש */}
    </div>
  );
};

export default AdminHome;





// import React from 'react';
// import { observer } from "mobx-react"
// import { Button, TextField, Box } from '@mui/material';
// import IconButton from '@mui/material/IconButton';
// import Input from '@mui/material/Input';
// import InputAdornment from '@mui/material/InputAdornment';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import { useState } from 'react'
// import { CheckLogin } from "../../store/adminLogin.js"
// const AdminHome = (observer(() => {
//   const [name, setName] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = React.useState(false);
//   const handleLogin = () => {
//     CheckLogin(name, password);
//     setName(''); setPassword('');
//   }
//   const handleClickShowPassword = () => setShowPassword((show) => !show);
//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };
//   return (<>
//     <Box sx={{
//       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//       minHeight: '100vh', backgroundColor: 'rgb(10, 18, 89)',
//     }} >
//       <Box component="form" sx={{
//         display: 'flex', flexDirection: 'column',
//         p: '2rem', boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
//         borderRadius: '8px', maxWidth: '400px', minWidth: '300px',
//         border: '10px solid rgb(152, 128, 9)', backgroundColor: 'white',
//       }} >
       
//         <TextField margin="normal" noValidate sx={{ mt: 1 }} type='text' value={name} onChange={(e) => setName(e.target.value)}
//           id="input-with-icon-textfield" label="  Name"
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="start" ><AccountCircle /> </InputAdornment>),
//           }} variant="standard" /><br />
//         <FormControl margin="normal" noValidate sx={{ mt: 1 }} value={password} onChange={(e) => setPassword(e.target.value)} variant="standard" >
//           <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
//           <Input id="standard-adornment-password" type={showPassword ? 'text' : 'password'}
//             endAdornment={<InputAdornment position="end">
//               <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} >
//                 {showPassword ? <VisibilityOff /> : <Visibility />} </IconButton> </InputAdornment>} />
//         </FormControl> <br />  <div className='sing-in'>
//           <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>Sign In</Button>
//         </div></Box> </Box>    </>
//   )
// }))
// export default AdminHome