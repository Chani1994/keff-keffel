import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import schoolStore from '../../store/schoolStore';

const SchoolList = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    schoolStore.fetchSchools();
        console.log(schoolStore.schools);

  }, []);

  const handleDelete = async (schoolId, schoolName) => {
    const confirmDelete = window.confirm(
      `האם אתה בטוח שברצונך למחוק את המוסד "${schoolName}"?\nפעולה זו תגרום למחיקת כל התלמידים והשנתונים של המוסד!`
    );
    if (!confirmDelete) return;

    try {
      await schoolStore.deleteSchool(schoolId);
      await schoolStore.fetchSchools(); // רענון הרשימה
    } catch (error) {
      console.error('שגיאה במחיקת המוסד:', error);
    }
  };

  const { schools, loading, error } = schoolStore;

  // סיכום מספר תלמידים מכל הכיתות בכל מוסד
  const countStudents = (school) => {
    if (!school.classList) return 0;
    return school.classList.reduce(
      (acc, cls) => acc + (cls.students?.length ?? 0),
      0
    );
  };

  if (loading) return <div>🔄 טוען נתונים...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2>רשימת מוסדות</h2>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}
      >
        <thead>
          <tr>
            <th>שם מוסד</th>
            <th>מספר כיתות</th>
            <th>מספר תלמידים</th>
            <th>מספר שנתונים</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(schools) && schools.length > 0 ? (
    schools.map((school) => (
      <tr key={school.id}>
        <td>{school.nameSchool}</td>
        <td>{school.numClass}</td>
        <td>{school.numStudent}</td>
        <td>{school.classList ? school.classList.length : 0}</td>
        <td>
          <Link to={`/admin/edit-school/${school.id}`} style={{ marginRight: '10px' }}>
            <button>✏️ ערוך</button>
          </Link>
          <button
            onClick={() => handleDelete(school.id, school.nameSchool)}
            style={{ backgroundColor: 'red', color: 'white' }}
          >
            🗑️ מחק
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} style={{ textAlign: 'center' }}>
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
