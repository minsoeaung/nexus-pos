import {headerHeight} from './AppHeader.tsx';
import {Menu} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {
  AppstoreOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DropboxOutlined,
  HistoryOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import {memo} from 'react';
import {useQuery} from "react-query";
import {ApiClient} from "../api/apiClient.ts";
import {AppUser} from "../types/AppUser.ts";

export const siderWidth = 256;

export const AppSider = memo(() => {

  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '');

  const {data: me} = useQuery({
    queryKey: ['me'],
    queryFn: async () => await ApiClient.get<never, AppUser>('api/accounts/me'),
  });

  return (
    <Sider
      width={siderWidth}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        marginTop: headerHeight,
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={[['', '/'].includes(pathname) ? '/' : pathname]}
        defaultOpenKeys={['/inventory']}
        style={{
          paddingTop: 16,
          borderRight: '1px solid rgba(10, 10, 10, 0.1)',
          height: '100%',
        }}
        items={[
          {
            label: <Link to="/">Dashboard</Link>, key: '/', icon: <DashboardOutlined/>,
          },
          {
            label: <Link to="/sales">Sales</Link>, key: '/sales', icon: <ShoppingCartOutlined/>,
          },
          {
            label: <Link to="/sales-history">Sales History</Link>, key: '/sales-history', icon: <HistoryOutlined/>,
          },
          {
            type: 'divider',
          },
          {
            label: 'Inventory',
            key: '/inventory',
            icon: <DatabaseOutlined/>,
            children: [
              {
                label: <Link to="/products">Products</Link>,
                key: '/products',
                icon: <DropboxOutlined/>,
              },
              {
                label: <Link to="/categories">Categories</Link>,
                key: '/categories',
                icon: <AppstoreOutlined/>,
              },
              {
                label: <Link to="/vendors">Vendors</Link>,
                key: '/vendors',
                icon: <ShopOutlined/>,
              }],
          },
          {
            type: 'divider',
          },
          {
            label: <Link to="/admins">Admins</Link>,
            key: '/admins',
            icon: <SolutionOutlined/>,
            style: {display: me ? (me.roles.includes('SuperAdmin') ? '' : 'none') : 'none'}
          },
          {label: <Link to="/customers">Customers</Link>, key: '/customers', icon: <UserOutlined/>},
        ]}
      />
    </Sider>
  );
});