import React from 'react';
import { ButtonGroup, Button } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

import '../App.css';
import '../css/home.css'; // נשתמש בקובץ עיצוב חיצוני
 function HomePage() {
  return (
    <>
    <div className="home-container">
      <h1 className="title">ברוכים הבאים לכיף־כפל </h1>
      <p className="subtitle">הדרך הכי כיפית ללמוד לוח הכפל!</p>

      
          <ButtonGroup size="large" aria-label="large button group" >
            <Button >
              <Link to="admin-login">כניסת מנהל</Link>
            </Button>
            <Button >
              <Link to="/user">כניסת משתמש</Link>
            </Button>
          </ButtonGroup>
          <br />
          <Outlet />
          </div>
       
    </>
  );
}
export default  HomePage
