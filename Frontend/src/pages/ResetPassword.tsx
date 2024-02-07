import Title from 'antd/es/typography/Title';
import { Alert, Button, Card, Form, Input, message, Skeleton, Space, Typography } from 'antd';
import { useMutation, useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { AppUser } from '../types/AppUser.ts';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { ErrorAlert } from '../components/ErrorAlert.tsx';
import { ApiError } from '../types/ApiError.ts';

const { Text } = Typography;

type FormFields = {
  email: string;
  resetCode: string;
  newPassword: string;
}

const ResetPassword = () => {
  const { isLoading, data, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => await ApiClient.get<never, AppUser>('api/accounts/me'),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => await ApiClient.post<never, never>('api/accounts/forgotPassword', { email }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: FormFields) => await ApiClient.post<never, never>('api/accounts/resetPassword', payload),
  });

  const onFinish = async (values: FormFields) => {
    const payload: FormFields = {
      ...values,
      resetCode: values.resetCode.trim(),
    };
    await resetPasswordMutation.mutateAsync(payload);
  };

  const sendResetPasswordMail = async () => {
    if (data?.email && data?.emailConfirmed)
      await forgotPasswordMutation.mutateAsync(data?.email);
    else
      message.warning('You must confirm your email first.');
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <section>
      <Title level={3}>Reset password</Title>
      <br />
      <Card>
        {isLoading ? (
          <Skeleton />
        ) : (
          data && (
            resetPasswordMutation.isSuccess ? (
              <Alert
                type="success"
                message="Your password has been successfully updated."
              />
            ) : (
              <div style={{ maxWidth: 400 }}>
                {!data.emailConfirmed && (
                  <>
                    <Alert type="error" action={<Link to="/account?sendEmailOnLoad=1">Confirm here</Link>}
                           description="You must confirm your email first." />
                    <br />
                  </>
                )}
                <Form
                  layout="vertical"
                  onFinish={onFinish}
                  initialValues={{
                    email: data.email,
                  }}
                  autoComplete="off"
                >
                  <Form.Item label="Email">
                    <Form.Item
                      name="email"
                      noStyle
                      rules={[{ required: true, message: 'Email is required' }]}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item label="Reset code">
                    <Space direction="vertical">
                      <Form.Item<FormFields>
                        name="resetCode"
                        noStyle
                        rules={[{ required: true, message: 'Reset code is required' }]}
                      >
                        <Input style={{ width: 400 }} placeholder="Reset code" />
                      </Form.Item>
                      {forgotPasswordMutation.isSuccess ? (
                        <Text>Please check your email for a message containing a code to reset your password.</Text>
                      ) : (
                        <Button type="link" onClick={sendResetPasswordMail} loading={forgotPasswordMutation.isLoading}>
                          Get reset code via email
                        </Button>
                      )}
                    </Space>
                  </Form.Item>
                  <Form.Item label="New password">
                    <Form.Item
                      name="newPassword"
                      noStyle
                      rules={[{ required: true, message: 'New password is required' }]}
                    >
                      <Input placeholder="New password" />
                    </Form.Item>
                  </Form.Item>
                  <Form.Item label=" " colon={false}>
                    <Button type="primary" htmlType="submit" loading={resetPasswordMutation.isLoading}>
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            )
          )
        )}
        {resetPasswordMutation.isError && (
          <ErrorAlert error={resetPasswordMutation.error as ApiError} />
        )}
      </Card>
    </section>
  );
};

export default ResetPassword;