import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const AdminHome = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/admin');
  };

  return (
    <div>
      <h1>Admin Home</h1>
      <form>
        <label>שם משתמש:</label>
        <input value={name} onChange={(e) => setName(e.target.value)} /><br />
        <label>סיסמה:</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" /><br />
        <button type="button" onClick={handleLogin}>הכנס</button>
      </form>
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