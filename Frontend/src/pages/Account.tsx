import {Button, Card, Descriptions, Skeleton, Space, Tag, Tooltip, Typography} from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import {useMutation, useQuery} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {AppUser} from '../types/AppUser.ts';
import {CheckOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import {useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';

const {Title, Text} = Typography;

const Account = () => {
  const [params, setParams] = useSearchParams();

  const {isLoading, data} = useQuery({
    queryKey: ['me'],
    queryFn: async () => await ApiClient.get<never, AppUser>('api/accounts/me'),
  });

  const sendConfirmationMailMutation = useMutation({
    mutationFn: async (email: string) => await ApiClient.post('/api/accounts/resendConfirmationEmail', {email}),
    onSuccess: () => {
      params.set('done', '1');
      setParams(params);
    },
  });

  useEffect(() => {
    if (params.get('sendEmailOnLoad') === '1') {
      if (data && !data.emailConfirmed && params.get('done') !== '1') {
        sendConfirmationMailMutation.mutate(data.email);
      }
    }
  }, [data]);

  return (
    <section>
      <Title level={3}>Account</Title>
      <br/>
      <Card>
        {isLoading ? (
          <Skeleton/>
        ) : (
          data && (
            <Descriptions layout="horizontal" column={1} labelStyle={{minWidth: '140px'}}>
              <DescriptionsItem label="Username">{data.userName}</DescriptionsItem>
              <DescriptionsItem label="Email">
                <Space direction="vertical">
                  <Text>
                    {data.email}
                  </Text>
                  {data.emailConfirmed ? (
                    <Text type="secondary">
                      <Space>
                        <CheckOutlined/>
                        Confirmed
                      </Space>
                    </Text>
                  ) : (
                    sendConfirmationMailMutation.isSuccess ? (
                      <Text type="secondary">Email confirmation mail is sent. Please check your inbox.</Text>
                    ) : (
                      <Button
                        size="small"
                        onClick={async () => {
                          await sendConfirmationMailMutation.mutateAsync(data?.email);
                        }}
                        loading={sendConfirmationMailMutation.isLoading}
                      >
                        Send email confirmation mail
                      </Button>
                    )
                  )}
                </Space>
              </DescriptionsItem>
              <DescriptionsItem label="Privileges">
                {data.roles.map(role => {
                  return (
                    <Tag>
                      <Space>
                        {role}
                        <Tooltip
                          title={role === "SuperAdmin" ? "SuperAdmins have full access and control over all features and functionalities within the app." : "Admins have full access and control over all features and functionalities within the app but are\n" +
                            "      restricted from managing other admin accounts (admins CRUD)."}
                          trigger={['click']}>
                          <QuestionCircleOutlined/>
                        </Tooltip>
                      </Space>
                    </Tag>
                  )
                })}
              </DescriptionsItem>
            </Descriptions>
          )
        )}
      </Card>
    </section>
  );
};

export default Account;