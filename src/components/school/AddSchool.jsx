import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
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
import userStore from '../../store/userStore';
import { MenuItem } from '@mui/material';

const AddSchool = observer(() => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
useEffect(() => {
  schoolStore.reset();
}, []);

useEffect(() => {
  if (schoolStore.Barcode) {
    // כאן תכתבי את הלוגיקה שתחזיר את קוד המוסד לפי הברקוד שהוקלד
    const computedSchoolId = yourLogicToGetSchoolId(schoolStore.Barcode);
    schoolStore.setField('SchoolId', computedSchoolId);
  } else {
    schoolStore.setField('SchoolId', '');
  }
}, [schoolStore.Barcode]);
const yourLogicToGetSchoolId = (barcode) => {
  return  barcode;
}


  const validate = () => {
    const newErrors = {};
    if (!schoolStore.NameSchool) newErrors.NameSchool = 'שדה חובה';
    if (!schoolStore.NumClass || schoolStore.NumClass <= 0) newErrors.NumClass = 'מספר כיתות חייב להיות גדול מ-0';
    if (!schoolStore.NumStudent || schoolStore.NumStudent <= 0) newErrors.NumStudent = 'מספר תלמידים חייב להיות גדול מ-0';
    if (!schoolStore.Barcode) newErrors.Barcode = 'שדה חובה';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  try {
await schoolStore.addSchool(); // פעולה שמעדכנת את NameSchool
console.log('📌 אחרי הוספת מוסד, שם מוסד:', schoolStore.NameSchool);

for (const student of schoolStore.students) {
  const user = {
  name: student.name?.trim() || '',
  phone: student.phone?.trim() || '',
  school: schoolStore.NameSchool?.trim() || '',
  classes: student.classNum?.trim() || '',
  status: student.status ?? 1,
  subscriptionStartDate: student.subscriptionStartDate || null,
  subscriptionEndDate: student.subscriptionEndDate || null,
  isActive: student.isActive ?? false,
  success: 0
};

  await userStore.addUser(user); // קריאה אמיתית לשרת
}    navigate(-1); // ניווט אחורה או לפי הצורך
  } catch (error) {
    console.error('Error adding school:', error);
    // אפשר להציג הודעת שגיאה אחרת כאן אם רוצים
  } finally {
    setLoading(false);
  }
};

  const handleChange = (field, value) => {
    schoolStore.setField(field, value);
  };

  const handleClassChange = (index, field, value) => {
schoolStore.updateClass(index, field, value);
  };

const handleStudentChange = (studentIndex, field, value) => {
  schoolStore.students[studentIndex][field] = value;
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
              הוספת מוסד
            </Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid span={12} md={6}>
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
 <Grid span={12} md={3}>              <TextField
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
 <Grid span={12} md={3}>  <TextField
    label="מספר כיתות"
    variant="outlined"
    type="number"
    fullWidth
    value={schoolStore.NumClass || ''}
   onChange={(e) => {
  const value = Number(e.target.value);
  if (!isNaN(value)) {
    handleChange('NumClass', value);       // שמירה לשדה טופס אם נדרש
    schoolStore.setNumClasses(value);      // ✅ זו השורה החשובה
  } else {
    handleChange('NumClass', 0);
    schoolStore.setNumClasses(0);          // ✅ כאן גם תיקון
  }
}}

    inputProps={{ style: { textAlign: 'right' }, min: 0 }}
    InputLabelProps={{ sx: labelSx }}
    error={!!errors.NumClass}
    helperText={errors.NumClass}
    sx={inputSx}
  />
</Grid>


 <Grid span={12} md={6}>              <TextField
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

{(schoolStore.ClassList || []).map((cls, idx) => (
  <Grid container spacing={2} key={cls.id || idx} sx={{ mb: 1 }}>
    <Grid item xs={12} md={3}>
      <TextField
        label="שם כיתה"
        variant="outlined"
        fullWidth
        value={cls.name || ""}
        onChange={(e) => handleClassChange(idx, 'name', e.target.value)}
        inputProps={{ style: { textAlign: 'right' } }}
        InputLabelProps={{ sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

    {/* שנת לימודים */}
 <Grid span={12} md={2}>      <TextField
        label="שנת לימוד"
        variant="outlined"
        type="number"
        fullWidth
        value={cls.year || ''}
        onChange={(e) => handleClassChange(idx, 'year', Number(e.target.value))}
        inputProps={{ style: { textAlign: 'right' }, min: 0 }}
        InputLabelProps={{ sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

 <Grid span={12} md={2}>  <TextField
    label="קוד מוסד"
    variant="outlined"
    fullWidth
    value={schoolStore.SchoolId || ''}
    InputProps={{ readOnly: true }}
    inputProps={{ style: { textAlign: 'right' } }}
    InputLabelProps={{ sx: labelSx }}
    sx={inputSx}
  />
</Grid>

 <Grid span={12} md={3}>  <TextField
    label="מספר תלמידים"
    variant="outlined"
    type="number"
    fullWidth
    value={cls.studentCount || 0}
    onChange={(e) => {
  handleClassChange(idx, 'studentCount', Number(e.target.value));
  schoolStore.generateStudents();
}}
    inputProps={{ style: { textAlign: 'right' }, min: 0 }}
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
  <Grid container spacing={2} key={idx} alignItems="center" sx={{ mb: 2 }}>
    <Grid item xs={12} md={3}>
      <TextField
        label="שם תלמיד"
        variant="outlined"
        fullWidth
        value={student.name || ""}
        onChange={(e) => handleStudentChange(idx, 'name', e.target.value)}
        inputProps={{ style: { textAlign: 'right' } }}
        InputLabelProps={{ sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

    <Grid item xs={12} md={2}>
      <TextField
        label="כיתה"
        variant="outlined"
        fullWidth
        value={student.classNum || ""}
        onChange={(e) => handleStudentChange(idx, 'classNum', e.target.value)}
        inputProps={{ style: { textAlign: 'right' } }}
        InputLabelProps={{ sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

    <Grid item xs={12} md={2}>
      <TextField
        label="טלפון"
        variant="outlined"
        fullWidth
        value={student.phone || ""}
        onChange={(e) => handleStudentChange(idx, 'phone', e.target.value)}
        inputProps={{ style: { textAlign: 'right' } }}
        InputLabelProps={{ sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

  

   <Grid item xs={12} md={1.5}>
  <TextField
    select
    label="מין"
    variant="outlined"
    fullWidth
    value={student.status ?? 1} // ברירת מחדל לזכר
    onChange={(e) => handleStudentChange(idx, 'status', parseInt(e.target.value))}
    inputProps={{ style: { textAlign: 'right' } }}
    InputLabelProps={{ sx: labelSx }}
    sx={inputSx}
  >
    <MenuItem value={1}>זכר</MenuItem>
    <MenuItem value={2}>נקבה</MenuItem>
  </TextField>
</Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="תאריך התחלה"
        type="datetime-local"
        fullWidth
        value={student.subscriptionStartDate?.slice(0, 16) || ""}
        onChange={(e) => handleStudentChange(idx, 'subscriptionStartDate', e.target.value)}
        InputLabelProps={{ shrink: true, sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

    <Grid item xs={12} md={3}>
      <TextField
        label="תאריך סיום"
        type="datetime-local"
        fullWidth
        value={student.subscriptionEndDate?.slice(0, 16) || ""}
        onChange={(e) => handleStudentChange(idx, 'subscriptionEndDate', e.target.value)}
        InputLabelProps={{ shrink: true, sx: labelSx }}
        sx={inputSx}
      />
    </Grid>

    <Grid item xs={12} md={2}>
      <TextField
        label="פעיל?"
        select
        fullWidth
        SelectProps={{ native: true }}
        value={student.isActive ? 'true' : 'false'}
        onChange={(e) => handleStudentChange(idx, 'isActive', e.target.value === 'true')}
        InputLabelProps={{ sx: labelSx }}
        sx={inputSx}
      >
        <option value="true">כן</option>
        <option value="false">לא</option>
      </TextField>
    </Grid>

  
  </Grid>
))}



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
        </form>
      </Paper>
    </Box>
  );
});

export default AddSchool;
