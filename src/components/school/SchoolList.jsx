import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ייבוא של useNavigate
import { observer } from 'mobx-react-lite';
import schoolStore from '../../store/schoolStore';

const SchoolList = observer(() => {
  const navigate = useNavigate(); // הגדרת הניווט

  useEffect(() => {
    schoolStore.fetchSchools();
  }, []);

  const handleDelete = async (schoolId) => {
    try {
      // קריאה למחיקת המוסד
      await schoolStore.deleteSchool(schoolId);
    
      // ניווט אחרי מחיקה
      navigate('/admin/schools'); // ניווט לעמוד רשימת המוסדות
    } catch (error) {
      console.error('שגיאה במחיקת המוסד', error);
    }
  };

  const { schools, loading, error } = schoolStore;

  if (loading) return <div>🔄 טוען נתונים...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2>רשימת מוסדות</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>שם מוסד</th>
            <th>מספר כיתות</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(schools) && schools.length > 0 ? (
    schools.map((school) => (
      <tr key={school.id ?? school.nameSchool ?? Math.random().toString()}>
        <td>{school.nameSchool}</td>
        <td>{school.numClass}</td>
        <td>
          <Link to={`/admin/edit-school/${school.id}`} style={{ marginRight: '10px' }}>
            <button>✏️ ערוך</button>
          </Link>
          <button
            onClick={() => handleDelete(school.id)}
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            🗑️ מחק
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr key="no-schools">
      <td colSpan="3" style={{ textAlign: 'center' }}>
        אין מוסדות להצגה
      </td>
    </tr>
  )}
</tbody>
    </table>
    </div>
  );
});

export default SchoolList;

