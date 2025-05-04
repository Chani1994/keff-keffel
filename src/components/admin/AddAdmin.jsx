import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';

const AddAdmin = observer(() => {
  const [nameAdmin, setNameAdmin] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fax, setFax] = useState('');
  const [phoneAdmin, setPhoneAdmin] = useState('');
  const [adminType, setAdminType] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    setNameAdmin('');
    setPassword('');
    setEmail('');
    setFax('');
    setPhoneAdmin('');
    setAdminType(1);
    adminStore.fetchAdmins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAdmin = {
      nameAdmin,
      password,
      email,
      fax,
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
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <input
          type="text"
          placeholder="פקס"
          value={fax}
          onChange={(e) => setFax(e.target.value)}
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

        <div style={{ marginTop: '15px' }}>
  <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
    ➕ הוסף מנהל
  </button>

  <button
    type="button"
    onClick={() => navigate(-1)}
    style={{ padding: '10px 20px', marginRight: '10px', backgroundColor: '#f44336', color: '#fff', border: 'none', cursor: 'pointer' }}
  >
    ❌ ביטול
  </button>
</div>

      </form>
    </div>
  );
});

export default AddAdmin;
