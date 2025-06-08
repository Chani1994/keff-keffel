import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/home.css';
import Footer from '../components/footer/Footer';

function HomePage() {
  const navigate = useNavigate();

  return (
 <div className="homepage">
  <div className="content-container">
    <div className="left-side">
      <div className="buttons">
        <button className="gradient-button" onClick={() => navigate('/user/login')}>כניסת משתמש</button>
        <button className="gradient-button" onClick={() => navigate('/admin/login')}>כניסת מנהל</button>
      </div>
      <div className="bottom-text gradient-text">
        כפול עוצמה. כפול חוויה. פול הנאה
      </div>
    </div>
    <div className="right-side">
      <img src="/logo1.png" alt="לוגו" className="main-logo glow-logo" />
    </div>
  </div>

  <footer className="footer">
    <Footer />
  </footer>
</div>


  );
}

export default HomePage;
