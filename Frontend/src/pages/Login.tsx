import { Alert, Button, Form, Input } from 'antd';
import { useMutation } from 'react-query';
import { useAuth } from '../context/AuthContext.tsx';
import { ApiClient } from '../api/apiClient.ts';
import { Admin } from '../types/Admin.ts';
import { GlobalLoading } from '../components/GlobalLoading.tsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username: string;
  password: string;
};

type LoginRequest = {
  email: string,
  password: string,
}

const minLoadingTimeInMs = 500;

export const Login = () => {
  const { login, setUser } = useAuth();
  const [showGlobalLoading, setShowGlobalLoading] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginRequest) => await login(payload.email, payload.password),
    onSuccess: async () => {
      setShowGlobalLoading(true);
      const startTime = performance.now();

      const userData = await ApiClient.get<never, Admin>('api/accounts/me');
      if (userData) {
        setUser(userData);
      }

      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      if (elapsedTime < minLoadingTimeInMs) {
        // Simulate a delay to show the loading spinner for at least 2000ms
        setTimeout(() => {
          // Hide the loading spinner or message after the delay
          setShowGlobalLoading(false);
          setTimeout(() => {
            navigate('/');
          }, 500);
        }, minLoadingTimeInMs - elapsedTime);
      } else {
        // API response took longer than 2000ms, directly hide the loading spinner
        setShowGlobalLoading(false);
        setTimeout(() => {
          navigate('/');
        }, 500);
      }
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
      <GlobalLoading spinning={showGlobalLoading} fullScreen />
      <Form
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <br />
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loginMutation.isLoading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      {loginMutation.isError && (
        <Alert message="The user name or password is incorrect." type="error" />
      )}
    </div>
  );
};
