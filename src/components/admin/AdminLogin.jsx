import React from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import adminStore from '../../store/adminStore';

const AdminLogin = observer(() => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminStore.name.trim() || !adminStore.password.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'נא למלא את כל השדות.',
        confirmButtonText: 'אישור',
      });
      return;
    }

    await adminStore.login(navigate);
  };

  
  return (
    <div style={{
      direction: 'rtl',
      padding: '20px',
      maxWidth: '400px',
      margin: 'auto',
      fontFamily: 'Arial',
    }}>
      <h2 style={{ textAlign: 'center' }}>התחברות למנהל</h2>

      <form onSubmit={handleSubmit}>
        <label>שם משתמש:</label><br />
        <input
          type="text"
          value={adminStore.name}
          onChange={(e) => adminStore.setName(e.target.value)}
          placeholder="שם"
          style={{
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            marginBottom: '15px',
            boxSizing: 'border-box'
          }}
        />

        <label>סיסמה:</label><br />
        <input
          type="password"
          value={adminStore.password}
          onChange={(e) => adminStore.setPassword(e.target.value)}
          placeholder="סיסמה"
          style={{
            width: '100%',
            padding: '8px',
            marginTop: '5px',
            marginBottom: '20px',
            boxSizing: 'border-box'
          }}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          כניסה
        </button>

        
         <div style={{ textAlign: 'center', marginTop: '10px' }}>
         <button style={{ cursor: 'pointer', color: '#007bff' }}  onClick={() => adminStore.forgotPassword(adminStore.name)}>
שכחת סיסמה? לחץ כאן      </button>
    </div>
      </form>

      {adminStore.error && (
        <div style={{ color: 'red', marginTop: '10px' }}>{adminStore.error}</div>
      )}
    </div>
  );
});

export default AdminLogin;
