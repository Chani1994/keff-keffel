import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import './index.css'
// import App from './App.jsx'
import HomePage from './components/HomePage.jsx'
import AdminLogin from './components/admin/AdminLogin.jsx'
import UserHome from './components/user/UserHome.jsx'
import AdminPage from './components/admin/AdminPage.jsx'
import AddAdmin from './components/admin/AddAdmin.jsx'
// import ErrorPage from './components/error/ErrorPage.jsx'
import AddSchool from './components/school/AddSchool.jsx'
import EditSchool from './components/school/EditSchool.jsx'
import UserRegister from './components/user/UserRegister.jsx'
import AllAdmin from './components/admin/AllAdmin.jsx'
import EditAdmin from './components/admin/EditAdmin.jsx'
import SchoolList from './components/school/SchoolList.jsx'
import UserDetails from './components/user/UserDetails.jsx'
import UserLearningReport from './components/user/UserLearningReport.jsx'

const routesArray = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    // errorElement: <ErrorPage />
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
    },
      {
        path: '/admin',
        element: <AdminPage />
      },
      {
        path: '/admin/add-school',
        element: <AddSchool />
      },
     
     
      {
        path:'/admin/schools',
        element: <SchoolList />},
        {
          path: '/admin/edit-school/:id',
          element: <EditSchool />
        },

      {

        path: '/admin/add-admin',
        element: <AddAdmin />
      },
      {
        path: '/admin/edit-admin/:id',
        element: <EditAdmin />
      },
     
      {
        path:'/admins',
        element: <AllAdmin />}
   ,
  {
    path: '/user/login',
    element: <UserHome />
  },
  {
    path: '/user/register',
    element: <UserRegister />
  },
  {
    path: '/user/details',
    element: <UserDetails />,
    children: [
      {
        path: 'learningReport',
        element: <UserLearningReport />
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <RouterProvider router={routesArray} />

  </StrictMode>,
)
