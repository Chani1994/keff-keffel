import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const UserRegister = observer(() => {
  const [user, setUser] = useState({
    name: '',
    school: '',
    classes: '',
    phone: '',
    points: 0,
    timeLessons: 0,
    success: true,
    index: 0,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userStore.register(user, navigate);
  };

  return (
    <div className="register-container">
      <h2>הרשמת משתמש</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="שם מלא" value={user.name} onChange={handleChange} />
        <input name="school" placeholder="בית ספר" value={user.school} onChange={handleChange} />
        <input name="classes" placeholder="כיתה" value={user.classes} onChange={handleChange} />
        <input name="phone" placeholder="טלפון" value={user.phone} onChange={handleChange} />
        <input name="points" type="number" placeholder="נקודות" value={user.points} onChange={handleChange} />
        <input name="timeLessons" type="number" placeholder="זמן שיעורים" value={user.timeLessons} onChange={handleChange} />
        <button type="submit">הרשם</button>
      </form>
    </div>
  );
});

export default UserRegister;

