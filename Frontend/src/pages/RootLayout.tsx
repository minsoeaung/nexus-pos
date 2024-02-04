import {Layout} from 'antd';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {AutoBreadcrumbs} from '../components/AutoBreadcrumbs.tsx';
import {AppHeader, headerHeight} from '../components/AppHeader.tsx';
import {AppSider, siderWidth} from '../components/AppSider.tsx';
import {Content} from 'antd/es/layout/layout';
import {useAuth} from '../context/AuthContext.tsx';
import {GlobalLoading} from "../components/GlobalLoading.tsx";
import {ApiClient} from "../api/apiClient.ts";
import {Admin} from "../types/Admin.ts";
import {useQuery} from "react-query";
import {Suspense} from "react";
import {Fallback} from '../components/Fallback.tsx';

const outletPadding = 20;

export const RootLayout = () => {
  const location = useLocation();
  const {setUser} = useAuth();

  const pathname = location.pathname.replace(/\/+$/, '');

  const {isLoading: userLoading, isError: userError} = useQuery({
    queryKey: ["me"],
    queryFn: async () => await ApiClient.get<never, Admin>('api/accounts/me'),
    onSuccess: (resData) => {
      setUser(resData);
    },
    onError: () => {
      setUser(null);
    },
    enabled: pathname !== "/login"
  })

  if (pathname === '/login') {
    return (
      <Outlet/>
    );
  }

  if (userError) {
    return <Navigate to="/login" replace/>
  }

  return (
    <Layout>
      <GlobalLoading spinning={userLoading} fullScreen/>
      <AppHeader/>
      <Layout>
        <AppSider/>
        <Layout style={{marginLeft: siderWidth, padding: outletPadding, backgroundColor: '#f4f4f4'}}>
          <Content
            style={{
              minHeight: `calc(100vh - ${headerHeight}px - ${outletPadding * 2}px)`,
            }}
          >
            <AutoBreadcrumbs/>
            <Suspense fallback={<Fallback/>}>
              <Outlet/>
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
