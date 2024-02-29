import { createBrowserRouter, Link } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import { NotFound } from './NotFound.tsx';
import { Space } from 'antd';
import {
  AppstoreOutlined,
  DashboardOutlined,
  DropboxOutlined,
  HistoryOutlined,
  KeyOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { ProductDetail } from './ProductDetail.tsx';
import { lazy } from 'react';
import ForgotPassword from './ForgotPassword.tsx';

const Categories = lazy(() => import('./Categories.tsx'));
const Vendors = lazy(() => import('./Vendors.tsx'));
const Admins = lazy(() => import('./Admins.tsx'));
const Products = lazy(() => import('./Products.tsx'));
const ResetPassword = lazy(() => import('./ResetPassword.tsx'));
const Account = lazy(() => import('./Account.tsx'));
const Sales = lazy(() => import('./Sales.tsx'));
const SalesHistory = lazy(() => import('./SalesHistory.tsx'));
const Customers = lazy(() => import('./Customers.tsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    handle: {
      crumb: () => <Link to="/"><Space><DashboardOutlined />Dashboard</Space></Link>,
    },
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'sales',
        element: <Sales />,
        handle: {
          crumb: () => <Link to="/sales"><Space><ShoppingCartOutlined />Sales</Space></Link>,
        },
      },
      {
        path: 'sales-history',
        element: <SalesHistory />,
        handle: {
          crumb: () => <Link to="/sales-history"><Space><HistoryOutlined />Sales History</Space></Link>,
        },
      },
      {
        path: 'products',
        element: <Products />,
        handle: {
          crumb: () => <Link to="/products"><Space><DropboxOutlined />Products</Space></Link>,
        },
      },
      {
        path: 'categories',
        element: <Categories />,
        handle: {
          crumb: () => <Link to="/categories"><Space><AppstoreOutlined />Categories</Space></Link>,
        },
      },
      {
        path: 'vendors',
        element: <Vendors />,
        handle: {
          crumb: () => <Link to="/vendors"><Space><ShopOutlined />Vendors</Space></Link>,
        },
      },
      {
        path: 'admins',
        element: <Admins />,
        handle: {
          crumb: () => <Link to="/admins"><Space><SolutionOutlined />Admins</Space></Link>,
        },
      },
      {
        path: 'customers',
        element: <Customers />,
        handle: {
          crumb: () => <Link to="/customers"><Space><UserOutlined />Customers</Space></Link>,
        },
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
        handle: {
          crumb: () => <Link to="/reset-password"><Space><KeyOutlined />Reset password</Space></Link>,
        },
      },
      {
        path: 'account',
        element: <Account />,
        handle: {
          crumb: () => <Link to="/account"><Space><UserOutlined />Account</Space></Link>,
        },
      },
      {
        path: 'products/:id',
        element: <ProductDetail />,
        handle: {
          crumb: () => <Space>Product Detail</Space>,
        },
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: 'forgot-password',
    element: <ForgotPassword />,
  },
]);