import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import userStore from '../../store/userStore';
import adminStore from '../../store/adminStore';

const ProtectedRoute = observer(({ roles = [] }) => {
  if (userStore.isLoading || adminStore.isLoading) {
    return <div>טוען...</div>;
  }

  const isUserLoggedIn = userStore.isLoggedIn;
  const isAdminLoggedIn = adminStore.isLoggedIn;

  if (!isUserLoggedIn && !isAdminLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (roles.length > 0) {
    const role = isAdminLoggedIn ? 'admin' : 'user';
    if (!roles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
});


export default ProtectedRoute;
