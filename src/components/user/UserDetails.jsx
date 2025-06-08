import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import UserStore from '../../store/userStore';
import { useNavigate, Outlet } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import EditUserDetails from './EditUserDetails';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'בוקר טוב';
  if (hour >= 12 && hour < 17) return 'צהריים טובים';
  if (hour >= 17 && hour < 21) return 'ערב טוב';
  return 'לילה טוב';
};

const UserDetails = observer(() => {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser !== '""') {
      runInAction(() => {
        UserStore.currentUser = JSON.parse(savedUser);
      });
    }
    setLoading(false);
  }, []);

  const logout = () => {
    runInAction(() => {
      UserStore.currentUser = null;
    });
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  const goToReport = () => {
    navigate('/user/details/learningReport');
  };

  const handleEditClick = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleUserUpdate = (updatedUser) => {
    UserStore.updateUser(updatedUser, () => {
      setOpenDialog(false);
      navigate('/user/details');
    });
  };

  const user = UserStore.currentUser;
  const greeting = getGreeting();

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, color: 'white' }}>
        לא התחברת עדיין
      </Box>
    );
  }

  return (
    <Box
      sx={{
        direction: 'rtl',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* לוגו שקוף ברקע */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: 'url("/logo3.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          opacity: 0.05,
          width: '70vw',
          height: '70vh',
          zIndex: 0,
        }}
      />

      {/* תיבת תוכן */}
      <Paper
        elevation={6}
        sx={{
          width: '90%',
          maxWidth: '600px',
          p: 4,
          borderRadius: '20px',
          backgroundColor: '#fff',
          zIndex: 2,
          boxShadow:
            '0 0 10px #e91e63, 0 0 20px #ff9800, 0 0 30px #ffc107, 0 0 60px #4dd0e1',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              background:
                'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            {greeting}, {user.name}!
          </Typography>

          <IconButton onClick={handleEditClick} color="secondary">
            <EditIcon />
          </IconButton>
        </Box>

        {/* פרטי משתמש */}
        {[
          { label: 'שם', value: user.name },
          { label: 'בית ספר', value: user.school },
          { label: 'כיתה', value: user.classes },
          { label: 'טלפון', value: user.phone },
          { label: 'נקודות', value: user.points },
          { label: 'מספר שיעורים', value: user.timeLessons },
          { label: 'הצלחה', value: user.success ? '✓ כן' : '✗ לא' },
          { label: 'אינדקס', value: user.index },
          { label: 'מזהה', value: user.id },
        ].map((field, idx) => (
          <Typography key={idx} sx={{ mb: 1 }}>
            <strong>{field.label}:</strong> {field.value}
          </Typography>
        ))}

        {/* כפתורים */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            onClick={goToReport}
            variant="contained"
            sx={{
              borderRadius: '50px',
              border: '2px solid #00bcd4',
              color: '#00bcd4',
              background: 'transparent',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              '&:hover': {
                background:
                  'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                color: '#fff',
                borderColor: '#e91e63',
              },
            }}
          >
            דוח למידה
          </Button>

          <Button
            onClick={logout}
            variant="contained"
            sx={{
              borderRadius: '50px',
              border: '2px solid #e91e63',
              color: '#e91e63',
              background: 'transparent',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#e91e63',
                color: '#fff',
              },
            }}
          >
            התנתקות
          </Button>
        </Box>
      </Paper>

      {/* דיאלוג עריכה */}
     <Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="sm"
  fullWidth
  scroll="body" // זה מונע scroll פנימי
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
  }}
>
  

  <DialogContent
    sx={{
      maxHeight: 'calc(100vh - 200px)', // תן מקום מספק, כדי שלא יחתך
      overflowY: 'auto', // תן גלילה רק אם חייבים
    }}
  >
    <EditUserDetails
  user={user}
  closeDialog={handleCloseDialog}
  onSubmit={handleUserUpdate}
/>

  </DialogContent>
</Dialog>

      <Outlet />
    </Box>
  );
});

export default UserDetails;
