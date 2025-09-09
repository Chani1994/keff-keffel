import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import UserStore from '../../store/userStore';
import EditUserDetails from './EditUserDetails';
import Footer from '../footer/Footer';
import UserLearningReport from './UserLearningReport';
import Swal from 'sweetalert2';

const UserDetails = observer(() => {
  // קומפוננטה להצגת פרטי המשתמש
  // observer – מאפשרת לעקוב אחרי שינויים ב-MobX store

  const [loading, setLoading] = useState(true); 
  // מצב טעינה ראשוני לפני שהנתונים נטענו

  const [openDialog, setOpenDialog] = useState(false); 
  // פתיחת/סגירת חלון דיאלוג לעריכת המשתמש

  const [isReport, setIsReport] = useState(false); 
  // בדיקה אם המסך הוא דו"ח למידה

  const navigate = useNavigate(); 
  // hook של React Router לניווט בין דפים
  const { id } = useParams(); 
  // קבלת מזהה המשתמש מה-URL

  useEffect(() => {
    // בודק אם הנתיב הנוכחי הוא דו"ח למידה
    const path = window.location.pathname;
    setIsReport(path.includes('learningReport'));
  }, []);

  useEffect(() => {
    // טוען את המשתמש מה-localStorage אם קיים
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser !== '""') {
      runInAction(() => {
        UserStore.currentUser = JSON.parse(savedUser);
      });
    }
    setLoading(false); // מסיים טעינה
  }, []);

  const logout = () => {
    // פונקציה להתנתקות
    runInAction(() => {
      UserStore.currentUser = null; // מאפס את המשתמש הנוכחי ב-store
    });
    localStorage.removeItem('currentUser'); // מוחק את המשתמש מ-localStorage
    navigate('/'); // ניתוב לדף הבית
  };

  const handleEditClick = () => setOpenDialog(true); 
  // פתיחת דיאלוג עריכה
  const handleCloseDialog = () => setOpenDialog(false); 
  // סגירת דיאלוג

  const handleUserUpdate = (updatedUser) => {
    // פונקציה לעדכון משתמש
    UserStore.updateUser(updatedUser, () => {
      setOpenDialog(false); // סוגרת את הדיאלוג לאחר העדכון
    });
  };

  const user = UserStore.currentUser; 
  // המשתמש הנוכחי מה-store

  useEffect(() => {
    // טוען את המשתמש לפי מזהה מה-URL
    UserStore.fetchUserById(id);
  }, [id]);

  useEffect(() => {
    // בודק אם הגיעה כתובת URL עם ?paid=true לאחר תשלום
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('paid');
    if (paid === 'true') {
      const savedUser = localStorage.getItem('pendingUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        UserStore.finishRegistration(parsedUser, navigate); 
        // מסיים הרשמה ושומר את המשתמש
        localStorage.removeItem('pendingUser');
        Swal.fire({
          icon: 'success',
          title: 'נרשמת בהצלחה!',
          text: 'ההרשמה הושלמה והתשלום נקלט',
          confirmButtonText: 'המשך',
        });
      }
    }
  }, []);

  if (loading) {
    // אם הנתונים עדיין נטענים, מציג טעינה
    return (
      <Box sx={{ textAlign: 'center', mt: 8, color: '#fff' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!user) {
    // אם אין משתמש, מציג הודעה והפניה להתחברות
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
          justifyContent: 'center',
          textAlign: 'center',
          p: 3,
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
    // פונקציה להפקת ברכת יום לפי שעה
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'בוקר טוב';
    if (hour >= 12 && hour < 17) return 'צהריים טובים';
    if (hour >= 17 && hour < 21) return 'ערב טוב';
    return 'לילה טוב';
  };

  const greeting = getGreeting();

  const userFields = [
    // מערך לשדות המשתמש להצגה
    { label: 'בית ספר', value: user.school },
    { label: 'כיתה', value: user.classes || '-' },
    { label: 'טלפון', value: user.phone },
    { label: 'סטטוס', value: user.status === 1 ? 'זכר' : user.status === 2 ? 'נקבה' : '-' },
    { label: 'תשלום', value: user.paymentStatus === 1 ? 'שולם' : 'לא שולם' },
    {
      label: 'מנוי התחלה',
      value: user.subscriptionStartDate ? new Date(user.subscriptionStartDate).toLocaleDateString() : '-',
    },
    {
      label: 'מנוי סיום',
      value: user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : '-',
    },
    { label: 'פעיל', value: user.isActive ? '✓ כן' : '✗ לא' },
  ];

  return (
    <Box
      sx={{
        direction: 'rtl',
        width: '100vw',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* רקע שקוף של לוגו */}
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
          width: { xs: '50vw', sm: '40vw', md: '30vw' },
          height: { xs: '20vh', sm: '25vh', md: '30vh' },
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* תפריט עליון */}
  <Box
  sx={{
    position: 'fixed',
    top: { xs: 50, sm: 16 }, // במסכים קטנים יותר הכפתור יורד
    right: 16,               
    left: 'auto',
    zIndex: 1000,
    borderRadius: 2,
    px: 1,
    py: 1,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    backgroundColor: { xs: 'transparent', sm: '#fff' }, // שקוף במסכים קטנים
  }}
>
    <Tooltip title="התנתק" arrow>

  <IconButton color="error" onClick={logout} >
    <ExitToAppIcon />
  </IconButton>
    </Tooltip>

</Box>


      {/* גוף עיקרי */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          mt: { xs: 2, md: 6 },
          px: { xs: 2, md: 0 },
          gap: 3,
        }}
      >
        <Box
          component="img"
          src="/logo1.png"
          alt="Logo"
          sx={{
            width: { xs: 200, sm: 250, md: 350 },
            height: 'auto',
            objectFit: 'contain',
            mt: { xs: 0, md: -5 },
            alignSelf: 'flex-start',
            filter: 'drop-shadow(0 0 15px #00bcd4ff)',
            '&:hover': {
              filter: 'drop-shadow(0 0 30px #00bcd4ff)',
            },    display: { xs: 'none', md: 'block' }, // כאן מוסיפים רספונסיביות

          }}
        />

        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: { xs: '90%', sm: 350, md: 350 },
            p: { xs: 2, sm: 4 },
            borderRadius: '10px',
            backgroundColor: '#fff',
            overflowX: 'hidden',
            zIndex: 2,
            boxShadow:
              '0 0 10px #e91e63, 0 0 15px #ff9800, 0 0 40px #ffc107, 0 0 60px #4dd0e1',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                py: 2,
                px: 4,
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {greeting}, {user.name}!
                <IconButton onClick={handleEditClick} sx={{
                  borderRadius: '50%',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: '#e91e63',
                  color: '#e91e63',
                  background: 'transparent',
                  boxShadow: '0 0 12px #e91e63',
                  p: 1.2,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                    color: '#fff',
                    borderColor: '#e91e63',
                    boxShadow: '0 0 24px #e91e63',
                  },
                }}>
                  <EditIcon />
                </IconButton>
              </Box>
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {userFields.map((field, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Typography sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                  <strong>{field.label}:</strong> {field.value}
                </Typography>
              </Grid>
            ))}
          </Grid>

          <Box
            mt={4}
            sx={{
              maxHeight: '65px',
              maxWidth: { xs: '100%', sm: '700px' },
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderRadius: '8px',
              p: 2,
              backgroundColor: '#f5f5f5',
            }}
          >
            <UserLearningReport userId={user.id} />
          </Box>
        </Paper>
      </Box>

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
      <Box sx={{ bgcolor: '#111', py: 1, width: '100%', direction: 'ltr' }}>
        <Footer />
      </Box>
    </Box>
  );
});

export default UserDetails;
