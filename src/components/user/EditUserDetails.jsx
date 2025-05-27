import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import userStore from '../../store/userStore';
import { useNavigate } from 'react-router-dom';

const EditUserDetails = observer(() => {
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

  // נטעין את פרטי המשתמש הקיים מה־store כשנטען הקומפוננטה
  useEffect(() => {
    if (userStore.currentUser) {
      setUser(userStore.currentUser);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: name === 'points' || name === 'timeLessons' ? +value : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    userStore.updateUser(user, navigate); // ודא שהפונקציה הזו קיימת ב־store
  };

  return (
    <div className="register-container">
      <h2>עריכת פרטי משתמש</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="שם מלא" value={user.name} onChange={handleChange} />
        <input name="school" placeholder="בית ספר" value={user.school} onChange={handleChange} />
        <input name="classes" placeholder="כיתה" value={user.classes} onChange={handleChange} />
        <input name="phone" placeholder="טלפון" value={user.phone} onChange={handleChange} />
        {/* <input name="points" type="number" placeholder="נקודות" value={user.points} onChange={handleChange} />
        <input name="timeLessons" type="number" placeholder="זמן שיעורים" value={user.timeLessons} onChange={handleChange} /> */}
        <button type="submit">שמור שינויים</button>
      </form>
    </div>
  );
});

export default EditUserDetails;