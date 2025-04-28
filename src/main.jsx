import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './index.css'
// import App from './App.jsx'
import HomePage from './components/HomePage.jsx'
import AdminHome from './components/admin/AdminHome.jsx'
import UserHome from './components/user/UserHome.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import AddAdmin from './components/admin/AddAdmin.jsx'
import DeleteAdmin from './components/admin/DeleteAdmin.jsx'
// import ErrorPage from './components/error/ErrorPage.jsx'
import AddSchool from './components/school/AddSchool.jsx'
import EditSchool from './components/school/EditSchool.jsx'
import DeleteSchool from './components/school/DeleteSchool.jsx'
import UserRegister from './components/user/UserRegister.jsx'
import EditAdmin from './components/admin/EditAdmin..jsx'
const routesArray = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    // errorElement: <ErrorPage />
  },
  {
    path: '/admin/login',
    element: <AdminHome />,
    },
      {
        path: '/admin',
        element: <AdminPage />
      },
      {
        path: '/admin/school-add',
        element: <AddSchool />
      },
      {
        path: '/admin/school-edit',
        element: <EditSchool />
      },
      {
        path: '/admin/school-delete',
        element: <DeleteSchool />
      },

      {
        path: '/add-admin',
        element: <AddAdmin />
      },
      {
        path: '/edit-admin',
        element: <EditAdmin />
      },
      {
        path: '/delete-admin',
        element: <DeleteAdmin/>
      },

  {
    path: '/user',
    element: <UserHome />
  },
  {
    path: '/user/register',
    element: <UserRegister />
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={routesArray} />

  </StrictMode>,
)
