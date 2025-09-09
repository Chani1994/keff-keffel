import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton,Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Footer from '../footer/Footer';
import adminStore from '../../store/adminStore';
import schoolStore from '../../store/schoolStore';

const AdminPage = observer(() => {
  // סטייט למנהל הנוכחי (נטען מה-store)
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // סטייט להצגת תפריט אפשרויות
  const [showOptions, setShowOptions] = useState(false);

  // סטייט להצגת מסך ניהול מנהלים
  const [showManageAdmins, setShowManageAdmins] = useState(false);

  // סטייט לשמירת כפתור שנמצא תחת ריחוף (hover)
  const [hoveredButton, setHoveredButton] = useState(null);

  // מאפשר ניתוב בין דפים
  const navigate = useNavigate();

  // שליפת סוג המנהל מה-localStorage (1 = מנהל-על)
  const adminTypeFromStorage = Number(localStorage.getItem('adminType'));

  // האם המשתמש הוא מנהל-על?
  const isSuperAdmin = adminTypeFromStorage === 1;

  // סגנון בסיסי לכפתורים
  const buttonStyle = {
    background: 'transparent',
    color: '#00bcd4',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#00bcd4',
    borderRadius: '30px',
    padding: '10px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 8px #00bcd4',
    textAlign: 'center',
  };

  // סגנון לכפתור כאשר הוא תחת hover
  const hoverStyle = {
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    color: '#fff',
    borderColor: '#e91e63',
    boxShadow: '0 0 20px #e91e63',
  };

  // כל פעם שהמנהל משתנה ב־adminStore – נעדכן את הסטייט המקומי
  useEffect(() => {
    setCurrentAdmin(adminStore.currentAdmin);
  }, [adminStore.currentAdmin]);

  // טעינת פרטי המנהל מהשרת כאשר הקומפוננטה נטענת
  useEffect(() => {
    adminStore.fetchCurrentAdmin();
  }, []);

  // אם לא קיים סוג מנהל או שיש שגיאה בפרמטר – ננתב למסך הרשאה לא תקינה
  useEffect(() => {
    if (!adminTypeFromStorage || isNaN(adminTypeFromStorage)) {
      navigate('/not-authorized'); // ניתן לשנות לנתיב אחר לפי הצורך
    }
  }, [adminTypeFromStorage, navigate]);

  // אם למנהל יש מזהה מוסד – נטען את פרטי המוסד מה־store
  useEffect(() => {
    if (currentAdmin?.schoolId) {
      schoolStore.loadSchoolById(currentAdmin.schoolId);
    }
  }, [currentAdmin]);

  // ניווט למסך עריכת פרטי מנהל
  const handleEdit = () => {
    if (currentAdmin) {
      navigate(`/admin/edit-admin/${currentAdmin.id}`);
    }
  };

  // הצגה/הסתרה של אפשרויות בתפריט
  const toggleOptions = () => setShowOptions((prev) => !prev);

  // הצגה/הסתרה של ממשק ניהול מנהלים
  const toggleManageAdmins = () => setShowManageAdmins((prev) => !prev);




  return (
    
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // גובה מינימום של המסך
    overflowX: 'hidden', // מונע גלילה אופקית
    backgroundColor: '#000',
  }}
>
 {/* תוכן עם גלילה */}
  <Box
    sx={{

      flex: 1,
      overflowY: 'auto',
      p: 2,
    }}
  >
      <div
        className="admin-page"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
          width: '100vw',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: '50px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: 'center',
              color: 'white',
              WebkitTextStroke: '1.5px #00bcd4',
              fontWeight: 'bold',
              fontSize: '2rem',
            }}
          >
            ברוך הבא, {currentAdmin ? currentAdmin.nameAdmin : 'מנהל'}!
            <IconButton
              onClick={handleEdit}
              sx={{
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
                  boxShadow: '0 0 20px #e91e63',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </h2>

          {/* {adminTypeFromStorage === 2 && currentAdmin && (
            <div style={{ marginTop: '20px' }}>
              <button
                style={
                  hoveredButton === 'manageOwnInstitution'
                    ? { ...buttonStyle, ...hoverStyle }
                    : buttonStyle
                }
                onMouseEnter={() => setHoveredButton('manageOwnInstitution')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => {
                  if (currentAdmin?.schoolId) {
                    navigate(`/admin/edit-school/${currentAdmin.schoolId}`);
                  }
                }}
              >
                ניהול מוסד
              </button>
            </div>
          )} */}

          {isSuperAdmin && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              <button
                style={hoveredButton === 'manageAdmins' ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                onMouseEnter={() => setHoveredButton('manageAdmins')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={toggleManageAdmins}
              >
                ניהול מנהלים
              </button>

              {showManageAdmins && (
                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                  }}
                >
                  <IconButton
                    onClick={() => navigate('/admin/add-admin')}
                    sx={{
                      borderRadius: '50%',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: '#00bcd4',
                      color: '#00bcd4',
                      background: 'transparent',
                      boxShadow: '0 0 8px #00bcd4',
                      p: 1.5,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                        color: '#fff',
                        borderColor: '#e91e63',
                        boxShadow: '0 0 20px #e91e63',
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate('/admin/all-admins')}
                    sx={{
                      borderRadius: '50%',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: '#00bcd4',
                      color: '#00bcd4',
                      background: 'transparent',
                      boxShadow: '0 0 8px #00bcd4',
                      p: 1.5,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                        color: '#fff',
                        borderColor: '#e91e63',
                        boxShadow: '0 0 20px #e91e63',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              )}

              <button
                style={hoveredButton === 'showData' ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                onMouseEnter={() => setHoveredButton('showData')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => navigate('/admin/user-data')}
              >
                הצגת נתונים ע"פ קריטריונים
              </button>

              <button
                style={hoveredButton === 'manageInstitution' ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                onMouseEnter={() => setHoveredButton('manageInstitution')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={toggleOptions}
              >
                ניהול מוסד
              </button>

              {showOptions && (
                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                  }}
                >
                  <IconButton
                    onClick={() => navigate('/admin/add-school')}
                    sx={{
                      borderRadius: '50%',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: '#00bcd4',
                      color: '#00bcd4',
                      background: 'transparent',
                      boxShadow: '0 0 8px #00bcd4',
                      p: 1.5,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                        color: '#fff',
                        borderColor: '#e91e63',
                        boxShadow: '0 0 20px #e91e63',
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate('/admin/schools')}
                    sx={{
                      borderRadius: '50%',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: '#00bcd4',
                      color: '#00bcd4',
                      background: 'transparent',
                      boxShadow: '0 0 8px #00bcd4',
                      p: 1.5,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                        color: '#fff',
                        borderColor: '#e91e63',
                        boxShadow: '0 0 20px #e91e63',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
              )}
              
              <button
  style={hoveredButton === 'addUser' ? { ...buttonStyle, ...hoverStyle } : buttonStyle} // הערך שונה
  onMouseEnter={() => setHoveredButton('addUser')} // הערך שונה
  onMouseLeave={() => setHoveredButton(null)}
  onClick={() => navigate('/admin/add-user')}
>
  הוספת תלמיד
</button>
            </div>
          )}
  


        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img
src="/logo1.png"
            alt="Admin Page"
            style={{
              maxWidth: '100%',
              height: 'auto',
              borderRadius: '20px',
              animation: 'slideIn 1.5s ease forwards',
            }}
          />
        </div>
      </div>
</Box>
      <style>
        {`
        
          @keyframes slideIn {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
 <Box
  sx={{
      width: '100%',
      background: '#121212',
      padding: '15px 0',
      textAlign: 'center',
      position: 'relative',
      color: '#eee',
      fontSize: '1rem',
      boxShadow: 'inset 0 1px 3px #000',
      bottom: -1,
    }}
  
  >
    
 
      <Footer />
       </Box>
    </Box>
  );
});

export default AdminPage;