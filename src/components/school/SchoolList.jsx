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

const SchoolList = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    schoolStore.fetchSchools();
  }, []);

  const handleDelete = async (schoolId, schoolName) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המוסד "${schoolName}"?\nפעולה זו תגרום למחיקת כל התלמידים והשנתונים של המוסד!`
    );
    if (!confirmDelete) return;

    try {
      await schoolStore.deleteSchool(schoolId);
      await schoolStore.fetchSchools();
    } catch (error) {
      console.error('שגיאה במחיקת המוסד:', error);
    }
  };

  const { schools, loading, error } = schoolStore;

  if (loading) return <div>🔄 טוען נתונים...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

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
      {/* רקע לוגו מטושטש */}
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
          <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
            <img src="/logo1.png" alt="לוגו" style={{ width: 80}} />
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

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>שם מוסד</th>
              <th style={thStyle}>מספר כיתות</th>
              <th style={thStyle}>מספר תלמידים</th>
              <th style={thStyle}>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(schools) && schools.length > 0 ? (
              schools.map((school) => (
                <tr key={school.id}>
                  <td style={tdStyle}>{school.nameSchool}</td>
                  <td style={tdStyle}>{school.numClass}</td>
                  <td style={tdStyle}>{school.numStudent}</td>
                  <td style={tdStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      <IconButton
                        onClick={() => navigate(`/admin/edit-school/${school.id}`)}
                        sx={editButtonStyle}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(school.id, school.nameSchool)}
                        sx={deleteButtonStyle}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                  אין מוסדות להצגה
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
});

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '30px',
};

const thStyle = {
  padding: '12px',
  background: '#263238',
  color: '#00bcd4',
  borderBottom: '1px solid #00bcd4',
  fontSize: '16px',
};

const tdStyle = {
  padding: '12px',
  color: '#333',
  borderBottom: '1px solid #ccc',
  textAlign: 'center',
  fontSize: '15px',
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
