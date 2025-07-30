import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Footer from '../footer/Footer';
import adminStore from '../../store/adminStore';


const AdminPage = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  // const [showManageButtons, setShowManageButtons] = useState(false);
  const [showManageAdmins, setShowManageAdmins] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null); // מזהה כפתור ב-hover

  const navigate = useNavigate();
  const isSuperAdmin = adminStore.adminType === 1;

  // סטייל בסיסי לכפתור
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

  // סטייל כפתור במצב hover
  const hoverStyle = {
    background: 'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
    color: '#fff',
    borderColor: '#e91e63',
    boxShadow: '0 0 20px #e91e63',
  };

  useEffect(() => {
  setCurrentAdmin(adminStore.currentAdmin);
}, [adminStore.currentAdmin]);

  
useEffect(() => {
  adminStore.fetchCurrentAdmin();
}, []);
useEffect(() => {
  const adminType = Number(localStorage.getItem('adminType'));
  if (!adminType || isNaN(adminType)) {
    navigate('/not-authorized'); // או דף אחר
  }
}, []);

 const handleEdit = () => {
  if (currentAdmin) {
    navigate(`/admin/edit-admin/${currentAdmin.id}`);
  }
};


  const toggleOptions = () => setShowOptions(prev => !prev);
  const toggleManageAdmins = () => setShowManageAdmins(prev => !prev);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

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

        {/* צד ימין: כפתורים */}
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
                  background:
                    'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                  color: '#fff',
                  borderColor: '#e91e63',
                  boxShadow: '0 0 20px #e91e63',
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </h2>

{Number(localStorage.getItem('adminType')) === 1 && (
  // הצג את הכפתורים כאן

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center',
                marginTop: '20px',
              }}
            >
              {/* כפתור ניהול מנהלים */}
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
                        background:
                          'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
                        color: '#fff',
                        borderColor: '#e91e63',
                        boxShadow: '0 0 20px #e91e63',
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => navigate('/admins')}
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
                        background:
                          'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
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

              {/* כפתור הצגת נתונים */}
              <button
                style={hoveredButton === 'showData' ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                onMouseEnter={() => setHoveredButton('showData')}
                onMouseLeave={() => setHoveredButton(null)}  onClick={() => navigate('/admin/user-data')}

              >
                הצגת נתונים ע"פ קריטריונים
              </button>

              {/* כפתור ניהול מוסד */}
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
                        background:
                          'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
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
                        background:
                          'linear-gradient(90deg, #00bcd4, #e91e63, #ffc107)',
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
            </div>
          )}
        </div>
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
          src="logo1.png"
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

    {/* פוטר */}
    <Footer />
  </div>
    </>
  );
};

export default AdminPage;

