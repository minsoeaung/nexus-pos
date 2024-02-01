import { Result } from 'antd';

export const NotFound = () => {
  return (
    <section>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
      />
    </section>
  );
};