import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import adminStore from '../../store/adminStore';

const AllAdmin = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    adminStore.fetchAdmins();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-admin/${id}`);
  };

  const handleDelete = async (id) => {
    await adminStore.deleteAdmin(id, false); // false = בלי alerts
    await adminStore.fetchAdmins();
  };
  

  return (
    <div>
      <h2>רשימת מנהלים</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', direction: 'rtl' }}>
        <thead>
          <tr>
            <th>שם</th>
            <th>טלפון</th>
            <th>סוג</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {adminStore.admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.nameAdmin}</td>
              <td>{admin.phoneAdmin}</td>
              <td>{getTypeName(admin.adminType)}</td>
              <td>
                <button onClick={() => handleEdit(admin.id)}>✏️ עריכה</button>{' '}
                <button onClick={() => handleDelete(admin.id)}>🗑️ מחיקה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

// פונקציית עזר להצגת סוג המנהל בטקסט
function getTypeName(type) {
  switch (type) {
    case 1:
      return 'מנהל ראשי';
    case 2:
      return 'מנהל מוסד';
    case 3:
      return 'מנהל כיתה';
    default:
      return 'לא ידוע';
  }
}

export default AllAdmin;
