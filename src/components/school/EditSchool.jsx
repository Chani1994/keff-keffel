import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
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

const EditSchool = observer(() => {
  const navigate = useNavigate(); // נווט לעמוד אחר
  const { schoolId } = useParams(); // שלוף מזהות המוסד מה-URL
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [errors, setErrors] = useState({}); // שגיאות בטופס

  // לצורך בדיקה – הדפסת מזהה המוסד
  useEffect(() => {
    console.log('🔍 schoolId from useParams:', schoolId);
  }, [schoolId]);

  // טען את פרטי המוסד מהשרת כשנטען הקומפוננט
  useEffect(() => {
    async function fetchData() {
      setLoading(true); // התחל טעינה
      try {
        await schoolStore.loadSchoolById(schoolId); // טען את המוסד לפי מזהה
      } catch (error) {
        console.error("❌ שגיאה בפרטי המוסד:", error);
        Swal.fire('שגיאה', `שגיאה: ${error.message || error}`, 'error'); // הצג שגיאה
        navigate(-1); // חזור אחורה
      } finally {
        setLoading(false); // סיים טעינה
      }
    }

    fetchData();
  }, [schoolId, navigate]);

  // ✍️ ולידציה לפני שליחה
  const validate = () => {
    const newErrors = {};

    // בדיקה של כל שדה נדרש
    if (!schoolStore.NameSchool) newErrors.NameSchool = 'שדה חובה';
    if (!schoolStore.NumClass || schoolStore.NumClass <= 0)
      newErrors.NumClass = 'מספר כיתות חייב להיות גדול מ-0';
    if (!schoolStore.NumStudent || schoolStore.NumStudent <= 0)
      newErrors.NumStudent = 'מספר תלמידים חייב להיות גדול מ-0';
    if (!schoolStore.Barcode) newErrors.Barcode = 'שדה חובה';

    setErrors(newErrors); // עדכן את השגיאות
    return Object.keys(newErrors).length === 0; // האם הטופס תקין?
  };

  // 🚀 שליחה לעדכון
  const handleSubmit = async (e) => {
    e.preventDefault(); // מניעת רענון
    if (!validate()) return; // אם לא תקין – עצור

    setLoading(true); // התחלת טעינה

    try {
      const updatedSchool = {
        nameSchool: schoolStore.NameSchool,
        barcode: schoolStore.Barcode,
        numClass: schoolStore.NumClass,
        numStudent: schoolStore.NumStudent,
        classList: schoolStore.ClassList,
        students: schoolStore.students,
      };

      await schoolStore.updateSchool(schoolId, updatedSchool); // שלח עדכון לשרת
      Swal.fire('הצלחה', 'פרטי המוסד עודכנו בהצלחה', 'success'); // הצגת הצלחה
      navigate(-1); // חזור אחורה
    } catch (error) {
      Swal.fire('שגיאה', 'אירעה שגיאה בעדכון המוסד', 'error');
    } finally {
      setLoading(false); // סיים טעינה
    }
  };

  // שינוי כללי של שדות פשוטים (שם מוסד, מספר כיתות וכו׳)
  const handleChange = (field, value) => {
    schoolStore.setField(field, value);
  };

  // שינוי שדות בכיתה (למשל: שם כיתה או מספר תלמידים)
  const handleClassChange = (index, field, value) => {
    schoolStore.updateClass(index, field, value);
  };

  // שינוי שדה של תלמיד מסוים (למשל: שם או נוכחות)
  const handleStudentChange = (studentIndex, field, value) => {
    schoolStore.students[studentIndex][field] = value;
  };

  // סימון תלמיד כ"נבחר" (checkbox)
  const toggleStudentCheckbox = (index) => {
    schoolStore.toggleStudentChecked(index);
  };

  // 🎨 עיצוב לשדה טקסט
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

  // 🎨 עיצוב לתוויות של שדות
  const labelSx = {
    right: 16,
    left: 'auto',
    transformOrigin: 'top right',
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
  };

  return (
    <Box
      sx={{
        maxHeight: '100vh',
        overflowY: 'auto',
        p: 2,
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000000',
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
              עריכת מוסד
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <TextField
                label="מספר כיתות"
                variant="outlined"
                type="number"
                fullWidth
                value={schoolStore.NumClass || ''}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value)) {
                    handleChange('NumClass', value);
                    schoolStore.setNumClasses(value);
                  } else {
                    handleChange('NumClass', 0);
                    schoolStore.setNumClasses(0);
                  }
                }}
                inputProps={{ style: { textAlign: 'right' }, min: 0 }}
                InputLabelProps={{ sx: labelSx }}
                error={!!errors.NumClass}
                helperText={errors.NumClass}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} md={6}>
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

          {(schoolStore.ClassList || []).map((cls, idx) => (
            <Grid container spacing={2} key={cls.id || idx} sx={{ mb: 1 }}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="שם כיתה"
                  variant="outlined"
                  fullWidth
                  value={cls.name || ''}
                  onChange={(e) => handleClassChange(idx, 'name', e.target.value)}
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  label="מספר תלמידים בכיתה"
                  variant="outlined"
                  type="number"
                  fullWidth
                  value={cls.studentsCount || ''}
                  onChange={(e) =>
                    handleClassChange(idx, 'studentsCount', Number(e.target.value))
                  }
                  inputProps={{ style: { textAlign: 'right' }, min: 0 }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          ))}

          <Divider sx={{ my: 2 }} />

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
            <Grid
              container
              spacing={2}
              key={student.id || idx}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <Grid item xs={12} md={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={student.checked || false}
                      onChange={() => toggleStudentCheckbox(idx)}
                      color="secondary"
                    />
                  }
                  label=""
                  sx={{ mr: 0 }}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="שם תלמיד"
                  variant="outlined"
                  fullWidth
                  value={student.name || ''}
                  onChange={(e) =>
                    handleStudentChange(idx, 'name', e.target.value)
                  }
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="מספר זיהוי"
                  variant="outlined"
                  fullWidth
                  value={student.idNumber || ''}
                  onChange={(e) =>
                    handleStudentChange(idx, 'idNumber', e.target.value)
                  }
                  inputProps={{ style: { textAlign: 'right' } }}
                  InputLabelProps={{ sx: labelSx }}
                  sx={inputSx}
                />
              </Grid>
            </Grid>
          ))}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
                  
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

export default EditSchool;

