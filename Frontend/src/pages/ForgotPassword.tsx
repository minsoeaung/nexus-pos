import { Button, Input, Result, Typography } from 'antd';
import { FormEventHandler, useState } from 'react';
import { useMutation } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { ErrorAlert } from '../components/ErrorAlert.tsx';
import { ApiError } from '../types/ApiError.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Text, Title } = Typography;

type ResetPasswordPayload = {
  'email': string,
  'resetCode': string,
  'newPassword': string
}

const ForgotPassword = () => {
  const [params, setParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigate = useNavigate();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => await ApiClient.post<never, never>('api/accounts/forgotPassword', { email }),
    onSuccess: () => {
      params.set('codeSent', '1');
      setParams(params);
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => await ApiClient.post<never, never>('api/accounts/resetPassword', payload),
  });

  const codeSent = params.get('codeSent') === '1';

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (codeSent) {
      await resetPasswordMutation.mutateAsync({
        email,
        newPassword,
        resetCode: code.trim(),
      });
    } else {
      await forgotPasswordMutation.mutateAsync(email);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '100px',
      }}
    >
      {resetPasswordMutation.isSuccess ? (
        <Result
          status="success"
          title="Your password has been successfully updated."
          subTitle="You can now use your new password to log in to your account."
          extra={[
            <Button type="primary" onClick={() => navigate('/login')}>
              Login
            </Button>,
          ]}
        />
      ) : (
        <div
          style={{
            width: '400px',
          }}
        >
          <Title level={3}>Forgot password</Title>
          <br />
          {codeSent ? (
            <Text>Please check your email for a message containing a code to reset your password.</Text>
          ) : (
            <>
              <Text>
                Enter the email address associated with your account and we'll send you a link to reset your
                password.
              </Text>
              <br/>
              <Text type="secondary" style={{ marginTop: '5px' }}>
                Note: if your email is not confirmed, the reset password email will not be sent.
              </Text>
            </>
          )}
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            {codeSent ? (
              <>
                <Input value={code} onChange={e => setCode(e.target.value)}
                       placeholder="Enter the code" required />
                <p />
                <Input value={newPassword} onChange={e => setNewPassword(e.target.value)} minLength={6}
                       placeholder="Enter your new password" />
              </>
            ) : (
              <Input value={email} onChange={e => setEmail(e.target.value)} type="email"
                     placeholder="Enter your email address" />
            )}
            <br />
            <br />
            <Button type="primary" htmlType="submit" block
                    loading={forgotPasswordMutation.isLoading || resetPasswordMutation.isLoading}>
              Submit
            </Button>
          </form>
          <br />
          <br />
          {forgotPasswordMutation.isError && (
            <ErrorAlert error={forgotPasswordMutation.error as ApiError} />
          )}
          {resetPasswordMutation.isError && (
            <ErrorAlert error={resetPasswordMutation.error as ApiError} />
          )}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;