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
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!user.name.trim()) newErrors.name = 'שם נדרש';
    if (!user.school.trim()) newErrors.school = 'בית ספר נדרש';
    if (!user.classes.trim()) newErrors.classes = 'כיתה נדרשת';
    if (!user.phone.trim()) newErrors.phone = 'טלפון נדרש';
    else if (!/^0[2-9]\d{7,8}$/.test(user.phone)) newErrors.phone = 'מספר טלפון לא תקין';
    if (user.points < 0) newErrors.points = 'נקודות חייבות להיות מספר חיובי';
    if (user.timeLessons < 0) newErrors.timeLessons = 'זמן שיעורים חייב להיות חיובי';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setErrors(prev => ({ ...prev, form: 'יש למלא את כל השדות הנדרשים כראוי' }));
      return;
    }
    userStore.register(user, navigate);
  };

  return (
    <div className="register-container">
      <h2>הרשמת משתמש</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="שם מלא" value={user.name} onChange={handleChange} />
        {errors.name && <div className="error">{errors.name}</div>}

        <input name="school" placeholder="בית ספר" value={user.school} onChange={handleChange} />
        {errors.school && <div className="error">{errors.school}</div>}

        <input name="classes" placeholder="כיתה" value={user.classes} onChange={handleChange} />
        {errors.classes && <div className="error">{errors.classes}</div>}

        <input name="phone" placeholder="טלפון" value={user.phone} onChange={handleChange} />
        {errors.phone && <div className="error">{errors.phone}</div>}

        <input name="points" type="number" placeholder="נקודות" value={user.points} onChange={handleChange} />
        {errors.points && <div className="error">{errors.points}</div>}

        <input name="timeLessons" type="number" placeholder="זמן שיעורים" value={user.timeLessons} onChange={handleChange} />
        {errors.timeLessons && <div className="error">{errors.timeLessons}</div>}

        {errors.form && <div className="error">{errors.form}</div>}

        <button type="submit">הרשם</button>
      </form>
    </div>
  );
});

export default UserRegister;
