import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import SchoolStore from '../../store/schoolStore';

const AddSchool = observer(() => {
  const [school, setSchool] = useState({
    nameSchool: '',
    numClass: 1,
    classList: []
  });

  const handleChange = (field, value) => {
    setSchool({ ...school, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await SchoolStore.addSchool(school);
    if (!SchoolStore.error) {
      alert('בית ספר נוסף בהצלחה!');
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
        onChange={(e) => handleChange('numClass', +e.target.value)}
      />

      <button type="submit" disabled={SchoolStore.loading}>
        {SchoolStore.loading ? 'שולח...' : 'שלח'}
      </button>
    </form>
  );
});

export default AddSchool;
