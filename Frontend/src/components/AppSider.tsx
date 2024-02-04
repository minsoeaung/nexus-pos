import { headerHeight } from './AppHeader.tsx';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  DatabaseOutlined,
  DropboxOutlined,
  ShopOutlined,
  SolutionOutlined,
  TagOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { memo } from 'react';

export const siderWidth = 256;

export const AppSider = memo(() => {

  const location = useLocation();
  const pathname = location.pathname.replace(/\/+$/, '');

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
            label: <Link to="/">Dashboard</Link>, key: '/', icon: <DashboardOutlined />,
          },
          {
            label: 'Inventory',
            key: '/inventory',
            icon: <DatabaseOutlined />,
            children: [
              {
                label: <Link to="/products">Products</Link>,
                key: '/products',
                icon: <DropboxOutlined />,
              },
              {
                label: <Link to="/categories">Categories</Link>,
                key: '/categories',
                icon: <TagOutlined />,
              },
              {
                label: <Link to="/vendors">Vendors</Link>,
                key: '/vendors',
                icon: <ShopOutlined />,
              }],
          },
          {
            type: 'divider',
          },
          { label: <Link to="/admins">Admins</Link>, key: '/admins', icon: <SolutionOutlined /> },
          {
            type: 'divider',
          },
        ]}
      />
    </Sider>
  );
});