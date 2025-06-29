import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Paper,
  TextField,
  Typography,
  Grid,
  Button,
} from '@mui/material';

const EditUserDetails = observer(({ closeDialog }) => {
  const [user, setUser] = useState({
    name: '',
    school: '',
    classes: '',
    phone: '',
    points: 0,
    timeLessons: 0,
    success: true,
    index: 0,
    status:1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (userStore.currentUser) {
      setUser(userStore.currentUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === 'points' || name === 'timeLessons' ? +value : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userStore.updateUser(user, navigate);
  };

  return (
<Box
  sx={{
    maxHeight: '85vh',
    overflowY: 'auto',
    padding: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box',
  }}
>

  {/* לוגו ברקע */}
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '50vw',
      height: '40vh',
      backgroundImage: 'url("/logo3.png")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      opacity: 0.05,
      pointerEvents: 'none',
      zIndex: 0,
    }}
  />

  {/* תוכן מעל הלוגו */}
  <Box
    sx={{
      position: 'relative',
      zIndex: 1,
      width: '100%',
      maxWidth: 800,
       maxHeight: 300,

    }}
  >
    {/* כותרת ולוגו */}
    <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
      <img src="/logo1.png" alt="לוגו" style={{ width: 60 }} />
      <Typography
        variant="h4"
        sx={{
          fontWeight:'bold',
          background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        עריכת פרטי משתמש
      </Typography>
    </Box>

    {/* טופס */}
    <form onSubmit={handleSubmit} autoComplete="off">
     <Grid container spacing={2} justifyContent="center">
  {[
        { name: 'classes', label: 'כיתה' },

    { name: 'school', label: 'מוסד' },
        { name: 'name', label: 'שם מלא' },

    { name: 'phone', label: 'טלפון' },
  ].map((field) => (
    <Grid item xs={12} sm={6} key={field.name}>
      <TextField
        fullWidth
        label={field.label}
        name={field.name}
        value={user[field.name]}
        onChange={handleChange}
        variant="outlined"
        inputProps={{ style: { textAlign: 'right' } }}
        required
        sx={{
          direction: 'rtl',
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            '& fieldset': {
              borderColor: '#ddd',
            },
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
      />
    </Grid>
  ))}
</Grid>


<Box sx={{ mt: 2, textAlign: 'center' }}>
  
<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
    <Button
    onClick={closeDialog}
    sx={{
      borderRadius: '50px',
      border: '2px solid #999',
      color: '#999',
      background: 'transparent',
      fontWeight: 600,
      fontSize: '1rem',
      boxShadow: '0 0 8px #ccc',
      px: 4,
      py: 1.5,
      textTransform: 'none',
      '&:hover': {
        backgroundColor: '#f0f0f0',
        color: '#555',
        borderColor: '#888',
        boxShadow: '0 0 12px #e91e63',
      },
    }}
  >
    ביטול
  </Button>
  <Button
    type="submit"
    variant="contained"
    sx={{
      borderRadius: '50px',
      border: '2px solid #e91e63',
      color: '#e91e63',
      background: 'transparent',
      fontWeight: 600,
      fontSize: '1rem',
      boxShadow: '0 0 8px #e91e63',
      px: 4,
      py: 1.5,
      textTransform: 'none',
      '&:hover': {
        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
        color: '#fff',
        borderColor: '#e91e63',
        boxShadow: '0 0 20px #e91e63',
      },
    }}
  >
    שמור שינויים
  </Button>


</Grid>

</Box>

    </form>
  </Box>
</Box>

  );
});

export default EditUserDetails;
