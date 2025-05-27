import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import schoolStore from '../../store/schoolStore';

const AddSchool = observer(() => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!schoolStore.NameSchool) newErrors.NameSchool = 'שדה חובה';
    if (!schoolStore.NumClass || schoolStore.NumClass <= 0) newErrors.NumClass = 'מספר כיתות חייב להיות גדול מ-0';
    if (!schoolStore.NumStudent || schoolStore.NumStudent <= 0) newErrors.NumStudent = 'מספר תלמידים חייב להיות גדול מ-0';
    if (!schoolStore.Barcode) newErrors.Barcode = 'שדה חובה';
    // תוכל להוסיף כאן בדיקות נוספות לפי הצורך
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await schoolStore.addSchool();
      await Swal.fire({
        icon: 'success',
        title: 'המוסד נוסף בהצלחה',
        timer: 2000,
        showConfirmButton: false,
      });
      schoolStore.resetSchoolData();
      navigate(-1);
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'שגיאה בשליחה',
        text: error.message || 'נסה שוב מאוחר יותר',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    schoolStore.setField(field, value);
  };

  // פונקציות לניהול כיתות ותלמידים (לפי הקוד שלך)
  const handleClassChange = (index, field, value) => {
    schoolStore.setClassField(index, field, value);
  };

  const handleStudentChange = (index, field, value) => {
    schoolStore.setStudentField(index, field, value);
  };

  const toggleStudentCheckbox = (index) => {
    schoolStore.toggleStudentChecked(index);
  };

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
    background:
      'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
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
          height: '70vh',
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
          width: 1000,
          maxHeight: '70vh',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          color: '#333',
          overflowY: 'auto',
          boxShadow:
            '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1, 0 0 20px #e91e63',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
            paddingTop: '30px',
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
              הוספת מוסד
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="שם מוסד"
                variant="outlined"
                fullWidth
                value={schoolStore.NameSchool || ''}
                onChange={(e) => handleChange('NameSchool', e.target.value)}
                inputProps={{ style: { textAlign: 'right' } }}
                InputLabelProps={{ sx: labelSx }}
                error={!!errors.NameSchool}
                helperText={errors.NameSchool}
                sx={inputSx}
              />
            </Grid>
<Grid item xs={12} sm={3}>
              <TextField
                label="ברקוד"
                variant="outlined"
                fullWidth
                value={schoolStore.Barcode || ''}
                onChange={(e) => handleChange('Barcode', e.target.value)}
                inputProps={{ style: { textAlign: 'right' } }}
                InputLabelProps={{ sx: labelSx }}
                error={!!errors.Barcode}
                helperText={errors.Barcode}
                sx={inputSx}
              />
            </Grid>
           <Grid item xs={12} sm={3}>
  <TextField
    label="מספר כיתות"
    variant="outlined"
    type="number"
    fullWidth
    value={schoolStore.NumClass || ''}
    onChange={(e) => {
      const value = Number(e.target.value);
      if (!isNaN(value)) {
        handleChange('NumClass', value);  // שמירה בשורה הראשית
        schoolStore.updateClass(value); // עדכון מערך הכיתות בהתאם
      } else {
        handleChange('NumClass', 0);
        schoolStore.updateClass(0);
      }
    }}
    inputProps={{ style: { textAlign: 'right' }, min: 0 }}
    InputLabelProps={{ sx: labelSx }}
    error={!!errors.NumClass}
    helperText={errors.NumClass}
    sx={inputSx}
  />
</Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                label="מספר תלמידים כולל"
                variant="outlined"
                type="number"
                fullWidth
                value={schoolStore.NumStudent || ''}
                onChange={(e) => handleChange('NumStudent', e.target.value)}
                inputProps={{ style: { textAlign: 'right' } }}
                InputLabelProps={{ sx: labelSx }}
                error={!!errors.NumStudent}
                helperText={errors.NumStudent}
                sx={inputSx}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* ניהול כיתות */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background:
                'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              mt: 2,
            }}
          >
            כיתות
          </Typography>

{(schoolStore.classes || []).map((cls, idx) => (
            <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="שם כיתה"
                  variant="outlined"
                  fullWidth
                  value={cls.name}
                  onChange={(e) => handleClassChange(idx, 'name', e.target.value)}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
  <TextField
    label="מספר תלמידים"
    variant="outlined"
    type="number"
    fullWidth
    value={cls.students}
    onChange={(e) => handleClassChange(idx, 'students', Number(e.target.value))}
    inputProps={{ style: { textAlign: 'right' } }}
    InputLabelProps={{ sx: labelSx }}
    sx={inputSx}
  />
</Grid>

            </Grid>
          ))}

          <Divider sx={{ my: 2 }} />

          {/* ניהול תלמידים */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              background:
                'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
              mt: 2,
            }}
          >
            תלמידים
          </Typography>

{(schoolStore.students || []).map((student, idx) => (
            <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="שם תלמיד"
                  variant="outlined"
                  fullWidth
                  value={student.name}
                  onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  label="מספר כיתה"
                  variant="outlined"
                  fullWidth
                  value={student.classNum}
                  onChange={(e) => handleStudentChange(idx, 'classNum', e.target.value)}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} sm={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={student.checked}
                      onChange={() => toggleStudentCheckbox(idx)}
                      color="secondary"
                    />
                  }
                  label="נבחר"
                  sx={{ '& .MuiTypography-root': { fontWeight: 'bold' } }}
                />
              </Grid>
            </Grid>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                  color: '#fff',
                  borderColor: '#e91e63',
                  boxShadow: '0 0 20px #e91e63',
                },
              }}
            >
              {loading ? 'שולח...' : 'שלח'}
            </Button>

            <Button
              variant="text"
              onClick={() => navigate(-1)}
              sx={{ mx: 2, color: '#999' }}
            >
              ביטול
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
});

export default AddSchool;
