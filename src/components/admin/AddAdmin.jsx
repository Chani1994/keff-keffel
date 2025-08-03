import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  Grid,
  InputLabel,
  Select,
  FormControl,
} from '@mui/material';
import adminStore from '../../store/adminStore';
import schoolStore from '../../store/schoolStore';

const AddAdmin = observer(() => {
  const [nameAdmin, setNameAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const [phoneAdmin, setPhoneAdmin] = useState('');
  const [adminType, setAdminType] = useState(1);
  const [idSchool, setIdSchool] = useState('');
const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setNameAdmin('');
    setPassword('');
    setEmail('');
    setFax('');
    setPhoneAdmin('');
    setAdminType('');
    setIdSchool('');
  }, []);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        await schoolStore.fetchSchools();
      } catch (error) {
        console.error("שגיאה בהבאת מוסדות:", error);
      }
    };
    fetchSchools();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  const errors = [];

  if (!nameAdmin.trim()) errors.push('יש להזין שם מנהל');
  if (!password.trim()) errors.push('יש להזין סיסמה');
  if (!email.trim()) errors.push('יש להזין אימייל');
  if (!phoneAdmin.trim()) errors.push('יש להזין טלפון');
  if (!adminType) errors.push('יש לבחור סוג מנהל');

  if (errors.length > 0) {
    Swal.fire({
      icon: 'warning',
      title: 'שדות חסרים',
      html: errors.map((err) => `<p style="text-align:right">${err}</p>`).join(''),
      confirmButtonText: 'אישור',
    });
    return;
  }

  setLoading(true);

  const newAdmin = {
    nameAdmin,
    password,
    email,
    fax, // יכול להיות ריק
    phoneAdmin,
    idSchool, // יכול להיות ריק
    adminType,
  };

  try {
    await adminStore.addAdmin(newAdmin, navigate);
    Swal.fire({
      icon: 'success',
      title: 'מנהל נוסף בהצלחה!',
      confirmButtonText: 'סגור',
    });

    // איפוס שדות
    setNameAdmin('');
    setPassword('');
    setEmail('');
    setFax('');
    setPhoneAdmin('');
    setIdSchool('');
    setAdminType('');
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'שגיאה',
      text: 'אירעה שגיאה בעת הוספת מנהל',
    });
  } finally {
    setLoading(false);
  }
};
const handleBarcodeScan = (scannedCode) => {
  const school = schoolStore.schools.find(s => s.barcode === scannedCode);
  if (school) {
    setSchoolName(school.name); // זהו השם שתוצג בשדה
    // אפשר גם להכניס את זה ל־userStore.NameSchool אם צריך
  }
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
          zIndex: 10,
        }}
      />

      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '60vw',
          maxHeight: '85vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          color: '#333',
          overflowY: 'auto',
          boxShadow:
            '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1',
          zIndex: 2,
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/logo1.png" alt="לוגו" style={{ width: 120 }} />
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
          }}
        >
          הוספת מנהל חדש
        </Typography>

        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
          <Grid item xs={12} sm={4}>
      <TextField
        label="שם מנהל"
        variant="outlined"
        fullWidth
        autoComplete="new-username"
        value={nameAdmin}
        onChange={(e) => setNameAdmin(e.target.value)}
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
    </Grid>

    <Grid item xs={12} sm={4}>
      <TextField
        label="סיסמה"
        type="password"
        variant="outlined"
        fullWidth
        autoComplete="new-password"
        value={password}
        
        onChange={(e) => setPassword(e.target.value)}
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
    </Grid>


    <Grid item xs={12} sm={4}>
      <TextField
        label="אימייל"
        type="email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
    </Grid>

    {/* שורה שנייה - 2 שדות */}
    <Grid item xs={12} sm={6}>
      <TextField
        label="פקס"
        variant="outlined"
        fullWidth
        value={fax}
        onChange={(e) => setFax(e.target.value)}
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
    </Grid>

    <Grid item xs={12} sm={6}>
      <TextField
        label="טלפון"
        variant="outlined"
        fullWidth
        value={phoneAdmin}
        onChange={(e) => setPhoneAdmin(e.target.value)}
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
    </Grid>
  <Grid container spacing={2} wrap="nowrap" justifyContent="flex-start" alignItems="center">
  {/* <Grid item xs={6} sm={6} sx={{ minWidth: 200 }}> */}
{/* <FormControl fullWidth sx={{ textAlign: 'right' }}>
  <InputLabel
    shrink
    sx={{
      right: 16,
      left: 'auto',
      transformOrigin: 'top right',
      fontWeight: 'bold',
      background: '#fff',
      px: 0.5,
      backgroundImage: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
    }}
  >
    מוסד
  </InputLabel>

  <Select
    value={idSchool}
    onChange={(e) => setIdSchool(e.target.value)}
    displayEmpty
    label="מוסד"
     renderValue={
     idSchool!== "" ? undefined : () => <span style={{ color: '#aaa' }}>בחר מוסד  </span>
  }
    sx={{
      direction: 'rtl',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ddd',
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e91e63',
        boxShadow: '0 0 10px #e91e63',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'white',
        boxShadow: '0 0 12px #e91e63',
      },
      '& .MuiSelect-select': {
        paddingRight: '24px',
        textAlign: 'right',
      },
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          minWidth: 200,
        },
      },
    }}
  >
    <MenuItem value="" disabled>
      בחר מוסד
    </MenuItem>
    {schoolStore.schools.map((school) => (
      <MenuItem key={school.id} value={school.barcode}>
        {school.nameSchool}
      </MenuItem>
    ))}
  </Select>
</FormControl> */}


  {/* </Grid> */}

  <Grid item xs={6} sm={6} sx={{ minWidth: 200 }}>
 <FormControl fullWidth sx={{ textAlign: 'right' }}>
  <InputLabel
    shrink
    sx={{
      right: 16,
      left: 'auto',
      transformOrigin: 'top right',
      fontWeight: 'bold',
      background: '#fff',
      px: 0.5,
      backgroundImage: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
    }}
  >
    סוג מנהל
  </InputLabel>

