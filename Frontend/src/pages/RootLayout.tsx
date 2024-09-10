import {Alert, Layout} from 'antd';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {AutoBreadcrumbs} from '../components/AutoBreadcrumbs.tsx';
import {AppHeader, headerHeight} from '../components/AppHeader.tsx';
import {AppSider, siderWidth} from '../components/AppSider.tsx';
import {Content} from 'antd/es/layout/layout';
import {useAuth} from '../context/AuthContext.tsx';
import {GlobalLoading} from '../components/GlobalLoading.tsx';
import {ApiClient} from '../api/apiClient.ts';
import {AppUser} from '../types/AppUser.ts';
import {useQuery} from 'react-query';
import { Suspense, useEffect } from 'react';
import {Fallback} from '../components/Fallback.tsx';

const {ErrorBoundary} = Alert;
const {Footer} = Layout;

export const outletPadding = 20;
const footerHeight = 64;

export const RootLayout = () => {
  const location = useLocation();
  const {logout, setUser} = useAuth();

  const pathname = location.pathname.replace(/\/+$/, '');

  const {isLoading: userLoading, isError: userError} = useQuery({
    queryKey: ['me'],
    queryFn: async () => await ApiClient.get<never, AppUser>('api/accounts/me'),
    onSuccess: (resData) => {
      setUser(resData);
    },
    onError: () => {
      logout();
    },
    enabled: pathname !== '/login',
  });

  useEffect(() => {
    console.log("Hello World");
  }, []);
  
  if (pathname === '/login') {
    return (
      <Outlet/>
    );
  }

  if (userError) {
    return <Navigate to="/login" replace/>;
  }

  return (
    <Layout>
      <GlobalLoading spinning={userLoading} fullScreen/>
      <AppHeader/>
      <Layout>
        <AppSider/>
        <Layout style={{
          marginLeft: siderWidth,
          padding: outletPadding,
          paddingBottom: 0,
          marginBottom: 0,
          backgroundColor: '#f4f4f4',
        }}>
          <Content
            style={{
              minHeight: `calc(100vh - ${headerHeight}px - ${outletPadding * 2}px - ${footerHeight - 20}px)`,
            }}
          >
            <AutoBreadcrumbs/>
            <Suspense fallback={<Fallback/>}>
              <ErrorBoundary>
                <Outlet/>
              </ErrorBoundary>
            </Suspense>
          </Content>
          <Footer style={{textAlign: 'center'}}>
            Advanced Database Management System, Project Created by Group 6, 2024
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};
