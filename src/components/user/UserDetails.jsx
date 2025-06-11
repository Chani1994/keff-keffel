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
  MenuItem,
  Select,
  CircularProgress,
  Paper,Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import EditUserDetails from './EditUserDetails';
import Footer from '../footer/Footer';


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

  const goToReport = () => navigate('/user/details/learningReport');
  const handleEditClick = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleUserUpdate = (updatedUser) => {
    UserStore.updateUser(updatedUser, () => {
      setOpenDialog(false);
    });
  };

  const handleMenuChange = (e) => {
    const value = e.target.value;
    if (value === 'edit') handleEditClick();
    else if (value === 'report') goToReport();
    else if (value === 'logout') logout();
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
      <Box sx={{ textAlign: 'center', mt: 8, color: '#fff' }}>
        לא התחברת עדיין
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
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundImage: 'url("/logo3.png")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      opacity: 0.05,
      width: '30vw',
      height: '30vh',
      zIndex: 10,
      pointerEvents: 'none',
    }}
  />
  <Box
  sx={{
    position: 'absolute',
    top: '45%',
    left: 'calc(50% + 200px)', // מרחק מהמרכז לצד שמאל
    transform: 'translateY(-50%)',
    zIndex: 1,
  }}
>
  <Box
    component="img"
    src="/logo1.png"
    alt="Logo"
    sx={{
      width: 430,
      height: 430,
      objectFit: 'contain',
    }}
  />
</Box>
<Box
  sx={{
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1000,
    backgroundColor: '#fff',
    borderRadius: 2,
    px: 2,
    py: 1,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
  }}
>
  <Select
    variant="standard"
    value=""
    displayEmpty
    onChange={handleMenuChange}
    sx={{
      minWidth: 150,
      fontWeight: 'bold',
      fontSize: 16,
      color: '#e91e63',
      '&::before': { borderBottom: '1px solid #e91e63' },
    }}
  >
    <MenuItem value="" disabled>
      אזור אישי
    </MenuItem>
    <MenuItem value="edit">עריכת פרטי משתמש</MenuItem>
    <MenuItem value="report">דוח למידה</MenuItem>
    <MenuItem value="logout">התנתקות</MenuItem>
  </Select>
</Box>

  {/* תיבת תוכן */}
  <Paper
  elevation={6}
  sx={{
    width: '40%', // היה 30%
    maxWidth: '400px', // היה 300px
    p: 4,
    borderRadius: '10px',
    backgroundColor: '#fff',
    zIndex: 2,
    mt: 6,
    boxShadow:
      '0 0 10px #e91e63, 0 0 15px #ff9800, 0 0 20px #ffc107, 0 0 30px #4dd0e1',
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

    {/* פרטי המשתמש */}
 <Grid container spacing={2}>
  {[
    { label: 'בית ספר', value: user.school },
    { label: 'כיתה', value: user.classes },
    { label: 'טלפון', value: user.phone },
    { label: 'נקודות', value: user.points },
    { label: 'מספר שיעורים', value: user.timeLessons },
    { label: 'הצלחה', value: user.success ? '✓ כן' : '✗ לא' },
    { label: 'אינדקס', value: user.index },
    { label: 'סטטוס', value: user.status },
  ].map((field, idx) => (
    <Grid item xs={12} sm={6} md={3} key={idx}>
      <Typography sx={{ fontSize: '1rem' }}>
        <strong>{field.label}:</strong> {field.value}
      </Typography>
    </Grid>
  ))}
</Grid>


  </Paper>

  {/* דיאלוג עריכה */}
  <Dialog
    open={openDialog}
    onClose={handleCloseDialog}
    maxWidth="md"
    fullWidth
    scroll="body"
    PaperProps={{
      sx: {
        maxHeight: '90vh',
        overflow: 'hidden',
        backgroundColor: '#fff',
        color: '#eee',
      },
    }}
    BackdropProps={{
      sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
    }}
  >
    <DialogContent
      sx={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
    >
      <EditUserDetails
        user={user}
        closeDialog={handleCloseDialog}
        onSubmit={handleUserUpdate}
      />
    </DialogContent>
  </Dialog>

  {/* פוטר */}
  <Box
    sx={{
      position: 'fixed',
      bottom: -20,
      left: 0,
      width: '100%',
      bgcolor: '#111',
      color: '#aaa',
      textAlign: 'center',
      py: 1.5,
      fontSize: 14,
      direction: 'rtl',
      zIndex: 100,
    }}
  >
    <Footer />
  </Box>

  <Outlet />
</Box>

  );
});

export default UserDetails;
