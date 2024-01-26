import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './RootLayout.tsx';
import { Products } from './Products.tsx';
import { Login } from './Login.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [{ path: '', element: <Products /> }],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);