import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import UserStore from '../../store/userStore';
import { useNavigate, Outlet } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Button
} from '@mui/material';

import EditUserDetails from './EditUserDetails';
import Footer from '../footer/Footer';
import UserMenu from './UserMenu';
import UserLearningReport from './UserLearningReport';

const UserDetails = observer(() => {
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [isReport, setIsReport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const path = window.location.pathname;
    setIsReport(path.includes('learningReport'));
  }, [window.location.pathname]);

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

  const handleMenuChange = (value) => {
    if (value === 'edit') handleEditClick();
    else if (value === 'report') goToReport();
    else if (value === 'logout') logout();
  };

  const goToReport = () => navigate('/user/details/learningReport');
  const handleEditClick = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleUserUpdate = (updatedUser) => {
    UserStore.updateUser(updatedUser, () => {
      setOpenDialog(false);
    });
  };

  const user = UserStore.currentUser;

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 8, color: '#fff' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          direction: 'rtl',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        <img src="/logo1.png" alt="לוגו" style={{ width: 100, marginBottom: 20 }} />
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff', mb: 2 }}>
          ...אופססס, עדיין לא התחברת
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/user/login')}
          sx={{
            mt: 4,
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
          מעבר להתחברות
        </Button>
      </Box>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'בוקר טוב';
    if (hour >= 12 && hour < 17) return 'צהריים טובים';
    if (hour >= 17 && hour < 21) return 'ערב טוב';
    return 'לילה טוב';
  };

  const greeting = getGreeting();

  const userFields = [
    { label: 'בית ספר', value: user.school },
    { label: 'כיתה', value: user.classes },
    { label: 'טלפון', value: user.phone },
    { label: 'נקודות', value: user.points },
    { label: 'מספר שיעורים', value: user.timeLessons },
    { label: 'הצלחה', value: user.success ? '✓ כן' : '✗ לא' },
    { label: 'אינדקס', value: user.index },
    { label: 'סטטוס', value: user.status },
  ];

  return (
    <Box
      sx={{
        direction: 'rtl',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        pb: 8,
      }}
    >
      {/* לוגו רקע שקוף */}
      <Box
        sx={{
          position: 'fixed',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundImage: 'url("/logo3.png")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          opacity: 0.05,
          width: '30vw',
          height: '30vh',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* תפריט משתמש קבוע למעלה */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1000,
          borderRadius: 2,
          px: 2,
          py: 1,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <UserMenu
          placeholder="אזור אישי"
          options={[
            { value: 'edit', label: 'עריכת פרטי משתמש' },
            { value: 'report', label: 'דוח למידה' },
            { value: 'logout', label: 'התנתקות' },
          ]}
          onChange={handleMenuChange}
        />
      </Box>

      {isReport ? (
<Box
  sx={{
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    mt: 2,
  }}
>
  {/* Sidebar: פרטי משתמש + לוגו */}
  <Box
    sx={{
      width: 260,
      backgroundColor: '#fff',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderLeft: '3px solid #e91e63',
      boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}
  >
    {/* לוגו למעלה */}
    <Box
      component="img"
      src="/logo1.png"
      alt="Logo"
      sx={{
        width: 80,
        height: 80,
        mt: 2,
        mb: 1,
      }}
    />

    {/* פרטי המשתמש */}
    <Paper
      elevation={4}
      sx={{
        width: '90%',
        p: 2,
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow:
          '0 0 10px #e91e63, 0 0 15px #ff9800, 0 0 20px #ffc107, 0 0 30px #4dd0e1',
        overflowY: 'auto',
        flexGrow: 1,
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          mb: 1,
          background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {greeting}, {user.name}!
      </Typography>

      {userFields.map((field, idx) => (
        <Typography key={idx} sx={{ fontSize: '0.85rem', mb: 0.5 }}>
          <strong>{field.label}:</strong> {field.value}
        </Typography>
      ))}
    </Paper>
  </Box>

  {/* מרכז: קומפוננטת דוח למידה */}
  <Box
    sx={{
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflowY: 'auto',
      py: 4,
      px: 2,
    }}
  >
    <Box sx={{ width: '100%', maxWidth: 900 }}>
      <Outlet />
    </Box>
  </Box>
</Box>





      ) : (
        // תצוגה רגילה (לא דוח למידה)
        <Box
  sx={{
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent:'flex-start',
    mt: 20,
    gap: 0, // רווח בין הלוגו לפרטים
    // flexWrap: 'wrap', // כדי שהעיצוב יתאים גם במסכים קטנים
  }}
>
<Box
  component="img"
  src="/logo1.png"
  alt="Logo"
  sx={{
    width: 350,
    height: 350,
    objectFit: 'contain',
    mt: -10,
    alignSelf: 'flex-start',
    filter: 'drop-shadow(0 0 15px #00bcd4ff)',
    transition: 'filter 0.3s ease-in-out',
    '&:hover': {
      filter: 'drop-shadow(0 0 30px #00bcd4ff)',
    },
  }}
/>



  {/* פרטי המשתמש */}
  <Paper
    elevation={6}
    sx={{
      width: '100%',
      maxWidth: '400px',
      p: 4,
      ml:30,
      borderRadius: '10px',
      backgroundColor: '#fff',
      zIndex: 2,
      boxShadow:
        '0 0 10px #e91e63, 0 0 15px #ff9800, 0 0 40px #ffc107, 0 0 60px #4dd0e1',
      transition: 'all 0.5s ease-in-out',
      
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
          background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
        }}
      >
        {greeting}, {user.name}!
      </Typography>
    </Box>

    <Grid container spacing={2}>
      {userFields.map((field, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Typography sx={{ fontSize: '1rem' }}>
            <strong>{field.label}:</strong> {field.value}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Paper>
</Box>

      )}

      {/* דיאלוג עריכה */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{ sx: { maxHeight: '90vh', overflow: 'hidden', backgroundColor: '#fff', color: '#eee' } }}
        BackdropProps={{ sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' } }}
      >
        <DialogContent sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <EditUserDetails user={user} closeDialog={handleCloseDialog} onSubmit={handleUserUpdate} />
        </DialogContent>
      </Dialog>

      {/* פוטר */}
      <Box
        sx={{
          position: 'fixed',
          bottom: -10,
          left: 0,
          width: '100%',
          bgcolor: '#111',
          color: '#fff',
          textAlign: 'center',
          py: 1,
          fontSize: '0.85rem',
          zIndex: 1000,
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
});

export default UserDetails;
