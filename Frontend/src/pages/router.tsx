import { createBrowserRouter, Link } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { Products } from './Products.tsx';
import { Login } from './Login.tsx';
import { Dashboard } from './Dashboard.tsx';
import { NotFound } from './NotFound.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    handle: {
      crumb: () => <Link to="/">Home</Link>,
    },
    children: [
      {
        path: 'products',
        element: <Products />,
        handle: {
          crumb: () => <Link to="/products">Products</Link>,
        },
      },
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);