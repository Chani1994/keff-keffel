import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import '../css/home.css';

function HomePage() {
  return (
   <div className="homepage">
      <div className="logo-block">
        <img src="/logo1.png" alt="לוגו כיף כפל" className="main-logo" />

        {/* עטיפה חדשה עבור המשפט והכפתורים */}
        <div className="side-content">
          <div className="top-right-text gradient-text">
            כפול עוצמה. כפול חוויה. פול הנאה
          </div>

          <div className="buttons-container">
            <Button
              variant="outlined"
              className="user-button"
              component={Link}
              to="/user/login"
            >
              כניסה
            </Button>

            <Button
              variant="outlined"
              className="admin-button"
              component={Link}
              to="/admin/login"
            >
              כניסת מנהל
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
