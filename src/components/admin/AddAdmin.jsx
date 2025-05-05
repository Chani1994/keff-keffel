import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';
import schoolStore from '../../store/schoolStore';

const AddAdmin = observer(() => {
  const [nameAdmin, setNameAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const [phoneAdmin, setPhoneAdmin] = useState('');
  const [adminType, setAdminType] = useState(1);
  const [idSchool, setIdSchool] = useState('');
  const [schools, setSchools] = useState([]); // אתחול לערך ברירת מחדל - מערך ריק
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setNameAdmin('');
    setPassword('');
    setEmail('');
    setFax('');
    setPhoneAdmin('');
    setAdminType(1);
    setIdSchool('');

    // משיכת מוסדות
    const fetchSchools = async () => {
      try {
        await schoolStore.fetchSchools();
        setSchools(schoolStore.schools || []);
      } catch (err) {
        console.error('שגיאה בהבאת מוסדות:', err);
        setSchools([]);
      } finally {
        setLoading(false);  // מסמן שסיימנו עם טעינת המידע
      }
    };
  
    

    fetchSchools();
    adminStore.fetchAdmins();
  }, []);
  if (loading) {
    return <div>טעינה...</div>;  // הצג הודעת טעינה
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idSchool) {
      alert('יש לבחור מוסד לפני ההוספה');
      return;
    }

    const newAdmin = {
      nameAdmin,
      password,
      email,
      fax,
      phoneAdmin,
      idSchool,
      adminType
    };

    await adminStore.addAdmin(newAdmin, navigate);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>הוספת מנהל חדש</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {/* שדות קלט אחרים */}
       
        <input
          type="text"
          placeholder="שם מנהל"
          value={nameAdmin}
          onChange={(e) => setNameAdmin(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          required
        />
        <input
          type="text"
          placeholder="פקס"
          value={fax}
          onChange={(e) => setFax(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="tel"
          placeholder="טלפון"
          value={phoneAdmin}
          onChange={(e) => setPhoneAdmin(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
<label htmlFor="schoolSelect">בחר מוסד:</label>
<select id="schoolSelect">
  <option value="">-- בחר מוסד --</option>
  {schools.map((school) => (
    <option key={school.id} value={school.id}>
      {school.nameSchool}
    </option>
  ))}
</select>


        <div style={{ marginTop: '15px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ➕ הוסף מנהל
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#f44336',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ❌ ביטול
          </button>
        </div>
      </form>
    </div>
  );
});

export default AddAdmin;
