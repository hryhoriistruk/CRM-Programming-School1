import {createBrowserRouter, Navigate} from "react-router-dom";
import LoginPage from "../pages/LoginPage/LoginPage";
import ErrorLayout from "../layouts/ErrorLayout";
import OrdersPage from "../pages/OrdersPage/OrdersPage";
import MainLayout from "../layouts/MainLayout";
import AdminPage from "../pages/AdminPage/AdminPage";

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorLayout/>,
    children: [
      {path: 'login', element: <LoginPage/>},
      {index: true, element: <Navigate to={'login'}/>},
    ]
  },
  {
    path: '/orders',
    errorElement: <ErrorLayout/>,
    element: <MainLayout/>,
    children: [
      {index: true, element: <OrdersPage/>}
    ]
  },
  {
    path: '/admin',
    errorElement: <ErrorLayout/>,
    element: <MainLayout/>,
    children: [
      {index: true, element: <AdminPage/>}
    ]
  }
  ])