import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/home.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate(); // כאן את מגדירה את הפונקציה

  return (
  <div className="homepage">
  <div className="logo-block">
    
    <div className="left-buttons">
       <button className="gradient-button" onClick={() => navigate('/user/login')}>
        כניסת משתמש
      </button>
      <button className="gradient-button" onClick={() => navigate('/admin/login')}>
        כניסת מנהל
      </button>
    </div>

    <div className="right-logo-content">
      <img src="/logo1.png" alt="לוגו" className="main-logo" />
      <div className="bottom-text gradient-text">
        כפול עוצמה. כפול חוויה. פול הנאה
      </div>
    </div>

  </div>
</div>

  );
}

export default HomePage;
