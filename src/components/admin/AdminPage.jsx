import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import '../../css/admin.css'

const AdminPage = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showManageButtons, setShowManageButtons] = useState(false);
  const [showManageAdmins, setShowManageAdmins] = useState(false);

  const navigate = useNavigate();

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

  const handleEdit = () => {
    if (currentAdmin) {
      navigate(`/admin/edit-admin/${currentAdmin.id}`);
    }
  };

  const toggleOptions = () => setShowOptions(prev => !prev);
  const toggleManageAdmins = () => setShowManageAdmins(prev => !prev);

  return (
    <div
      className="admin-page"
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100vw',
        direction: 'rtl',
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
        <h2>ברוך הבא, {currentAdmin ? currentAdmin.nameAdmin : 'מנהל'}!</h2>

        {currentAdmin && (
          <button className="gradient-button" onClick={handleEdit}>
            ערוך פרטים
          </button>
        )}

        {showManageButtons && (
          <>
            <button className="gradient-button" onClick={toggleManageAdmins} style={{ marginTop: '20px' }}>
              ניהול מנהלים
            </button>

            {showManageAdmins && (
              <div style={{ marginTop: '20px' }}>
                <button className="gradient-button" onClick={() => navigate('/admin/add-admin')} style={{ margin: '10px' }}>
                  הוספת מנהל
                </button>
                <button className="gradient-button" onClick={() => navigate('/admins')} style={{ margin: '10px' }}>
                  עריכת/מחיקת מנהל
                </button>
              </div>
            )}
          </>
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
              onClick={() => navigate('/admin/add-school')}
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
      </div>

      {/* צד שמאל: לוגו */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'right',
          paddingLeft: '0px'
        }}
      >
        <img
          src="/logo1.png"
          alt="לוגו"
          style={{
            width: '400px',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};

export default AdminPage;