<Select
  value={adminType}
  onChange={(e) => setAdminType(Number(e.target.value))}
  displayEmpty
  renderValue={
    adminType !== "" ? undefined : () => <span style={{ color: '#aaa' }}>הגדר סוג מנהל</span>
  }
  sx={{
    direction: 'rtl',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ddd',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e91e63',
      boxShadow: '0 0 10px #e91e63',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
      boxShadow: '0 0 12px #e91e63',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
    },
  }}
  // MenuProps={{
  //   PaperProps: {
  //     sx: {
  //       minWidth: 200,
  //     },
  //   },
  // }}
>
   <MenuItem value="" disabled>
       הגדר סוג מנהל
    </MenuItem>
  <MenuItem value={1}>מנהל ראשי</MenuItem>
  <MenuItem value={2}>מנהל מוסד</MenuItem>
  <MenuItem value={3}>מנהל כיתה</MenuItem>
</Select>

</FormControl>

  </Grid>
</Grid>

<Grid container spacing={2} direction="column">
  <Grid container spacing={2} wrap="nowrap" justifyContent="flex-start" alignItems="center">
    {/* הסלקטים כאן - 2 פריטים בשורה */}
    <Grid item xs={6} sm={6} sx={{ minWidth: 200 }}>
      {/* Select מוסד */}
    </Grid>
    <Grid item xs={6} sm={6} sx={{ minWidth: 200 }}>
      {/* Select סוג מנהל */}
    </Grid>
  </Grid>
{adminType !=1  &&(
  <Grid item xs={6} sm={6} sx={{ minWidth: 200 }}>
    <FormControl fullWidth sx={{ textAlign: 'right' }}>
      <InputLabel
        shrink
        sx={{
          right: 16,
          left: 'auto',
          transformOrigin: 'top right',
          fontWeight: 'bold',
          background: '#fff',
          px: 0.5,
          backgroundImage: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }}
      >
        מוסד
      </InputLabel>

      <Select
        value={idSchool}
        onChange={(e) => setIdSchool(e.target.value)}
        displayEmpty
        label="מוסד"
        renderValue={
          idSchool !== "" ? undefined : () => <span style={{ color: '#aaa' }}>בחר מוסד</span>
        }
    sx={{
    direction: 'rtl',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#ddd',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e91e63',
      boxShadow: '0 0 10px #e91e63',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
      boxShadow: '0 0 12px #e91e63',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
    },
  }}
        // MenuProps={{
        //   PaperProps: {
        //     sx: {
        //       minWidth: 200,
        //     },
        //   },
        // }}
      >
        <MenuItem value="" disabled>
          בחר מוסד
        </MenuItem>
        {schoolStore.schools.map((school) => (
          <MenuItem key={school.id} value={school.barcode}>
            {school.nameSchool}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
)}

  {/* כפתורים בשורה חדשה */}
  <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
    <Button
      type="submit"
      variant="contained"
      disabled={loading}
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
      {loading ? 'מוסיף...' : 'הוסף'}
    </Button>

    <Button
      onClick={() => navigate(-1)}
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
  </Grid>
</Grid>


          </Grid>
        </form>
      </Paper>
    </Box>
  );
});

export default AddAdmin;
