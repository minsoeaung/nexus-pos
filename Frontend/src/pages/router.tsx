import { createBrowserRouter, Link } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import { NotFound } from './NotFound.tsx';
import { Space } from 'antd';
import { DashboardOutlined, DropboxOutlined } from '@ant-design/icons';
import { ProductDetail } from './ProductDetail.tsx';
import { Products } from './Products.tsx';

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