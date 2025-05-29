import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddSchool from '../school/AddSchool';
// import '../../css/home.css'; // עיצוב כפתורים כמו בעמוד הבית
// import '../css/home.css';

const AdminPage = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showManageButtons, setShowManageButtons] = useState(false);
  const [showManageAdmins, setShowManageAdmins] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      try {
        const currentAdminId = localStorage.getItem('adminId');
        const adminType = Number(localStorage.getItem('adminType'));

        if (!currentAdminId) {
          console.error("לא נמצא מזהה מנהל");
          return;
        }

        const response = await fetch(`https://localhost:7245/api/Admin/${currentAdminId}`);
        if (!response.ok) {
          console.error('שגיאה בשרת:', response.status);
          return;
        }

        const admin = await response.json();
        setCurrentAdmin(admin);

        if (adminType === 1) {
          setShowManageButtons(true);
        }

      } catch (error) {
        console.error("שגיאה בטעינת המנהל הנוכחי:", error);
      }
    };

    fetchCurrentAdmin();
  }, []);

  useEffect(() => {
    setDialogOpen(location.pathname === '/admin/add-school');
  }, [location.pathname]);

  const handleEdit = () => {
    if (currentAdmin) {
      navigate(`/admin/edit-admin/${currentAdmin.id}`);
    }
  };

  const toggleOptions = () => setShowOptions(prev => !prev);
  const toggleManageAdmins = () => setShowManageAdmins(prev => !prev);
  const handleDialogOpen = () => {
    setDialogOpen(true);
    navigate('/admin/add-school');
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/admin');
  };

  return (
    <div className="admin-page" style={{ textAlign: 'center', padding: '30px' }}>
      <h2>ברוך הבא, {currentAdmin ? currentAdmin.nameAdmin : 'מנהל'}!</h2>

      {currentAdmin && (
        <button className="gradient-button" onClick={handleEdit}>
           ערוך פרטים
        </button>
      )}

      <h2 style={{ marginTop: '30px' }}>ברוכה הבאה לניהול</h2>

      {showManageButtons && (
        <div>
          <button className="gradient-button" onClick={toggleManageAdmins} style={{ marginTop: '20px' }}>
            ניהול מנהלים
          </button>

          {showManageAdmins && (
            <div style={{ marginTop: '20px' }}>
              <button
                className="gradient-button"
                onClick={() => navigate('/admin/add-admin')}
                style={{ margin: '10px' }}
              >
                 הוספת מנהל
              </button>

              <button
                className="gradient-button"
                onClick={() => navigate('/admins')}
                style={{ margin: '10px' }}
              >
                 עריכת/מחיקת מנהל
              </button>
            </div>
          )}
        </div>
      )}

      <button className="gradient-button" style={{ marginTop: '30px' }}>
        הצגת נתונים ע"פ קריטריונים
      </button>

      <button className="gradient-button" onClick={toggleOptions} style={{ margin: '20px' }}>
        ניהול מוסד
      </button>

      {showOptions && (
        <div>
          <button
            className="gradient-button"
            onClick={handleDialogOpen}
            style={{ margin: '10px' }}
          >
             הוספת מוסד
          </button>

          <button
            className="gradient-button"
            onClick={() => navigate('/admin/schools')}
            style={{ margin: '10px' }}
          >
             עריכת/מחיקת מוסד
          </button>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>הוספת מוסד</DialogTitle>
        <DialogContent>
          <AddSchool onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPage;
