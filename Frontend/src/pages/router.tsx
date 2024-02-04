import { createBrowserRouter, Link } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import { NotFound } from './NotFound.tsx';
import { Space } from 'antd';
import { DashboardOutlined, DropboxOutlined, ShopOutlined, SolutionOutlined, TagOutlined } from '@ant-design/icons';
import { ProductDetail } from './ProductDetail.tsx';
import { lazy } from 'react';

const Categories = lazy(() => import('./Categories.tsx'));
const Vendors = lazy(() => import('./Vendors.tsx'));
const Admins = lazy(() => import('./Admins.tsx'));
const Products = lazy(() => import('./Products.tsx'));

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
          crumb: () => <Link to="/categories"><Space><TagOutlined />Categories</Space></Link>,
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
]);