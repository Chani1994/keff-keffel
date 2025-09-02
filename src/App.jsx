import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserStore from './store/userStore'; 
import AdminStore from './store/adminStore';
import { Outlet } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
useEffect(() => {
    AdminStore.autoLogin(); // ניסיון שחזור התחברות
     UserStore.autoLogin(); // טוען משתמש אם קיים

  }, []);

useEffect(() => {
  const handleUnload = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminType');
    localStorage.removeItem('adminName');
  };

  window.addEventListener('beforeunload', handleUnload);

  return () => {
    window.removeEventListener('beforeunload', handleUnload);
  };
}, []);


//   useEffect(() => {
//   const params = new URLSearchParams(window.location.search);
//   const paid = params.get('paid');

//   if (paid === 'true') {
//     // כאן מבצעים את סיום ההרשמה
//     const savedUser = localStorage.getItem('pendingUser');
//     if (savedUser) {
//       const parsedUser = JSON.parse(savedUser);
//       UserStore.finishRegistration(parsedUser, navigate);
//       localStorage.removeItem('pendingUser');
//     }
    
//     // סוגרים את החלון האוטומטית (אם זה חלון פופאפ)
//     window.close();
//   }
// }, []);


  return (
    <>
        <Outlet /> {/* כאן ירנדרו כל הרואטים הפנימיים */}
    </>
  );
}

export default App
