import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

export const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you do not have enough priviledges to access this page."
      extra={<Button type="primary" onClick={() => navigate('/login')}>Login</Button>}
    />
  );
};