import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddAdmin = () => {
  const [nameAdmin, setNameAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [phoneAdmin, setPhoneAdmin] = useState('');
  const [adminType, setAdminType] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAdmin = {
      id: 0, // לא מוצג למשתמש — נשלח אוטומטית
      nameAdmin,
      password,
      salt,
      phoneAdmin,
      adminType
    };

    try {
      await axios.post('https://localhost:7245/api/Admin', newAdmin, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('המנהל נוסף בהצלחה!');
      navigate('/admin');
    } catch (error) {
      console.error('שגיאה בהוספת מנהל:', error);
      if (error.response) {
        alert(`אירעה שגיאה: ${error.response.data}`);
      } else {
        alert('אירעה שגיאה בהוספת מנהל.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>הוספת מנהל חדש</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="new-admin-name"

            placeholder="שם מנהל"
            value={nameAdmin}
            onChange={(e) => setNameAdmin(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
            autoComplete="off"

          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="password"
            name="new-admin-password"

            placeholder="סיסמה"
            value={password}
            autoComplete="new-password"

            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}

          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="טלפון מנהל"
            value={phoneAdmin}
            onChange={(e) => setPhoneAdmin(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <select
            value={adminType}
            onChange={(e) => setAdminType(Number(e.target.value))}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value={1}>מנהל ראשי</option>
            <option value={2}>מנהל מוסד</option>
            <option value={3}> מנהל כיתה</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>
          ➕ הוסף מנהל
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;




