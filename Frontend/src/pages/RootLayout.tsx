import { Avatar, Layout, Menu, Space, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import {
  DatabaseOutlined,
  DropboxOutlined,
  ShopOutlined,
  SolutionOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { AutoBreadcrumbs } from '../components/AutoBreadcrumbs.tsx';

const { Header, Content, Sider } = Layout;

const headerHeight = 56;
const siderWidth = 256;

export const RootLayout = () => {
  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: headerHeight,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          // backgroundColor: '#161616',
          background: 'transparent',
          backdropFilter: 'blur(7px)',
          borderBottom: '1px solid rgba(10, 10, 10, 0.1)',
        }}
      >
        <b style={{ fontSize: '1.5rem' }}>App name</b>
        <Space>
          <Avatar
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
          <Typography>Username</Typography>
        </Space>
      </Header>
      <Layout>
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
            defaultSelectedKeys={['dashboard']}
            defaultOpenKeys={['inventory']}
            style={{
              paddingTop: 16,
              borderRight: '1px solid rgba(10, 10, 10, 0.1)',
              height: '100%',
            }}
            items={[
              {
                label: <Link to="/">Dashboard</Link>, key: 'dashboard', icon: <SolutionOutlined />,
              },
              {
                label: 'Inventory',
                key: 'inventory',
                icon: <DatabaseOutlined />,
                children: [
                  {
                    label: <Link to="/products">Products</Link>,
                    key: 'products',
                    icon: <DropboxOutlined />,
                  },
                  {
                    label: <Link to="/categories">Categories</Link>,
                    key: 'categories',
                    icon: <TagOutlined />,
                  },
                  {
                    label: <Link to="/vendor">Vendors</Link>,
                    key: 'vendors',
                    icon: <ShopOutlined />,
                  }],
              },
              {
                type: 'divider',
              },
              { label: 'Admins', key: '4', icon: <SolutionOutlined /> },
              {
                type: 'divider',
              },
              { label: 'Customers', key: '5', icon: <TeamOutlined /> },
            ]}
          />
        </Sider>
        <Layout style={{ marginLeft: siderWidth, padding: 20, backgroundColor: '#f4f4f4' }}>
          <Content
            style={{
              minHeight: '100vh',
            }}
          >
            <AutoBreadcrumbs />
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
