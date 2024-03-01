import Title from 'antd/es/typography/Title';
import {Button, Card, Collapse, CollapseProps, message, Modal, Space, Table, TableProps, Tag, Typography} from 'antd';
import {useMutation, useQuery} from 'react-query';
import {ApiClient} from '../api/apiClient.ts';
import {AppUser} from '../types/AppUser.ts';
import {useCallback, useMemo, useState} from 'react';
import {CheckOutlined, LockOutlined, PlusOutlined, RedoOutlined, StopOutlined} from '@ant-design/icons';
import {UnAuthorized} from './UnAuthorized.tsx';
import {ApiError} from '../types/ApiError.ts';
import {AdminModal} from '../components/AdminModal.tsx';
import {AdminDto} from '../types/AdminDto.ts';

const {Text} = Typography;

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: <Tag>SuperAdmin</Tag>,
    children:
      <span>SuperAdmins have full access and control over all features and functionalities within the app.</span>,
  },
  {
    key: '2',
    label: <Tag>Admin</Tag>,
    children: <span>Admins have full access and control over all features and functionalities within the app but are
      restricted from managing other admin accounts (admins CRUD).</span>,
  },
];

const Admins = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const {data, isLoading, isFetching, isError, refetch} = useQuery({
    queryKey: ['admins'],
    queryFn: async () => await ApiClient.get<never, AppUser[]>(`api/Accounts/admins`),
  });

  const {data: me} = useQuery({
    queryKey: ['me'],
    queryFn: async () => await ApiClient.get<never, AppUser>('api/accounts/me'),
  });

  const toggleSuspendMutation = useMutation({
    mutationFn: async (id: number) => await ApiClient.post<never, never>(`api/accounts/admins/toggle-suspend?id=${id}`),
    onSuccess: () => {
      void refetch();
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: async (payload: AdminDto) => await ApiClient.post('api/Accounts/admins', payload),
    onSuccess: () => {
      message.success('Created Successfully!');
      setModalOpen(false);
      refetch();
    },
  });

  const suspendAdmin = (id: number) => {
    Modal.confirm({
      title: 'Are you sure?',
      icon: <LockOutlined/>,
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        await toggleSuspendMutation.mutateAsync(id);
      },
      okButtonProps: {
        loading: toggleSuspendMutation.isLoading,
      },
    });
  };

  const columns = useMemo(() => {
    const columns: TableProps<AppUser>['columns'] = [
      {
        title: 'Id',
        dataIndex: 'Id',
        key: 'Id',
        width: '5%',
        render: (_, record) => <p>{record.id}</p>,
      },
      {
        title: 'UserName',
        dataIndex: 'UserName',
        key: 'UserName',
        width: '13%',
        render: (_, record) => <p>{record.userName}</p>,
      },
      {
        title: 'Email',
        dataIndex: 'Email',
        key: 'Email',
        width: '18%',
        render: (_, record) => <p>{record.email}</p>,
      },
      {
        title: 'Status',
        dataIndex: 'Suspend',
        key: 'Suspend',
        width: '15%',
        filters: [
          {text: 'Suspended', value: true},
          {text: 'Active', value: false},
        ],
        filterMultiple: false,
        // @ts-ignore
        onFilter: (value: boolean, record) => record.suspend === value,
        render: (_, record) => record.suspend ? <Text type="danger">Suspended</Text> :
          <Text type="success">Active</Text>,
      },
      {
        title: 'Privileges',
        dataIndex: 'Roles',
        key: 'Roles',
        width: '20%',
        render: (_, record) => record.roles.map(r => <Tag key={r}>{r.toUpperCase()}</Tag>),
      },
      {
        title: 'Options',
        key: 'options',
        fixed: 'right',
        render: (_, record) => (
          me && me.id !== record.id && (
            record.suspend ? (
              <Button onClick={() => suspendAdmin(record.id)} type="link" icon={<CheckOutlined/>}
                      size="small">Reactivate</Button>
            ) : (
              <Button onClick={() => suspendAdmin(record.id)} type="link" icon={<StopOutlined/>}
                      size="small">Suspend</Button>
            )
          )
        ),
      },
    ];


    return columns;
  }, []);


  const handleModalSubmit = useCallback(async (data: AdminDto) => {
    if (!data) return;
    await createAdminMutation.mutateAsync(data);
  }, []);

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  if (isError) {
    return (
      <UnAuthorized/>
    );
  }

  return (
    <section>
      <Title level={3}>Admins</Title>
      <br/>
      <Card title="Types of privileges">
        <Collapse items={items} ghost/>
      </Card>
      <br/>
      <Card
        headStyle={{
          borderBottom: 'none',
        }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined/>}
              onClick={() => {
                setModalOpen(true);
              }}
            >
              Add admin
            </Button>
            <Button
              icon={<RedoOutlined/>}
              onClick={() => refetch()}
            />
          </Space>
        }
      >
        <Table
          bordered
          size="small"
          loading={isLoading || isFetching}
          columns={columns}
          rowKey={record => record.id}
          dataSource={data ? data : []}
          pagination={{
            size: 'default',
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
        />
      </Card>
      <AdminModal
        open={modalOpen}
        onSubmit={handleModalSubmit}
        onCancel={handleModalCancel}
        loading={createAdminMutation.isLoading}
        error={createAdminMutation.error as ApiError}
      />
    </section>
  );
};

export default Admins;