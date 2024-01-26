import { Layout, Menu, theme, Typography } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { AppstoreOutlined, DropboxOutlined, ShopOutlined, SolutionOutlined, TeamOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const headerHeight = 47;
const siderWidth = 256;

export const RootLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: headerHeight,
          backgroundColor: '#161616',
        }}
      >
        <Typography style={{ color: 'white' }}>Logo</Typography>
        <Link to="/login">Login</Link>
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
            marginTop: headerHeight + 10,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            style={{ borderRight: 0, height: '100%' }}
            items={[
              { label: 'Products', key: '1', icon: <DropboxOutlined /> },
              { label: 'Categories', key: '2', icon: <AppstoreOutlined /> },
              { label: 'Brands', key: '3', icon: <ShopOutlined /> },
              {
                type: 'divider',
              },
              { label: 'Admins', key: '4', icon: <SolutionOutlined /> },
              { label: 'Customers', key: '5', icon: <TeamOutlined /> },
            ]}
          />
        </Sider>
        <Layout style={{ marginLeft: siderWidth, padding: 20, backgroundColor: '#CDDAE7' }}>
          <Content
            style={{
              padding: 20,
              minHeight: '100vh',
              background: '#F4F4F4',
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
