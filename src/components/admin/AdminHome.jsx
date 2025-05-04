import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import adminStore from '../../store/adminStore';

const AdminHome = observer(() => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminStore.login(navigate);
  };

  return (
    <div style={{ direction: 'rtl', padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>התחברות למנהל</h2>
      <form onSubmit={handleSubmit}>
        <label>שם משתמש:</label><br />
        <input
          type="text"
          value={adminStore.name}
          onChange={(e) => adminStore.setName(e.target.value)}
          placeholder="שם"
        /><br /><br />

        <label>סיסמה:</label><br />
        <input
          type="password"
          value={adminStore.password}
          onChange={(e) => adminStore.setPassword(e.target.value)}
          placeholder="סיסמה"
        /><br /><br />

        <button type="submit">כניסה</button>
      </form>

      {adminStore.error && (
        <div style={{ color: 'red', marginTop: '10px' }}>{adminStore.error}</div>
      )}
    </div>
  );
});

export default AdminHome;

