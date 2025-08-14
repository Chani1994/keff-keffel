import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';
import { IconButton, Box, Paper, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

const AllAdmin = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    adminStore.fetchAdmins();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/edit-admin/${id}`);
  };

  const handleDelete = async (id) => {
    await adminStore.deleteAdmin(id, false);
    await adminStore.fetchAdmins();
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
  {/* רקע שקוף */}
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

  {/* תוכן */}
  <Paper
    elevation={6}
    sx={{
      p: 4,
      width: 1000,
      height: '70vh',
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      color: '#333',
      boxShadow:
        '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 80px #4dd0e1, 0 0 20px #e91e63',
      zIndex: 2,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* כותרת */}
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, paddingTop: '30px' }}>
      <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            alignSelf: 'flex-start',
            color: '#e91e63',
            border: '1px solid #e91e63',
            borderRadius: '8px',
            mb: 2,
            transition: 'all 0.3s ease-in-out',
            '&:hover': { backgroundColor: '#e91e63', color: '#fff' },
          }}
        >
          <ArrowForwardRoundedIcon />
          <Typography sx={{ ml: 1, fontSize: '14px' }}>חזרה</Typography>
        </IconButton>

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
          רשימת מנהלים
        </Typography>
      </Box>
    </Box>

    {/* גלילה לטבלה בלבד */}
    <Box sx={{ flex: 1, overflowY: 'auto' ,   width: '100%',
}}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, position: 'sticky', top: 0, background: '#263238', zIndex: 1 }}>שם</th>
            <th style={{ ...thStyle, position: 'sticky', top: 0, background: '#263238', zIndex: 1 }}>טלפון</th>
            <th style={{ ...thStyle, position: 'sticky', top: 0, background: '#263238', zIndex: 1 }}>סוג</th>
            <th style={{ ...thStyle, position: 'sticky', top: 0, background: '#263238', zIndex: 1 }}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {adminStore.admins.map((admin) => (
            <tr key={admin.id}>
              <td style={tdStyle}>{admin.nameAdmin}</td>
              <td style={tdStyle}>{admin.phoneAdmin}</td>
              <td style={tdStyle}>{getTypeName(admin.adminType)}</td>
              <td style={tdStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton onClick={() => handleEdit(admin.id)} sx={editButtonStyle}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(admin.id)} sx={deleteButtonStyle}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Paper>
</Box>

  );
});

function getTypeName(type) {
  switch (type) {
    case 1:
      return 'מנהל ראשי';
    case 2:
      return 'מנהל מוסד';
    case 3:
      return 'מנהל כיתה';
    default:
      return 'לא ידוע';
  }
}

// 🎨 עיצובים:
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
  ml: 2, // ⬅️ הגדלת הרווח בין האיקונים
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    color: '#fff',
    borderColor: '#ffc107',
    boxShadow: '0 0 20px #e91e63',
  },
};



export default AllAdmin;
