import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import schoolStore from '../../store/schoolStore';
import {
  Box,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';


const SchoolList = observer(() => {
  const navigate = useNavigate();

  // 📥 עם עליית הקומפוננטה, נטען את כל המוסדות מה-store
  useEffect(() => {
    schoolStore.fetchSchools();
  }, []);

  // 🗑️ פונקציה למחיקת מוסד כולל אימות מהמשתמש
  const handleDelete = async (schoolId, schoolName) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המוסד "${schoolName}"?\nפעולה זו תגרום למחיקת כל התלמידים והשנתונים של המוסד!`
    );
    if (!confirmDelete) return;

    try {
      await schoolStore.deleteSchool(schoolId);     // קריאה לשרת למחיקת המוסד
      await schoolStore.fetchSchools();             // רענון הרשימה לאחר מחיקה
    } catch (error) {
      console.error('שגיאה במחיקת המוסד:', error);
    }
  };

  // 📦 שליפה מתוך ה־store
  const { schools, loading, error } = schoolStore;

  // 🕐 טוען או שגיאה
  if (loading) return <div>🔄 טוען נתונים...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <Box
      sx={{
        p: 2,
        direction: 'rtl',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        overflow: 'auto',
        position: 'relative',
      }}
    >
      {/* כרטיס (Paper) עם צל ושוליים */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 1000,
          height: '70vh',
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
        {/* 🔙 כותרת עם כפתור חזרה ולוגו */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
            pt: 4,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
            {/* כפתור חזרה לעמוד קודם */}
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                alignSelf: 'flex-start',
                color: '#e91e63',
                border: '1px solid #e91e63',
                borderRadius: '8px',
                mb: 2,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e91e63',
                  color: '#fff',
                },
              }}
            >
              <ArrowForwardRoundedIcon />
              <Typography sx={{ ml: 1, fontSize: '14px' }}>חזרה</Typography>
            </IconButton>

            {/* לוגו + כותרת רשימת מוסדות */}
            <img src="/logo1.png" alt="לוגו" style={{ width: 80 }} />
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.2,
              }}
            >
              רשימת מוסדות
            </Typography>
          </Box>
        </Box>

        {/* טבלת המוסדות */}
        <Box sx={{ maxHeight: 800, overflowY: 'auto', width: '100%' }}>
          <table style={tableStyle}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#263238' }}>
              <tr>
                <th style={thStyle}>שם מוסד</th>
                <th style={thStyle}>קוד מוסד</th>
                <th style={thStyle}>מספר כיתות</th>
                <th style={thStyle}>מספר תלמידים</th>
                <th style={thStyle}>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {/* בדיקה אם קיימים מוסדות להצגה */}
              {Array.isArray(schools) && schools.length > 0 ? (
                schools.map((school) => (
                  <tr key={school.id}>
                    <td style={tdStyle}>{school.nameSchool}</td>
                    <td style={tdStyle}>{school.barcode}</td>
                    <td style={tdStyle}>{school.numClass}</td>
                    <td style={tdStyle}>{school.numStudent}</td>
                    <td style={tdStyle}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                        {/* כפתור עריכה */}
                        <IconButton
                          onClick={() => navigate(`/admin/edit-school/${school.id}`)}
                          sx={editButtonStyle}
                        >
                          <EditIcon />
                        </IconButton>

                        {/* כפתור מחיקה (מושבת כרגע) */}
                        {/*
                        <IconButton
                          onClick={() => handleDelete(school.id, school.nameSchool)}
                          sx={deleteButtonStyle}
                        >
                          <DeleteIcon />
                        </IconButton>
                        */}
                      </Box>
                    </td>
                  </tr>
                ))
              ) : (
                // אם אין מוסדות להצגה
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                    אין מוסדות להצגה
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      </Paper>
    </Box>
  );
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '30px',
  tableLayout: 'fixed', // מונע "קפיצות" בעיצוב
};


const thStyle = {
  padding: '12px 24px',
  background: '#263238',
  color: '#00bcd4',
  borderBottom: '1px solid #00bcd4',
  fontSize: '16px',
  minWidth: '160px',
  textAlign: 'center',  // הוספה כאן
};

const tdStyle = {
  padding: '12px 24px',
  color: '#333',
  borderBottom: '1px solid #ccc',
  textAlign: 'center',
  fontSize: '15px',
  minWidth: '160px', // זהה ל-th
};

const editButtonStyle = {
  borderRadius: '50%',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#00bcd4',
  color: '#00bcd4',
  background: 'transparent',
  boxShadow: '0 0 8px #00bcd4',
  p: 1,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    color: '#fff',
    borderColor: '#e91e63',
    boxShadow: '0 0 20px #00bcd4',
  },
};

const deleteButtonStyle = {
  borderRadius: '50%',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: '#e91e63',
  color: '#e91e63',
  background: 'transparent',
  boxShadow: '0 0 8px #e91e63',
  p: 1,
  ml: 2,
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    color: '#fff',
    borderColor: '#ffc107',
    boxShadow: '0 0 20px #e91e63',
  },
};

export default SchoolList;
