import { Result } from 'antd';

export const UnAuthorized = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="You are not allowed to access this page."
    />
  );
};