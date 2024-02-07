import { Alert, Button, Form, Input } from 'antd';
import { useMutation } from 'react-query';
import { useAuth } from '../context/AuthContext.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { ApiError } from '../types/ApiError.ts';

type FieldType = {
  username: string;
  password: string;
};

type LoginRequest = {
  email: string,
  password: string,
}

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginRequest) => await login(payload.email, payload.password),
    onSuccess: async () => {
      navigate('/');
    },
  });

  const onFinish = async (values: FieldType) => {
    const payload: LoginRequest = {
      // IdentityEndpoints /login has "email" field, but it is actually a username.
      email: values.username,
      password: values.password,
    };
    await loginMutation.mutateAsync(payload);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        margin: '-160px 0 0 -160px',
        width: '300px',
        padding: '36px',
        boxShadow: '0 0 100px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          style={{ marginBottom: 0 }}
        >
          <Input type="password" prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
        </Form.Item>
        <Form.Item style={{ marginBottom: 12 }}>
          <Link to="/forgot-password" style={{ float: 'right' }}>Forgot password?</Link>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loginMutation.isLoading}>
            Login
          </Button>
        </Form.Item>
      </Form>


      {/* detail: NotAllowed -> EmailConfirmed false */}
      {/* detail: Failed -> Invalid credentials */}

      {loginMutation.isError && (
        <Alert
          message={(loginMutation.error as ApiError).status === 403 ? 'Your account has been suspended.' : 'The user name or password is incorrect.'}
          type="error" />
      )}
    </div>
  );
};
