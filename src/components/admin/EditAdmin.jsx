import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import schoolStore from '../../store/schoolStore';


import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
    MenuItem,

  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import adminStore from '../../store/adminStore';

const EditAdmin = observer(() => {

  // 🟢 קבלת פרמטר מה-URL (id של המנהל לעריכה)
  const { id } = useParams();
  const navigate = useNavigate();

  // 🟢 סטייט לשמירת כל פרטי המנהל
  const [adminData, setAdminData] = useState({
    id: 0,
    nameAdmin: '',
    password: '',
    phoneAdmin: '',
    email: '',
    fax: '',
    adminType: '',
    nameSchool: ''
  });

  // 🟢 סטייט להצגת סיסמה (הסתרה/הצגה)
  const [showPassword, setShowPassword] = useState(false);

  // 🟢 סטייט לשמירת המזהה של בית הספר (ברקוד)
  const [idSchool, setIdSchool] = useState('');

  // 🟢 טעינת מוסדות בתחילת הקומפוננטה
  useEffect(() => {
    schoolStore.fetchSchools(); // נטען מוסדות מה-store
  }, []);

  // 🟢 טעינת פרטי המנהל לפי ה-id מה-URL
  useEffect(() => {
    adminStore.fetchAdmins().then(() => { // קודם טוענים את כל המנהלים
      const current = adminStore.getAdminById(id); // מוצאים את המנהל הרצוי
      if (current) {
        setAdminData({ ...current }); // מעדכנים את סטייט המנהל
        setIdSchool(current.idSchool); // נשמר idSchool (לברקוד)
      }
    });
  }, [id]);

  // 🟢 עדכון idSchool לפי שם בית הספר
  useEffect(() => {
    if (adminData && adminData.nameSchool && schoolStore.schools.length > 0) {
      const foundSchool = schoolStore.schools.find(s => s.nameSchool === adminData.nameSchool);
      if (foundSchool) {
        setIdSchool(foundSchool.barcode); // מעדכנים את הברקוד לפי שם בית הספר
      }
    }
  }, [adminData, schoolStore.schools]);

  // 🟢 עדכון נתונים בשדות הטופס
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: name === 'adminType' ? Number(value) : value // ממירים adminType למספר
    }));
  };

  // 🟢 שמירה ועדכון מנהל
  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminStore.updateAdmin(adminData); // מעדכנים ב-store ובשרת
    navigate('/admin'); // ניווט חזרה לעמוד המנהלים
  };

  // 🟢 שינוי מוסד בחירה מה-select
  const handleSchoolChange = (e) => {
    const value = e.target.value;
    setIdSchool(value); // מעדכן את הברקוד
    const selectedSchool = schoolStore.schools.find(s => s.barcode === value);
    setAdminData(prev => ({
      ...prev,
      idSchool: value, // שומר את ברקוד
      nameSchool: selectedSchool?.nameSchool || '' // מעדכן גם את שם בית הספר
    }));
  };

  // 🟢 הצגת או הסתרת סיסמה
  const toggleShowPassword = () => {
    setShowPassword((show) => !show);
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
         <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    mb={2}
                  >
                    <img src="/logo1.png" alt="לוגו" style={{ width: 60 }} />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        background:
                          'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1.2,
                      }}
                    >
עריכת מנהל                    </Typography>
                  </Box>
        <form onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ textAlign: 'center' }}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="שם מנהל"
                variant="outlined"
                fullWidth
                name="nameAdmin"
                value={adminData.nameAdmin}
                onChange={handleChange}
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
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="סיסמה"
                variant="outlined"
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={adminData.password}
                onChange={handleChange}
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
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleShowPassword}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="טלפון"
                variant="outlined"
                fullWidth
                name="phoneAdmin"
                value={adminData.phoneAdmin}
                onChange={handleChange}
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
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="אימייל"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={adminData.email}
                onChange={handleChange}
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
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="פקס"
                variant="outlined"
                fullWidth
                name="fax"
                value={adminData.fax}
                onChange={handleChange}
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

{adminStore.currentAdmin?.adminType === 1 && (
  <>
    <Grid item xs={12} sm={4}>
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
          id="admin-type-label"
        >
          סוג מנהל
        </InputLabel>

        <Select
          labelId="admin-type-label"
          value={adminData.adminType || ""}
          onChange={(e) => {
            const value = Number(e.target.value);
            setAdminData(prev => ({ ...prev, adminType: value }));
          }}
          displayEmpty
          renderValue={
            adminData.adminType !== ""
              ? undefined
              : () => <span style={{ color: '#aaa' }}>הגדר סוג מנהל</span>
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
          MenuProps={{
            PaperProps: {
              sx: {
                minWidth: 200,
              },
            },
          }}
        >
          <MenuItem value="" disabled>הגדר סוג מנהל</MenuItem>
          <MenuItem value={1}>מנהל ראשי</MenuItem>
          <MenuItem value={2}>מנהל מוסד</MenuItem>
          <MenuItem value={3}>מנהל כיתה</MenuItem>
        </Select>
      </FormControl>
    </Grid>

    <Grid item xs={12} sm={4}>
<FormControl fullWidth sx={{ textAlign: 'right', minWidth: 130 }}>
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
  value={idSchool || ''}
  onChange={handleSchoolChange}
  displayEmpty
  label="מוסד"
  renderValue={
    idSchool !== "" ? undefined : () => <span style={{ color: '#aaa' }}>בחר מוסד</span>
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
</FormControl>
    </Grid>
  </>
)}
   </Grid>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
        
           <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
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
          </Box>
        </form>
      </Paper>
    </Box>
  );
});

export default EditAdmin;
