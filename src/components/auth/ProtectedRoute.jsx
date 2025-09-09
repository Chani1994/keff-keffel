import { Navigate, Outlet } from 'react-router-dom'; // רכיבים לניווט והצגת קומפוננטות מקוננות
import { observer } from 'mobx-react-lite'; // מאפשרת למעקב אחרי store ב-React
import userStore from '../../store/userStore'; // store לניהול משתמש רגיל
import adminStore from '../../store/adminStore'; // store לניהול מנהל

// קומפוננטה לשמירה על גישה מוגנת לנתיבים
const ProtectedRoute = observer(({ roles = [] }) => {
  // אם אחד מה-stores עדיין בטעינה, מציג הודעת "טוען..."
  if (userStore.isLoading || adminStore.isLoading) {
    return <div>טוען...</div>;
  }

  // בדיקה אם המשתמש או המנהל מחוברים
  const isUserLoggedIn = userStore.isLoggedIn;
  const isAdminLoggedIn = adminStore.isLoggedIn;

  // אם אין אף אחד מחובר, נווט חזרה לעמוד הבית
  if (!isUserLoggedIn && !isAdminLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // אם יש דרישות תפקיד (roles)
  if (roles.length > 0) {
    // מזהה את סוג המשתמש המחובר
    const role = isAdminLoggedIn ? 'admin' : 'user';
    // אם התפקיד של המשתמש אינו ברשימת התפקידים המורשים, נווט חזרה לעמוד הבית
    if (!roles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  // אם כל הבדיקות עברו, הצג את הנתיב המבוקש
  return <Outlet />;
});

export default ProtectedRoute;
