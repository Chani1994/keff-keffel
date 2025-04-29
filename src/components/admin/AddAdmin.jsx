import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';

const AddAdmin = observer(() => {
  const [nameAdmin, setNameAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [phoneAdmin, setPhoneAdmin] = useState('');
  const [adminType, setAdminType] = useState(1);

  const navigate = useNavigate();

  // איפוס כל השדות בעת טעינה
  useEffect(() => {
    setNameAdmin('');
    setPassword('');
    setSalt('');
    setPhoneAdmin('');
    setAdminType(1);
    // מביא מראש את רשימת המנהלים (לצורך בדיקת כפילויות)
    adminStore.fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAdmin = {
      id: 0,
      nameAdmin,
      password,
      salt,
      phoneAdmin,
      adminType
    };

    await adminStore.addAdmin(newAdmin, navigate);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>הוספת מנהל חדש</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="שם מנהל"
          value={nameAdmin}
          onChange={(e) => setNameAdmin(e.target.value)}
          required
          autoComplete="off"
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
          type="text"
          placeholder="Salt"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="text"
          placeholder="טלפון מנהל"
          value={phoneAdmin}
          onChange={(e) => setPhoneAdmin(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <select
          value={adminType}
          onChange={(e) => setAdminType(Number(e.target.value))}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value={1}>מנהל ראשי</option>
          <option value={2}>מנהל מוסד</option>
          <option value={3}>מנהל כיתה</option>
        </select>

        <button type="submit" style={{ padding: '10px 20px' }}>➕ הוסף מנהל</button>
      </form>
    </div>
  );
});

export default AddAdmin;
