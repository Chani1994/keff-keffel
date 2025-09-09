import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, Button, MenuItem
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import userStore from '../../store/userStore';

const AddUser = observer(() => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState({
    name: '',
    phone: '',
    school:'',
    classes: '',
    status: 1,
    subscriptionStartDate: new Date().toISOString().slice(0, 16),
    subscriptionEndDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().slice(0, 16),
    isActive: true,
    index: 0,
    success: 0,
  });

  const handleChange = (field, value) => {
    setStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const added = await userStore.addUser(student);
      if (added) {
        Swal.fire('הצלחה', 'התלמיד נוסף בהצלחה!', 'success');
        navigate(-1);
      }
    } catch (error) {
      Swal.fire('שגיאה', 'אירעה שגיאה בהוספת תלמיד', 'error');
    } finally {
      setLoading(false);
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
      {/* רקע שקוף של לוגו */}
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

      {/* טופס בתוך Paper */}
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
        {/* כותרת עם לוגו */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2, paddingTop: '30px' }}>
          <img src="/logo1.png" alt="לוגו" style={{ width: 80 }} />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              ml: 2,
            }}
          >
            הוספת תלמיד
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <StyledField
                label="שם תלמיד"
                value={student.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid>
 <Grid item xs={12} sm={4}>
              <StyledField
                label="בית-ספר"
                value={student.school}
                onChange={(e) => handleChange('school', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledField
                label="כיתה"
                value={student.classes}
                onChange={(e) => handleChange('classes', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <StyledField
                label="טלפון"
                value={student.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="מין"
                variant="outlined"
                fullWidth
                value={student.status}
                onChange={(e) => handleChange('status', parseInt(e.target.value))}
                inputProps={{ style: { textAlign: 'right' } }}
                InputLabelProps={{ sx: labelSx }}
                sx={inputSx}
              >
                <MenuItem value={1}>זכר</MenuItem>
                <MenuItem value={2}>נקבה</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="תאריך התחלה"
                type="datetime-local"
                fullWidth
                value={student.subscriptionStartDate}
                onChange={(e) => handleChange('subscriptionStartDate', e.target.value)}
                InputLabelProps={{ shrink: true, sx: labelSx }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="תאריך סיום"
                type="datetime-local"
                fullWidth
                value={student.subscriptionEndDate}
                onChange={(e) => handleChange('subscriptionEndDate', e.target.value)}
                InputLabelProps={{ shrink: true, sx: labelSx }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="פעיל?"
                select
                fullWidth
                value={student.isActive ? 'true' : 'false'}
                onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                InputLabelProps={{ sx: labelSx }}
                sx={inputSx}
                SelectProps={{ native: true }}
              >
                <option value="true">כן</option>
                <option value="false">לא</option>
              </TextField>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={submitButtonSx}
            >
              {loading ? 'מוסיף...' : 'הוסף'}
            </Button>

            <Button
              onClick={() => navigate(-1)}
              sx={cancelButtonSx}
            >
              ביטול
            </Button>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
});

export default AddUser;

// 🔧 קומפוננטת שדה עם עיצוב
const StyledField = ({ label, value, onChange }) => (
  <TextField
    label={label}
    variant="outlined"
    fullWidth
    value={value}
    onChange={onChange}
    inputProps={{ style: { textAlign: 'right' } }}
    InputLabelProps={{ sx: labelSx }}
    sx={inputSx}
  />
);

// 🎨 עיצוב שדות
const inputSx = {
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
};

const labelSx = {
  right: 16,
  left: 'auto',
  transformOrigin: 'top right',
  background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold',
};

const submitButtonSx = {
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
};

const cancelButtonSx = {
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
};
