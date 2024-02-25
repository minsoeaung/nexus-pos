import Title from 'antd/es/typography/Title';
import { Badge, Button, Card, Descriptions, DescriptionsProps, Table, TableProps, Typography } from 'antd';
import { useQuery } from 'react-query';
import { ApiClient } from '../api/apiClient.ts';
import { Receipt } from '../types/ReceiptDto.ts';
import { RedoOutlined } from '@ant-design/icons';
import { USDollar } from './Products.tsx';

const { Text } = Typography;

const columns: TableProps<Receipt>['columns'] = [
  {
    title: 'Order Id',
    key: 'Id',
    // width: '10%',
    render: (_, record) => <p>{record.id}</p>,
  },
  {
    title: 'Customer Name',
    key: 'Customer',
    // width: '25%',
    render: (_, record) => <p>{record.customer?.name}</p>,
  },
  {
    title: 'Customer Phone Number',
    key: 'Customer',
    // width: '25%',
    render: (_, record) => <p>{record.customer?.phoneNumber}</p>,
  },
  {
    title: 'Total Amount',
    key: 'Customer',
    // width: '20%',
    render: (_, record) => (
      <p style={{ color: 'green' }}>
        {USDollar.format(record.receiptItems.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0))}
      </p>
    ),
  },
  {
    title: 'Time',
    key: 'createdAt',
    // width: '40%',
    render: (_, record) => <p>{new Date(record.createdAt).toLocaleTimeString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    })}</p>,
  },
];

const SalesHistory = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['receipts'],
    queryFn: async () => await ApiClient.get<never, Receipt[]>('api/Receipts'),
  });

  return (
    <section>
      <Title level={3}>Sales History</Title>
      <br />
      <Card
        extra={
          <Button
            icon={<RedoOutlined />}
            onClick={() => refetch()}
          />
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
          expandable={{
            expandedRowRender: record => {
              const items: DescriptionsProps['items'] = [
                {
                  key: 'Products',
                  label: 'Products',
                  children: (
                    <div>
                      {record.receiptItems.map(receiptItem => (
                        <div key={receiptItem.id}>
                          {receiptItem.item ? receiptItem.item.name : <Text type="secondary">Deleted
                            product</Text>} - {`${receiptItem.quantity}x (${USDollar.format(receiptItem.price)} each)`}
                          <br />
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'Order time',
                  label: 'Order time',
                  children: (
                    new Date(record.createdAt).toLocaleTimeString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour12: true,
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  ),
                },
                {
                  key: 'Billing Mode',
                  label: 'Billing Mode',
                  children: <Badge status="success" text="PAID" />,
                  span: 3,
                },
                {
                  key: 'Total Amount',
                  label: 'Total Amount',
                  children: (
                    USDollar.format(record.receiptItems.reduce((previousValue, product) => previousValue + (product.quantity * product.price), 0))
                  ),
                },
                {
                  key: 'Discount',
                  label: 'Discount',
                  children: '0%',
                },
                {
                  key: 'Tax',
                  label: 'Tax',
                  children: '0%',
                },
                {
                  key: 'Customer Phone number',
                  label: 'Customer Phone number',
                  children: record.customer?.phoneNumber || '',
                },
                {
                  key: 'Customer Address',
                  label: 'Customer Address',
                  children: (
                    record.customer?.address || ''
                  ),
                },
              ];

              return (
                <Descriptions bordered title="Order Details" items={items} />
              );
            },
          }}
        />
      </Card>
    </section>
  );
};

export default SalesHistory;