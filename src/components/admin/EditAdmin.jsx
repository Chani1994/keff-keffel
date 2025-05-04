import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';

const EditAdmin = observer(() => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [adminData, setAdminData] = useState({
    id: 0,
    nameAdmin: '',
    password: '',
    phoneAdmin: '',
    email: '',
    fax: '',
    adminType: 1
  });

  useEffect(() => {
    adminStore.fetchAdmins().then(() => {
      const current = adminStore.getAdminById(id);
      if (current) {
        setAdminData({ ...current });
      }
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({
      ...prev,
      [name]: name === 'adminType' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminStore.updateAdmin(adminData);
    navigate('/admin');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>עריכת מנהל</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <input
          type="text"
          name="nameAdmin"
          value={adminData.nameAdmin}
          onChange={handleChange}
          placeholder="שם מנהל"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <input
          type="password"
          name="password"
          value={adminData.password}
          onChange={handleChange}
          placeholder="סיסמה"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <input
          type="text"
          name="phoneAdmin"
          value={adminData.phoneAdmin}
          onChange={handleChange}
          placeholder="טלפון"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <input
          type="email"
          name="email"
          value={adminData.email}
          onChange={handleChange}
          placeholder="אימייל"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <input
          type="text"
          name="fax"
          value={adminData.fax}
          onChange={handleChange}
          placeholder="פקס"
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        />

        <select
          name="adminType"
          value={adminData.adminType}
          onChange={handleChange}
          required
          style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
        >
          <option value={1}>מנהל ראשי</option>
          <option value={2}>מנהל מוסד</option>
          <option value={3}>מנהל כיתה</option>
        </select>

        <button type="submit" style={{ padding: '10px 20px' }}>💾 שמור שינויים</button>
      </form>
    </div>
  );
});

export default EditAdmin;
