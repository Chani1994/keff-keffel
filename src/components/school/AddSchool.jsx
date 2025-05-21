import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import schoolStore from '../../store/schoolStore';

const AddSchool = observer(() => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schoolStore.addSchool();
      await Swal.fire({
        icon: 'success',
        title: 'המוסד נוסף בהצלחה',
        timer: 2000,
        showConfirmButton: false,
      });
      schoolStore.resetSchoolData();
      navigate(-1);
    } catch (error) {
      console.error('שגיאה:', error);
      await Swal.fire({
        icon: 'error',
        title: 'שגיאה בשליחה',
        text: error.message || 'נסה שוב מאוחר יותר',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: 'rtl', maxWidth: '800px', margin: 'auto' }}>
      <h2>הוספת מוסד</h2>

      <label>שם מוסד:</label>
      <input
        type="text"
        value={schoolStore.NameSchool}
        onChange={(e) => schoolStore.setField('NameSchool', e.target.value)}
      />

      <label>מספר כיתות:</label>
      <input
        type="number"
        value={schoolStore.NumClass}
        onChange={(e) => schoolStore.setNumClasses(+e.target.value)}
      />

      <label>ברקוד:</label>
      <input
        type="text"
        value={schoolStore.Barcode}
        onChange={(e) => schoolStore.setField('Barcode', e.target.value)}
      />

      <label>מספר תלמידים כולל:</label>
      <input
        type="number"
        value={schoolStore.NumStudent}
        onChange={(e) => schoolStore.setField('NumStudent', +e.target.value)}
      />

      <hr />
      <h3>שנתונים</h3>
      {(schoolStore.ClassList ?? []).map((cls, classIndex) => (
        <div key={classIndex} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <label>שם שנתון:</label>
          <input
            type="text"
            value={cls.name}
            onChange={(e) => schoolStore.updateClass(classIndex, 'name', e.target.value)}
          />

          <label>שנה:</label>
          <input
            type="number"
            value={cls.year}
            onChange={(e) => schoolStore.updateClass(classIndex, 'year', +e.target.value)}
          />

          <label>מספר תלמידים בשנתון:</label>
          <input
            type="number"
            value={cls.students.length}
            onChange={(e) => schoolStore.setNumStudentsInClass(classIndex, +e.target.value)}
          />

          <h4>תלמידים</h4>
          {cls.students.map((student, studentIndex) => (
            <div key={studentIndex} style={{ marginRight: '1rem', marginBottom: '1rem' }}>
              <label>שם:</label>
              <input
                type="text"
                value={student.name}
                onChange={(e) =>
                  schoolStore.updateStudent(classIndex, studentIndex, 'name', e.target.value)
                }
              />

              <label>בית ספר:</label>
<input
  type="text"
  value={schoolStore.NameSchool}  // שם בית הספר מגיע מהסטור ולא מהתלמיד
  readOnly                     // מונע עריכה - אם רוצים לא לאפשר לשנות
  // אם רוצים לאפשר שינוי ידני, אפשר להסיר את השורה הזו
  // onChange={(e) =>
  //   schoolStore.updateStudent(classIndex, studentIndex, 'school', e.target.value)
  // }
/>

              <label>כיתה:</label>
              <input
                type="text"
                value={student.Classes} 
                onChange={(e) =>
                  schoolStore.updateStudent(classIndex, studentIndex, 'Classes', e.target.value)
                }
              />

              <label>טלפון:</label>
              <input
                type="text"
                value={student.phone}
                onChange={(e) =>
                  schoolStore.updateStudent(classIndex, studentIndex, 'phone', e.target.value)
                }
              />

              <label>נקודות:</label>
              <input
                type="number"
                value={student.points}
                onChange={(e) =>
                  schoolStore.updateStudent(classIndex, studentIndex, 'points', +e.target.value)
                }
              />

              <label>שיעורים:</label>
              <input
                type="number"
                value={student.timeLessons}
                onChange={(e) =>
                  schoolStore.updateStudent(classIndex, studentIndex, 'timeLessons', +e.target.value)
                }
              />

              <label>עבר בהצלחה:</label>
              <input
                type="checkbox"
                checked={student.success}
                onChange={(e) =>
                  schoolStore.updateStudent(classIndex, studentIndex, 'success', e.target.checked)
                }
              />
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={loading}>
          {loading ? 'שולח...' : 'שלח'}
        </button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginRight: '1rem' }}>
          ביטול
        </button>
      </div>
    </form>
  );
});

export default AddSchool;
