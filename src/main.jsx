import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.jsx';
import HomePage from './components/HomePage.jsx';
import AdminLogin from './components/admin/AdminLogin.jsx';
import UserLogin from './components/user/UserLogin.jsx';
import AdminPage from './components/admin/AdminPage.jsx';
import AddAdmin from './components/admin/AddAdmin.jsx';
import AddSchool from './components/school/AddSchool.jsx';
import EditSchool from './components/school/EditSchool.jsx';
import UserRegister from './components/user/UserRegister.jsx';
import AllAdmin from './components/admin/AllAdmin.jsx';
import EditAdmin from './components/admin/EditAdmin.jsx';
import SchoolList from './components/school/SchoolList.jsx';
import UserDetails from './components/user/UserDetails.jsx';
import UserLearningReport from './components/user/UserLearningReport.jsx';
import ErrorPage from './components/error/ErrorPage.jsx';
import UserData from './components/user/UserData.jsx';

import ProtectedRoute from './components/auth/ProtectedRoute';
import { Navigate } from 'react-router-dom';
import AddUser from './components/user/AddUser.jsx';

const routesArray = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'admin/login', element: <AdminLogin /> },
      { path: 'user/login', element: <UserLogin /> },
      { path: 'user/register', element: <UserRegister /> },

      // הגנה לנתיבים של אדמין
      {
        path: 'admin',
        element: <ProtectedRoute roles={['admin']} />,
        children: [
            { index: true, element: <Navigate to="admin-home" replace /> },

    // הנתיב הראשי שלך
    { path: 'admin-home', element: <AdminPage /> },
          { path: 'add-school', element: <AddSchool /> },
          { path: 'schools', element: <SchoolList /> },
          { path: 'edit-school/:schoolId', element: <EditSchool /> },
          { path: 'add-admin', element: <AddAdmin /> },
          { path: 'edit-admin/:id', element: <EditAdmin /> },
          { path: 'all-admins', element: <AllAdmin /> },
           { path: 'add-user', element: <AddUser /> },
          { path: 'user-data', element: <UserData /> },
        ],
      },

      // הגנה למשתמשים רגילים
      {
        element: <ProtectedRoute roles={['user']} />,
        children: [
          { path: 'user/details/:id', element: <UserDetails /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routesArray} />
  </StrictMode>
);
