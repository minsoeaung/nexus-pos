import { Layout } from 'antd';
import { Outlet, useLocation } from 'react-router-dom';
import { AutoBreadcrumbs } from '../components/AutoBreadcrumbs.tsx';
import { AppHeader } from '../components/AppHeader.tsx';
import { AppSider, siderWidth } from '../components/AppSider.tsx';
import { Content } from 'antd/es/layout/layout';
import { useAuth } from '../context/AuthContext.tsx';
import { UnAuthorized } from './UnAuthorized.tsx';

export const RootLayout = () => {
  const location = useLocation();
  const { user } = useAuth();

  const pathname = location.pathname.replace(/\/+$/, '');

  if (pathname === '/login') {
    return (
      <Outlet />
    );
  }

  return (
    <Layout>
      <AppHeader />
      <Layout>
        <AppSider />
        <Layout style={{ marginLeft: siderWidth, padding: 20, backgroundColor: '#f4f4f4' }}>
          <Content
            style={{
              minHeight: '100vh',
            }}
          >
            <AutoBreadcrumbs />
            {user ? (
              <Outlet />
            ) : (
              <UnAuthorized />
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
