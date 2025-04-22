import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const toggleOptions = () => {
    setShowOptions(prev => !prev);
  };

  return (
    <div>
      <h2>ברוכה הבאה לניהול</h2>
      <button onClick={toggleOptions}>ניהול מוסד</button>

      {showOptions && (
        <div>
          <button onClick={() => navigate('/admin/school-add')}>הוספת מוסד</button>
          <button onClick={() => navigate('/admin/school-edit')}> עריכה/שינוי מוסד</button>
          <button onClick={() => navigate('/admin/school-delete')}> מחיקת מוסד</button>
        </div>
      )}
       <button >הצגת נתונים ע"פ קריטריונים</button>

    </div>
  );
};

export default AdminPage;
