import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import UserStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'בוקר טוב';
  if (hour >= 12 && hour < 17) return 'צהריים טובים';
  if (hour >= 17 && hour < 21) return 'ערב טוב';
  return 'לילה טוב';
};

const UserDetails = observer(() => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!UserStore.currentUser) {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          UserStore.currentUser = JSON.parse(savedUser);
        }
      }
      setLoading(false);
    }, []);
  
    const logout = () => {
      UserStore.currentUser = null;
      localStorage.removeItem('currentUser');
      navigate('/');
    };
  
    const goToReport = () => {
      navigate('/user/details/learningReport'); 
    };
  
    const user = UserStore.currentUser;
    const greeting = getGreeting();
  
    if (loading) return <div>טוען...</div>;
    if (!user) return <div>לא התחברת עדיין</div>;
  
    return (
      <div style={{ direction: 'rtl', padding: '2rem', textAlign: 'right' }}>
        <h2>{greeting}, {user.name}!</h2>
        <p><strong>שם:</strong> {user.name}</p>
        <p><strong>בית ספר:</strong> {user.school}</p>
        <p><strong>כיתה:</strong> {user.classes}</p>
        <p><strong>טלפון:</strong> {user.phone}</p>
        <p><strong>נקודות:</strong> {user.points}</p>
        <p><strong>מספר שיעורים:</strong> {user.timeLessons}</p>
        <p><strong>הצלחה:</strong> {user.success ? '✓ כן' : '✗ לא'}</p>
        <p><strong>אינדקס:</strong> {user.index}</p>
        <p><strong>מזהה:</strong> {user.id}</p>
  
        <div style={{ marginTop: '2rem' }}>
          <button
            onClick={goToReport}
            style={{
              marginRight: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#457b9d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            דוח למידה
          </button>
  
          <button
            onClick={logout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#e63946',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            התנתקות
          </button>
        </div>
        <Outlet />

      </div>
    );
  });
  
export default UserDetails;
