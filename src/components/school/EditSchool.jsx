import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import schoolStore from '../../store/schoolStore';

const EditSchool = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [schoolData, setSchoolData] = useState({
    id: 0,
    nameSchool: '',
    numClass: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (schoolStore.schools.length === 0) {
        await schoolStore.fetchSchools();
      }
      const school = schoolStore.schools.find(s => s.id === parseInt(id));
      if (school) {
        setSchoolData(school);
      } else {
        console.error('מוסד לא נמצא');
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSchoolData(prevData => ({
      ...prevData,
      [name]: name === 'numClass' ? parseInt(value, 10) : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await schoolStore.updateSchool(parseInt(id), schoolData);
      navigate('/admin/schools');
    } catch (error) {
      console.error('שגיאה בעדכון מוסד:', error);
      alert('אירעה שגיאה בעדכון. נסה שוב.');
    }
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>עריכת מוסד</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label htmlFor="nameSchool">שם מוסד:</label>
          <input
            id="nameSchool"
            type="text"
            name="nameSchool"
            value={schoolData.nameSchool}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>

        <div>
  <label htmlFor="numClass">מספר כיתות:</label>
  <input
    id="numClass"
    type="number"
    name="numClass"
    value={schoolData.numClass}
    onChange={handleChange}
    required
    min="0" 
    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
  />
</div>


        <button type="submit" style={{ padding: '10px 20px' }}>💾 שמור שינויים</button>
      </form>
    </div>
  );
});

export default EditSchool;
