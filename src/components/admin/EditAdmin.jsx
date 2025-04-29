

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
    salt: '',
    phoneAdmin: '',
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
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nameAdmin"
          value={adminData.nameAdmin}
          onChange={handleChange}
          placeholder="שם מנהל"
          required
        />
        <input
          type="password"
          name="password"
          value={adminData.password}
          onChange={handleChange}
          placeholder="סיסמה"
          required
        />
        <input
          type="text"
          name="salt"
          value={adminData.salt}
          onChange={handleChange}
          placeholder="Salt"
          required
        />
        <input
          type="text"
          name="phoneAdmin"
          value={adminData.phoneAdmin}
          onChange={handleChange}
          placeholder="טלפון"
          required
        />
        <select
          name="adminType"
          value={adminData.adminType}
          onChange={handleChange}
          required
        >
          <option value={1}>מנהל ראשי</option>
          <option value={2}>מנהל מוסד</option>
          <option value={3}>מנהל כיתה</option>
        </select>
        <br />
        <button type="submit" style={{ marginTop: '10px', padding: '8px 16px' }}>💾 שמור שינויים</button>
      </form>
    </div>
  );
});

export default EditAdmin;
