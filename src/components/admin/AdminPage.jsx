import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddSchool from '../school/AddSchool'; // אם יש קומפוננטת AddSchool

const AdminPage = () => {
  const [admins, setAdmins] = useState([]); 
  const [currentAdmin, setCurrentAdmin] = useState(null); // שמור את המנהל הנוכחי ב־state
  const [showOptions, setShowOptions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showManageButtons, setShowManageButtons] = useState(false);
  const [showManageAdmins, setShowManageAdmins] = useState(false); // מצב למנהל

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      try {
        const currentAdminId = localStorage.getItem('adminId');
        const adminType = Number(localStorage.getItem('adminType'));
        const adminName = localStorage.getItem('adminName');

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
        setAdmins([admin]);
        setCurrentAdmin(admin); // שמור את המנהל הנוכחי ב־state
  
        // ניהול הרשאות
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
    if (location.pathname === '/admin/add-school') {
      setDialogOpen(true);
    } else {
      setDialogOpen(false);
    }
  }, [location.pathname]);
  
  const handleEdit = () => {
    if (currentAdmin) {
      // אם רוצים לנתב לדף עריכת פרטי המנהל
      navigate(`/edit-admin/${currentAdmin.id}`);
    }
  };

  // פונקציות לניהול מצב
  const toggleOptions = () => setShowOptions(prev => !prev);
  const toggleManageAdmins = () => setShowManageAdmins(prev => !prev); // פונקציה למעבר מצב ניהול מנהלים
  
  const handleDialogOpen = () => {
    setDialogOpen(true); // או כל state שפותח את הדיאלוג
    navigate('/admin/add-school'); // משנה את הנתיב למוסד
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate('/admin'); // חזרה לדף הניהול לאחר סגירת הדיאלוג
  };

  return (
    <div>
      <h2>ברוך הבא, {currentAdmin ? currentAdmin.nameAdmin : 'מנהל'}!</h2>
      <div>
        {/* הצגת כפתור עריכה רק אם המנהל הוא המנהל הנוכחי */}
        {currentAdmin && (
          <button onClick={handleEdit}>✏️ ערוך פרטים</button>
        )}
      </div>
      <h2>ברוכה הבאה לניהול</h2>

      {/* כפתור ניהול מנהלים */}
      {showManageButtons && (
        <div>
          <button onClick={toggleManageAdmins} style={{ marginTop: '20px' }}>ניהול מנהלים</button>
          
          {/* כפתורים להוספה, עריכה ומחיקה */}
          {showManageAdmins && (
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  style={{ margin: '5px' }}
                  onClick={() => navigate('admin/add-admin')}
                >
                  ➕ הוספת מנהל
                </button>
        
                <button
                  style={{ margin: '5px' }}
                  onClick={() => navigate('/admins')}
                >
                  ✏️ עריכת/מחיקת מנהל
                </button>
              </div>
          )}
        </div>
      )}

      {/* כפתור הצגת נתונים */}
      <button style={{ marginTop: '20px' }}>📊 הצגת נתונים ע"פ קריטריונים</button>

      {/* כפתור ניהול מוסד */}
      <button onClick={toggleOptions} style={{ margin: '10px' }}>ניהול מוסד</button>

      {/* הצגת אפשרויות ניהול מוסד */}
      {showOptions && (
        <div>
          <button onClick={handleDialogOpen} style={{ margin: '5px' }}>➕ הוספת מוסד</button>
          <button onClick={() => navigate('/admin/school-edit')} style={{ margin: '5px' }}>✏️ עריכת מוסד</button>
          <button onClick={() => navigate('/admin/school-delete')} style={{ margin: '5px' }}>🗑️ מחיקת מוסד</button>
        </div>
      )}

      {/* דיאלוג הוספת מוסד */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>הוספת מוסד</DialogTitle>
        <DialogContent>
          <AddSchool onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">סגור</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminPage;

