import {Link, useNavigate} from 'react-router-dom';
import {Dropdown, MenuProps, Space, Typography} from 'antd';
import {Header} from 'antd/es/layout/layout';
import {useAuth} from '../context/AuthContext.tsx';
import {DownOutlined, KeyOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons';
import {useQueryClient} from 'react-query';
import {memo} from 'react';

export const headerHeight = 56;

export const AppHeader = memo(() => {
  const {user, logout} = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const items: MenuProps['items'] = [
    {
      label: <Link to="/account">Account</Link>,
      icon: <UserOutlined/>,
      key: 'account',
    },
    {
      label: <Link to="/reset-password">Reset password</Link>,
      icon: <KeyOutlined/>,
      key: 'reset-password',
    },
    {
      type: 'divider',
    },
    {
      label: 'Logout',
      icon: <LogoutOutlined/>,
      danger: true,
      key: 'logout',
      onClick: () => {
        queryClient.clear();
        logout();
        navigate('/login');
      },
    },
  ];

  return (
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
        // backgroundColor: 'rgba(0, 0, 0, 0)',
        // background: 'transparent',
        // backdropFilter: 'blur(7px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Link to="/" style={{fontSize: '1.5rem', color: "white"}}>
        App name
      </Link>
      {user && (
        <Dropdown menu={{items}} trigger={['click']} arrow>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <Typography style={{color: 'white'}}>Hello {user.userName}</Typography>
              <Typography><DownOutlined style={{color: 'white'}}/></Typography>
            </Space>
          </a>
        </Dropdown>
      )}
    </Header>
  );
});