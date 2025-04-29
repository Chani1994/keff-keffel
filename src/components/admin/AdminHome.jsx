import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import adminStore from '../../store/adminStore';

const AdminHome = observer(() => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminStore.login(navigate);
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>התחברות למנהל</h2>
      <form onSubmit={handleSubmit}>
        <label>שם משתמש:</label><br />
        <input
          type="text"
          value={adminStore.name}
          onChange={(e) => adminStore.setName(e.target.value)}
          placeholder="שם"
        /><br /><br />

        <label>סיסמה:</label><br />
        <input
          type="password"
          value={adminStore.password}
          onChange={(e) => adminStore.setPassword(e.target.value)}
          placeholder="סיסמה"
        /><br /><br />

        <button type="submit">כניסה</button>
      </form>

      {adminStore.error && (
        <div style={{ color: 'red', marginTop: '10px' }}>{adminStore.error}</div>
      )}
    </div>
  );
});

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