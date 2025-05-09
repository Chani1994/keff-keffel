import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import SchoolStore from '../../store/schoolStore';
import { useNavigate } from 'react-router-dom';

const AddSchool = observer(() => {
  const [school, setSchool] = useState({
    nameSchool: '',
    numClass: 1,
    barcode: '',
    numStudent: 0,
    classList: null
  });

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setSchool({ ...school, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await SchoolStore.addSchool(school);
    if (!SchoolStore.error) {
      alert('בית ספר נוסף בהצלחה!');
      navigate('/admin');
    } else {
      alert('שגיאה: ' + SchoolStore.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>הוספת בית ספר</h2>

      <label>שם בית ספר:</label>
      <input
        type="text"
        value={school.nameSchool}
        onChange={(e) => handleChange('nameSchool', e.target.value)}
      />

      <label>מספר כיתות:</label>
      <input
        type="number"
        value={school.numClass}
        min="0"
        onChange={(e) => handleChange('numClass', +e.target.value)}
      />

      <label>ברקוד:</label>
      <input
        type="text"
        value={school.barcode}
        onChange={(e) => handleChange('barcode', e.target.value)}
      />

      <label>מספר תלמידים:</label>
      <input
        type="number"
        value={school.numStudent}
        min="0"
        onChange={(e) => handleChange('numStudent', +e.target.value)}
      />

      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={SchoolStore.loading}>
          {SchoolStore.loading ? 'שולח...' : 'שלח'}
        </button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginRight: '1rem' }}>
          ביטול
        </button>
      </div>
    </form>
  );
});

export default AddSchool;


