import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2';
import schoolStore from '../../store/schoolStore';

const EditSchool = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [localSchool, setLocalSchool] = useState({
    id: 0,
    nameSchool: '',
    numClass: 0,
    barcode: '',
    numStudent: 0,
    classList: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (schoolStore.schools.length === 0) {
        await schoolStore.fetchSchools();
      }
      const school = schoolStore.schools.find(s => s.id === parseInt(id, 10));
      if (school) {
        setLocalSchool({
          id: school.id,
          nameSchool: school.nameSchool,
          numClass: school.numClass,
          barcode: school.barcode,
          numStudent: school.numStudent,
          classList: school.classList ? JSON.parse(JSON.stringify(school.classList)) : []
        });
      } else {
        Swal.fire('שגיאה', 'המוסד לא נמצא', 'error');
        navigate(-1);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalSchool(prev => ({
      ...prev,
      [name]: ['numClass', 'numStudent'].includes(name) ? parseInt(value, 10) || 0 : value
    }));
  };

  const handleClassChange = (index, field, value) => {
    setLocalSchool(prev => {
      const newClassList = [...prev.classList];
      if (!newClassList[index]) newClassList[index] = { name: '', year: 0, students: [] };
      if (field === 'year') {
        newClassList[index][field] = parseInt(value, 10) || 0;
      } else {
        newClassList[index][field] = value;
      }
      return { ...prev, classList: newClassList };
    });
  };

  const handleStudentChange = (classIndex, studentIndex, field, value) => {
    setLocalSchool(prev => {
      const newClassList = [...prev.classList];
      const cls = newClassList[classIndex];
      if (!cls.students) cls.students = [];
      if (!cls.students[studentIndex]) cls.students[studentIndex] = {};
      if (field === 'points' || field === 'timeLessons') {
        cls.students[studentIndex][field] = parseInt(value, 10) || 0;
      } else if (field === 'success') {
        cls.students[studentIndex][field] = Boolean(value);
      } else {
        cls.students[studentIndex][field] = value;
      }
      return { ...prev, classList: newClassList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await schoolStore.updateSchool(localSchool.id, localSchool);
      await Swal.fire({
        icon: 'success',
        title: 'המוסד עודכן בהצלחה',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/admin/schools');
    } catch (error) {
      console.error('שגיאה בעדכון מוסד:', error);
      Swal.fire('שגיאה', error.message || 'אירעה שגיאה בעדכון, נסה שוב.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ direction: 'rtl', maxWidth: '800px', margin: 'auto' }}
      autoComplete="off"
    >
      <h2>עריכת מוסד</h2>

      <label>שם מוסד:</label>
      <input
        type="text"
        name="nameSchool"
        value={localSchool.nameSchool}
        onChange={handleChange}
        required
      />

      <label>מספר כיתות:</label>
      <input
        type="number"
        name="numClass"
        value={localSchool.numClass}
        onChange={handleChange}
        min={0}
        required
      />

      <label>ברקוד:</label>
      <input
        type="text"
        name="barcode"
        value={localSchool.barcode}
        onChange={handleChange}
      />

      <label>מספר תלמידים כולל:</label>
      <input
        type="number"
        name="numStudent"
        value={localSchool.numStudent}
        onChange={handleChange}
        min={0}
      />

      <hr />
      <h3>שנתונים</h3>

      {(localSchool.classList ?? []).map((cls, classIndex) => (
        <div key={classIndex} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <label>שם שנתון:</label>
          <input
            type="text"
            value={cls.name}
            onChange={e => handleClassChange(classIndex, 'name', e.target.value)}
          />

          <label>שנה:</label>
          <input
            type="number"
            value={cls.year}
            onChange={e => handleClassChange(classIndex, 'year', e.target.value)}
            min={0}
          />

          <h4>תלמידים</h4>
          {(cls.students ?? []).map((student, studentIndex) => (
            <div key={studentIndex} style={{ marginRight: '1rem', marginBottom: '1rem' }}>
              <label>שם:</label>
              <input
                type="text"
                value={student.name || ''}
                onChange={e => handleStudentChange(classIndex, studentIndex, 'name', e.target.value)}
              />

              <label>כיתה:</label>
              <input
                type="text"
                value={student.class || ''}
                onChange={e => handleStudentChange(classIndex, studentIndex, 'class', e.target.value)}
              />

              <label>טלפון:</label>
              <input
                type="text"
                value={student.phone || ''}
                onChange={e => handleStudentChange(classIndex, studentIndex, 'phone', e.target.value)}
              />

              <label>נקודות:</label>
              <input
                type="number"
                value={student.points || 0}
                onChange={e => handleStudentChange(classIndex, studentIndex, 'points', e.target.value)}
                min={0}
              />

              <label>שיעורים:</label>
              <input
                type="number"
                value={student.timeLessons || 0}
                onChange={e => handleStudentChange(classIndex, studentIndex, 'timeLessons', e.target.value)}
                min={0}
              />

              <label>עבר בהצלחה:</label>
              <input
                type="checkbox"
                checked={student.success || false}
                onChange={e => handleStudentChange(classIndex, studentIndex, 'success', e.target.checked)}
              />
            </div>
          ))}
        </div>
      ))}

      <div style={{ marginTop: '1rem' }}>
        <button type="submit" disabled={loading}>
          {loading ? 'שומר...' : '💾 שמור שינויים'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{ marginRight: '1rem' }}
          disabled={loading}
        >
          ביטול
        </button>
      </div>
    </form>
  );
});

export default EditSchool;
