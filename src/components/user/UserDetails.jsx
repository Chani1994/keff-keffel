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
  CircularProgress
} from '@mui/material';
import EditUserDetails from './EditUserDetails';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'בוקר טוב';
  if (hour >= 12 && hour < 17) return 'צהריים טובים';
  if (hour >= 17 && hour < 21) return 'ערב טוב';
  return 'לילה טוב';
};

const UserDetails = observer(({ closeDialog }) => {
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

  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // פונקציה שתיקבל את המשתמש המעודכן מ-EditUserDetails
  const handleUserUpdate = (updatedUser) => {
    UserStore.updateUser(updatedUser, () => {
      setOpenDialog(false);
      navigate('/user/details');
    });
  };

  const user = UserStore.currentUser;
  const greeting = getGreeting();

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}><CircularProgress /></div>;
  if (!user) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>לא התחברת עדיין</div>;

  return (
    <div style={{ direction: 'rtl', padding: '2rem', textAlign: 'right', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0 }}>
          {greeting}, {user.name}!
        </h2>
        <IconButton onClick={handleEditClick} aria-label="edit user">
          <EditIcon />
        </IconButton>
      </div>

      <p><strong>שם:</strong> {user.name}</p>
      <p><strong>בית ספר:</strong> {user.school}</p>
      <p><strong>כיתה:</strong> {user.classes}</p>
      <p><strong>טלפון:</strong> {user.phone}</p>
      <p><strong>נקודות:</strong> {user.points}</p>
      <p><strong>מספר שיעורים:</strong> {user.timeLessons}</p>
      <p><strong>הצלחה:</strong> {user.success ? '✓ כן' : '✗ לא'}</p>
      <p><strong>אינדקס:</strong> {user.index}</p>
      <p><strong>מזהה:</strong> {user.id}</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button variant="contained" color="primary" onClick={goToReport}>
          דוח למידה
        </Button>
        <Button variant="contained" color="error" onClick={logout}>
          התנתקות
        </Button>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>עריכת פרטי משתמש</DialogTitle>
        <DialogContent>
          <EditUserDetails
            user={user}
            closeDialog={handleCloseDialog}
            onSubmit={handleUserUpdate}
          />
        </DialogContent>
      </Dialog>

      <Outlet />
    </div>
  );
});

export default UserDetails;
